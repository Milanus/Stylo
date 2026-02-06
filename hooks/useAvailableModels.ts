'use client'

import { useState, useEffect } from 'react'

interface ModelInfo {
  id: string
  name: string
  pricing: { input: number; output: number }
}

interface ProviderInfo {
  provider: string
  name: string
  models: ModelInfo[]
}

interface AvailableModelsData {
  providers: ProviderInfo[]
  defaultProvider: string | null
  defaultModel: string | null
}

export function useAvailableModels() {
  const [data, setData] = useState<AvailableModelsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/models', {
          headers: { 'X-API-Key': process.env.NEXT_PUBLIC_STYLO_API_KEY || '' },
        })
        if (!response.ok) throw new Error('Failed to fetch models')
        const json = await response.json()
        if (json.success) {
          setData(json.data)
        } else {
          throw new Error(json.error || 'Unknown error')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }
    fetchModels()
  }, [])

  return { data, isLoading, error }
}
