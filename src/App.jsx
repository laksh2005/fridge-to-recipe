import { useRecipeGeneration } from './hooks/useRecipeGeneration.js';
import DarkModeToggle from './components/DarkModeToggle.jsx';
import ErrorState from './components/ErrorState.jsx';
import IngredientInput from './components/IngredientInput.jsx';
import LoadingState from './components/LoadingState.jsx';
import RecipeCard from './components/RecipeCard.jsx';

export default function App() {
  const { recipe, status, error, generate, refine, retry, dismissError, clearRecipe } = useRecipeGeneration();

  const busy = status === 'loading';
  // With no recipe yet the input takes over the screen as a hero. Once there is
  // a recipe it shrinks to a compact bar so the recipe itself is the page.
  const hero = !recipe && status !== 'loading';

  return (
    <div className="mx-auto max-w-[1040px] px-5 pb-20 max-sm:px-4">
      <nav className="mb-10 flex items-center justify-between gap-4 border-b border-line py-5">
        <span className="inline-flex items-center gap-2.5 font-display text-[1.02rem] font-semibold tracking-tight">
          <span className="size-3 rounded-full bg-hot ring-4 ring-hot-soft" aria-hidden="true" />
          Fridge&nbsp;to&nbsp;Recipe
        </span>
        <div className="flex items-center gap-2">
          {recipe && (
            <button
              type="button"
              onClick={clearRecipe}
              className="rounded border border-line px-4 py-2 font-semibold text-ink-soft transition hover:border-ink-soft hover:text-ink"
            >
              Start over
            </button>
          )}
          <DarkModeToggle />
        </div>
      </nav>

      {hero && (
        <header className="mt-12 mb-8 animate-rise">
          <p className="mb-4 text-[0.72rem] font-bold tracking-[0.18em] text-hot uppercase">Open fridge · get dinner</p>
          <h1 className="max-w-[14ch] font-display text-[clamp(2.6rem,7.5vw,4.75rem)] leading-[1.1] font-semibold tracking-[-0.02em]">
            Cook something
            <em className="text-hot italic"> good</em> with
            <br />
            whatever you already have.
          </h1>
          <p className="mt-6 max-w-[46ch] text-[1.05rem] text-ink-soft">
            List what's in there. You'll get a real recipe — scalable servings, checkable steps and swaps for anything
            you're missing.
          </p>
        </header>
      )}

      <IngredientInput onSubmit={generate} disabled={busy} compact={!hero} />

      <main>
        {status === 'error' && (
          <ErrorState message={error} onRetry={retry} onDismiss={dismissError} canDismiss={Boolean(recipe)} />
        )}

        {/* While a refinement runs we keep the old recipe on screen instead of
            blanking it out, so the page does not jump around. */}
        {busy && !recipe && <LoadingState />}

        {recipe && <RecipeCard recipe={recipe} busy={busy} onRefine={refine} />}
      </main>
    </div>
  );
}
