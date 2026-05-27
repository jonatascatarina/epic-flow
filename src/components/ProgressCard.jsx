/**
 * @param {{
 *   percent: number,
 *   done: number,
 *   total: number,
 *   points?: { available: boolean, done: number, total: number }
 * }} props — pass the output of calcMetrics() directly
 */
export default function ProgressCard({ percent, done, total, points }) {
  const clamped = Math.min(100, Math.max(0, percent))

  return (
    <div className="progress-card">
      <div className="progress-card__header">
        <span className="progress-card__label">Progresso do Sprint</span>
        <span className="progress-card__percent">{clamped}%</span>
      </div>

      <div className="progress-card__bar-track">
        <div
          className="progress-card__bar-fill"
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <p className="progress-card__summary">
        {done} de {total} issue{total !== 1 ? 's' : ''} concluída{done !== 1 ? 's' : ''}
        {points?.available && (
          <> · {points.done}/{points.total} pts</>
        )}
      </p>
    </div>
  )
}
