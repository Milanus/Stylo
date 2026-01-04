'use client'

import { Card } from '@/components/ui/card'
import { Check, Briefcase, MessageCircle, Scale, FileText, Maximize2 } from 'lucide-react'

const features = [
  {
    icon: Check,
    title: 'Grammar',
    description: 'Fix grammar, spelling, and punctuation errors',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
  },
  {
    icon: Briefcase,
    title: 'Formal',
    description: 'Convert to professional, formal writing',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    icon: MessageCircle,
    title: 'Casual',
    description: 'Make text conversational and friendly',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
  },
  {
    icon: Scale,
    title: 'Legal',
    description: 'Transform into formal legal language',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
  },
  {
    icon: FileText,
    title: 'Summary',
    description: 'Condense text into key points',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-950/20',
  },
  {
    icon: Maximize2,
    title: 'Expand',
    description: 'Elaborate and add detail to your text',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Six Powerful{' '}
            <span className="text-indigo-600 dark:text-indigo-400">
              Transformations
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Choose the transformation that fits your needs
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <Card
                key={index}
                className={`${feature.bgColor} border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all`}
              >
                <div className="p-6 space-y-3">
                  <Icon className={`w-10 h-10 ${feature.color}`} />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
