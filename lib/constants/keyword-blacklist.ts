// Security blacklist to prevent prompt injection through keywords

export const KEYWORD_BLACKLIST = [
  // System/role manipulation
  'ignore',
  'system',
  'admin',
  'root',
  'sudo',
  'override',
  'bypass',
  'disable',
  'enable',
  'instructions',
  'prompt',
  'command',
  'directive',

  // Role manipulation
  'pretend',
  'act',
  'roleplay',
  'imagine',
  'you are',
  'assistant',
  'ai',
  'chatgpt',
  'claude',

  // Injection patterns
  'forget',
  'disregard',
  'new task',
  'new instructions',
  'developer',
  'debug',
  'eval',
  'exec',
  'base64',

  // Technical exploitation
  'script',
  'javascript',
  'html',
  'sql',
  'injection',
] as const

export function isKeywordBlacklisted(keyword: string): boolean {
  const normalized = keyword.toLowerCase().trim()
  return KEYWORD_BLACKLIST.some((blocked) =>
    normalized.includes(blocked.toLowerCase())
  )
}

export function validateKeywords(keywords: string[]): {
  valid: boolean
  invalidKeywords: string[]
} {
  const invalidKeywords = keywords.filter(isKeywordBlacklisted)
  return {
    valid: invalidKeywords.length === 0,
    invalidKeywords,
  }
}
