import Anthropic from '@anthropic-ai/sdk'

// Lazy initialization to avoid crashes when API key is not set
let anthropicClient: Anthropic | null = null

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('Missing ANTHROPIC_API_KEY environment variable')
    }
    anthropicClient = new Anthropic({ apiKey })
  }
  return anthropicClient
}

// Default model for Anthropic
export const DEFAULT_ANTHROPIC_MODEL = 'claude-sonnet-4-5-20250929'

// Anthropic model pricing (per 1M tokens)
export const ANTHROPIC_MODEL_PRICING = {
  'claude-sonnet-4-5-20250929': {
    input: 3.00,
    output: 15.00,
  },
  'claude-haiku-4-5-20251001': {
    input: 0.80,
    output: 4.00,
  },
} as const

export type AnthropicModelName = keyof typeof ANTHROPIC_MODEL_PRICING

export interface AnthropicCompletionResult {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export async function createAnthropicCompletion(
  systemPrompt: string,
  userPrompt: string,
  model: AnthropicModelName = DEFAULT_ANTHROPIC_MODEL,
  temperature: number = 0.3,
  maxTokens: number = 2000
): Promise<AnthropicCompletionResult> {
  const client = getAnthropicClient()

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userPrompt },
    ],
  })

  const content = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('')

  return {
    content,
    usage: {
      promptTokens: response.usage.input_tokens,
      completionTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens,
    },
  }
}

export function calculateAnthropicCost(
  model: AnthropicModelName,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = ANTHROPIC_MODEL_PRICING[model]
  return (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  )
}
