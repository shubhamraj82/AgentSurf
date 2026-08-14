import { loadEnvConfig } from "@next/env"
import { defineConfig } from "drizzle-kit"

loadEnvConfig(process.cwd())

const migrationUrl = process.env.DATABASE_URL_UNPOOLED

if (!migrationUrl) {
  throw new Error("DATABASE_URL_UNPOOLED is required to run Drizzle Kit")
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: migrationUrl,
  },
})
