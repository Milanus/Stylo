import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { NewsItem, Locale, NewsType } from './types';

const NEWS_DIR = path.join(process.cwd(), 'content', 'news');

/**
 * Načíta všetky news pre daný jazyk
 * Optimized with React.cache() for per-request deduplication (Vercel Best Practice 3.4)
 */
export const getAllNews = cache(async (locale: Locale): Promise<NewsItem[]> => {
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
  // Using toSorted() for immutability (Vercel Best Practice 7.12)
  return news.toSorted((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

/**
 * Načíta news podľa typu
 * Cached via getAllNews call
 */
export async function getNewsByType(
  locale: Locale,
  type: NewsType
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
