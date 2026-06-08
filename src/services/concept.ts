import { gemini } from "../config/gemini";

import { ReferenceConcept, ReferenceConceptsSchema } from "../types/concept";

import { SceneAnalysis } from "../types/analysis";
import { retryWithBackoff } from "../utils/retryWithBackoff";

export const conceptService = {
  generateConcepts: async (
    analysis: SceneAnalysis,
  ): Promise<ReferenceConcept[]> => {
    const response = await retryWithBackoff(() =>
      gemini.models.generateContent({
        model: "gemini-3.1-flash-image",

        contents: `
You are a senior environment concept artist.

Based on this scene analysis:

${JSON.stringify(analysis, null, 2)}

Generate exactly 3 unique environment concepts.

Return ONLY valid JSON.

[
  {
    "name": "",
    "prompt": ""
  }
]
`,
      }),
    );

    const text = response.text ?? "";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return ReferenceConceptsSchema.parse(parsed);
  },
};
