import { imagekit } from "../config/imagekit";

class ImageKitService {
  uploadeImage = async (
    fileBuffer: Buffer,
    fileName: string,
    folder: string,
  ) => {
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName,
      folder,
      useUniqueFileName: true,
    });

    return response;
  };

  getVariants = (url: string) => ({
    landscape: `${url}?tr=w-1920,h-1080`,
    portrait: `${url}?tr=w-1080,h-1920`,
  });

  uploadBase64Image = async (
    imageBase64: string,
    fileName: string,
    folder: string,
  ) => {
    return await imagekit.upload({
      file: imageBase64,
      fileName,
      folder,
      useUniqueFileName: true,
    });
  };
}

export const imagekitService = new ImageKitService();
