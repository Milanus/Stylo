'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { X, Cookie, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

const COOKIE_CONSENT_KEY = 'stylo-cookie-consent'

interface CookiePreferences {
  necessary: boolean // Always true, cannot be changed
  functional: boolean
  analytics: boolean
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
  })
  const t = useTranslations('cookieConsent')
  const tCommon = useTranslations('common')

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000)
    } else {
      // Load saved preferences
      try {
        const savedPrefs = JSON.parse(consent)
        setPreferences(savedPrefs)
      } catch (e) {
        console.error('Failed to parse cookie consent', e)
      }
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs))
    setIsVisible(false)

    // Apply preferences (in a real app, this would enable/disable tracking)
    if (prefs.analytics) {
      // Enable analytics
      console.log('Analytics enabled')
    }
    if (prefs.functional) {
      // Enable functional cookies
      console.log('Functional cookies enabled')
    }
  }

  const handleAcceptAll = () => {
    const allEnabled = {
      necessary: true,
      functional: true,
      analytics: true,
    }
    savePreferences(allEnabled)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
    }
    savePreferences(onlyNecessary)
  }

  const handleSaveSettings = () => {
    savePreferences(preferences)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-safe">
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          {!showSettings ? (
            // Simple banner view
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    {t('title')}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t('description')}{' '}
                    <Link href="/cookies" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      {t('learnMore')}
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="text-xs flex-1 sm:flex-initial"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  {t('customize')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  className="text-xs flex-1 sm:flex-initial"
                >
                  {t('rejectAll')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex-1 sm:flex-initial"
                >
                  {t('acceptAll')}
                </Button>
              </div>
            </div>
          ) : (
            // Settings view
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('preferences.title')}
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {/* Necessary Cookies */}
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {t('preferences.necessary.title')}
                      </h4>
                      <span className="px-2 py-0.5 text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                        {t('preferences.necessary.alwaysActive')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t('preferences.necessary.description')}
                    </p>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                      {t('preferences.functional.title')}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t('preferences.functional.description')}
                    </p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                      {t('preferences.analytics.title')}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t('preferences.analytics.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="text-xs flex-1"
                >
                  {tCommon('cancel')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveSettings}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex-1"
                >
                  {t('savePreferences')}
                </Button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                {t('changeAnytime')}{' '}
                <Link href="/cookies" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  {t('cookiePolicy')}
                </Link>{' '}
                {t('forDetails')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
