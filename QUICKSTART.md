# 🚀 Quick Start Guide - Stripe Integration

## What's Been Built

Full Stripe billing has been implemented! Here's what you now have:

### ✅ Complete Features

1. **User Authentication** (NextAuth.js)
   - Email/password registration and login
   - Secure password hashing
   - Session management with JWT

2. **Stripe Billing**
   - Checkout flow for subscriptions ($15 Starter, $45 Professional)
   - 14-day free trial
   - Customer Portal for subscription management
   - Webhook integration to sync subscription status

3. **Database Schema** (Prisma + Postgres)
   - User, Account, Session tables
   - Subscription table with Stripe integration
   - Document and Group tables

4. **UI Pages**
   - `/login` - User login
   - `/signup` - User registration
   - `/pricing` - Pricing page with Stripe Checkout
   - Account Settings modal (from sidebar)

## Next Steps to Get It Working

### 1. Set Up Vercel Postgres (2 minutes)

```bash
# In your Vercel Dashboard:
# Storage → Create Database → Postgres
# Copy the DATABASE_URL and add to .env.local
```

### 2. Generate Secrets (1 minute)

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Add to .env.local:
# NEXTAUTH_SECRET=<generated_secret>
```

### 3. Run Database Migrations (1 minute)

```bash
npx prisma generate
npx prisma db push
```

### 4. Set Up Stripe (5 minutes)

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** and **Secret key**
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

### 5. Create Stripe Products (3 minutes)

In Stripe Dashboard → Products → Add Product:

**Starter Plan:**
- Name: `Starter`
- Price: `$15.00/month` recurring
- Copy the Price ID → Add to `.env.local` as `STRIPE_STARTER_PRICE_ID`

**Professional Plan:**
- Name: `Professional`
- Price: `$45.00/month` recurring
- Copy the Price ID → Add to `.env.local` as `STRIPE_PROFESSIONAL_PRICE_ID`

### 6. Enable Customer Portal (2 minutes)

1. Go to Stripe → Settings → Billing → Customer portal
2. Click "Activate test link"
3. Enable: Update payment method, View invoices, Cancel subscription
4. Save

### 7. Set Up Webhooks - Local Development (2 minutes)

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli#install

# Login to Stripe
stripe login

# Forward webhooks to local server (keep this running!)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook secret (whsec_...) and add to .env.local:
# STRIPE_WEBHOOK_SECRET=whsec_...
```

### 8. Test It! (5 minutes)

1. Start dev server: `npm run dev`
2. Go to `/signup` and create an account
3. Go to `/pricing` and select a plan
4. Use test card: `4242 4242 4242 4242` (any future date, any CVC)
5. Complete checkout
6. Check Stripe Dashboard - you should see the customer and subscription!
7. Click "Account" in sidebar → "Manage Subscription" → opens Stripe Customer Portal

## Full Environment Variables Needed

Your `.env.local` should have:

```env
# Database
DATABASE_URL=<from_vercel_postgres>

# NextAuth
NEXTAUTH_SECRET=<generated_with_openssl>
NEXTAUTH_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# (Your existing Redis/KV vars stay the same)
```

## Production Deployment

When deploying to Vercel:

1. Add all environment variables to Vercel Dashboard
2. Change URLs to production:
   ```
   NEXTAUTH_URL=https://v0-safetydatas.vercel.app
   NEXT_PUBLIC_BASE_URL=https://v0-safetydatas.vercel.app
   ```
3. Create production webhook in Stripe Dashboard:
   - URL: `https://v0-safetydatas.vercel.app/api/stripe/webhook`
   - Copy the webhook secret to Vercel env vars
4. Deploy!

## Documentation

For detailed setup instructions, see: `STRIPE_SETUP_GUIDE.md`

## Architecture

```
New User Flow:
/signup → Creates user in database
/pricing → User selects plan
Stripe Checkout → Payment
Webhook → Creates subscription in database
/login → User can access app
Sidebar "Account" → Stripe Customer Portal for management
```

## Test Cards

- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

---

That's it! You now have a complete SaaS billing system. 🎉

For issues, check `STRIPE_SETUP_GUIDE.md` for troubleshooting.
