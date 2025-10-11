# Troubleshooting Guide - Horizon Brand Builder Pro

> Common issues and their solutions

---

## 🔍 Quick Diagnostics

Run these commands to check system health:

```bash
# 1. Check TypeScript compilation
npm run type-check

# 2. Run tests
npm test

# 3. Check dependencies
npm list --depth=0

# 4. Verify project structure
ls -la data/ output/ src/
```

---

## 🚨 Common Issues

### 1. TypeScript Compilation Errors

**Problem**: `error TS2305: Module has no exported member 'BrandConfiguration'`

**Cause**: Type not exported or import path incorrect

**Solution**:
```typescript
// ✅ Correct import
import type { BrandConfiguration } from './types/project-types.js';

// ❌ Wrong (missing .js extension)
import type { BrandConfiguration } from './types/project-types';
```

---

**Problem**: `error TS7006: Parameter implicitly has 'any' type`

**Cause**: Missing type annotation in strict mode

**Solution**:
```typescript
// ❌ Wrong
sources.forEach((source) => { ... })

// ✅ Correct
sources.forEach((source: ResearchSource) => { ... })
```

---

**Problem**: `error TS2322: Type 'X' is not assignable to type 'Y'`

**Cause**: Type mismatch

**Solution**:
1. Check the interface definition in `src/types/`
2. Ensure all required fields are present
3. Verify field types match exactly

---

### 2. Import/Module Errors

**Problem**: `Cannot find module './foo'`

**Cause**: Missing `.js` extension for ES modules

**Solution**:
```typescript
// ✅ Correct (ES modules require .js extension)
import { foo } from './foo.js';
import type { Bar } from '../types/bar.js';

// ❌ Wrong
import { foo } from './foo';
```

---

**Problem**: `ERR_MODULE_NOT_FOUND`

**Cause**: Incorrect import path or missing file

**Solution**:
1. Verify file exists: `ls src/path/to/file.ts`
2. Check import path is relative from current file
3. Ensure `.js` extension (not `.ts`)

---

### 3. Project Tracker Issues

**Problem**: `Error: Project tracker not initialized. Call initialize() first.`

**Cause**: Trying to use tracker before initialization

**Solution**:
```typescript
const tracker = new ProjectTracker(brandConfig);
await tracker.initialize();  // ← Must call this first
const status = tracker.getStatus();  // Now safe
```

---

**Problem**: `Error: Phase phase1 not found`

**Cause**: Invalid phase name

**Solution**:
Valid phase names are: `phase1`, `phase2`, `phase3`, `phase4`, `phase5`

```typescript
// ✅ Correct
await tracker.updatePhase('phase1', { status: 'in-progress' });

// ❌ Wrong
await tracker.updatePhase('Phase 1', { status: 'in-progress' });
```

---

**Problem**: `Error: Deliverable "XYZ" not found in phase1`

**Cause**: Deliverable name doesn't match exactly

**Solution**:
1. Get exact deliverable names:
```typescript
const status = tracker.getStatus();
const deliverables = status.phases.phase1.deliverables;
console.log(deliverables.map(d => d.name));
```

2. Use exact name (case-sensitive):
```typescript
await tracker.updateDeliverable('phase1', 'Exact Deliverable Name', {
  status: 'completed'
});
```

---

### 4. Research Database Issues

**Problem**: `Error: Database not initialized. Call initialize() first.`

**Cause**: Using database before initialization

**Solution**:
```typescript
const database = new ResearchDatabase(brandConfig);
await database.initialize();  // ← Must call this first
const findings = await database.getAllFindings();
```

---

**Problem**: No search results found

**Cause**:
1. Database is empty
2. Search query doesn't match content

**Solution**:
```typescript
// 1. Check if database has findings
const stats = await database.getStats();
console.log(`Total findings: ${stats.metadata.totalFindings}`);

// 2. Try broader search
const results = await database.searchByKeyword('market');  // Single word

// 3. List all topics
const allStats = await database.getStats();
console.log('Topics:', allStats.metadata.topics);
```

---

### 5. API and Environment Issues

**Problem**: `⚠️ Google Custom Search API not configured`

**Cause**: Missing Google API keys (optional)

**Solution**:
This is a warning, not an error. The system will use placeholder data.

To fix (optional):
```bash
# 1. Get API keys from:
# https://developers.google.com/custom-search

# 2. Add to .env
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
```

---

**Problem**: `Error: ANTHROPIC_API_KEY not found`

**Cause**: Missing Anthropic API key

**Solution**:
```bash
# 1. Copy example env
cp .env.example .env

# 2. Add your key to .env
ANTHROPIC_API_KEY=sk-ant-api03-...

# 3. Restart the process
```

---

### 6. File Permission Errors

**Problem**: `Error: EACCES: permission denied`

**Cause**: No write permissions for data/output directories

**Solution**:
```bash
# Fix permissions
chmod -R 755 data/ output/

# Or create with correct permissions
mkdir -p data output
```

---

**Problem**: `Error: ENOSPC: no space left on device`

**Cause**: Disk full

**Solution**:
```bash
# Check disk space
df -h

# Clean up if needed
npm run clean  # (if available)
rm -rf node_modules && npm install
```

---

### 7. Memory Issues

**Problem**: `JavaScript heap out of memory`

**Cause**: Processing too much data

**Solution**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run professional -- --brand "Your Brand"
```

---

### 8. Test Failures

**Problem**: Tests fail with `TypeError: X is not a function`

**Cause**: API changed or test out of date

**Solution**:
1. Check the actual implementation in `src/services/`
2. Update test to match current API
3. Read the service file to see available methods

---

**Problem**: `AssertionError: expected X to equal Y`

**Cause**: Test expectations don't match actual behavior

**Solution**:
1. Check what the function actually returns:
```typescript
const result = await myFunction();
console.log('Actual result:', result);
```

2. Update test expectation to match

---

### 9. Build Issues

**Problem**: `npm run build` fails with errors

**Cause**: TypeScript compilation errors

**Solution**:
```bash
# 1. Clean build
rm -rf dist/

# 2. Check for errors
npm run type-check

# 3. Fix errors shown

# 4. Try build again
npm run build
```

---

### 10. Multi-Brand Data Issues

**Problem**: Wrong brand data being loaded

**Cause**: Brand names are case-sensitive in folder names

**Solution**:
```typescript
// Brand name is converted to slug: lowercase + hyphens
// "My Brand Name" → "my-brand-name"

// Check actual folder name
ls data/
// Should show: my-brand-name/

// Use exact brand name in config
const config: BrandConfiguration = {
  brandName: 'My Brand Name',  // ← Must match original
  // ...
};
```

---

**Problem**: Data from different brands mixing

**Cause**: Both brands have same slug after normalization

**Solution**:
```typescript
// ❌ These create the same folder:
brandName: 'Acme Corp'      → acme-corp/
brandName: 'AcmeCorp'       → acmecorp/  (different!)
brandName: 'Acme  Corp'     → acme-corp/  (same as first!)

// ✅ Use distinct brand names
brandName: 'Acme Corporation'   → acme-corporation/
brandName: 'Acme International' → acme-international/
```

---

## 🔧 Advanced Troubleshooting

### Enable Debug Logging

```typescript
// Add at top of your file
const DEBUG = true;

if (DEBUG) {
  console.log('Debug info:', someVariable);
}
```

### Check File Structure

```bash
# Verify all required files exist
find src/ -name "*.ts" | head -20

# Check data directories
tree data/ -L 2

# Check output directories
tree output/ -L 2
```

### Verify Dependencies

```bash
# Check for outdated packages
npm outdated

# Reinstall if needed
rm -rf node_modules package-lock.json
npm install
```

### Clean Slate

```bash
# Remove all data (CAUTION: Deletes all brand data!)
rm -rf data/* output/*

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

---

## 📞 Still Stuck?

### 1. Check Documentation

- **README.md** - General usage
- **CLAUDE.md** - Claude Code assistant guide
- **IMPLEMENTATION-COMPLETE.md** - Implementation details

### 2. Check Example Configs

Look at working examples in `src/config/examples/`:
- `flyberry-config.example.ts`
- `saas-config.example.ts`
- `ecommerce-config.example.ts`

### 3. Verify System Health

```bash
# All these should pass
npm run type-check    # ✅ Zero errors
npm test              # ✅ 267+ tests passing
npm run lint          # ✅ No lint errors
```

### 4. Check Global Rules

Read `~/.claude/MASTER_RULES.md` for project-wide standards

---

## 🛡️ Prevention Tips

1. **Always run type-check before committing**
   ```bash
   npm run type-check && git commit
   ```

2. **Initialize before using**
   ```typescript
   await tracker.initialize();
   await database.initialize();
   ```

3. **Use exact names**
   - Phase names: `phase1`, not `"Phase 1"`
   - Deliverable names: Must match exactly (case-sensitive)

4. **Keep .env updated**
   ```bash
   cp .env.example .env
   # Add your API keys
   ```

5. **Check file sizes**
   ```bash
   # All files should be <500 lines
   wc -l src/**/*.ts | sort -n | tail
   ```

---

## 📊 Quick Health Check

Run this to verify everything is working:

```bash
#!/bin/bash
echo "🔍 Horizon Brand Builder Pro - Health Check"
echo ""

echo "1. TypeScript compilation..."
npm run type-check && echo "✅ PASS" || echo "❌ FAIL"

echo ""
echo "2. Tests..."
npm test -- --run --reporter=basic 2>&1 | grep "Test Files" && echo "✅ PASS" || echo "❌ FAIL"

echo ""
echo "3. File structure..."
[ -d "src" ] && [ -d "tests" ] && [ -d "data" ] && echo "✅ PASS" || echo "❌ FAIL"

echo ""
echo "4. Dependencies..."
[ -d "node_modules" ] && echo "✅ PASS" || echo "❌ FAIL"

echo ""
echo "Done! 🎉"
```

Save as `health-check.sh` and run: `bash health-check.sh`

---

**Remember**: Most issues can be fixed by:
1. Running `npm run type-check` to find errors
2. Checking you called `initialize()` first
3. Using exact names (case-sensitive)
4. Reading error messages carefully (they include fix instructions)
