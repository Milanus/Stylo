# LLM Text Editor - AI-Powered Text Transformation App

A modern web application for transforming text using LLM (Large Language Models) with features like grammar correction, style adjustments, and more.

## Features

- **Text Transformations:**
  - Grammar and spelling correction
  - Formal/informal style conversion
  - Legal writing transformation
  - Text summarization
  - Text expansion

- **User Management:**
  - Authentication with Supabase (Email/Password + OAuth)
  - Freemium model (Free tier + Premium subscription)
  - Usage tracking and rate limiting

- **Security:**
  - Rate limiting with Redis
  - Input validation and sanitization
  - Prompt injection detection
  - HTTPS/TLS encryption

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Cache:** Upstash Redis
- **LLM:** OpenAI GPT-4o-mini
- **Auth:** Supabase Auth
- **Payments:** Stripe (planned)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- OpenAI API key
- Upstash Redis account

### Quick Start

**For detailed setup instructions, see [docs/QUICK_START.md](docs/QUICK_START.md)**

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Environment variables are already configured in `.env.local`
   - Supabase database and auth are ready
   - OpenAI API key is configured
   - Redis rate limiting is active

3. **Setup Database Trigger (Important!):**
   - Go to your Supabase SQL Editor (Dashboard → SQL Editor)
   - Run SQL from `prisma/migrations/create_user_profile_trigger.sql`
   - This auto-creates user profiles on signup

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

6. **Access Application:**
   - Open http://localhost:3000
   - You'll be redirected to login
   - Click "Sign up" to create an account
   - After signup, you can transform text!

### Optional: Configure Google OAuth

See [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md) for detailed instructions on enabling Google sign-in.

## Project Structure

```
text-editor-app/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── transform/    # Text transformation endpoints
│   │   └── user/         # User management endpoints
│   ├── (auth)/           # Auth pages (login, signup)
│   ├── dashboard/        # Main application dashboard
│   └── pricing/          # Pricing page
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── llm/              # LLM integration (OpenAI, prompts)
│   ├── db/               # Database client (Prisma)
│   ├── auth/             # Authentication (Supabase)
│   └── utils/            # Utilities (rate limiting, validation)
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Database Schema

- **UserProfile** - User accounts and subscription info
- **Transformation** - History of text transformations
- **UsageLog** - Rate limiting and usage tracking
- **Subscription** - Stripe subscription data

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Text Transformation
- `POST /api/transform` - Transform text using LLM
- `GET /api/transform/history` - Get transformation history

### User Management
- `GET /api/user/usage` - Get current usage stats
- `GET /api/user/subscription` - Get subscription info

## Security Features

- **Rate Limiting:** Redis-based rate limiting per user/IP
- **Input Validation:** Zod schemas for all inputs
- **Sanitization:** XSS and injection prevention
- **Prompt Injection Detection:** Pattern-based detection
- **Environment Security:** All secrets in environment variables
- **CORS & CSRF:** Protection against common attacks

## Development Roadmap

- [x] Project setup and basic structure
- [x] Database schema and Prisma configuration
- [x] LLM integration (OpenAI GPT-4o-mini)
- [x] Rate limiting system (Redis/Upstash)
- [x] Authentication implementation (Supabase Auth)
- [x] Text transformation API (`/api/transform`)
- [x] Frontend UI components (Dashboard, Login, Signup)
- [ ] Google OAuth configuration (see [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md))
- [ ] User profile trigger setup (see [docs/QUICK_START.md](docs/QUICK_START.md))
- [ ] Transformation history page
- [ ] Usage tracking dashboard
- [ ] Stripe payment integration
- [ ] Mobile apps (iOS + Android)

## Cost Optimization

- Using GPT-4o-mini for cost efficiency (~$0.15 per 1M input tokens)
- Prompt caching for repeated transformations
- Rate limiting to prevent abuse
- User tier limits (Free: 10-20/month, Premium: unlimited)

## Deploy on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

Private - All Rights Reserved
