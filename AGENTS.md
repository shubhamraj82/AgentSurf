<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# Database types

Derive databse types from the Drizzle schema - never hand-write custom or partial shapes for table rows. Export `typeof table.$inferSelect` (and `$inferInsert` when needed) from `lib/schema.ts` and import it . When a customer needs  only some columns , narrow with `Pick<Row, ...>` / `Omit<Row, ...>` rather than redeclaring a literal type. Don't add an insert type where `db.insert(...).values()` already enforces the shapes.

# JSX text excaping

Escape apostrophes and quotes in JSX text content - raw `'` and `"` trip the `react/no-unescaped-entities` lint rule. Use `&apos;` for apostrophes and `&quot` for quotes (e.g. `you&apos;re`,`does&apos;t`). This applies only to literal text between JSX tags, not to string attribute values or JS strings.