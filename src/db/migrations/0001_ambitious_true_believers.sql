ALTER TABLE "reference" RENAME TO "references";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "originalImageUrl" TO "original_image_url";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "userPrompt" TO "user_prompt";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "selectMoods" TO "select_moods";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "references" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "references" DROP CONSTRAINT "reference_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "references" ADD CONSTRAINT "references_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;