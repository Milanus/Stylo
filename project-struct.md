# Stylo - Project Structure

## Overview
**Stylo** is an AI text transformation web app. Users input text and transform it using LLMs (grammar fix, formalize, summarize, expand, etc.). Supports anonymous access with rate limiting, user accounts with subscription tiers, and custom user-defined prompts.

## Tech Stack
- **Framework:** Next.js 16.1.1 (App Router) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix UI)
- **State:** Zustand 5
- **Database:** PostgreSQL (Supabase) + Prisma 7 ORM
- **Auth:** Supabase Auth (email/password + Google OAuth)
- **LLMs:** OpenAI (gpt-4o-mini primary), Mistral AI (fallback)
- **Cache/Rate Limit:** Upstash Redis
- **i18n:** next-intl (en, sk, cs, de, es)
- **PWA:** Custom service worker + manifest
- **Payments:** Stripe (planned, not yet implemented)
- **Analytics:** Google Analytics (G-5KTEHJPS9M)
- **Deployment:** Vercel

## Directory Structure

```
app/
  [locale]/                     # All pages wrapped in locale prefix
    (auth)/
      login/page.tsx            # Login page
      signup/page.tsx           # Signup page
    cookies/page.tsx            # Cookie policy
    dashboard/page.tsx          # Main app dashboard (text editor)
    privacy/page.tsx            # Privacy policy
    layout.tsx                  # Root layout (i18n, PWA, analytics)
    page.tsx                    # Landing page
  api/
    auth/callback/route.ts      # OAuth callback
    history/route.ts            # GET - user transformation history (last 50)
    rate-limit/route.ts         # GET - check rate limit status
    transform/route.ts          # POST - main text transformation endpoint
    transformation-types/route.ts # GET - list available transformations
    user/delete/route.ts        # DELETE - account deletion
    user-prompts/
      route.ts                  # GET/POST - list & create custom prompts
      [id]/route.ts             # GET/PATCH/DELETE - manage single prompt
  auth/callback/route.ts        # Auth redirect handler

components/
  landing/                      # Landing page sections (Hero, Features, CTA, Pricing, Footer)
  pwa/InstallPrompt.tsx         # PWA install prompt
  ui/                           # shadcn/ui primitives (button, card, input, select, sheet, etc.)
  CookieConsent.tsx             # Cookie banner
  CustomPromptsSheet.tsx        # Custom prompts management panel
  DeleteAccountButton.tsx       # Account deletion UI
  HistoryDrawer.tsx             # Transformation history drawer
  LanguageSwitcher.tsx          # Language selector
  RateLimitModal.tsx            # Rate limit exceeded modal

hooks/
  useUserPrompts.ts             # Custom prompts CRUD hook
  useTransformationTypes.ts     # Transformation types fetching hook

i18n/
  config.ts                     # Locales: cs, sk, es, de, en (default: en)
  navigation.ts                 # i18n navigation helpers
  request.ts                    # Server-side message loading

lib/
  auth/
    supabase-client.ts          # Client-side Supabase instance
    supabase-server.ts          # Server-side Supabase instance
    supabase.ts                 # Shared auth utilities
  cache/
    transformation-types.ts     # In-memory cache (5min TTL)
  constants/
    country-locale-map.ts       # Geolocation → locale mapping
    keyword-blacklist.ts        # Forbidden keywords for security
    languages.ts                # Language definitions
    prompt-templates.ts         # Prompt templates
    rate-limits.ts              # Rate limit tiers (anon: 6/hr, free: 20/hr, paid: 100/hr)
    transformations.ts          # 12 transformation type definitions with prompts
    user-prompt-limits.ts       # Custom prompt limits per tier
  db/
    prisma.ts                   # Prisma client initialization
  llm/
    mistral.ts                  # Mistral AI integration
    openai.ts                   # OpenAI integration
    prompt-generator.ts         # Keywords → LLM prompt generation
    prompts.ts                  # Prompt templates
    provider.ts                 # LLM provider abstraction layer
    user-prompt-builder.ts      # User prompt construction
  utils/
    rate-limit.ts               # Redis rate limiting logic
    user-profile.ts             # User profile helpers
    validation.ts               # Input sanitization + prompt injection detection
  utils.ts                      # General utilities (cn, etc.)

messages/
  en.json, sk.json, cs.json, de.json, es.json   # Translation files

prisma/
  schema.prisma                 # 6 models: UserProfile, Transformation, UsageLog,
                                #   Subscription, TransformationType, UserPrompt
  migrations/                   # SQL migration files

public/
  manifest.json                 # PWA manifest
  sw.js                         # Service worker (cache-first static, network-first pages)
  offline.html                  # Offline fallback
  favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png

types/
  transformation.ts             # TypeScript interfaces for transformations

middleware.ts                   # Locale detection (cookie → geo → accept-language),
                                # auth session refresh, route protection
next.config.ts                  # Security headers, i18n plugin
```

## Database Models (Prisma)

| Model | Key Fields | Purpose |
|-------|-----------|---------|
| **UserProfile** | id, email, subscriptionTier, usageCount | User account |
| **Transformation** | originalText, transformedText, type, modelUsed, tokensUsed, costUsd | Transformation history |
| **UsageLog** | userId, ipAddress, endpoint, userAgent | API usage tracking |
| **Subscription** | stripeCustomerId, stripeSubscriptionId, status | Stripe subscriptions |
| **TransformationType** | slug, label, prompt, icon, sortOrder | 12 built-in transformation types |
| **UserPrompt** | userId, name, keywords, prompt, isActive | Custom user prompts |

## API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/transform` | API key + optional user | Transform text via LLM |
| GET | `/api/transformation-types` | API key | List 12 transformation types |
| GET | `/api/history` | API key + user | Last 50 transformations |
| GET | `/api/rate-limit` | API key | Check rate limit status |
| GET/POST | `/api/user-prompts` | API key + user | List/create custom prompts |
| GET/PATCH/DELETE | `/api/user-prompts/[id]` | API key + user | Manage single prompt |
| DELETE | `/api/user/delete` | API key + user | Delete account (cascade) |
| GET | `/api/auth/callback` | - | OAuth callback |

## Transformation Types (12)
grammar, formal, informal, legal, summary, expand, funny, teen, wholesome, response, keywords, sales-ad

## Security
- API key required on all endpoints (`x-api-key` header → `STYLO_API_KEY`)
- Input sanitization (HTML, JS handlers, scripts)
- Prompt injection detection (role manipulation, system override, encoding attacks)
- Rate limiting via Redis (tiered by subscription)
- Security headers (X-Frame-Options, CSP, etc.)
- RLS policies in Supabase
- Keyword blacklist for custom prompts
- LLM prompts never exposed to frontend

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin
- `OPENAI_API_KEY` - OpenAI
- `MISTRAL_API_KEY` - Mistral (optional)
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` - Redis
- `STYLO_API_KEY` - Internal API key
- `STRIPE_*` - Stripe keys (planned)

## Data Flow
```
User → Middleware (locale, auth) → API Route (validate, rate limit)
  → Sanitize & check injection → LLM (OpenAI/Mistral)
  → Save to DB (Transformation + UsageLog) → Response
```
