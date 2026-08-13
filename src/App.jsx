import { useRecipeGeneration } from './hooks/useRecipeGeneration.js';
import DarkModeToggle from './components/DarkModeToggle.jsx';
import EmptyState from './components/EmptyState.jsx';
import ErrorState from './components/ErrorState.jsx';
import IngredientInput from './components/IngredientInput.jsx';
import LoadingState from './components/LoadingState.jsx';
import RecipeCard from './components/RecipeCard.jsx';

export default function App() {
  const { recipe, status, error, generate, refine, retry, dismissError, clearRecipe } = useRecipeGeneration();

  const busy = status === 'loading';

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Fridge to Recipe</h1>
          <p>Tell it what you have. Get something you can actually cook.</p>
        </div>
        <DarkModeToggle />
      </header>

      <IngredientInput onSubmit={generate} disabled={busy} />

      <main className="app__main">
        {status === 'error' && (
          <ErrorState message={error} onRetry={retry} onDismiss={dismissError} canDismiss={Boolean(recipe)} />
        )}

        {/* While a refinement runs we keep the old recipe on screen instead of
            blanking it out, so the page does not jump around. */}
        {busy && !recipe && <LoadingState />}
        {busy && recipe && <LoadingState message="Updating your recipe…" />}

        {recipe && <RecipeCard recipe={recipe} busy={busy} onRefine={refine} />}

        {!recipe && status === 'idle' && <EmptyState />}
      </main>

      {recipe && (
        <footer className="app__footer">
          <button type="button" className="ghost" onClick={clearRecipe}>
            Start over
          </button>
        </footer>
      )}
    </div>
  );
}
