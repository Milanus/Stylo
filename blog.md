# Blog Architektúra - Stylo

## Prečo blog?

Blog zvýši organickú návštevnosť cez SEO. Témy ako "ako zlepšiť gramatiku", "formálny vs neformálny štýl" alebo "AI nástroje na písanie" priamo súvisia s produktom a priťahujú cieľových používateľov.

---

## 1. Štruktúra súborov

```
app/
  [locale]/
    blog/
      page.tsx                    # Blog listing stránka (/blog)
      [slug]/
        page.tsx                  # Detail článku (/blog/moj-clanok)
      category/
        [category]/
          page.tsx                # Filtrovanie podľa kategórie (/blog/category/ai-writing)

content/
  blog/
    en/
      how-to-improve-grammar.mdx
      formal-vs-informal-writing.mdx
      ai-tools-for-writing.mdx
    sk/
      ako-zlepsit-gramatiku.mdx
      formalny-vs-neformalny-styl.mdx
    cs/
      ...
    de/
      ...
    es/
      ...

lib/
  blog/
    mdx.ts                       # MDX parsing + frontmatter extraction
    types.ts                     # BlogPost, BlogCategory, BlogMeta typy
    utils.ts                     # Slug generácia, reading time, helpers
    validation.ts                # Validácia frontmatter a obsahu

components/
  blog/
    BlogCard.tsx                 # Karta článku v listingu
    BlogList.tsx                 # Grid/list článkov
    BlogHeader.tsx               # Hero sekcia článku (title, author, date, reading time)
    BlogContent.tsx              # MDX renderer s custom komponentmi
    BlogSidebar.tsx              # Sidebar - TOC, súvisiace články, CTA
    BlogCTA.tsx                  # Call-to-action banner (skúsi Stylo zadarmo)
    BlogCategoryFilter.tsx       # Filter podľa kategórií
    TableOfContents.tsx          # Automaticky generovaný obsah z headingov
    ShareButtons.tsx             # Zdieľanie na sociálne siete
    BlogPagination.tsx           # Stránkovanie
```

---

## 2. Dátový model

### Frontmatter (MDX)

```yaml
---
title: "Ako zlepšiť gramatiku v textoch"
slug: "ako-zlepsit-gramatiku"
description: "Praktický sprievodca zlepšením gramatiky pomocou AI nástrojov."
category: "ai-writing"
tags: ["gramatika", "AI", "písanie"]
author: "Stylo Team"
publishedAt: "2026-01-30"
updatedAt: "2026-01-30"
locale: "sk"
featured: false
coverImage: "/blog/covers/grammar-guide.webp"
---
```

### TypeScript typy

```typescript
// lib/blog/types.ts

interface BlogMeta {
  title: string;
  slug: string;
  description: string;        // max 160 znakov (meta description)
  category: BlogCategory;
  tags: string[];
  author: string;
  publishedAt: string;         // ISO 8601
  updatedAt: string;
  locale: Locale;
  featured: boolean;
  coverImage: string;
}

interface BlogPost extends BlogMeta {
  content: string;             // MDX raw content
  readingTime: number;         // minúty
}

type BlogCategory =
  | "ai-writing"
  | "grammar-tips"
  | "productivity"
  | "tutorials"
  | "product-updates";

type Locale = "en" | "sk" | "cs" | "de" | "es";
```

---

## 3. SEO stratégia

### 3.1 Technické SEO

**Metadata na každom článku:**

```typescript
// app/[locale]/blog/[slug]/page.tsx

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug, params.locale);

  return {
    title: `${post.title} | Stylo Blog`,
    description: post.description,           // max 160 znakov
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      locale: post.locale,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
    alternates: {
      canonical: `/${post.locale}/blog/${post.slug}`,
      languages: {
        en: `/en/blog/${post.slug}`,
        sk: `/sk/blog/${post.slug}`,
        cs: `/cs/blog/${post.slug}`,
        de: `/de/blog/${post.slug}`,
        es: `/es/blog/${post.slug}`,
      },
    },
  };
}
```

**Structured Data (JSON-LD):**

```typescript
// components/blog/BlogJsonLd.tsx

function BlogJsonLd({ post }: { post: BlogPost }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Stylo",
      logo: { "@type": "ImageObject", url: "/icon-512.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://stylo.app/blog/${post.slug}`,
    },
    wordCount: post.content.split(/\s+/).length,
    inLanguage: post.locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

**Sitemap:**

```typescript
// app/sitemap.ts - rozšíriť existujúci sitemap

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["en", "sk", "cs", "de", "es"];
  const posts = await getAllPosts();

  const blogEntries = posts.flatMap((post) =>
    locales.map((locale) => ({
      url: `https://stylo.app/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "weekly" as const,
      priority: post.featured ? 0.9 : 0.7,
    }))
  );

  return [...existingEntries, ...blogEntries];
}
```

### 3.2 Hreflang (multijazyčné SEO)

Už existujúci `next-intl` sa postará o locale prefix. Pre blog je dôležité:

- Každý článok má `alternates.languages` v metadata
- Rôzne jazykové verzie sú prepojené cez rovnaký slug alebo mapovanie
- Ak preklad neexistuje, fallback na anglickú verziu

### 3.3 URL štruktúra

```
/en/blog                          → Blog listing (EN)
/sk/blog                          → Blog listing (SK)
/en/blog/how-to-improve-grammar   → Článok (EN)
/sk/blog/ako-zlepsit-gramatiku    → Článok (SK)
/en/blog/category/ai-writing      → Kategória (EN)
```

### 3.4 Internal linking

- Každý článok obsahuje CTA smerujúci na `/dashboard` (konverzia)
- Sidebar s odkazmi na súvisiace články
- Kategórie prepájajú tematicky príbuzné články

---

## 4. Clean Code princípy

### 4.1 Oddelenie zodpovedností (Separation of Concerns)

```
lib/blog/mdx.ts        → Čistá logika: parsovanie MDX, načítanie súborov
lib/blog/types.ts      → Typy a interfaces - žiadna logika
lib/blog/utils.ts      → Pure funkcie (slug, reading time)
lib/blog/validation.ts → Validácia vstupov

components/blog/       → Len prezentačná vrstva, žiadna business logika
app/[locale]/blog/     → Len routing a data fetching (server components)
```

### 4.2 Konvencie a pravidlá

| Pravidlo | Príklad |
|----------|---------|
| Slug = kebab-case | `how-to-improve-grammar` |
| Súbory MDX = slug + `.mdx` | `how-to-improve-grammar.mdx` |
| Komponenty = PascalCase | `BlogCard.tsx` |
| Utility funkcie = camelCase | `getReadingTime()` |
| Typy exportované z jedného miesta | `lib/blog/types.ts` |
| Žiadne magic strings | Kategórie ako type union |
| Server components by default | Klient len pre interaktívne prvky |

### 4.3 Príklad čistého kódu

```typescript
// lib/blog/mdx.ts

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { BlogMeta, BlogPost, Locale } from "./types";
import { validateFrontmatter } from "./validation";
import { calculateReadingTime } from "./utils";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export async function getPostBySlug(
  slug: string,
  locale: Locale
): Promise<BlogPost> {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);

  const meta = validateFrontmatter(data);

  return {
    ...meta,
    content,
    readingTime: calculateReadingTime(content),
  };
}

export async function getAllPosts(locale: Locale): Promise<BlogMeta[]> {
  const dir = path.join(CONTENT_DIR, locale);
  const files = await fs.readdir(dir);

  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, "");
        const post = await getPostBySlug(slug, locale);
        const { content, ...meta } = post;
        return meta;
      })
  );

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
```

```typescript
// lib/blog/utils.ts

const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatDate(dateString: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}
```

### 4.4 Static Generation

```typescript
// app/[locale]/blog/[slug]/page.tsx

export async function generateStaticParams() {
  const locales = ["en", "sk", "cs", "de", "es"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const posts = await getAllPosts(locale as Locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}
```

Všetky blog stránky sú **staticky generované** (SSG) pri builde. Žiadne API volania pri každom requeste = rýchle načítanie, lepšie SEO.

---

## 5. Bezpečnosť

### 5.1 Vstupná validácia

```typescript
// lib/blog/validation.ts

import { BlogMeta, BlogCategory } from "./types";

const VALID_CATEGORIES: BlogCategory[] = [
  "ai-writing",
  "grammar-tips",
  "productivity",
  "tutorials",
  "product-updates",
];

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 160;
const MAX_TAGS = 10;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateFrontmatter(data: Record<string, unknown>): BlogMeta {
  if (typeof data.title !== "string" || data.title.length > MAX_TITLE_LENGTH) {
    throw new Error(`Invalid title: must be string, max ${MAX_TITLE_LENGTH} chars`);
  }

  if (typeof data.slug !== "string" || !SLUG_PATTERN.test(data.slug)) {
    throw new Error("Invalid slug: must be kebab-case alphanumeric");
  }

  if (
    typeof data.description !== "string" ||
    data.description.length > MAX_DESCRIPTION_LENGTH
  ) {
    throw new Error(
      `Invalid description: must be string, max ${MAX_DESCRIPTION_LENGTH} chars`
    );
  }

  if (!VALID_CATEGORIES.includes(data.category as BlogCategory)) {
    throw new Error(`Invalid category: ${data.category}`);
  }

  if (!Array.isArray(data.tags) || data.tags.length > MAX_TAGS) {
    throw new Error(`Invalid tags: must be array, max ${MAX_TAGS}`);
  }

  // Sanitizácia tagov - prevencia XSS
  const sanitizedTags = data.tags.map((tag: unknown) => {
    if (typeof tag !== "string") throw new Error("Tag must be string");
    return tag.replace(/<[^>]*>/g, "").trim();
  });

  return {
    title: data.title,
    slug: data.slug,
    description: data.description,
    category: data.category as BlogCategory,
    tags: sanitizedTags,
    author: typeof data.author === "string" ? data.author : "Stylo Team",
    publishedAt: validateISODate(data.publishedAt),
    updatedAt: validateISODate(data.updatedAt),
    locale: validateLocale(data.locale),
    featured: data.featured === true,
    coverImage: validateImagePath(data.coverImage),
  };
}

function validateISODate(value: unknown): string {
  if (typeof value !== "string" || isNaN(Date.parse(value))) {
    throw new Error(`Invalid date: ${value}`);
  }
  return value;
}

function validateLocale(value: unknown): Locale {
  const validLocales = ["en", "sk", "cs", "de", "es"];
  if (typeof value !== "string" || !validLocales.includes(value)) {
    throw new Error(`Invalid locale: ${value}`);
  }
  return value as Locale;
}

function validateImagePath(value: unknown): string {
  if (typeof value !== "string") throw new Error("coverImage must be string");

  // Prevencia path traversal
  if (value.includes("..") || !value.startsWith("/blog/covers/")) {
    throw new Error("Invalid image path: must start with /blog/covers/");
  }

  // Povolené len bezpečné prípony
  const allowedExtensions = [".webp", ".jpg", ".jpeg", ".png", ".avif"];
  const ext = value.substring(value.lastIndexOf(".")).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    throw new Error(`Invalid image extension: ${ext}`);
  }

  return value;
}
```

### 5.2 MDX bezpečnosť

```typescript
// lib/blog/mdx.ts - bezpečný MDX render

import { compileMDX } from "next-mdx-remote/rsc";

// Whitelist povolených komponentov - žiadne dangerouslySetInnerHTML
const ALLOWED_COMPONENTS = {
  // Len bezpečné, kontrolované komponenty
  img: ({ src, alt }: { src: string; alt: string }) => (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={450}
      loading="lazy"
    />
  ),
  a: ({ href, children }: { href: string; children: React.ReactNode }) => {
    // Prevencia javascript: protokolu
    if (href?.startsWith("javascript:")) return <span>{children}</span>;

    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  },
  code: CodeBlock,
  Callout: CalloutBox,
  BlogCTA: BlogCTAComponent,
};
```

### 5.3 Bezpečnostný checklist

| Riziko | Opatrenie |
|--------|-----------|
| **XSS cez MDX** | Whitelist komponentov, sanitizácia tagov a obsahu |
| **Path traversal** | Validácia slug (regex), validácia image path |
| **Injection cez frontmatter** | Striktná validácia všetkých polí |
| **Neautorizovaný prístup** | Blog je verejný (read-only), žiadne user inputs |
| **DoS cez veľké súbory** | Max veľkosť MDX súboru (100KB limit) |
| **SEO spam / injection** | Meta description max 160 znakov, validovaný obsah |
| **External links** | `rel="noopener noreferrer"` na všetkých externých odkazoch |
| **Image abuse** | Povolené len `/blog/covers/` prefix + whitelist prípon |
| **CSP headers** | Existujúce security headers v `next.config.ts` pokrývajú aj blog |

---

## 6. Závislosti na pridanie

```bash
npm install gray-matter next-mdx-remote reading-time
```

| Balík | Účel |
|-------|------|
| `gray-matter` | Parsovanie YAML frontmatter z MDX |
| `next-mdx-remote` | Server-side MDX rendering (RSC kompatibilný) |
| `reading-time` | Výpočet času čítania (alternatíva k vlastnej utilite) |

---

## 7. Preklady (i18n)

Rozšíriť existujúce `messages/*.json`:

```json
// messages/en.json (doplniť)
{
  "blog": {
    "title": "Blog",
    "readMore": "Read more",
    "readingTime": "{minutes} min read",
    "publishedOn": "Published on {date}",
    "updatedOn": "Updated on {date}",
    "categories": {
      "ai-writing": "AI Writing",
      "grammar-tips": "Grammar Tips",
      "productivity": "Productivity",
      "tutorials": "Tutorials",
      "product-updates": "Product Updates"
    },
    "noPostsFound": "No posts found.",
    "backToBlog": "Back to blog",
    "shareArticle": "Share this article",
    "relatedPosts": "Related posts",
    "tryStyleFree": "Try Stylo for free"
  }
}
```

---

## 8. Implementačné kroky

1. Nainštalovať závislosti (`gray-matter`, `next-mdx-remote`)
2. Vytvoriť `lib/blog/types.ts`, `validation.ts`, `mdx.ts`, `utils.ts`
3. Vytvoriť `content/blog/en/` adresár a prvý testovací článok
4. Vytvoriť blog komponenty (`BlogCard`, `BlogList`, `BlogHeader`, `BlogContent`)
5. Vytvoriť stránky (`blog/page.tsx`, `blog/[slug]/page.tsx`)
6. Pridať JSON-LD structured data
7. Rozšíriť sitemap o blog URLs
8. Pridať blog preklady do `messages/*.json`
9. Pridať navigačný odkaz na blog do layoutu / landing page
10. Napísať 3-5 seed článkov v angličtine
11. Preložiť seed články do ostatných jazykov
