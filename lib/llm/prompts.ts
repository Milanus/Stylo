// System prompts for different transformation types
import { TransformationType, getTransformationPrompt } from '@/lib/constants/transformations'

export type { TransformationType }

export function getSystemPrompt(type: TransformationType, targetLanguage?: string): string {
  return getTransformationPrompt(type, targetLanguage)
}

export function getUserPrompt(text: string): string {
  return `Text to transform:\n\n${text}`
}
