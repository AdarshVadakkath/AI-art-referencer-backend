import { Router } from "express";
import { upload } from "../middleware/upload";
import { imagekitService } from "../services/imagekitService";

const router = Router();

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image required",
      });
    }

    const result = await imagekitService.uploadeImage(
      req.file.buffer,
      req.file.originalname,
      "projects",
    );

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "upload failed",
    });
  }
});

export default router;
