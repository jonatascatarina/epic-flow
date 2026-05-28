import { ALERT_LABELS } from '../utils/alerts'

const SEVERITY_CLASS = {
  error:   'alert--error',
  warning: 'alert--warning',
  info:    'alert--info',
}

const SEVERITY_ICON = {
  error:   '🚨',
  warning: '⚠️',
  info:    'ℹ️',
}

function AlertItem({ alert }) {
  const cls = SEVERITY_CLASS[alert.severity] ?? ''
  const icon = SEVERITY_ICON[alert.severity] ?? 'ℹ️'

  return (
    <li className={`alert-item ${cls}`}>
      <div className="alert-item__header">
        <span className="alert-item__icon" aria-hidden="true">{icon}</span>
        <span className="alert-item__badge">{ALERT_LABELS[alert.type]}</span>
        {alert.issueKey && (
          <span className="alert-item__key">{alert.issueKey}</span>
        )}
      </div>
      <div className="alert-item__body">
        {alert.summary && (
          <p className="alert-item__summary">{alert.summary}</p>
        )}
        <p className="alert-item__message">{alert.message}</p>
        <p className="alert-item__action">→ {alert.action}</p>
      </div>
    </li>
  )
}

export default function AlertsList({ alerts }) {
  if (!alerts?.length) {
    return (
      <div className="alerts-empty">
        <p>Nenhum alerta no momento. Tudo em ordem! ✓</p>
      </div>
    )
  }

  return (
    <ul className="alerts-list">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </ul>
  )
}
