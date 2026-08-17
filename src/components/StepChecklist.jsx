export default function StepChecklist({ steps, checked, onToggle }) {
  // A refined recipe can have more steps than the checked array we still hold
  // for one render, so fall back to false rather than passing undefined to
  // the checkbox (which would make React treat it as uncontrolled).
  const isChecked = (index) => checked[index] ?? false;
  const doneCount = checked.filter(Boolean).length;
  const percent = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[0.74rem] font-bold tracking-[0.16em] text-hot uppercase">Method</h3>
        <span className="text-[0.8rem] font-bold tabular-nums text-ink-soft">
          {doneCount}/{steps.length}
        </span>
      </div>

      <div
        className="mt-3.5 mb-2 h-0.5 overflow-hidden bg-line"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span
          className="block h-full bg-hot transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol>
        {steps.map((step, index) => {
          const done = isChecked(index);
          return (
            <li
              key={index}
              style={{ animationDelay: `${220 + index * 45}ms` }}
              className="animate-rise border-b border-line last:border-b-0"
            >
              <label className="group grid cursor-pointer grid-cols-[auto_1fr] items-start gap-4 py-4">
                {/* The native checkbox is visually hidden — the number badge is the control. */}
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => onToggle(index)}
                  className="peer absolute size-0 opacity-0"
                />
                <span
                  aria-hidden="true"
                  className={`grid size-[1.9rem] place-items-center rounded-full border font-display text-[0.9rem] font-semibold transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-hot ${
                    done
                      ? 'border-leaf bg-leaf font-body text-white'
                      : 'border-line text-ink-soft group-hover:border-hot group-hover:text-hot'
                  }`}
                >
                  {done ? '✓' : index + 1}
                </span>
                <span
                  className={`pt-0.5 transition ${done ? 'text-ink-soft line-through decoration-line' : ''}`}
                >
                  {step}
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
