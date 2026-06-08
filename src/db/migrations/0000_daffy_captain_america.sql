CREATE TYPE "public"."project_status" AS ENUM('pending', 'analyzing', 'generating', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"originalImageUrl" text NOT NULL,
	"userPrompt" text,
	"selectMoods" text[] NOT NULL,
	"status" "project_status" DEFAULT 'pending' NOT NULL,
	"analysis" jsonb,
	"error_message" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reference" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"concept_name" text NOT NULL,
	"concept_prompt" text NOT NULL,
	"image_url" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reference" ADD CONSTRAINT "reference_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;