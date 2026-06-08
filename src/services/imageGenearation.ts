import { gemini } from "../config/gemini";
import { retryWithBackoff } from "../utils/retryWithBackoff";

export class ImageGenerationService {
  generateImage = async (prompt: string): Promise<string> => {
    const response = await retryWithBackoff(() =>
      gemini.models.generateContent({
        model: "gemini-3.1-flash-image",

        contents: prompt,
      }),
    );

    const part = response.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData,
    );

    if (!part?.inlineData?.data) {
      throw new Error("Failed to generate image");
    }

    return part.inlineData.data;
  };
}

export const imageGenerationService = new ImageGenerationService();
