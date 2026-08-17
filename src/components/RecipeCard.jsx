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
    <article className={`relative mt-2 animate-rise ${busy ? 'pointer-events-none opacity-45' : ''}`}>
      {busy && (
        <div className="absolute inset-0 z-10 grid justify-center pt-12 text-[0.85rem] font-semibold tracking-[0.1em] text-hot uppercase">
          Updating…
        </div>
      )}

      <header className="mb-9 border-b-2 border-ink pb-6">
        <h2 className="max-w-[18ch] animate-rise font-display text-[clamp(2.1rem,5.5vw,3.4rem)] leading-[1.1] font-semibold tracking-[-0.02em] [animation-delay:60ms]">
          {recipe.title}
        </h2>
        {recipe.description && (
          <p className="mt-3.5 max-w-[58ch] animate-rise text-[1.02rem] text-ink-soft [animation-delay:120ms]">
            {recipe.description}
          </p>
        )}
      </header>

      <div className="grid grid-cols-[minmax(0,20rem)_minmax(0,1fr)] items-start gap-12 max-[880px]:grid-cols-1 max-[880px]:gap-9">
        <aside className="sticky top-6 animate-rise rounded border border-line bg-card p-5 shadow-[0_18px_40px_-28px_rgb(23_21_15_/_0.45)] [animation-delay:160ms] max-[880px]:static">
          <div className="mb-1 border-b border-line pb-4">
            <h3 className="text-[0.74rem] font-bold tracking-[0.16em] text-hot uppercase">Ingredients</h3>
            <ServingsControl servings={targetServings} onChange={setTargetServings} />
          </div>

          {/* The <ul> owns the columns and each row opts into them with subgrid,
              so amounts, names and swap buttons line up across every row no
              matter how long an individual amount is. */}
          <ul className="grid grid-cols-[minmax(0,max-content)_1fr_auto]">
            {scaled.map((ingredient, index) => (
              <li
                key={ingredient.name}
                style={{ animationDelay: `${200 + index * 40}ms` }}
                className="col-span-3 grid animate-rise grid-cols-subgrid items-baseline gap-x-3 border-b border-dotted border-line py-2.5 last:border-b-0 last:pb-0"
              >
                <span className="font-display text-[0.95rem] font-semibold tabular-nums">
                  {formatQuantity(ingredient)}
                </span>
                <span className="text-[0.95rem] text-ink-soft">
                  {swaps[index] || ingredient.name}
                  {swaps[index] && <span className="block text-[0.72rem] text-hot">was {ingredient.name}</span>}
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
        </aside>

        <div>
          <StepChecklist steps={recipe.steps} checked={checked} onToggle={toggleStep} />
          <RefinementBar onRefine={handleRefine} disabled={busy} />
        </div>
      </div>
    </article>
  );
}
