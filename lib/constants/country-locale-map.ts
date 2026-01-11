import { type Locale, defaultLocale } from '@/i18n/config';

// ISO 3166-1 alpha-2 country codes to locale mapping
export const countryToLocale: Record<string, Locale> = {
  // Czech
  CZ: 'cs',

  // Slovak
  SK: 'sk',

  // Spanish-speaking countries
  ES: 'es', // Spain
  MX: 'es', // Mexico
  AR: 'es', // Argentina
  CO: 'es', // Colombia
  PE: 'es', // Peru
  VE: 'es', // Venezuela
  CL: 'es', // Chile
  EC: 'es', // Ecuador
  GT: 'es', // Guatemala
  CU: 'es', // Cuba
  BO: 'es', // Bolivia
  DO: 'es', // Dominican Republic
  HN: 'es', // Honduras
  PY: 'es', // Paraguay
  SV: 'es', // El Salvador
  NI: 'es', // Nicaragua
  CR: 'es', // Costa Rica
  PA: 'es', // Panama
  UY: 'es', // Uruguay
  PR: 'es', // Puerto Rico

  // German-speaking countries
  DE: 'de', // Germany
  AT: 'de', // Austria
  CH: 'de', // Switzerland
  LI: 'de', // Liechtenstein
  LU: 'de', // Luxembourg
};

export function getLocaleFromCountry(countryCode: string | null): Locale {
  if (!countryCode) return defaultLocale;
  return countryToLocale[countryCode.toUpperCase()] ?? defaultLocale;
}
