# Stripe Test Mode Setup Guide

## 1. Get Test API Keys

Go to: https://dashboard.stripe.com/test/apikeys

Copy these values:
- **Secret key**: `sk_test_...` 
- **Publishable key**: `pk_test_...`

## 2. Create Test Products & Prices

Go to: https://dashboard.stripe.com/test/products

Create two products:

### Product 1: Starter
- Name: `Starter`
- Description: `Up to 100 data sheets`
- Price: `$15.00` / month (Recurring)

### Product 2: Professional  
- Name: `Professional`
- Description: `Unlimited data sheets`
- Price: `$45.00` / month (Recurring)

Copy the **Price IDs** (they look like `price_1ABC...`)

## 3. Add to Vercel Environment Variables

Go to: https://vercel.com/dashboard → v0-safetydatas → Settings → Environment Variables

Add these:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID=price_...
```

⚠️ **Important**: Use TEST keys for now, NOT production keys!

## 4. Test Payment

Use these test card numbers:

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Declined |

Use any future date (e.g., 12/30) and any 3-digit CVC.

## 5. Check Webhook (Optional)

For local testing, use Stripe CLI:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 6. Switch to Production

When ready:
1. Toggle Stripe to "Live mode"
2. Create products again in live mode
3. Copy live Price IDs
4. Update Vercel env vars with LIVE keys (sk_live_...)
5. Redeploy

## Test Checklist

- [ ] Can click "Get Started" on Starter plan
- [ ] Stripe Checkout opens
- [ ] Can complete payment with test card
- [ ] Redirects back to app after success
- [ ] Subscription appears in Stripe dashboard
