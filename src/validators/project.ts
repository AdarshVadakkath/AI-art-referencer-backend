import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string(),
  prompt: z.string().optional(),

  moods: z.preprocess((value) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  }, z.array(z.string())),
});
