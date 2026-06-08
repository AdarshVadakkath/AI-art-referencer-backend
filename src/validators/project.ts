import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  prompt: z.string().optional(),

  moods: z.array(z.string()).min(1, "At least one mood is required"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
