import { useConfig } from './hooks/useConfig'
import ConfigScreen from './components/ConfigScreen'
import Dashboard from './components/Dashboard'

export default function App() {
  const { config, clearConfig } = useConfig()

  if (!config) return <ConfigScreen />
  return <Dashboard onDisconnect={clearConfig} />
}
