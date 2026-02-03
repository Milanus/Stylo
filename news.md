# News Feed - Implementačný Plán

## Prehľad

News feed bude slúžiť ako changelog/novinky pre Stylo aplikáciu. Bude obsahovať krátke správy o nových funkciách, opravách a vylepšeniach.

### Požiadavky:
- ✅ Manuálne písanie news (nie automaticky z git)
- ✅ Preložené do 5 jazykov (en, sk, cs, de, es)
- ✅ Samostatná `/news` stránka (timeline dizajn)
- ✅ API endpoint pre mobilné aplikácie
- ✅ SEO optimalizované

---

## 1. Štruktúra Súborov

```
text-editor-app/
├── content/
│   └── news/
│       ├── en/
│       │   ├── 2024-02-03-humanize-toggle.json
│       │   ├── 2024-02-01-history-improvements.json
│       │   └── 2024-01-28-copy-fix.json
│       ├── sk/
│       │   └── ... (rovnaké súbory)
│       ├── cs/
│       ├── de/
│       └── es/
│
├── lib/
│   └── news/
│       ├── types.ts          # TypeScript typy
│       ├── loader.ts         # Načítanie news z JSON
│       └── utils.ts          # Pomocné funkcie
│
├── app/
│   ├── [locale]/
│   │   └── news/
│   │       └── page.tsx      # News stránka
│   │
│   └── api/
│       └── news/
│           └── route.ts      # API endpoint
│
└── components/
    └── news/
        ├── NewsTimeline.tsx  # Timeline komponent
        ├── NewsItem.tsx      # Jednotlivá news položka
        └── NewsNav.tsx       # Navigácia (reuse BlogNav štýl)
```

---

## 2. Typy a Rozhrania

### `lib/news/types.ts`

```typescript
// Typ news položky
export type NewsType = 'feature' | 'fix' | 'improvement' | 'announcement';

// Podporované jazyky
export type Locale = 'en' | 'sk' | 'cs' | 'de' | 'es';

// Metadata pre jednu news položku
export interface NewsItem {
  id: string;                    // Unique ID (napr. "2024-02-03-humanize-toggle")
  type: NewsType;                // Typ: feature, fix, improvement, announcement
  title: string;                 // Nadpis
  description: string;           // Krátky popis (1-3 vety)
  date: string;                  // ISO dátum (2024-02-03)
  version?: string;              // Voliteľná verzia (napr. "1.2.0")
  link?: string;                 // Voliteľný link na viac info
}

// News zoskupené podľa mesiaca (pre timeline)
export interface NewsGroup {
  month: string;                 // "Február 2024"
  items: NewsItem[];
}

// API response
export interface NewsApiResponse {
  success: boolean;
  data: NewsItem[];
  total: number;
  locale: Locale;
}
```

---

## 3. JSON Formát News

### Príklad: `content/news/en/2024-02-03-humanize-toggle.json`

```json
{
  "id": "2024-02-03-humanize-toggle",
  "type": "feature",
  "title": "New Humanize Toggle",
  "description": "We've added a new Humanize toggle that makes AI-generated text sound more natural and human-like. This feature is available for registered users.",
  "date": "2024-02-03",
  "version": "1.2.0"
}
```

### Príklad: `content/news/sk/2024-02-03-humanize-toggle.json`

```json
{
  "id": "2024-02-03-humanize-toggle",
  "type": "feature",
  "title": "Nový Humanize prepínač",
  "description": "Pridali sme nový Humanize prepínač, ktorý robí AI-generovaný text prirodzenejším a ľudskejším. Táto funkcia je dostupná pre registrovaných používateľov.",
  "date": "2024-02-03",
  "version": "1.2.0"
}
```

---

## 4. Utility Funkcie

### `lib/news/loader.ts`

```typescript
import fs from 'fs';
import path from 'path';
import { NewsItem, Locale } from './types';

const NEWS_DIR = path.join(process.cwd(), 'content', 'news');

/**
 * Načíta všetky news pre daný jazyk
 */
export async function getAllNews(locale: Locale): Promise<NewsItem[]> {
  const localeDir = path.join(NEWS_DIR, locale);

  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const files = fs.readdirSync(localeDir)
    .filter(file => file.endsWith('.json'));

  const news: NewsItem[] = files.map(file => {
    const filePath = path.join(localeDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as NewsItem;
  });

  // Zoradiť podľa dátumu (najnovšie prvé)
  return news.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Načíta news podľa typu
 */
export async function getNewsByType(
  locale: Locale,
  type: NewsItem['type']
): Promise<NewsItem[]> {
  const allNews = await getAllNews(locale);
  return allNews.filter(item => item.type === type);
}

/**
 * Načíta poslednú news položku
 */
export async function getLatestNews(locale: Locale): Promise<NewsItem | null> {
  const allNews = await getAllNews(locale);
  return allNews[0] || null;
}

/**
 * Načíta news s limitom
 */
export async function getRecentNews(
  locale: Locale,
  limit: number = 10
): Promise<NewsItem[]> {
  const allNews = await getAllNews(locale);
  return allNews.slice(0, limit);
}
```

### `lib/news/utils.ts`

```typescript
import { NewsItem, NewsGroup, NewsType } from './types';

/**
 * Zoskupí news podľa mesiaca
 */
export function groupNewsByMonth(
  news: NewsItem[],
  locale: string
): NewsGroup[] {
  const groups: Map<string, NewsItem[]> = new Map();

  news.forEach(item => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const monthName = date.toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric'
    });

    if (!groups.has(monthKey)) {
      groups.set(monthKey, []);
    }
    groups.get(monthKey)!.push(item);
  });

  // Konvertovať na pole a zoradiť
  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, items]) => {
      const date = new Date(items[0].date);
      return {
        month: date.toLocaleDateString(locale, {
          month: 'long',
          year: 'numeric'
        }),
        items: items.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      };
    });
}

/**
 * Vráti emoji/ikonu pre typ news
 */
export function getNewsTypeIcon(type: NewsType): string {
  const icons: Record<NewsType, string> = {
    feature: '🚀',
    fix: '🐛',
    improvement: '✨',
    announcement: '📢'
  };
  return icons[type] || '📝';
}

/**
 * Vráti CSS triedu pre typ news
 */
export function getNewsTypeColor(type: NewsType): string {
  const colors: Record<NewsType, string> = {
    feature: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    fix: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    improvement: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    announcement: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

/**
 * Formátuje dátum
 */
export function formatNewsDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short'
  });
}
```

---

## 5. API Endpoint

### `app/api/news/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getAllNews, getNewsByType, getRecentNews } from '@/lib/news/loader';
import { Locale, NewsType, NewsApiResponse } from '@/lib/news/types';

const VALID_LOCALES: Locale[] = ['en', 'sk', 'cs', 'de', 'es'];
const VALID_TYPES: NewsType[] = ['feature', 'fix', 'improvement', 'announcement'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parametre
    const locale = (searchParams.get('locale') || 'en') as Locale;
    const type = searchParams.get('type') as NewsType | null;
    const limit = parseInt(searchParams.get('limit') || '50');

    // Validácia locale
    if (!VALID_LOCALES.includes(locale)) {
      return NextResponse.json(
        { success: false, error: 'Invalid locale' },
        { status: 400 }
      );
    }

    // Validácia type
    if (type && !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid type' },
        { status: 400 }
      );
    }

    // Načítať news
    let news;
    if (type) {
      news = await getNewsByType(locale, type);
    } else {
      news = await getRecentNews(locale, limit);
    }

    const response: NewsApiResponse = {
      success: true,
      data: news,
      total: news.length,
      locale
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });

  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### API Použitie:

```bash
# Všetky news (anglicky)
GET /api/news

# News v slovenčine
GET /api/news?locale=sk

# Len nové funkcie
GET /api/news?type=feature&locale=en

# Posledných 5 news
GET /api/news?limit=5&locale=cs
```

---

## 6. News Stránka

### `app/[locale]/news/page.tsx`

```typescript
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Megaphone } from 'lucide-react';
import { getAllNews } from '@/lib/news/loader';
import { groupNewsByMonth } from '@/lib/news/utils';
import { Locale } from '@/lib/news/types';
import { NewsTimeline } from '@/components/news/NewsTimeline';
import { NewsNav } from '@/components/news/NewsNav';
import Footer from '@/components/landing/Footer';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://stylo.app';

  return {
    title: 'News & Updates | Stylo',
    description: 'Latest news, updates, and improvements to Stylo - your AI text transformation tool.',
    openGraph: {
      title: 'News & Updates | Stylo',
      description: 'Latest news, updates, and improvements to Stylo.',
      type: 'website',
      locale,
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

  const news = await getAllNews(locale as Locale);
  const groupedNews = groupNewsByMonth(news, locale);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <NewsNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-[15%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 mb-6">
              <Megaphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                Changelog
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              News & Updates
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Stay up to date with the latest features, improvements, and fixes in Stylo.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <NewsTimeline groups={groupedNews} locale={locale} />
      </section>

      <Footer />
    </div>
  );
}
```

---

## 7. Komponenty

### `components/news/NewsTimeline.tsx`

```typescript
import { NewsGroup } from '@/lib/news/types';
import { NewsItem } from './NewsItem';

interface Props {
  groups: NewsGroup[];
  locale: string;
}

export function NewsTimeline({ groups, locale }: Props) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">
          No updates yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <div key={group.month}>
          {/* Mesiac header */}
          <div className="sticky top-20 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm py-3 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {group.month}
            </h2>
          </div>

          {/* News items */}
          <div className="space-y-4 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
            {group.items.map((item) => (
              <NewsItem key={item.id} item={item} locale={locale} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### `components/news/NewsItem.tsx`

```typescript
import { NewsItem as NewsItemType } from '@/lib/news/types';
import { getNewsTypeIcon, getNewsTypeColor, formatNewsDate } from '@/lib/news/utils';

interface Props {
  item: NewsItemType;
  locale: string;
}

export function NewsItem({ item, locale }: Props) {
  const icon = getNewsTypeIcon(item.type);
  const colorClass = getNewsTypeColor(item.type);

  return (
    <div className="relative pl-6 pb-6">
      {/* Timeline dot */}
      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-2 border-indigo-500 dark:border-indigo-400" />

      {/* Content */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            <span>{icon}</span>
            <span className="capitalize">{item.type}</span>
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {formatNewsDate(item.date, locale)}
          </span>
          {item.version && (
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              v{item.version}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {item.description}
        </p>

        {/* Optional link */}
        {item.link && (
          <a
            href={item.link}
            className="inline-flex items-center gap-1 mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Learn more →
          </a>
        )}
      </div>
    </div>
  );
}
```

### `components/news/NewsNav.tsx`

```typescript
'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function NewsNav() {
  const tCommon = useTranslations('common');

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + nav links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Stylo
            </Link>
            <div className="hidden sm:flex items-center gap-6">
              <Link
                href="/blog"
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {tCommon('blog')}
              </Link>
              <Link
                href="/news"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400"
              >
                News
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {tCommon('tryForFree')}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

---

## 8. Preklady

### Pridať do `messages/en.json`:

```json
{
  "news": {
    "title": "News & Updates",
    "subtitle": "Stay up to date with the latest features, improvements, and fixes in Stylo.",
    "changelog": "Changelog",
    "noUpdates": "No updates yet. Check back soon!",
    "learnMore": "Learn more",
    "types": {
      "feature": "New Feature",
      "fix": "Bug Fix",
      "improvement": "Improvement",
      "announcement": "Announcement"
    }
  }
}
```

### Pridať do `messages/sk.json`:

```json
{
  "news": {
    "title": "Novinky a Aktualizácie",
    "subtitle": "Zostaňte informovaní o najnovších funkciách, vylepšeniach a opravách v Stylo.",
    "changelog": "Changelog",
    "noUpdates": "Zatiaľ žiadne aktualizácie. Skontrolujte neskôr!",
    "learnMore": "Viac informácií",
    "types": {
      "feature": "Nová funkcia",
      "fix": "Oprava chyby",
      "improvement": "Vylepšenie",
      "announcement": "Oznámenie"
    }
  }
}
```

### Pridať do `messages/cs.json`:

```json
{
  "news": {
    "title": "Novinky a Aktualizace",
    "subtitle": "Zůstaňte informováni o nejnovějších funkcích, vylepšeních a opravách v Stylo.",
    "changelog": "Changelog",
    "noUpdates": "Zatím žádné aktualizace. Zkontrolujte později!",
    "learnMore": "Více informací",
    "types": {
      "feature": "Nová funkce",
      "fix": "Oprava chyby",
      "improvement": "Vylepšení",
      "announcement": "Oznámení"
    }
  }
}
```

### Pridať do `messages/de.json`:

```json
{
  "news": {
    "title": "Neuigkeiten & Updates",
    "subtitle": "Bleiben Sie über die neuesten Funktionen, Verbesserungen und Korrekturen in Stylo informiert.",
    "changelog": "Changelog",
    "noUpdates": "Noch keine Updates. Schauen Sie später wieder vorbei!",
    "learnMore": "Mehr erfahren",
    "types": {
      "feature": "Neue Funktion",
      "fix": "Fehlerbehebung",
      "improvement": "Verbesserung",
      "announcement": "Ankündigung"
    }
  }
}
```

### Pridať do `messages/es.json`:

```json
{
  "news": {
    "title": "Noticias y Actualizaciones",
    "subtitle": "Mantente al día con las últimas funciones, mejoras y correcciones en Stylo.",
    "changelog": "Changelog",
    "noUpdates": "Aún no hay actualizaciones. ¡Vuelve pronto!",
    "learnMore": "Más información",
    "types": {
      "feature": "Nueva función",
      "fix": "Corrección de error",
      "improvement": "Mejora",
      "announcement": "Anuncio"
    }
  }
}
```

---

## 9. Navigácia a Linky

### Pridať news do existujúcich komponentov:

#### `components/landing/Footer.tsx` - pridať link:
```tsx
<li>
  <Link href="/news" className="...">
    News
  </Link>
</li>
```

#### `components/blog/BlogNav.tsx` - pridať link:
```tsx
<Link href="/news" className="...">
  News
</Link>
```

#### Dashboard header - pridať link vedľa Blog:
```tsx
<Button variant="ghost" size="sm" onClick={() => router.push('/news')}>
  <Megaphone className="w-3.5 h-3.5" />
  News
</Button>
```

---

## 10. Sitemap Integrácia

### Upraviť `app/sitemap.ts`:

```typescript
import { getAllNews } from '@/lib/news/loader';

// Pridať news stránky do sitemap
const newsPages: MetadataRoute.Sitemap = locales.map((locale) => ({
  url: `${baseUrl}/${locale}/news`,
  lastModified: new Date(),
  changeFrequency: 'daily' as const,
  priority: 0.8,
}));

return [...staticPages, ...blogPosts, ...newsPages];
```

---

## 11. Implementačné Kroky (Poradie)

### Fáza 1: Základná štruktúra
1. [ ] Vytvoriť `lib/news/types.ts`
2. [ ] Vytvoriť `lib/news/loader.ts`
3. [ ] Vytvoriť `lib/news/utils.ts`
4. [ ] Vytvoriť `content/news/en/` priečinok
5. [ ] Pridať prvú testovaciu news (JSON)

### Fáza 2: API
6. [ ] Vytvoriť `app/api/news/route.ts`
7. [ ] Otestovať API endpoint

### Fáza 3: UI Komponenty
8. [ ] Vytvoriť `components/news/NewsNav.tsx`
9. [ ] Vytvoriť `components/news/NewsItem.tsx`
10. [ ] Vytvoriť `components/news/NewsTimeline.tsx`

### Fáza 4: Stránka
11. [ ] Vytvoriť `app/[locale]/news/page.tsx`
12. [ ] Pridať SEO metadata

### Fáza 5: Preklady
13. [ ] Pridať `news` sekciu do všetkých 5 message súborov
14. [ ] Vytvoriť preložené JSON súbory pre news

### Fáza 6: Integrácia
15. [ ] Pridať news link do Footer
16. [ ] Pridať news link do BlogNav
17. [ ] Pridať news link do Dashboard header
18. [ ] Aktualizovať sitemap

### Fáza 7: Testovanie
19. [ ] Otestovať stránku vo všetkých jazykoch
20. [ ] Otestovať API endpoint
21. [ ] Otestovať responzívny dizajn
22. [ ] Otestovať SEO (meta tagy)

---

## 12. Príklady News Obsahu

### Ukážka pre 3 news položky:

**1. Feature - Humanize Toggle**
```json
{
  "id": "2024-02-03-humanize-toggle",
  "type": "feature",
  "title": "New Humanize Toggle",
  "description": "Make your AI-generated text sound more natural with our new Humanize toggle. Available for all registered users in the transformation settings.",
  "date": "2024-02-03",
  "version": "1.2.0"
}
```

**2. Improvement - History Management**
```json
{
  "id": "2024-02-01-history-improvements",
  "type": "improvement",
  "title": "Enhanced History Management",
  "description": "We've improved the transformation history with better filtering, search, and the ability to quickly reload past transformations.",
  "date": "2024-02-01",
  "version": "1.1.5"
}
```

**3. Fix - Copy Button**
```json
{
  "id": "2024-01-28-copy-fix",
  "type": "fix",
  "title": "Copy Button Fix",
  "description": "Fixed an issue where the copy button wasn't working correctly on some mobile browsers. Thanks to everyone who reported this!",
  "date": "2024-01-28",
  "version": "1.1.4"
}
```

---

## Zhrnutie

Tento plán poskytuje kompletný návod na implementáciu News feedu pre Stylo. Po dokončení budeš mať:

- ✅ Samostatnú `/news` stránku s timeline dizajnom
- ✅ API endpoint pre mobilné aplikácie (`/api/news`)
- ✅ Podporu pre 5 jazykov
- ✅ 4 typy news (feature, fix, improvement, announcement)
- ✅ SEO optimalizáciu
- ✅ Integráciu s existujúcou navigáciou

**Odhadovaný čas implementácie: 2-3 hodiny**
