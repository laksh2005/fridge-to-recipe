import { useState } from 'react';

// Lets the user swap an ingredient for one the AI suggested.
// The swap only changes the displayed name, never the amount, because
// we do not trust the model to convert quantities between ingredients.
export default function SwapPicker({ original, swaps, selected, onSelect }) {
  const [open, setOpen] = useState(false);

  function choose(value) {
    onSelect(value);
    setOpen(false);
  }

  return (
    <div className="swap">
      <button type="button" className="swap__toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        {selected ? 'swapped' : 'swap'}
      </button>

      {open && (
        <ul className="swap__list">
          <li>
            <button type="button" className={selected ? '' : 'is-active'} onClick={() => choose(null)}>
              {original} <span className="swap__tag">original</span>
            </button>
          </li>
          {swaps.map((swap) => (
            <li key={swap}>
              <button type="button" className={selected === swap ? 'is-active' : ''} onClick={() => choose(swap)}>
                {swap}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
