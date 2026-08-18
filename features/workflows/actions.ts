"use server"

import { auth } from "@clerk/nextjs/server"
import { runs,tasks } from "@trigger.dev/sdk"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import type { helloWorldTask } from "@/trigger/example"
import type { runWorkflowTask } from "./tasks/run-workflow"
import { liveblocks } from "@/lib/liveblocks"

import { createWorkflow, deleteWorkflow, getWorkflow, saveWorkflowGraph } from "./data"
import {WorkflowGraph} from "@/lib/db/schema"

export async function createWorkflowAction(name: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  const workflow = await createWorkflow(orgId, name)

  revalidatePath("/workflows", "layout")
  redirect(`/workflows/${workflow.id}`)
}

export async function deleteWorkflowAction(workflowId: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  const workflow = await getWorkflow(orgId, workflowId)

  if (!workflow) {
    throw new Error("Workflow not found")
  }

  await liveblocks.deleteRoom(workflow.id)
  await deleteWorkflow(orgId, workflow.id)

  revalidatePath("/workflows", "layout")
  redirect("/")
}

export async function runWorkflowAction({
  id,
  graph,
}:{
  id:string,
  graph:WorkflowGraph
}) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  await saveWorkflowGraph({ orgId, id, graph })

  const handle =  await tasks.trigger<typeof runWorkflowTask>(
    "run-workflow",
    { workflowId: id, orgId },
    {tags:[`workflow:${id}`]}
  )
  return {
    runId: handle.id,
    publicAccessToken: handle.publicAccessToken,
  }
}

export async function cancelWorkflowAction(runId: string) {
  const { orgId } = await auth()
  
  if (!orgId) {
    throw new Error("No active organization")
  }
  await runs.cancel(runId)

}
