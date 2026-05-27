import { ALERT_LABELS } from '../utils/alerts'

const SEVERITY_CLASS = {
  error: 'alert--error',
  warning: 'alert--warning',
  info: 'alert--info',
}

function AlertItem({ alert }) {
  return (
    <li className={`alert-item ${SEVERITY_CLASS[alert.severity] ?? ''}`}>
      <div className="alert-item__header">
        <span className="alert-item__badge">{ALERT_LABELS[alert.type]}</span>
        {alert.issueKey && (
          <span className="alert-item__key">{alert.issueKey}</span>
        )}
      </div>
      {alert.summary && (
        <p className="alert-item__summary">{alert.summary}</p>
      )}
      <p className="alert-item__message">{alert.message}</p>
      <p className="alert-item__action">→ {alert.action}</p>
    </li>
  )
}

/**
 * @param {{ alerts: ReturnType<import('../utils/alerts').calcAlerts> }} props
 *   Pass the output of calcAlerts() — computed by the parent (Dashboard).
 */
export default function AlertsList({ alerts }) {
  if (!alerts?.length) {
    return (
      <div className="alerts-empty">
        <p>Nenhum alerta no momento.</p>
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
