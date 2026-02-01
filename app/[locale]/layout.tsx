import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import '../globals.css';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import CookieConsent from '@/components/CookieConsent';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'latin-ext'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'latin-ext'],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  const t = messages as Record<string, Record<string, string>>;

  return {
    title: t.metadata?.title || 'Stylo - AI Text Transformation',
    description: t.metadata?.description,
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Stylo',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    alternates: {
      languages: locales.reduce(
        (acc, loc) => ({
          ...acc,
          [loc]: `/${loc}`,
        }),
        {}
      ),
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#6366f1',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
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
          src="https://www.googletagmanager.com/gtag/js?id=G-5KTEHJPS9M"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5KTEHJPS9M');
          `}
        </Script>
        {locales.map((loc) => (
          <link key={loc} rel="alternate" hrefLang={loc} href={`/${loc}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href="/en" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
          <InstallPrompt />
          <CookieConsent />
          <GoogleAnalytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
