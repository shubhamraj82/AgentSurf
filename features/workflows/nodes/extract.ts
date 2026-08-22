import type { Stagehand } from "@browserbasehq/stagehand"
import { logger } from "@trigger.dev/sdk"

export async function extract({
  stagehand,
  instruction,
}: {
  stagehand: Stagehand
  instruction: string
}) {
  const result = await stagehand.extract(instruction)

  logger.log("Extraction completed", {
    instruction,
    extraction: result.data.extraction,
  })

  return { extraction: result.data.extraction }
}
