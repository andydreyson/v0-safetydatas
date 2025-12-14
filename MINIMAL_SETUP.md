# 🏃 Minimal Setup - Test Stripe Nå (5 minutter)

## Problem: Du får 404 når du trykker "Start Free Trial"

**Årsak:** Environment variables er ikke satt opp.

## Rask fix for å teste:

### Steg 1: Generer NextAuth Secret (30 sek)

```bash
openssl rand -base64 32
```

Kopier resultatet og oppdater `.env.local`:

```env
NEXTAUTH_SECRET=<paste_generated_secret_here>
```

### Steg 2: Få Stripe Test Keys (2 min)

1. Gå til https://dashboard.stripe.com/test/apikeys
2. Kopier **Publishable key** (starts with `pk_test_`)
3. Kopier **Secret key** (starts with `sk_test_`)

Oppdater `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Steg 3: Opprett Stripe Products (2 min)

1. Gå til https://dashboard.stripe.com/test/products
2. Klikk "Add product"
3. Lag **Starter**:
   - Name: `Starter`
   - Price: `$15.00` recurring monthly
   - Klikk "Save product"
   - **Kopier Price ID** (starts with `price_`)

4. Lag **Professional**:
   - Name: `Professional`
   - Price: `$45.00` recurring monthly
   - Klikk "Save product"
   - **Kopier Price ID** (starts with `price_`)

Oppdater `.env.local`:

```env
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
```

### Steg 4: Restart Dev Server

```bash
# Stop serveren (Ctrl+C)
npm run dev
```

### Steg 5: Test!

1. Gå til http://localhost:3000/pricing
2. Klikk "Start Free Trial"
3. Bruk test card: `4242 4242 4242 4242`

---

## Hva med Database?

**For å teste Stripe:** Du trenger IKKE database ennå!

**Men for full funksjonalitet** (login, account management), må du:

### Rask Database Setup (5 min):

#### Option A: Vercel Postgres (anbefalt)

1. Gå til https://vercel.com/dashboard
2. Storage → Create Database → Postgres
3. Kopier `DATABASE_URL`
4. Oppdater `.env.local`
5. Kjør:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

#### Option B: Lokal SQLite (for testing)

Endre i `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

Så:

```bash
npx prisma generate
npx prisma db push
```

---

## Din komplette `.env.local` skal se slik ut:

```env
# Database
DATABASE_URL=<your_vercel_postgres_url>
# ELLER for lokal testing:
# DATABASE_URL=file:./dev.db

# NextAuth (generer med: openssl rand -base64 32)
NEXTAUTH_SECRET=<your_generated_secret>
NEXTAUTH_URL=http://localhost:3000

# Stripe (fra dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Stripe Products (fra dashboard.stripe.com/test/products)
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...

# Webhook (sett opp senere)
STRIPE_WEBHOOK_SECRET=whsec_...

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Redis (du har allerede)
KV_REST_API_URL="https://summary-eel-33232.upstash.io"
KV_REST_API_TOKEN="..."
# ... resten
```

---

## Hva fungerer UTEN database:

✅ `/pricing` page
✅ Stripe Checkout flow
✅ Test payments

## Hva krever database:

❌ `/login`
❌ `/signup`
❌ Account Settings
❌ Subscription tracking

---

## Troubleshooting:

### Får fortsatt 404?

1. Sjekk at du har restartet dev serveren
2. Sjekk at alle Stripe keys er riktige (ingen mellomrom)
3. Sjekk console for feilmeldinger

### "Invalid API Key"?

- Dobbelsjekk at keys starter med `pk_test_` og `sk_test_`
- Pass på at det ikke er ekstra mellomrom i `.env.local`

### Kan ikke opprette products i Stripe?

- Sjekk at du er i **Test mode** (øvre venstre hjørne i Stripe dashboard)

---

## Neste steg etter dette fungerer:

1. ✅ Set up database (Vercel Postgres)
2. ✅ Set up webhooks
3. ✅ Test full user flow (signup → checkout → account)
4. ✅ Deploy til production

Men først - få Stripe til å fungere! 🚀
