# Post-Deployment Verification Checklist

Use this checklist after deploying SafetyDatas to ensure everything is working correctly in production.

---

## Immediate Verification (Within 5 minutes)

### 1. Health Check Endpoint
- [ ] Visit `https://your-domain.com/api/health`
- [ ] Verify response shows `"status": "healthy"`
- [ ] Confirm all checks pass:
  - [ ] Database: `"status": "ok"`
  - [ ] OpenAI: `"status": "ok"`
  - [ ] Stripe: `"status": "ok"`
  - [ ] Auth: `"status": "ok"`
- [ ] Check no required environment variables are missing

### 2. Homepage Load
- [ ] Visit `https://your-domain.com/`
- [ ] Page loads without errors
- [ ] All images load correctly
- [ ] No console errors (open DevTools → Console)

### 3. SSL/HTTPS
- [ ] Site loads with HTTPS (lock icon in browser)
- [ ] No mixed content warnings

---

## Authentication Verification (Within 15 minutes)

### 4. Sign Up Flow
- [ ] Navigate to `/signup`
- [ ] Create a new test account
- [ ] Receive confirmation (if enabled)
- [ ] Successfully logged in after signup

### 5. Login Flow
- [ ] Log out
- [ ] Navigate to `/login`
- [ ] Log in with existing credentials
- [ ] Redirected to dashboard/app

### 6. Session Management
- [ ] Refresh page while logged in
- [ ] User remains logged in
- [ ] Log out works correctly
- [ ] Session expires appropriately (if configured)

---

## Core Functionality Verification (Within 30 minutes)

### 7. PDF Upload
- [ ] Navigate to document upload
- [ ] Upload a test PDF file (small, < 1MB)
- [ ] Upload succeeds
- [ ] File appears in document list

### 8. AI Analysis (OpenAI)
- [ ] Select uploaded PDF
- [ ] Trigger AI analysis
- [ ] Analysis completes successfully
- [ ] Results are displayed
- [ ] No timeout errors

### 9. Document Management
- [ ] Rename a document
- [ ] Move document to a group/folder (if applicable)
- [ ] Delete a test document
- [ ] Document operations reflect in UI

### 10. Groups/Organization (if applicable)
- [ ] Create a new group
- [ ] Add documents to group
- [ ] Share group with another user (if feature exists)

---

## Payment Flow Verification (Within 1 hour)

### 11. Stripe Integration - Test Mode
**Important: Test with Stripe test keys first!**

- [ ] Navigate to pricing page
- [ ] Select a plan
- [ ] Enter Stripe test card: `4242 4242 4242 4242`
- [ ] Use any future expiry date (e.g., 12/25)
- [ ] Use any 3-digit CVC (e.g., 123)
- [ ] Use any ZIP code
- [ ] Complete checkout
- [ ] Payment succeeds
- [ ] User upgraded to paid plan

### 12. Stripe Webhook (if configured)
- [ ] Check webhook events received in Stripe Dashboard
- [ ] Verify subscription status updates

### 13. Payment Failure Handling
- [ ] Test with declined card: `4000 0000 0000 0002`
- [ ] Verify user-friendly error message
- [ ] User stays on checkout page

---

## Error Handling & Monitoring Verification

### 14. Error Pages
- [ ] Visit a non-existent page (404 test)
- [ ] Verify custom 404 page renders
- [ ] Check error is logged correctly

### 15. Error Logging
- [ ] Trigger a test error (if safe to do so)
- [ ] Check logs: `npx vercel logs --all`
- [ ] Verify error appears in logs with context

### 16. Rate Limiting (if applicable)
- [ ] Test rate limiting on API endpoints
- [ ] Verify appropriate 429 responses

---

## Performance & Security Verification

### 17. Performance
- [ ] Run Lighthouse audit (Chrome DevTools)
- [ ] Check Core Web Vitals:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

### 18. Security Headers
- [ ] Check security headers with https://securityheaders.com
- [ ] Verify HTTPS enforcement

### 19. Database Connection
- [ ] Monitor for connection errors in logs
- [ ] Check no connection pool exhaustion

---

## Cross-Browser & Device Testing

### 20. Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 21. Responsive Design
- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet viewport (768px)
- [ ] Test on desktop viewport (1440px)

---

## Integration Verification

### 22. Vercel Analytics (if enabled)
- [ ] Check analytics dashboard in Vercel
- [ ] Verify data is being collected

### 23. External Integrations
- [ ] Verify OpenAI API calls succeed
- [ ] Check Stripe webhook delivery
- [ ] Verify database operations complete

---

## Rollback Preparation (Before Full Launch)

### 24. Backup & Recovery
- [ ] Verify database backups are configured
- [ ] Know how to rollback deployment:
  ```bash
  # Via CLI
  npx vercel rollback
  
  # Via Dashboard
  # Project → Deployments → Select previous → Promote
  ```

### 25. Emergency Contacts
- [ ] Have Stripe support contact ready
- [ ] Know how to rotate API keys quickly
- [ ] Database admin access confirmed

---

## Post-Launch Monitoring (First 24 hours)

### 26. Monitor Key Metrics
- [ ] Error rates (should be < 0.1%)
- [ ] Response times (p95 < 500ms)
- [ ] Database connection health
- [ ] API success rates

### 27. User Feedback
- [ ] Monitor for user-reported issues
- [ ] Check support channels
- [ ] Review any error reports

### 28. Automated Alerts (if configured)
- [ ] Verify uptime monitoring alerts
- [ ] Check error rate alerting
- [ ] Confirm notification channels work

---

## Sign-Off Checklist

### Development Team
- [ ] All automated tests pass
- [ ] Manual testing complete
- [ ] No critical bugs outstanding
- [ ] Performance acceptable

### Product/Stakeholders
- [ ] Core features verified working
- [ ] Payment flow tested
- [ ] Documentation updated
- [ ] Support team briefed

---

## Quick Commands Reference

```bash
# Check deployment status
npx vercel ls

# View logs
npx vercel logs --all

# Check health endpoint
curl https://your-domain.com/api/health

# Check health with details
curl https://your-domain.com/api/health?detailed=true

# Rollback if needed
npx vercel rollback

# Redeploy
npx vercel --prod
```

---

## Emergency Contacts & Resources

- **Vercel Status**: https://www.vercel-status.com/
- **Stripe Status**: https://status.stripe.com/
- **OpenAI Status**: https://status.openai.com/
- **Vercel Support**: https://vercel.com/support
- **Stripe Support**: https://support.stripe.com/

---

## Troubleshooting Common Issues

### Health check shows "unhealthy"
1. Check environment variables: `npx vercel env ls`
2. Review logs: `npx vercel logs --all`
3. Verify database connection string
4. Check API key validity

### Authentication not working
1. Verify NEXTAUTH_SECRET is set
2. Check NEXT_PUBLIC_BASE_URL matches your domain
3. Ensure cookies are being set (check DevTools → Application → Cookies)
4. Verify NEXTAUTH_URL is set (if using older NextAuth version)

### Stripe payments failing
1. Verify STRIPE_SECRET_KEY is correct
2. Check if using test key in production (or vice versa)
3. Verify Stripe webhook secret (if webhooks configured)
4. Check Stripe Dashboard for error details

### OpenAI analysis not working
1. Verify OPENAI_API_KEY is valid
2. Check API rate limits in OpenAI Dashboard
3. Verify file size limits
4. Review logs for specific error messages

---

## Completion

**Deployment verified by:** _________________  
**Date:** _________________  
**Time:** _________________  

**Notes:**
