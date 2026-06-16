import { gemini } from "../config/gemini";
import { SceneAnalysis, SceneAnalysisSchema } from "../types/analysis";
import { imageUrlToBase64 } from "../utils/image";
import { retryWithBackoff } from "../utils/retryWithBackoff";

export class GeminiService {
  analyzeScene = async (
    imageUrl: string,
    prompt?: string,
  ): Promise<SceneAnalysis> => {
    const imageBase64 = await imageUrlToBase64(imageUrl);

    const response = await retryWithBackoff(() =>
      gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: "image/png",
              data: imageBase64,
            },
          },
          {
            text: `
You are a Senior Environment Art Director and Concept Supervisor.

Analyze the uploaded image.

The image is a blockout, clay render, graybox, proxy render, or unfinished environment.

IMPORTANT:

DO NOT redesign the scene.

DO NOT imagine missing structures.

DO NOT invent gameplay elements.

Only describe what is visible.

Your job is to identify all visual information that must be preserved during image-to-image generation.

USER PROMPT:
${prompt ?? "None"}

Return ONLY valid JSON matching this schema:
{
  "environment": "string describing the environment type (e.g. indoor, outdoor, sci-fi, urban, nature, fantasy)",
  "cameraAngle": "string describing the camera angle (e.g. low angle, eye level, high angle, top-down)",
  "cameraHeight": "string describing the camera height (e.g. ground level, shoulder height, elevated)",
  "perspectiveType": "string describing the perspective (e.g. 1-point, 2-point, 3-point, isometric, panoramic)",
  "focalDirection": "string describing the direction of focus / looking direction",
  "layoutDescription": "string describing the composition structure and key components (foreground, midground, background)",
  "dominantStructures": [
    "list of major buildings, shapes, or elements that dominate the layout"
  ],
  "mustPreserve": [
    "specific constraints or rules on what must remain exact"
  ],
  "materials": [
    "list of suggested surface materials/textures visible or appropriate"
  ],
  "lighting": [
    "list of suggested light sources and types"
  ],
  "colorPalette": [
    "list of suggested color tones and accents"
  ],
  "composition": "string describing the composition rule (e.g. leading lines, rule of thirds)",
  "mood": "string describing the atmosphere or story mood",
  "recommendations": [
    "suggestions for stylization and detailing"
  ]
}
`,
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              environment: { type: "STRING" },
              cameraAngle: { type: "STRING" },
              cameraHeight: { type: "STRING" },
              perspectiveType: { type: "STRING" },
              focalDirection: { type: "STRING" },
              layoutDescription: { type: "STRING" },
              dominantStructures: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              mustPreserve: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              materials: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              lighting: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              colorPalette: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              composition: { type: "STRING" },
              mood: { type: "STRING" },
              recommendations: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
            },
            required: [
              "environment",
              "cameraAngle",
              "cameraHeight",
              "perspectiveType",
              "focalDirection",
              "layoutDescription",
              "dominantStructures",
              "mustPreserve",
              "materials",
              "lighting",
              "colorPalette",
              "composition",
              "mood",
              "recommendations",
            ],
          },
        },
      }),
    );

    const text = response.text ?? "";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return SceneAnalysisSchema.parse(parsed);
  };
}

export const geminiService = new GeminiService();
