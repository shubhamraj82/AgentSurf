import type { Stagehand } from "@browserbasehq/stagehand"

function normalizeUrl(value: string): string {
  const trimmed = value.trim()

  if (!trimmed) {
    throw new Error("Open URL requires a URL.")
  }

  const withProtocol = /^[a-z][a-z\d+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  let url: URL
  try {
    url = new URL(withProtocol)
  } catch {
    throw new Error(`Open URL received an invalid URL: ${value}`)
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Open URL only supports http and https URLs.")
  }

  return url.toString()
}

export async function openUrl({
  stagehand,
  url,
}: {
  stagehand: Stagehand
  url: string
}) {
  const page = stagehand.context.pages()[0]
  const normalizedUrl = normalizeUrl(url)
  await page.goto(normalizedUrl, { waitUntil: "load", timeoutMs: 30_000 })

  return { url: page.url(), title: await page.title() }
}
