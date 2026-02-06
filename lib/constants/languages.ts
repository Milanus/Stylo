export const SUPPORTED_LANGUAGES = [
  { code: 'auto', label: 'Auto (detect from input)' },
  { code: 'cs', label: 'Čeština' },
  { code: 'sk', label: 'Slovenčina' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
] as const

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code']
