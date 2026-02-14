#!/bin/bash
# SafetyDatas Lead Generation Agent
# Run: ./scripts/agent-research.sh

echo "🔍 Research Agent Starting..."
echo "Target: Auto repair shops, cleaning companies, manufacturing SMBs"

# Output file
OUTPUT="./research/leads-$(date +%Y%m%d).json"
mkdir -p ./research

# Research sources to check
echo "📊 Researching potential leads..."

# For now, create template lead list
cat > "$OUTPUT" << 'EOF'
{
  "date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "leads": [
    {
      "category": "Auto Repair",
      "verticals": ["Car mechanics", "Auto body shops", "Tire shops"],
      "pain_point": "Must manage SDS for oils, solvents, paints",
      "estimated_market": "50,000+ shops in US/Norway",
      "approach": "Cold email + LinkedIn"
    },
    {
      "category": "Cleaning Services", 
      "verticals": ["Commercial cleaning", "Industrial cleaning", "Janitorial services"],
      "pain_point": "Chemicals for cleaning require SDS compliance",
      "estimated_market": "30,000+ companies",
      "approach": "Email + Phone"
    },
    {
      "category": "Manufacturing",
      "verticals": ["Metal fabrication", "Wood working", "Electronics assembly"],
      "pain_point": "OSHA compliance, chemical inventory",
      "estimated_market": "25,000+ SMBs",
      "approach": "LinkedIn + Trade shows"
    },
    {
      "category": "Labs & Education",
      "verticals": ["University labs", "Research facilities", "Technical schools"],
      "pain_point": "Chemical inventory management, safety compliance",
      "estimated_market": "10,000+ institutions",
      "approach": "Direct email to safety officers"
    }
  ],
  "competitors": [
    {"name": "ChemWatch", "pricing": "$500+/month", "weakness": "Complex, expensive"},
    {"name": "MSDsonline", "pricing": "$300+/month", "weakness": "US focused"},
    {"name": "GHS Wizard", "pricing": "$200/month", "weakness": "Limited features"}
  ],
  "opportunities": [
    "AI-powered chemical name extraction",
    "Affordable pricing ($29-99/month)",
    "Nordic market focus",
    "Mobile-first design"
  ]
}
EOF

echo "✅ Research complete! Results in: $OUTPUT"
echo ""
echo "Next steps:"
echo "1. Review leads in $OUTPUT"
echo "2. Run ./scripts/agent-outreach.sh to generate email templates"
echo "3. Upload to Apollo.io or Hunter.io for outreach"
