# Deployment Guide - Vercel

Návod na nasadenie LLM Text Editor aplikácie na Vercel.

---

## 🚀 Príprava

### 1. GitHub Repository

Ak ešte nemáš projekt na GitHube:

```bash
# Vytvor nový GitHub repo na github.com
# Potom:

git remote add origin https://github.com/YOUR_USERNAME/text-editor-app.git
git branch -M main
git push -u origin main
```

**DÔLEŽITÉ:** Súbory `.env.local`, `docs/QUICK_START.md` a `docs/GOOGLE_OAUTH_SETUP.md` sú v `.gitignore` a **nebudú** uploadnuté (obsahujú citlivé údaje).

---

## 📦 Vercel Deployment

### Krok 1: Vercel Account

1. Choď na https://vercel.com
2. Prihlás sa cez GitHub account
3. Autorizuj Vercel prístup k tvojim repozitárom

### Krok 2: Import Project

1. Klikni **"Add New..."** → **"Project"**
2. Vyber **"Import Git Repository"**
3. Nájdi a vyber tvoj `text-editor-app` repozitár
4. Klikni **"Import"**

### Krok 3: Configure Project

Vercel automaticky detekuje Next.js projekt. Nastav:

**Framework Preset:** `Next.js`
**Root Directory:** `./` (default)
**Build Command:** `npm run build` (default)
**Output Directory:** `.next` (default)

### Krok 4: Environment Variables

**KRITICKY DÔLEŽITÉ!** Pridaj všetky environment variables:

Klikni **"Environment Variables"** a pridaj:

```bash
# Database
DATABASE_URL=postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@YOUR_REGION.pooler.supabase.com:6543/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY_HERE

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# App Settings
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production

# Security
JWT_SECRET=generate-new-random-secret-for-production

# Rate Limiting
RATE_LIMIT_FREE_TIER=10
RATE_LIMIT_PREMIUM_TIER=100

# Stripe (optional - for later)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Ako získať hodnoty:**
- `DATABASE_URL` - Z Supabase Dashboard → Database → Connection string (Transaction pooler)
- Supabase keys - Z Supabase Dashboard → Project Settings → API
- `OPENAI_API_KEY` - Z OpenAI Platform → API Keys
- Redis - Z Upstash Dashboard → Your Database → REST API
- `NEXT_PUBLIC_APP_URL` - Bude `https://your-app-name.vercel.app`
- `JWT_SECRET` - Vygeneruj nový: `openssl rand -base64 32`

### Krok 5: Deploy

1. Skontroluj všetky nastavenia
2. Klikni **"Deploy"**
3. Počkaj 2-5 minút

---

## ✅ Post-Deployment Setup

### 1. Aktualizuj Google OAuth

Choď do [Google Cloud Console](https://console.cloud.google.com/):

1. **APIs & Services** → **Credentials**
2. Edit tvoj OAuth client
3. Pridaj do **Authorized JavaScript origins:**
   ```
   https://your-app-name.vercel.app
   ```
4. **Authorized redirect URIs** už máš (Supabase callback)
5. **Save**

### 2. Aktualizuj NEXT_PUBLIC_APP_URL

Po prvom deploye:

1. Vercel ti dá URL: `https://your-app-name.vercel.app`
2. Choď do Vercel Dashboard → Settings → Environment Variables
3. Aktualizuj `NEXT_PUBLIC_APP_URL` na správnu production URL
4. Redeploy (Deployments → ... → Redeploy)

### 3. Test Production App

1. Otvor `https://your-app-name.vercel.app`
2. Mal by ťa redirectnúť na `/login`
3. Vyskúšaj:
   - ✅ Signup s email/password
   - ✅ Login cez Google OAuth
   - ✅ Text transformation
   - ✅ Rate limiting
   - ✅ Logout

---

## 🔧 Troubleshooting

### Error: "Database connection failed"

**Problém:** Vercel nemôže pripojiť k Supabase

**Riešenie:**
1. Skontroluj `DATABASE_URL` - musí byť **transaction pooler** URL (port 6543)
2. Overiť že Supabase povoľuje connections z Vercel IP
3. Vercel logs: `vercel logs YOUR_PROJECT_NAME`

### Error: "Missing environment variables"

**Problém:** Nie sú nastavené env vars

**Riešenie:**
1. Vercel Dashboard → Settings → Environment Variables
2. Skontroluj že **všetky** premenné sú nastavené
3. Redeploy projekt

### Error: "OAuth redirect_uri_mismatch"

**Problém:** Google OAuth redirect URI nesedí

**Riešenie:**
1. Google Cloud Console → Credentials
2. Pridaj Vercel URL do Authorized JavaScript origins
3. Počkaj 5 minút (Google propagácia)
4. Vyčisti browser cache
5. Skús znova

### Error: "Rate limit not working"

**Problém:** Redis connection issue

**Riešenie:**
1. Overiť Upstash credentials
2. Check Upstash Dashboard → Connection limits
3. Vercel má limit na počet connections - možno treba upgrade

---

## 📊 Monitoring

### Vercel Analytics

Zapni Analytics pre tracking:

1. Vercel Dashboard → Analytics → Enable
2. Sleduj:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Prisma Logs

V production Prisma loguje len errors:

```typescript
log: process.env.NODE_ENV === 'development'
  ? ['query', 'error', 'warn']
  : ['error']  // Production
```

Pre debug v production:
1. Vercel Dashboard → Logs
2. Alebo pridaj Sentry/LogRocket

---

## 🎯 Performance Optimization

### 1. Enable Edge Runtime (Optional)

Pre rýchlejšie API responses, pridaj do `app/api/transform/route.ts`:

```typescript
export const runtime = 'edge'
```

**Poznámka:** Edge runtime nemá podporu pre všetky Node.js features (pg Pool môže mať problém).

### 2. Caching

Vercel automaticky cachuje:
- Static pages
- API routes s `cache: 'force-cache'`
- Public assets

### 3. Image Optimization

Next.js Image component je automaticky optimalizovaný.

---

## 💰 Vercel Pricing

### Hobby Plan (Free):
- ✅ Perfect pre tvoj use case
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless functions: 100 GB-hours

### Pro Plan ($20/month):
- Potrebuješ len ak:
  - Viac ako 100 GB bandwidth
  - Team collaboration
  - Password-protected deployments

**Tvoja aplikácia bude fungovať na Free tier!**

---

## 🔄 Continuous Deployment

Vercel automaticky deployuje pri každom `git push`:

```bash
# Urob zmeny
git add .
git commit -m "Update feature"
git push origin main

# Vercel automaticky:
# 1. Detekuje push
# 2. Build projekt
# 3. Deploy na production
# 4. Pošle notifikáciu
```

Preview deployments:
- Každý pull request = preview URL
- Testuj changes pred merge

---

## 🌐 Custom Domain (Optional)

### Pridať vlastnú doménu:

1. Kúp doménu (Namecheap, GoDaddy, Google Domains)
2. Vercel Dashboard → Settings → Domains
3. Pridaj svoju doménu: `yourdomain.com`
4. Nastavíš DNS records (Vercel ti povie ako)
5. Počkaj na SSL certificate (automatic)

**Príklad DNS:**
```
A Record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

---

## 📋 Deployment Checklist

Pred production deploymentom skontroluj:

- [ ] Všetky environment variables nastavené
- [ ] `DATABASE_URL` používa transaction pooler
- [ ] Google OAuth má Vercel URL v authorized origins
- [ ] `NEXT_PUBLIC_APP_URL` je production URL
- [ ] JWT_SECRET je nový random string (nie dev secret)
- [ ] OpenAI API key má billing enabled
- [ ] Upstash Redis je accessible
- [ ] Git repo nemá `.env.local` (je v .gitignore)
- [ ] README.md je aktuálny
- [ ] Tested signup/login flow
- [ ] Tested transformations
- [ ] Tested rate limiting

---

## 🚀 Ready to Deploy!

```bash
# Final check
git status

# Push to GitHub
git push origin main

# Potom choď na Vercel a import project!
```

**Good luck! 🎉**

Ak niečo nejde, pozri Vercel logs alebo Supabase logs pre details.
