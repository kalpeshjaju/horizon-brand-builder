# File Splitting Guide - horizon-brand-builder

## Files That Need Splitting (>500 lines)

### 1. agent-executor.ts (809 lines) → Split into 3 files

**Current structure:**
- Lines 1-230: Main class + routing logic
- Lines 231-486: Research task implementations
- Lines 487-809: Synthesis/Strategy/Execution/Documentation

**Recommended split:**

#### File 1: `agent-executor-core.ts` (~230 lines)
```typescript
// Main class definition
export class AgentExecutor {
  // Properties
  // Constructor
  // executeTask() - main entry point
  // routeTaskToAgent() - router
  // executeResearchTask() - delegate to handlers
  // executeSynthesisTask() - delegate to handlers
  // executeStrategyTask() - delegate to handlers
  // executeExecutionTask() - delegate to handlers
  // executeDocumentationTask() - delegate to handlers
}
```

#### File 2: `agent-executor-research-handlers.ts` (~300 lines)
```typescript
// All research task handlers
export class ResearchTaskHandlers {
  setupProject()
  processStakeholderInterviews()
  runCompetitiveAnalysis()
  processCustomerResearch()
  inferCustomerInsights()
  collectBrandAssets()
  mapTouchpoints()
  analyzePricing()
  analyzeCommunication()
  executeGenericResearch()
}
```

#### File 3: `agent-executor-other-handlers.ts` (~300 lines)
```typescript
// Synthesis, strategy, execution, documentation handlers
export class OtherTaskHandlers {
  synthesizeStakeholderInput()
  synthesizeCustomerResearch()
  generateBrandAudit()
  // ... all other handlers
  executeGenericSynthesis()
  executeGenericStrategy()
  executeGenericExecution()
  executeGenericDocumentation()
}
```

**Import in core:**
```typescript
import { ResearchTaskHandlers } from './agent-executor-research-handlers.js';
import { OtherTaskHandlers } from './agent-executor-other-handlers.js';
```

---

### 2. task-definitions.ts (667 lines) → Split by phase

**Current structure:**
- All 100+ task definitions in one file

**Recommended split:**

#### File 1: `task-definitions-core.ts` (~100 lines)
```typescript
// Core types and constants
export const TASK_CATEGORIES = [...];
export const BASE_TASK_CONFIG = {...};
```

#### File 2: `task-definitions-phase1.ts` (~150 lines)
```typescript
// Phase 1: Discovery tasks
export const PHASE_1_TASKS = [...];
```

#### File 3: `task-definitions-phase2.ts` (~150 lines)
```typescript
// Phase 2: Strategy tasks
export const PHASE_2_TASKS = [...];
```

#### File 4: `task-definitions-phase3-4.ts` (~200 lines)
```typescript
// Phase 3 & 4: Execution & Documentation
export const PHASE_3_TASKS = [...];
export const PHASE_4_TASKS = [...];
```

#### File 5: `task-definitions.ts` (~70 lines)
```typescript
// Re-export everything
export * from './task-definitions-core.js';
export * from './task-definitions-phase1.js';
export * from './task-definitions-phase2.js';
export * from './task-definitions-phase3-4.js';

// Combine all tasks
export const ALL_TASKS = [
  ...PHASE_1_TASKS,
  ...PHASE_2_TASKS,
  ...PHASE_3_TASKS,
  ...PHASE_4_TASKS,
];
```

---

### 3. adaptive-engine.ts (594 lines) → Split by responsibility

**Current structure:**
- Task execution
- Dependency resolution
- Quality assessment
- State management

**Recommended split:**

#### File 1: `adaptive-engine-core.ts` (~200 lines)
```typescript
// Main orchestration
export class AdaptiveEngine {
  executeWorkflow()
  processPhase()
  executeTasksInParallel()
}
```

#### File 2: `adaptive-engine-dependencies.ts` (~200 lines)
```typescript
// Dependency resolution logic
export class DependencyResolver {
  resolveDependencies()
  buildDependencyGraph()
  validateDependencies()
}
```

#### File 3: `adaptive-engine-quality.ts` (~200 lines)
```typescript
// Quality assessment
export class QualityAssessor {
  assessQuality()
  shouldEnhanceOutput()
  enhanceOutput()
}
```

---

### 4. research-database.test.ts (531 lines) → Split by test suite

**Current structure:**
- All test suites in one file

**Recommended split:**

#### File 1: `research-database-basic.test.ts` (~150 lines)
```typescript
// Basic CRUD tests
describe('ResearchDatabase - Basic Operations', () => {
  // initialize, store, load tests
});
```

#### File 2: `research-database-search.test.ts` (~150 lines)
```typescript
// Search functionality tests
describe('ResearchDatabase - Search', () => {
  // search, filter, query tests
});
```

#### File 3: `research-database-integration.test.ts` (~150 lines)
```typescript
// Integration tests
describe('ResearchDatabase - Integration', () => {
  // multi-brand, export, import tests
});
```

#### File 4: `research-database-edge-cases.test.ts` (~100 lines)
```typescript
// Edge cases and error handling
describe('ResearchDatabase - Edge Cases', () => {
  // error handling, validation tests
});
```

---

## How to Split (Step-by-Step)

### Example: Splitting agent-executor.ts

```bash
cd /Users/kalpeshjaju/Development/horizon-brand-builder

# 1. Create new handler files (copy relevant sections)
# Extract lines 231-486 for research handlers
sed -n '231,486p' src/workflow/agent-executor.ts > src/workflow/agent-executor-research-handlers.ts

# Extract lines 487-809 for other handlers
sed -n '487,809p' src/workflow/agent-executor.ts > src/workflow/agent-executor-other-handlers.ts

# 2. Add imports and exports to new files
# (manually edit files to add proper structure)

# 3. Update main file to use handlers
# (manually edit agent-executor.ts to import and delegate)

# 4. Run type-check to verify
npm run type-check

# 5. Run tests to verify
npm test
```

---

## Validation Checklist

After splitting each file:

- [ ] TypeScript compiles: `npm run type-check`
- [ ] Tests pass: `npm test`
- [ ] All files <500 lines: `wc -l src/workflow/*.ts`
- [ ] Imports use `.js` extension
- [ ] No circular dependencies

---

## Priority Order

1. ✅ **DONE**: Fix tests (vitest.config.ts added)
2. ✅ **DONE**: Add tests to brand-quality-auditor
3. 🔄 **TODO**: Split agent-executor.ts (809 → 3 files ~270 each)
4. 🔄 **TODO**: Split task-definitions.ts (667 → 5 files ~130 each)
5. 🔄 **TODO**: Split adaptive-engine.ts (594 → 3 files ~200 each)
6. 🔄 **TODO**: Split research-database.test.ts (531 → 4 files ~130 each)

---

## Time Estimate

- agent-executor.ts: 20-30 minutes
- task-definitions.ts: 15-20 minutes
- adaptive-engine.ts: 20-25 minutes
- research-database.test.ts: 10-15 minutes

**Total: ~1-1.5 hours**

---

## Notes

- **Keep it simple**: Extract methods to new files, import back
- **Maintain exports**: Don't break existing imports
- **Test frequently**: Run `npm run type-check` after each change
- **One file at a time**: Complete one split before moving to next
