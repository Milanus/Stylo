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
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    // Validácia locale - early return (Vercel Best Practice 7.8)
    if (!VALID_LOCALES.includes(locale)) {
      return NextResponse.json(
        { success: false, error: 'Invalid locale' },
        { status: 400 }
      );
    }

    // Validácia type - early return (Vercel Best Practice 7.8)
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
