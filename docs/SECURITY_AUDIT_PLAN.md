# Security Audit Plan - Blog & News Feed

## Overview

This document outlines a comprehensive security audit plan for Stylo's Blog and News sections to identify and mitigate potential vulnerabilities.

---

## 🎯 Audit Objectives

1. **Content Security** - Prevent XSS, injection attacks, and malicious content
2. **Data Integrity** - Ensure content cannot be tampered with
3. **Access Control** - Verify proper authentication and authorization
4. **Input Validation** - Validate all user inputs and file uploads
5. **API Security** - Secure API endpoints and data fetching
6. **Dependency Security** - Check for vulnerabilities in dependencies
7. **Performance & DoS** - Prevent denial of service attacks

---

## 🔍 Security Audit Checklist

### 1. Content Injection & XSS Prevention

#### Blog Posts (MDX Content)

**Risk Level:** 🔴 HIGH

**Threats:**
- XSS attacks via malicious MDX content
- Script injection in frontmatter
- Malicious React components in MDX
- HTML injection via markdown

**Audit Tasks:**

- [ ] **MDX Sanitization**
  ```bash
  # Check if MDX content is properly sanitized
  grep -r "dangerouslySetInnerHTML" app/
  grep -r "eval\(" components/blog/
  ```

- [ ] **Component Whitelist**
  - [ ] Verify only safe components are allowed in MDX
  - [ ] Check for custom component validation
  - [ ] Review MDX compiler configuration

- [ ] **Frontmatter Validation**
  ```typescript
  // Check validation in lib/blog/mdx.ts
  - title: string validation
  - description: string validation
  - author: string validation
  - tags: array validation
  - publishedAt: date validation
  ```

- [ ] **Code Block Safety**
  - [ ] Verify syntax highlighting doesn't execute code
  - [ ] Check for eval() or Function() calls
  - [ ] Review code block sanitization

**Recommendations:**
```typescript
// Implement strict MDX component whitelist
const allowedComponents = {
  h1: Heading1,
  h2: Heading2,
  p: Paragraph,
  // ... safe components only
}

// Sanitize frontmatter
import { z } from 'zod'

const PostFrontmatterSchema = z.object({
  title: z.string().max(200),
  description: z.string().max(500),
  author: z.string().max(100),
  tags: z.array(z.string()).max(10),
  publishedAt: z.string().datetime(),
})
```

---

#### News Feed (JSON Content)

**Risk Level:** 🟡 MEDIUM

**Threats:**
- JSON injection
- Script tags in text fields
- Malicious URLs in links

**Audit Tasks:**

- [ ] **JSON Schema Validation**
  ```typescript
  // Validate all news items against schema
  const NewsItemSchema = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    type: z.enum(['feature', 'fix', 'improvement', 'announcement']),
    title: z.string().max(100),
    description: z.string().max(500),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    version: z.string().optional(),
    link: z.string().url().optional(),
  })
  ```

- [ ] **HTML Escaping**
  - [ ] Verify all text is escaped before rendering
  - [ ] Check for unescaped HTML entities
  - [ ] Review React's automatic escaping

- [ ] **URL Validation**
  - [ ] Validate external links (if any)
  - [ ] Check for javascript: protocol
  - [ ] Verify URLs are properly encoded

**Recommendations:**
```typescript
// Add runtime validation
import DOMPurify from 'isomorphic-dompurify'

function sanitizeNewsItem(item: NewsItem): NewsItem {
  return {
    ...item,
    title: DOMPurify.sanitize(item.title),
    description: DOMPurify.sanitize(item.description),
    link: item.link ? validateUrl(item.link) : undefined,
  }
}

function validateUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url
    }
    return undefined
  } catch {
    return undefined
  }
}
```

---

### 2. File System Security

**Risk Level:** 🟡 MEDIUM

**Threats:**
- Path traversal attacks
- Arbitrary file read
- Directory listing

**Audit Tasks:**

- [ ] **Path Traversal Prevention**
  ```bash
  # Check for unsanitized file paths
  grep -r "path.join.*params" lib/
  grep -r "fs.readFile.*slug" lib/
  ```

- [ ] **Input Sanitization**
  ```typescript
  // In lib/blog/mdx.ts and lib/news/loader.ts
  - Validate slug format (alphanumeric + hyphens only)
  - Prevent ../ sequences
  - Whitelist allowed directories
  ```

- [ ] **Directory Access Control**
  - [ ] Verify only content/ directory is accessible
  - [ ] Check for hardcoded paths
  - [ ] Review file existence checks

**Recommendations:**
```typescript
// Strict path validation
import path from 'path'

function sanitizeSlug(slug: string): string {
  // Only allow alphanumeric and hyphens
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Invalid slug format')
  }
  return slug
}

function getPostBySlug(slug: string, locale: Locale) {
  const sanitizedSlug = sanitizeSlug(slug)
  const contentDir = path.join(process.cwd(), 'content', 'blog', locale)
  const filePath = path.join(contentDir, `${sanitizedSlug}.mdx`)

  // Verify path is within content directory
  if (!filePath.startsWith(contentDir)) {
    throw new Error('Invalid file path')
  }

  // Check file exists before reading
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found')
  }

  return fs.readFileSync(filePath, 'utf-8')
}
```

---

### 3. API Security

**Risk Level:** 🟢 LOW (Static content)

**Threats:**
- API abuse
- Rate limiting bypass
- Cache poisoning

**Audit Tasks:**

- [ ] **Rate Limiting**
  - [ ] Check if rate limiting is implemented
  - [ ] Review Vercel edge function limits
  - [ ] Test API abuse scenarios

- [ ] **Cache Security**
  - [ ] Verify React.cache() is not leaking sensitive data
  - [ ] Check cache invalidation strategy
  - [ ] Review cache keys for uniqueness

- [ ] **Error Handling**
  - [ ] Ensure errors don't leak sensitive info
  - [ ] Check for stack traces in production
  - [ ] Review 404 handling

**Recommendations:**
```typescript
// Add rate limiting with Vercel KV
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }

  // ... rest of handler
}
```

---

### 4. Dependency Security

**Risk Level:** 🟡 MEDIUM

**Threats:**
- Vulnerable dependencies
- Supply chain attacks
- Outdated packages

**Audit Tasks:**

- [ ] **NPM Audit**
  ```bash
  npm audit
  npm audit fix
  ```

- [ ] **Dependency Analysis**
  ```bash
  # Check for high/critical vulnerabilities
  npm audit --audit-level=high

  # List outdated packages
  npm outdated
  ```

- [ ] **MDX Dependencies**
  - [ ] Check @mdx-js/mdx version
  - [ ] Check next-mdx-remote version
  - [ ] Review remark/rehype plugins

- [ ] **Content Processing Libraries**
  - [ ] gray-matter (frontmatter parsing)
  - [ ] remark (markdown processing)
  - [ ] rehype (HTML processing)

**Recommendations:**
```bash
# Automate security checks
npm install --save-dev npm-check-updates
npx ncu -u  # Update package.json

# Use Snyk for continuous monitoring
npm install -g snyk
snyk test
snyk monitor
```

---

### 5. Content Security Policy (CSP)

**Risk Level:** 🔴 HIGH

**Threats:**
- XSS via external resources
- Inline script execution
- Unsafe eval usage

**Audit Tasks:**

- [ ] **CSP Headers**
  ```typescript
  // Check next.config.js or middleware
  - script-src directive
  - style-src directive
  - img-src directive
  - connect-src directive
  ```

- [ ] **Inline Scripts**
  - [ ] Check for inline event handlers
  - [ ] Review inline styles
  - [ ] Audit JSON-LD scripts

- [ ] **External Resources**
  - [ ] Google Analytics scripts
  - [ ] Google Fonts
  - [ ] CDN resources

**Recommendations:**
```typescript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://www.google-analytics.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
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

### 6. Authentication & Authorization

**Risk Level:** 🟢 LOW (Public content)

**Threats:**
- Unauthorized content modification
- Admin panel access

**Audit Tasks:**

- [ ] **Content Creation Access**
  - [ ] Who can create blog posts?
  - [ ] Who can add news items?
  - [ ] Is there an admin panel?

- [ ] **File System Permissions**
  ```bash
  # Check content directory permissions
  ls -la content/blog/
  ls -la content/news/
  ```

- [ ] **Git Repository Security**
  - [ ] Review .gitignore for sensitive files
  - [ ] Check for exposed secrets
  - [ ] Verify environment variables

**Recommendations:**
```bash
# If admin panel exists, implement proper auth
# Use NextAuth.js with role-based access control

# Protect content modification routes
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new Response('Unauthorized', { status: 401 })
  }

  // ... content creation logic
}
```

---

### 7. Denial of Service (DoS) Prevention

**Risk Level:** 🟡 MEDIUM

**Threats:**
- Resource exhaustion
- Infinite loops in MDX
- Large file uploads
- Regex DoS (ReDoS)

**Audit Tasks:**

- [ ] **Resource Limits**
  - [ ] Check max file size for MDX/JSON
  - [ ] Review memory usage
  - [ ] Test with large content files

- [ ] **Regex Safety**
  ```bash
  # Check for potentially dangerous regex
  grep -r "new RegExp" lib/
  grep -r "\.test\(" lib/
  ```

- [ ] **Infinite Loop Prevention**
  - [ ] Review MDX rendering timeout
  - [ ] Check for recursive components
  - [ ] Test with complex nested structures

**Recommendations:**
```typescript
// Limit file sizes
const MAX_MDX_SIZE = 500 * 1024 // 500 KB
const MAX_JSON_SIZE = 10 * 1024  // 10 KB

function validateFileSize(content: string, maxSize: number) {
  const size = Buffer.byteLength(content, 'utf-8')
  if (size > maxSize) {
    throw new Error(`File too large: ${size} bytes`)
  }
}

// Use safe-regex to detect ReDoS
import safeRegex from 'safe-regex'

function createRegex(pattern: string) {
  if (!safeRegex(pattern)) {
    throw new Error('Unsafe regex pattern')
  }
  return new RegExp(pattern)
}
```

---

## 🛠️ Security Tools & Automation

### Static Analysis

```bash
# ESLint Security Plugin
npm install --save-dev eslint-plugin-security
```

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['security'],
  extends: ['plugin:security/recommended'],
  rules: {
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-eval-with-expression': 'error',
  }
}
```

### Dependency Scanning

```bash
# GitHub Dependabot (already enabled?)
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
    open-pull-requests-limit: 10
```

### Runtime Security

```bash
# Install helmet for security headers (if using custom server)
npm install helmet

# Install rate limiter
npm install @upstash/ratelimit @vercel/kv
```

### Content Validation

```bash
# Install zod for schema validation
npm install zod

# Install DOMPurify for HTML sanitization
npm install isomorphic-dompurify
```

---

## 🧪 Security Testing Plan

### 1. Manual Testing

**XSS Testing:**
```javascript
// Test payloads to try in blog posts/news:
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
javascript:alert('XSS')
<svg/onload=alert('XSS')>
```

**Path Traversal Testing:**
```
# Try accessing:
/blog/../../../etc/passwd
/blog/%2e%2e%2f%2e%2e%2f
/blog/....//....//
```

**Injection Testing:**
```json
{
  "title": "<script>alert('XSS')</script>",
  "description": "{{constructor.constructor('alert(1)')()}}",
  "link": "javascript:alert('XSS')"
}
```

### 2. Automated Testing

```typescript
// tests/security/xss.test.ts
import { render } from '@testing-library/react'
import { BlogPost } from '@/components/blog/BlogPost'

describe('XSS Prevention', () => {
  it('should escape HTML in post title', () => {
    const post = {
      title: '<script>alert("XSS")</script>',
      content: 'Test content'
    }

    const { container } = render(<BlogPost post={post} />)

    // Should not contain actual script tag
    expect(container.querySelector('script')).toBeNull()

    // Should show escaped text
    expect(container.textContent).toContain('<script>')
  })

  it('should sanitize markdown content', () => {
    const post = {
      title: 'Test',
      content: '<img src=x onerror=alert("XSS")>'
    }

    const { container } = render(<BlogPost post={post} />)

    // Should not have onerror handler
    const img = container.querySelector('img')
    expect(img?.getAttribute('onerror')).toBeNull()
  })
})
```

### 3. Penetration Testing

**Recommended Tools:**
- OWASP ZAP (Zed Attack Proxy)
- Burp Suite Community Edition
- nuclei (vulnerability scanner)

```bash
# Run OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://stylo.app
```

---

## 📋 Audit Timeline

### Week 1: Assessment & Planning
- [ ] Review current security measures
- [ ] Identify critical areas
- [ ] Set up security tools
- [ ] Create testing environment

### Week 2: Code Review
- [ ] Audit MDX processing
- [ ] Review JSON parsing
- [ ] Check file system access
- [ ] Analyze dependencies

### Week 3: Testing
- [ ] Manual XSS testing
- [ ] Path traversal testing
- [ ] Automated security tests
- [ ] Performance/DoS testing

### Week 4: Remediation
- [ ] Fix identified vulnerabilities
- [ ] Implement security headers
- [ ] Add input validation
- [ ] Update documentation

---

## 🚨 Incident Response Plan

### High-Severity Vulnerabilities

1. **Immediate Actions:**
   - Take affected pages offline if necessary
   - Assess scope of vulnerability
   - Determine if data was compromised

2. **Remediation:**
   - Deploy hotfix immediately
   - Notify users if data breach occurred
   - Document incident

3. **Prevention:**
   - Add regression test
   - Update security checklist
   - Schedule security review

---

## 📊 Security Metrics

Track these metrics over time:

- Number of vulnerabilities found per audit
- Time to remediate critical vulnerabilities
- Dependency update frequency
- Failed login attempts (if auth exists)
- Rate limit triggers
- CSP violation reports

---

## 📚 Security Resources

### OWASP Top 10 (2021)
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Authentication Failures
8. Data Integrity Failures
9. Logging Failures
10. Server-Side Request Forgery

### Next.js Security Best Practices
- https://nextjs.org/docs/advanced-features/security-headers
- https://nextjs.org/docs/advanced-features/output-file-tracing

### MDX Security
- https://mdxjs.com/guides/security/

---

## ✅ Quick Security Checklist

Before deploying content changes:

- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Validate all new content (MDX/JSON)
- [ ] Test for XSS in new features
- [ ] Check CSP headers are working
- [ ] Verify no sensitive data in logs
- [ ] Test rate limiting (if applicable)
- [ ] Review security headers
- [ ] Check for exposed secrets
- [ ] Test 404/error pages
- [ ] Verify HTTPS is enforced

---

## 📝 Next Steps

1. **Immediate (This Week):**
   - Run `npm audit`
   - Add Zod validation to content loaders
   - Implement CSP headers

2. **Short Term (This Month):**
   - Set up automated security scanning
   - Add security tests to CI/CD
   - Implement rate limiting

3. **Long Term (Ongoing):**
   - Regular security audits (quarterly)
   - Keep dependencies updated
   - Monitor security advisories
   - Train team on secure coding

---

**Document Version:** 1.0
**Last Updated:** 2024-02-04
**Next Review:** 2024-05-04
