// System prompts for different transformation types
import { TransformationType, getTransformationPrompt } from '@/lib/constants/transformations'

export type { TransformationType }

export function getSystemPrompt(type: TransformationType): string {
  return getTransformationPrompt(type)
}

export function getUserPrompt(text: string): string {
  return `Text to transform:\n\n${text}`
}
