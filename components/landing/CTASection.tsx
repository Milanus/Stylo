'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-indigo-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Ready to Transform
            <br />
            Your Text?
          </h2>

          {/* Description */}
          <p className="text-xl lg:text-2xl text-white/90">
            Start using Stylo for free today
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="group bg-white text-indigo-600 hover:bg-white/90 text-lg px-12 py-8 shadow-2xl hover:shadow-white/25 transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm pt-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>10 transformations per hour free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
