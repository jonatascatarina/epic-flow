const MS_PER_DAY = 24 * 60 * 60 * 1000

function statusCategory(issue) {
  const key = issue.fields?.status?.statusCategory?.key
  if (key === 'done') return 'done'
  if (key === 'indeterminate') return 'inProgress'
  return 'todo'
}

/**
 * Computes all alerts from a Jira issues array.
 *
 * @param {object[]} issues - raw issues from useJira
 * @param {{ staleThresholdDays?: number, wipLimit?: number }} config
 * @returns {Array<{
 *   id: string,
 *   type: 'WIP_LIMIT' | 'STALE_WIP' | 'NO_ASSIGNEE',
 *   severity: 'error' | 'warning' | 'info',
 *   issueKey: string | null,
 *   summary: string | null,
 *   message: string,
 *   action: string,
 * }>}
 */
export function calcAlerts(issues, config = {}) {
  const { staleThresholdDays = 2, wipLimit = 3 } = config

  if (!issues?.length) return []

  const alerts = []
  const now = Date.now()
  const staleMs = staleThresholdDays * MS_PER_DAY

  const inProgress = issues.filter((i) => statusCategory(i) === 'inProgress')
  const active = issues.filter((i) => statusCategory(i) !== 'done')

  // — WIP limit exceeded (aggregate alert) ——————————————————————————
  if (inProgress.length > wipLimit) {
    alerts.push({
      id: 'wip-limit',
      type: 'WIP_LIMIT',
      severity: 'error',
      issueKey: null,
      summary: null,
      message: `${inProgress.length} issues em andamento — limite é ${wipLimit}`,
      action: 'Finalize ou pause issues antes de iniciar novas',
    })
  }

  // — Stale WIP: in progress but not updated in N days ——————————————
  for (const issue of inProgress) {
    const updated = new Date(issue.fields?.updated ?? 0).getTime()
    const daysStale = Math.floor((now - updated) / MS_PER_DAY)
    if (daysStale >= staleThresholdDays) {
      alerts.push({
        id: `stale-${issue.key}`,
        type: 'STALE_WIP',
        severity: 'warning',
        issueKey: issue.key,
        summary: issue.fields?.summary ?? null,
        message: `Sem atualização há ${daysStale} dia${daysStale === 1 ? '' : 's'}`,
        action: 'Verifique o status com o responsável ou mova para Blocked',
      })
    }
  }

  // — No assignee (active issues only) —————————————————————————————
  for (const issue of active) {
    if (!issue.fields?.assignee) {
      alerts.push({
        id: `no-assignee-${issue.key}`,
        type: 'NO_ASSIGNEE',
        severity: 'info',
        issueKey: issue.key,
        summary: issue.fields?.summary ?? null,
        message: 'Sem responsável definido',
        action: 'Atribua um responsável para garantir o andamento',
      })
    }
  }

  return alerts
}

export const ALERT_LABELS = {
  WIP_LIMIT: 'Limite WIP',
  STALE_WIP: 'Parado',
  NO_ASSIGNEE: 'Sem dono',
}
