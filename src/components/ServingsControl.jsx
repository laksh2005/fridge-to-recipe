const MIN = 1;
const MAX = 20;

export default function ServingsControl({ servings, onChange }) {
  const clamp = (value) => Math.min(MAX, Math.max(MIN, value));

  return (
    <div className="servings">
      <span className="servings__label">Servings</span>
      <div className="servings__stepper">
        <button type="button" onClick={() => onChange(clamp(servings - 1))} disabled={servings <= MIN} aria-label="Fewer servings">
          −
        </button>
        <span className="servings__value">{servings}</span>
        <button type="button" onClick={() => onChange(clamp(servings + 1))} disabled={servings >= MAX} aria-label="More servings">
          +
        </button>
      </div>
    </div>
  );
}
