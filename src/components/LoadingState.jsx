export default function LoadingState({ message = 'Working out a recipe…' }) {
  // Shimmering bars stand in for the recipe that is about to appear.
  const bar = 'h-3.5 rounded-sm bg-[linear-gradient(90deg,var(--line)_25%,var(--paper-2)_50%,var(--line)_75%)] bg-[length:200%_100%] animate-shimmer';

  return (
    <div role="status" className="mt-6 animate-rise rounded border border-line bg-card p-6">
      <div className={`${bar} mb-4 h-8 w-1/2`} />
      <div className={`${bar} mb-2.5`} />
      <div className={`${bar} mb-4 w-2/3`} />
      <p className="text-ink-soft">{message}</p>
    </div>
  );
}
