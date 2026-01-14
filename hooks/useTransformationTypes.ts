'use client'

import { useState, useEffect } from 'react'
import type { TransformationType } from '@/types/transformation'

interface UseTransformationTypesReturn {
  types: TransformationType[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useTransformationTypes(): UseTransformationTypesReturn {
  const [types, setTypes] = useState<TransformationType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTypes = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/transformation-types')

      if (!response.ok) {
        throw new Error(`Failed to fetch transformation types: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.data)) {
        setTypes(data.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching transformation types:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTypes()
  }, [])

  return {
    types,
    isLoading,
    error,
    refetch: fetchTypes,
  }
}
