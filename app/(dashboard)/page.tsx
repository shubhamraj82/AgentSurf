import { Plus, Workflow } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function Page() {
  return (
    <div className="flex min-h-svh bg-background">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-10 [&_svg]:size-5">
            <Workflow />
          </EmptyMedia>
          <EmptyTitle className="text-base">No workflow selected</EmptyTitle>
          <EmptyDescription className="max-w-xs text-base">
            Select a workflow from the sidebar
            <br />
            or create a new one to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="lg">
            <Plus data-icon="inline-start" />
            New workflow
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
