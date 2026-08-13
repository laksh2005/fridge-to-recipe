// Scales ingredient amounts from the servings the AI wrote the recipe for
// to the servings the user actually wants. Pure maths, no string parsing,
// because the model always gives us amount as a number.

export function scaleIngredients(ingredients, baseServings, targetServings) {
  const factor = targetServings / baseServings;

  return ingredients.map((ingredient) => ({
    ...ingredient,
    amount: ingredient.amount === 0 ? 0 : Math.round(ingredient.amount * factor * 100) / 100,
  }));
}

// "to taste" ingredients have amount 0, so we show the unit on its own.
export function formatQuantity(ingredient) {
  if (ingredient.amount === 0) return ingredient.unit || '';
  return `${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit}` : ''}`;
}
