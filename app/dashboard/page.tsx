'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, LogOut, Copy, Check, AlertCircle, Zap, UserPlus } from 'lucide-react'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { TRANSFORMATION_TYPES } from '@/lib/constants/transformations'
import { SUPPORTED_LANGUAGES } from '@/lib/constants/languages'
import DeleteAccountButton from '@/components/DeleteAccountButton'
import HistoryDrawer from '@/components/HistoryDrawer'
import RateLimitModal from '@/components/RateLimitModal'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [selectedType, setSelectedType] = useState('grammar')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usageRemaining, setUsageRemaining] = useState(10)
  const [usageLimit, setUsageLimit] = useState(10)
  const [copied, setCopied] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showRateLimitModal, setShowRateLimitModal] = useState(false)
  const [rateLimitResetTime, setRateLimitResetTime] = useState<number | null>(null)

  // Derived state
  const isAnonymous = !user

  useEffect(() => {
    setIsMounted(true)

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user)
      // Set initial usage limit based on auth status
      const limit = data.user ? 10 : 3
      setUsageLimit(limit)
      setUsageRemaining(limit)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
      // Update usage limit on auth change
      const limit = session?.user ? 10 : 3
      setUsageLimit(limit)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])


  const handleTransform = async () => {
    if (!inputText.trim()) {
      setError('Enter text to transform')
      return
    }

    setIsLoading(true)
    setError(null)
    setOutputText('')

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          transformationType: selectedType,
          targetLanguage: selectedLanguage !== 'auto' ? selectedLanguage : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit exceeded - show modal
          setRateLimitResetTime(data.resetAt)
          setShowRateLimitModal(true)
          setError(`Rate limit reached. ${data.remaining || 0} left.`)
        } else {
          setError(data.error || 'Failed')
        }
        return
      }

      setOutputText(data.data.transformedText)
      setUsageRemaining(data.data.rateLimit.remaining)
      setUsageLimit(data.data.rateLimit.limit)
    } catch (err: any) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleSignUp = () => {
    router.push('/signup')
  }

  const usagePercent = ((usageLimit - usageRemaining) / usageLimit) * 100

  const handleLoadTransformation = (input: string, output: string, type: string) => {
    setInputText(input)
    setOutputText(output)
    setSelectedType(type)
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-950">
      {/* Compact Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="px-3 sm:px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => router.push('/')}
            >
              Stylo
            </h1>
            {/* Anonymous badge */}
            {isAnonymous && (
              <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
                <span className="text-xs text-amber-700 dark:text-amber-300">Guest Mode</span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Zap className="w-3 h-3" />
              <span>{usageRemaining}/{usageLimit}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Show history only for authenticated users */}
            {!isAnonymous && (
              <HistoryDrawer onLoadTransformation={handleLoadTransformation} />
            )}

            {isAnonymous ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/login')}
                  className="gap-1 text-xs"
                >
                  <span>Login</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleSignUp}
                  className="gap-1 text-xs bg-indigo-600 hover:bg-indigo-700"
                >
                  <UserPlus className="h-3 w-3" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Button>
              </>
            ) : (
              <>
                {isMounted && <DeleteAccountButton />}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1 text-xs"
                >
                  <LogOut className="h-3 w-3" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile usage indicator */}
        <div className="sm:hidden px-3 pb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 dark:text-slate-400">
              {isAnonymous ? 'Guest Usage' : 'Usage'}
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {usageRemaining}/{usageLimit} left
            </span>
          </div>
          <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                usagePercent >= 90 ? 'bg-red-500' :
                usagePercent >= 70 ? 'bg-yellow-500' :
                'bg-indigo-600'
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content - Single Screen */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Type Selector - Horizontal Pills */}
        <div className="relative border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="overflow-x-auto px-3 py-2 scrollbar-hide">
            <div className="flex gap-1.5 min-w-max pb-0.5">
              {TRANSFORMATION_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedType === type.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <span className="mr-1">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          {/* Scroll indicator gradient on mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 dark:from-slate-900/50 to-transparent pointer-events-none md:hidden"></div>
        </div>

        {/* Language Selector - ONLY for authenticated users */}
        {!isAnonymous && (
          <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                Output language:
              </span>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[200px] h-8 text-xs">
                  <SelectValue placeholder="Auto" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="text-xs">
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Text Areas - Split View */}
        <div className="flex-1 flex flex-col md:grid md:grid-cols-2 overflow-hidden">
          {/* Input */}
          <div className="flex flex-col flex-1 md:h-full md:border-r border-slate-200 dark:border-slate-800">
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 flex-shrink-0">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Input</span>
              <span className="text-xs text-slate-500 dark:text-slate-500">{inputText.length} chars</span>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={selectedType === 'response' ? 'Paste the message you want to reply to...' : 'Paste your text here...'}
                className="h-full w-full border-0 rounded-none resize-none focus-visible:ring-0 text-sm p-3 font-mono"
                maxLength={10000}
              />
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col flex-1 md:h-full border-t md:border-t-0 border-slate-200 dark:border-slate-800">
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 flex-shrink-0">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Output</span>
              {outputText && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-6 px-2 text-xs gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              <Textarea
                value={outputText}
                onChange={(e) => setOutputText(e.target.value)}
                placeholder={selectedType === 'response' ? 'Generated response appears here...' : 'Transformed text appears here...'}
                className="h-full w-full border-0 rounded-none resize-none focus-visible:ring-0 text-sm p-3 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-3 py-2 bg-red-50 dark:bg-red-950/30 border-t border-red-200 dark:border-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span className="text-xs text-red-900 dark:text-red-200">{error}</span>
          </div>
        )}

        {/* Action Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 px-3 py-3 bg-white dark:bg-slate-950">
          <div className="flex gap-2">
            <Button
              onClick={handleTransform}
              disabled={isLoading || !inputText.trim() || usageRemaining <= 0}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transforming...
                </>
              ) : (
                'Transform'
              )}
            </Button>
            <Button
              onClick={() => {
                setInputText('')
                setOutputText('')
                setError(null)
              }}
              variant="outline"
              size="lg"
              disabled={isLoading}
              className="px-6"
            >
              Clear
            </Button>
          </div>
        </div>
      </main>

      {/* Rate Limit Modal */}
      {showRateLimitModal && (
        <RateLimitModal
          isOpen={showRateLimitModal}
          onClose={() => setShowRateLimitModal(false)}
          resetTime={rateLimitResetTime}
          isAnonymous={isAnonymous}
          currentLimit={usageLimit}
        />
      )}
    </div>
  )
}
