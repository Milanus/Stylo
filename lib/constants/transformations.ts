// Single source of truth for transformation types
// This file centralizes all transformation type definitions to avoid duplication

export const TRANSFORMATION_TYPES = [
  {
    id: 'grammar' as const,
    label: 'Grammar',
    description: 'Fix grammatical errors and spelling mistakes',
    icon: '✓',
    prompt: `You are a professional grammar and spelling checker. Your task is to:
1. Correct all spelling mistakes
2. Fix grammatical errors
3. Improve punctuation
4. Maintain the original tone and style
5. Keep the same language as the input

Return ONLY the corrected text without any explanations or additional comments.`,
  },
  {
    id: 'formal' as const,
    label: 'Formal',
    description: 'Convert to professional, formal writing',
    icon: '💼',
    prompt: `You are a professional writing assistant. Transform the given text into a formal, professional style while:
1. Maintaining the core message and meaning
2. Using professional vocabulary
3. Improving sentence structure for clarity
4. Removing casual expressions and slang
5. Keeping the same language as the input

Return ONLY the transformed text without any explanations.`,
  },
  {
    id: 'informal' as const,
    label: 'Casual',
    description: 'Convert to casual, conversational writing',
    icon: '💬',
    prompt: `You are a friendly writing assistant. Transform the given text into a casual, conversational style while:
1. Maintaining the core message
2. Using everyday language
3. Making it sound friendly and approachable
4. Adding appropriate casual expressions
5. Keeping the same language as the input

Return ONLY the transformed text without any explanations.`,
  },
  {
    id: 'legal' as const,
    label: 'Legal',
    description: 'Transform into formal legal writing',
    icon: '⚖',
    prompt: `You are a legal writing assistant. Transform the given text into a formal legal style while:
1. Using precise legal terminology where appropriate
2. Maintaining formal structure
3. Being clear and unambiguous
4. Following legal writing conventions
5. Keeping the same language as the input

Return ONLY the transformed text without any explanations.`,
  },
  {
    id: 'summary' as const,
    label: 'Summary',
    description: 'Create a concise summary (30-50% of original)',
    icon: '📄',
    prompt: `You are a summarization expert. Create a concise summary of the given text by:
1. Identifying key points and main ideas
2. Removing redundant information
3. Maintaining factual accuracy
4. Keeping the same language as the input
5. Making it 30-50% of the original length

Return ONLY the summary without any explanations.`,
  },
  {
    id: 'expand' as const,
    label: 'Expand',
    description: 'Elaborate and expand the text (150-200%)',
    icon: '📖',
    prompt: `You are a writing expansion assistant. Expand the given text by:
1. Adding relevant details and examples
2. Elaborating on key points
3. Improving clarity and depth
4. Maintaining the original tone
5. Keeping the same language as the input
6. Making it 150-200% of the original length

Return ONLY the expanded text without any explanations.`,
  },
] as const

// Export type from the array
export type TransformationType = typeof TRANSFORMATION_TYPES[number]['id']

// Helper function to get prompt by type
export function getTransformationPrompt(type: TransformationType, targetLanguage?: string): string {
  const transformation = TRANSFORMATION_TYPES.find(t => t.id === type)
  if (!transformation) {
    throw new Error(`Unknown transformation type: ${type}`)
  }

  let prompt: string = transformation.prompt

  // If target language is specified and not 'auto', modify the prompt
  if (targetLanguage && targetLanguage !== 'auto') {
    const languageNames: Record<string, string> = {
      'cs': 'Czech',
      'sk': 'Slovak',
      'en': 'English',
      'es': 'Spanish',
    }

    const langName = languageNames[targetLanguage] || targetLanguage

    // Replace "Keep the same language as the input" or "Keeping the same language as the input"
    prompt = prompt.replace(
      /Keep(ing)? the same language as the input/g,
      `Respond in ${langName} language`
    )

    // Add language requirement at the beginning
    prompt = `IMPORTANT: The output must be in ${langName} language.\n\n${prompt}`
  }

  return prompt
}

// Helper function to get transformation metadata
export function getTransformationMetadata(type: TransformationType) {
  const transformation = TRANSFORMATION_TYPES.find(t => t.id === type)
  if (!transformation) {
    throw new Error(`Unknown transformation type: ${type}`)
  }
  return {
    id: transformation.id,
    label: transformation.label,
    description: transformation.description,
    icon: transformation.icon,
  }
}

// For API responses
export function getAllTransformationTypes() {
  return TRANSFORMATION_TYPES.map(t => ({
    id: t.id,
    label: t.label,
    description: t.description,
  }))
}
