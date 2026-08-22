import toposort from "toposort"
import { AbortTaskRunError, logger, task } from "@trigger.dev/sdk"
import { getWorkflow } from "@/features/workflows/data"
import { Stagehand } from "@browserbasehq/stagehand"
import { nodeExecutors } from "@/features/workflows/nodes/node-executer"
import {
  interpolate,
  type WorkflowNodeOutputs,
} from "@/features/workflows/lib/interpolate"

export const runWorkflowTask = task({
  id: "run-workflow",
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

    logger.log(`Running workflow ${workflow.name}`, { steps: order.length })

    // The run owns one Browserbase session , opened lazily on the fist browser step
    // and reused by every later one , so the recording spans the whole flow. The
    // LLM routes through Browserbase's model Gateway (BROWSERBASE_API_KEY), so no
    // Seprate provider key is needed
    let stagehand: Stagehand | undefined
    const outputs: WorkflowNodeOutputs = {}
    const getStagehand = async () => {
      if (stagehand) return stagehand

      stagehand = new Stagehand({
        env: "BROWSERBASE",
        apiKey: process.env.BROWSERBASE_API_KEY!,
        model: "openai/gpt-5.4-mini",
        disablePino: true,
      })
      await stagehand.init()

      return stagehand
    }

    try {
      for (const id of order) {
        const node = byId.get(id)
        if (!node) continue
        logger.log(`Running step: ${node.data.title}`)
        const executor = nodeExecutors[node.data.type]
        if (executor) {
          const values = Object.fromEntries(
            Object.entries(node.data.values).map(([key, value]) => [
              key,
              interpolate(value, outputs),
            ])
          )

          try {
            outputs[id] = await executor({ values, getStagehand })
          } catch (error) {
            if (
              error instanceof Error &&
              error.message.startsWith("Open URL")
            ) {
              throw new AbortTaskRunError(error.message)
            }

            throw error
          }
        }
      }
    } finally {
      await stagehand?.close()
    }

    return { steps: order.length }
  },
})
