import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/index.css'
import App from './App.jsx'
import { ConfigContext, useConfigState } from './hooks/useConfig.js'

function Root() {
  const configState = useConfigState()
  return (
    <ConfigContext.Provider value={configState}>
      <App />
    </ConfigContext.Provider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
