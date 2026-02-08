# SafetyDatas.com — SEO & Content Audit

**Date:** 2026-02-08  
**Status:** Pre-launch (Vercel deployment, no custom domain yet)

---

## 1. Current SEO State

### Meta Tags (app/layout.tsx)
- ✅ `title`: "SafetyData - Chemical Safety Data Sheet Manager"
- ✅ `description`: "Modern chemical safety data sheet management with AI-powered organization"
- ✅ `generator`: "SafetyData.com"
- ✅ Icons (favicon, apple-icon, SVG icon)
- ❌ **No Open Graph tags** (og:title, og:description, og:image, og:url)
- ❌ **No Twitter Card tags** (twitter:card, twitter:title, twitter:image)
- ❌ **No canonical URL**
- ❌ **No site-wide keywords meta** (less important but still useful)
- ⚠️ `lang="en"` hardcoded — no Norwegian support

### Missing Files
- ❌ **No sitemap.xml** (or app/sitemap.ts)
- ❌ **No robots.txt** (or app/robots.ts)
- ❌ **No manifest.json**

### Page-Level Metadata
- ❌ **Zero pages export their own metadata** — every page uses the global layout.tsx metadata
- All public pages (landing, about, pricing, faq, contact, privacy, terms) share the same title/description
- This means Google sees identical meta for every page

### Pages Inventory (public/crawlable)
| Page | Has unique metadata? | SEO value |
|------|---------------------|-----------|
| /landing | ❌ No | HIGH — main landing page |
| /about | ❌ No | MEDIUM |
| /pricing | ❌ No | HIGH — pricing intent |
| /faq | ❌ No | HIGH — long-tail keywords |
| /contact | ❌ No | LOW |
| /privacy | ❌ No | LOW |
| /terms | ❌ No | LOW |
| /documentation | ❌ No | MEDIUM |
| / (dashboard) | N/A | Behind auth — should be noindex |
| /login, /signup | N/A | Should be noindex |

### Critical Issues
1. **Landing page is at /landing, not /** — The root `/` is the authenticated dashboard. Google will index `/` as a loading spinner or redirect. The landing page should BE the root for unauthenticated users.
2. **"use client" on landing-page.tsx** — The entire landing page is a client component, meaning it renders nothing for crawlers without JS. This is a **major SEO problem**.
3. **No structured data** (JSON-LD) on any page.

---

## 2. Keyword Research

### English Keywords (Global)
| Keyword | Intent | Est. Volume | Difficulty |
|---------|--------|-------------|------------|
| safety data sheet management | Commercial | High | Medium |
| SDS management software | Commercial | Medium | Medium |
| SDS management system | Commercial | Medium | Medium |
| safety data sheet organizer | Commercial | Low-Med | Low |
| chemical safety data sheet software | Commercial | Medium | Medium |
| SDS database software | Commercial | Low-Med | Medium |
| how to organize safety data sheets | Informational | Medium | Low |
| SDS compliance software | Commercial | Medium | High |
| digital safety data sheets | Commercial | Low-Med | Low |
| safety data sheet storage | Commercial | Low | Low |
| SDS QR code | Commercial/Info | Low | Low |
| MSDS management system | Commercial | Medium | Medium |
| GHS SDS management | Commercial | Low | Medium |

### Norwegian Keywords (Primary Market)
| Keyword | Intent | Est. Volume | Difficulty |
|---------|--------|-------------|------------|
| sikkerhetsdatablad program | Commercial | Medium | Low |
| HMS datablad system | Commercial | Medium | Low |
| datablad organisering | Commercial | Low | Very Low |
| sikkerhetsdatablad håndtering | Commercial | Low-Med | Low |
| digital stoffkartotek | Commercial | Medium | Low |
| stoffkartotek programvare | Commercial | Medium | Low |
| SDS håndtering norsk | Commercial | Low | Very Low |
| kjemikalieregister system | Commercial | Medium | Low |
| HMS kjemikalier programvare | Commercial | Low-Med | Low |

### High-Intent Long-Tail (Both Languages)
- "best SDS management software for small business"
- "free safety data sheet organizer"
- "how to create SDS binder"
- "billig stoffkartotek løsning"
- "sikkerhetsdatablad krav arbeidstilsynet"
- "SDS management for auto repair shops"
- "safety data sheet requirements [country]"

---

## 3. Content Gaps & Programmatic SEO Opportunities

### Missing High-Value Pages
1. **`/` should serve landing page** to unauthenticated visitors (critical)
2. **`/industries/[industry]`** — Dedicated pages for each vertical:
   - /industries/automotive-workshops
   - /industries/manufacturing
   - /industries/cleaning-services
   - /industries/construction
   - /industries/laboratories
   - /industries/woodworking
   - /industries/paint-coating
3. **`/features`** — Dedicated features page (currently buried in landing)
4. **`/blog`** — No blog exists at all

### Blog Posts (Priority Order)
1. "What is a Safety Data Sheet? Complete Guide [2026]"
2. "How to Organize Safety Data Sheets at Work"
3. "SDS vs MSDS: What's the Difference?"
4. "Safety Data Sheet Requirements by Country" (Norway, EU, US)
5. "How to Create a Chemical Binder Index"
6. "GHS Hazard Pictograms Explained"
7. "Digital vs Paper Safety Data Sheets: Pros and Cons"
8. "Sikkerhetsdatablad: Komplett guide for norske bedrifter" (Norwegian)
9. "Stoffkartotek krav i Norge — hva sier loven?"
10. "QR Codes for Safety Data Sheets: Why It Works"
11. "SDS Management for Small Workshops"
12. "Chemical Safety Compliance Checklist"

### Programmatic SEO (Scale Play)
- **`/chemicals/[chemical-name]`** — Individual pages for common chemicals (acetone, isopropanol, etc.) with:
  - Chemical name, CAS number, GHS classification
  - Hazard pictograms
  - Brief safety summary
  - CTA: "Manage this SDS in SafetyDatas"
  - This alone could generate hundreds of pages targeting "[chemical name] safety data sheet"
- **`/regulations/[country]`** — SDS requirements per country
- **`/glossary/[term]`** — Chemical safety glossary

### Norwegian Content (Huge Opportunity — Low Competition)
- Dedicated `/no/` section or Norwegian landing page
- Blog content in Norwegian targeting "stoffkartotek", "sikkerhetsdatablad", "HMS datablad"
- Norwegian regulatory content (Arbeidstilsynet requirements)

---

## 4. Technical SEO Checklist

### 🔴 Critical (Do Before Launch)
- [ ] **Make landing page the root URL** for unauthenticated users
- [ ] **Convert landing page to Server Component** (or use static rendering) — currently "use client" means zero SSR content for crawlers
- [ ] **Add sitemap.ts** (Next.js 14 native):
  ```ts
  // app/sitemap.ts
  export default function sitemap() {
    return [
      { url: 'https://safetydatas.com', lastModified: new Date() },
      { url: 'https://safetydatas.com/about', lastModified: new Date() },
      { url: 'https://safetydatas.com/pricing', lastModified: new Date() },
      { url: 'https://safetydatas.com/faq', lastModified: new Date() },
      // ...etc
    ]
  }
  ```
- [ ] **Add robots.ts**:
  ```ts
  // app/robots.ts
  export default function robots() {
    return {
      rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/dashboard'] },
      sitemap: 'https://safetydatas.com/sitemap.xml',
    }
  }
  ```
- [ ] **Add unique metadata to every public page** (title, description, OG tags)
- [ ] **Add Open Graph image** (1200x630px) — create a branded OG image
- [ ] **Set canonical URLs** on all pages

### 🟡 Important (First 30 Days)
- [ ] **Add JSON-LD structured data**:
  - `SoftwareApplication` schema on landing/pricing
  - `Organization` schema site-wide
  - `FAQPage` schema on /faq
  - `BreadcrumbList` on all pages
- [ ] **Add hreflang tags** if serving Norwegian content (en/no)
- [ ] **Ensure pricing page is a Server Component** (currently "use client")
- [ ] **Add alt text to all images** (landing page industry images)
- [ ] **Internal linking strategy** — footer should link to all key pages
- [ ] **Page speed optimization** — audit with Lighthouse (Next.js Image component usage, etc.)

### 🟢 Nice to Have (Days 30-90)
- [ ] **Blog infrastructure** (MDX or CMS integration)
- [ ] **Analytics setup** — Google Search Console, GA4 (Vercel Analytics already present)
- [ ] **Schema markup for reviews/testimonials** when available
- [ ] **XML sitemap for programmatic pages** (chemicals, industries)
- [ ] **Implement i18n** for Norwegian market (next-intl or similar)

---

## 5. Competitor Analysis

### Main Competitors in SDS Management SaaS

| Competitor | Focus | SEO Strength | Pricing |
|-----------|-------|-------------|---------|
| **SDS Manager (sdsmanager.com)** | Enterprise SDS management | Strong — lots of content, blog | Enterprise |
| **Chemwatch** | Global chemical management | Very strong — massive chemical database as SEO moat | Enterprise |
| **VelocityEHS (MSDSonline)** | EHS compliance platform | Very strong — established brand, huge content library | Enterprise |
| **SafeTec (safetec.no)** | Norwegian market — stoffkartotek | Strong in Norway — Norwegian content | Mid-market |
| **EcoOnline** | Nordic EHS/chemical management | Strong — Nordic focus, Norwegian content | Mid-market |
| **Chemical Safety (chemicalsafety.com)** | SDS authoring & management | Moderate | Enterprise |
| **Sphera** | Broad EHS platform | Very strong — enterprise SEO | Enterprise |

### What Competitors Do Well
1. **Chemical database pages** — Chemwatch and VelocityEHS have thousands of indexed chemical pages
2. **Regulatory content** — Country-specific compliance guides
3. **Industry pages** — Dedicated landing pages per vertical
4. **Glossary/resource hubs** — "What is an SDS?" type content ranks well
5. **Norwegian content** — EcoOnline and SafeTec own the Norwegian search space

### SafetyDatas' SEO Opportunity
- **Most competitors are enterprise-priced** ($500+/mo). SafetyDatas at $15-45/mo targets an underserved SMB market
- **"Simple SDS management"** — competitors are complex platforms. Position as the easy alternative
- **Norwegian SMB market** — SafeTec and EcoOnline target mid-market. Small workshops (bilverksted, renholdsfirma) are underserved
- **Programmatic chemical pages** can compete even with the big players for long-tail "[chemical] safety data sheet" queries

---

## 6. Launch SEO Plan — 90 Days

### Pre-Launch (Before Go-Live)
**Week 0 — Fix Critical Issues**
- [ ] Landing page at root URL for unauthenticated visitors
- [ ] Convert landing page to Server Component (SSR)
- [ ] Add unique metadata to all public pages
- [ ] Add sitemap.ts and robots.ts
- [ ] Create OG image (1200x630) with brand/product screenshot
- [ ] Add OG/Twitter meta tags site-wide
- [ ] Connect custom domain (safetydatas.com)
- [ ] Set up Google Search Console + submit sitemap
- [ ] Set up Google Analytics 4

### Days 1-30: Foundation
**Technical**
- [ ] Add JSON-LD structured data (SoftwareApplication, Organization, FAQPage)
- [ ] Audit all pages with Lighthouse — fix any issues
- [ ] Ensure all images have alt text
- [ ] Add canonical URLs

**Content**
- [ ] Publish 4 blog posts:
  1. "What is a Safety Data Sheet? Complete Guide"
  2. "How to Organize Safety Data Sheets at Work"
  3. "SDS vs MSDS: What's the Difference?"
  4. "Sikkerhetsdatablad: Komplett guide for norske bedrifter"
- [ ] Create 3 industry pages (/industries/automotive, /manufacturing, /cleaning)
- [ ] Create /features page (extract from landing page, add more detail)

**Off-Page**
- [ ] Submit to SaaS directories (G2, Capterra, Product Hunt)
- [ ] List on Norwegian business directories (Gule Sider, Proff.no)
- [ ] Set up Google Business Profile if applicable

### Days 30-60: Content Velocity
**Content**
- [ ] Publish 4 more blog posts (mix of English and Norwegian)
- [ ] Create 3 more industry pages
- [ ] Start programmatic chemical pages — seed with top 50 most common workplace chemicals
- [ ] Create /regulations/norway and /regulations/eu pages
- [ ] Add Norwegian landing page (/no or hreflang setup)

**Link Building**
- [ ] Guest post on 2-3 EHS/safety blogs
- [ ] Reach out to Norwegian industry associations (NHO, etc.)
- [ ] Create a free tool/resource (e.g., "SDS Compliance Checker" or "Free Chemical Label Generator")

**Optimization**
- [ ] Review Search Console data — identify quick-win keywords
- [ ] Optimize pages ranking positions 5-20
- [ ] A/B test meta titles on key pages

### Days 60-90: Scale
**Content**
- [ ] Expand chemical database to 200+ pages
- [ ] Publish comparison pages: "SafetyDatas vs [Competitor]"
- [ ] Create video content (product demos, tutorials)
- [ ] Publish case studies (even if anonymized)
- [ ] Add glossary section (/glossary/[term])

**Technical**
- [ ] Implement full i18n (Norwegian site section)
- [ ] Add review/rating schema when testimonials exist
- [ ] Optimize Core Web Vitals based on real user data

**Tracking & Iteration**
- [ ] Monthly SEO report (organic traffic, keyword rankings, indexed pages)
- [ ] Identify top-performing content → create more like it
- [ ] Identify underperforming content → optimize or consolidate

---

## Priority Matrix

| Action | Impact | Effort | Priority |
|--------|--------|--------|----------|
| Fix root URL / SSR landing page | 🔴 Critical | Medium | **#1** |
| Add sitemap + robots | 🔴 Critical | Low | **#2** |
| Unique page metadata + OG tags | 🔴 Critical | Low | **#3** |
| Google Search Console setup | 🔴 Critical | Low | **#4** |
| JSON-LD structured data | 🟡 High | Low | **#5** |
| First 4 blog posts | 🟡 High | Medium | **#6** |
| Industry landing pages | 🟡 High | Medium | **#7** |
| Norwegian content | 🟡 High | Medium | **#8** |
| Programmatic chemical pages | 🟢 High (long-term) | High | **#9** |
| Directory listings | 🟢 Medium | Low | **#10** |

---

## Quick Wins You Can Do Today

1. **Add `app/sitemap.ts`** — 5 minutes, instant crawlability improvement
2. **Add `app/robots.ts`** — 2 minutes
3. **Add metadata exports to each page.tsx** — 30 minutes
4. **Create an OG image** — Use a tool like og-image.vercel.app
5. **Redirect unauthenticated `/` to `/landing`** (interim fix) or better: serve landing at `/`
