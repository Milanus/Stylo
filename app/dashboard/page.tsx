'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { TextEditor } from '@/components/TextEditor'
import { TransformationSelector } from '@/components/TransformationSelector'
import { UsageIndicator } from '@/components/UsageIndicator'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [selectedTransformation, setSelectedTransformation] = useState<string>('grammar')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usageRemaining, setUsageRemaining] = useState(10)
  const [metadata, setMetadata] = useState<any>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [rateLimitInfo, setRateLimitInfo] = useState<any>(null)

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleTransform = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to transform')
      return
    }

    setIsLoading(true)
    setError(null)
    setOutputText('')

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          transformationType: selectedTransformation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Check if it's a rate limit error
        if (response.status === 429) {
          setRateLimitInfo(data)
          setShowUpgradeModal(true)
          setError(`Rate limit exceeded. You have ${data.remaining || 0} requests remaining. Upgrade to premium for unlimited access!`)
        } else {
          setError(data.error || 'Transformation failed')
        }
        return
      }

      setOutputText(data.data.transformedText)
      setMetadata(data.data.metadata)
      setUsageRemaining(data.data.rateLimit.remaining)
    } catch (err: any) {
      setError(err.message || 'An error occurred during transformation')
      console.error('Transformation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setInputText('')
    setOutputText('')
    setError(null)
    setMetadata(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                LLM Text Editor
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {user?.email ? `Welcome, ${user.email}` : 'Transform your text with AI-powered assistance'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <UsageIndicator remaining={usageRemaining} limit={10} />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Transformation Type Selector */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
              Select Transformation Type
            </h2>
            <TransformationSelector
              selected={selectedTransformation}
              onSelect={setSelectedTransformation}
            />
          </div>

          {/* Text Editors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Editor */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Input Text
                </h3>
                <span className="text-sm text-slate-500">
                  {inputText.length} characters
                </span>
              </div>
              <TextEditor
                value={inputText}
                onChange={setInputText}
                placeholder="Paste or type your text here..."
                maxLength={10000}
              />
            </div>

            {/* Output Editor */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Transformed Text
                </h3>
                {outputText && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(outputText)}
                  >
                    Copy
                  </Button>
                )}
              </div>
              <TextEditor
                value={outputText}
                onChange={setOutputText}
                placeholder="Transformed text will appear here..."
                readOnly
              />
            </div>
          </div>

          {/* Metadata */}
          {metadata && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-6">
                  <span className="text-blue-900 dark:text-blue-100">
                    <strong>Model:</strong> {metadata.model}
                  </span>
                  <span className="text-blue-900 dark:text-blue-100">
                    <strong>Tokens:</strong> {metadata.tokensUsed}
                  </span>
                  <span className="text-blue-900 dark:text-blue-100">
                    <strong>Cost:</strong> ${metadata.costUsd.toFixed(6)}
                  </span>
                  <span className="text-blue-900 dark:text-blue-100">
                    <strong>Time:</strong> {(metadata.processingTimeMs / 1000).toFixed(2)}s
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-4">
              <div className="flex items-start justify-between">
                <p className="text-red-900 dark:text-red-100 text-sm flex-1">
                  <strong>Error:</strong> {error}
                </p>
                {showUpgradeModal && rateLimitInfo && (
                  <Button
                    onClick={() => {
                      // TODO: Integrate with Stripe
                      alert('Stripe integration coming soon! Premium: $9.99/month for unlimited transformations')
                    }}
                    size="sm"
                    className="ml-4"
                  >
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Upgrade Modal */}
          {showUpgradeModal && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-300 dark:border-purple-700 p-6">
              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                Rate Limit Reached! 🚀
              </h3>
              <p className="text-purple-800 dark:text-purple-200 mb-4">
                You've used all {rateLimitInfo?.limit || 10} free transformations this hour.
                Upgrade to premium for unlimited access!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Free Tier</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>✓ 10 transformations/hour</li>
                    <li>✓ All transformation types</li>
                    <li>✓ Basic support</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg p-4 border-2 border-purple-400 dark:border-purple-600">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    Premium - $9.99/mo
                  </h4>
                  <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                    <li>✓ Unlimited transformations</li>
                    <li>✓ All transformation types</li>
                    <li>✓ Priority support</li>
                    <li>✓ API access</li>
                    <li>✓ Transformation history</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    // TODO: Integrate with Stripe
                    alert('Stripe integration coming soon!')
                  }}
                  size="lg"
                  className="flex-1"
                >
                  Upgrade Now - $9.99/month
                </Button>
                <Button
                  onClick={() => setShowUpgradeModal(false)}
                  variant="outline"
                  size="lg"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleTransform}
              disabled={isLoading || !inputText.trim() || usageRemaining <= 0}
              size="lg"
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transforming...
                </>
              ) : usageRemaining <= 0 ? (
                'Rate Limit Reached'
              ) : (
                'Transform Text'
              )}
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              size="lg"
              disabled={isLoading}
            >
              Clear All
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
