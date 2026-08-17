import { useState } from 'react';

const EXAMPLES = ['eggs, spinach, feta, bread', 'chicken thighs, rice, soy sauce, ginger', 'chickpeas, tomatoes, onion, cumin'];

export default function IngredientInput({ onSubmit, disabled, compact }) {
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();
    if (trimmed && !disabled) onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className={`mt-9 animate-rise [animation-delay:80ms] ${compact ? 'mb-10' : ''}`}>
      <div className="flex items-stretch gap-2.5 max-sm:flex-col">
        <textarea
          id="ingredients"
          rows={compact ? 1 : 2}
          value={text}
          placeholder="eggs, spinach, half an onion, some cheddar…"
          onChange={(event) => setText(event.target.value)}
          disabled={disabled}
          aria-label="What's in your fridge?"
          className={`flex-1 resize-none rounded border border-line bg-card px-4 text-ink transition outline-none placeholder:text-ink-soft focus:border-hot disabled:opacity-50 ${
            compact ? 'py-2.5 text-[0.95rem]' : 'py-3.5 text-[1.02rem]'
          }`}
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="shrink-0 rounded bg-hot px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 max-sm:w-full"
        >
          {disabled ? 'Cooking…' : compact ? 'New recipe' : 'Get a recipe'}
        </button>
      </div>

      {!compact && (
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-[0.82rem] text-ink-soft">
          <span>or try</span>
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setText(example)}
              disabled={disabled}
              className="rounded-full border border-line px-3 py-1 text-[0.8rem] font-medium text-ink-soft transition hover:border-hot hover:text-hot disabled:opacity-45"
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
