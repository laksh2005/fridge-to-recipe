const MIN = 1;
const MAX = 20;

export default function ServingsControl({ servings, onChange }) {
  const clamp = (value) => Math.min(MAX, Math.max(MIN, value));

  const stepButton =
    'grid size-7 place-items-center rounded-full text-base text-ink transition hover:bg-hot hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink';

  return (
    <div className="mt-3.5 flex items-center justify-between gap-3">
      <span className="text-[0.9rem] text-ink-soft">Servings</span>
      <div className="flex items-center gap-1 rounded-full border border-line p-1">
        <button
          type="button"
          onClick={() => onChange(clamp(servings - 1))}
          disabled={servings <= MIN}
          aria-label="Fewer servings"
          className={stepButton}
        >
          −
        </button>
        <span className="min-w-6 text-center font-bold tabular-nums">{servings}</span>
        <button
          type="button"
          onClick={() => onChange(clamp(servings + 1))}
          disabled={servings >= MAX}
          aria-label="More servings"
          className={stepButton}
        >
          +
        </button>
      </div>
    </div>
  );
}
