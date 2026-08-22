import type { Stagehand } from "@browserbasehq/stagehand"

export async function act({
  stagehand,
  instruction,
}: {
  stagehand: Stagehand
  instruction: string
}) {
  const result = await stagehand.act(instruction)
  const page = await stagehand.context.activePage()

  return {
    success: result.success,
    message: result.message,
    url: page ? await page.url() : "",
  }
}
