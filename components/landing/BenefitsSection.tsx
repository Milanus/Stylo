'use client'

import { Zap, Lock, Smartphone, Target } from 'lucide-react'

const benefits = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant AI-powered results with processing times under 2 seconds',
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Your data stays safe with enterprise-grade security and privacy',
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
  },
  {
    icon: Smartphone,
    title: 'Works Offline',
    description: 'PWA technology enables mobile use and offline functionality',
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
  },
  {
    icon: Target,
    title: 'Accurate Transformations',
    description: 'Powered by OpenAI with 99.9% accuracy for reliable results',
    color: 'bg-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950/20',
  },
]

export default function BenefitsSection() {
  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent dark:from-indigo-950/30 opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Why Choose{' '}
            <span className="text-indigo-600 dark:text-indigo-400">
              Stylo?
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Built with cutting-edge technology to deliver the best text transformation experience
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon

            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className={`relative h-full p-8 lg:p-10 rounded-2xl ${benefit.bgColor} border-2 border-slate-200 dark:border-slate-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
                  {/* Icon with animated background */}
                  <div className="relative inline-block mb-6">
                    {/* Orb behind icon */}
                    <div className={`absolute inset-0 ${benefit.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 scale-150`} />

                    {/* Icon container */}
                    <div className={`relative p-4 rounded-xl ${benefit.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Decorative corner */}
                  <div className={`absolute -bottom-2 -right-2 w-32 h-32 ${benefit.color} rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-300`} />

                  {/* Border highlight on hover */}
                  <div className={`absolute inset-0 rounded-2xl ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Feature Highlight */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-indigo-600 p-[2px]">
            <div className="bg-white dark:bg-slate-950 rounded-2xl p-8 lg:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Enterprise-Grade Security
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Your text transformations are processed securely with end-to-end encryption.
                    We never store your content, and all processing happens in real-time with immediate deletion.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="text-3xl font-black text-emerald-600 mb-1">
                      256-bit
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Encryption</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="text-3xl font-black text-indigo-600 mb-1">
                      0
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Data Stored</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="text-3xl font-black text-purple-600 mb-1">
                      100%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">GDPR</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="text-3xl font-black text-orange-600 mb-1">
                      SOC 2
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
