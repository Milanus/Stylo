import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Default model for text transformations
export const DEFAULT_MODEL = 'gpt-4o-mini'

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
} as const

export type ModelName = keyof typeof MODEL_PRICING
