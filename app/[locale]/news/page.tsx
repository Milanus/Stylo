import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
// Optimized by Next.js optimizePackageImports (Vercel Best Practice 2.1)
import { Megaphone, Sparkles } from 'lucide-react';
import { getAllNews } from '@/lib/news/loader';
import { groupNewsByMonth } from '@/lib/news/utils';
import { Locale } from '@/lib/news/types';
import { NewsTimeline } from '@/components/news/NewsTimeline';
import { NewsNav } from '@/components/news/NewsNav';
import { NewsJsonLd } from '@/components/news/NewsJsonLd';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import Footer from '@/components/landing/Footer';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://stylo.app';
  const ogImage = `${baseUrl}/og-news.png`;

  return {
    title: 'News & Updates | Stylo',
    description: 'Latest news, updates, and improvements to Stylo - your AI text transformation tool.',
    keywords: ['stylo news', 'updates', 'changelog', 'product updates', 'new features', 'improvements', 'AI writing', 'text transformation'],
    openGraph: {
      title: 'News & Updates | Stylo',
      description: 'Latest news, updates, and improvements to Stylo.',
      type: 'website',
      locale,
      url: `${baseUrl}/${locale}/news`,
      siteName: 'Stylo',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'Stylo News & Updates',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'News & Updates | Stylo',
      description: 'Latest news, updates, and improvements to Stylo.',
      images: [ogImage],
      creator: '@stylo_app',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/news`,
      languages: {
        en: `${baseUrl}/en/news`,
        sk: `${baseUrl}/sk/news`,
        cs: `${baseUrl}/cs/news`,
        de: `${baseUrl}/de/news`,
        es: `${baseUrl}/es/news`,
      },
    },
  };
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Parallel data fetching with React.cache() deduplication (Vercel Best Practice 3.4)
  const news = await getAllNews(locale as Locale);
  const groupedNews = groupNewsByMonth(news, locale);

  return (
    <>
      <NewsJsonLd news={news} locale={locale} />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <NewsNav />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        {/* Breadcrumbs */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Breadcrumbs
            items={[
              { label: 'News', href: '/news' },
            ]}
          />
        </div>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {/* Main gradient orb */}
          <div className="absolute top-10 right-[15%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />

          {/* Secondary gradient orb */}
          <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />

          {/* Floating sparkles */}
          <div className="absolute top-24 left-[20%] animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
            <Sparkles className="w-4 h-4 text-indigo-400/30" aria-hidden="true" />
          </div>
          <div className="absolute top-32 right-[25%] animate-bounce" style={{ animationDuration: '4s', animationDelay: '1.5s' }}>
            <Sparkles className="w-3 h-3 text-purple-400/30" aria-hidden="true" />
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 pt-8">
          <div className="text-center">
            {/* Badge with icon */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300" style={{ transitionProperty: 'box-shadow' }}>
              <Megaphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                Changelog
              </span>
            </div>

            {/* Main heading with text-wrap balance */}
            <h1
              className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              News & Updates
            </h1>

            {/* Subtitle with better typography */}
            <p
              className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              Stay up to date with the latest features, improvements, and fixes in Stylo.
            </p>

            {/* Stats bar */}
            {news.length > 0 ? (
              <div className="mt-8 inline-flex items-center gap-6 px-6 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDuration: '2s' }} aria-hidden="true" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {news.length} {news.length === 1 ? 'Update' : 'Updates'}
                  </span>
                </div>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Latest: {new Date(news[0].date).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        aria-label="News timeline"
      >
        <NewsTimeline groups={groupedNews} locale={locale} />
      </section>

      <Footer />
      </div>
    </>
  );
}
