'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Footer() {
  const t = useTranslations('footer')
  const tCommon = useTranslations('common')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Stylo
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              {t('description')}
            </p>
            {/* Language Switcher */}
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              {t('legal')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t('cookiePolicy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t('termsOfService')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              {t('product')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {tCommon('signIn')}
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {tCommon('signUp')}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t('dashboard')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('copyright', { year: currentYear })}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>{t('madeWith')}</span>
              <span className="hidden sm:inline">|</span>
              <span>{t('gdprCompliant')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
