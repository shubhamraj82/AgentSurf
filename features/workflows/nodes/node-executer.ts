import type {Stagehand} from "@browserbasehq/stagehand"
import type {
    ActionNodeType,
    NodeType,
} from "@/features/workflows/nodes/node-registry"
import {act} from "@/features/workflows/nodes/act"
import {extract} from "@/features/workflows/nodes/extract"
import {openUrl} from "@/features/workflows/nodes/open-url"

export type NodeContext = {
    values : Record<string,string>
    getStagehand: () => Promise<Stagehand>
}

export type NodeExecutor = (ctx:NodeContext) => Promise<unknown>

export const nodeExecutors : Partial<Record<NodeType, NodeExecutor>> = {
"open-url" : async ({values,getStagehand}) => 
    openUrl({stagehand:await getStagehand(),url:values.url}),
"act": async ({values,getStagehand}) =>
    act({stagehand:await getStagehand(),instruction:values.instruction}),
"extract": async ({values,getStagehand}) =>
    extract({stagehand:await getStagehand(),instruction:values.instruction}),
} satisfies Record<ActionNodeType,NodeExecutor>
