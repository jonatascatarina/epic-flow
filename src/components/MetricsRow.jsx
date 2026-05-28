function KPICard({ label, value, delta, deltaColor }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card__top">
        <span className="kpi-card__value">{value}</span>
        {delta !== undefined && (
          <span className={`kpi-delta kpi-delta--${deltaColor}`}>{delta}</span>
        )}
      </div>
      <span className="kpi-card__label">{label}</span>
    </div>
  )
}

export default function MetricsRow({ total, done, inProgress, blocked, percent }) {
  return (
    <div className="kpi-grid">
      <KPICard label="Total Issues" value={total} />
      <KPICard
        label="Done"
        value={done}
        delta={`${percent}% ↗`}
        deltaColor="green"
      />
      <KPICard
        label="In Progress"
        value={inProgress}
        delta={inProgress > 0 ? `${inProgress} ↗` : undefined}
        deltaColor="blue"
      />
      <KPICard
        label="Blocked"
        value={blocked}
        delta={blocked > 0 ? `${blocked} ↘` : undefined}
        deltaColor="red"
      />
    </div>
  )
}
