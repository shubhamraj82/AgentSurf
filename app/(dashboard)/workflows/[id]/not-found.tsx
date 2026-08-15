import { FileQuestion } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NotFound() {
  return (
    <div className="flex min-h-svh bg-background">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-10 [&_svg]:size-5">
            <FileQuestion />
          </EmptyMedia>
          <EmptyTitle className="text-base">Workflow not found</EmptyTitle>
          <EmptyDescription className="max-w-xs text-base">
            This workflow doesn&apos;t exist or may have been removed.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
