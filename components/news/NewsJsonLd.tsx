import { NewsItem } from '@/lib/news/types'

interface NewsJsonLdProps {
  news: NewsItem[]
  locale: string
}

export function NewsJsonLd({ news, locale }: NewsJsonLdProps) {
  const baseUrl = 'https://stylo.app'

  // ItemList structured data for the news timeline
  const itemListData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Stylo News & Updates',
    description: 'Latest news, updates, and improvements to Stylo',
    url: `${baseUrl}/${locale}/news`,
    numberOfItems: news.length,
    itemListElement: news.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        '@id': `${baseUrl}/${locale}/news#${item.id}`,
        headline: item.title,
        description: item.description,
        datePublished: item.date,
        author: {
          '@type': 'Organization',
          name: 'Stylo',
          url: baseUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Stylo',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/icon-512.png`,
          },
        },
        inLanguage: locale,
      },
    })),
  }

  // WebSite structured data
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Stylo',
    url: baseUrl,
    description: 'AI-powered text transformation and writing assistant',
    inLanguage: locale,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  )
}
