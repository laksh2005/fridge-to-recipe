export default function StepChecklist({ steps, checked, onToggle }) {
  // A refined recipe can have more steps than the checked array we still hold
  // for one render, so fall back to false rather than passing undefined to
  // the checkbox (which would make React treat it as uncontrolled).
  const isChecked = (index) => checked[index] ?? false;
  const doneCount = checked.filter(Boolean).length;

  return (
    <section className="steps">
      <div className="steps__header">
        <h3>Method</h3>
        <span className="steps__progress">
          {doneCount} of {steps.length} done
        </span>
      </div>

      <ol className="steps__list">
        {steps.map((step, index) => (
          <li key={index} className={isChecked(index) ? 'is-done' : ''} style={{ '--i': index }}>
            <label>
              <input type="checkbox" checked={isChecked(index)} onChange={() => onToggle(index)} />
              <span>{step}</span>
            </label>
          </li>
        ))}
      </ol>
    </section>
  );
}
