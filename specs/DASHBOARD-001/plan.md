# DASHBOARD-001 — Plano de Implementação

**Stack:** React 18 + Vite + Chart.js + CSS próprio
**Origem da mudança:** Migração de HTML/JS puro para React — decisão tomada após protótipo inicial evidenciar complexidade de estado que vanilla JS não gerencia bem.

---

## Visão Geral

O dashboard é uma SPA sem backend próprio. Toda a lógica roda no navegador do usuário. A comunicação com o Jira é feita diretamente via `fetch` para a API REST do Jira Cloud, usando o token armazenado em `localStorage`.

## Estrutura do Projeto

```
epic-flow/
├── src/
│   ├── main.jsx              ← entry point React
│   ├── App.jsx               ← roteador ConfigScreen ↔ Dashboard
│   ├── components/
│   │   ├── ConfigScreen.jsx  ← formulário de configuração inicial
│   │   ├── Dashboard.jsx     ← container principal do dashboard
│   │   ├── BurndownChart.jsx ← gráfico de burndown (Chart.js)
│   │   ├── ProgressCard.jsx  ← card de progresso por categoria
│   │   ├── AlertsList.jsx    ← lista de alertas de risco
│   │   └── MetricsRow.jsx    ← linha de métricas numéricas
│   ├── hooks/
│   │   ├── useJira.js        ← fetch + cache das issues do Jira
│   │   └── useConfig.js      ← leitura/escrita de config em localStorage
│   └── styles/
│       └── tokens.css        ← design tokens: cores, espaçamento, tipografia
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── constitution.md
```

## Fluxo de Dados

```
localStorage (config)
      ↓
useConfig.js
      ↓
App.jsx — decide: ConfigScreen ou Dashboard
                              ↓
                        useJira.js — fetch Jira API
                              ↓
                   issues[] + loading + error
                              ↓
              ┌───────────────┼──────────────────┐
         BurndownChart   MetricsRow + ProgressCard   AlertsList
```

## Decisões Técnicas

### React 18 + Vite
Vite substitui setup manual de bundler. `create vite@latest` com template `react` gera o scaffolding mínimo sem overhead do CRA.

### Chart.js + react-chartjs-2
Chart.js é zero-dependency de UI, mantém controle total do CSS. `react-chartjs-2` é o wrapper React oficial — evita manipulação direta de canvas.

### CSS próprio com design tokens
`tokens.css` define variáveis CSS nativas (`--color-bg`, `--color-accent`, etc.) derivadas do protótipo. Sem pré-processador, sem utility classes. Tema dark como padrão.

### useJira — fetch + cache
O hook centraliza todo o acesso à API. Cache em memória (useRef) evita re-fetch ao navegar entre abas dentro da mesma sessão. Erro de CORS tratado com mensagem orientativa (proxy ou extensão de browser).

### useConfig — localStorage
Persiste: URL do Jira, email, token, board ID, sprint ID. Validação mínima antes de salvar. Limpeza via botão "Desconectar" na ConfigScreen.

## Restrições

- Sem backend próprio — chamadas diretas ao Jira podem sofrer CORS dependendo da origem
- Token em localStorage: documentar risco no README (Artigo III da constituição)
- Sem autenticação OAuth — fora do escopo v1
- Sem persistência de histórico de burndown — dados calculados em runtime a partir das issues atuais

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| CORS bloqueado pelo Jira | Alta (em localhost) | Orientar uso de proxy CORS ou extensão de browser no README |
| Token exposto em ambiente compartilhado | Média | Aviso explícito no README + instrução de logout |
| API do Jira retornar paginação | Média | useJira deve iterar `startAt` até `total` ser atingido |
| Burndown sem histórico real | Alta | Calcular velocidade ideal vs. atual baseado em story points restantes |
