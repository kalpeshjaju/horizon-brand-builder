# Data Freshness Guarantee

**Date**: 2025-10-11
**Status**: Active Policy

---

## Core Principle

**Every workflow run generates 100% fresh data. No caching. No reuse.**

This ensures:
- ✅ Latest product prices every time
- ✅ Current website content
- ✅ Up-to-date verification dates
- ✅ Fresh LLM analysis
- ✅ No stale information

---

## Implementation

### 1. BrandDiscoveryAgent (src/agents/brand-discovery-agent.ts)

**No Caching**: Every call to `discoverBrand()` performs fresh:
- Website scraping
- Product catalog collection
- Pricing verification
- Distribution mapping
- Business metrics calculation

**Verification Dates**: Always set to current date (`new Date().toISOString().split('T')[0]`)

```typescript
// Every run creates fresh verification
verification: {
  source: website,
  date: new Date().toISOString().split('T')[0], // ALWAYS CURRENT
  tier: 'verified',
  confidence: 95,
}
```

### 2. EnhancedReportGenerator (src/services/enhanced-report-generator.ts)

**File Overwriting**: The `generate()` method uses `writeFile()` which **overwrites** existing files:

```typescript
await writeFile(markdownPath, markdown, 'utf-8'); // OVERWRITES
await writeFile(htmlPath, html, 'utf-8'); // OVERWRITES
await writeFile(verificationLogPath, verificationLog, 'utf-8'); // OVERWRITES
```

**Quality Score**: Recalculated on every run based on current data:
```typescript
const qualityScore = this.qualityManager.getQualityScore(this.collectAllDataPoints());
// ^^ Recalculated fresh every time
```

### 3. Professional Mode (src/modes/professional-mode.ts)

**No Result Reuse**: Each run executes:
1. Phase 0: Fresh brand discovery (scrapes website)
2. Phase 1-3: Fresh strategy generation (new LLM calls)
3. Phase 4: Fresh report generation (new files)

**No Conditional Checks**: The workflow doesn't check if files exist before regenerating.

---

## What Gets Regenerated

### Every Run Regenerates:

✅ **All Brand Discovery Data**
- Company information
- Product catalog
- Pricing data
- Distribution channels
- Customer reviews (when implemented)
- Business metrics

✅ **All Verification Metadata**
- Verification dates → Always current date
- Confidence scores → Recalculated
- Quality scores → Recalculated
- Data age → Recalculated

✅ **All Reports**
- brand-book.md → Completely rewritten
- brand-book.html → Completely rewritten
- DATA-VERIFICATION-LOG.md → Completely rewritten

✅ **All Strategy Content**
- Market research (new LLM calls)
- Brand audit (new analysis)
- Positioning (fresh strategy)
- Messaging framework (regenerated)

### What Might Be Cached (External Services)

⚠️ **WebResearchService** has caching:
- Location: `data/web-search-cache.json`
- TTL: 24 hours (default)
- Purpose: Reduce Google API costs
- Impact: Search results may be cached for up to 24 hours

**To Force Fresh Google Searches:**
```bash
# Clear web search cache before running
rm data/web-search-cache.json

# Then run professional mode
npm run professional -- --brand "Brand Name"
```

⚠️ **LLM Response Caching** (Claude API):
- Claude may cache prompt/response pairs temporarily
- This is API-level, not controlled by our system
- Typically expires within minutes

---

## Verification

### Test Data Freshness

Run the same command twice and verify dates are different:

```bash
# First run
npm run professional -- --brand "Flyberry Gourmet" --website "https://flyberry.in"
# Note the "Generated" date in brand-book.md

# Second run (immediately after)
npm run professional -- --brand "Flyberry Gourmet" --website "https://flyberry.in"
# Verify:
# 1. All verification dates updated
# 2. Quality score recalculated
# 3. Files have new timestamps
```

### Check File Timestamps

```bash
stat -f "Modified: %Sm" outputs/flyberry-gourmet/brand-book.md
```

### Verify No Caching in Discovery Agent

```bash
# Search for cache-related code
grep -r "cache\|Cache" src/agents/brand-discovery-agent.ts
# Should return: No matches
```

---

## Why No Caching?

### 1. **Accuracy Over Speed**
Fresh data is more important than fast execution. A 30-second run with current data beats a 5-second run with stale data.

### 2. **E-commerce Price Changes**
Product prices can change daily. Caching would show outdated prices.

### 3. **Website Updates**
Brands update their websites frequently. We need to capture the latest content.

### 4. **Verification Integrity**
Verification dates must reflect when data was actually collected, not when it was cached.

### 5. **Quality Metrics Accuracy**
Quality scores should reflect current data quality, not historical snapshots.

---

## User Guarantees

When you run the workflow, you are **guaranteed**:

1. ✅ All verification dates will be **today's date**
2. ✅ All product prices will be **current** (scraped fresh)
3. ✅ All quality scores will be **recalculated**
4. ✅ All reports will be **completely regenerated**
5. ✅ No data from previous runs will be reused

---

## Edge Cases

### Old Files from Previous Runs

**Scenario**: Old files exist in output directory from yesterday's run.

**Behavior**: All files are **overwritten** with fresh data.

**File Timestamps**: Updated to current time.

**Verification Dates**: Updated to current date.

### Web Search Cache (24-hour TTL)

**Scenario**: Google search results cached from earlier today.

**Impact**:
- Industry research may use cached search results
- Brand-specific data (discovery) is always fresh (doesn't use web search)

**Workaround**: Delete `data/web-search-cache.json` before running.

### LLM Response Variation

**Scenario**: Running same brand twice may produce slightly different strategy content.

**Behavior**: **This is expected and correct.**

**Reason**:
- LLM responses have natural variation
- Strategy is regenerated fresh each time
- Discovery data (products, prices) will be identical
- Strategic recommendations may vary slightly

---

## Configuration

### Current Settings

```typescript
// WebResearchService cache (only affects web search, not discovery)
cacheTTL: 24 * 60 * 60 * 1000  // 24 hours

// BrandDiscoveryAgent (no cache)
// - No cache configuration
// - Always scrapes fresh

// EnhancedReportGenerator (no cache)
// - Always overwrites files
// - No conditional generation
```

### To Disable All Caching

```typescript
// In WebResearchService constructor
enableCache: false  // Disable web search cache
```

---

## Audit Trail

Every report includes verification dates for audit:

```markdown
**Generated**: 2025-10-11
**Verification Date**: 2025-10-11

| Product | Price | Source | Date | Confidence |
|---------|-------|--------|------|------------|
| Item    | ₹500  | url    | 2025-10-11 | 95% |
```

This allows you to verify data freshness at a glance.

---

## Summary

**Policy**: Zero data reuse between runs.
**Implementation**: No caching in discovery/reporting.
**Verification**: Dates always current.
**Guarantee**: 100% fresh data every time.

**Exception**: Web search results may be cached for 24h (Google API optimization only).

---

**Last Updated**: 2025-10-11
**Applies To**: All workflow modes (fast, professional, research)
**Status**: Active and enforced
