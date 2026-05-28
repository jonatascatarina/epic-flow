import { useState, useEffect } from 'react'
import { useJira } from '../hooks/useJira'
import { useConfig } from '../hooks/useConfig'
import { calcMetrics } from '../utils/metrics'
import { calcAlerts } from '../utils/alerts'
import LoadingOverlay from './LoadingOverlay'
import ErrorBanner from './ErrorBanner'
import MetricsRow from './MetricsRow'
import BurndownChart from './BurndownChart'
import AlertsList from './AlertsList'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function getStatusMeta(issue) {
  const cat  = issue.fields?.status?.statusCategory?.key
  const name = issue.fields?.status?.name ?? '—'
  if (cat === 'done') return { name, cls: 'status--done' }
  if (name.toLowerCase().includes('block')) return { name, cls: 'status--blocked' }
  if (cat === 'indeterminate') return { name, cls: 'status--progress' }
  return { name, cls: 'status--todo' }
}

function getInitials(email) {
  if (!email) return '?'
  const [local] = email.split('@')
  return local.charAt(0).toUpperCase()
}

function IssuesTable({ issues }) {
  if (!issues?.length) {
    return <div className="table-empty">Nenhuma issue encontrada.</div>
  }

  return (
    <div className="issues-table-wrap">
      <table className="issues-table">
        <thead>
          <tr>
            <th>Chave</th>
            <th>Status</th>
            <th>Título</th>
            <th>Assignee</th>
            <th>Atualizado</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => {
            const { name, cls } = getStatusMeta(issue)
            return (
              <tr key={issue.key}>
                <td><span className="issue-key">{issue.key}</span></td>
                <td><span className={`status-badge ${cls}`}>{name}</span></td>
                <td className="issue-title">{issue.fields?.summary ?? '—'}</td>
                <td>{issue.fields?.assignee?.displayName ?? '—'}</td>
                <td className="issue-date">{formatDate(issue.fields?.updated)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function Dashboard({ onDisconnect }) {
  const { config } = useConfig()
  const { issues, sprint, loading, error, refresh, load } = useJira()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => { load() }, [load])

  const metrics = calcMetrics(issues)
  const alerts  = calcAlerts(issues, {
    staleThresholdDays: config?.staleThresholdDays,
    wipLimit:           config?.wipLimit,
  })
  const blocked = issues.filter(
    (i) => i.fields?.status?.name?.toLowerCase().includes('block')
  ).length

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'issues',   label: 'Issues' },
    { key: 'alertas',  label: alerts.length ? `Alertas (${alerts.length})` : 'Alertas' },
  ]

  const epicLabel = sprint?.name ?? `Sprint #${config?.sprintId ?? '—'}`

  return (
    <div className="dashboard">
      <LoadingOverlay visible={loading} />

      <header className="dashboard__header">
        <div className="header-brand">
          <span className="header-logo">⚡</span>
          <span className="header-title">epic-flow</span>
        </div>

        <div className="header-greeting">
          <span className="header-welcome">
            Bem-vindo, <strong>{config?.email}</strong>
          </span>
          <span className="header-epic-badge">Épico: {epicLabel}</span>
        </div>

        <div className="header-actions">
          <button
            className="btn btn--secondary"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? 'Atualizando…' : '↻ Atualizar'}
          </button>
          <button className="btn btn--ghost" onClick={onDisconnect}>
            Desconectar
          </button>
          <div className="avatar" title={config?.email}>
            {getInitials(config?.email)}
          </div>
        </div>
      </header>

      <ErrorBanner message={error} onRetry={refresh} />

      {!error && (
        <main className="dashboard__content">
          <MetricsRow
            total={metrics.total}
            done={metrics.done}
            inProgress={metrics.inProgress}
            blocked={blocked}
            percent={metrics.percent}
          />

          <div className="tabs-bar">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`tab-btn${activeTab === t.key ? ' tab-btn--active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="tab-panel">
              <div className="chart-card">
                <div className="chart-card__header">
                  <h2 className="chart-card__title">Burndown do Sprint</h2>
                  {sprint && (
                    <span className="chart-card__meta">
                      {sprint.name} · {formatDate(sprint.startDate)} → {formatDate(sprint.endDate)}
                    </span>
                  )}
                </div>
                <BurndownChart issues={issues} sprint={sprint} metrics={metrics} />
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="tab-panel">
              <IssuesTable issues={issues} />
            </div>
          )}

          {activeTab === 'alertas' && (
            <div className="tab-panel">
              <AlertsList alerts={alerts} />
            </div>
          )}
        </main>
      )}
    </div>
  )
}
