#!/bin/bash
# SafetyDatas Outreach Agent
# Generates cold email templates and LinkedIn posts

echo "✍️  Outreach Agent Starting..."

mkdir -p ./outreach

# Generate email templates
cat > ./outreach/email-templates.txt << 'EOF'
=== EMAIL TEMPLATE 1: Auto Repair Shops ===
Subject: Managing your shop's safety data sheets?

Hi {{first_name}},

I noticed {{company_name}} is a busy auto repair shop. Quick question:

How do you currently manage safety data sheets for all the oils, solvents, and chemicals you use daily?

Most shops I talk to either:
• Have a messy binder that nobody updates
• Waste hours searching for the right SDS
• Worry about compliance inspections

We built SafetyDatas to fix this - simple $29/month tool that:
✓ Auto-organizes all your SDS by chemical name
✓ Instant search - find any sheet in seconds
✓ QR codes for each chemical ( inspectors love this )

Worth a 10-minute chat this week?

Best,
Andy
SafetyDatas.com

P.S. Setup takes 5 minutes. We even auto-extract chemical names from your PDFs.

=== EMAIL TEMPLATE 2: Cleaning Companies ===
Subject: SDS compliance for {{company_name}}

Hi {{first_name}},

Running a cleaning business means juggling dozens of chemicals - degreasers, disinfectants, floor cleaners...

Are your safety data sheets organized and easily accessible for your team?

SafetyDatas helps cleaning companies:
• Upload all SDS in one place
• Auto-extract chemical names using AI
• Generate compliance reports instantly
• Share with staff via mobile-friendly links

Only $29/month for up to 5 team members.

Interested in seeing how it works?

Andy
SafetyDatas.com

=== EMAIL TEMPLATE 3: Manufacturing ===
Subject: Quick question about chemical inventory at {{company_name}}

Hi {{first_name}},

I work with small manufacturers like {{company_name}} on chemical safety compliance.

Quick question: What's your current process for managing SDS and chemical inventory?

Many SMBs I talk to are stuck with:
• Spreadsheets that get outdated
• Expensive enterprise software they don't need
• Compliance stress before inspections

We built a lightweight alternative:
→ $49/month for manufacturing
→ Unlimited chemicals
→ Auto-generated inventory reports
→ Nordic/EU compliance built-in

Worth a brief call to see if it's a fit?

Andy
SafetyDatas.com

=== LINKEDIN POST TEMPLATES ===

POST 1:
Just helped an auto repair shop organize 200+ safety data sheets in under 30 minutes.

Their old system? A binder that hadn't been updated since 2019.

New system? Search any chemical in 2 seconds, QR codes for inspectors, mobile access for mechanics.

Cost: Less than their monthly coffee budget.

If you manage chemicals in your business, DM me "SDS" and I'll show you the setup.

#ChemicalSafety #SmallBusiness #Compliance

POST 2:
Hot take: Most small businesses waste hours on safety compliance because they're using the wrong tools.

Enterprise SDS software: $500+/month, requires training, overkill for SMBs

What they actually need: $29/month, works in 5 minutes, mobile-friendly

Built SafetyDatas after watching a friend spend a full day preparing for a compliance inspection.

Sometimes the best solution is the simple one.

#Entrepreneurship #SafetyFirst #SMB

POST 3:
Norwegian small businesses: Are you ready for the new chemical inventory requirements?

New regulations mean you need:
✓ Digital SDS access for all employees
✓ Updated chemical inventories
✓ Risk assessments documented

We built SafetyDatas specifically for Nordic SMBs who need compliance without enterprise complexity.

$29/month. 5-minute setup. Norwegian support.

Comment "INVENTORY" and I'll send you a free compliance checklist.

#Norway #RegulatoryCompliance #ChemicalSafety
EOF

echo "✅ Outreach templates generated!"
echo ""
echo "Files created:"
echo "  - ./outreach/email-templates.txt"
echo ""
echo "Next steps:"
echo "1. Customize templates with your name/company"
echo "2. Upload to Apollo.io, Hunter.io, or Instantly"
echo "3. Set up automated sequences"
echo "4. Track responses and adjust"
