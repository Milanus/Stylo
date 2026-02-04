# Security Checklist

Quick security checklist for Blog and News content sections.

---

## ✅ Before Every Deployment

```bash
# Run this command before deploying:
npm run security-check
```

### Manual Checks

- [ ] No sensitive data in code (API keys, passwords, tokens)
- [ ] `.env.local` not committed to git
- [ ] All new dependencies reviewed
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Error messages don't leak sensitive info

---

## 🔒 Content Security

### Blog Posts (MDX)

- [ ] Slug validation (alphanumeric + hyphens only)
- [ ] Frontmatter validated with Zod schema
- [ ] No executable code in MDX content
- [ ] Images from trusted sources only
- [ ] Links validated and safe
- [ ] File size within limits (< 500KB)

### News Items (JSON)

- [ ] JSON schema validation enabled
- [ ] All fields sanitized
- [ ] URLs validated (http/https only)
- [ ] Date format validated (YYYY-MM-DD)
- [ ] Version format validated (X.Y.Z)
- [ ] File size within limits (< 10KB)

---

## 🛡️ Security Headers

Verify headers are set in `next.config.js`:

- [ ] Content-Security-Policy
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy
- [ ] Permissions-Policy

**Test:**
```bash
curl -I https://stylo.app | grep -i "security\|x-frame\|x-content"
```

---

## 🔍 Dependency Security

### Weekly

- [ ] Run `npm audit`
- [ ] Review Dependabot alerts
- [ ] Update critical dependencies

**Commands:**
```bash
npm audit
npm audit fix
npm outdated
```

---

## 🧪 Security Tests

### Required Tests

- [ ] XSS prevention tests pass
- [ ] Path traversal tests pass
- [ ] Input validation tests pass
- [ ] Schema validation tests pass

**Run tests:**
```bash
npm test -- __tests__/security/
```

---

## 🚨 Incident Response

If you discover a vulnerability:

### Immediate Actions

1. **Assess Severity:**
   - 🔴 Critical: Data breach, RCE, auth bypass
   - 🟡 High: XSS, injection, sensitive data leak
   - 🟢 Medium: DoS, info disclosure
   - ⚪ Low: Minor issues

2. **For Critical/High:**
   ```bash
   # Create hotfix branch
   git checkout -b hotfix/security-YYYY-MM-DD

   # Fix vulnerability
   # Add regression test

   # Deploy immediately
   git commit -m "fix: [SECURITY] Description"
   git push
   vercel --prod
   ```

3. **Document:**
   - Add to `SECURITY.md`
   - Update tests
   - Review similar code

---

## 📊 Monthly Security Review

- [ ] Review access logs for suspicious activity
- [ ] Check CSP violation reports
- [ ] Review rate limit triggers (if enabled)
- [ ] Update security documentation
- [ ] Schedule team security training

---

## 🔐 Content Validation Code

### Blog Post Validation

```typescript
// Required in lib/blog/mdx.ts
const PostFrontmatterSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  author: z.string().min(1).max(100),
  tags: z.array(z.string()).max(10),
  publishedAt: z.string().datetime(),
  // ... other fields
})

// Slug validation
if (!/^[a-z0-9-]+$/.test(slug)) {
  throw new Error('Invalid slug format')
}
```

### News Item Validation

```typescript
// Required in lib/news/loader.ts
const NewsItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(['feature', 'fix', 'improvement', 'announcement']),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  link: z.string().url().optional(),
})
```

---

## 🎯 Quick Fixes

### Fix: XSS in Blog Post

```typescript
// Use React's built-in escaping (default)
<h1>{post.title}</h1> // ✅ Safe

// Never use:
<h1 dangerouslySetInnerHTML={{ __html: post.title }} /> // ❌ Dangerous
```

### Fix: Path Traversal

```typescript
// Always validate and sanitize
function sanitizeSlug(slug: string): string {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Invalid slug')
  }
  return slug
}

// Verify path is within allowed directory
if (!filePath.startsWith(contentDir)) {
  throw new Error('Invalid path')
}
```

### Fix: Invalid JSON

```typescript
// Always validate with schema
try {
  const data = JSON.parse(content)
  const validated = NewsItemSchema.parse(data)
  return validated
} catch (error) {
  console.error('Invalid news item:', error)
  return null // Skip invalid items
}
```

---

## 📚 Resources

- [Full Audit Plan](./SECURITY_AUDIT_PLAN.md)
- [Implementation Guide](./SECURITY_IMPLEMENTATION.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)

---

## ⚡ Emergency Contacts

**Security Issues:**
- Create issue: https://github.com/anthropics/stylo/security
- Email: security@stylo.app (if applicable)

**Vercel Support:**
- https://vercel.com/support

---

**Last Updated:** 2024-02-04
**Review Frequency:** Weekly for critical, Monthly for all items
