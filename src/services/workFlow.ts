import { projectService } from "./project";
import { CreateProjectInput } from "../types/project";

export class WorkFlowService {
  /**
   * Existing workflow for already-created projects
   */
  generateProject = async (projectId: string) => {
    await projectService.analyzeProject(projectId);

    await projectService.generateConcept(projectId);

    const reference = await projectService.generateReference(projectId);

    return reference;
  };

  /**
   * Complete workflow:
   * Upload Image
   * Create Project
   * Analyze Scene
   * Generate Concepts
   * Generate Reference Images
   */
  generateAll = async (file: Express.Multer.File, data: CreateProjectInput) => {
    console.log("[workflow] Starting generation pipeline");

    // Step 1 - Create project
    const project = await projectService.createProject(file, data);

    console.log(`[workflow] Project created successfully: ${project.id}`);

    // Step 2 - Analyze image
    const analysis = await projectService.analyzeProject(project.id);

    console.log(`[workflow] Analysis completed: ${project.id}`);

    // Step 3 - Generate concepts
    const concepts = await projectService.generateConcept(project.id);

    console.log(`[workflow] Concepts generated: ${project.id}`);

    // Step 4 - Generate reference images
    const references = await projectService.generateReference(project.id);

    console.log(`[workflow] References generated: ${project.id}`);

    // Step 5 - Fetch latest project state
    const result = await projectService.getProjectById(project.id);

    return {
      success: true,
      project: result.project,
      analysis,
      concepts,
      references: result.references,
    };
  };
}

export const workFlowService = new WorkFlowService();
