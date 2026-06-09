import { z } from "zod";

const coercedString = z
  .unknown()
  .transform((val) => (typeof val === "string" ? val : JSON.stringify(val)));

export const SceneAnalysisSchema = z.object({
  environment: z.string(),
  materials: z.array(coercedString),
  lighting: z.array(coercedString),
  colorPalette: z.array(coercedString),
  composition: z.string(),
  mood: z.string(),
  recommendations: z.array(coercedString),
});

export type SceneAnalysis = z.infer<typeof SceneAnalysisSchema>;
