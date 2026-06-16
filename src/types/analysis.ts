import { z } from "zod";

export const SceneAnalysisSchema = z.object({
  environment: z.string(),

  cameraAngle: z.string(),
  cameraHeight: z.string(),
  perspectiveType: z.string(),
  focalDirection: z.string(),

  layoutDescription: z.string(),

  dominantStructures: z.array(z.string()),

  mustPreserve: z.array(z.string()),

  materials: z.array(z.string()),
  lighting: z.array(z.string()),
  colorPalette: z.array(z.string()),

  composition: z.string(),
  mood: z.string(),

  recommendations: z.array(z.string()),
});

export type SceneAnalysis = z.infer<typeof SceneAnalysisSchema>;
