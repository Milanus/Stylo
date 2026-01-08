'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X, ArrowRight, Zap, Clock, History, Languages, Save } from 'lucide-react'
import { ANONYMOUS_LIMIT, FREE_LIMIT, PAID_LIMIT } from '@/lib/constants/rate-limits'

const tiers = [
  {
    name: 'Free Trial',
    description: 'Try without signing up',
    priceLabel: 'No account needed',
    ctaText: 'Try Now',
    ctaHref: '/dashboard',
    ctaVariant: 'outline' as const,
    recommended: false,
    features: [
      { icon: Zap, text: `${ANONYMOUS_LIMIT} transformations/hour`, included: true },
      { icon: Clock, text: 'No history saved', included: false },
      { icon: Languages, text: 'English only', included: false },
      { icon: Save, text: 'Cannot save work', included: false },
    ],
  },
  {
    name: 'Registered',
    description: 'Sign up for more features',
    priceLabel: 'Free Forever',
    ctaText: 'Sign Up Free',
    ctaHref: '/signup',
    ctaVariant: 'default' as const,
    recommended: true,
    features: [
      { icon: Zap, text: `${FREE_LIMIT} transformations/hour`, included: true },
      { icon: History, text: 'Full transformation history', included: true },
      { icon: Languages, text: 'Multi-language output', included: true },
      { icon: Save, text: 'Save your work', included: true },
    ],
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Choose Your{' '}
            <span className="text-indigo-600 dark:text-indigo-400">Experience</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Start instantly or create a free account for enhanced features
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={`relative p-8 ${
                tier.recommended
                  ? 'border-2 border-indigo-500 shadow-xl'
                  : 'border-2 border-slate-200 dark:border-slate-800'
              }`}
            >
              {tier.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1">
                  Recommended
                </Badge>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {tier.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {tier.description}
                </p>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {tier.priceLabel}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => {
                  const Icon = feature.icon
                  return (
                    <li
                      key={featureIndex}
                      className={`flex items-start gap-3 ${
                        feature.included
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {feature.included ? (
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${
                          feature.included ? 'text-indigo-600' : 'text-slate-300'
                        }`} />
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <Link href={tier.ctaHref}>
                <Button
                  variant={tier.ctaVariant}
                  size="lg"
                  className={`w-full group ${
                    tier.recommended
                      ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'
                      : 'border-2'
                  }`}
                >
                  {tier.ctaText}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No credit card required • GDPR compliant • Upgrade anytime
          </p>
        </div>
      </div>
    </section>
  )
}
