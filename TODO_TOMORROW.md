# ✅ TODO for å fullføre Stripe-oppsett

**Dato:** 2025-12-11
**Estimert tid:** 10-15 minutter

---

## 🎯 Hva som mangler:

Du er nesten ferdig! Bare **2 Price IDs** mangler.

---

## 📝 Steg-for-steg TODO:

### ☐ **Steg 1: Finn Starter Price ID (3 min)**

1. Gå til: https://dashboard.stripe.com/test/prices
2. Finn prisen: **$15.00 / month** (Starter)
3. I kolonnen "ID" - kopier verdien som starter med `price_`
4. Lim inn i `.env.local`:
   ```
   STRIPE_STARTER_PRICE_ID=price_din_price_id_her
   ```

**Alternativ metode:**
- Gå til: https://dashboard.stripe.com/test/products/prod_TZJf7LzOuqsS1L
- Klikk på prisen ($15/month)
- Finn "API ID" på høyre side
- Kopier Price ID

---

### ☐ **Steg 2: Finn Professional Price ID (3 min)**

1. Gå til: https://dashboard.stripe.com/test/prices
2. Finn prisen: **$45.00 / month** (Professional)
3. I kolonnen "ID" - kopier verdien som starter med `price_`
4. Lim inn i `.env.local`:
   ```
   STRIPE_PROFESSIONAL_PRICE_ID=price_din_price_id_her
   ```

**Alternativ metode:**
- Gå til: https://dashboard.stripe.com/test/products/prod_TZJidAgrGLgxf2
- Klikk på prisen ($45/month)
- Finn "API ID" på høyre side
- Kopier Price ID

---

### ☐ **Steg 3: Restart Dev Server (30 sek)**

```bash
# Gå til terminalen hvor serveren kjører
# Trykk Ctrl+C for å stoppe
# Start på nytt:
npm run dev
```

---

### ☐ **Steg 4: Test Stripe Checkout (2 min)**

1. Gå til: http://localhost:3000/pricing
2. Klikk "Start Free Trial" på Starter eller Professional
3. Du skal nå komme til Stripe Checkout
4. Bruk test card: `4242 4242 4242 4242`
5. Fyll ut:
   - **Card number:** 4242 4242 4242 4242
   - **Expiry:** Hvilken som helst fremtidig dato (f.eks. 12/25)
   - **CVC:** 123
   - **Name:** Test User
   - **Email:** test@example.com

6. Klikk "Subscribe"

**Forventet resultat:** ✅ Du skal bli redirected tilbake til appen!

---

### ☐ **Steg 5: Verifiser i Stripe Dashboard (1 min)**

1. Gå til: https://dashboard.stripe.com/test/customers
2. Du skal se en ny kunde: "Test User"
3. Gå til: https://dashboard.stripe.com/test/subscriptions
4. Du skal se en aktiv subscription!

---

## 🎉 Når alt fungerer:

Du har da:
- ✅ Stripe Checkout flow som fungerer
- ✅ Test subscription opprettet
- ✅ Test betaling fullført

---

## 📚 Neste steg (ETTER at Stripe fungerer):

### **Valgfritt - For full funksjonalitet:**

1. **Database Setup** (10 min):
   - Opprett Vercel Postgres database
   - Kjør `npx prisma generate && npx prisma db push`
   - Test `/signup` og `/login`

2. **Webhook Setup** (5 min):
   - Installer Stripe CLI
   - Kjør `stripe listen --forward-to localhost:3000/api/stripe/webhook`
   - Kopier webhook secret til `.env.local`

3. **Test Full Flow** (5 min):
   - Signup → Login → Subscribe → Account Settings

---

## 🆘 Troubleshooting:

### Problem: "Invalid API key"
- ✅ Sjekk at Price IDs starter med `price_`
- ✅ Sjekk at det ikke er mellomrom i `.env.local`
- ✅ Restart dev server

### Problem: "No such price"
- ✅ Sjekk at du er i **Test mode** i Stripe (øvre venstre hjørne)
- ✅ Sjekk at Price ID matcher produktet i Stripe

### Problem: Får fortsatt 404
- ✅ Sjekk console i nettleseren (F12) for feilmeldinger
- ✅ Sjekk terminal for server errors

---

## 📄 Hjelpe-dokumenter:

- `MINIMAL_SETUP.md` - Minimal setup guide
- `STRIPE_SETUP_GUIDE.md` - Komplett Stripe guide
- `QUICKSTART.md` - Quick start oversikt

---

## ✅ Sjekkliste:

- [ ] Funnet Starter Price ID
- [ ] Funnet Professional Price ID
- [ ] Oppdatert `.env.local`
- [ ] Restartet dev server
- [ ] Testet checkout med test card
- [ ] Verifisert kunde i Stripe Dashboard
- [ ] Verifisert subscription i Stripe Dashboard

---

**Lykke til i morgen! 🚀**

Når alt fungerer, har du en komplett SaaS billing løsning! 🎉
