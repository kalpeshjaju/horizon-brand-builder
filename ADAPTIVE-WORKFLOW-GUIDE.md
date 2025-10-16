# Adaptive Workflow System - Quick Start Guide

> **The intelligent brand strategy workflow that skips human tasks gracefully and adapts when real data arrives**

---

## 🎯 What Is This?

The Adaptive Workflow System is a **task-based brand strategy engine** that:

✅ **Runs autonomously** - AI completes all tasks it can
✅ **Skips human tasks gracefully** - Uses placeholders, never blocks progress
✅ **Adapts automatically** - Regenerates outputs when human input arrives
✅ **Tracks quality** - Shows exactly how complete/accurate your reports are
✅ **Versions everything** - Full history of what changed and when

---

## 🚀 Quick Start

### 1. Validate Task Dependencies

Before running, validate that all task dependencies are correctly configured:

```bash
npm run workflow:validate
```

**Output:**
```
🔍 Validating task dependencies...

✅ All dependencies are valid!

📊 Statistics:
   Total tasks:          40
   Max parallelism:      8 tasks
   Critical path length: 12 iterations
   Avg dependencies:     2.3
```

### 2. Start a Workflow

```bash
npm run workflow:start -- --brand="Flyberry"
```

**What happens:**

```
🚀 Starting Adaptive Workflow

Brand: Flyberry
Total tasks: 40
Max parallelism: 8

📊 Phase 1: Autonomous Execution

🔄 Iteration 1: 8 tasks ready

▶️  Running: Project Setup
   ✅ Completed in 0.2s
▶️  Running: Competitive Analysis
   ✅ Completed in 0.3s
⏭️  Skipping: Stakeholder Interviews (human required, using placeholder)
▶️  Running: Brand Asset Collection
   ✅ Completed in 0.1s
...

📄 Report v1.0 generated
   Quality: 72.5%

⚠️  Some sections use placeholders or inference
   Upload real data to improve quality:

   → Stakeholder Interviews
      Upload to: output/flyberry/inputs/stakeholder-interviews.txt

   → Customer Interviews
      Upload to: output/flyberry/inputs/customer-interviews.txt

👀 Watching for human inputs...
   Directory: output/flyberry/inputs
   (Upload files to auto-trigger regeneration)
```

The workflow will:
- Complete all AI tasks immediately
- Skip human-required tasks (using placeholders)
- Generate an initial report (v1.0)
- Watch for human input files

---

### 3. Check Status

```bash
npm run workflow:status -- --brand="Flyberry"
```

**Output:**

```
═══════════════════════════════════════════════════════════════
  WORKFLOW STATUS: FLYBERRY
═══════════════════════════════════════════════════════════════

Overall Status: ▶️ RUNNING
Quality Score:  ███████████████░░░░░ 72.5%
Started:        10/11/2025, 2:30:00 PM
Last Updated:   10/11/2025, 2:32:15 PM

📊 Progress:
   Total Tasks:    40
   ✅ Completed:   28
   ⏭️  Skipped:     5
   ⏸️  Paused:      7

📈 Data Quality:
   Real Data:      28
   Placeholders:   5

📋 Quality Breakdown:
   ✅ Competitive Analysis               ██████████ 100%
   ✅ Brand Asset Collection             ██████████ 100%
   ⏭️  Stakeholder Interviews            █████░░░░░  50%
   ✅ Positioning Map                    ██████████ 100%
   ...

💡 Top Recommendations:
   1. 🔴 Upload real data for: Stakeholder Interviews
      Expected improvement: +15.2%
   2. 🔴 Upload real data for: Customer Interviews
      Expected improvement: +12.8%
   3. 🟡 Upload real data for: Mystery Shopping
      Expected improvement: +3.5%

═══════════════════════════════════════════════════════════════
```

---

### 4. Add Human Input

When human input is ready, simply upload it:

```bash
# Example: Stakeholder interviews complete
cp ~/interviews/ceo-interview.txt output/flyberry/inputs/stakeholder-interviews.txt
```

**Auto-regeneration happens immediately:**

```
✨ New input detected: stakeholder-interviews.txt
📥 Processing: Stakeholder Interviews

✅ Stakeholder Interviews updated (placeholder → real data)

🔄 Regenerating 4 affected outputs...

   🔄 Regenerating: Stakeholder Synthesis
   ✅ Stakeholder Synthesis updated (v1 → v2)
   🔄 Regenerating: Brand Audit Report
   ✅ Brand Audit Report updated (v1 → v2)
   🔄 Regenerating: Positioning Options
   ✅ Positioning Options updated (v1 → v2)
   🔄 Regenerating: Brand Framework
   ✅ Brand Framework updated (v1 → v2)

📄 Report v2.0 generated
   Quality: 87.8% (+15.3%)
   Updated sections: 8

📊 Changes from v1.0 to v2.0:
   ✏️  Section 2.1: Stakeholder Insights
       Before: [Generic placeholder based on industry norms]
       After: [Real insights from CEO interview revealing...]
       Impact: High - Changed strategic direction

⚠️  Still need 2 more inputs for 95% quality
   → Customer Interviews
   → Mystery Shopping
```

---

### 5. View Version History

```bash
npm run workflow:history -- --brand="Flyberry"
```

**Output:**

```
═══════════════════════════════════════════════════════════════
  VERSION HISTORY: FLYBERRY
═══════════════════════════════════════════════════════════════

→ v3.0 (current)
   Date:    10/11/2025, 3:45:22 PM
   Quality: 98.2%
   Trigger: Human input: Customer Interviews
   Changes: 12 sections updated

  v2.0
   Date:    10/11/2025, 2:50:10 PM
   Quality: 87.8%
   Trigger: Human input: Stakeholder Interviews
   Changes: 8 sections updated

  v1.0
   Date:    10/11/2025, 2:32:15 PM
   Quality: 72.5%
   Trigger: Initial generation
   Changes: Initial draft (5 placeholders, 2 inference)

═══════════════════════════════════════════════════════════════
```

---

## 📁 Output Structure

```
output/flyberry/
├── .workflow/
│   ├── state.json              # Current workflow state
│   ├── versions.json           # Version history
│   └── human-inputs.json       # Input event log
│
├── inputs/                     # Upload human inputs here
│   ├── stakeholder-interviews.txt
│   ├── customer-interviews.txt
│   └── client-workshop-decision.txt
│
├── reports/
│   ├── brand-strategy-v1.0.md
│   ├── brand-strategy-v2.0.md
│   └── brand-strategy-v3.0.md (current)
│
└── deliverables/
    ├── positioning-maps/
    ├── personas/
    └── brand-framework/
```

---

## 📊 Task System

### View All Tasks

```bash
npm run workflow:tasks
```

### View Tasks by Category

```bash
npm run workflow:tasks -- --category=research
npm run workflow:tasks -- --category=strategy
npm run workflow:tasks -- --category=synthesis
```

### View Only Human-Required Tasks

```bash
npm run workflow:tasks -- --human-only
```

---

## 🎯 40+ Tasks Mapped to Your Workflow

The system includes 40+ tasks organized into 8 stages:

### Stage 1: Project Setup (3 tasks)
- Project infrastructure setup
- Stakeholder interviews 👤
- Brand asset collection

### Stage 2: Competitive Analysis (7 tasks)
- Analyze 15 competitors
- Pricing analysis
- Packaging audit 👤
- Communication analysis
- Positioning maps
- Whitespace analysis

### Stage 3: Customer Research (6 tasks)
- Survey design
- Customer surveys 👤
- Customer interviews 👤
- Mystery shopping 👤
- Digital journey audit
- Social listening

### Stage 4: Synthesis & Audit (7 tasks)
- Stakeholder synthesis
- Customer synthesis
- Customer journey map
- Pain points analysis
- Trend analysis
- Opportunity matrix
- Brand audit report (50-70 pages)

### Stage 5: Strategic Foundation (7 tasks)
- 3 positioning options
- Purpose statements
- Vision statements
- Mission statements
- Core values
- Workshop materials
- Client workshop decision 👤

### Stage 6: Audience & Architecture (3 tasks)
- 4 customer personas
- Brand architecture
- Product line roles

### Stage 7: Brand Framework (6 tasks)
- Brand personality
- Brand pyramid
- Pricing strategy
- Brand manifesto
- Messaging framework
- Complete brand framework

### Stage 8: Documentation (4 tasks)
- Complete strategy document (100+ pages)
- Executive summary (2 pages)
- Presentation deck
- Phase 2 recommendations

👤 = Requires human input (but can be skipped)

---

## 🔄 Skip Strategies

Tasks that require human input use different skip strategies:

### Placeholder
```
✅ Use when: Generic template can substitute
Example: Stakeholder interviews → Industry best practices template
Quality: 50%
```

### Inference
```
✅ Use when: Can infer from industry benchmarks
Example: Customer research → Industry survey data
Quality: 60%
```

### Omit
```
✅ Use when: Section is optional
Example: Mystery shopping → Skip entirely
Quality: 0% (section missing)
```

---

## 💡 Quality Scoring

**Quality Score = (Real Data Tasks / Total Tasks) × 100**

| Score | Category | Description |
|-------|----------|-------------|
| 95-100% | Production Ready | All critical data present |
| 85-94% | High Quality | Minor placeholders acceptable |
| 70-84% | Good | Draft quality, needs refinement |
| 50-69% | Draft | Significant placeholders |
| 0-49% | Initial | Mostly placeholders |

---

## 🚨 Common Issues

### Workflow Not Starting

**Problem**: `npm run workflow:start` fails

**Solution**:
1. Run `npm run workflow:validate` to check dependencies
2. Ensure TypeScript compiles: `npm run type-check`
3. Check that brand name is provided: `--brand="YourBrand"`

### File Watcher Not Detecting Changes

**Problem**: Uploaded files not triggering regeneration

**Solution**:
1. Ensure file names match task IDs: `stakeholder-interviews.txt`
2. Upload to correct directory: `output/{brand}/inputs/`
3. Check file permissions (must be readable)

### Low Quality Score

**Problem**: Quality score stuck at 70%

**Solution**:
1. Run `npm run workflow:status -- --brand="YourBrand"`
2. Check "Top Recommendations" section
3. Upload files for highest-priority tasks first

---

## 🎓 Best Practices

### 1. Start Early
```bash
# Don't wait for all data - start immediately
npm run workflow:start -- --brand="YourBrand"

# AI completes what it can while you gather human inputs
```

### 2. Upload Incrementally
```bash
# Upload data as it becomes available
cp ceo-interview.txt output/brand/inputs/stakeholder-interviews.txt

# System auto-regenerates affected outputs
```

### 3. Monitor Progress
```bash
# Check status regularly
npm run workflow:status -- --brand="YourBrand"

# See what changed
npm run workflow:history -- --brand="YourBrand"
```

### 4. Quality Threshold
```bash
# Set custom quality threshold (default: 95%)
npm run workflow:start -- --brand="YourBrand" --threshold=85

# Lower threshold = workflow completes sooner
```

---

## 📚 Next Steps

1. **Try it**: `npm run workflow:start -- --brand="TestBrand"`
2. **Check status**: `npm run workflow:status -- --brand="TestBrand"`
3. **Upload sample data**: Create a text file in `output/testbrand/inputs/`
4. **Watch regeneration**: See how the system adapts

---

## ✅ Summary

**What makes this system unique:**

✅ **Never blocks** - AI works while waiting for human input
✅ **Always improving** - Quality increases as data arrives
✅ **Fully tracked** - Every change versioned and documented
✅ **Highly parallel** - Runs 8+ tasks simultaneously
✅ **Production-ready** - Built for real agency workflows

**Time savings:**
- Traditional: 6-8 weeks (waiting for all data first)
- Adaptive: 3-4 weeks (AI works during human delays)
- **Improvement: 40-50% faster**

---

**Ready to build? Start your first workflow:**

```bash
npm run workflow:start -- --brand="YourBrand"
```
