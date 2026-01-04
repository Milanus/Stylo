'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
              AI-Powered Text Transformation
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="block text-slate-900 dark:text-white">
                Transform
              </span>
              <span className="block text-indigo-600 dark:text-indigo-400">
                Your Text
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              AI-powered grammar correction, style adjustments, and intelligent text transformation
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="group text-lg px-12 py-8 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-xl hover:shadow-2xl transition-all">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-12 justify-center pt-8">
            <div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white">6</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Transformations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white">10/hr</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Free</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">AI</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Powered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
