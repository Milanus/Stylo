'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Briefcase, MessageCircle, Scale, FileText, Maximize2 } from 'lucide-react'
import { useState } from 'react'

const features = [
  {
    icon: Check,
    title: 'Grammar',
    category: 'Correction',
    description: 'Perfect your writing with AI-powered grammar correction and punctuation fixes',
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  {
    icon: Briefcase,
    title: 'Formal',
    category: 'Professional',
    description: 'Convert casual text to professional tone for business communications',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  {
    icon: MessageCircle,
    title: 'Informal',
    category: 'Conversational',
    description: 'Make your text more conversational and approachable for casual contexts',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
  {
    icon: Scale,
    title: 'Legal',
    category: 'Compliance',
    description: 'Transform text into precise legal language with proper terminology',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  {
    icon: FileText,
    title: 'Summary',
    category: 'Condensed',
    description: 'Condense long text into key points while preserving essential information',
    color: 'bg-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950/20',
    borderColor: 'border-pink-200 dark:border-pink-800',
  },
  {
    icon: Maximize2,
    title: 'Expand',
    category: 'Detailed',
    description: 'Elaborate and enrich your content with additional context and detail',
    color: 'bg-cyan-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
  },
]

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="features" className="py-24 lg:py-32 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="mb-4 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
            Six Powerful Tools
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Transform Text{' '}
            <span className="text-indigo-600 dark:text-indigo-400">
              Any Way You Need
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            From grammar fixes to style shifts, our AI handles every text transformation with precision and intelligence
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isHovered = hoveredIndex === index

            return (
              <Card
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative overflow-hidden border-2 ${feature.borderColor} ${feature.bgColor} transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer`}
              >
                <div className="relative p-6 lg:p-8 space-y-4">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-3 rounded-xl ${feature.color} transition-transform duration-300 ${
                      isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {feature.category}
                      </Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative corner accent */}
                  <div
                    className={`absolute -top-8 -right-8 w-24 h-24 ${feature.color} rounded-full opacity-10 blur-2xl transition-all duration-300 ${
                      isHovered ? 'scale-150' : 'scale-100'
                    }`}
                  />
                </div>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 ${feature.color} transform origin-left transition-transform duration-300 ${
                    isHovered ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA hint */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            All transformations available in the{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">free tier</span>
            {' '}— no credit card required
          </p>
        </div>
      </div>
    </section>
  )
}
