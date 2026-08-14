import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { WorkflowNav } from "@/features/workflows/components/workflow-nav"

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-12 min-w-0 flex-row items-center justify-between overflow-hidden border-b border-sidebar-border/50 px-3 group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
        <div className="min-w-0 overflow-hidden group-data-[collapsible=icon]:hidden">
          <OrganizationSwitcher
            hidePersonal
            appearance={{
              elements: {
                rootBox: "w-full",
                organizationSwitcherTrigger:
                  "w-full min-w-0 justify-start gap-2 border-0 bg-transparent p-0 shadow-none hover:bg-transparent",
                organizationPreview: "min-w-0",
                organizationPreviewTextContainer: "min-w-0",
                organizationPreviewMainIdentifier: "truncate text-xs font-medium",
              },
            }}
          />
        </div>
        <SidebarTrigger className="flex shrink-0 group-data-[collapsible=icon]:flex!" />
      </SidebarHeader>

      <SidebarContent>
        <WorkflowNav />
      </SidebarContent>

      <SidebarFooter className="items-start px-3 py-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
        <UserButton 
        appearance={{
          elements:{
            rootBox:"w-full",
            userButtonTrigger:"w-full justify-start group-data-[collapsible=icon]:justify-center",
            userButtonIdentifier:"group-data-[collapsible=icon]:hidden",
          }
        }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
