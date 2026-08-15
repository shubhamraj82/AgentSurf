"use client"

import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function ErrorPage({
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <div className="flex min-h-svh bg-background">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-10 [&_svg]:size-5">
            <CircleAlert />
          </EmptyMedia>
          <EmptyTitle className="text-base">Something went wrong</EmptyTitle>
          <EmptyDescription className="max-w-xs text-base">
            We couldn&apos;t load this workflow. Please try again.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="lg" onClick={unstable_retry}>
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
