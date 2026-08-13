export default function LoadingState({ message = 'Working out a recipe…' }) {
  return (
    <div className="state state--loading" role="status">
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--line" />
      <div className="skeleton skeleton--line skeleton--short" />
      <p>{message}</p>
    </div>
  );
}
