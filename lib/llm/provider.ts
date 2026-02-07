import { getOpenAIClient, DEFAULT_MODEL, MODEL_PRICING, ModelName } from './openai'
import {
  createMistralCompletion,
  calculateMistralCost,
  DEFAULT_MISTRAL_MODEL,
  MISTRAL_MODEL_PRICING,
  MistralModelName,
} from './mistral'
import {
  createGeminiCompletion,
  calculateGeminiCost,
  DEFAULT_GEMINI_MODEL,
  GEMINI_MODEL_PRICING,
  GeminiModelName,
} from './gemini'
import {
  createAnthropicCompletion,
  calculateAnthropicCost,
  DEFAULT_ANTHROPIC_MODEL,
  ANTHROPIC_MODEL_PRICING,
  AnthropicModelName,
} from './anthropic'

// Provider types
export type LLMProvider = 'openai' | 'mistral' | 'gemini' | 'anthropic'

// All available models
export type AllModelNames = ModelName | MistralModelName | GeminiModelName | AnthropicModelName

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
    case 'gemini':
      return DEFAULT_GEMINI_MODEL
    case 'anthropic':
      return DEFAULT_ANTHROPIC_MODEL
    case 'openai':
    default:
      return DEFAULT_MODEL
  }
}

// Check if providers are available (API key is set)
export function isOpenAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY
}

export function isMistralAvailable(): boolean {
  return !!process.env.MISTRAL_API_KEY
}

export function isGeminiAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY
}

export function isAnthropicAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY
}

// Get valid model IDs for a provider
export function getValidModels(provider: LLMProvider): string[] {
  switch (provider) {
    case 'openai':
      return Object.keys(MODEL_PRICING)
    case 'mistral':
      return Object.keys(MISTRAL_MODEL_PRICING)
    case 'gemini':
      return Object.keys(GEMINI_MODEL_PRICING)
    case 'anthropic':
      return Object.keys(ANTHROPIC_MODEL_PRICING)
    default:
      return []
  }
}

// Validate that a model belongs to the given provider's allowlist
export function isValidModel(provider: LLMProvider, model: string): boolean {
  return getValidModels(provider).includes(model)
}

// Models available to free/anonymous users (cost-effective models only)
// Paid users have access to all models
export const FREE_TIER_MODELS: Record<LLMProvider, string[]> = {
  openai: ['gpt-5-nano', 'gpt-5-mini', 'gpt-4o-mini'],
  mistral: ['mistral-small-latest', 'mistral-medium-latest', 'mistral-large-latest'],
  gemini: ['gemini-2.5-flash', 'gemini-2.5-flash-lite'],
  anthropic: ['claude-haiku-4-5-20251001'],
}

// Check if a model is allowed for the given subscription tier
export function isModelAllowedForTier(
  provider: LLMProvider,
  model: string,
  tier: 'anonymous' | 'free' | 'paid'
): boolean {
  // Paid users can use any valid model
  if (tier === 'paid') return true
  // Free/anonymous users are restricted to cost-effective models
  return FREE_TIER_MODELS[provider]?.includes(model) ?? false
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

  // Validate model against allowlist if provided
  if (model && !isValidModel(provider, model)) {
    throw new Error(
      `Invalid model "${model}" for provider "${provider}". Valid models: ${getValidModels(provider).join(', ')}`
    )
  }

  switch (provider) {
    case 'mistral':
      return callMistral(systemPrompt, userPrompt, model, temperature, maxTokens)
    case 'gemini':
      return callGemini(systemPrompt, userPrompt, model, temperature, maxTokens)
    case 'anthropic':
      return callAnthropic(systemPrompt, userPrompt, model, temperature, maxTokens)
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

  // GPT-5 models require max_completion_tokens and only support default temperature
  const isGpt5 = selectedModel.startsWith('gpt-5')

  const completion = await getOpenAIClient().chat.completions.create({
    model: selectedModel,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    ...(isGpt5 ? {} : { temperature }),
    ...(isGpt5 ? { max_completion_tokens: maxTokens } : { max_tokens: maxTokens }),
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

// Gemini implementation
async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  model?: string,
  temperature: number = 0.3,
  maxTokens: number = 2000
): Promise<LLMResponse> {
  const selectedModel = (model || DEFAULT_GEMINI_MODEL) as GeminiModelName

  const result = await createGeminiCompletion(
    systemPrompt,
    userPrompt,
    selectedModel,
    temperature,
    maxTokens
  )

  const costUsd = calculateGeminiCost(
    selectedModel,
    result.usage.promptTokens,
    result.usage.completionTokens
  )

  return {
    content: result.content,
    usage: result.usage,
    costUsd,
    model: selectedModel,
    provider: 'gemini',
  }
}

// Anthropic implementation
async function callAnthropic(
  systemPrompt: string,
  userPrompt: string,
  model?: string,
  temperature: number = 0.3,
  maxTokens: number = 2000
): Promise<LLMResponse> {
  const selectedModel = (model || DEFAULT_ANTHROPIC_MODEL) as AnthropicModelName

  const result = await createAnthropicCompletion(
    systemPrompt,
    userPrompt,
    selectedModel,
    temperature,
    maxTokens
  )

  const costUsd = calculateAnthropicCost(
    selectedModel,
    result.usage.promptTokens,
    result.usage.completionTokens
  )

  return {
    content: result.content,
    usage: result.usage,
    costUsd,
    model: selectedModel,
    provider: 'anthropic',
  }
}

// Get all pricing information
export function getAllPricing(): Record<string, { input: number; output: number; provider: LLMProvider }> {
  const pricing: Record<string, { input: number; output: number; provider: LLMProvider }> = {}

  for (const [model, price] of Object.entries(MODEL_PRICING)) {
    pricing[model] = { ...price, provider: 'openai' }
  }

  for (const [model, price] of Object.entries(MISTRAL_MODEL_PRICING)) {
    pricing[model] = { ...price, provider: 'mistral' }
  }

  for (const [model, price] of Object.entries(GEMINI_MODEL_PRICING)) {
    pricing[model] = { ...price, provider: 'gemini' }
  }

  for (const [model, price] of Object.entries(ANTHROPIC_MODEL_PRICING)) {
    pricing[model] = { ...price, provider: 'anthropic' }
  }

  return pricing
}

// Get available providers and their models (based on configured API keys)
export function getAvailableProviders(): Array<{
  provider: LLMProvider
  name: string
  models: Array<{ id: string; name: string; pricing: { input: number; output: number }; paidOnly: boolean }>
}> {
  const providers: Array<{
    provider: LLMProvider
    name: string
    models: Array<{ id: string; name: string; pricing: { input: number; output: number }; paidOnly: boolean }>
  }> = []

  // Hidden models - not shown in UI but still functional via API
  const HIDDEN_MODELS = ['gpt-4o']

  // Model display names - these are translation keys used by the client (modelLabels.fast, etc.)
  const MODEL_DISPLAY_NAMES: Record<string, string> = {
    // OpenAI
    'gpt-4o-mini': 'fast',
    'gpt-5-nano': 'medium',
    'gpt-5-mini': 'accurate',
    // Mistral
    'mistral-small-latest': 'lightning',
    'mistral-medium-latest': 'balanced',
    'mistral-large-latest': 'precise',
    // Gemini
    'gemini-2.5-flash-lite': 'swift',
    'gemini-2.5-flash': 'smart',
  }

  const buildModels = (
    providerKey: LLMProvider,
    pricingMap: Record<string, { input: number; output: number }>
  ) =>
    Object.entries(pricingMap)
      .filter(([id]) => !HIDDEN_MODELS.includes(id))
      .map(([id, pricing]) => ({
        id,
        name: MODEL_DISPLAY_NAMES[id] || id,
        pricing,
        paidOnly: !FREE_TIER_MODELS[providerKey]?.includes(id),
      }))

  if (isOpenAIAvailable()) {
    providers.push({
      provider: 'openai',
      name: 'OpenAI',
      models: buildModels('openai', MODEL_PRICING),
    })
  }

  if (isMistralAvailable()) {
    providers.push({
      provider: 'mistral',
      name: 'Mistral AI',
      models: buildModels('mistral', MISTRAL_MODEL_PRICING),
    })
  }

  if (isGeminiAvailable()) {
    providers.push({
      provider: 'gemini',
      name: 'Google Gemini',
      models: buildModels('gemini', GEMINI_MODEL_PRICING),
    })
  }

  if (isAnthropicAvailable()) {
    providers.push({
      provider: 'anthropic',
      name: 'Anthropic',
      models: buildModels('anthropic', ANTHROPIC_MODEL_PRICING),
    })
  }

  return providers
}
