export const locales = ['cs', 'sk', 'es', 'de', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  cs: 'Čeština',
  sk: 'Slovenčina',
  es: 'Español',
  de: 'Deutsch',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  cs: '🇨🇿',
  sk: '🇸🇰',
  es: '🇪🇸',
  de: '🇩🇪',
  en: '🇬🇧',
};
