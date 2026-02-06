import { GoogleGenerativeAI } from '@google/generative-ai'

// Lazy initialization to avoid crashes when API key is not set
let geminiClient: GoogleGenerativeAI | null = null

export function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      throw new Error('Missing GOOGLE_AI_API_KEY environment variable')
    }
    geminiClient = new GoogleGenerativeAI(apiKey)
  }
  return geminiClient
}

// Default model for Gemini
export const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash'

// Gemini model pricing (per 1M tokens)
export const GEMINI_MODEL_PRICING = {
  'gemini-2.0-flash': {
    input: 0.10,
    output: 0.40,
  },
  'gemini-2.0-flash-lite': {
    input: 0.075,
    output: 0.30,
  },
} as const

export type GeminiModelName = keyof typeof GEMINI_MODEL_PRICING

export interface GeminiCompletionResult {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export async function createGeminiCompletion(
  systemPrompt: string,
  userPrompt: string,
  model: GeminiModelName = DEFAULT_GEMINI_MODEL,
  temperature: number = 0.3,
  maxTokens: number = 2000
): Promise<GeminiCompletionResult> {
  const client = getGeminiClient()
  const generativeModel = client.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
  })

  const result = await generativeModel.generateContent(userPrompt)
  const response = result.response
  const content = response.text() || ''
  const usage = response.usageMetadata

  return {
    content,
    usage: {
      promptTokens: usage?.promptTokenCount || 0,
      completionTokens: usage?.candidatesTokenCount || 0,
      totalTokens: usage?.totalTokenCount || 0,
    },
  }
}

export function calculateGeminiCost(
  model: GeminiModelName,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = GEMINI_MODEL_PRICING[model]
  return (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  )
}
