'use client'

import { useEffect } from 'react'

const COOKIE_CONSENT_KEY = 'stylo-cookie-consent'

export default function GoogleAnalytics() {
  useEffect(() => {
    const updateConsent = () => {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
      if (consent) {
        try {
          const prefs = JSON.parse(consent)
          const w = window as unknown as { gtag?: (...args: unknown[]) => void }
          if (typeof w.gtag === 'function') {
            w.gtag('consent', 'update', {
              analytics_storage: prefs.analytics ? 'granted' : 'denied',
              functionality_storage: prefs.functional ? 'granted' : 'denied',
            })
          }
        } catch {
          // ignore parse errors
        }
      }
    }

    updateConsent()

    const handleConsentUpdate = () => updateConsent()
    window.addEventListener('cookie-consent-update', handleConsentUpdate)

    return () => {
      window.removeEventListener('cookie-consent-update', handleConsentUpdate)
    }
  }, [])

  return null
}
