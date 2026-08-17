import { useEffect, useMemo, useState } from 'react';
import { formatQuantity, scaleIngredients } from '../lib/scaleIngredients.js';
import RefinementBar from './RefinementBar.jsx';
import ServingsControl from './ServingsControl.jsx';
import StepChecklist from './StepChecklist.jsx';
import SwapPicker from './SwapPicker.jsx';

export default function RecipeCard({ recipe, busy, onRefine }) {
  const [targetServings, setTargetServings] = useState(recipe.servings);
  const [swaps, setSwaps] = useState({}); // ingredient index -> chosen swap name
  const [checked, setChecked] = useState(() => recipe.steps.map(() => false));

  // A refined recipe is a different recipe, so the servings, swaps and
  // ticked-off steps from the old one should not carry over.
  useEffect(() => {
    setTargetServings(recipe.servings);
    setSwaps({});
    setChecked(recipe.steps.map(() => false));
  }, [recipe]);

  const scaled = useMemo(
    () => scaleIngredients(recipe.ingredients, recipe.servings, targetServings),
    [recipe.ingredients, recipe.servings, targetServings],
  );

  function toggleStep(index) {
    setChecked((current) => current.map((value, i) => (i === index ? !value : value)));
  }

  function handleRefine(instruction) {
    // Send the recipe as the user currently sees it, so their swaps stick.
    const withSwaps = {
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient, index) => ({
        ...ingredient,
        name: swaps[index] || ingredient.name,
      })),
    };
    onRefine(instruction, withSwaps);
  }

  return (
    <article className={`recipe ${busy ? 'is-busy' : ''}`}>
      <header className="recipe__header">
        <h2>{recipe.title}</h2>
        {recipe.description && <p className="recipe__description">{recipe.description}</p>}
        <ServingsControl servings={targetServings} onChange={setTargetServings} />
      </header>

      <section className="ingredients">
        <h3>Ingredients</h3>
        <ul className="ingredients__list">
          {scaled.map((ingredient, index) => (
            <li key={ingredient.name} style={{ '--i': index }}>
              <span className="ingredients__amount">{formatQuantity(ingredient)}</span>
              <span className="ingredients__name">
                {swaps[index] || ingredient.name}
                {swaps[index] && <span className="ingredients__was">instead of {ingredient.name}</span>}
              </span>
              {ingredient.swaps.length > 0 && (
                <SwapPicker
                  original={ingredient.name}
                  swaps={ingredient.swaps}
                  selected={swaps[index] || null}
                  onSelect={(value) => setSwaps((current) => ({ ...current, [index]: value }))}
                />
              )}
            </li>
          ))}
        </ul>
      </section>

      <StepChecklist steps={recipe.steps} checked={checked} onToggle={toggleStep} />

      <RefinementBar onRefine={handleRefine} disabled={busy} />
    </article>
  );
}
