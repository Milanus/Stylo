import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Prevent clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevent MIME type sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()', // Disable unnecessary features
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // Enable XSS filter (legacy browsers)
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com", // unsafe-inline/eval needed for Next.js
              "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for styled-components
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://ebblnqirzhmyncpkscux.supabase.co https://api.openai.com https://open-python-8469.upstash.io https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
};

export default withNextIntl(nextConfig);
