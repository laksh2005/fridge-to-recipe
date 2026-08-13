import { useState } from 'react';

const EXAMPLES = ['eggs, spinach, feta, bread', 'chicken thighs, rice, soy sauce, ginger', 'chickpeas, tomatoes, onion, cumin'];

export default function IngredientInput({ onSubmit, disabled }) {
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();
    if (trimmed && !disabled) onSubmit(trimmed);
  }

  return (
    <form className="ingredient-input" onSubmit={handleSubmit}>
      <label htmlFor="ingredients">What's in your fridge?</label>
      <textarea
        id="ingredients"
        rows={3}
        value={text}
        placeholder="eggs, spinach, half an onion, some cheddar…"
        onChange={(event) => setText(event.target.value)}
        disabled={disabled}
      />

      <div className="ingredient-input__actions">
        <button type="submit" disabled={disabled || !text.trim()}>
          {disabled ? 'Cooking…' : 'Get a recipe'}
        </button>
      </div>

      <div className="examples">
        <span>Try:</span>
        {EXAMPLES.map((example) => (
          <button key={example} type="button" className="chip" onClick={() => setText(example)} disabled={disabled}>
            {example}
          </button>
        ))}
      </div>
    </form>
  );
}
