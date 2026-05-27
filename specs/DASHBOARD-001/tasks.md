# DASHBOARD-001 — Tasks

Legenda: 🟢 Concluída | 🟡 Em progresso | 🔴 Não iniciada | ⏸ Bloqueada

---

## T1 🟢 Setup Vite + React + dependências

**O que fazer:** Criar o projeto com `npm create vite@latest epic-flow -- --template react`, instalar `chart.js` e `react-chartjs-2`. Confirmar que `npm run dev` sobe sem erros.

**Critério de conclusão:** `npm run dev` abre o app React no browser. `package.json` contém `chart.js` e `react-chartjs-2` nas dependências.

---

## T2 🟢 Design tokens CSS + layout base dark

**O que fazer:** Criar `src/styles/tokens.css` com variáveis CSS para cores (bg, surface, accent, text, danger, warning), espaçamento e tipografia derivados do protótipo. Aplicar tema dark como padrão no `index.html` e `App.jsx`.

**Critério de conclusão:** App renderiza com fundo escuro e tokens aplicados. Nenhuma cor hardcoded nos componentes.

---

## T3 🟢 ConfigScreen (form + useConfig hook + localStorage)

**O que fazer:** Implementar `useConfig.js` (read/write localStorage) e `ConfigScreen.jsx` com campos: URL do Jira, email, API token, Board ID, Sprint ID. Validação mínima antes de salvar. Botão "Conectar" navega para Dashboard.

**Critério de conclusão:** Configuração persiste após refresh. Campos inválidos mostram erro inline. "Conectar" só ativa com todos os campos preenchidos.

---

## T4 🟡 useJira hook (fetch Jira API + erro handling + loading)

**O que fazer:** Implementar `useJira.js` que usa config do `useConfig` para buscar issues do sprint via Jira REST API (`/rest/api/3/search`). Tratar: loading state, erro de autenticação (401), erro de CORS, paginação (`startAt` + `maxResults`).

**Critério de conclusão:** Hook retorna `{ issues, loading, error, refresh }`. Com config válida, retorna issues do sprint. Com token inválido, retorna mensagem de erro específica. Com CORS bloqueado, orienta o usuário.

---

## T5 🟡 Cálculo de métricas (total, done, in progress, todo, %)

**O que fazer:** Criar funções puras (sem efeitos colaterais) que recebem `issues[]` e retornam: total de issues, concluídas, em progresso, a fazer, percentual de conclusão, story points por categoria (se disponível).

**Critério de conclusão:** Funções exportadas e testáveis isoladamente. `MetricsRow` e `ProgressCard` consomem apenas o retorno dessas funções, sem processar `issues[]` diretamente.

---

## T6 🟡 BurndownChart (Chart.js + react-chartjs-2)

**O que fazer:** Implementar `BurndownChart.jsx` com gráfico de linha mostrando: linha ideal (story points / dias do sprint) e linha real (story points restantes por dia). Usar `react-chartjs-2` — sem manipulação direta de canvas.

**Critério de conclusão:** Gráfico renderiza com dados do sprint ativo. Linha ideal e linha real visualmente distintas. Tooltip mostra valor ao hover. Responsivo (usa `maintainAspectRatio: false` + container CSS).

---

## T7 🟢 ProgressCard + MetricsRow

**O que fazer:** Implementar `ProgressCard.jsx` (barra de progresso visual com percentual) e `MetricsRow.jsx` (linha com cards numéricos: total, done, in progress, todo). Consumir funções de métricas da T5.

**Critério de conclusão:** Componentes renderizam corretamente com dados mock. Sem lógica de cálculo inline — apenas apresentação.

---

## T8 🟡 AlertsList (WIP, stale, sem assignee)

**O que fazer:** Implementar `AlertsList.jsx` com três categorias de alerta: issues WIP há mais de N dias (configurável), issues sem assignee, issues em status "In Progress" acima do limite de WIP. Cada alerta mostra: tipo, issue key, resumo e ação sugerida.

**Critério de conclusão:** Lista exibe alertas corretos para dados mock com cenários de risco. Issues sem problema não aparecem na lista. Seção vazia exibe "Nenhum alerta no momento".

---

## T9 🟢 Refresh + loading state + erro state global

**O que fazer:** Adicionar botão "Atualizar" no Dashboard que chama `refresh()` do `useJira`. Implementar loading overlay durante fetch. Implementar banner de erro global com opção de retry. Desabilitar botão durante loading.

**Critério de conclusão:** Loading state visível durante fetch. Erro de API exibe mensagem com botão "Tentar novamente". Botão "Atualizar" desabilitado enquanto loading está ativo.

---

## T10 🔴 README setup + aviso segurança API Token

**O que fazer:** Escrever `README.md` com: pré-requisitos, instalação (`npm install` + `npm run dev`), como configurar (URL Jira, email, token, IDs), como obter o API Token no Jira, seção de aviso de segurança sobre o token em localStorage, troubleshooting de CORS.

**Critério de conclusão:** README permite que um novo usuário configure e use o dashboard sem consultar o código. Seção de segurança explícita sobre riscos do token. Instrução de logout documentada.

---

## Bloqueadores

- T10 🔴 — bloqueia merge para `main` (Artigo VI da constituição)
