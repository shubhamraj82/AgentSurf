"use client"

import {
  Background,
  ConnectionLineType,
  Controls,
  MiniMap,
  ReactFlow,
  type ColorMode,
  type Edge,
  type OnConnect,
  type OnDelete,
  type OnEdgesChange,
  type OnNodesChange,
  NodeTypes,
  Panel,
} from "@xyflow/react"
import { Cursors } from "@liveblocks/react-flow"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"
import { AvatarStack } from "@liveblocks/react-ui"

import { StepNode } from "./step-node"
import type { StepNodeType } from "../nodes/node-registry"

import "@xyflow/react/dist/style.css"
import "@liveblocks/react-ui/styles.css"
import "@liveblocks/react-flow/styles.css"

const nodeTypes: NodeTypes = { step: StepNode }

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function Canvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDelete,
}: {
  nodes: StepNodeType[]
  edges: Edge[]
  onNodesChange: OnNodesChange<StepNodeType>
  onEdgesChange: OnEdgesChange<Edge>
  onConnect: OnConnect
  onDelete: OnDelete<StepNodeType, Edge>
}) {
  const { resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  )
  const colorMode: ColorMode =
    mounted && resolvedTheme === "dark" ? "dark" : "light"

  return (
    <div id="workflow-canvas" className="size-full">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        colorMode={colorMode}
        fitView
        maxZoom={1}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{ stroke: "var(--border)" }}
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { stroke: "var(--border)" },
        }}
        style={
          {
            "--xy-background-color": "var(--background)",
            "--xy-edges-stroke-width": 2,
            "--xy-connectionline-stroke-width": 2,
          } as React.CSSProperties
        }
      >
        <Background />
        <Controls />
        <Cursors />
        <Panel position="top-right">
          <AvatarStack />
        </Panel>
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
