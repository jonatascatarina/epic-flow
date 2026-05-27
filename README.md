# epic-flow

Dashboard de acompanhamento de sprint com dados do Jira. Exibe métricas de progresso, burndown e alertas de risco em tempo real.

React 18 + Vite + Chart.js. Zero backend próprio — todas as chamadas vão direto para a API do Jira no seu navegador.

---

## Pré-requisitos

- Node.js 18+
- Uma instância do Jira Cloud com acesso à API REST
- Um API Token do Jira (veja como obter abaixo)

---

## Instalação

```bash
git clone https://github.com/jonatascatarina/epic-flow.git
cd epic-flow
npm install
npm run dev
```

Abra `http://localhost:5173` no browser.

---

## Configuração

Na primeira vez que abrir o app, a tela de configuração será exibida. Preencha:

| Campo | Exemplo | Onde encontrar |
|-------|---------|----------------|
| URL do Jira | `https://suaempresa.atlassian.net` | Endereço do seu Jira |
| Email | `voce@empresa.com` | Email da conta Jira |
| API Token | `ATATT3xFf...` | Veja instruções abaixo |
| Board ID | `42` | URL do board: `/jira/software/projects/PROJ/boards/42` |
| Sprint ID | `123` | URL do sprint ativo no Jira Agile |

Clique em **Conectar**. As configurações são salvas em `localStorage` — persistem entre sessões no mesmo browser.

### Como obter o API Token do Jira

1. Acesse [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Clique em **Create API token**
3. Dê um nome (ex: `epic-flow`) e clique em **Create**
4. Copie o token gerado — ele não será exibido novamente
5. Cole no campo **API Token** na tela de configuração

---

## Aviso de Segurança — Leia Antes de Usar

> **O API Token do Jira dá acesso à sua conta.** Trate-o como uma senha.

**O que o epic-flow faz com o token:**
- Armazena em `localStorage` no seu browser
- Usa apenas para requisições diretas à API do Jira
- Nunca envia para nenhum servidor próprio

**Riscos e como mitigar:**

| Situação | Risco | Como mitigar |
|----------|-------|-------------|
| Computador compartilhado | Outro usuário acessa o `localStorage` e obtém o token | Use **Desconectar** ao terminar a sessão |
| Abas abertas em rede pública | Interceptação de requisições | Use apenas em redes confiáveis ou VPN |
| Token comprometido | Acesso não autorizado à conta Jira | Revogue o token em [id.atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens) |

**Como fazer logout (remover o token do browser):**

Clique em **Desconectar** na tela do dashboard. Isso apaga todas as configurações do `localStorage`, incluindo o token.

---

## Troubleshooting

### Erro de CORS em localhost

Jira Cloud pode bloquear requisições de `http://localhost` por política de CORS.

**Opções:**

1. **Extensão de browser** — instale uma extensão como "CORS Unblock" ou "Allow CORS" e ative apenas para o domínio do seu Jira. Desative quando não estiver usando.

2. **Proxy local com Vite** — adicione em `vite.config.js`:

```js
export default {
  server: {
    proxy: {
      '/jira': {
        target: 'https://suaempresa.atlassian.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jira/, ''),
      },
    },
  },
}
```

E use `http://localhost:5173/jira` como URL do Jira na configuração.

3. **Deploy em domínio próprio** — faça deploy do app em um domínio HTTPS e adicione-o à lista de origens permitidas no Jira (Jira Settings → System → CORS).

### Sprint ID não encontrado (404)

O Sprint ID é um número inteiro diferente do Board ID. Para encontrá-lo:
- Abra o board do sprint no Jira
- Na URL, procure `/rapid/views/123` ou `/boards/42?sprint=123` — o Sprint ID é o número após `sprint=`
- Alternativamente, acesse `https://suaempresa.atlassian.net/rest/agile/1.0/board/{boardId}/sprint?state=active` para listar sprints ativos

### Token inválido (401)

- Confirme que o email e o token estão corretos
- Tokens gerados em `id.atlassian.com` são vinculados à conta — use o email dessa conta
- Tokens expiram se revogados manualmente; gere um novo se necessário

---

## Stack

- [React 18](https://react.dev) + [Vite](https://vitejs.dev)
- [Chart.js](https://www.chartjs.org) + [react-chartjs-2](https://react-chartjs-2.js.org)
- CSS próprio com design tokens — sem UI framework
