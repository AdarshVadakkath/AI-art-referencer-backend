import { projectService } from "./project";

export class WorkFlowService {
  generateProject = async (projectId: string) => {
    await projectService.analyzeProject(projectId);

    const reference = await projectService.generateReference(projectId);

    return reference;
  };
}

export const workFlowService = new WorkFlowService();
