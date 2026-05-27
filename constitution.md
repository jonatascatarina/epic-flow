# constitution.md — epic-flow

Regras que governam o desenvolvimento deste projeto. Leia antes de qualquer tarefa.

---

## Artigo I — Propósito

epic-flow é um dashboard de acompanhamento de sprint construído sobre a API do Jira. Exibe métricas de progresso, burndown e alertas de risco em tempo real. Destinado a times ágeis que precisam de visibilidade imediata sem abrir o Jira.

## Artigo II — Stack

- **Frontend:** React 18 via Vite (`create vite@latest`)
- **Gráficos:** Chart.js + react-chartjs-2
- **Estilos:** CSS próprio com design tokens em `src/styles/tokens.css` — sem UI framework externo
- **Estado:** React hooks nativos — sem Redux, Zustand ou Context desnecessário
- **Build:** Vite — sem CRA, sem webpack manual

Nenhuma UI library (MUI, Shadcn, Ant Design, etc.) será adicionada sem ADR aprovado.

## Artigo III — Segurança

- O token de API do Jira NUNCA é commitado no repositório
- Credenciais são armazenadas exclusivamente em `localStorage` via `useConfig`
- O README deve conter aviso explícito sobre riscos de expor o token em ambiente compartilhado
- Nenhum dado de autenticação trafega para servidor próprio — todas as chamadas são diretas ao Jira

## Artigo IV — Arquitetura

- Componentes em `src/components/` — um arquivo por componente, PascalCase
- Hooks customizados em `src/hooks/` — prefixo `use`, camelCase
- Design tokens em `src/styles/tokens.css` — variáveis CSS nativas, sem pré-processador
- `App.jsx` é apenas roteador de estado (ConfigScreen ↔ Dashboard) — sem lógica de negócio
- Lógica de fetch isolada em `useJira.js` — componentes não fazem fetch diretamente

## Artigo V — Qualidade

- Nenhum componente renderiza sem loading state e erro state tratados
- `useJira` deve ter cache mínimo para evitar re-fetch desnecessário na mesma sessão
- Refresh manual obrigatório — sem polling automático na versão inicial
- Cálculo de métricas isolado de renderização: funções puras testáveis

## Artigo VI — Processo

- Toda mudança de stack exige atualização de `constitution.md`, `plan.md` e `tasks.md`
- Tasks com status 🔴 bloqueiam merge para `main`
- README atualizado a cada release
