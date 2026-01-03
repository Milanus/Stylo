# Quick Start Guide - LLM Text Editor

This guide will help you get your application up and running with authentication.

## Current Status

✅ **Completed:**
- Next.js application setup
- Database schema (PostgreSQL via Supabase)
- OpenAI GPT-4o-mini integration
- Rate limiting (Redis/Upstash)
- Text transformation API (`/api/transform`)
- Frontend dashboard UI
- Authentication system (Email/Password + OAuth ready)
- Protected routes middleware

## Quick Setup Steps

### 1. Database Trigger Setup (Important!)

To automatically create user profiles when users sign up:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents from: `prisma/migrations/create_user_profile_trigger.sql`
5. Paste and click **Run**

This ensures every new authenticated user automatically gets a profile entry.

### 2. Configure Google OAuth (Optional but Recommended)

Follow the detailed guide: [docs/GOOGLE_OAUTH_SETUP.template.md](./GOOGLE_OAUTH_SETUP.template.md)

**Quick version:**
1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
2. Add redirect URI: `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
3. Enable Google provider in Supabase: **Authentication** → **Providers** → **Google**
4. Paste Client ID and Client Secret
5. Save

### 3. Test Authentication

**Create a test account:**

```bash
# Start the dev server if not running
npm run dev
```

1. Open browser: http://localhost:3000
2. You'll be redirected to: http://localhost:3000/login
3. Click "Sign up" link
4. Enter email and password (min 8 characters)
5. Click "Create Account"
6. Check your email for verification link (if email confirmation is enabled)
7. After verification, log in

**Test the flow:**
- ✅ Signup redirects to email confirmation screen
- ✅ Login redirects to dashboard
- ✅ Dashboard shows your email
- ✅ Logout button works
- ✅ Accessing `/dashboard` while logged out redirects to `/login`

### 4. Test Text Transformation

Once logged in to dashboard:

1. Select a transformation type (Grammar, Formal, etc.)
2. Enter text in the input area
3. Click "Transform Text"
4. View transformed result in output area
5. Check usage counter (10 transformations for free tier)
6. View metadata (tokens, cost, processing time)

### 5. Update Rate Limits Per User (Optional)

Currently rate limiting is IP-based. To make it user-based:

**Update:** `app/api/transform/route.ts`

```typescript
// Replace this section (around line 36-42):

// Current: IP-based
const clientIp = request.headers.get('x-forwarded-for') ||
                 request.headers.get('x-real-ip') ||
                 'unknown'

// With: User-based (requires auth)
import { createClient } from '@/lib/auth/supabase-server'

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  return NextResponse.json(
    { error: 'Authentication required' },
    { status: 401 }
  )
}

const identifier = user.id // Use user ID instead of IP
```

---

## Application URLs

**Local Development:**
- Home: http://localhost:3000 → redirects to dashboard or login
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup
- Dashboard: http://localhost:3000/dashboard (protected)
- Transform API: http://localhost:3000/api/transform

**Supabase:**
- Project URL: https://YOUR_PROJECT_ID.supabase.co
- Dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

---

## Environment Variables Checklist

Make sure your `.env.local` has all these variables:

```bash
# Database
DATABASE_URL="postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@YOUR_REGION.pooler.supabase.com:6543/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# OpenAI
OPENAI_API_KEY="sk-proj-..." # Your actual key

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://your-redis-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_redis_token_here"

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Rate Limiting
RATE_LIMIT_FREE_TIER=10
RATE_LIMIT_PREMIUM_TIER=100
```

---

## Testing Checklist

### Authentication
- [ ] Can sign up with email/password
- [ ] Receive confirmation email (if enabled)
- [ ] Can log in with credentials
- [ ] Dashboard shows user email
- [ ] Logout button works
- [ ] Protected routes redirect to login
- [ ] Google OAuth works (if configured)

### Text Transformation
- [ ] All 6 transformation types load
- [ ] Can transform text successfully
- [ ] Output displays correctly
- [ ] Metadata shows (tokens, cost, time)
- [ ] Usage counter updates
- [ ] Rate limiting works (10 requests/hour)
- [ ] Copy button works
- [ ] Clear button resets form

### UI/UX
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] Loading states appear
- [ ] Error messages display
- [ ] Success feedback shows

---

## Common Issues

### Issue: "Can't reach database server"
**Solution:** Database tables might not exist. Run the SQL script from `prisma/create_tables.sql` in Supabase SQL Editor.

### Issue: "Missing Supabase environment variables"
**Solution:** Check that all `NEXT_PUBLIC_SUPABASE_*` variables are in `.env.local`.

### Issue: "User logged in but no profile"
**Solution:** Run the user profile trigger SQL from step 1 above.

### Issue: "Rate limit exceeded immediately"
**Solution:** Clear Redis cache or restart server (dev mode caches IP addresses).

### Issue: "OpenAI API authentication failed"
**Solution:** Verify `OPENAI_API_KEY` is valid and has billing enabled.

---

## Next Steps

1. **User Profile Page:** Create `/profile` page to view/edit user settings
2. **Transformation History:** Show past transformations in dashboard
3. **Stripe Integration:** Add premium subscription checkout
4. **Email Templates:** Customize Supabase auth email templates
5. **Usage Dashboard:** Track total tokens/cost per user
6. **Mobile Apps:** Implement iOS (Swift) and Android (Kotlin) apps
7. **Production Deploy:** Deploy to Vercel with production env vars

---

## API Endpoints Reference

### `GET /api/transform`
Returns list of available transformation types.

**Response:**
```json
{
  "transformationTypes": [
    { "id": "grammar", "label": "Grammar & Spelling", "description": "..." },
    { "id": "formal", "label": "Formal Style", "description": "..." },
    ...
  ]
}
```

### `POST /api/transform`
Transform text using selected transformation type.

**Request:**
```json
{
  "text": "your text here",
  "transformationType": "grammar"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originalText": "...",
    "transformedText": "...",
    "transformationType": "grammar",
    "metadata": {
      "tokensUsed": 104,
      "costUsd": 0.000022,
      "processingTimeMs": 2062,
      "model": "gpt-4o-mini"
    },
    "rateLimit": {
      "remaining": 9,
      "resetAt": 1767361414
    }
  }
}
```

---

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **OpenAI API:** https://platform.openai.com/docs
- **Database Schema:** `prisma/schema.prisma`

---

## Cost Estimates

**For 100 active users (per month):**

| Service | Cost |
|---------|------|
| Vercel Hosting | $0-20 |
| Supabase Database | $0-25 |
| Upstash Redis | $0-10 |
| OpenAI API (LLM) | ~$80 |
| **Total** | **~$110-135** |

**Revenue (20 premium @ $9.99):** ~$200/month
**Net Profit:** ~$65-90/month

---

Happy coding! 🚀
