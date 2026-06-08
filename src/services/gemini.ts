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
        model: "gemini-3.1-flash-image",

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

Return ONLY valid JSON.

{
  "environment": "",
  "materials": [],
  "lighting": [],
  "colorPalette": [],
  "composition": "",
  "mood": "",
  "recommendations": []
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
