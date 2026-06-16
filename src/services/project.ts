import { imagekitService } from "./imagekitService";
import { projectRepository } from "../repositories/project";
import { CreateProjectInput } from "../types/project";
import { referenceRepository } from "../repositories/reference";
import { projectController } from "../controller/project";
import { conceptService } from "./concept";
import { geminiService } from "./gemini";
import {
  imageGenerationService,
  ImageGenerationService,
} from "./imageGenearation";

class ProjectService {
  createProject = async (
    file: Express.Multer.File,
    data: CreateProjectInput,
  ) => {
    const uploadeImage = await imagekitService.uploadeImage(
      file.buffer,
      file.originalname,
      "projects",
    );

    const project = await projectRepository.create({
      title: data.title,
      originalImageUrl: uploadeImage.url,
      userPrompt: data.prompt,
      selectMoods: data.moods,
      status: "pending",
    });

    return project;
  };

  getProjects = async () => {
    return await projectRepository.findAll();
  };

  getProjectById = async (id: string) => {
    const project = await projectRepository.findById(id);

    if (!project) {
      throw new Error("Project not found");
    }

    const references = await referenceRepository.findByProjectId(id);

    return {
      project,
      references,
    };
  };

  analyzeProject = async (projectId: string) => {
    const project = await projectRepository.findById(projectId);

    if (!project) {
      throw new Error("project not found");
    }

    await projectRepository.updateStatus(projectId, "analyzing");

    try {
      const analysis = await geminiService.analyzeScene(
        project.originalImageUrl,
        project.userPrompt ?? undefined,
      );

      await projectRepository.updateAnalysis(projectId, analysis);

      await projectRepository.updateStatus(projectId, "generating");

      return analysis;
    } catch (error) {
      await projectRepository.updateError(projectId, "Gemini analysis failed");

      throw error;
    }
  };

  generateConcept = async (projectId: string) => {
    const project = await projectRepository.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (!project.analysis) {
      throw new Error("Analysis not found");
    }

    return await conceptService.generateConcepts(project.analysis as any);
  };

  generateReference = async (projectId: string) => {
    const project = await projectRepository.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (!project.analysis) {
      throw new Error("Analysis not found");
    }

    const concepts = await conceptService.generateConcepts(
      project.analysis as any,
    );

    if (!concepts.length) {
      throw new Error("No concepts generated");
    }

    const concept = concepts[0];

    const imageBase64 = await imageGenerationService.generateImage(
      concept.prompt,
    );

    console.log("Base64 length:", imageBase64.length);

    const uploadedImage = await imagekitService.uploadBase64Image(
      imageBase64,
      `${concept.name}.png`,
      "references",
    );

    const reference = await referenceRepository.create({
      projectId,
      conceptName: concept.name,
      conceptPrompt: concept.prompt,
      imageUrl: uploadedImage.url,
    });

    await projectRepository.updateStatus(projectId, "completed");

    return [reference];
  };
}

export const projectService = new ProjectService();
