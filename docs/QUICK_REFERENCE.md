# Quick Reference Guide

Fast reference for common tasks and implementations in Stylo.

---

## 🔗 Navigation Components

### Add Link to Navigation

#### BlogNav
```tsx
// File: components/blog/BlogNav.tsx
<Link href="/your-page" className="text-sm font-medium...">
  Your Page
</Link>
```

#### NewsNav
```tsx
// File: components/news/NewsNav.tsx
<Link href="/your-page" className="text-sm font-medium...">
  Your Page
</Link>
```

#### Footer
```tsx
// File: components/landing/Footer.tsx
<li>
  <Link href="/your-page" className="text-sm...">
    Your Page
  </Link>
</li>
```

---

## 🍞 Breadcrumbs

### Add Breadcrumbs to Page

```tsx
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'

<Breadcrumbs
  items={[
    { label: 'Section', href: '/section' },
    { label: 'Page Title', href: '/section/page' },
  ]}
/>
```

### Examples

**Blog Post:**
```tsx
<Breadcrumbs
  items={[
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: `/blog/${post.slug}` },
  ]}
/>
```

**News Page:**
```tsx
<Breadcrumbs
  items={[
    { label: 'News', href: '/news' },
  ]}
/>
```

---

## 📊 SEO Meta Tags

### Blog Post Metadata

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(slug, locale)
  const ogImage = `${baseUrl}${post.coverImage}`

  return {
    title: `${post.title} | Stylo Blog`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      locale: post.locale,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
      languages: {
        en: `${baseUrl}/en/blog/${slug}`,
        sk: `${baseUrl}/sk/blog/${slug}`,
        // ... other locales
      },
    },
  }
}
```

### Regular Page Metadata

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = 'https://stylo.app'
  const ogImage = `${baseUrl}/og-image.png`

  return {
    title: 'Page Title | Stylo',
    description: 'Page description here',
    keywords: ['keyword1', 'keyword2', 'keyword3'],
    openGraph: {
      title: 'Page Title | Stylo',
      description: 'Page description here',
      type: 'website',
      locale,
      url: `${baseUrl}/${locale}/page`,
      siteName: 'Stylo',
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'Alt text' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Page Title | Stylo',
      description: 'Page description here',
      images: [ogImage],
      creator: '@stylo_app',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/page`,
      languages: {
        en: `${baseUrl}/en/page`,
        sk: `${baseUrl}/sk/page`,
        cs: `${baseUrl}/cs/page`,
        de: `${baseUrl}/de/page`,
        es: `${baseUrl}/es/page`,
      },
    },
  }
}
```

---

## 🏗️ JSON-LD Structured Data

### Article (Blog Post)

```tsx
const articleData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.description,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: {
    '@type': 'Person',
    name: post.author,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Stylo',
    logo: {
      '@type': 'ImageObject',
      url: 'https://stylo.app/icon-512.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://stylo.app/${locale}/blog/${slug}`,
  },
}

return (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
  />
)
```

### ItemList (News/Timeline)

```tsx
const itemListData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Stylo News & Updates',
  description: 'Latest news and updates',
  url: `https://stylo.app/${locale}/news`,
  numberOfItems: news.length,
  itemListElement: news.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Article',
      '@id': `https://stylo.app/${locale}/news#${item.id}`,
      headline: item.title,
      description: item.description,
      datePublished: item.date,
      author: {
        '@type': 'Organization',
        name: 'Stylo',
      },
    },
  })),
}

return (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListData) }}
  />
)
```

### BreadcrumbList

```tsx
const breadcrumbData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://stylo.app',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: 'https://stylo.app/en/blog',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Post Title',
      item: 'https://stylo.app/en/blog/post-slug',
    },
  ],
}

return (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
  />
)
```

---

## 🔐 Google Analytics

### Implementation

**Layout (Server):**
```tsx
// app/[locale]/layout.tsx
<head>
  <Script id="google-consent-default" strategy="beforeInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'functionality_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
      });
    `}
  </Script>
  <Script
    src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
    strategy="afterInteractive"
  />
  <Script id="google-analytics" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    `}
  </Script>
</head>
```

**Consent Update (Client):**
```tsx
// components/GoogleAnalytics.tsx
'use client'

export default function GoogleAnalytics() {
  useEffect(() => {
    const updateConsent = () => {
      const prefs = JSON.parse(localStorage.getItem('cookie-consent-key'))
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: prefs.analytics ? 'granted' : 'denied',
        })
      }
    }
    updateConsent()
    window.addEventListener('cookie-consent-update', updateConsent)
  }, [])

  return null
}
```

**Cookie Consent Trigger:**
```tsx
// After saving preferences
window.dispatchEvent(new Event('cookie-consent-update'))
```

---

## 🌍 Multilingual (i18n)

### Use Internationalized Link

```tsx
import { Link } from '@/i18n/navigation'

<Link href="/blog">Blog</Link>
// Automatically becomes /en/blog, /sk/blog, etc.
```

### Get Current Locale

```tsx
import { setRequestLocale } from 'next-intl/server'

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  // ...
}
```

### Get Translations

```tsx
'use client'
import { useTranslations } from 'next-intl'

export default function Component() {
  const t = useTranslations('common')
  return <p>{t('welcomeMessage')}</p>
}
```

---

## 📷 Open Graph Images

### Requirements
- **Dimensions:** 1200 x 630 px
- **Format:** PNG or JPG
- **Size:** < 300 KB recommended
- **Location:** `/public/og-image-name.png`

### Testing
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Inspector](https://www.linkedin.com/post-inspector/)

---

## ✅ Testing Checklist

### SEO Testing
```bash
# Test structured data
https://search.google.com/test/rich-results

# Test mobile-friendly
https://search.google.com/test/mobile-friendly

# Test page speed
https://pagespeed.web.dev/
```

### Before Deployment
- [ ] All navigation links work
- [ ] Breadcrumbs display correctly
- [ ] Structured data validates
- [ ] OG images load properly
- [ ] Twitter cards work
- [ ] All locales function correctly
- [ ] Mobile responsive
- [ ] Cookie consent works
- [ ] GA tracking functional

---

## 🔐 Security

### Content Validation

**Blog Post Slug:**
```typescript
// Always validate slug format
if (!/^[a-z0-9-]+$/.test(slug)) {
  throw new Error('Invalid slug format')
}
```

**Frontmatter Schema:**
```typescript
import { z } from 'zod'

const PostFrontmatterSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  author: z.string().min(1).max(100),
  tags: z.array(z.string()).max(10),
  publishedAt: z.string().datetime(),
})

const validated = PostFrontmatterSchema.parse(frontmatter)
```

**News Item Schema:**
```typescript
const NewsItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(['feature', 'fix', 'improvement', 'announcement']),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
})
```

### Security Headers

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' https://www.googletagmanager.com; ...",
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
]

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}
```

### Security Commands

```bash
# Check for vulnerabilities
npm audit

# Run security tests
npm test -- __tests__/security/

# Pre-deployment security check
npm run security-check
```

---

## 🚀 Common Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
npm audit            # Check dependencies
```

### Git
```bash
git status           # Check status
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push             # Push to remote
```

### Vercel
```bash
vercel               # Deploy to preview
vercel --prod        # Deploy to production
vercel logs          # View logs
```

---

## 🔧 Environment Variables

### Required Variables

```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
ANTHROPIC_API_KEY="sk-ant-..."
```

---

## 📝 File Locations

### Components
```
components/
├── blog/
│   ├── BlogNav.tsx        # Blog navigation
│   ├── Breadcrumbs.tsx    # Breadcrumbs component
│   ├── BlogJsonLd.tsx     # Blog structured data
│   └── ...
├── news/
│   ├── NewsNav.tsx        # News navigation
│   ├── NewsJsonLd.tsx     # News structured data
│   └── ...
├── landing/
│   └── Footer.tsx         # Global footer
└── GoogleAnalytics.tsx    # GA consent handler
```

### Pages
```
app/[locale]/
├── page.tsx                    # Home page
├── blog/
│   ├── page.tsx               # Blog index
│   └── [slug]/page.tsx        # Blog post
├── news/
│   └── page.tsx               # News timeline
└── layout.tsx                 # Root layout
```

### Content
```
content/
├── blog/
│   └── [locale]/
│       └── *.mdx              # Blog posts
└── news/
    └── [locale]/
        └── *.json             # News items
```

---

## 🆘 Quick Fixes

### Breadcrumbs not showing
```tsx
// Make sure you imported and used the component
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'

<Breadcrumbs items={[...]} />
```

### OG image not loading
```bash
# Check file exists in /public
ls public/og-*.png

# Check metadata has correct path
const ogImage = `${baseUrl}/og-image.png`
```

### GA not tracking
```tsx
// 1. Check scripts are in <head>
// 2. Check GoogleAnalytics component is in <body>
// 3. Check cookie consent dispatches event
window.dispatchEvent(new Event('cookie-consent-update'))
```

### Navigation link not working
```tsx
// Use i18n Link, not regular <a>
import { Link } from '@/i18n/navigation'

<Link href="/page">Link</Link>
```

---

**Last updated:** 2024-02-04

For detailed documentation, see [docs/README.md](./README.md)
