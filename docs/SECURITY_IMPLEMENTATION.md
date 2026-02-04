# Security Implementation Guide

Practical step-by-step guide to implement security measures for Blog and News sections.

---

## 🚀 Quick Start - Essential Security

### Step 1: Add Content Validation (15 min)

Install Zod for runtime validation:

```bash
npm install zod
```

**Update Blog Loader:**

```typescript
// lib/blog/mdx.ts
import { z } from 'zod'

const PostFrontmatterSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  author: z.string().min(1).max(100),
  tags: z.array(z.string().max(50)).max(10),
  publishedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  coverImage: z.string().url(),
  locale: z.enum(['en', 'sk', 'cs', 'de', 'es']),
  category: z.string().max(50),
})

export async function getPostBySlug(slug: string, locale: Locale) {
  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Invalid slug format')
  }

  const filePath = path.join(BLOG_DIR, locale, `${slug}.mdx`)

  // Verify path is within blog directory
  if (!filePath.startsWith(path.join(BLOG_DIR, locale))) {
    throw new Error('Invalid file path')
  }

  const source = fs.readFileSync(filePath, 'utf-8')
  const { frontmatter, content } = parseFrontmatter(source)

  // Validate frontmatter
  const validatedFrontmatter = PostFrontmatterSchema.parse(frontmatter)

  return { frontmatter: validatedFrontmatter, content }
}
```

**Update News Loader:**

```typescript
// lib/news/loader.ts
import { z } from 'zod'

const NewsItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(['feature', 'fix', 'improvement', 'announcement']),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  link: z.string().url().optional(),
})

export const getAllNews = cache(async (locale: Locale): Promise<NewsItem[]> => {
  const localeDir = path.join(NEWS_DIR, locale)

  if (!fs.existsSync(localeDir)) {
    return []
  }

  const files = fs.readdirSync(localeDir)
    .filter(file => file.endsWith('.json'))

  const news: NewsItem[] = []

  for (const file of files) {
    const filePath = path.join(localeDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    try {
      const data = JSON.parse(content)
      const validated = NewsItemSchema.parse(data)
      news.push(validated)
    } catch (error) {
      console.error(`Invalid news item: ${file}`, error)
      // Skip invalid items in production
      continue
    }
  }

  return news.toSorted((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})
```

---

### Step 2: Add Security Headers (10 min)

```typescript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://www.google-analytics.com https://analytics.google.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s{2,}/g, ' ').trim()

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

---

### Step 3: Add ESLint Security Plugin (5 min)

```bash
npm install --save-dev eslint-plugin-security
```

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:security/recommended',
  ],
  plugins: ['security'],
  rules: {
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
  },
}
```

---

### Step 4: Add Security Tests (20 min)

Create test file:

```typescript
// __tests__/security/content-validation.test.ts
import { describe, it, expect } from '@jest/globals'
import { getPostBySlug } from '@/lib/blog/mdx'
import { getAllNews } from '@/lib/news/loader'

describe('Content Security', () => {
  describe('Blog Posts', () => {
    it('should reject invalid slug with path traversal', async () => {
      await expect(
        getPostBySlug('../../../etc/passwd', 'en')
      ).rejects.toThrow('Invalid slug format')
    })

    it('should reject slug with special characters', async () => {
      await expect(
        getPostBySlug('test<script>', 'en')
      ).rejects.toThrow('Invalid slug format')
    })

    it('should validate frontmatter schema', async () => {
      // Assuming you have a test MDX file with invalid frontmatter
      await expect(
        getPostBySlug('invalid-frontmatter-test', 'en')
      ).rejects.toThrow()
    })
  })

  describe('News Items', () => {
    it('should filter out invalid JSON files', async () => {
      const news = await getAllNews('en')

      // All items should have required fields
      news.forEach(item => {
        expect(item.id).toBeDefined()
        expect(item.type).toMatch(/^(feature|fix|improvement|announcement)$/)
        expect(item.title).toBeDefined()
        expect(item.description).toBeDefined()
        expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })
    })

    it('should reject malformed URLs in link field', async () => {
      const NewsItemSchema = z.object({
        link: z.string().url().optional(),
      })

      expect(() => {
        NewsItemSchema.parse({ link: 'javascript:alert(1)' })
      }).toThrow()

      expect(() => {
        NewsItemSchema.parse({ link: 'not-a-url' })
      }).toThrow()
    })
  })
})
```

---

### Step 5: Add GitHub Security Scanning (5 min)

Create workflow file:

```yaml
# .github/workflows/security.yml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1' # Weekly on Monday

jobs:
  security:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=moderate

      - name: Run security linter
        run: npm run lint

      - name: Run security tests
        run: npm test -- __tests__/security/
```

---

## 🔧 Advanced Security Measures

### Rate Limiting (Optional)

If you add API routes in the future:

```bash
npm install @upstash/ratelimit @vercel/kv
```

```typescript
// lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

export const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
})

// middleware.ts
import { ratelimit } from '@/lib/ratelimit'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? '127.0.0.1'
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip)

    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```

---

### HTML Sanitization (If Needed)

If you ever need to render user-generated HTML:

```bash
npm install isomorphic-dompurify
```

```typescript
// lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}

export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString()
    }
    return null
  } catch {
    return null
  }
}
```

---

### Dependency Monitoring

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
    reviewers:
      - "your-github-username"
    labels:
      - "dependencies"
      - "security"
```

---

## 📊 Security Monitoring

### Add Security Logging

```typescript
// lib/security-logger.ts
export function logSecurityEvent(event: {
  type: 'xss_attempt' | 'path_traversal' | 'invalid_input' | 'rate_limit'
  details: string
  ip?: string
  userAgent?: string
}) {
  // In production, send to logging service (Sentry, LogRocket, etc.)
  console.warn('[SECURITY]', event)

  // Track metrics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'security_event', {
      event_category: 'security',
      event_label: event.type,
      value: 1,
    })
  }
}

// Usage in content loaders
export async function getPostBySlug(slug: string, locale: Locale) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    logSecurityEvent({
      type: 'invalid_input',
      details: `Invalid slug format: ${slug}`,
    })
    throw new Error('Invalid slug format')
  }
  // ...
}
```

---

## ✅ Pre-Deployment Security Checklist

Run this before every deployment:

```bash
#!/bin/bash
# security-check.sh

echo "🔍 Running security checks..."

echo "1️⃣ NPM Audit..."
npm audit --audit-level=moderate || exit 1

echo "2️⃣ ESLint Security..."
npm run lint || exit 1

echo "3️⃣ TypeScript Check..."
npm run type-check || exit 1

echo "4️⃣ Security Tests..."
npm test -- __tests__/security/ || exit 1

echo "5️⃣ Build Test..."
npm run build || exit 1

echo "✅ All security checks passed!"
```

Make it executable:

```bash
chmod +x security-check.sh
```

Add to package.json:

```json
{
  "scripts": {
    "security-check": "./security-check.sh",
    "pre-deploy": "npm run security-check"
  }
}
```

---

## 🚨 Incident Response

If you discover a security vulnerability:

### 1. Immediate Response

```bash
# 1. Create hotfix branch
git checkout -b hotfix/security-CVE-YYYY-XXXX

# 2. Fix the vulnerability
# ... make code changes ...

# 3. Add regression test
# ... add test ...

# 4. Deploy immediately
git commit -m "fix: [SECURITY] Fix XSS vulnerability in blog posts"
git push origin hotfix/security-CVE-YYYY-XXXX

# 5. Merge to main and deploy
vercel --prod
```

### 2. Post-Incident

- Document the vulnerability in `SECURITY.md`
- Update security tests
- Review similar code patterns
- Schedule security audit

---

## 📚 Resources

### Tools
- [OWASP ZAP](https://www.zaproxy.org/) - Web security scanner
- [Snyk](https://snyk.io/) - Dependency vulnerability scanner
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Built-in npm security
- [ESLint Security Plugin](https://github.com/nodesecurity/eslint-plugin-security)

### Learning
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [MDX Security](https://mdxjs.com/guides/security/)

---

## 🎯 Priority Implementation Order

### Week 1 (Critical):
1. ✅ Add Zod validation
2. ✅ Implement security headers
3. ✅ Add ESLint security plugin

### Week 2 (Important):
4. ✅ Add security tests
5. ✅ Set up GitHub security scanning
6. ✅ Create pre-deployment checklist

### Week 3 (Nice to Have):
7. ⭕ Add rate limiting (if API routes exist)
8. ⭕ Implement security logging
9. ⭕ Set up dependency monitoring

---

**Last Updated:** 2024-02-04
**Next Review:** 2024-03-04
