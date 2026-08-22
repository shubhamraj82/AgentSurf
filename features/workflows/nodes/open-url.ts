import type { Stagehand } from "@browserbasehq/stagehand"
import { getNormalizedHttpUrl } from "../lib/validate-url"

export async function openUrl({
  stagehand,
  url,
}: {
  stagehand: Stagehand
  url: string
}) {
  const page = stagehand.context.pages()[0]
  const normalizedUrl = getNormalizedHttpUrl(url)
  await page.goto(normalizedUrl, { waitUntil: "load", timeoutMs: 30_000 })

  return { url: page.url(), title: await page.title() }
}
