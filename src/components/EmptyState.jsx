export default function EmptyState() {
  return (
    <div className="state state--empty">
      <p className="state__icon" aria-hidden="true">
        🥕
      </p>
      <h3>No recipe yet</h3>
      <p>List whatever you have and you'll get a recipe with checkable steps, adjustable servings and ingredient swaps.</p>
    </div>
  );
}
