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
    <form className="refine" onSubmit={handleSubmit}>
      <label htmlFor="refine-input">Change something about this recipe</label>
      <div className="refine__row">
        <input
          id="refine-input"
          value={text}
          placeholder="make it vegan…"
          onChange={(event) => setText(event.target.value)}
          disabled={disabled}
        />
        <button type="submit" disabled={disabled || !text.trim()}>
          Update
        </button>
      </div>

      <div className="examples">
        {SUGGESTIONS.map((suggestion) => (
          <button key={suggestion} type="button" className="chip" onClick={() => onRefine(suggestion)} disabled={disabled}>
            {suggestion}
          </button>
        ))}
      </div>
    </form>
  );
}
