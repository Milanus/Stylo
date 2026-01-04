'use client'

import { Copy, Settings, Zap } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Copy,
    title: 'Paste Your Text',
    description: 'Simply copy and paste your text into the editor. No file uploads, no complicated setup—just pure simplicity.',
    color: 'bg-indigo-600',
  },
  {
    number: '02',
    icon: Settings,
    title: 'Choose Transformation',
    description: 'Select from six powerful transformation types: grammar, formal, informal, legal, summary, or expand.',
    color: 'bg-purple-600',
  },
  {
    number: '03',
    icon: Zap,
    title: 'Get Results Instantly',
    description: 'Our AI processes your text in seconds. Review, copy, and use your transformed text immediately.',
    color: 'bg-pink-600',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Simple Three-Step Process
          </h2>
          <p className="text-xl text-slate-300">
            Get professional text transformations in seconds with our streamlined workflow
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <div key={index} className="relative group">
                  {/* Connecting line (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-24 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-indigo-500/50 to-transparent" />
                  )}

                  <div className="relative">
                    {/* Oversized Number */}
                    <div className="absolute -top-8 -left-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                      <span className={`text-[12rem] font-black text-indigo-400 leading-none`}>
                        {step.number}
                      </span>
                    </div>

                    {/* Content Card */}
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group-hover:transform group-hover:scale-105">
                      {/* Icon */}
                      <div className={`inline-flex p-4 rounded-xl ${step.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Step Number Badge */}
                      <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4">
                        <span className="text-sm font-mono font-semibold text-white">
                          Step {step.number}
                        </span>
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {step.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Decorative gradient orb */}
                      <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${step.color} rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-300`} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-400 mb-2">
              &lt;2s
            </div>
            <div className="text-sm text-slate-400">Average Processing</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">
              99.9%
            </div>
            <div className="text-sm text-slate-400">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-400 mb-2">
              10/hr
            </div>
            <div className="text-sm text-slate-400">Free Tier Limit</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-400 mb-2">
              24/7
            </div>
            <div className="text-sm text-slate-400">Always Available</div>
          </div>
        </div>
      </div>
    </section>
  )
}
