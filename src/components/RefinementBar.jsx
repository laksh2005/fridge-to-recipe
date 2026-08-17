import { useState } from 'react';

const SUGGESTIONS = ['make it vegetarian', 'make it spicier', 'use fewer pans', 'make it quicker'];

export default function RefinementBar({ onRefine, disabled }) {
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();
    if (trimmed && !disabled) {
      onRefine(trimmed);
      setText('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 border-t-2 border-ink pt-6">
      <label htmlFor="refine-input" className="mb-3 block text-[0.74rem] font-bold tracking-[0.16em] text-hot uppercase">
        Change something about this recipe
      </label>

      <div className="flex gap-2 max-sm:flex-col">
        <input
          id="refine-input"
          type="text"
          value={text}
          placeholder="make it vegan…"
          onChange={(event) => setText(event.target.value)}
          disabled={disabled}
          className="flex-1 rounded border border-line bg-card px-4 py-3 text-ink transition outline-none placeholder:text-ink-soft focus:border-hot disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="shrink-0 rounded bg-hot px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 max-sm:w-full"
        >
          Update
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onRefine(suggestion)}
            disabled={disabled}
            className="rounded-full border border-line px-3 py-1 text-[0.8rem] font-medium text-ink-soft transition hover:border-hot hover:text-hot disabled:opacity-45"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </form>
  );
}
