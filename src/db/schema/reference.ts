import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

import { projects } from "./project";

export const reference = pgTable("references", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
    }),

  conceptName: text("concept_name").notNull(),
  conceptPrompt: text("concept_prompt").notNull(),
  imageUrl: text("image_url").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
