import { gemini } from "../config/gemini";
import { retryWithBackoff } from "../utils/retryWithBackoff";

export class ImageGenerationService {
  generateImage = async (prompt: string): Promise<string> => {
    console.log("Starting image generation...");

    const response = await retryWithBackoff(() =>
      gemini.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
        config: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      }),
    );

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((part: any) => part.inlineData?.data);

    if (!imagePart?.inlineData?.data) {
      const textPart = parts.find((part: any) => part.text);
      console.log("No image returned. Text response:", textPart?.text);
      throw new Error("Model returned text instead of image");
    }

    console.log("Image generated successfully.");
    return imagePart.inlineData.data;
  };
}

export const imageGenerationService = new ImageGenerationService();
