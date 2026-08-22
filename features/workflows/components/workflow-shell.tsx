"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import type { Edge, OnConnect } from "@xyflow/react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import { Canvas } from "@/features/workflows/components/canvas"
import { RightSidebar } from "@/features/workflows/components/right-sidebar"
import {
  nodeRegistry,
  type StepNodeType,
} from "@/features/workflows/nodes/node-registry"

const initialNodes: StepNodeType[] = [
  {
    id: "start",
    type: "step",
    position: { x: 0, y: 0 },
    data: {
      type: "start",
      kind: "trigger",
      title: "Start",
      values: {},
    },
  },
]

const initialEdges: Edge[] = []

interface WorkflowShellProps {
  workflowId: string
}

export function WorkflowShell({ workflowId }: WorkflowShellProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<StepNodeType, Edge>({
      suspense: true,
      nodes: { initial: initialNodes },
      edges: { initial: initialEdges },
    })
  const handleConnect: OnConnect = (connection) => {
    onConnect(connection)

    const sourceNode = nodes.find((node) => node.id === connection.source)
    const targetNode = nodes.find((node) => node.id === connection.target)

    if (!sourceNode || !targetNode) {
      return
    }

    const sourceOutputs = nodeRegistry[sourceNode.data.type].outputs ?? []
    const targetFields = nodeRegistry[targetNode.data.type].fields
    const matchingOutput = sourceOutputs.find((output) =>
      targetFields.some((field) => field.key === output.path)
    )

    if (!matchingOutput) {
      return
    }

    const targetField = targetFields.find(
      (field) => field.key === matchingOutput.path
    )

    if (!targetField) {
      return
    }

    onNodesChange([
      {
        type: "replace",
        id: targetNode.id,
        item: {
          ...targetNode,
          data: {
            ...targetNode.data,
            values: {
              ...targetNode.data.values,
              [targetField.key]: `{{ ${sourceNode.id}.${matchingOutput.path} }}`,
            },
          },
        },
      },
    ])
  }

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="size-full"
      data-workflow-id={workflowId}
    >
      <ResizablePanel minSize="30rem">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel minSize="18rem">
            <Canvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={handleConnect}
              onDelete={onDelete}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="8rem" minSize="6rem">
            <div className="flex size-full items-center justify-center">
              Logs
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="16rem" minSize="14rem" maxSize="36rem">
        <RightSidebar workflowId={workflowId} onNodesChange={onNodesChange} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
