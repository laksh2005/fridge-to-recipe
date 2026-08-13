export default function StepChecklist({ steps, checked, onToggle }) {
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
          <li key={index} className={checked[index] ? 'is-done' : ''}>
            <label>
              <input type="checkbox" checked={checked[index]} onChange={() => onToggle(index)} />
              <span>{step}</span>
            </label>
          </li>
        ))}
      </ol>
    </section>
  );
}
