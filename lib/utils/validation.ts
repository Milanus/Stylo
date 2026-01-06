import { z } from 'zod'

// Text transformation validation schema
export const transformTextSchema = z.object({
  text: z
    .string()
    .min(1, 'Text cannot be empty')
    .max(10000, 'Text is too long (max 10,000 characters)'),
  transformationType: z.enum(['grammar', 'formal', 'informal', 'legal', 'summary', 'expand', 'funny', 'teen', 'wholesome', 'response']),
  targetLanguage: z.string().optional(),
})

export type TransformTextInput = z.infer<typeof transformTextSchema>

// User registration validation
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

// User login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Sanitize text to prevent XSS and injection attacks
export function sanitizeText(text: string): string {
  // Remove any HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '')

  // Remove potential script injections
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/on\w+=/gi, '')

  return sanitized.trim()
}

// Detect potential prompt injection attempts
export function detectPromptInjection(text: string): boolean {
  // Normalize text to catch obfuscation attempts
  const normalized = text
    .toLowerCase()
    .replace(/[0-9]/g, (d) => ({ '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b' }[d] || d))
    .replace(/[\s\-_.,!?;:'"]+/g, ' ') // Normalize whitespace and punctuation
    .trim()

  const suspiciousPatterns = [
    // Role manipulation
    /ignore\s+(previous|above|all|prior|earlier)\s+(instructions?|prompts?|commands?|rules?|directives?)/i,
    /forget\s+(everything|all|previous|prior|earlier|what|instructions?)/i,
    /disregard\s+(previous|above|all|prior|earlier|instructions?)/i,
    /you\s+(are\s+)?(now|currently|actually)\s+(a|an|the)?/i,
    /act\s+as\s+(a|an|the)?\s*(?!grammar|editor|writer)/i, // Allow legitimate transformation requests

    // System/role override
    /system\s*[:>\-]|<\s*system\s*>|\[system\]/i,
    /assistant\s*[:>\-]|<\s*assistant\s*>|\[assistant\]/i,
    /\broot\s+(prompt|instruction|command)/i,
    /override\s+(instructions?|rules?|directives?)/i,

    // New instruction injection
    /new\s+(instructions?|task|role|rules?|directives?)/i,
    /(your\s+)?(new|updated|actual)\s+(purpose|task|role|instructions?)/i,

    // Context manipulation
    /previous\s+conversation|prior\s+context/i,
    /above\s+(prompt|instruction|text)/i,
    /original\s+(prompt|instruction|directive)/i,

    // Developer/admin keywords
    /\b(developer|admin|sudo|root)\s+(mode|access|prompt|command)/i,
    /enable\s+(admin|developer|debug|god)\s+mode/i,

    // Prompt leaking attempts
    /show\s+(me\s+)?(your|the)\s+(prompt|instructions?|system\s+message)/i,
    /what\s+(is|are)\s+your\s+(instructions?|rules?|prompts?)/i,
    /repeat\s+(your|the)\s+(above|previous|system)\s+(prompt|instructions?)/i,

    // Base64/encoding attempts (common obfuscation)
    /base64|decode|eval\s*\(|exec\s*\(/i,

    // Stop sequences
    /###\s*(end|stop|halt)|<\|endoftext\|>|<\|im_end\|>/i,
  ]

  // Check against patterns
  if (suspiciousPatterns.some(pattern => pattern.test(normalized))) {
    return true
  }

  // Additional heuristics
  // Check for excessive system-like formatting
  const systemMarkers = (text.match(/\[|\]|<|>|###|---/g) || []).length
  if (systemMarkers > 10) return true

  // Check for role-play starting phrases
  if (/^(you\s+are|pretend|imagine|act\s+like|from\s+now)/i.test(text.trim())) {
    return true
  }

  return false
}
