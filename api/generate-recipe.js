import { GoogleGenAI } from '@google/genai';
import { recipeResponseSchema } from '../src/lib/recipeSchema.js';

// This runs on the server, so the API key never reaches the browser.
const MODEL = 'gemini-2.5-flash';

const SYSTEM_RULES = `You are a recipe generator. Rules you must follow:
- "amount" is always a plain number, never a string and never a fraction. Use 0.5 instead of "1/2".
- For things measured to taste (salt, pepper, oil for frying), use amount 0 and unit "to taste".
- "swaps" lists 0-3 realistic substitutes for that ingredient, as short plain names.
- "servings" is how many people the amounts you wrote are for.
- "steps" are short, ordered, imperative instructions. No numbering prefixes.`;

function buildPrompt(body) {
  if (body.mode === 'refine') {
    return `${SYSTEM_RULES}

Here is an existing recipe as JSON:
${JSON.stringify(body.previousRecipe)}

Apply this change to it: "${body.instruction}"

Return the complete updated recipe in the same JSON shape. Keep anything the change does not affect.`;
  }

  return `${SYSTEM_RULES}

The user has these ingredients available: "${body.ingredientsText}"

Create one recipe they can realistically cook with them. You may assume basic staples like salt, pepper, oil and water. Do not invent major ingredients they did not mention.`;
}

function validateRequest(body) {
  if (!body || typeof body !== 'object') return 'Invalid request body.';

  if (body.mode === 'refine') {
    if (!body.previousRecipe || typeof body.previousRecipe !== 'object') return 'Missing previous recipe.';
    if (typeof body.instruction !== 'string' || !body.instruction.trim()) return 'Missing refinement instruction.';
    return null;
  }

  if (typeof body.ingredientsText !== 'string' || !body.ingredientsText.trim()) {
    return 'Please list at least one ingredient.';
  }
  if (body.ingredientsText.length > 2000) return 'That ingredient list is too long.';

  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'The server is missing its API key.' });
  }

  const requestError = validateRequest(req.body);
  if (requestError) {
    return res.status(400).json({ error: requestError });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: buildPrompt(req.body),
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipeResponseSchema,
      },
    });

    // Even in JSON mode the model can return text that does not parse,
    // so we parse here and fail with a clean message instead of a 500 stack.
    let recipe;
    try {
      recipe = JSON.parse(response.text);
    } catch {
      return res.status(502).json({ error: 'The AI returned something we could not read. Please try again.' });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    console.error('Gemini request failed:', error);
    return res.status(502).json({ error: 'The AI service is unavailable right now. Please try again.' });
  }
}
