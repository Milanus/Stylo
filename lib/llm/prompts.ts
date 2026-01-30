// System prompts for different transformation types
import { TransformationType, getTransformationPrompt } from '@/lib/constants/transformations'
import { HUMANIZE_INSTRUCTIONS, HUMANIZE_SUFFIX } from '@/lib/constants/humanize-rules'

export type { TransformationType }

export function getSystemPrompt(
  type: TransformationType,
  targetLanguage?: string,
  humanize: boolean = true
): string {
  let prompt = getTransformationPrompt(type, targetLanguage)

  if (humanize) {
    prompt = HUMANIZE_INSTRUCTIONS + '\n\n' + prompt + HUMANIZE_SUFFIX
  }

  return prompt
}

export function getUserPrompt(text: string): string {
  return `Text to transform:\n\n${text}`
}
