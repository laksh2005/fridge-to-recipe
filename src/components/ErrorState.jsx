export default function ErrorState({ message, onRetry, onDismiss, canDismiss }) {
  return (
    <div className="state state--error" role="alert">
      <h3>That didn't work</h3>
      <p>{message}</p>
      <div className="state__actions">
        <button type="button" onClick={onRetry}>
          Try again
        </button>
        {canDismiss && (
          <button type="button" className="ghost" onClick={onDismiss}>
            Keep previous recipe
          </button>
        )}
      </div>
    </div>
  );
}
