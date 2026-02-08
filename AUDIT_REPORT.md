# SafetyDatas.com — Full Technical Audit Report
**Date:** 2026-02-08  
**Auditor:** OpenClaw AI  

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 8 |
| 🟠 HIGH | 9 |
| 🟡 MEDIUM | 7 |
| 🟢 LOW | 6 |

---

## 🔴 CRITICAL (Blocks Launch)

### C1. Export API references non-existent Prisma fields — will crash at runtime
**File:** `app/api/user/export/route.ts` lines 26-29, 95-96, 107-110  
The Prisma `select` uses fields that don't exist in `schema.prisma`:
- `Document.fileName` → should be `originalName`
- `Document.fileSize` → should be `size`
- `Document.uploadedAt` → should be `uploadDate` or `createdAt`
- `Subscription.canceledAt` → doesn't exist in schema
- `Subscription.trialStart` → doesn't exist in schema
- `Account.createdAt` → doesn't exist in schema

**Impact:** `/api/user/export` will throw a Prisma validation error. Complete data export (GDPR feature) is broken.

### C2. rename-with-ai route uses old `lib/db.ts` (lowdb) instead of `lib/prisma-db.ts`
**File:** `app/api/rename-with-ai/route.ts` line 7  
```ts
import { getDocumentById, updateDocument } from '@/lib/db'
```
This imports from `lib/db.ts` which is a **lowdb/JSON file database** — completely separate from the Prisma/Postgres database. Documents created via the Prisma-backed upload flow will never be found by this route. The rename feature is **100% broken**.

### C3. No `.env.example` file — deployment will fail
No `.env.example` or `.env` file exists. Required env vars (found by grep):
- `DATABASE_URL` (not even referenced but required by Prisma — **missing from `schema.prisma` `datasource` block!**)
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_BASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_STARTER_PRICE_ID`
- `STRIPE_PROFESSIONAL_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID`
- `OPENAI_API_KEY`

**Critical sub-issue:** `prisma/schema.prisma` datasource block has NO `url` field:
```prisma
datasource db {
  provider = "postgresql"
}
```
This will fail `prisma generate` and `prisma migrate`. Needs `url = env("DATABASE_URL")`.

### C4. No Prisma migrations exist
**Dir:** `prisma/migrations/` does not exist.  
No migration history = no way to set up the database. First deploy will fail unless someone manually runs `prisma db push`.

### C5. Share API uses Vercel KV but no KV_REST_API_URL/KV_REST_API_TOKEN env vars
**Files:** `app/api/share/route.ts`, `app/api/share/[id]/route.ts`  
These use `@vercel/kv` which requires `KV_REST_API_URL` and `KV_REST_API_TOKEN`. These aren't referenced anywhere in config/docs. Share feature will crash at runtime.

### C6. `next: "16.0.0"` in package.json — this version doesn't exist
**File:** `package.json` line  
Next.js 16 does not exist as of Feb 2026. The latest stable is 15.x. This will fail `npm install` on a fresh clone. Should be `"next": "14.x.x"` or `"15.x.x"`.

### C7. File serving API has no auth — any uploaded PDF is publicly accessible
**File:** `app/api/files/[...path]/route.ts`  
No authentication check. Anyone who guesses/discovers a file path can download any user's uploaded PDFs. The path traversal check only prevents escaping `cwd()` but allows reading ANY file under the project root (including `lib/auth.ts`, `prisma/schema.prisma`, etc.).

**Security fix needed:** 
1. Add auth check
2. Restrict to `uploads/` directory only
3. Verify the requesting user owns the document

### C8. `analyze-pdf` API has no authentication
**File:** `app/api/analyze-pdf/route.ts`  
No session check. Anyone can POST PDFs and burn your OpenAI API credits. The middleware allows it (`isPdfAnalysis` bypass on line 31 of `middleware.ts`).

---

## 🟠 HIGH (Fix Before Launch)

### H1. `images: { unoptimized: true }` disables Next.js image optimization
**File:** `next.config.mjs` line 10  
All images served unoptimized. With 14+ large industry photos in `/public/images/`, this means multi-MB image downloads on landing pages. Critical for Core Web Vitals / SEO.

### H2. No `robots.txt` or `sitemap.xml`
**Dir:** `public/`  
Neither file exists. Essential for SEO and search engine indexing.

### H3. No Open Graph / social meta tags on any page
**Files:** `app/landing/page.tsx`, `app/pricing/page.tsx`, `app/about/page.tsx`, etc.  
No `og:title`, `og:description`, `og:image` metadata exports found on any page. Social sharing will show generic/blank previews.

### H4. Middleware double-auth logic conflict
**File:** `middleware.ts`  
The middleware uses `withAuth` (which requires auth by default) AND has a manual `authorized` callback that requires `!!token`. But the inner function allows public routes through `NextResponse.next()`. This means:
- The `authorized` callback rejects unauthenticated users BEFORE the inner function runs
- Public routes may redirect to login unnecessarily

The `authorized` callback should return `true` always (to let the inner function decide), or the public route logic should move to the `authorized` callback.

### H5. Rate limiter is in-memory only — useless in serverless/Vercel
**File:** `lib/rate-limit.ts`  
`setInterval` on line 68 and `Map` storage won't persist across serverless function invocations. Rate limiting is effectively disabled in production on Vercel. Use Vercel KV or Upstash Redis instead.

### H6. Upload writes to local filesystem — breaks on Vercel
**File:** `app/api/upload/route.ts` lines 80-85  
Files are saved to `uploads/` directory via `fs.writeFile`. Vercel has a read-only filesystem (except `/tmp`). All uploads will fail in production. Need to use cloud storage (S3, Vercel Blob, Cloudflare R2).

### H7. `eslint: { ignoreDuringBuilds: true }` and `typescript: { ignoreBuildErrors: true }`
**File:** `next.config.mjs` lines 3-8  
Build will succeed even with TypeScript errors and lint violations. The export route (C1) would be caught if TS checking was enabled. Remove these before launch.

### H8. Stripe API version mismatch
**Files:** `app/api/stripe/webhook/route.ts`, `create-checkout-session/route.ts`, `create-portal-session/route.ts`  
All use `apiVersion: '2024-11-20.acacia'`. With `stripe: "^20.0.0"`, verify this API version is compatible. The `^20` package may expect a newer API version format.

### H9. `NEXTAUTH_URL` not in env var list
Standard NextAuth deployment requires `NEXTAUTH_URL` env var. It's not referenced in code (auto-detected on Vercel) but needed for non-Vercel deployments and local dev.

---

## 🟡 MEDIUM (Fix Soon After Launch)

### M1. Dual database system — `lib/db.ts` (lowdb) still exists alongside `lib/prisma-db.ts`
**Files:** `lib/db.ts`, `lib/prisma-db.ts`  
`lib/db.ts` is a full lowdb implementation writing to `data/db.json`. It's still imported by `rename-with-ai`. This should be deleted entirely after migrating C2.

### M2. Prisma Client logging `['query']` in production
**File:** `lib/prisma.ts` line 10  
`log: ['query']` logs every SQL query. Fine for dev, noisy and potentially slow in production. Should be conditional on `NODE_ENV`.

### M3. No email verification flow
**File:** `app/api/auth/signup/route.ts`  
Users can sign up with any email — no verification step. The `emailVerified` field in schema is never populated. Risk of fake accounts and typo'd emails.

### M4. No password reset flow
No forgot-password or reset-password routes exist. Users who forget their password are locked out permanently.

### M5. Document deletion doesn't remove files from disk
**File:** `app/api/documents/[id]/route.ts`, `app/api/documents/route.ts`  
When documents are deleted, only the DB record is removed. The uploaded PDF files remain on disk/storage forever (orphaned files).

### M6. `eng.traineddata` and `nor.traineddata` (Tesseract) in project root — 30MB+ bloat
**Files:** `eng.traineddata`, `nor.traineddata`  
These OCR training data files are checked into the repo root. They inflate the deployment bundle significantly. Should be fetched at runtime or excluded from deployment.

### M7. `share/[id]/route.ts` uses old params pattern (not awaited)
**File:** `app/api/share/[id]/route.ts` line 7  
```ts
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
```
Next.js 15+ requires `params` to be a Promise (awaited). This may work in Next 14 but will break on upgrade. The documents/groups routes already use the `Promise<>` pattern correctly.

---

## 🟢 LOW (Nice to Have)

### L1. Landing page at `/landing` instead of `/`
**File:** `app/landing/page.tsx` vs `app/page.tsx`  
The main page (`/`) appears to be the authenticated dashboard. The marketing landing page is at `/landing`. Consider making `/` the landing page with a redirect to `/dashboard` for authenticated users.

### L2. Duplicate `globals.css`
**Files:** `app/globals.css`, `styles/globals.css`  
Two global CSS files exist. One may be unused.

### L3. `data/db.json` checked into repo
**File:** `data/db.json`  
If this contains any data, it's shipped to production. Should be in `.gitignore`.

### L4. `Geist` fonts imported but applied via generic `font-sans` class
**File:** `app/layout.tsx` lines 8-9  
Fonts are imported as `_geist` and `_geistMono` (underscored = unused). The body uses `className="font-sans"` which won't use the imported fonts. Need to apply `_geist.className` or set up CSS variables.

### L5. No loading states or error boundaries
No `loading.tsx`, `error.tsx`, or `not-found.tsx` files found in the app directory.

### L6. Console logging throughout API routes
Multiple `console.log` calls in production code (upload, groups, rename). Should use a structured logger or remove in production.

---

## Environment Variables — Complete Checklist

| Variable | Used In | Status |
|----------|---------|--------|
| `DATABASE_URL` | `prisma/schema.prisma` | ❌ **MISSING from schema** |
| `NEXTAUTH_SECRET` | `lib/auth.ts` | ⚠️ Referenced, no .env |
| `NEXTAUTH_URL` | NextAuth internal | ⚠️ Not referenced, needed for non-Vercel |
| `NEXT_PUBLIC_BASE_URL` | Stripe routes, share | ⚠️ Referenced, no .env |
| `STRIPE_SECRET_KEY` | 3 Stripe routes | ⚠️ Referenced, no .env |
| `STRIPE_WEBHOOK_SECRET` | webhook route | ⚠️ Referenced, no .env |
| `STRIPE_STARTER_PRICE_ID` | webhook route | ⚠️ Referenced, no .env |
| `STRIPE_PROFESSIONAL_PRICE_ID` | webhook route | ⚠️ Referenced, no .env |
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | pricing page (client) | ⚠️ Referenced, no .env |
| `NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID` | pricing page (client) | ⚠️ Referenced, no .env |
| `OPENAI_API_KEY` | analyze-pdf route | ⚠️ Referenced, no .env |
| `KV_REST_API_URL` | `@vercel/kv` (share) | ❌ **Not documented** |
| `KV_REST_API_TOKEN` | `@vercel/kv` (share) | ❌ **Not documented** |

---

## Top 5 Actions to Unblock Launch

1. **Fix `schema.prisma`** — add `url = env("DATABASE_URL")`, run initial migration
2. **Fix `next` version** in package.json to a real version (14.x or 15.x)
3. **Fix file storage** — switch from local filesystem to Vercel Blob/S3
4. **Add auth to `/api/files/` and `/api/analyze-pdf/`** — critical security holes
5. **Fix export route** — update field names to match actual Prisma schema
6. **Create `.env.example`** with all 13 required variables documented
