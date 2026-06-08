import { Router } from "express";

import { upload } from "../middleware/upload";
import { projectController } from "../controller/project";
import { validate } from "../middleware/validate";
import { createProjectSchema } from "../validators/project";
import { catchAsync } from "../utils/catchAsync";

const router = Router();

router.get("/projects", projectController.getProjects.bind(projectController));

router.get(
  "/projects/:id",
  projectController.getProjectById.bind(projectController),
);

router.post(
  "/projects/:id/analyze",
  projectController.analyzeProject.bind(projectController),
);

router.post(
  "/projects/:id/concepts",
  projectController.generateConcept.bind(projectController),
);

router.post(
  "/projects/:id/references",
  projectController.generateReference.bind(projectController),
);
router.post(
  "/projects",
  upload.single("image"),
  validate(createProjectSchema),
  catchAsync(projectController.createProject.bind(projectController)),
);
router.post(
  "/projects/:id/generate",
  projectController.generateProject.bind(projectController),
);
export default router;
