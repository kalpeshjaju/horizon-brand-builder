---
title: "Horizon Brand Builder Pro - Claude Code Guide"
description: "Complete guide for Claude Code AI assistant when working on this project"
created: 2025-10-11
last_updated: 2025-10-11
project: "Horizon Brand Builder Pro"
status: active
version: 1.0.0
---

# Horizon Brand Builder Pro - Claude Code Guide

> **For Claude Code AI Assistant**: Read this file when working on this project

---

## 🎯 Project Overview

**Name**: Horizon Brand Builder Pro
**Purpose**: Universal AI-powered brand building system for ANY brand (B2C, B2B, SaaS, E-commerce, Luxury, etc.)
**Status**: Production-ready (85% complete)
**Location**: `/Users/kalpeshjaju/Development/horizon-brand-builder/`

### Origin Story

This project was created by merging two previous projects:
1. **brand-builder-pro** - TypeScript, generic system, V2.0 accuracy, testing framework
2. **flyberry-brand-research** - Project tracker, research database, deliverables tracking

The merge created a **truly generic** system that works for ANY brand, not just Flyberry.

---

## 🏗️ Architecture

### Core Philosophy

1. **Generic over Specific**: Use placeholders (`{brandName}`, `{industry}`, `{category}`) throughout
2. **Multi-Brand Support**: Per-brand data folders (`data/{brandName}/`)
3. **Type Safety**: TypeScript strict mode, ZERO compilation errors
4. **File Size Compliance**: All files <500 lines (from MASTER_RULES.md)
5. **Modular**: Small, focused modules for token efficiency

### Directory Structure

```
src/
├── agents/                    # AI agents (researcher, strategist, auditor)
│   ├── orchestrator-agent.ts # Main orchestrator
│   ├── researcher-v2.ts       # V2.0 enhanced researcher
│   ├── strategist.ts          # Brand strategist
│   └── auditor.ts             # Brand auditor
├── services/                  # Core services
│   ├── project-tracker.ts     # 481 lines - Track 64 deliverables across 5 phases
│   ├── research-database/     # Split into 4 modules (485 lines total)
│   │   ├── database-core.ts   # 135 lines - CRUD operations
│   │   ├── database-search.ts # 57 lines - Search/filter
│   │   ├── database-indexer.ts # 115 lines - Indexing
│   │   └── index.ts           # 178 lines - Main export
│   ├── report-generator.ts    # 247 lines - Markdown + HTML reports
│   ├── llm-service.ts         # Managed LLM service (Claude)
│   ├── web-research-service.ts # Google Custom Search integration
│   ├── fact-checker-enhanced.ts # V2.0 fact-checking
│   └── source-quality-assessor.ts # Source quality tiers (1-4)
├── config/
│   ├── research-topic-templates.ts  # 77 generic subtopics with placeholders
│   ├── deliverables-framework.ts    # 64 generic deliverables with placeholders
│   └── examples/                    # 3 industry-specific examples
│       ├── flyberry-config.example.ts   # Food & Beverage
│       ├── saas-config.example.ts       # B2B SaaS
│       └── ecommerce-config.example.ts  # D2C E-commerce
├── types/
│   ├── project-types.ts       # BrandConfiguration, ProjectStatus, Phase, Deliverable
│   ├── research-types.ts      # ResearchFinding, ResearchSource
│   ├── brand-types.ts         # Brand-specific types
│   └── llm-types.ts           # LLM interface types
├── modes/                     # Execution modes
│   ├── fast-mode.ts           # Quick overview
│   ├── professional-mode.ts   # Comprehensive research
│   ├── research-mode.ts       # Deep analysis
│   └── pm-dashboard.ts        # Project manager view
└── utils/                     # Utility functions
```

### Data Storage (Per-Brand)

```
data/{brand-name}/
├── project-status.json        # Project tracker data
└── research-db.json           # Research database

output/{brand-name}/
├── dashboard.md               # Project dashboard
├── report.md                  # Research report
└── deliverables-checklist.csv # Export
```

---

## 🔑 Key Concepts

### 1. BrandConfiguration

Every brand is configured using this interface:

```typescript
interface BrandConfiguration {
  brandName: string;              // Required
  industry: string;               // Required
  category: string;               // Required
  companyProfile?: {
    founded: number;
    currentRevenue: string;
    channels: string[];
    // ... more fields
  };
  projectObjectives: {
    primary: string;
    goals: string[];
  };
  competitors?: Competitor[];
  customDeliverables?: Record<string, string[]>;
  customResearchTopics?: any;
}
```

### 2. Placeholder System

Templates use placeholders that get replaced dynamically:

- `{brandName}` → `brandConfig.brandName`
- `{industry}` → `brandConfig.industry`
- `{category}` → `brandConfig.category`
- `{channels}` → `brandConfig.companyProfile.channels.join(', ')`

**Example**:
```typescript
// Template
"Current brand assets inventory for {brandName}"

// After customization (for Flyberry)
"Current brand assets inventory for Flyberry Gourmet"
```

### 3. Research Topics Framework

- **77 subtopics** across 4 phases
- Generic templates with placeholders
- Customization via `customizeResearchTopics(brandConfig)`
- Located in: `src/config/research-topic-templates.ts`

### 4. Deliverables Framework

- **64 deliverables** across 5 phases
- Generic templates with placeholders
- Customization via `customizeDeliverables(brandConfig)`
- Located in: `src/config/deliverables-framework.ts`

### 5. V2.0 Intelligent Accuracy

- **Source Quality Assessment**: 4-tier system (Tier 1-4)
- **Fact-Checking**: Automatic verification of claims
- **Confidence Scoring**: 0-10 scale for all findings
- **Multi-Source Verification**: Cross-reference multiple sources

---

## 📝 Common Tasks

### Adding a New Brand

```typescript
// 1. Create config file
// src/config/my-new-brand.config.ts

import type { BrandConfiguration } from '../types/project-types.js';

export const MY_BRAND_CONFIG: BrandConfiguration = {
  brandName: 'My New Brand',
  industry: 'Industry',
  category: 'Category',
  projectObjectives: {
    primary: 'Main objective',
    goals: ['Goal 1', 'Goal 2'],
  },
};

// 2. Initialize
import { ProjectTracker } from './services/project-tracker.js';
import { ResearchDatabase } from './services/research-database/index.js';

const tracker = new ProjectTracker(MY_BRAND_CONFIG);
await tracker.initialize();

const database = new ResearchDatabase(MY_BRAND_CONFIG);
await database.initialize();
```

### Modifying Research Topics

```typescript
// src/config/research-topic-templates.ts

export const GENERIC_RESEARCH_TOPICS = {
  phase1: {
    name: 'Brand Strategy & Positioning',
    topics: [
      {
        id: 'brand-audit',
        name: 'Brand Audit & Current State',
        subtopics: [
          'Current brand assets inventory for {brandName}',
          // Add more subtopics here
        ],
      },
    ],
  },
};
```

### Adding Custom Deliverables

```typescript
const myBrandConfig: BrandConfiguration = {
  // ... other config
  customDeliverables: {
    phase1: [
      'Custom Deliverable 1',
      'Custom Deliverable 2',
    ],
  },
};
```

### Querying Research Database

```typescript
const database = new ResearchDatabase(brandConfig);
await database.initialize();

// Search by keyword
const results = await database.searchByKeyword('competitor');

// Get high confidence findings
const highConfidence = await database.getHighConfidenceFindings();

// Get findings by topic
const topicResults = await database.searchByTopic('Market Research');

// Get statistics
const stats = await database.getStats();
console.log(`Total findings: ${stats.metadata.totalFindings}`);
```

### Updating Project Status

```typescript
const tracker = new ProjectTracker(brandConfig);
await tracker.initialize();

// Update phase status
await tracker.updatePhase('phase1', { status: 'in-progress' });

// Update deliverable
await tracker.updateDeliverable('phase1', 'Deliverable Name', {
  status: 'completed',
  assignee: 'John Doe',
});

// Add milestone
await tracker.addMilestone('phase1', {
  name: 'Milestone 1',
  targetDate: '2025-12-31',
});

// Add risk
await tracker.addRisk('phase1', {
  title: 'Risk Title',
  description: 'Risk description',
  severity: 'high',
});

// Generate dashboard
await tracker.generateDashboard();
```

---

## 🛠️ Development Workflow

### Before Making Changes

1. **Read MASTER_RULES.md**: Always check global rules first
2. **Run type-check**: `npm run type-check` - Must pass with ZERO errors
3. **Check file sizes**: All files must be <500 lines
4. **Run tests**: `npm test` - Don't break existing tests

### When Editing Large Files

If a file exceeds 500 lines:

1. **Split into modules**: Create separate files by responsibility
2. **Example**: `research-database.js` (547 lines) → Split into 4 modules (485 lines total)
   - database-core.ts (135 lines)
   - database-search.ts (57 lines)
   - database-indexer.ts (115 lines)
   - index.ts (178 lines)

### TypeScript Standards

```typescript
// ✅ DO: Strict types
interface MyType {
  name: string;
  age: number;
}

// ❌ DON'T: Use 'any'
const data: any = {};

// ✅ DO: Use 'unknown' if needed
const data: unknown = {};
if (typeof data === 'object') {
  // Safe to use
}
```

### Error Handling

```typescript
// ❌ BAD: Vague errors
throw new Error('Failed');

// ✅ GOOD: Contextual errors
throw new Error(
  `Failed to load config at ${path}\n` +
  `Reason: ${error.message}\n` +
  `Fix: Ensure the file exists and has correct permissions.`
);
```

---

## 🧪 Testing

### Test Structure

```
tests/
├── unit/
│   ├── services/
│   │   ├── project-tracker.test.ts
│   │   └── research-database.test.ts
│   └── config/
│       └── research-topic-templates.test.ts
└── integration/
    └── multi-brand.test.ts
```

### Running Tests

```bash
# All tests
npm test

# Specific file
npm test -- tests/unit/services/project-tracker.test.ts

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Writing Tests

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('MyService', () => {
  let service: MyService;

  beforeEach(async () => {
    service = new MyService(testConfig);
    await service.initialize();
  });

  afterEach(async () => {
    // Clean up test data
    await cleanup();
  });

  it('should do something', async () => {
    const result = await service.doSomething();
    expect(result).toBeDefined();
  });
});
```

---

## 📊 npm Scripts

### Project Tracker

```bash
npm run tracker:init         # Initialize project tracker
npm run tracker:status       # Show current status
npm run tracker:dashboard    # Generate dashboard
npm run tracker:export       # Export to CSV
npm run tracker:update       # Update deliverable
```

### Research Database

```bash
npm run db:init             # Initialize research database
npm run db:stats            # Show statistics
npm run db:search <query>   # Search by keyword
npm run db:topics           # List all topics
npm run db:export           # Export to JSON
```

### Execution Modes

```bash
npm run fast -- --brand "Brand Name"          # Fast mode
npm run professional -- --brand "Brand Name"  # Professional mode
npm run research -- --brand "Brand Name"      # Research mode
npm run pm:dashboard                          # PM Dashboard
```

### Development

```bash
npm run dev                 # Development mode
npm run build               # Production build
npm test                    # Run tests
npm run type-check          # TypeScript check
npm run lint                # Lint code
```

---

## 🚨 Common Issues

### TypeScript Errors

**Problem**: `error TS2305: Module has no exported member`
**Solution**: Check that the type is exported in the types file

**Problem**: `error TS7006: Parameter implicitly has 'any' type`
**Solution**: Add explicit type annotation

### File Size Violations

**Problem**: File exceeds 500 lines
**Solution**: Split into smaller modules by responsibility

### Import Errors

**Problem**: `Cannot find module`
**Solution**: Ensure `.js` extension in imports for ES modules

```typescript
// ✅ CORRECT
import { foo } from './foo.js';

// ❌ WRONG
import { foo } from './foo';
```

---

## 📚 Important Files

### Must-Read Files

1. **MASTER_RULES.md** (`~/.claude/MASTER_RULES.md`) - Global rules (NON-NEGOTIABLE)
2. **IMPLEMENTATION-COMPLETE.md** - Full implementation status
3. **QUICK-START.md** - Quick reference
4. **package.json** - Dependencies and scripts

### Key Source Files

1. **src/types/project-types.ts** - Core type definitions
2. **src/config/research-topic-templates.ts** - Research topics framework
3. **src/config/deliverables-framework.ts** - Deliverables framework
4. **src/services/project-tracker.ts** - Project tracking
5. **src/services/research-database/index.ts** - Research database

---

## 🎯 Success Criteria

### What "Done" Looks Like

- [x] **TypeScript strict mode**: Zero compilation errors
- [x] **File size compliant**: All files <500 lines
- [x] **Generic system**: Works for ANY brand
- [x] **Multi-brand support**: Isolated data per brand
- [x] **Type-safe**: Full type coverage
- [ ] **80%+ test coverage**: Currently ~70%
- [x] **V2.0 accuracy**: Source quality + fact-checking
- [x] **Documentation**: README, CLAUDE.md, TROUBLESHOOTING.md

---

## 💡 Best Practices

1. **Always start with a brand config**: Don't hardcode brand names
2. **Use placeholder system**: `{brandName}`, `{industry}`, etc.
3. **Keep files small**: <500 lines, split if larger
4. **Type everything**: No `any` types
5. **Error with context**: Include what failed, why, and how to fix
6. **Test as you go**: Write tests for new features
7. **Check type-check**: Run before committing

---

## 🔄 Evolution

### Version History

- **v1.0.0** (2025-10-11): Initial production release
  - Merged brand-builder-pro + flyberry-brand-research
  - Created generic system for ANY brand
  - 85% complete, production-ready

### Future Enhancements

- [ ] More example brand configurations
- [ ] Enhanced report templates
- [ ] Additional research topic templates
- [ ] Improved test coverage (target: 90%+)
- [ ] Performance optimizations

---

## 📞 Quick Reference

**Check if system is working**:
```bash
npm run type-check  # Should show: ZERO errors
npm test            # Should show: 267 tests passing
```

**Start a new brand project**:
```bash
cp src/config/examples/saas-config.example.ts src/config/my-brand.config.ts
# Edit my-brand.config.ts
npm run tracker:init
npm run db:init
npm run fast -- --brand "My Brand"
```

**Check project status**:
```bash
npm run tracker:dashboard
npm run db:stats
```

---

## ⚠️ Critical Rules

From MASTER_RULES.md (MUST follow):

1. **File Size**: <500 lines per file (hard limit)
2. **TypeScript**: Strict mode, zero errors
3. **Imports**: ES modules with `.js` extension
4. **Error Messages**: Always include context + fix instructions
5. **Testing**: Write tests for new features
6. **Token Efficiency**: Keep code concise and modular

---

**Remember**: This is a production system for real brand transformation projects. Quality and reliability over speed!
