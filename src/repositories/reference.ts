import { eq } from "drizzle-orm";

import { db } from "../config/db";
import { reference } from "../db/schema";

class ReferenceRepository {
  create = async (data: typeof reference.$inferInsert) => {
    return (await db.insert(reference).values(data).returning())[0];
  };

  findByProjectId = async (projectId: string) => {
    return await db
      .select()
      .from(reference)
      .where(eq(reference.projectId, projectId));
  };
}

export const referenceRepository = new ReferenceRepository();
