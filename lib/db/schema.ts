// Define Drizzle tables in this module and generate migrations with `npm run db:generate`.

import { pgTable,jsonb,text,timestamp,uuid } from "drizzle-orm/pg-core";

export const workflows=pgTable("workflows",{
    id:uuid("id").primaryKey().defaultRandom(),
    orgId:text("org_id").notNull(),
    name:text("name").notNull(),
    graph:jsonb("graph"),
    createdAt:timestamp("created_at",{mode:"date"}).defaultNow().notNull(),
    updatedAt:timestamp("updated_at",{mode:"date"}).defaultNow().notNull(),
})

export type Workflow = typeof workflows.$inferSelect
