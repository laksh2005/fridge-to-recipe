export default function ErrorState({ message, onRetry, onDismiss, canDismiss }) {
  return (
    <div role="alert" className="mt-6 animate-rise rounded border border-bad bg-bad-soft p-6">
      <h3 className="font-display text-[1.15rem] font-semibold text-bad">That didn't work</h3>
      <p className="mt-1 text-ink-soft">{message}</p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onRetry}
          className="rounded bg-hot px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
        >
          Try again
        </button>
        {canDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded border border-line px-5 py-2.5 font-semibold text-ink-soft transition hover:border-ink-soft hover:text-ink"
          >
            Keep previous recipe
          </button>
        )}
      </div>
    </div>
  );
}
