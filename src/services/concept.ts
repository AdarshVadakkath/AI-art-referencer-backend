import { gemini } from "../config/gemini";

import { ReferenceConcept, ReferenceConceptsSchema } from "../types/concept";

import { SceneAnalysis } from "../types/analysis";
import { retryWithBackoff } from "../utils/retryWithBackoff";

export const conceptService = {
  generateConcepts: async (
    analysis: SceneAnalysis,
  ): Promise<ReferenceConcept[]> => {
    console.log("Generating stylization prompt...");

    const response = await retryWithBackoff(() =>
      gemini.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
You are a Senior Environment Art Director working in AAA game development and film production.

SCENE ANALYSIS

${JSON.stringify(analysis, null, 2)}

TASK

Generate 4 different environment stylization concepts.

IMPORTANT:

The original image is a blockout / base render.

The generated concepts will later be used by an image-to-image model.

Therefore every concept MUST preserve:

- camera angle
- composition
- perspective
- architecture
- geometry
- object placement
- scene layout

DO NOT redesign the scene.

DO NOT add new buildings.

DO NOT move objects.

DO NOT change proportions.

Only improve:

- materials
- textures
- lighting
- atmosphere
- color grading
- storytelling mood
- artistic style

Generate concepts that are visually distinct.

Examples:

- Realistic AAA Game
- Cinematic Unreal Engine
- Stylized Fantasy
- Anime Environment
- Dark Gothic
- Cyberpunk
- Medieval
- Studio Ghibli Inspired
- Nordic Fantasy
- Post Apocalyptic

Return ONLY valid JSON.

[
  {
    "name": "Concept Name",
    "style": "Short style description",
    "preserve": [
      "camera angle",
      "composition",
      "perspective",
      "object placement",
      "scene layout"
    ],
    "prompt": "Full image-to-image editing prompt"
  }
]
`,
      }),
    );

    console.log("Stylization prompt generated");

    const text = response.text ?? "";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return ReferenceConceptsSchema.parse(parsed);
  },
};
