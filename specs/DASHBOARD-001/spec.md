# DASHBOARD-001 — Spec

**Status:** Implementado  
**Sprint:** v1  
**Stack:** React 18 + Vite + Chart.js + CSS próprio

---

## Objetivo

Dashboard de acompanhamento de sprint integrado à API do Jira Cloud. Exibe em tempo real: progresso de issues, burndown chart, métricas numéricas e alertas de risco.

## Critérios de Aceite

| CA | Critério | Status |
|----|---------|--------|
| CA-1 | Configuração persiste em localStorage após refresh da página | ✅ |
| CA-2 | Campos inválidos exibem erro inline após blur ou submit | ✅ |
| CA-3 | Botão "Conectar" inativo enquanto algum campo estiver vazio | ✅ |
| CA-4 | Dashboard carrega issues do sprint via Jira REST API com paginação | ✅ |
| CA-5 | Token inválido (401) exibe mensagem de erro específica | ✅ |
| CA-6 | Erro de CORS exibe orientação de como resolver | ✅ |
| CA-7 | Métricas calculadas por funções puras separadas da renderização | ✅ |
| CA-8 | Burndown exibe linha ideal e linha real com `spanGaps: true` | ✅ |
| CA-9 | Alertas: WIP excedido, issues paradas, issues sem dono | ✅ |
| CA-10 | Loading overlay visível durante fetch; botão desativado durante loading | ✅ |
| CA-11 | Banner de erro com botão "Tentar novamente" | ✅ |
| CA-12 | README com aviso de segurança sobre token em localStorage | ✅ |

## Componentes

| Componente | Responsabilidade |
|-----------|-----------------|
| `ConfigScreen` | Formulário de configuração inicial com validação |
| `Dashboard` | Container: orquestra hooks e distribui dados |
| `BurndownChart` | Gráfico de burndown (Chart.js via react-chartjs-2) |
| `ProgressCard` | Barra de progresso + percentual |
| `MetricsRow` | 4–5 cards numéricos: total, done, inProgress, todo, pts |
| `AlertsList` | Lista de alertas por severidade |
| `LoadingOverlay` | Overlay com spinner durante fetch |
| `ErrorBanner` | Banner de erro com botão de retry |

## Hooks e Utilitários

| Módulo | Responsabilidade |
|--------|-----------------|
| `useConfig` | Leitura/escrita de configuração no localStorage |
| `useJira` | Fetch paginado da API Jira + cache 5min em memória |
| `calcMetrics` | Agrupa issues por status category; calcula story points |
| `calcBurndown` | Gera labels, ideal line e real line para o Chart.js |
| `calcAlerts` | Detecta WIP_LIMIT, STALE_WIP, NO_ASSIGNEE |

## Decisões Técnicas

- **Sem backend próprio**: chamadas diretas ao Jira Cloud via `fetch` + Basic Auth
- **Cache em memória** (`useRef`): evita re-fetch desnecessário dentro da sessão; TTL de 5 minutos
- **Story points**: lê `customfield_10016` (classic) e `customfield_10028` (next-gen) com fallback
- **Burndown sem histórico**: dois pontos-âncora (dia 0 = total, hoje = restante) + `spanGaps: true`
- **Tema dark** como padrão, via design tokens em `tokens.css`

## Restrições

- Sem OAuth — autenticação por API Token apenas (v1)
- Sem histórico de burndown — calculado em runtime a partir do estado atual das issues
- CORS em localhost: usuário precisa de extensão ou proxy reverso
