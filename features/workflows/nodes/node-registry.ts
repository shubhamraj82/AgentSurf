import { Globe, LucideIcon, MousePointer2, MousePointerClick, Search } from "lucide-react"
import type {Node} from "@xyflow/react"


export type StepNodeKind = "trigger" | "action"

//One editable feild on a node , rendered as a input in the inspector later.
export type NodeField ={
    key:string,
    label:string,
    placeholder?:string,
    multiline?:boolean,
    required?:boolean
} 

export type NodeOutput ={
    path:string
    label:string
}

// A node type's manifest entry. Add a node by adding an entry to nodeRegistry.
export type NodeDefinition={
    type:string,
    kind:StepNodeKind,
    label:string
    icon:LucideIcon,
    accent:string
    fields:NodeField[]
    outputs?:NodeOutput[]
}

export const nodeRegistry={
    start:{
        type:"start",
        kind:"trigger",
        label:"Start",
        icon:MousePointerClick,
        accent:"bg-blue-500 text-white",
        fields:[],
        outputs:[]
    },
    "open-url":{
        type:"open-url",
        kind:"action",
        label:"Open URL",
        icon: Globe,
        accent:"bg-emerald-500 text-white",
        fields: [{key:"url",label:"URL",placeholder:"https://youtube.com",required:true}],
        outputs:[
            {path:"url",label:"URL"},
            {path:"title",label:"Title"},
        ],
    },
    "act": {
        type:"act",
        kind:"action",
        label:"Act",
        icon:MousePointer2,
        accent:"bg-violet-500 text-white",
        fields:[
            {
                key:"instruction",
                label:"Instruction",
                placeholder:"Click the sign in button",
                multiline:true,
                required:true,
            },
        ],
        outputs:[
            {path:"success",label:"Succeeded"},
            {path:"message",label:"Message"},
            {path:"url",label:"URL"},
        ],
    },
    "extract": {
        type:"extract",
        kind:"action",
        label:"Extract",
        icon:Search,
        accent:"bg-amber-500 text-white",
        fields:[
            {
                key:"instruction",
                label:"Instruction",
                placeholder:"Extract the price of the first product",
                multiline:true,
                required:true,
            },
        ],
        outputs:[
            {path:"extraction",label:"Extracted data"},
        ],
    },
} satisfies Record<string,NodeDefinition>

export type NodeType = keyof typeof nodeRegistry 

//Plain JSON only (synced through Liveblocks later). type keys into the registry:
//kind and title re denormalized ao the server can read them without the registry.
export type StepNodeData={
    type:NodeType,
    kind:StepNodeKind,
    title:string,
    values:Record<string,string>
}

export type StepNodeType = Node<StepNodeData,"step"> 

export type ActionNodeType = {
    [K in NodeType]: (typeof nodeRegistry[K]["kind"] extends "action" ? K:never)
}[NodeType]
