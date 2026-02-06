import { z } from 'zod'
import {
  KEYWORD_LIMITS,
  KEYWORD_MAX_LENGTH,
} from '@/lib/constants/user-prompt-limits'
import { isKeywordBlacklisted } from '@/lib/constants/keyword-blacklist'

// Text transformation validation schema
export const transformTextSchema = z
  .object({
    text: z
      .string()
      .min(1, 'Text cannot be empty')
      .max(10000, 'Text is too long (max 10,000 characters)'),
    transformationType: z.enum([
      'grammar',
      'formal',
      'informal',
      'legal',
      'summary',
      'expand',
      'funny',
      'teen',
      'wholesome',
      'response',
      'keywords',
      'sales-ad',
      'business-email',
    ]).optional(),
    customPromptId: z.string().uuid().optional(),
    targetLanguage: z.string().optional(),
    humanize: z.boolean().optional().default(true),
    provider: z.enum(['openai', 'mistral', 'gemini', 'anthropic']).optional(),
    model: z.string().max(100).optional(),
  })
  .refine((data) => data.transformationType || data.customPromptId, {
    message: 'Either transformationType or customPromptId is required',
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
  // Check for invisible/zero-width characters (common obfuscation)
  const invisibleChars = /[\u200B-\u200D\uFEFF\u202A-\u202E\u2060\u180E]/g
  if (invisibleChars.test(text)) {
    return true
  }

  // Check for null bytes (can break parsers)
  if (text.includes('\x00') || text.includes('\u0000')) {
    return true
  }

  // Normalize text to catch obfuscation attempts
  const normalized = text
    .toLowerCase()
    .replace(/[0-9]/g, (d) => ({
      '0': 'o', '1': 'i', '2': 'z', '3': 'e',
      '4': 'a', '5': 's', '6': 'b', '7': 't',
      '8': 'b', '9': 'g'
    }[d] || d))
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

// Custom refinement for keyword blacklist
const safeKeyword = z
  .string()
  .min(1, 'Keyword cannot be empty')
  .max(KEYWORD_MAX_LENGTH, `Keyword must be ${KEYWORD_MAX_LENGTH} characters or less`)
  .transform((val) => val.trim()) // Remove leading/trailing whitespace
  .transform((val) => val.replace(/,/g, ' ')) // Replace commas with spaces
  .transform((val) => val.replace(/\s+/g, ' ')) // Replace multiple spaces with single space
  .transform((val) => val.trim()) // Trim again after space normalization
  .refine((keyword) => !isKeywordBlacklisted(keyword), {
    message: 'This keyword is not allowed for security reasons',
  })

// Create user prompt schema (no templateId - prompt is generated from keywords)
export const createUserPromptSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or less')
    .regex(
      /^[\p{L}\p{N}\s\-_]+$/u,
      'Name can only contain letters, numbers, spaces, hyphens, and underscores'
    ),
  keywords: z
    .array(safeKeyword)
    .min(KEYWORD_LIMITS.min, `At least ${KEYWORD_LIMITS.min} keywords required`)
    .max(KEYWORD_LIMITS.max, `Maximum ${KEYWORD_LIMITS.max} keywords allowed`),
})

// Update user prompt schema (can edit prompt directly or regenerate from keywords)
export const updateUserPromptSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[\p{L}\p{N}\s\-_]+$/u)
    .optional(),
  prompt: z
    .string()
    .min(50, 'Prompt must be at least 50 characters')
    .max(3000, 'Prompt must be at most 3000 characters')
    .optional(),
  keywords: z
    .array(safeKeyword)
    .min(KEYWORD_LIMITS.min)
    .max(KEYWORD_LIMITS.max)
    .optional(),
  regenerate: z.boolean().optional(), // If true, regenerate prompt from keywords
  isActive: z.boolean().optional(),
})

export type CreateUserPromptInput = z.infer<typeof createUserPromptSchema>
export type UpdateUserPromptInput = z.infer<typeof updateUserPromptSchema>
