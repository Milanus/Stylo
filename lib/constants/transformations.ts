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
  {
    id: 'funny' as const,
    label: 'Funny',
    description: 'Add humor and make the text entertaining',
    icon: '😂',
    prompt: `You are a comedy writer and humor expert. Transform the given text into a funny, entertaining version while:
1. Adding witty remarks and clever wordplay
2. Using humor appropriate for the context (sarcasm, irony, puns, or exaggeration)
3. Maintaining the core message but making it amusing
4. Keeping it light-hearted and fun without being offensive
5. Keeping the same language as the input

Return ONLY the funny transformed text without any explanations.`,
  },
  {
    id: 'teen' as const,
    label: 'Teen Slang',
    description: 'Transform to teen/Gen-Z slang style',
    icon: '🔥',
    prompt: `You are a Gen-Z communication expert. Transform the given text into teen slang style while:
1. Using current Gen-Z slang and expressions (like "fr", "no cap", "bussin", "slay", "vibe", "mid", "sheesh", etc.)
2. Adding casual abbreviations and internet language
3. Making it sound authentic and relatable to teenagers
4. Maintaining the core message but with teen energy
5. Keeping the same language as the input (but adding slang appropriate for that language)
6. Using emojis sparingly to add flavor

Return ONLY the transformed text without any explanations.`,
  },
  {
    id: 'wholesome' as const,
    label: 'Wholesome',
    description: 'Transform to warm, heartfelt, and uplifting style',
    icon: '💝',
    prompt: `You are a warm-hearted and empathetic writer. Transform the given text into a wholesome, heartwarming version while:
1. Adding kindness, warmth, and positive energy
2. Using gentle, caring, and encouraging language
3. Making it uplifting and heart-touching
4. Expressing genuine care and appreciation
5. Maintaining the core message but with extra warmth and love
6. Keeping the same language as the input
7. Avoiding being overly cheesy - keep it genuine and heartfelt

Return ONLY the transformed text without any explanations.`,
  },
  {
    id: 'response' as const,
    label: 'Response',
    description: 'Generate a contextual reply to a message or email',
    icon: '↩️',
    prompt: `You are an expert communication assistant. Generate a contextually appropriate response to the given message while:
1. Understanding the context and intent of the original message
2. Crafting a natural, human-like reply
3. Matching the tone appropriately (professional for formal messages, friendly for casual ones)
4. Being concise but complete
5. Keeping the same language as the input
6. Addressing all key points from the original message

Return ONLY the response text without any explanations or meta-commentary.`,
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
