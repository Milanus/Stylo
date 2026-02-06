import OpenAI from 'openai'

// Lazy initialization to avoid crashes when API key is not set
let openaiClient: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY environment variable')
    }
    openaiClient = new OpenAI({ apiKey })
  }
  return openaiClient
}

// Default model for text transformations
export const DEFAULT_MODEL = 'gpt-5-nano'

// Model pricing (per 1M tokens)
export const MODEL_PRICING = {
  'gpt-4o-mini': {
    input: 0.150,
    output: 0.600,
  },
  'gpt-4o': {
    input: 2.50,
    output: 10.00,
  },
  'gpt-5-nano': {
    input: 0.05,
    output: 0.40,
  },
  'gpt-5-mini': {
    input: 0.50,
    output: 5.00,
  },
} as const

export type ModelName = keyof typeof MODEL_PRICING
