export default function LoadingOverlay({ visible }) {
  if (!visible) return null
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-overlay__spinner" aria-hidden="true" />
      <p>Carregando dados do Jira…</p>
    </div>
  )
}
