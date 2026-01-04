'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Sparkles, Crown } from 'lucide-react'
import Link from 'next/link'

export default function PricingSection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Start Free,{' '}
            <span className="text-indigo-600 dark:text-indigo-400">
              Upgrade Anytime
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Get started with our generous free tier, or unlock unlimited transformations
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <Card className="relative border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-950 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            {/* Recommended Badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-indigo-600 text-white px-6 py-2 text-sm font-semibold rounded-bl-2xl flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Recommended
              </div>
            </div>

            <div className="p-8 lg:p-10">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex p-3 rounded-xl bg-indigo-600 mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Free Tier
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Perfect for individuals and occasional use
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">$0</span>
                  <span className="text-xl text-slate-600 dark:text-slate-400">/ forever</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      10 transformations per hour
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      All 6 transformation types
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      No credit card required
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Works offline (PWA)
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Secure & private
                    </span>
                  </div>
                </li>
              </ul>

              {/* CTA Button */}
              <Link href="/signup" className="block">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-base py-6">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </Card>

          {/* Premium Tier (Future) */}
          <Card className="relative border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden opacity-75">
            {/* Coming Soon Badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-slate-700 dark:bg-slate-600 text-white px-6 py-2 text-sm font-semibold rounded-bl-2xl">
                Coming Soon
              </div>
            </div>

            <div className="p-8 lg:p-10">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex p-3 rounded-xl bg-yellow-500 mb-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Premium
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  For power users and professionals
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">$9</span>
                  <span className="text-xl text-slate-600 dark:text-slate-400">/ month</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Unlimited transformations
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Priority processing
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Advanced AI models
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      API access
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Priority support
                    </span>
                  </div>
                </li>
              </ul>

              {/* CTA Button */}
              <Button disabled className="w-full bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-base py-6 cursor-not-allowed">
                Notify Me When Available
              </Button>
            </div>
          </Card>
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            No hidden fees. No surprises. Start with our free tier and upgrade only if you need more.
            Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
