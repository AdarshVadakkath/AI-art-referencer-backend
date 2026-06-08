import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const projectStatusEnum = pgEnum("project_status", [
  "pending",
  "analyzing",
  "generating",
  "completed",
  "failed",
]);

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  originalImageUrl: text("original_image_url").notNull(),
  userPrompt: text("user_prompt"),
  selectMoods: text("select_moods").array().notNull(),
  status: projectStatusEnum("status").default("pending").notNull(),
  analysis: jsonb("analysis"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
