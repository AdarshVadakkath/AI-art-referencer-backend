import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

export class ImageGenerationService {
  generateImage = async (prompt: string): Promise<string> => {
    console.log("Starting image generation with FLUX...");

    const imageBlob = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
    }) as any;

    const arrayBuffer = await imageBlob.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    console.log("Image generated successfully.");

    return buffer.toString("base64");
  };
}

export const imageGenerationService = new ImageGenerationService();
