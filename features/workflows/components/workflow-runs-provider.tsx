"use client"

import { useRealtimeRunsWithTag } from "@trigger.dev/react-hooks"
import { createContext, useContext, useMemo, type ReactNode } from "react"
import type { runWorkflowTask, RunStep } from "../tasks/run-workflow"

type LatestRunSteps = {
  steps: RunStep[] | undefined
  isLive: boolean
}

const LatestRunStepsContext = createContext<LatestRunSteps | undefined>(
  undefined
)

function getRunSteps(value: unknown): RunStep[] | undefined {
  if (!Array.isArray(value)) return undefined

  return value.every(
    (step) =>
      typeof step === "object" &&
      step !== null &&
      typeof step.nodeId === "string" &&
      ["pending", "running", "done", "failed"].includes(step.status)
  )
    ? (value as RunStep[])
    : undefined
}

export function WorkflowRunsProvider({
  workflowId,
  publicAccessToken,
  children,
}: {
  workflowId: string
  publicAccessToken: string
  children: ReactNode
}) {
  const { runs } = useRealtimeRunsWithTag<typeof runWorkflowTask>(
    `workflow:${workflowId}`,
    { accessToken: publicAccessToken }
  )

  const value = useMemo<LatestRunSteps>(() => {
    const latestRun = runs.reduce<(typeof runs)[number] | undefined>(
      (latest, run) =>
        !latest || run.createdAt > latest.createdAt ? run : latest,
      undefined
    )

    return {
      steps:
        latestRun?.output?.steps ?? getRunSteps(latestRun?.metadata?.steps),
      isLive:
        latestRun?.status === "QUEUED" || latestRun?.status === "EXECUTING",
    }
  }, [runs])

  return (
    <LatestRunStepsContext.Provider value={value}>
      {children}
    </LatestRunStepsContext.Provider>
  )
}

export function useLatestRunSteps(): LatestRunSteps {
  const value = useContext(LatestRunStepsContext)

  if (!value) {
    throw new Error(
      "useLatestRunSteps must be used within a WorkflowRunsProvider"
    )
  }

  return value
}
