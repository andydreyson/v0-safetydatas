# SAFETYDATAS LAUNCH CHECKLIST

## 🔴 CRITICAL - Must Complete Before Launch

### Stripe Setup (30 min)
- [ ] Create Stripe account at https://stripe.com
- [ ] Switch to Test mode
- [ ] Create Product: "Starter Plan" - $15/month recurring
- [ ] Create Product: "Professional Plan" - $45/month recurring
- [ ] Copy Price IDs (format: `price_xxxxx`) from each product
- [ ] Add to `.env.local`:
  ```
  STRIPE_SECRET_KEY=sk_test_xxxxx
  NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_xxxxx
  NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID=price_xxxxx
  ```

### Database Setup (15 min)
- [ ] Go to https://vercel.com/dashboard → Storage → Create Postgres Database
- [ ] Copy connection string
- [ ] Add to `.env.local`:
  ```
  DATABASE_URL=postgres://xxxxx
  ```
- [ ] Run: `npx prisma generate && npx prisma db push`

### Auth & Security (10 min)
- [ ] Generate random string for NEXTAUTH_SECRET:
  ```bash
  openssl rand -base64 32
  ```
- [ ] Add to `.env.local`:
  ```
  NEXTAUTH_SECRET=your_generated_secret
  NEXT_PUBLIC_BASE_URL=https://safetydatas.com
  ```

### Deploy to Production (10 min)
- [ ] Add all env vars to Vercel dashboard
- [ ] Deploy: `git push` or Vercel dashboard
- [ ] Test signup → login → pricing → checkout flow
- [ ] Verify Stripe test payment works

---

## 🟡 HIGH PRIORITY - Launch Week

### Legal & Compliance
- [ ] Add Terms of Service page (/terms)
- [ ] Add Privacy Policy page (/privacy)
- [ ] Add Cookie consent banner
- [ ] GDPR compliance check (data deletion, export)

### Landing Page Optimization
- [ ] Hero section with clear value prop
- [ ] Feature breakdown with screenshots
- [ ] Testimonials (even if just beta users)
- [ ] FAQ section
- [ ] Clear CTA above the fold

### Analytics & Tracking
- [ ] Add Google Analytics 4 or Plausible
- [ ] Set up Stripe webhook for subscription events
- [ ] Add error tracking (Sentry or similar)

---

## 🟢 POST-LAUNCH - Month 1

### Feature Additions
- [ ] ZIP export for bulk downloads
- [ ] Email notifications (new uploads, expiring sheets)
- [ ] Mobile app (PWA wrapper)
- [ ] API access for enterprise customers

### Growth & Marketing
- [ ] SMB cold outreach campaign (see OUTREACH_PLAN.md)
- [ ] X/Twitter content strategy (see X_GROWTH_STRATEGY.md)
- [ ] SEO optimization for "safety data sheet management"
- [ ] Partner with safety consultants

---

## .env.local Template

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Stripe
STRIPE_SECRET_KEY="sk_live_xxxxx"  # or sk_test_ for dev
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID="price_xxxxx"
NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID="price_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# Auth
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="https://safetydatas.com"

# App
NEXT_PUBLIC_BASE_URL="https://safetydatas.com"
```

---

## Launch Success Metrics

- [ ] 1 paying customer within 7 days
- [ ] 10 free trial signups within 14 days
- [ ] $500 MRR within 30 days
- [ ] 3 case studies/testimonials within 60 days
