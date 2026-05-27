# /task.implement — Implementar Jira issue

Dado um Jira issue key como parâmetro (ex: `/task.implement EP-123`), busca a
issue via MCP Atlassian e executa o pipeline SDD para implementar.

## Fluxo

1. **Receber o issue key** como `$ARGUMENTS` (ex: `EP-123`)

2. **Buscar a issue completa via MCP Atlassian:**
   - Título (summary)
   - Descrição (description)
   - Critérios de aceite (acceptance criteria — campo ou seção na descrição)
   - Story points (customfield_10016 ou customfield_10028)
   - Status atual e tipo da issue

3. **Selecionar o pipeline SDD conforme story points:**
   - `<= 3 pts` → rodar `/sdd.lite`
   - `> 3 pts` → rodar `/sdd.specify` + `/sdd.plan` + `/sdd.tasks`
   - Sem story points → perguntar ao usuário qual pipeline usar

4. **Implementar** o código conforme as tasks geradas pelo pipeline SDD.
   Seguir as regras do `constitution.md` durante a implementação.

5. **Commitar** ao final com:
   ```
   feat: implement <issue-key> <título da issue>
   ```

## Exemplo de uso

```
/task.implement EP-42
```

Claude vai buscar EP-42 no Jira, decidir o pipeline SDD conforme os story
points e implementar tudo num único fluxo guiado.
