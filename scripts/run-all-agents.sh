#!/bin/bash
# SafetyDatas Master Agent Runner
# Runs all marketing agents in sequence

echo "🚀 SAFETYDATAS MARKETING AGENT SYSTEM"
echo "======================================"
echo ""

# Run Research Agent
echo "🔍 Step 1: Running Research Agent..."
./scripts/agent-research.sh
echo ""

# Run Outreach Agent
echo "✍️  Step 2: Running Outreach Agent..."
./scripts/agent-outreach.sh
echo ""

# Run Content Agent
echo "📝 Step 3: Running Content Agent..."
./scripts/agent-content.sh
echo ""

echo "======================================"
echo "✅ ALL AGENTS COMPLETE!"
echo ""
echo "Output files:"
echo "  📊 ./research/leads-*.json"
echo "  📧 ./outreach/email-templates.txt"
echo "  📝 ./content/blog/*.md"
echo ""
echo "Next: Review outputs and execute marketing plan!"
