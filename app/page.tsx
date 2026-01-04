import type { Metadata } from 'next'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import CTASection from '@/components/landing/CTASection'

export const metadata: Metadata = {
  title: 'Stylo - AI Text Transformation | Grammar, Style, and More',
  description: 'Transform your text with AI. Grammar correction, formal/informal conversion, legal style, summarization, and text expansion. Free to start, 10 transformations per hour.',
  keywords: ['AI text transformation', 'grammar correction', 'text style', 'AI writing assistant', 'text editor', 'OpenAI'],
  openGraph: {
    title: 'Stylo - Transform Your Text with AI',
    description: 'Grammar correction, style adjustments, and intelligent text transformation - all powered by AI',
    images: ['/icon-512.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stylo - AI Text Transformation',
    description: 'Transform your text with AI-powered grammar correction and style adjustments',
    images: ['/icon-512.png'],
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </main>
  )
}
