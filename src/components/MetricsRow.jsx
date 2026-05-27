function MetricCard({ label, value, modifier }) {
  return (
    <div className={`metric-card${modifier ? ` metric-card--${modifier}` : ''}`}>
      <span className="metric-card__value">{value}</span>
      <span className="metric-card__label">{label}</span>
    </div>
  )
}

/**
 * @param {{
 *   total: number,
 *   done: number,
 *   inProgress: number,
 *   todo: number,
 *   points?: { available: boolean, total: number, done: number, inProgress: number, todo: number }
 * }} props — pass the output of calcMetrics() directly
 */
export default function MetricsRow({ total, done, inProgress, todo, points }) {
  return (
    <div className="metrics-row">
      <MetricCard label="Total" value={total} />
      <MetricCard label="Concluídas" value={done} modifier="done" />
      <MetricCard label="Em andamento" value={inProgress} modifier="in-progress" />
      <MetricCard label="A fazer" value={todo} modifier="todo" />
      {points?.available && (
        <MetricCard label="Pts restantes" value={points.inProgress + points.todo} modifier="points" />
      )}
    </div>
  )
}
