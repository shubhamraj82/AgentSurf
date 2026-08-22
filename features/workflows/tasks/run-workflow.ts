import toposort from "toposort"
import { logger, metadata, retry, task } from "@trigger.dev/sdk"
import { getWorkflow } from "@/features/workflows/data"
import { browserbase, Stagehand } from "@browserbasehq/stagehand"
import { nodeExecutors } from "@/features/workflows/nodes/node-executer"
import {
  interpolate,
  type WorkflowNodeOutputs,
} from "@/features/workflows/lib/interpolate"

export type RunStep = {
  nodeId: string
  status: "pending" | "running" | "done" | "failed"
}

export const runWorkflowTask = task({
  id: "run-workflow",
  retry: {
    maxAttempts: 3,
  },
  run: async ({ workflowId, orgId }: { workflowId: string; orgId: string }) => {
    const workflow = await getWorkflow(orgId, workflowId)
    if (!workflow?.graph)
      throw new Error(`Workflow ${workflowId} does not have a graph`)

    const { nodes, edges } = workflow.graph
    const byId = new Map(nodes.map((n) => [n.id, n]))

    const connected = new Set(edges.flatMap((e) => [e.source, e.target]))
    const order = toposort
      .array(
        nodes.map((n) => n.id),
        edges.map((e) => [e.source, e.target])
      )
      .filter((id) => connected.has(id))

      logger.log(`Running workflow ${workflow.name}`,{steps:order.length})

    const steps: RunStep[] = order.map((nodeId) => ({
      nodeId,
      status: "pending",
    }))
    metadata.set("steps", steps)

    const setStepStatus = (nodeId: string, status: RunStep["status"]) => {
      const step = steps.find((step) => step.nodeId === nodeId)
      if (!step) return

      step.status = status
      metadata.set("steps", steps)
    }

    logger.log(`Running workflow ${workflow.name}`, { steps: order.length })

    // The run owns one Browserbase session, opened lazily on the first browser
    // step and reused by every later one, so the recording spans the whole flow.
    let browser: Awaited<ReturnType<typeof browserbase.launch>> | undefined
    let stagehand: Stagehand | undefined
    const outputs: WorkflowNodeOutputs = {}
    const getStagehand = async () => {
      if (stagehand) return stagehand

      const browserbaseApiKey = process.env.BROWSERBASE_API_KEY
      const openaiApiKey = process.env.OPENAI_API_KEY
      if (!browserbaseApiKey) {
        throw new Error("BROWSERBASE_API_KEY is required to run browser workflows.")
      }

      stagehand = await retry.onThrow(
        async ({ attempt }) => {
          let launchedBrowser: Awaited<
            ReturnType<typeof browserbase.launch>
          > | undefined

          try {
            launchedBrowser = await browserbase.launch({
              apiKey: browserbaseApiKey,
            })
            const initializedStagehand = await Stagehand.create({
              browser: launchedBrowser,
              model: {
                modelName: "openai/gpt-5.4-mini",
                ...(openaiApiKey ? { apiKey: openaiApiKey } : {}),
              },
            })

            browser = launchedBrowser
            return initializedStagehand
          } catch (error) {
            await launchedBrowser?.close().catch(() => undefined)
            logger.warn("Browserbase connection attempt failed", {
              attempt,
              error: serializeError(error),
            })
            throw error
          }
        },
        {
          maxAttempts: 3,
          minTimeoutInMs: 1_000,
          maxTimeoutInMs: 10_000,
          randomize: true,
        }
      )

      return stagehand
    }

    try {
      for (const id of order) {
        const node = byId.get(id)
        if (!node) continue
        logger.log(`Running step: ${node.data.title}`)
        const executor = nodeExecutors[node.data.type]

        setStepStatus(id, "running")
        await metadata.flush()

        try {
          if (executor) {
            const values = Object.fromEntries(
              Object.entries(node.data.values).map(([key, value]) => [
                key,
                interpolate(value, outputs),
              ])
            )

            outputs[id] = await executor({ values, getStagehand })
          }
          setStepStatus(id, "done")
        } catch (error) {
          setStepStatus(id, "failed")
          await metadata.flush()

          throw error
        }
      }
    } finally {
      // A Browserbase session can close its CDP socket before the SDK has
      // finished its shutdown handshake. Cleanup must not turn otherwise
      // successful node results into a failed (and therefore retried) run.
      try {
        await stagehand?.close()
      } catch (error) {
        logger.warn("Stagehand cleanup failed after workflow execution", {
          error: serializeError(error),
        })
      }

      try {
        await browser?.close()
      } catch (error) {
        logger.warn("Browserbase cleanup failed after workflow execution", {
          error: serializeError(error),
        })
      }
    }

    return { steps, outputs }
  },
})

function serializeError(error: unknown):
  | string
  | {
      name: string
      message: string
      stack: string | undefined
      cause: unknown
    } {
  if (!(error instanceof Error)) return String(error)

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause instanceof Error ? serializeError(error.cause) : error.cause,
  }
}
