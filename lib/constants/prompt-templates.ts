// Single source of truth for user prompt templates

export const PROMPT_TEMPLATES = [
  {
    id: 'formal' as const,
    label: 'Formal',
    icon: '💼',
    basePrompt: `Transform the text with a formal, professional tone. Focus on:
1. Using professional vocabulary and structure
2. Removing casual expressions
3. Maintaining clarity and precision`,
  },
  {
    id: 'casual' as const,
    label: 'Casual',
    icon: '💬',
    basePrompt: `Transform the text with a casual, conversational tone. Focus on:
1. Using everyday, approachable language
2. Adding friendly expressions
3. Keeping it relatable and warm`,
  },
  {
    id: 'concise' as const,
    label: 'Concise',
    icon: '📄',
    basePrompt: `Transform the text to be concise and to-the-point. Focus on:
1. Removing redundant words and phrases
2. Getting straight to the key points
3. Maintaining essential meaning with fewer words`,
  },
  {
    id: 'detailed' as const,
    label: 'Detailed',
    icon: '📖',
    basePrompt: `Transform the text with more detail and elaboration. Focus on:
1. Adding relevant context and examples
2. Expanding key points for clarity
3. Providing comprehensive coverage`,
  },
  {
    id: 'creative' as const,
    label: 'Creative',
    icon: '🎨',
    basePrompt: `Transform the text with creative flair. Focus on:
1. Using vivid, engaging language
2. Adding creative expressions and metaphors
3. Making the text memorable and unique`,
  },
  {
    id: 'technical' as const,
    label: 'Technical',
    icon: '🔧',
    basePrompt: `Transform the text with technical precision. Focus on:
1. Using accurate technical terminology
2. Maintaining logical structure
3. Ensuring technical clarity and accuracy`,
  },
] as const

export type PromptTemplateId = (typeof PROMPT_TEMPLATES)[number]['id']

export const VALID_TEMPLATE_IDS = PROMPT_TEMPLATES.map((t) => t.id) as [
  PromptTemplateId,
  ...PromptTemplateId[],
]

export function getPromptTemplate(templateId: PromptTemplateId) {
  return PROMPT_TEMPLATES.find((t) => t.id === templateId)
}

export function getAllTemplates() {
  return PROMPT_TEMPLATES.map((t) => ({
    id: t.id,
    label: t.label,
    icon: t.icon,
  }))
}
