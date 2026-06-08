import { z } from "zod";

export const SceneAnalysisSchema = z.object({
  environment: z.string(),

  materials: z.array(z.string()),

  lighting: z.array(z.string()),

  colorPalette: z.array(z.string()),

  composition: z.string(),

  mood: z.string(),

  recommendations: z.array(z.string()),
});

export type SceneAnalysis = z.infer<typeof SceneAnalysisSchema>;
