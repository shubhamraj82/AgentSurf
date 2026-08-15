"use client"

import { useRealtimeRun } from "@trigger.dev/react-hooks"
import {
  CircleAlertIcon,
  CircleCheckIcon,
  LoaderCircleIcon,
  PlayIcon,
} from "lucide-react"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { runWorkflowAction } from "@/features/workflows/actions"
import type { helloWorldTask } from "@/trigger/example"

type RunSubscription = Awaited<ReturnType<typeof runWorkflowAction>>

const failedStatuses = new Set([
  "CANCELED",
  "FAILED",
  "CRASHED",
  "SYSTEM_FAILURE",
  "EXPIRED",
  "TIMED_OUT",
])

export function RightSidebar() {
  const [subscription, setSubscription] = useState<RunSubscription>()
  const [actionError, setActionError] = useState<string>()
  const [isPending, startTransition] = useTransition()
  const { run, error: realtimeError } = useRealtimeRun<typeof helloWorldTask>(
    subscription?.runId,
    {
      accessToken: subscription?.publicAccessToken,
      enabled: Boolean(subscription),
    }
  )

  const isComplete = run?.status === "COMPLETED"
  const hasFailed = run ? failedStatuses.has(run.status) : false

  function onRun() {
    startTransition(async () => {
      setActionError(undefined)

      try {
        setSubscription(await runWorkflowAction())
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "Unable to start the workflow"
        )
      }
    })
  }

  return (
    <div className="flex size-full flex-col items-center justify-center gap-3">
      <Button onClick={onRun} disabled={isPending}>
        {isPending ? (
          <LoaderCircleIcon className="animate-spin" data-icon="inline-start" />
        ) : (
          <PlayIcon data-icon="inline-start" />
        )}
        {isPending ? "Starting..." : "Run"}
      </Button>

      {run && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {isComplete ? (
            <CircleCheckIcon className="size-4 text-green-600" />
          ) : hasFailed ? (
            <CircleAlertIcon className="size-4 text-destructive" />
          ) : (
            <LoaderCircleIcon className="size-4 animate-spin" />
          )}
          <span>{run.status.toLowerCase().replaceAll("_", " ")}</span>
        </div>
      )}

      {isComplete && run.output?.message && (
        <p className="text-sm text-muted-foreground">{run.output.message}</p>
      )}

      {(actionError || realtimeError) && (
        <p role="alert" className="text-sm text-destructive">
          {actionError ?? realtimeError?.message}
        </p>
      )}
    </div>
  )
}
