"use client"

import {
  addEdge,
  Background,
  ConnectionLineType,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type ColorMode,
  type Connection,
  type Edge,
  NodeTypes,
} from "@xyflow/react"
import { useTheme } from "next-themes"
import { useCallback, useSyncExternalStore } from "react"

import { StepNode } from "./step-node"
import type {StepNodeType} from "../nodes/node-registry"

import "@xyflow/react/dist/style.css"

const nodeTypes:NodeTypes = {step:StepNode}

const initialNodes: StepNodeType[] = [
  {
    id:"start",
    type:"step",
    position:{x:0,y:0},
    data:{
      type:"start",
      kind:"trigger",
      title:"Start",
      values:{}},
  },
]

const initialEdges: Edge[] = []

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function Canvas() {
  const { resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  )
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const colorMode: ColorMode =
    mounted && resolvedTheme === "dark" ? "dark" : "light"
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((currentEdges) => addEdge(connection, currentEdges)),
    [setEdges]
  )

  return (
    <div className="size-full">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
