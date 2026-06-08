import { Request, Response } from "express";
import { projectService } from "../services/project";
import { workFlowService } from "../services/workFlow";

class ProjectController {
  createProject = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "image is requierd",
        });
      }

      const { title, prompt, moods } = req.body;

      const project = await projectService.createProject(req.file, {
        title,
        prompt,
        moods: JSON.parse(moods),
      });

      return res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);

      return res.status(500).json({
        message: "Failed to create project",
      });
    }
  };

  getProjects = async (req: Request, res: Response) => {
    try {
      const projects = await projectService.getProjects();

      return res.json(projects);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to fetch projects",
      });
    }
  };

  getProjectById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (Array.isArray(id)) {
        return res.status(400).json({
          message: "Invalid project id",
        });
      }

      const project = await projectService.getProjectById(id);

      return res.json(project);
    } catch (error) {
      console.error(error);

      return res.status(404).json({
        message: "Project not found",
      });
    }
  };

  analyzeProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (Array.isArray(id)) {
        return res.status(400).json({
          message: "Invalid project id",
        });
      }

      const analysis = await projectService.analyzeProject(id);
      return res.json(analysis);
    } catch (error) {
      return res.status(500).json({
        message: "Analysis failed",
      });
    }
    console.log("Analyis completed");
  };

  generateConcept = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (Array.isArray(id)) {
        return res.status(400).json({
          message: "Invalid project id",
        });
      }
      const concept = await projectService.generateConcept(id);

      return res.json(concept);
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        message: "project not found",
      });
    }
    console.log("generate concept");
  };

  generateReference = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (Array.isArray(id)) {
        return res.status(400).json({
          message: "Invalid project id",
        });
      }

      const reference = await projectService.generateReference(id);
      return res.json(reference);
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: "failed to generate image" });
    }
    console.log("generate refernces");
  };
  generateProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (Array.isArray(id)) {
        return res.status(400).json({
          message: "Invalid project id",
        });
      }

      const references = await workFlowService.generateProject(id);

      return res.json(references);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to generate project",
      });
    }
    console.log("generate project");
  };
}

export const projectController = new ProjectController();
