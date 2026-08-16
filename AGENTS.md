<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# React Flow documentation

Do not rely on training data when using React Flow APIs, components, hooks, types, configuration, or usage patterns. Before writing or changing React Flow code, search the current official documentation index at https://reactflow.dev/llms.txt and consult the relevant linked documentation pages.


# Database types

Derive databse types from the Drizzle schema - never hand-write custom or partial shapes for table rows. Export `typeof table.$inferSelect` (and `$inferInsert` when needed) from `lib/schema.ts` and import it . When a customer needs  only some columns , narrow with `Pick<Row, ...>` / `Omit<Row, ...>` rather than redeclaring a literal type. Don't add an insert type where `db.insert(...).values()` already enforces the shapes.

# JSX text excaping

Escape apostrophes and quotes in JSX text content - raw `'` and `"` trip the `react/no-unescaped-entities` lint rule. Use `&apos;` for apostrophes and `&quot` for quotes (e.g. `you&apos;re`,`does&apos;t`). This applies only to literal text between JSX tags, not to string attribute values or JS strings.

<!-- TRIGGER.DEV SKILLS START -->
## Trigger.dev agent skills

This project has Trigger.dev agent skills installed in `.agents/skills/`. Before writing or changing Trigger.dev code (background tasks, scheduled tasks, realtime, or chat.agent AI agents), load the most relevant skill: `trigger-authoring-tasks`, `trigger-chat-agent-advanced`, `trigger-authoring-chat-agent`, `trigger-cost-savings`, `trigger-getting-started`, `trigger-realtime-and-frontend`.
<!-- TRIGGER.DEV SKILLS END -->
