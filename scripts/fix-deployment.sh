#!/bin/bash

# Fix Cloudflare Pages custom domain setup
# Run this when DNS is green but you see DEPLOYMENT_NOT_FOUND

echo "=== Fixing Cloudflare Pages Deployment ==="

cd /Users/bono/.openclaw/workspace/v0-safetydatas

echo "1. Adding custom domain to project..."
wrangler pages domain add safetydatas.com --project-name=safetydatas 2>&1 || echo "Domain may already be added"

echo ""
echo "2. Checking domain status..."
wrangler pages domain list --project-name=safetydatas 2>&1

echo ""
echo "3. Rebuilding and redeploying..."
npm run build 2>&1 | tail -20

echo ""
echo "4. Deploying to production..."
wrangler pages deploy .next --project-name=safetydatas --branch=main 2>&1

echo ""
echo "=== Done ==="
echo "Wait 2-3 minutes, then test: https://safetydatas.com"
