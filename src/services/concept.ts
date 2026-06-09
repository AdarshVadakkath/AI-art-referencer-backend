import { gemini } from "../config/gemini";

import { ReferenceConcept, ReferenceConceptsSchema } from "../types/concept";

import { SceneAnalysis } from "../types/analysis";
import { retryWithBackoff } from "../utils/retryWithBackoff";

export const conceptService = {
  generateConcepts: async (
    analysis: SceneAnalysis,
  ): Promise<ReferenceConcept[]> => {
    console.log("Generating concepts...");
    const response = await retryWithBackoff(() =>
      gemini.models.generateContent({
        model: "gemini-2.5-flash",

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
    console.log("Concepts generated");
    const text = response.text ?? "";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return ReferenceConceptsSchema.parse(parsed);
  },
};
