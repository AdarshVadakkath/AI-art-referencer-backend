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
You are a senior environment concept artist.
Analyze this Blender blockout scene.

User Prompt:
${prompt ?? "None"}

Return ONLY valid JSON with NO additional explanation.
Every array must contain plain strings only, not objects.

{
  "environment": "string describing the environment",
  "materials": ["string", "string", "string"],
  "lighting": ["string", "string", "string"],
  "colorPalette": ["hex or color name", "hex or color name"],
  "composition": "string describing composition",
  "mood": "string describing mood",
  "recommendations": ["string", "string"]
}

`,
          },
        ],
      }),
    );
    console.log(response);

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
