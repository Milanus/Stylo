'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const t = useTranslations('languageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    // Save preference to cookie (1 year expiry)
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;

    startTransition(() => {
      router.replace(pathname, { locale: newLocale as Locale });
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-slate-500" />
      <Select value={locale} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger className="w-[140px] h-8 text-xs">
          <SelectValue>
            {localeFlags[locale as Locale]} {localeNames[locale as Locale]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {locales.map((loc) => (
            <SelectItem key={loc} value={loc} className="text-xs">
              {localeFlags[loc]} {localeNames[loc]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
