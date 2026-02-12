# Environment Variables Setup (.env.local)

> Complete environment variable template for SafetyDatas  
> Copy this to `.env.local` and fill in the values  

---

## 🔑 Required Variables

### Database (Vercel Postgres)
```env
# Get this from Vercel Dashboard → Storage → Postgres → .env.local tab
DATABASE_URL=postgresql://user:password@host:5432/database
```

### NextAuth.js Authentication
```env
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret_here

# Local development
NEXTAUTH_URL=http://localhost:3000

# Production (after deploying to Vercel)
# NEXTAUTH_URL=https://v0-safetydatas.vercel.app
```

### Stripe Payments
```env
# From Stripe Dashboard → Developers → API Keys (Publishable key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# From Stripe Dashboard → Developers → API Keys (Secret key)
STRIPE_SECRET_KEY=sk_live_...

# From Stripe Dashboard → Developers → Webhooks (Signing secret)
STRIPE_WEBHOOK_SECRET=whsec_...

# Create these in Stripe Dashboard → Products → Add Product
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
```

### Application Base URL
```env
# Local development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Production
# NEXT_PUBLIC_BASE_URL=https://v0-safetydatas.vercel.app
```

---

## 🔧 Optional Variables

### OpenAI (for PDF Analysis)
```env
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...
```

### Vercel KV (Redis for Rate Limiting)
```env
# From Vercel Dashboard → Storage → KV → .env.local tab
KV_REST_API_URL=https://your-url.upstash.io
KV_REST_API_TOKEN=your_token
KV_REST_API_READ_ONLY_TOKEN=your_readonly_token
KV_URL=rediss://...
```

### Vercel Blob (File Storage - Alternative to local)
```env
# From Vercel Dashboard → Storage → Blob → .env.local tab
BLOB_READ_WRITE_TOKEN=vercel_blob_token_...
```

### Analytics (PostHog)
```env
# Get from: https://app.posthog.com
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Email (Resend - for transactional emails)
```env
# Get from: https://resend.com
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@safetydatas.com
```

---

## 📋 Complete .env.local Template

```env
# ============================================
# REQUIRED: Database (Vercel Postgres)
# ============================================
# Get from: Vercel Dashboard → Storage → Create Database → Postgres
DATABASE_URL=

# ============================================
# REQUIRED: NextAuth.js
# ============================================
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# ============================================
# REQUIRED: Stripe
# ============================================
# Get from: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# Get from: https://dashboard.stripe.com/webhooks
STRIPE_WEBHOOK_SECRET=

# Create products in Stripe Dashboard → Products
STRIPE_STARTER_PRICE_ID=
STRIPE_PROFESSIONAL_PRICE_ID=

# ============================================
# REQUIRED: Base URL
# ============================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ============================================
# OPTIONAL: OpenAI (for AI PDF analysis)
# ============================================
# Get from: https://platform.openai.com/api-keys
# OPENAI_API_KEY=

# ============================================
# OPTIONAL: Vercel KV (rate limiting, caching)
# ============================================
# Get from: Vercel Dashboard → Storage → KV
# KV_REST_API_URL=
# KV_REST_API_TOKEN=
# KV_REST_API_READ_ONLY_TOKEN=

# ============================================
# OPTIONAL: Vercel Blob (file storage)
# ============================================
# Get from: Vercel Dashboard → Storage → Blob
# BLOB_READ_WRITE_TOKEN=

# ============================================
# OPTIONAL: Analytics (PostHog)
# ============================================
# Get from: https://app.posthog.com
# NEXT_PUBLIC_POSTHOG_KEY=
# NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# ============================================
# OPTIONAL: Email (Resend)
# ============================================
# Get from: https://resend.com
# RESEND_API_KEY=
# FROM_EMAIL=noreply@safetydatas.com
```

---

## 🚀 Setting Up Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `v0-safetydatas`
3. Click **Settings** → **Environment Variables**
4. Add each variable from above
5. For production, update:
   - `NEXTAUTH_URL` → `https://v0-safetydatas.vercel.app`
   - `NEXT_PUBLIC_BASE_URL` → `https://v0-safetydatas.vercel.app`
6. Click **Save** and redeploy

---

## ✅ Validation Checklist

After setting up, verify each variable:

- [ ] `DATABASE_URL` - Test with `npx prisma db push`
- [ ] `NEXTAUTH_SECRET` - Can log in without errors
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Pricing page loads
- [ ] `STRIPE_SECRET_KEY` - Can create checkout sessions
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhooks verify correctly
- [ ] `STRIPE_STARTER_PRICE_ID` - Starter checkout works
- [ ] `STRIPE_PROFESSIONAL_PRICE_ID` - Professional checkout works
- [ ] `NEXT_PUBLIC_BASE_URL` - Redirects work correctly

---

## 🔒 Security Notes

- Never commit `.env.local` to git (it's in `.gitignore`)
- Never expose `STRIPE_SECRET_KEY` to frontend (no `NEXT_PUBLIC_` prefix)
- Rotate keys if accidentally exposed
- Use separate Stripe accounts for test and production
- Keep `NEXTAUTH_SECRET` secure - it's used to encrypt tokens
