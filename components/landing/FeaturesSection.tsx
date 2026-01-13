'use client'

import { Card } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import { TRANSFORMATION_TYPES } from '@/lib/constants/transformations'

export default function FeaturesSection() {
  const t = useTranslations('landing.features')
  const tTransformations = useTranslations('transformations')

  return (
    <section id="features" className="py-24 lg:py-32 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t('title')}{' '}
            <span className="text-indigo-600 dark:text-indigo-400">
              {t('titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            {t('subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TRANSFORMATION_TYPES.slice(0, 6).map((feature) => {
            const colorMap: Record<string, { color: string; bgColor: string }> = {
              grammar: { color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/20' },
              formal: { color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-950/20' },
              informal: { color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-950/20' },
              legal: { color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-950/20' },
              summary: { color: 'text-pink-600 dark:text-pink-400', bgColor: 'bg-pink-50 dark:bg-pink-950/20' },
              expand: { color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-950/20' },
            }

            const colors = colorMap[feature.id] || colorMap.grammar

            return (
              <Card
                key={feature.id}
                className={`${colors.bgColor} border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all`}
              >
                <div className="p-6 space-y-3">
                  <div className={`w-10 h-10 ${colors.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {tTransformations(`${feature.id}.label`)}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {tTransformations(`${feature.id}.description`)}
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
