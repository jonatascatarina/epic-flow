import { useEffect } from 'react'
import { useJira } from '../hooks/useJira'
import { useConfig } from '../hooks/useConfig'
import { calcMetrics } from '../utils/metrics'
import { calcAlerts } from '../utils/alerts'
import LoadingOverlay from './LoadingOverlay'
import ErrorBanner from './ErrorBanner'
import ProgressCard from './ProgressCard'
import MetricsRow from './MetricsRow'
import BurndownChart from './BurndownChart'
import AlertsList from './AlertsList'

export default function Dashboard({ onDisconnect }) {
  const { config } = useConfig()
  const { issues, loading, error, refresh, load } = useJira()

  useEffect(() => { load() }, [load])

  const metrics = calcMetrics(issues)
  const alerts = calcAlerts(issues, {
    staleThresholdDays: config?.staleThresholdDays,
    wipLimit: config?.wipLimit,
  })
  const sprint = config?.sprint ?? null

  return (
    <div className="dashboard">
      <LoadingOverlay visible={loading} />

      <header className="dashboard__header">
        <h1 className="dashboard__title">epic-flow</h1>
        <div className="dashboard__actions">
          <button
            className="btn btn--primary"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? 'Atualizando…' : 'Atualizar'}
          </button>
          <button className="btn btn--ghost" onClick={onDisconnect}>
            Desconectar
          </button>
        </div>
      </header>

      <ErrorBanner message={error} onRetry={refresh} />

      {!error && (
        <main className="dashboard__content">
          <ProgressCard {...metrics} />
          <MetricsRow {...metrics} />
          <section className="dashboard__charts">
            <BurndownChart issues={issues} sprint={sprint} metrics={metrics} />
          </section>
          <section className="dashboard__alerts">
            <h2 className="dashboard__section-title">Alertas</h2>
            <AlertsList alerts={alerts} />
          </section>
        </main>
      )}
    </div>
  )
}
