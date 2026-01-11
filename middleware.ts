import { createServerClient } from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/i18n/config';
import { getLocaleFromCountry } from '@/lib/constants/country-locale-map';

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip static files, API routes, and auth callback
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth/callback') ||
    pathname.includes('.') ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js'
  ) {
    return NextResponse.next();
  }

  // Check if path has locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in path, detect and redirect
  if (!pathnameHasLocale) {
    let detectedLocale: Locale = defaultLocale;

    // 1. Check for saved locale cookie
    const savedLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (savedLocale && locales.includes(savedLocale as Locale)) {
      detectedLocale = savedLocale as Locale;
    } else {
      // 2. Try geo-detection (Vercel provides this header)
      const country = request.headers.get('x-vercel-ip-country');
      if (country) {
        detectedLocale = getLocaleFromCountry(country);
      } else {
        // 3. Fall back to Accept-Language header
        const acceptLanguage = request.headers.get('accept-language');
        if (acceptLanguage) {
          const browserLocales = acceptLanguage
            .split(',')
            .map((l) => l.split(';')[0].split('-')[0].toLowerCase());
          const matchedLocale = browserLocales.find((l) =>
            locales.includes(l as Locale)
          );
          if (matchedLocale) {
            detectedLocale = matchedLocale as Locale;
          }
        }
      }
    }

    // Redirect to locale-prefixed path
    const url = request.nextUrl.clone();
    url.pathname = `/${detectedLocale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  // Get current locale from path
  const currentLocale = pathname.split('/')[1] as Locale;

  // Run intl middleware first
  const intlResponse = intlMiddleware(request);

  // Now handle Supabase auth
  let supabaseResponse = intlResponse || NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get path without locale prefix
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';

  // Redirect authenticated users from auth pages to dashboard
  if (
    user &&
    (pathWithoutLocale === '/login' || pathWithoutLocale === '/signup')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${currentLocale}/dashboard`;
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from landing page to dashboard
  if (user && pathWithoutLocale === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/${currentLocale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|auth/callback|.*\\..*).*)'],
};
