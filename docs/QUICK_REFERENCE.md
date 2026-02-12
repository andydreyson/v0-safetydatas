# SafetyDatas - Quick Launch Reference

> One-page reference for launch week execution  
> Print this out and check off items as you go  

---

## 🚀 This Week's Action Items

### Monday: Infrastructure Setup
| Task | Status | Notes |
|------|--------|-------|
| Create Vercel Postgres database | ⬜ | 15 min |
| Run Prisma migrations | ⬜ | `npx prisma db push` |
| Generate NEXTAUTH_SECRET | ⬜ | `openssl rand -base64 32` |
| Add all env vars to .env.local | ⬜ | See ENVIRONMENT_SETUP.md |
| Test local signup flow | ⬜ | http://localhost:3000/signup |

### Tuesday: Stripe Configuration
| Task | Status | Notes |
|------|--------|-------|
| Create Stripe account (test mode) | ⬜ | dashboard.stripe.com |
| Copy API keys to .env.local | ⬜ | pk_test_ and sk_test_ |
| Create Starter product ($15/mo) | ⬜ | Copy price_ ID |
| Create Professional product ($45/mo) | ⬜ | Copy price_ ID |
| Configure Customer Portal | ⬜ | Settings → Billing |
| Install Stripe CLI | ⬜ | stripe.com/docs/stripe-cli |
| Start webhook forwarding | ⬜ | `stripe listen --forward-to localhost:3000/api/stripe/webhook` |
| Add webhook secret to .env.local | ⬜ | whsec_... |

### Wednesday: Testing
| Task | Status | Notes |
|------|--------|-------|
| Test signup → pricing → checkout flow | ⬜ | Use 4242 4242 4242 4242 |
| Verify subscription in database | ⬜ | Check Prisma Studio |
| Test document upload | ⬜ | Upload test PDF |
| Test QR code generation | ⬜ | Create group, generate QR |
| Test customer portal | ⬜ | Manage subscription button |
| Test webhook cancellation | ⬜ | Cancel in Stripe, verify DB |
| Complete pre-launch checklist | ⬜ | See PRE_LAUNCH_CHECKLIST.md |

### Thursday: Production Deploy
| Task | Status | Notes |
|------|--------|-------|
| Switch Stripe to LIVE mode | ⬜ | Toggle in dashboard |
| Copy live API keys | ⬜ | pk_live_ and sk_live_ |
| Create live products & prices | ⬜ | Same as test mode |
| Add env vars to Vercel | ⬜ | Project → Settings → Env Vars |
| Deploy to production | ⬜ | `git push` |
| Set up live webhook endpoint | ⬜ | Add endpoint in Stripe |
| Add live webhook secret to Vercel | ⬜ | whsec_... |
| Test live payment (small amount) | ⬜ | Use real card, refund after |

### Friday: Launch & Growth
| Task | Status | Notes |
|------|--------|-------|
| Create X/Twitter account | ⬜ | @SafetyDatas |
| Post launch announcement | ⬜ | See POST_LAUNCH_GROWTH.md |
| Send 20 cold emails | ⬜ | Start with auto repair shops |
| Set up analytics | ⬜ | Vercel Analytics + PostHog |
| Celebrate! 🎉 | ⬜ | You launched! |

---

## 🔑 Critical Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://v0-safetydatas.vercel.app

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...

# App
NEXT_PUBLIC_BASE_URL=https://v0-safetydatas.vercel.app
```

---

## 📞 Important Links

| Resource | URL |
|----------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Stripe Dashboard | https://dashboard.stripe.com |
| Production App | https://v0-safetydatas.vercel.app |
| Prisma Studio | `npx prisma studio` |
| Stripe CLI Install | https://stripe.com/docs/stripe-cli |

---

## ✅ Pre-Launch Critical Checks

- [ ] Can sign up new user
- [ ] Can log in existing user
- [ ] Can complete Stripe checkout (test)
- [ ] Subscription appears in database
- [ ] Can upload PDF document
- [ ] Can create group
- [ ] Can generate QR code
- [ ] Webhooks update database correctly
- [ ] Customer portal works
- [ ] Mobile responsive

---

## 🎯 First 7 Days Growth Targets

| Metric | Target |
|--------|--------|
| X Followers | 50 |
| Cold Emails Sent | 50 |
| Trial Signups | 5 |
| Paying Customers | 1 |

---

## 🐛 Emergency Contacts

| Issue | Solution |
|-------|----------|
| Database down | Vercel Dashboard → Storage → Postgres |
| Payments failing | Stripe Dashboard → Developers → Logs |
| App not loading | Vercel Dashboard → Deployments |
| Webhook errors | Stripe Dashboard → Developers → Webhooks |

---

## 💡 Pro Tips

1. **Keep Stripe CLI running** during development or webhooks won't work
2. **Test with real money** in production (small amount, then refund)
3. **Document everything** - save all IDs and keys
4. **Start with auto repair shops** - highest pain point
5. **Post on X daily** - consistency beats perfection
6. **Follow up** - 80% of sales happen after the 5th contact

---

## 🎉 Launch Day Mantra

> "Done is better than perfect."
> 
> "Launch and learn, don't learn and launch."
>
> "Your first 10 customers teach you more than any research."

---

**Go get 'em! 🚀**
