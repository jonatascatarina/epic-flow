import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const jiraTarget = env.VITE_JIRA_URL || ''

  return {
    plugins: [react()],
    server: {
      proxy: jiraTarget ? {
        '/jira-proxy': {
          target: jiraTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/jira-proxy/, ''),
        },
      } : {},
    },
  }
})
