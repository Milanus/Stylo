import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './config';

export const localePrefix = 'always';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({
    locales,
    defaultLocale,
    localePrefix,
  });
