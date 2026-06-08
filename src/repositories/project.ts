import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { projects } from "../db/schema";

class ProjectRepository {
  create = async (data: typeof projects.$inferInsert) => {
    return (await db.insert(projects).values(data).returning())[0];
  };

  findById = async (id: string) => {
    return (await db.select().from(projects).where(eq(projects.id, id)))[0];
  };

  findAll = async () => {
    return await db.select().from(projects);
  };

  updateStatus = async (
    id: string,
    status: "pending" | "analyzing" | "generating" | "completed" | "failed",
  ) => {
    return (
      await db
        .update(projects)
        .set({ status, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning()
    )[0];
  };

  updateAnalysis = async (id: string, analysis: unknown) => {
    return (
      await db
        .update(projects)
        .set({ analysis, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning()
    )[0];
  };

  updateError = async (id: string, errorMessage: string) => {
    return (
      await db
        .update(projects)
        .set({ status: "failed", errorMessage, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning()
    )[0];
  };
}
export const projectRepository = new ProjectRepository();
