import { Router } from "express";
import { projectRepository } from "../repositories/project";

const router = Router();

router.get("/test-project", async (_req, res) => {
  const project = await projectRepository.create({
    title: "Castle Scene",
    originalImageUrl: "test.jpg",
    selectMoods: ["fantasy"],
  });

  res.json(project);
});

export default router;
