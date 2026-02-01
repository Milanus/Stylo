'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

const GA_ID = 'G-5KTEHJPS9M'
const COOKIE_CONSENT_KEY = 'stylo-cookie-consent'

export default function GoogleAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
      if (consent) {
        try {
          const prefs = JSON.parse(consent)
          setConsentGiven(prefs.analytics === true)
        } catch {
          setConsentGiven(false)
        }
      }
    }

    checkConsent()

    // Listen for consent changes from CookieConsent component
    const handleStorage = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_KEY) {
        checkConsent()
      }
    }

    // Also listen for custom event for same-tab updates
    const handleConsentUpdate = () => checkConsent()

    window.addEventListener('storage', handleStorage)
    window.addEventListener('cookie-consent-update', handleConsentUpdate)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('cookie-consent-update', handleConsentUpdate)
    }
  }, [])

  if (!consentGiven) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
