export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="error-banner" role="alert">
      <p className="error-banner__message">{message}</p>
      {onRetry && (
        <button className="btn btn--secondary" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  )
}
