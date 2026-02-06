import { NextRequest, NextResponse } from 'next/server'
import { getAvailableProviders, DEFAULT_PROVIDER, getDefaultModel } from '@/lib/llm/provider'

// API Key validation
const API_KEY = process.env.STYLO_API_KEY

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === API_KEY && API_KEY !== undefined && API_KEY !== ''
}

export async function GET(request: NextRequest) {
  try {
    // Validate API Key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    const providers = getAvailableProviders()
    const defaultProvider = providers.length > 0 ? providers[0].provider : DEFAULT_PROVIDER
    const defaultModel = providers.length > 0 ? providers[0].models[0]?.id : getDefaultModel(defaultProvider)

    return NextResponse.json({
      success: true,
      data: {
        providers,
        defaultProvider,
        defaultModel,
      },
    })
  } catch (error) {
    console.error('Failed to fetch available models:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch available models' },
      { status: 500 }
    )
  }
}
