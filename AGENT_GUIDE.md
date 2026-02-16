# Agent Configuration Guide

## Model Assignments

### Coding Tasks (MiniMax M1)
Use for:
- Writing React/Next.js components
- Building API routes
- Database schema changes
- TypeScript type definitions
- Testing and debugging code

### Research Tasks (Deepseek)
Use for:
- Web research and competitive analysis
- Keyword research
- Industry research
- Content briefs and topic research
- Market analysis

### Content Writing (Kimi K2.5)
Use for:
- Blog articles
- Landing page copy
- Email sequences
- Social media content
- Product descriptions

### Strategy & Planning (Kimi K2.5 or Claude Opus)
Use for:
- High-level strategy
- Complex decision making
- Multi-step planning
- Architecture decisions

## When to Spawn Sub-agents

Spawn a sub-agent when:
1. Task takes >10 minutes
2. Task is parallelizable with other work
3. Task requires specialized focus (SEO, CRO, outreach)
4. You want work to continue while you handle other things

## Sub-agent Task Template

```
You are the [ROLE] for SafetyDatas.

## Assignment: [TASK NAME]

### Goal
[Clear, measurable outcome]

### Requirements
- [ ] Specific requirement 1
- [ ] Specific requirement 2

### Deliverables
1. [File path and description]
2. [File path and description]

### Success Criteria
- How we know it's done right

Report back when complete with summary and file locations.
```

## Cron Jobs (Automated)

| Job | Schedule | Purpose |
|-----|----------|---------|
| Morning Batch | 6 AM daily | Daily report, health checks |
| Evening Batch | 8 PM daily | Metrics, next-day prep |
| Content Production | 9 AM Mondays | Publish new content |
| Outreach Campaign | 10 AM Tuesdays | Research 25 new prospects |

## Memory Management

- Daily notes: memory/YYYY-MM-DD.md
- Long-term: MEMORY.md
- Mission tracking: MISSION_CONTROL.md
- Always commit changes after significant work

## Efficiency Rules

1. Batch similar tasks together
2. Use sub-agents for parallel work
3. Commit and push regularly
4. Document decisions in memory files
5. Send Telegram updates for completed milestones
