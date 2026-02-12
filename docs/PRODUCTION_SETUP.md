# Production Setup Guide

> Step-by-step guide to set up SafetyDatas for production  
> Estimated time: 2-3 hours  

---

## Phase 1: Database Setup (15 min)

### 1.1 Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Create Database**
3. Select **Postgres**
4. Name it: `safetydatas-db`
5. Region: Choose closest to your users (e.g., `us-east-1`)
6. Click **Create**

### 1.2 Get Connection String

1. Click on your new database
2. Go to the **Quickstart** tab
3. Copy the `.env.local` snippet
4. It will look like:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```

### 1.3 Run Migrations

```bash
# Navigate to project
cd /Users/bono/.openclaw/workspace/v0-safetydatas

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Verify with Prisma Studio (optional)
npx prisma studio
```

✅ **Verify**: Open Prisma Studio, you should see empty tables for User, Subscription, Document, Group, etc.

---

## Phase 2: NextAuth Setup (10 min)

### 2.1 Generate Secret

```bash
# Generate a secure random string
openssl rand -base64 32

# Copy the output
```

### 2.2 Add to Environment

Add to `.env.local`:
```env
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
```

✅ **Verify**: Run `npm run dev` and try signing up at `http://localhost:3000/signup`

---

## Phase 3: Stripe Setup (45 min)

### 3.1 Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Test mode** (toggle in top right)
3. Go to **Developers** → **API Keys**
4. Copy:
   - Publishable key (`pk_test_...`)
   - Secret key (`sk_test_...`)

Add to `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 3.2 Create Products and Prices

**Starter Plan ($15/month):**
1. Go to **Products** → **Add Product**
2. Name: `Starter`
3. Description: `Up to 100 data sheets, 5 groups, all core features`
4. Pricing model: `Standard pricing`
5. Price: `$15.00 USD` per month
6. Click **Save product**
7. Copy the **Price ID** (starts with `price_`)

**Professional Plan ($45/month):**
1. Repeat above steps
2. Name: `Professional`
3. Description: `Unlimited data sheets, 10 groups, team collaboration`
4. Price: `$45.00 USD` per month
5. Copy the **Price ID**

Add to `.env.local`:
```env
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
```

### 3.3 Configure Customer Portal

1. Go to **Settings** → **Billing** → **Customer Portal**
2. Click **Activate test link**
3. Configure features:
   - ✅ Update payment method
   - ✅ View invoice history
   - ✅ Cancel subscription
   - ✅ Update subscription (allow upgrades/downgrades)
4. Save settings

### 3.4 Set Up Webhooks (Local Development)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli#install

2. Login:
   ```bash
   stripe login
     ```

3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_`)

Add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Keep the CLI running during development!

### 3.5 Set Up Webhooks (Production)

1. Deploy first (see Phase 5)
2. Go to **Developers** → **Webhooks** → **Add endpoint**
3. Endpoint URL: `https://v0-safetydatas.vercel.app/api/stripe/webhook`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the signing secret
6. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

✅ **Verify**: Complete a test checkout and verify subscription appears in database

---

## Phase 4: Local Testing (20 min)

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Test Complete User Flow

**Test 1: Sign Up**
1. Go to `http://localhost:3000/signup`
2. Create test account
3. Verify user appears in Prisma Studio

**Test 2: Select Plan**
1. Go to `http://localhost:3000/pricing`
2. Click "Start Free Trial" on Starter plan
3. Should redirect to Stripe Checkout

**Test 3: Complete Checkout**
1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date (e.g., 12/30)
3. Any CVC (e.g., 123)
4. Complete checkout
5. Should redirect back to app with success message

**Test 4: Verify Subscription**
1. Check Prisma Studio → Subscription table
2. Should see subscription with status "active"
3. Check Stripe Dashboard → Customers

**Test 5: Test Customer Portal**
1. In app, click "Account" in sidebar
2. Click "Manage Subscription"
3. Should open Stripe Customer Portal
4. Try viewing invoices

**Test 6: Test Webhooks**
1. In Stripe Dashboard, find your test subscription
2. Cancel it
3. Check Prisma Studio → Subscription status should change to "canceled"

### 4.3 Test Document Upload

1. Upload a PDF safety data sheet
2. Verify AI extraction works (if OpenAI key configured)
3. Create a group and add documents
4. Generate QR code for group
5. Test public sharing link

---

## Phase 5: Production Deployment (30 min)

### 5.1 Switch to Live Stripe Keys

1. In Stripe Dashboard, toggle to **Live mode**
2. Go to **Developers** → **API Keys**
3. Copy live keys (starts with `pk_live_` and `sk_live_`)
4. Create live products and prices (same as test mode)
5. Configure live Customer Portal
6. Create live webhook endpoint

### 5.2 Add Environment Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project: `v0-safetydatas`
3. Click **Settings** → **Environment Variables**
4. Add all variables:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | (from Vercel Postgres) |
   | `NEXTAUTH_SECRET` | (your generated secret) |
   | `NEXTAUTH_URL` | `https://v0-safetydatas.vercel.app` |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |
   | `STRIPE_SECRET_KEY` | `sk_live_...` |
   | `STRIPE_WEBHOOK_SECRET` | (from live webhook) |
   | `STRIPE_STARTER_PRICE_ID` | `price_...` (live) |
   | `STRIPE_PROFESSIONAL_PRICE_ID` | `price_...` (live) |
   | `NEXT_PUBLIC_BASE_URL` | `https://v0-safetydatas.vercel.app` |

5. Click **Save**

### 5.3 Deploy

```bash
# Commit all changes
git add .
git commit -m "Ready for production launch"
git push
```

Vercel will auto-deploy. Wait for deployment to complete.

### 5.4 Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Domains
2. Add custom domain (e.g., `safetydatas.com`)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` to use custom domain
5. Update Stripe webhook URL
6. Redeploy

### 5.5 Production Testing

Repeat all tests from Phase 4 on production URL using real Stripe transactions.

⚠️ **Use small amounts for testing!** You can refund test payments.

---

## Phase 6: Post-Launch Verification (10 min)

### 6.1 Verify All Systems

- [ ] App loads at production URL
- [ ] Can sign up new users
- [ ] Can complete checkout with real card
- [ ] Subscription appears in database
- [ ] Customer portal works
- [ ] Document upload works
- [ ] PDF extraction works
- [ ] QR codes generate correctly
- [ ] Public share links work

### 6.2 Set Up Monitoring

- [ ] Connect Vercel Analytics
- [ ] Set up Stripe email notifications for failed payments
- [ ] Configure uptime monitoring (e.g., UptimeRobot)

### 6.3 Document Everything

- [ ] Save all API keys and secrets in password manager
- [ ] Document custom domain DNS settings
- [ ] Save Stripe product/price IDs
- [ ] Document webhook endpoint URLs

---

## 🎉 You're Live!

Your SafetyDatas app is now in production. Next steps:

1. **Announce on X/Twitter** (see `POST_LAUNCH_GROWTH.md`)
2. **Start cold outreach** (see `SMB_TARGET_LIST.md`)
3. **Monitor metrics** and gather feedback
4. **Iterate based on user feedback**

---

## 🐛 Troubleshooting

### "Database connection failed"
- Verify `DATABASE_URL` is correct
- Check Vercel Postgres is in same region as deployment
- Ensure IP allowlist includes Vercel (should be automatic)

### "Stripe checkout not working"
- Verify Price IDs are correct
- Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `pk_live_` (or `pk_test_`)
- Ensure `STRIPE_SECRET_KEY` doesn't have `NEXT_PUBLIC_` prefix

### "Webhooks not updating database"
- Verify `STRIPE_WEBHOOK_SECRET` matches the webhook in Stripe Dashboard
- Check Vercel logs for webhook errors
- Ensure webhook endpoint is accessible (not behind auth)

### "Authentication not working"
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your actual URL
- Ensure cookies are being set (check browser dev tools)
