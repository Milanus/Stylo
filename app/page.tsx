import type { Metadata } from 'next'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import PricingSection from '@/components/landing/PricingSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Stylo - AI Text Transformation | Try Free or Sign Up',
  description: 'Transform your text with AI. Try instantly with 6 transformations/hour, or sign up for 20/hour with history and multi-language support. Grammar correction, formal/informal conversion, legal style, and more.',
  keywords: ['AI text transformation', 'grammar correction', 'text style', 'AI writing assistant', 'free trial', 'no signup'],
  openGraph: {
    title: 'Stylo - Try AI Text Transformation Free',
    description: 'Try instantly or sign up for enhanced features. Grammar correction, style adjustments, and intelligent text transformation.',
    images: ['/icon-512.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stylo - AI Text Transformation',
    description: 'Try free: 6/hr or sign up: 20/hr with history. AI-powered text transformation.',
    images: ['/icon-512.png'],
  },
}

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  )
}
