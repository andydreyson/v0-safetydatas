# 🚀 Stripe Billing Implementation - Complete Setup Guide

This guide will walk you through setting up Stripe billing for SafetyDatas.com.

## ✅ What Has Been Implemented

All the code is ready! Here's what's been built:

### 1. **Database Schema** (Prisma)
- User authentication models (User, Account, Session)
- Subscription model with Stripe integration
- Document and Group models

### 2. **Authentication** (NextAuth.js)
- Email/password login
- Secure password hashing with bcrypt
- JWT session management
- `/login` and `/signup` pages

### 3. **Stripe Integration**
- Checkout session creation
- Customer Portal integration
- Webhook handler for subscription events
- Support for 2 plans (Starter $15/mo, Professional $45/mo)

### 4. **UI Pages**
- `/pricing` - Pricing page with 14-day free trial
- `/login` - User login
- `/signup` - New user registration
- Account settings modal (accessible from sidebar)

---

## 📋 Setup Steps

### **Step 1: Set Up Vercel Postgres Database**

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Create Database**
3. Select **Postgres**
4. Choose a name (e.g., "safetydatas-db")
5. Click **Create**

6. Once created, go to the `.env.local` tab in your database dashboard
7. Copy the `DATABASE_URL` connection string
8. Paste it into your local `.env.local` file

**Your `.env.local` should now have:**
```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

### **Step 2: Run Database Migrations**

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### **Step 3: Generate NextAuth Secret**

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Add it to `.env.local`:
```env
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### **Step 4: Set Up Stripe Account**

1. **Log into Stripe Dashboard**: https://dashboard.stripe.com

2. **Get API Keys**:
   - Go to **Developers** → **API Keys**
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)

   Add to `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

3. **Create Products and Prices**:

   **Option A: Using Stripe Dashboard (Recommended)**

   a. Go to **Products** → **Add Product**

   b. **Create Starter Plan:**
      - Name: `Starter`
      - Description: `Up to 100 data sheets, 5 groups, all core features`
      - Pricing: `$15.00 USD` per month, recurring
      - After creating, copy the **Price ID** (starts with `price_`)

   c. **Create Professional Plan:**
      - Name: `Professional`
      - Description: `Unlimited data sheets, 10 groups, team collaboration`
      - Pricing: `$45.00 USD` per month, recurring
      - After creating, copy the **Price ID** (starts with `price_`)

   d. Add the Price IDs to `.env.local`:
      ```env
      STRIPE_STARTER_PRICE_ID=price_1ABC123...
      STRIPE_PROFESSIONAL_PRICE_ID=price_1XYZ789...
      ```

   **Option B: Using Stripe CLI (Advanced)**

   ```bash
   # Install Stripe CLI: https://stripe.com/docs/stripe-cli

   # Create Starter product
   stripe products create \
     --name="Starter" \
     --description="Up to 100 data sheets, 5 groups"

   # Create Starter price (use product ID from above)
   stripe prices create \
     --product=prod_xxx \
     --currency=usd \
     --unit-amount=1500 \
     --recurring[interval]=month

   # Repeat for Professional plan ($45/month)
   ```

### **Step 5: Configure Stripe Customer Portal**

1. Go to **Settings** → **Billing** → **Customer portal**
2. Click **Activate test link**
3. Configure what customers can do:
   - ✅ Update payment method
   - ✅ View invoices
   - ✅ Cancel subscription
   - ✅ Update subscription (optional)
4. Save settings

### **Step 6: Set Up Stripe Webhooks**

Webhooks are critical for keeping your database in sync with Stripe subscription events.

**For Local Development:**

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli#install

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. Keep the Stripe CLI running while developing!

**For Production (Vercel):**

1. Go to **Developers** → **Webhooks** → **Add endpoint**

2. Endpoint URL: `https://v0-safetydatas.vercel.app/api/stripe/webhook`

3. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Copy the **Signing secret** (starts with `whsec_`)

5. Add it to your Vercel environment variables:
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `STRIPE_WEBHOOK_SECRET` with the signing secret

### **Step 7: Update Environment Variables**

Your complete `.env.local` should look like this:

```env
# ============================================
# Database (Vercel Postgres)
# ============================================
DATABASE_URL=postgresql://user:password@host:5432/database

# ============================================
# NextAuth.js
# ============================================
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000

# ============================================
# Stripe
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...

# ============================================
# Upstash Redis/KV Database
# ============================================
KV_REST_API_URL="https://summary-eel-33232.upstash.io"
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."
KV_URL="rediss://..."
REDIS_URL="rediss://..."

# ============================================
# Base URL
# ============================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### **Step 8: Deploy to Vercel**

1. **Add Environment Variables to Vercel:**
   - Go to your Vercel project → Settings → Environment Variables
   - Add ALL variables from `.env.local` (except for local URLs)
   - For production, change:
     ```
     NEXTAUTH_URL=https://v0-safetydatas.vercel.app
     NEXT_PUBLIC_BASE_URL=https://v0-safetydatas.vercel.app
     ```

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Add Stripe billing integration"
   git push
   ```

3. Vercel will auto-deploy your changes

---

## 🧪 Testing the Integration

### Test User Flow:

1. **Sign Up:**
   - Go to `/signup`
   - Create a new account
   - Check database in Prisma Studio - user should be created

2. **Select a Plan:**
   - Go to `/pricing`
   - Click "Start Free Trial" on either plan
   - Should redirect to Stripe Checkout

3. **Complete Checkout:**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC
   - Complete checkout

4. **Verify Subscription:**
   - Check Prisma Studio - Subscription record should be created
   - Check Stripe Dashboard - Customer and subscription should appear

5. **Test Customer Portal:**
   - Go to `/` (main app)
   - Click "Account" in sidebar
   - Click "Manage Subscription"
   - Should open Stripe Customer Portal
   - Try updating payment method, viewing invoices, etc.

6. **Test Webhooks:**
   - In Stripe Dashboard, cancel the test subscription
   - Check Prisma Studio - subscription status should update to "canceled"

### Stripe Test Cards:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0027 6000 3184` | Requires authentication (3D Secure) |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Card declined (insufficient funds) |

---

## 🔧 Common Issues & Solutions

### Issue: "Database not found"
**Solution:** Make sure you ran `npx prisma db push` after setting up the DATABASE_URL

### Issue: "Invalid Stripe API key"
**Solution:** Double-check that you copied the correct keys from Stripe Dashboard → API Keys

### Issue: "Webhook signature verification failed"
**Solution:**
- For local: Make sure `stripe listen` is running
- For production: Make sure the webhook secret matches the one in Vercel environment variables

### Issue: "Subscription not updating after checkout"
**Solution:** Check that webhooks are configured correctly and the webhook endpoint is accessible

### Issue: "Customer Portal not working"
**Solution:** Make sure you activated the Customer Portal in Stripe Dashboard → Settings → Billing

---

## 📚 Next Steps

Once Stripe is working:

1. **Add Authentication to Routes:**
   - Protect `/pricing` to require login
   - Protect main app routes to require active subscription
   - Add middleware to check subscription status

2. **Usage Limits:**
   - Implement document upload limits based on plan
   - Block group creation when limit reached
   - Show upgrade prompts when limits approached

3. **Email Notifications:**
   - Send welcome email on signup
   - Send trial ending reminders
   - Send payment failed notifications

4. **Analytics:**
   - Track conversion rates (signup → paid)
   - Monitor MRR (Monthly Recurring Revenue)
   - Analyze churn rate

5. **Go Live:**
   - Switch from Stripe Test mode to Live mode
   - Update API keys in production
   - Update webhook endpoints
   - Test everything with real (small) payments first

---

## 🎯 Architecture Overview

```
User Flow:
1. User signs up → Creates User in database
2. User selects plan → Redirects to Stripe Checkout
3. Stripe Checkout → Creates Stripe Customer
4. Payment succeeds → Webhook fires
5. Webhook handler → Creates/updates Subscription in database
6. User logs in → App checks subscription status
7. User clicks "Manage Subscription" → Opens Stripe Customer Portal
8. User upgrades/cancels → Webhook fires → Database updates
```

---

## 📞 Support

If you run into issues:

- Stripe Documentation: https://stripe.com/docs
- NextAuth Documentation: https://next-auth.js.org
- Prisma Documentation: https://www.prisma.io/docs

Good luck! 🚀
