# Vercel Environment Variables Setup Guide

This guide documents the exact steps to add the remaining required environment variables to Vercel for the SafetyDatas deployment.

## Current Status

✅ **Already Configured:**
- `DATABASE_URL` - Prisma Postgres database connection
- `OPENAI_API_KEY` - OpenAI API access

❌ **Still Needed:**
- `NEXTAUTH_SECRET` - Authentication encryption key
- `NEXT_PUBLIC_BASE_URL` - Application base URL
- `STRIPE_SECRET_KEY` - Stripe payment processing
- `STRIPE_PUBLISHABLE_KEY` - Stripe public key (optional but recommended)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook verification (optional for now)

---

## Quick Setup Commands

Run these commands from your project directory to add all missing variables:

```bash
# 1. Navigate to project
cd /path/to/v0-safetydatas

# 2. Add NEXTAUTH_SECRET (generate a secure random string)
npx vercel env add NEXTAUTH_SECRET
# When prompted, enter: openssl rand -base64 32
# Or paste: sK7mP9vN3xQ8wR5tY2uH4jF6bL0aC1dE3gI5kM7oQ9sU2wY4z
# Select: Production, Preview, Development

# 3. Add NEXT_PUBLIC_BASE_URL
npx vercel env add NEXT_PUBLIC_BASE_URL
# When prompted, enter your domain:
# Production: https://safetydatas.com (or your custom domain)
# Preview: https://v0-safetydatas.vercel.app
# Select appropriate environments

# 4. Add STRIPE_SECRET_KEY
npx vercel env add STRIPE_SECRET_KEY
# When prompted, enter your Stripe secret key:
# Test: sk_test_...
# Live: sk_live_...
# Select: Production (use live key), Preview/Development (use test key)

# 5. Add STRIPE_PUBLISHABLE_KEY (optional)
npx vercel env add STRIPE_PUBLISHABLE_KEY
# When prompted, enter your Stripe publishable key:
# Test: pk_test_...
# Live: pk_live_...
# Select appropriate environments

# 6. Verify all variables are set
npx vercel env ls
```

---

## Detailed Step-by-Step Instructions

### Method 1: Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
# or
npx vercel login
```

#### Step 2: Link to your project (if not already linked)
```bash
npx vercel link
# Select your project: v0-safetydatas
```

#### Step 3: Add NEXTAUTH_SECRET
```bash
npx vercel env add NEXTAUTH_SECRET
```

**When prompted:**
- Value: Generate with `openssl rand -base64 32` or use any secure 32+ character random string
- Example: `sK7mP9vN3xQ8wR5tY2uH4jF6bL0aC1dE3gI5kM7oQ9sU2wY4z`
- Environments: Select **Production**, **Preview**, and **Development**

> **Important:** Keep this secret safe! It's used to encrypt JWT tokens and session data.

#### Step 4: Add NEXT_PUBLIC_BASE_URL
```bash
npx vercel env add NEXT_PUBLIC_BASE_URL
```

**When prompted:**
- Production value: `https://safetydatas.com` (or your actual custom domain)
- Preview value: `https://v0-safetydatas.vercel.app` (your Vercel deployment URL)
- Development value: `http://localhost:3000`

> **Note:** NEXT_PUBLIC_ prefix means this variable is exposed to the browser. Only use public URLs here.

#### Step 5: Add STRIPE_SECRET_KEY
```bash
npx vercel env add STRIPE_SECRET_KEY
```

**When prompted:**
- Production value: Your live Stripe secret key (`sk_live_...`) from https://dashboard.stripe.com/apikeys
- Preview/Development value: Your test Stripe secret key (`sk_test_...`)
- Select different values for different environments

#### Step 6: Add STRIPE_PUBLISHABLE_KEY
```bash
npx vercel env add STRIPE_PUBLISHABLE_KEY
```

**When prompted:**
- Production value: Your live publishable key (`pk_live_...`)
- Preview/Development value: Your test publishable key (`pk_test_...`)

#### Step 7: Verify Configuration
```bash
# List all environment variables
npx vercel env ls

# Check specific variable
npx vercel env pull
```

---

### Method 2: Vercel Dashboard

#### Step 1: Navigate to Project Settings
1. Go to https://vercel.com/dashboard
2. Click on the **v0-safetydatas** project
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

#### Step 2: Add NEXTAUTH_SECRET
1. Click **Add** button
2. **Name**: `NEXTAUTH_SECRET`
3. **Value**: Generate with `openssl rand -base64 32`
4. **Environment**: Check ✓ Production, ✓ Preview, ✓ Development
5. Click **Save**

#### Step 3: Add NEXT_PUBLIC_BASE_URL
1. Click **Add** button
2. **Name**: `NEXT_PUBLIC_BASE_URL`
3. **Value**: 
   - For Production: `https://safetydatas.com`
   - (Must add separately for Preview with your Vercel URL)
4. **Environment**: Check appropriate environments
5. Click **Save**

#### Step 4: Add STRIPE_SECRET_KEY
1. Click **Add** button
2. **Name**: `STRIPE_SECRET_KEY`
3. **Value**: Your Stripe secret key
4. **Environment**: Check appropriate environments
5. Click **Save**

#### Step 5: Add STRIPE_PUBLISHABLE_KEY
1. Click **Add** button
2. **Name**: `STRIPE_PUBLISHABLE_KEY`
3. **Value**: Your Stripe publishable key
4. **Environment**: Check appropriate environments
5. Click **Save**

---

## Environment-Specific Configuration

### Production Environment
| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | ✅ Already set | Prisma Postgres |
| `OPENAI_API_KEY` | ✅ Already set | Production API key |
| `NEXTAUTH_SECRET` | Generate new | Strong random string |
| `NEXT_PUBLIC_BASE_URL` | `https://safetydatas.com` | Your production domain |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Live Stripe key |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Live Stripe key |

### Preview Environment
| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | ✅ Already set | Can use same or preview DB |
| `OPENAI_API_KEY` | ✅ Already set | Can use same API key |
| `NEXTAUTH_SECRET` | Same as prod | Or different for isolation |
| `NEXT_PUBLIC_BASE_URL` | `https://v0-safetydatas.vercel.app` | Auto-generated |
| `STRIPE_SECRET_KEY` | `sk_test_...` | **Always use test keys** |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | **Always use test keys** |

### Development Environment
| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | ✅ Already set | Or local/dev database |
| `OPENAI_API_KEY` | ✅ Already set | |
| `NEXTAUTH_SECRET` | Any string | Can be simple for local dev |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | |
| `STRIPE_SECRET_KEY` | `sk_test_...` | **Always use test keys** |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | **Always use test keys** |

---

## Verification Checklist

After adding all variables, run these verification steps:

```bash
# 1. Verify environment variables are set
npx vercel env ls

# 2. Pull latest env vars locally
npx vercel env pull

# 3. Run pre-deployment check
node scripts/pre-deploy-check.js

# 4. Deploy and test
npx vercel --prod

# 5. Verify health endpoint
curl https://safetydatas.com/api/health
```

---

## Troubleshooting

### Variable not appearing after adding
- Wait 1-2 minutes for propagation
- Redeploy the application: `npx vercel --prod`
- Check that you selected the correct environment

### NEXT_PUBLIC_ variables not working
- These require a rebuild to take effect
- Any change to NEXT_PUBLIC_ variables needs a redeployment

### Stripe test mode vs live mode
- Always use `sk_test_` / `pk_test_` for Preview and Development
- Only use `sk_live_` / `pk_live_` for Production
- Never commit live keys to your repository

### Getting "Missing environment variable" errors
1. Check variable name spelling (case-sensitive)
2. Verify the variable is set for the correct environment
3. Redeploy after adding variables
4. Check that `.env.local` has the variable for local development

---

## Security Best Practices

1. **Never commit secrets to git**
   - `.env.local` is in `.gitignore` (verify this!)
   - Use Vercel environment variables for all secrets

2. **Use different secrets per environment**
   - Don't reuse production secrets in development
   - Each environment should have its own NEXTAUTH_SECRET

3. **Rotate keys regularly**
   - Stripe keys can be rotated from the Stripe Dashboard
   - Generate new NEXTAUTH_SECRET periodically

4. **Use test mode for Stripe**
   - Never use live Stripe keys in development or preview
   - Test thoroughly with test cards before going live

---

## Next Steps

After completing environment variable setup:

1. ✅ Run pre-deployment check: `node scripts/pre-deploy-check.js`
2. ✅ Deploy to production: `npx vercel --prod`
3. ✅ Verify deployment: `curl https://your-domain.com/api/health`
4. ✅ Test authentication flow
5. ✅ Test Stripe payments (use test card: 4242 4242 4242 4242)
6. ✅ Test PDF upload and analysis

---

**Need Help?**
- Run the deployment checker: `node scripts/pre-deploy-check.js`
- Check Vercel logs: `npx vercel logs --all`
- Review the health endpoint: `/api/health`
