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

  const option = 'w-full rounded px-2 py-1.5 text-left text-[0.88rem] font-medium transition hover:bg-paper-2';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="rounded-full border border-transparent px-1.5 py-0.5 text-[0.68rem] font-semibold tracking-[0.08em] text-ink-soft uppercase opacity-65 transition hover:border-hot hover:text-hot hover:opacity-100"
      >
        {selected ? 'swapped' : 'swap'}
      </button>

      {open && (
        <ul className="absolute top-[125%] right-0 z-20 min-w-44 animate-pop rounded border border-line bg-card p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0_/_0.3)]">
          <li>
            <button type="button" onClick={() => choose(null)} className={`${option} ${selected ? 'text-ink' : 'text-hot'}`}>
              {original} <span className="text-[0.68rem] text-ink-soft">original</span>
            </button>
          </li>
          {swaps.map((swap) => (
            <li key={swap}>
              <button
                type="button"
                onClick={() => choose(swap)}
                className={`${option} ${selected === swap ? 'text-hot' : 'text-ink'}`}
              >
                {swap}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
