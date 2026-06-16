import { z } from "zod";

export const ReferenceConceptSchema = z.object({
  name: z.string(),

  preserve: z.array(z.string()),

  prompt: z.string(),
});

export const ReferenceConceptsSchema = z.array(ReferenceConceptSchema);

export type ReferenceConcept = z.infer<typeof ReferenceConceptSchema>;
