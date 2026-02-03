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

    if (!groups.has(monthKey)) {
      groups.set(monthKey, []);
    }
    groups.get(monthKey)!.push(item);
  });

  // Konvertovať na pole a zoradiť
  // Using toSorted() for immutability (Vercel Best Practice 7.12)
  return Array.from(groups.entries())
    .toSorted((a, b) => b[0].localeCompare(a[0]))
    .map(([, items]) => {
      const date = new Date(items[0].date);
      return {
        month: date.toLocaleDateString(locale, {
          month: 'long',
          year: 'numeric'
        }),
        // Sort items within group using toSorted()
        items: items.toSorted((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      };
    });
}

// Icon mapping for news types - hoisted to module scope (Vercel Best Practice 6.3)
const NEWS_TYPE_ICONS: Record<NewsType, string> = {
  feature: '🚀',
  fix: '🐛',
  improvement: '✨',
  announcement: '📢'
};

/**
 * Vráti emoji/ikonu pre typ news
 */
export function getNewsTypeIcon(type: NewsType): string {
  return NEWS_TYPE_ICONS[type] || '📝';
}

// Color mapping for news types - hoisted to module scope (Vercel Best Practice 6.3)
const NEWS_TYPE_COLORS: Record<NewsType, string> = {
  feature: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  fix: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  improvement: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  announcement: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
};

/**
 * Vráti CSS triedu pre typ news
 */
export function getNewsTypeColor(type: NewsType): string {
  return NEWS_TYPE_COLORS[type] || 'bg-gray-100 text-gray-800';
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
