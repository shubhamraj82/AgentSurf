import toposort from "toposort"
import type { WorkflowGraph } from "@/lib/db/schema"
import { nodeRegistry } from "@/features/workflows/nodes/node-registry"

export function validateGraph({ nodes, edges }: WorkflowGraph): string[] {
  const problems: string[] = []
  const triggers = nodes.filter((n) => n.data.kind === "trigger").length
  if (triggers !== 1) {
    problems.push(
      `A workflow must have exactly one trigger, but (${triggers} found)`
    )
  }
  for (const node of nodes) {
    const definition = nodeRegistry[node.data.type]
    for (const field of definition.fields) {
      if (field.required && !node.data.values[field.key]?.trim()) {
        problems.push(`${node.data.title}: ${field.label} is required.`)
      }
    }
  }
  if (edges.length === 0) {
    problems.push("Connect your nodes before running.")
  } else {
    try {
      toposort(edges.map((e) => [e.source, e.target]))
    } catch {
      problems.push("Workflow has a cycle - remove the loop before running.")
    }
  }
  return problems
}
