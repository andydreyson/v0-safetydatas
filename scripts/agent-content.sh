#!/bin/bash
# SafetyDatas Content Agent
# Generates blog posts and SEO content

echo "📝 Content Agent Starting..."

mkdir -p ./content/blog

# Generate blog posts
cat > ./content/blog/01-what-is-sds.md << 'EOF'
---
title: "What is a Safety Data Sheet (SDS)? Complete Guide for Small Businesses"
date: "2024-02-14"
keywords: ["SDS", "safety data sheet", "MSDS", "chemical safety"]
---

# What is a Safety Data Sheet (SDS)?

A Safety Data Sheet (SDS), previously called Material Safety Data Sheet (MSDS), is a document that provides detailed information about hazardous substances and chemicals.

## Why SDS Matters for Your Business

If your business uses any chemicals - whether you're a:
- Auto repair shop (oils, solvents, paints)
- Cleaning company (detergents, disinfectants)
- Manufacturing business (industrial chemicals)
- Lab or research facility

You are legally required to:
1. Maintain up-to-date SDS for all chemicals
2. Make them accessible to all employees
3. Train staff on chemical hazards

## What's in an SDS?

Each SDS contains 16 standardized sections:

1. **Identification** - Product name, manufacturer
2. **Hazard identification** - Warning symbols, risk phrases
3. **Composition** - Chemical ingredients
4. **First-aid measures** - What to do if exposed
5. **Fire-fighting measures** - How to extinguish fires
6. **Accidental release** - Spill cleanup procedures
7. **Handling and storage** - Safe usage guidelines
8. **Exposure controls** - PPE requirements
9. **Physical properties** - Appearance, odor, pH
10. **Stability and reactivity** - Incompatible materials
11. **Toxicological information** - Health effects
12. **Ecological information** - Environmental impact
13. **Disposal considerations** - Safe disposal
14. **Transport information** - Shipping classifications
15. **Regulatory information** - Legal requirements
16. **Other information** - Revision dates, disclaimers

## Digital vs. Paper SDS

**Paper binders:**
- ❌ Get outdated quickly
- ❌ Hard to search
- ❌ Can be damaged/lost
- ❌ Not accessible remotely

**Digital SDS management:**
- ✅ Always up-to-date
- ✅ Instant search
- ✅ Cloud backup
- ✅ Mobile access
- ✅ Compliance reporting

## Getting Started

1. Collect all chemical containers in your workplace
2. Request SDS from suppliers (they're legally required to provide them)
3. Upload to a digital management system
4. Train employees on access and use
5. Review and update annually

[Try SafetyDatas free for 14 days →]

---

*SafetyDatas helps small businesses organize and manage safety data sheets with AI-powered tools. Starting at $29/month.*
EOF

cat > ./content/blog/02-sds-compliance-norway.md << 'EOF'
---
title: "SDS Compliance Requirements for Norwegian Businesses (2024)"
date: "2024-02-14"
keywords: ["Norway", "SDS compliance", "chemical safety", "Arbeidstilsynet"]
---

# SDS Compliance in Norway: What Small Businesses Must Know

Norwegian businesses handling chemicals must comply with both EU regulations and specific Norwegian requirements under the supervision of Arbeidstilsynet (Norwegian Labour Inspection Authority).

## Legal Requirements

### For Employers (Arbeidsmiljøloven)
- Maintain accessible SDS for all hazardous chemicals
- Ensure employees can access SDS during all work hours
- Update SDS when new chemicals are introduced
- Train employees on chemical hazards and safety measures

### Chemical Inventory (Stoffkartotek)
Norwegian businesses must maintain a chemical inventory (stoffkartotek) including:
- All hazardous substances present
- Quantities stored
- Location information
- Risk assessments

## Digital SDS Solutions

Modern digital tools help Norwegian SMBs:
- Meet Arbeidstilsynet requirements
- Generate compliant stoffkartotek
- Access Nordic-language SDS
- Get mobile access for field workers

## Penalties for Non-Compliance

Failure to maintain proper SDS can result in:
- Fines from Arbeidstilsynet
- Work stoppage orders
- Liability in case of accidents

## Simplifying Compliance

SafetyDatas offers Norwegian small businesses:
- ✅ Norwegian language support
- ✅ EU/Norwegian compliance features
- ✅ Stoffkartotek generation
- ✅ Mobile-first design

[Learn more about Norwegian compliance →]
EOF

echo "✅ Content generated!"
echo ""
echo "Blog posts created:"
ls -la ./content/blog/
echo ""
echo "Next steps:"
echo "1. Publish to safetydatas.com/blog"
echo "2. Share on LinkedIn with snippets"
echo "3. Create email newsletter series"
echo "4. Submit to industry publications"
