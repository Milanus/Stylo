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
import { Loader2, LogOut, Copy, Check, AlertCircle, Zap } from 'lucide-react'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { TRANSFORMATION_TYPES } from '@/lib/constants/transformations'
import { SUPPORTED_LANGUAGES } from '@/lib/constants/languages'

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
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
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
          setError(`Rate limit reached. ${data.remaining || 0} left. Wait ${Math.ceil((data.resetTime - Date.now()) / 1000 / 60)} min.`)
        } else {
          setError(data.error || 'Failed')
        }
        return
      }

      setOutputText(data.data.transformedText)
      setUsageRemaining(data.data.rateLimit.remaining)
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

  const usagePercent = ((10 - usageRemaining) / 10) * 100

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-950">
      {/* Compact Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="px-3 sm:px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Stylo
            </h1>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Zap className="w-3 h-3" />
              <span>{usageRemaining}/10</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-1 text-xs"
          >
            <LogOut className="h-3 w-3" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        {/* Mobile usage indicator */}
        <div className="sm:hidden px-3 pb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 dark:text-slate-400">Usage</span>
            <span className="font-medium text-slate-900 dark:text-white">{usageRemaining}/10 left</span>
          </div>
          <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-yellow-500' : 'bg-indigo-600'}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content - Single Screen */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Type Selector - Horizontal Pills */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 overflow-x-auto">
          <div className="flex gap-1.5 min-w-max">
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

        {/* Language Selector */}
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

        {/* Text Areas - Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
          {/* Input */}
          <div className="flex flex-col border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Input</span>
              <span className="text-xs text-slate-500 dark:text-slate-500">{inputText.length} chars</span>
            </div>
            <div className="flex-1" style={{ minHeight: '500px' }}>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here..."
                className="h-full w-full border-0 rounded-none resize-none focus-visible:ring-0 text-sm p-3 font-mono"
                maxLength={10000}
              />
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col">
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
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
            <div className="flex-1" style={{ minHeight: '500px' }}>
              <Textarea
                value={outputText}
                onChange={(e) => setOutputText(e.target.value)}
                placeholder="Transformed text appears here..."
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
    </div>
  )
}
