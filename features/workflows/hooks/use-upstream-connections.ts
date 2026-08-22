"use client"

import { useMemo } from "react"
import { getIncomers, useEdges, useNodes } from "@xyflow/react"
import {
  nodeRegistry,
  type NodeType,
  type StepNodeType,
} from "@/features/workflows/nodes/node-registry"

export type UpstreamConnection = {
  token: string
  label: string
  sourceNodeType: NodeType
}

/**
 * Returns insertable output tokens from every node that can reach `node`.
 */
export function useUpstreamConnections(
  node: StepNodeType | undefined
): UpstreamConnection[] {
  const nodes = useNodes<StepNodeType>()
  const edges = useEdges()

  return useMemo(() => {
    if (!node) {
      return []
    }

    const visited = new Set([node.id])
    const upstreamNodes: StepNodeType[] = []
    const nodesToVisit = [node]

    while (nodesToVisit.length > 0) {
      const current = nodesToVisit.shift()

      if (!current) {
        continue
      }

      for (const upstreamNode of getIncomers(current, nodes, edges)) {
        if (visited.has(upstreamNode.id)) {
          continue
        }

        visited.add(upstreamNode.id)
        upstreamNodes.push(upstreamNode)
        nodesToVisit.push(upstreamNode)
      }
    }

    return upstreamNodes.flatMap((upstreamNode) => {
      const definition = nodeRegistry[upstreamNode.data.type]

      return (definition.outputs ?? []).map((output) => ({
        token: `{{ ${upstreamNode.id}.${output.path} }}`,
        label: `${upstreamNode.data.title} - ${output.label}`,
        sourceNodeType: upstreamNode.data.type,
      }))
    })
  }, [edges, node, nodes])
}
