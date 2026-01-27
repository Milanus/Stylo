import { openai, DEFAULT_MODEL, MODEL_PRICING, ModelName } from './openai'
import {
  createMistralCompletion,
  calculateMistralCost,
  DEFAULT_MISTRAL_MODEL,
  MISTRAL_MODEL_PRICING,
  MistralModelName,
} from './mistral'

// Provider types
export type LLMProvider = 'openai' | 'mistral'

// All available models
export type AllModelNames = ModelName | MistralModelName

// LLM response interface
export interface LLMResponse {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  costUsd: number
  model: string
  provider: LLMProvider
}

// LLM options interface
export interface LLMOptions {
  temperature?: number
  maxTokens?: number
}

// Default provider from environment or fallback to OpenAI
export const DEFAULT_PROVIDER: LLMProvider =
  (process.env.DEFAULT_LLM_PROVIDER as LLMProvider) || 'openai'

// Get default model for a provider
export function getDefaultModel(provider: LLMProvider): string {
  switch (provider) {
    case 'mistral':
      return DEFAULT_MISTRAL_MODEL
    case 'openai':
    default:
      return DEFAULT_MODEL
  }
}

// Check if Mistral is available (API key is set)
export function isMistralAvailable(): boolean {
  return !!process.env.MISTRAL_API_KEY
}

// Check if OpenAI is available (API key is set)
export function isOpenAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY
}

// Main function to call LLM
export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  provider: LLMProvider = DEFAULT_PROVIDER,
  model?: string,
  options: LLMOptions = {}
): Promise<LLMResponse> {
  const { temperature = 0.3, maxTokens = 2000 } = options

  switch (provider) {
    case 'mistral':
      return callMistral(systemPrompt, userPrompt, model, temperature, maxTokens)
    case 'openai':
    default:
      return callOpenAI(systemPrompt, userPrompt, model, temperature, maxTokens)
  }
}

// OpenAI implementation
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  model?: string,
  temperature: number = 0.3,
  maxTokens: number = 2000
): Promise<LLMResponse> {
  const selectedModel = (model || DEFAULT_MODEL) as ModelName

  const completion = await openai.chat.completions.create({
    model: selectedModel,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  })

  const content = completion.choices[0]?.message?.content || ''
  const inputTokens = completion.usage?.prompt_tokens || 0
  const outputTokens = completion.usage?.completion_tokens || 0
  const totalTokens = completion.usage?.total_tokens || 0

  const pricing = MODEL_PRICING[selectedModel] || MODEL_PRICING[DEFAULT_MODEL]
  const costUsd =
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output

  return {
    content,
    usage: {
      promptTokens: inputTokens,
      completionTokens: outputTokens,
      totalTokens,
    },
    costUsd,
    model: selectedModel,
    provider: 'openai',
  }
}

// Mistral implementation
async function callMistral(
  systemPrompt: string,
  userPrompt: string,
  model?: string,
  temperature: number = 0.3,
  maxTokens: number = 2000
): Promise<LLMResponse> {
  const selectedModel = (model || DEFAULT_MISTRAL_MODEL) as MistralModelName

  const result = await createMistralCompletion(
    systemPrompt,
    userPrompt,
    selectedModel,
    temperature,
    maxTokens
  )

  const costUsd = calculateMistralCost(
    selectedModel,
    result.usage.promptTokens,
    result.usage.completionTokens
  )

  return {
    content: result.content,
    usage: result.usage,
    costUsd,
    model: selectedModel,
    provider: 'mistral',
  }
}

// Get all pricing information
export function getAllPricing(): Record<string, { input: number; output: number; provider: LLMProvider }> {
  const pricing: Record<string, { input: number; output: number; provider: LLMProvider }> = {}

  // Add OpenAI models
  for (const [model, price] of Object.entries(MODEL_PRICING)) {
    pricing[model] = { ...price, provider: 'openai' }
  }

  // Add Mistral models
  for (const [model, price] of Object.entries(MISTRAL_MODEL_PRICING)) {
    pricing[model] = { ...price, provider: 'mistral' }
  }

  return pricing
}
