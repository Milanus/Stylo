'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PrivacyPage() {
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
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Introduction</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Welcome to Stylo ("we", "our", or "us"). We are committed to protecting your personal data and respecting your privacy rights.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our text transformation service.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
              This policy complies with the EU General Data Protection Regulation (GDPR) and other applicable data protection laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Data Controller</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              For the purposes of GDPR, the data controller is:
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mt-4">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Stylo<br />
                Email: privacy@stylo.app<br />
                European Representative: [Your EU Representative Details]
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Data We Collect</h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">3.1 Account Information</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>Email address (when you sign up)</li>
              <li>Password (encrypted)</li>
              <li>OAuth provider information (if you sign in with Google)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">3.2 Usage Data</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>Text submitted for transformation (temporarily stored)</li>
              <li>Transformation type selected</li>
              <li>IP address (for rate limiting and security)</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage statistics and patterns</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">3.3 Technical Data</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>Cookies and similar tracking technologies</li>
              <li>Log files and analytics data</li>
              <li>Error reports and diagnostics</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Legal Basis for Processing</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We process your personal data under the following legal bases:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mt-4">
              <li><strong>Contract Performance:</strong> To provide you with our text transformation services</li>
              <li><strong>Legitimate Interest:</strong> To improve our services, prevent fraud, and ensure security</li>
              <li><strong>Consent:</strong> For cookies and marketing communications (where required)</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. How We Use Your Data</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We use your personal data for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li>To provide and maintain our text transformation service</li>
              <li>To manage your account and authentication</li>
              <li>To process your text transformations using AI models</li>
              <li>To store your transformation history</li>
              <li>To enforce rate limits and prevent abuse</li>
              <li>To improve our services and develop new features</li>
              <li>To communicate with you about service updates</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Data Retention</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We retain your personal data only for as long as necessary:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mt-4">
              <li><strong>Account Data:</strong> Until you delete your account, plus 30 days for backup retention</li>
              <li><strong>Transformation History:</strong> Until you delete your account or individual transformations</li>
              <li><strong>Input/Output Text:</strong> Stored in your transformation history; deleted when you delete your account</li>
              <li><strong>Log Files:</strong> 90 days for security and troubleshooting purposes</li>
              <li><strong>Usage Analytics:</strong> Aggregated and anonymized, retained indefinitely</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Third-Party Services</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We use the following third-party services that may process your data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li><strong>OpenAI:</strong> For AI-powered text transformations (text is sent to OpenAI's API)</li>
              <li><strong>Supabase:</strong> For authentication and database services (EU servers)</li>
              <li><strong>Vercel:</strong> For hosting and content delivery (EU region)</li>
              <li><strong>Google OAuth:</strong> If you choose to sign in with Google</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
              All third-party processors comply with GDPR and have appropriate data processing agreements in place.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. International Data Transfers</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Your data may be transferred to and processed in countries outside the European Economic Area (EEA),
              including the United States. We ensure appropriate safeguards are in place through:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mt-4">
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Adequacy decisions for certain countries</li>
              <li>Other legally approved transfer mechanisms</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. Your GDPR Rights</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Under GDPR, you have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
              <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
              <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your data protection authority</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
              To exercise any of these rights, please contact us at privacy@stylo.app or use the "Delete Account"
              button in your dashboard settings.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">10. Data Security</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mt-4">
              <li>Encryption in transit (HTTPS/TLS)</li>
              <li>Encryption at rest for sensitive data</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Regular backups and disaster recovery procedures</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">11. Cookies</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We use cookies and similar technologies to improve your experience. For detailed information,
              please see our <Link href="/cookies" className="text-indigo-600 dark:text-indigo-400 hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">12. Children's Privacy</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Our service is not intended for children under 16 years of age. We do not knowingly collect personal
              data from children. If you are a parent or guardian and believe your child has provided us with
              personal data, please contact us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">13. Changes to This Policy</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mt-4">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending you an email notification (for significant changes)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">14. Contact Us</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Email:</strong> privacy@stylo.app<br />
                <strong>Data Protection Officer:</strong> dpo@stylo.app<br />
                <strong>Response Time:</strong> We will respond to all requests within 30 days
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">15. Supervisory Authority</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If you are located in the EU and have concerns about our data processing practices, you have the right
              to lodge a complaint with your local data protection authority. You can find your authority's contact
              information at: <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
              className="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">
                https://edpb.europa.eu
              </a>
            </p>
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
            <Link href="/cookies" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Cookie Policy
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
