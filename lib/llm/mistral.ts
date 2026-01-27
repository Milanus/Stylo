import { Mistral } from '@mistralai/mistralai'

// Mistral client - lazy initialization to avoid errors when API key is not set
let mistralClient: Mistral | null = null

export function getMistralClient(): Mistral {
  if (!mistralClient) {
    const apiKey = process.env.MISTRAL_API_KEY
    if (!apiKey) {
      throw new Error('Missing MISTRAL_API_KEY environment variable')
    }
    mistralClient = new Mistral({ apiKey })
  }
  return mistralClient
}

// Default model for Mistral
export const DEFAULT_MISTRAL_MODEL = 'mistral-small-latest'

// Mistral model pricing (per 1M tokens)
export const MISTRAL_MODEL_PRICING = {
  'mistral-small-latest': {
    input: 0.20,
    output: 0.60,
  },
  'mistral-medium-latest': {
    input: 2.70,
    output: 8.10,
  },
  'mistral-large-latest': {
    input: 3.00,
    output: 9.00,
  },
} as const

export type MistralModelName = keyof typeof MISTRAL_MODEL_PRICING

export interface MistralCompletionResult {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export async function createMistralCompletion(
  systemPrompt: string,
  userPrompt: string,
  model: MistralModelName = DEFAULT_MISTRAL_MODEL,
  temperature: number = 0.3,
  maxTokens: number = 2000
): Promise<MistralCompletionResult> {
  const client = getMistralClient()

  const response = await client.chat.complete({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    maxTokens,
  })

  const content = response.choices?.[0]?.message?.content || ''
  const usage = response.usage

  return {
    content: typeof content === 'string' ? content : '',
    usage: {
      promptTokens: usage?.promptTokens || 0,
      completionTokens: usage?.completionTokens || 0,
      totalTokens: usage?.totalTokens || 0,
    },
  }
}

export function calculateMistralCost(
  model: MistralModelName,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = MISTRAL_MODEL_PRICING[model]
  return (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  )
}
