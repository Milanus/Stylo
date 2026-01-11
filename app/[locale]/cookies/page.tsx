'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Cookie Policy</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. What Are Cookies</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Cookies are small text files that are placed on your device when you visit our website. They help us
              provide you with a better experience by remembering your preferences and understanding how you use our service.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
              This Cookie Policy explains what cookies are, how we use them, and your choices regarding cookies in compliance
              with EU ePrivacy Directive and GDPR.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Cookies We Use</h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">2.1 Strictly Necessary Cookies</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              These cookies are essential for the website to function and cannot be disabled. They do not require consent under GDPR.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 text-slate-700 dark:text-slate-300">Cookie Name</th>
                    <th className="text-left py-2 text-slate-700 dark:text-slate-300">Purpose</th>
                    <th className="text-left py-2 text-slate-700 dark:text-slate-300">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2 font-mono text-xs">sb-access-token</td>
                    <td className="py-2">Authentication session</td>
                    <td className="py-2">1 hour</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2 font-mono text-xs">sb-refresh-token</td>
                    <td className="py-2">Session refresh</td>
                    <td className="py-2">30 days</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">stylo-cookie-consent</td>
                    <td className="py-2">Remember your cookie preferences</td>
                    <td className="py-2">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-8">2.2 Functional Cookies</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              These cookies enable enhanced functionality and personalization. They require your consent.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 text-slate-700 dark:text-slate-300">Cookie Name</th>
                    <th className="text-left py-2 text-slate-700 dark:text-slate-300">Purpose</th>
                    <th className="text-left py-2 text-slate-700 dark:text-slate-300">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-2 font-mono text-xs">stylo-language-pref</td>
                    <td className="py-2">Remember your language preference</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">stylo-theme</td>
                    <td className="py-2">Remember dark/light mode preference</td>
                    <td className="py-2">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-8">2.3 Analytics Cookies</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              These cookies help us understand how visitors use our website. They require your consent.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 text-slate-700 dark:text-slate-300">Service</th>
                    <th className="text-left py-2 text-slate-700 dark:text-slate-300">Purpose</th>
                    <th className="text-left py-2 text-slate-700 dark:text-slate-300">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  <tr>
                    <td className="py-2">Vercel Analytics</td>
                    <td className="py-2">Anonymous usage statistics</td>
                    <td className="py-2">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Third-Party Cookies</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Some cookies are placed by third-party services that appear on our pages:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mt-4">
              <li>
                <strong>Supabase Authentication:</strong> Required for secure login and session management
              </li>
              <li>
                <strong>Google OAuth (if used):</strong> Required when you choose to sign in with Google
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
              These third-party services have their own privacy policies. We recommend reviewing them:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mt-4">
              <li>
                <a href="https://supabase.com/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank" rel="noopener noreferrer">
                  Supabase Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://policies.google.com/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank" rel="noopener noreferrer">
                  Google Privacy Policy
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. How We Use Cookies</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li><strong>Authentication:</strong> To keep you logged in and secure your session</li>
              <li><strong>Preferences:</strong> To remember your settings (language, theme, etc.)</li>
              <li><strong>Security:</strong> To protect against fraud and abuse</li>
              <li><strong>Performance:</strong> To understand how our service is used and improve it</li>
              <li><strong>Rate Limiting:</strong> To enforce usage limits fairly</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Your Cookie Choices</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              You have several options to manage cookies:
            </p>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 mt-6">5.1 Cookie Consent Banner</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              When you first visit our website, you'll see a cookie consent banner where you can accept or reject
              non-essential cookies. You can change your preferences at any time using the cookie settings link
              in the footer.
            </p>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 mt-6">5.2 Browser Settings</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Most web browsers allow you to control cookies through their settings:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mt-4">
              <li>
                <strong>Chrome:</strong>{' '}
                <a href="https://support.google.com/chrome/answer/95647"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank" rel="noopener noreferrer">
                  Cookie settings in Chrome
                </a>
              </li>
              <li>
                <strong>Firefox:</strong>{' '}
                <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank" rel="noopener noreferrer">
                  Cookie settings in Firefox
                </a>
              </li>
              <li>
                <strong>Safari:</strong>{' '}
                <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank" rel="noopener noreferrer">
                  Cookie settings in Safari
                </a>
              </li>
              <li>
                <strong>Edge:</strong>{' '}
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank" rel="noopener noreferrer">
                  Cookie settings in Edge
                </a>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 mt-6">5.3 Impact of Disabling Cookies</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Please note that if you disable certain cookies, some features of our service may not work properly:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mt-4">
              <li>You will need to log in each time you visit</li>
              <li>Your preferences will not be saved</li>
              <li>Some functionality may be limited</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
              Strictly necessary cookies cannot be disabled as they are essential for the service to function.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Do Not Track</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Some browsers have a "Do Not Track" feature that lets you tell websites you do not want your online
              activities tracked. We respect these signals and will not track users who have Do Not Track enabled.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Updates to This Policy</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal
              reasons. We will notify you of any material changes by updating the "Last updated" date at the top
              of this page.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Contact Us</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Email:</strong> privacy@stylo.app<br />
                <strong>Subject:</strong> Cookie Policy Inquiry
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. More Information</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              For more information about cookies and online privacy, please visit:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mt-4">
              <li>
                <a href="https://www.aboutcookies.org/" className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank" rel="noopener noreferrer">
                  AboutCookies.org
                </a>
              </li>
              <li>
                <a href="https://www.allaboutcookies.org/" className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank" rel="noopener noreferrer">
                  AllAboutCookies.org
                </a>
              </li>
              <li>
                <a href="https://ico.org.uk/for-the-public/online/cookies/" className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  target="_blank" rel="noopener noreferrer">
                  UK ICO: Cookies Guidance
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Home
            </Link>
            <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
