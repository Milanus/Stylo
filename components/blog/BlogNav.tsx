'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export function BlogNav() {
  const tCommon = useTranslations('common')

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + nav links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Stylo
            </Link>
            <div className="hidden sm:flex items-center gap-6">
              <Link
                href="/blog"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400"
              >
                Blog
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {tCommon('tryForFree')}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
