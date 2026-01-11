'use client'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ANONYMOUS_LIMIT, FREE_LIMIT } from '@/lib/constants/rate-limits'

const transformExamples = [
  { before: 'hey can u help me with this', after: 'Hello, could you please assist me with this matter?' },
  { before: 'the meeting was good and productive', after: 'The meeting proved highly effective and yielded substantial outcomes.' },
  { before: 'I need help asap!!!', after: 'I require immediate assistance.' },
]

export default function HeroSection() {
  const t = useTranslations('landing.hero')
  const tStats = useTranslations('landing.stats')
  const tCommon = useTranslations('common')
  const [currentExample, setCurrentExample] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentExample((prev) => (prev + 1) % transformExamples.length)
        setIsAnimating(false)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen py-16 sm:py-0 flex items-center overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                {t('badge')}
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block text-slate-900 dark:text-white">
                  {t('title1')}
                </span>
                <span className="block text-indigo-600 dark:text-indigo-400">
                  {t('title2')}
                </span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
                {t('description', { anonymousLimit: ANONYMOUS_LIMIT, freeLimit: FREE_LIMIT })}
              </p>
            </div>

            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              {/* Primary CTA - Try for Free */}
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="group text-base sm:text-lg px-6 sm:px-10 py-6 sm:py-8 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-xl w-full sm:w-auto"
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="flex items-center gap-2">
                      {t('tryForFree')}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-xs text-indigo-100 dark:text-indigo-200 font-normal">
                      {t('transformationsPerHour', { count: ANONYMOUS_LIMIT })}
                    </span>
                  </div>
                </Button>
              </Link>

              {/* Secondary CTA - Sign Up */}
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="group text-base sm:text-lg px-6 sm:px-10 py-6 sm:py-8 border-2 border-indigo-600 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 w-full sm:w-auto"
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="flex items-center gap-2">
                      {tCommon('signUp')}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-normal">
                      {t('transformationsPerHour', { count: FREE_LIMIT })}
                    </span>
                  </div>
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex gap-8 lg:gap-12 justify-center lg:justify-start pt-4">
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">10</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{tStats('transformations')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{ANONYMOUS_LIMIT}-{FREE_LIMIT}/hr</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{tStats('rateLimits')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">AI</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{tStats('powered')}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Live Demo */}
          <div className="relative">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              {/* Card Header */}
              <div className="bg-indigo-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{t('liveDemo')}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-6">
                {/* Before */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      {t('before')}
                    </span>
                  </div>
                  <div className={`p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
                    <p className="text-slate-700 dark:text-slate-300 font-mono text-sm">
                      {transformExamples[currentExample].before}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-950 rounded-full">
                    <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 rotate-90" />
                  </div>
                </div>

                {/* After */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                      {t('after')}
                    </span>
                  </div>
                  <div className={`p-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                    <p className="text-slate-900 dark:text-white font-mono text-sm">
                      {transformExamples[currentExample].after}
                    </p>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center gap-2 pt-2">
                  {transformExamples.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        index === currentExample
                          ? 'w-8 bg-indigo-600 dark:bg-indigo-500'
                          : 'w-1 bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
