#!/bin/bash

# Update Cloudflare Pages environment variables for safetydatas.com
# Run this script after DNS propagates

echo "Updating Cloudflare Pages environment variables..."

cd /Users/bono/.openclaw/workspace/v0-safetydatas

# Update DATABASE_URL
echo "Setting DATABASE_URL..."
echo "postgresql://neondb_owner:npg_wop3N8QYmZfx@ep-mute-lake-ag1i7wqd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require" | wrangler pages secret put DATABASE_URL --project-name=safetydatas

# Update NEXTAUTH_URL for custom domain
echo "Setting NEXTAUTH_URL..."
echo "https://safetydatas.com" | wrangler pages secret put NEXTAUTH_URL --project-name=safetydatas

# Update NEXT_PUBLIC_APP_URL for custom domain
echo "Setting NEXT_PUBLIC_APP_URL..."
echo "https://safetydatas.com" | wrangler pages secret put NEXT_PUBLIC_APP_URL --project-name=safetydatas

echo "Done! Trigger a new deployment to apply changes."
