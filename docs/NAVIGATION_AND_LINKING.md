# Navigation & Linking Guide

## Overview

This document describes the navigation structure between Stylo and its content sections (Blog and News), including SEO optimizations and best practices.

## Navigation Structure

### Main Sections

1. **Stylo (Home)** - Landing page at `/`
2. **Blog** - Content hub at `/blog`
3. **News** - Updates/changelog at `/news`
4. **Dashboard** - Main app at `/dashboard`

### Cross-Linking Strategy

All sections are cross-linked to improve:
- User navigation flow
- SEO through internal linking
- Content discoverability
- User engagement

## Components

### 1. BlogNav Component

**Location:** `components/blog/BlogNav.tsx`

**Purpose:** Navigation bar for Blog pages

**Links:**
- Stylo (logo) → `/`
- Blog → `/blog` (active/highlighted)
- News → `/news`
- Dashboard → `/dashboard`
- Try for Free (CTA) → `/dashboard`

**Usage:**
```tsx
import { BlogNav } from '@/components/blog/BlogNav'

export default function BlogPage() {
  return (
    <div>
      <BlogNav />
      {/* Page content */}
    </div>
  )
}
```

### 2. NewsNav Component

**Location:** `components/news/NewsNav.tsx`

**Purpose:** Navigation bar for News pages

**Links:**
- Stylo (logo) → `/`
- Blog → `/blog`
- News → `/news` (active/highlighted)
- Dashboard → `/dashboard`
- Try for Free (CTA) → `/dashboard`

**Usage:**
```tsx
import { NewsNav } from '@/components/news/NewsNav'

export default function NewsPage() {
  return (
    <div>
      <NewsNav />
      {/* Page content */}
    </div>
  )
}
```

### 3. Footer Component

**Location:** `components/landing/Footer.tsx`

**Purpose:** Global footer with links to all sections

**Product Section Links:**
- Blog → `/blog`
- News → `/news`
- Sign In → `/login`
- Sign Up → `/signup`
- Dashboard → `/dashboard`

**Legal Section Links:**
- Privacy Policy → `/privacy`
- Cookie Policy → `/cookies`
- Terms of Service → `/terms`

**Usage:**
```tsx
import Footer from '@/components/landing/Footer'

export default function Page() {
  return (
    <div>
      {/* Page content */}
      <Footer />
    </div>
  )
}
```

### 4. Breadcrumbs Component

**Location:** `components/blog/Breadcrumbs.tsx`

**Purpose:** SEO-optimized breadcrumb navigation for blog posts

**Features:**
- Visual breadcrumb trail
- JSON-LD structured data for search engines
- Schema.org BreadcrumbList markup
- Automatic locale handling

**Props:**
```typescript
interface BreadcrumbItem {
  label: string  // Display text
  href: string   // Link URL
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}
```

**Usage:**
```tsx
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'

<Breadcrumbs
  items={[
    { label: 'Blog', href: '/blog' },
    { label: 'Post Title', href: '/blog/post-slug' },
  ]}
/>
```

**SEO Benefits:**
- Helps search engines understand site hierarchy
- Improves click-through rates in search results
- Enhanced rich snippets in Google
- Better crawlability

## SEO Implementation

### 1. Internal Linking

All pages include links to:
- Home page (via logo)
- Blog section
- News section
- Dashboard

This creates a strong internal linking structure that:
- Distributes page authority (PageRank)
- Helps search engines discover all pages
- Improves user navigation
- Reduces bounce rates

### 2. Breadcrumb Structured Data

Every blog post includes JSON-LD breadcrumb markup:

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

This enables:
- Rich breadcrumb display in Google search results
- Better understanding of page hierarchy
- Improved CTR from search results

### 3. Canonical URLs

Each page includes proper canonical URLs:
```tsx
alternates: {
  canonical: `${baseUrl}/${locale}/blog/${slug}`,
  languages: {
    en: `${baseUrl}/en/blog/${slug}`,
    sk: `${baseUrl}/sk/blog/${slug}`,
    // ... other locales
  },
}
```

### 4. hreflang Tags

Proper multilingual SEO with hreflang tags in the head:
```tsx
<head>
  {locales.map((loc) => (
    <link key={loc} rel="alternate" hrefLang={loc} href={`/${loc}`} />
  ))}
  <link rel="alternate" hrefLang="x-default" href="/en" />
</head>
```

## Page Structure Examples

### Blog Post Page Structure

```
BlogNav (sticky navigation)
  ↓
Breadcrumbs (SEO structured data)
  ↓
Back to Blog link
  ↓
BlogHeader (title, author, date)
  ↓
BlogContent (MDX content)
  ↓
BlogCTA (call-to-action)
  ↓
Tags
  ↓
RelatedPosts
  ↓
Footer (global links)
```

### News Page Structure

```
NewsNav (sticky navigation)
  ↓
Hero Section (with stats)
  ↓
NewsTimeline (grouped by month)
  ↓
Footer (global links)
```

## Maintenance

### Adding New Navigation Links

1. **Update BlogNav:**
   - Edit `components/blog/BlogNav.tsx`
   - Add new link in the navigation gap-6 div

2. **Update NewsNav:**
   - Edit `components/news/NewsNav.tsx`
   - Add new link in the navigation gap-6 div

3. **Update Footer:**
   - Edit `components/landing/Footer.tsx`
   - Add to appropriate section (Product, Legal, etc.)

### Adding Breadcrumbs to New Pages

```tsx
import { Breadcrumbs } from '@/components/blog/Breadcrumbs'

export default function Page() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Section', href: '/section' },
          { label: 'Page Title', href: '/section/page' },
        ]}
      />
      {/* Page content */}
    </div>
  )
}
```

### Best Practices

1. **Always use the Link component from `@/i18n/navigation`**
   - Ensures proper locale handling
   - Maintains language context across navigation

2. **Keep navigation consistent**
   - Same order of links across all nav components
   - Same styling patterns

3. **Test breadcrumbs with Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Verify JSON-LD is valid

4. **Monitor internal linking with Google Search Console**
   - Check "Links" report
   - Ensure all important pages are linked

## Locale Handling

All navigation components use the internationalized Link:

```tsx
import { Link } from '@/i18n/navigation'

<Link href="/blog">Blog</Link>
// Automatically becomes /en/blog, /sk/blog, etc.
```

This ensures:
- Users stay in their selected language
- No language switching during navigation
- Proper SEO for each locale

## SEO Components

### News SEO Components

**NewsJsonLd Component**

**Location:** `components/news/NewsJsonLd.tsx`

**Purpose:** Adds JSON-LD structured data for News timeline

**Schema Types:**
- `ItemList` - Main timeline structure
- `Article` - Individual news items
- `WebSite` - Organization information

**Usage:**
```tsx
import { NewsJsonLd } from '@/components/news/NewsJsonLd'

export default function NewsPage() {
  const news = await getAllNews(locale)

  return (
    <>
      <NewsJsonLd news={news} locale={locale} />
      <div>{/* Page content */}</div>
    </>
  )
}
```

**SEO Benefits:**
- Rich snippets in Google search results
- Better content understanding by search engines
- Enhanced search result display
- Improved click-through rates

### Breadcrumbs on News Page

The News page now includes breadcrumbs for SEO:

```tsx
<Breadcrumbs
  items={[
    { label: 'News', href: '/news' },
  ]}
/>
```

This provides:
- Visual navigation trail
- JSON-LD BreadcrumbList structured data
- Better search engine understanding
- Improved user experience

## Related Files

### Navigation Components
- `/components/blog/BlogNav.tsx` - Blog navigation (includes News link)
- `/components/news/NewsNav.tsx` - News navigation (includes Blog link)
- `/components/landing/Footer.tsx` - Global footer (includes Blog + News)
- `/components/blog/Breadcrumbs.tsx` - SEO breadcrumbs (used in Blog & News)

### SEO Components
- `/components/blog/BlogJsonLd.tsx` - Blog post structured data
- `/components/news/NewsJsonLd.tsx` - News timeline structured data

### Page Files
- `/app/[locale]/blog/page.tsx` - Blog index page
- `/app/[locale]/blog/[slug]/page.tsx` - Individual blog post (with breadcrumbs)
- `/app/[locale]/news/page.tsx` - News/changelog page (with breadcrumbs + SEO)

### Configuration
- `/i18n/navigation.ts` - Internationalized routing
- `/i18n/config.ts` - Locale configuration

## Testing Checklist

- [ ] All navigation links work correctly
- [ ] Breadcrumbs display on blog posts
- [ ] JSON-LD validates in Rich Results Test
- [ ] Footer links to all sections
- [ ] Locale switching maintains navigation context
- [ ] Mobile navigation works properly
- [ ] Active states highlight current section
- [ ] All CTAs link to dashboard

## Future Improvements

1. Add category/tag breadcrumbs for blog posts
2. Implement "You are here" sidebar for deep navigation
3. Add related content suggestions in footer
4. Create sitemap.xml with proper internal linking
5. Add search functionality to find content across Blog and News
