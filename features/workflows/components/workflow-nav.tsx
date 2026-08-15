"use client"

import { Plus, Workflow as WorkflowIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTransition } from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { generateSlug } from "@/features/workflows/lib/generate-slug"
import type { Workflow } from "@/lib/db/schema"

interface WorkflowNavProps {
  workflows: Workflow[]
  onCreateWorkflow: (name: string) => Promise<void>
}

export function WorkflowNav({ workflows, onCreateWorkflow }: WorkflowNavProps) {
  const { state } = useSidebar()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function handleCreateWorkflow() {
    startTransition(async () => {
      await onCreateWorkflow(generateSlug())
    })
  }

  if (state === "collapsed") {
    return (
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton>
                  <WorkflowIcon />
                  <span>Workflows</span>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent side="right" align="start">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      disabled={isPending}
                      onClick={handleCreateWorkflow}
                    >
                      <Plus />
                      <span>New workflow</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                <SidebarSeparator />
                <SidebarMenu>
                  {workflows.map((workflow) => (
                    <SidebarMenuItem key={workflow.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/workflows/${workflow.id}`}
                      >
                        <Link href={`/workflows/${workflow.id}`}>
                          <span>{workflow.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup className="pt-2">
      <SidebarGroupLabel className="h-7 px-2 text-[11px]">
        Workflows
      </SidebarGroupLabel>
      <SidebarGroupAction
        aria-label="Create workflow"
        title="Create workflow"
        disabled={isPending}
        onClick={handleCreateWorkflow}
      >
        <Plus />
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {workflows.map((workflow) => (
            <SidebarMenuItem key={workflow.id}>
              <SidebarMenuButton
                asChild
                isActive={pathname === `/workflows/${workflow.id}`}
                size="sm"
                className="h-7 px-2 text-xs"
              >
                <Link href={`/workflows/${workflow.id}`}>
                  <span>{workflow.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
