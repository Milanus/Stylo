# SEO Optimization Guide

## Overview

This document provides a comprehensive overview of SEO optimizations implemented across the Stylo application, with a focus on Blog and News sections.

## SEO Checklist

### ✅ Implemented Features

#### Both Blog & News Sections

- [x] **Canonical URLs** - Proper canonical tags for each page
- [x] **hreflang Tags** - Multilingual SEO for all 5 locales (en, sk, cs, de, es)
- [x] **Open Graph** - Full OG metadata (title, description, image, type, locale, url)
- [x] **Twitter Cards** - Summary large image cards with proper metadata
- [x] **Meta Tags** - Title, description, keywords
- [x] **Semantic HTML** - Proper HTML5 structure (article, section, nav, etc.)
- [x] **Breadcrumbs** - Visual + JSON-LD structured data
- [x] **JSON-LD Structured Data** - Schema.org markup
- [x] **Responsive Images** - OG images optimized for social sharing (1200x630)
- [x] **Internal Linking** - Cross-linking between sections
- [x] **Mobile Optimization** - Responsive design
- [x] **Performance** - React.cache() for deduplication

#### Blog-Specific Features

- [x] **Article Schema** - Full Article structured data for each post
- [x] **Author Metadata** - Author information in metadata
- [x] **Published/Modified Dates** - Timestamp metadata
- [x] **Cover Images** - Unique OG images per post
- [x] **Tags** - Keywords and topic categorization
- [x] **Related Posts** - Internal linking to similar content
- [x] **Reading Time** - User experience enhancement
- [x] **Category Pages** - Content organization

#### News-Specific Features

- [x] **ItemList Schema** - Timeline structured as ItemList
- [x] **WebSite Schema** - Organization information
- [x] **Changelog Format** - Chronological update timeline
- [x] **Update Stats** - Dynamic update count display

## SEO Implementation Details

### 1. Meta Tags

#### Blog Post Example

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(slug, locale)

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
      languages: { /* all locales */ },
    },
  }
}
```

#### News Page Example

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'News & Updates | Stylo',
    description: 'Latest news, updates, and improvements to Stylo.',
    keywords: ['stylo news', 'updates', 'changelog', 'new features'],
    openGraph: {
      title: 'News & Updates | Stylo',
      description: 'Latest news, updates, and improvements to Stylo.',
      type: 'website',
      locale,
      url: `${baseUrl}/${locale}/news`,
      siteName: 'Stylo',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'News & Updates | Stylo',
      description: 'Latest news, updates, and improvements to Stylo.',
      images: [ogImage],
      creator: '@stylo_app',
    },
  }
}
```

### 2. JSON-LD Structured Data

#### Blog Post Schema (Article)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Post Title",
  "description": "Post description",
  "image": "https://stylo.app/blog/cover.jpg",
  "datePublished": "2024-02-03T10:00:00.000Z",
  "dateModified": "2024-02-03T12:00:00.000Z",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Stylo",
    "logo": {
      "@type": "ImageObject",
      "url": "https://stylo.app/icon-512.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://stylo.app/en/blog/post-slug"
  }
}
```

#### News Timeline Schema (ItemList)

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Stylo News & Updates",
  "description": "Latest news, updates, and improvements to Stylo",
  "url": "https://stylo.app/en/news",
  "numberOfItems": 25,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Article",
        "@id": "https://stylo.app/en/news#2024-02-03-humanize-toggle",
        "headline": "Humanize Toggle Feature",
        "description": "Added toggle to enable/disable humanization",
        "datePublished": "2024-02-03",
        "author": {
          "@type": "Organization",
          "name": "Stylo"
        }
      }
    }
  ]
}
```

#### Breadcrumb Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://stylo.app"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://stylo.app/en/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Post Title",
      "item": "https://stylo.app/en/blog/post-slug"
    }
  ]
}
```

### 3. Breadcrumbs Implementation

**Component:** `components/blog/Breadcrumbs.tsx`

**Features:**
- Visual breadcrumb navigation (Home > Section > Page)
- JSON-LD structured data for search engines
- ARIA labels for accessibility
- Automatic locale handling
- Home icon for better UX

**Usage:**

```tsx
// Blog post
<Breadcrumbs
  items={[
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: `/blog/${post.slug}` },
  ]}
/>

// News page
<Breadcrumbs
  items={[
    { label: 'News', href: '/news' },
  ]}
/>
```

**SEO Benefits:**
- Enhanced search result display (rich snippets)
- Improved click-through rates (CTR)
- Better understanding of site hierarchy
- Reduced bounce rates

### 4. Internal Linking Strategy

#### Navigation Cross-Linking

All pages include links to:
- **Home** (via logo in nav)
- **Blog** (nav + footer)
- **News** (nav + footer)
- **Dashboard** (nav + footer + CTAs)

#### Content Cross-Linking

- **Blog posts** → Related posts (same category)
- **Blog posts** → CTA to Dashboard
- **News items** → Optional links to related content
- **Footer** → All main sections + legal pages

**Implementation Files:**
- `components/blog/BlogNav.tsx` - Blog navigation
- `components/news/NewsNav.tsx` - News navigation
- `components/landing/Footer.tsx` - Global footer
- `components/blog/RelatedPosts.tsx` - Related content
- `components/blog/BlogCTA.tsx` - Call-to-action

### 5. Open Graph Images

#### Requirements

- **Dimensions:** 1200x630 px
- **Format:** PNG or JPG
- **File size:** < 300 KB recommended
- **Content:** Brand + page title

#### Current Images

- `/og-blog.png` - Default blog OG image
- `/og-news.png` - News page OG image
- Individual blog posts use cover images from `/blog/covers/`

#### Testing

Test OG images with:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 6. Multilingual SEO (hreflang)

**Supported Locales:** en, sk, cs, de, es

**Implementation:**

```tsx
// In layout.tsx
<head>
  {locales.map((loc) => (
    <link key={loc} rel="alternate" hrefLang={loc} href={`/${loc}`} />
  ))}
  <link rel="alternate" hrefLang="x-default" href="/en" />
</head>
```

**Metadata alternates:**

```typescript
alternates: {
  canonical: `${baseUrl}/${locale}/blog/${slug}`,
  languages: {
    en: `${baseUrl}/en/blog/${slug}`,
    sk: `${baseUrl}/sk/blog/${slug}`,
    cs: `${baseUrl}/cs/blog/${slug}`,
    de: `${baseUrl}/de/blog/${slug}`,
    es: `${baseUrl}/es/blog/${slug}`,
  },
}
```

**Benefits:**
- Prevents duplicate content issues
- Proper language targeting in search
- Better international SEO
- Improved user experience

## Performance Optimizations

### 1. React Cache for Data Fetching

Both blog and news use `React.cache()` for request-level deduplication:

```typescript
export const getAllPosts = cache(async (locale: Locale) => {
  // Fetch and return posts
})

export const getAllNews = cache(async (locale: Locale) => {
  // Fetch and return news
})
```

**Benefits:**
- Prevents duplicate API calls
- Faster page loads
- Better server performance
- Vercel Edge optimization

### 2. Static Generation

All blog posts and news pages are statically generated:

```typescript
export async function generateStaticParams() {
  const locales: Locale[] = ["en", "sk", "cs", "de", "es"]
  const params = []

  for (const locale of locales) {
    const posts = await getAllPosts(locale)
    for (const post of posts) {
      params.push({ locale, slug: post.slug })
    }
  }

  return params
}
```

**Benefits:**
- Instant page loads
- Better Core Web Vitals
- Improved SEO rankings
- Lower hosting costs

### 3. Image Optimization

- Next.js Image component for automatic optimization
- Lazy loading for off-screen images
- WebP format with PNG fallback
- Responsive images (srcset)

## SEO Testing Checklist

### Pre-Launch Testing

- [ ] Test all pages with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Validate structured data with [Schema.org Validator](https://validator.schema.org/)
- [ ] Test OG images with Facebook Sharing Debugger
- [ ] Verify Twitter cards with Twitter Card Validator
- [ ] Check mobile-friendliness with [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [ ] Test page speed with [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Verify canonical URLs are correct
- [ ] Check hreflang tags with [hreflang Tags Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)

### Post-Launch Monitoring

- [ ] Submit sitemap to Google Search Console
- [ ] Monitor crawl errors in Google Search Console
- [ ] Check "Enhancements" for rich results in GSC
- [ ] Monitor Core Web Vitals
- [ ] Track internal linking in "Links" report
- [ ] Monitor indexed pages count
- [ ] Set up Google Analytics tracking
- [ ] Monitor click-through rates (CTR)

### Regular Maintenance

- [ ] Update meta descriptions for better CTR (monthly)
- [ ] Add new blog posts (weekly)
- [ ] Update news/changelog (on each release)
- [ ] Check for broken internal links (monthly)
- [ ] Update OG images if brand changes
- [ ] Review and update keywords (quarterly)
- [ ] Audit structured data validity (quarterly)

## Common SEO Issues & Solutions

### Issue 1: Duplicate Content

**Problem:** Same content accessible via multiple URLs

**Solution:**
- Use canonical tags consistently
- Implement proper hreflang for translations
- Avoid URL parameters when possible
- Use 301 redirects for old URLs

### Issue 2: Missing Structured Data

**Problem:** Search engines can't understand content type

**Solution:**
- Add JSON-LD to all pages
- Use specific schema types (Article, ItemList, etc.)
- Validate with Google Rich Results Test
- Include all required properties

### Issue 3: Poor Open Graph Images

**Problem:** Bad social media previews

**Solution:**
- Use 1200x630 dimensions
- Include text/branding in image
- Test on all platforms
- Optimize file size (< 300 KB)

### Issue 4: Slow Page Load

**Problem:** Poor Core Web Vitals

**Solution:**
- Use static generation where possible
- Optimize images with Next.js Image
- Implement React.cache() for data fetching
- Minimize JavaScript bundles
- Use CDN for assets

### Issue 5: Broken Internal Links

**Problem:** Links pointing to non-existent pages

**Solution:**
- Use TypeScript for route safety
- Regular link audits
- Implement proper 404 pages
- Monitor GSC crawl errors

## SEO Best Practices

### Content

1. **Unique, valuable content** - Each page provides unique value
2. **Proper heading hierarchy** - H1 → H2 → H3 logical structure
3. **Keyword optimization** - Natural keyword usage in titles, headers, content
4. **Internal linking** - Link to related content
5. **Regular updates** - Fresh content signals activity

### Technical

1. **Fast loading** - Core Web Vitals optimization
2. **Mobile-first** - Responsive design
3. **HTTPS** - Secure connections
4. **XML sitemap** - Help search engines discover pages
5. **Robots.txt** - Control crawler access

### User Experience

1. **Clear navigation** - Easy to find content
2. **Breadcrumbs** - Show user location
3. **Readable content** - Good typography, spacing
4. **Accessible** - WCAG 2.1 compliance
5. **Fast interaction** - Quick response to user actions

## Tools & Resources

### Testing Tools

- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Schema.org Validator](https://validator.schema.org/)

### Monitoring Tools

- Google Analytics 4
- Google Search Console
- Vercel Analytics
- Sentry (for error tracking)

### Learning Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Vercel Best Practices](https://vercel.com/blog/best-practices)

## Related Documentation

- [NAVIGATION_AND_LINKING.md](./NAVIGATION_AND_LINKING.md) - Navigation structure
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment and hosting
- [QUICK_START.md](./QUICK_START.md) - Getting started guide

## Changelog

### 2024-02-04
- ✅ Added comprehensive SEO to News section
- ✅ Created NewsJsonLd component with ItemList schema
- ✅ Added breadcrumbs to News page
- ✅ Enhanced News metadata (OG image, Twitter card, keywords)
- ✅ Created SEO documentation

### 2024-02-03
- ✅ Implemented breadcrumbs for Blog posts
- ✅ Added cross-linking between Blog and News
- ✅ Created navigation documentation

### Earlier
- ✅ Implemented Blog SEO with Article schema
- ✅ Added multilingual support (hreflang)
- ✅ Implemented canonical URLs
- ✅ Added Open Graph and Twitter cards
