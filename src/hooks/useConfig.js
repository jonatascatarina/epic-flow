import { useState, useCallback } from 'react'

const STORAGE_KEY = 'epic-flow-config'

export function useConfig() {
  const [config, setConfig] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const saveConfig = useCallback((values) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
    setConfig(values)
  }, [])

  const clearConfig = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setConfig(null)
  }, [])

  return { config, saveConfig, clearConfig }
}
