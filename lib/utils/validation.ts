import { z } from 'zod'

// Text transformation validation schema
export const transformTextSchema = z.object({
  text: z
    .string()
    .min(1, 'Text cannot be empty')
    .max(10000, 'Text is too long (max 10,000 characters)'),
  transformationType: z.enum(['grammar', 'formal', 'informal', 'legal', 'summary', 'expand']),
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
  const suspiciousPatterns = [
    /ignore\s+(previous|above|all)\s+(instructions|prompts|commands)/i,
    /forget\s+(everything|all|previous)/i,
    /you\s+are\s+now/i,
    /system\s*:/i,
    /\[SYSTEM\]/i,
    /new\s+instructions/i,
    /disregard/i,
  ]

  return suspiciousPatterns.some(pattern => pattern.test(text))
}
