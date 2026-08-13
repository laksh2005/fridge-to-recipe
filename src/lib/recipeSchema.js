// The shape we ask Gemini for, and the shape we verify it actually sent back.
// Kept in one file so the prompt contract and the validation never drift apart.

export const recipeResponseSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    servings: { type: 'number' },
    ingredients: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          amount: { type: 'number' },
          unit: { type: 'string' },
          swaps: { type: 'array', items: { type: 'string' } },
        },
        required: ['name', 'amount', 'unit', 'swaps'],
      },
    },
    steps: { type: 'array', items: { type: 'string' } },
  },
  required: ['title', 'description', 'servings', 'ingredients', 'steps'],
};

// Returns an error string if the data is unusable, or null if it's fine.
// Gemini's schema mode gets the shape right most of the time, but it can still
// send empty arrays or zero servings, which would render a broken recipe.
export function validateRecipe(data) {
  if (!data || typeof data !== 'object') return 'The AI did not return a recipe.';
  if (typeof data.title !== 'string' || !data.title.trim()) return 'The recipe is missing a title.';
  if (typeof data.servings !== 'number' || data.servings <= 0) return 'The recipe has an invalid serving count.';
  if (!Array.isArray(data.ingredients) || data.ingredients.length === 0) return 'The recipe has no ingredients.';
  if (!Array.isArray(data.steps) || data.steps.length === 0) return 'The recipe has no steps.';

  for (const ingredient of data.ingredients) {
    if (!ingredient || typeof ingredient.name !== 'string' || !ingredient.name.trim()) {
      return 'One of the ingredients is missing a name.';
    }
    if (typeof ingredient.amount !== 'number' || Number.isNaN(ingredient.amount) || ingredient.amount < 0) {
      return `The amount for "${ingredient.name}" is not a valid number.`;
    }
  }

  if (data.steps.some((step) => typeof step !== 'string' || !step.trim())) {
    return 'One of the steps is empty.';
  }

  return null;
}

// Fills in the optional bits the model sometimes omits, so components can
// render without defensive checks everywhere.
export function normalizeRecipe(data) {
  return {
    title: data.title.trim(),
    description: typeof data.description === 'string' ? data.description.trim() : '',
    servings: data.servings,
    ingredients: data.ingredients.map((ingredient) => ({
      name: ingredient.name.trim(),
      amount: ingredient.amount,
      unit: typeof ingredient.unit === 'string' ? ingredient.unit.trim() : '',
      swaps: Array.isArray(ingredient.swaps)
        ? ingredient.swaps.filter((swap) => typeof swap === 'string' && swap.trim()).map((swap) => swap.trim())
        : [],
    })),
    steps: data.steps.map((step) => step.trim()),
  };
}
