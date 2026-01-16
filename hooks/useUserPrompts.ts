'use client'

import { useState, useEffect, useCallback } from 'react'

export interface UserPrompt {
  id: string
  name: string
  prompt: string
  keywords: string[]
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

interface UserPromptsMeta {
  count: number
  limit: number | null
  remaining: number | null
}

interface UserPromptsState {
  prompts: UserPrompt[]
  isLoading: boolean
  error: string | null
  meta: UserPromptsMeta
}

export function useUserPrompts() {
  const [state, setState] = useState<UserPromptsState>({
    prompts: [],
    isLoading: true,
    error: null,
    meta: { count: 0, limit: null, remaining: null },
  })

  const fetchPrompts = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/user-prompts', {
        headers: {
          'X-API-Key': process.env.NEXT_PUBLIC_STYLO_API_KEY || '',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch prompts')
      }

      setState({
        prompts: data.data,
        isLoading: false,
        error: null,
        meta: data.meta,
      })
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }))
    }
  }, [])

  const createPrompt = async (data: {
    name: string
    keywords: string[]
  }): Promise<UserPrompt> => {
    const response = await fetch('/api/user-prompts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_STYLO_API_KEY || '',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create prompt')
    }

    // Refresh list
    await fetchPrompts()

    return result.data
  }

  const updatePrompt = async (
    id: string,
    data: {
      name?: string
      prompt?: string
      keywords?: string[]
      regenerate?: boolean
    }
  ): Promise<UserPrompt> => {
    const response = await fetch(`/api/user-prompts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_STYLO_API_KEY || '',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update prompt')
    }

    await fetchPrompts()

    return result.data
  }

  const deletePrompt = async (id: string): Promise<void> => {
    const response = await fetch(`/api/user-prompts/${id}`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_STYLO_API_KEY || '',
      },
    })

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'Failed to delete prompt')
    }

    await fetchPrompts()
  }

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  return {
    ...state,
    refetch: fetchPrompts,
    createPrompt,
    updatePrompt,
    deletePrompt,
  }
}
