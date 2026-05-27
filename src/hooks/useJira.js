import { useState, useRef, useCallback } from 'react'
import { useConfig } from './useConfig'

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutos

const ERROR_MESSAGES = {
  AUTH: 'Token inválido ou expirado. Verifique suas credenciais em Configurações.',
  PERMISSION: 'Sem permissão para acessar este sprint. Verifique se o usuário tem acesso ao projeto.',
  NOT_FOUND: 'Sprint não encontrado. Verifique o Sprint ID em Configurações.',
  CORS:
    'Não foi possível conectar ao Jira. Em ambiente local, requisições de browser podem ser bloqueadas por CORS. ' +
    'Tente: (1) usar uma extensão de browser para desabilitar CORS, ou (2) configurar um proxy reverso.',
  INCOMPLETE_CONFIG: 'Configuração incompleta. Preencha todos os campos antes de continuar.',
}

function basicAuth(email, token) {
  return 'Basic ' + btoa(`${email}:${token}`)
}

function checkStatus(res) {
  if (res.ok) return res
  if (res.status === 401) throw Object.assign(new Error('AUTH'), { code: 'AUTH' })
  if (res.status === 403) throw Object.assign(new Error('PERMISSION'), { code: 'PERMISSION' })
  if (res.status === 404) throw Object.assign(new Error('NOT_FOUND'), { code: 'NOT_FOUND' })
  throw Object.assign(new Error(`HTTP_${res.status}`), { code: `HTTP_${res.status}` })
}

function apiBase(jiraUrl) {
  if (import.meta.env.DEV) return '/jira-proxy'
  return jiraUrl.replace(/\/$/, '')
}

async function fetchSprint(jiraUrl, email, token, sprintId) {
  const base = apiBase(jiraUrl)
  const headers = { Authorization: basicAuth(email, token), Accept: 'application/json' }
  const res = await fetch(`${base}/rest/agile/1.0/sprint/${sprintId}`, { headers })
  checkStatus(res)
  const data = await res.json()
  return {
    id: data.id,
    name: data.name,
    state: data.state,
    startDate: data.startDate ? data.startDate.slice(0, 10) : null,
    endDate: data.endDate ? data.endDate.slice(0, 10) : null,
  }
}

async function fetchAllIssues(jiraUrl, email, token, sprintId) {
  const base = apiBase(jiraUrl)
  const headers = { Authorization: basicAuth(email, token), Accept: 'application/json' }
  const jql = encodeURIComponent(`sprint = ${sprintId} ORDER BY updated DESC`)
  const fields = 'summary,status,assignee,priority,updated,created,customfield_10016,customfield_10028'

  const issues = []
  let nextPageToken = null

  do {
    const tokenParam = nextPageToken ? `&nextPageToken=${encodeURIComponent(nextPageToken)}` : ''
    const url = `${base}/rest/api/3/search/jql?jql=${jql}&fields=${fields}&maxResults=50${tokenParam}`
    const res = await fetch(url, { headers })
    checkStatus(res)
    const data = await res.json()
    issues.push(...(data.issues ?? []))
    nextPageToken = data.isLast ? null : (data.nextPageToken ?? null)
  } while (nextPageToken)

  return issues
}

export function useJira() {
  const { config } = useConfig()
  const [issues, setIssues] = useState([])
  const [sprint, setSprint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const cache = useRef({ issues: null, sprint: null, timestamp: null })

  const load = useCallback(
    async ({ force = false } = {}) => {
      const { jiraUrl, email, token, sprintId } = config ?? {}
      if (!jiraUrl || !email || !token || !sprintId) {
        setError(ERROR_MESSAGES.INCOMPLETE_CONFIG)
        return
      }

      const now = Date.now()
      if (!force && cache.current.issues && now - cache.current.timestamp < CACHE_TTL_MS) {
        setIssues(cache.current.issues)
        setSprint(cache.current.sprint)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const [issueResult, sprintResult] = await Promise.all([
          fetchAllIssues(jiraUrl, email, token, sprintId),
          fetchSprint(jiraUrl, email, token, sprintId),
        ])
        cache.current = { issues: issueResult, sprint: sprintResult, timestamp: Date.now() }
        setIssues(issueResult)
        setSprint(sprintResult)
      } catch (err) {
        const isCors = err instanceof TypeError
        const code = isCors ? 'CORS' : (err.code ?? 'UNKNOWN')
        setError(ERROR_MESSAGES[code] ?? `Erro inesperado: ${err.message}`)
      } finally {
        setLoading(false)
      }
    },
    [config]
  )

  const refresh = useCallback(() => load({ force: true }), [load])

  return { issues, sprint, loading, error, refresh, load }
}
