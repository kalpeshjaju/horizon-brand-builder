# Data Verification Integration - Architecture & Implementation Plan

**Created**: 2025-10-11
**Status**: Design Complete → Implementation Ready
**Goal**: Integrate data verification framework into workflow system for automatic citations, tables, and accuracy

---

## Current Architecture

```
professional-mode.ts
  ├─> BrandDesignOrchestrator (orchestrator.ts)
  │     ├─> ResearchAgentV2 (researcher-v2.ts)
  │     │     ├─> WebResearchService
  │     │     ├─> EnhancedFactCheckerService
  │     │     └─> LLM Analysis
  │     ├─> BrandAuditorAgent (auditor.ts)
  │     └─> BrandStrategistAgent (strategist.ts)
  │
  └─> Outputs: brand-book.md (444 lines)
        ├─> Brand Strategy
        ├─> Research Insights
        └─> Audit Findings
```

### Key Files:
1. **professional-mode.ts** - Entry point, orchestrates workflow
2. **orchestrator.ts** - Coordinates agents (research, audit, strategy)
3. **researcher-v2.ts** - V2.0 with fact-checking and confidence scores
4. **report-generator.ts** - ❌ Does NOT use verification framework yet

---

## Problem Analysis

### What's Missing:

1. **Brand Discovery Phase** (Part 1)
   - ❌ No direct website scraping for actual products/prices
   - ❌ No marketplace verification (Amazon, Blinkit, Instamart)
   - ❌ No customer review collection
   - ❌ No distribution channel verification

2. **Data Verification Layer**
   - ✅ ResearchAgentV2 has confidence scoring
   - ❌ But not integrated with our 4-tier system (✅/✓/⚠️/ⓘ)
   - ❌ No source citation formatting
   - ❌ No data recency tracking

3. **Report Generation**
   - ❌ No table formatting (uses bullet lists)
   - ❌ No citation insertion
   - ❌ No verification tier markers
   - ❌ Generic content, not actual brand data

---

## Proposed Architecture

```
professional-mode.ts
  ├─> DataVerificationLayer (NEW)
  │     ├─> BrandDiscoveryAgent (NEW)
  │     │     ├─> WebsiteScraper (flyberry.in)
  │     │     ├─> MarketplaceVerifier (Amazon, Blinkit, Instamart)
  │     │     ├─> ReviewCollector
  │     │     └─> DistributionMapper
  │     │
  │     └─> DataQualityManager (NEW)
  │           ├─> 4-Tier Classification (✅/✓/⚠️/ⓘ)
  │           ├─> Citation Formatter
  │           ├─> Recency Tracker
  │           └─> Verification Log Generator
  │
  ├─> BrandDesignOrchestrator (ENHANCED)
  │     ├─> ResearchAgentV2 → outputs VerifiedDataPoints
  │     ├─> BrandAuditorAgent → outputs VerifiedDataPoints
  │     └─> BrandStrategistAgent → outputs VerifiedDataPoints
  │
  └─> EnhancedReportGenerator (NEW)
        ├─> Part 1: Brand Discovery (tables + citations)
        ├─> Part 2: Brand Strategy (verified claims)
        ├─> TableFormatter
        ├─> CitationInserter
        └─> HTMLGenerator with verification badges
```

---

## Implementation Plan

### Phase 1: Core Infrastructure (Priority 1)

#### 1.1 Create BrandDiscoveryAgent
```typescript
// src/agents/brand-discovery-agent.ts

export class BrandDiscoveryAgent {
  async discoverBrand(brandConfig: BrandConfiguration): Promise<BrandDiscoveryReport> {
    return {
      companyInfo: await this.scrapeOfficialWebsite(brandConfig.website),
      products: await this.collectProductCatalog(brandConfig),
      pricing: await this.verifyPricing(brandConfig),
      distribution: await this.mapDistributionChannels(brandConfig),
      customerFeedback: await this.collectReviews(brandConfig),
      verification: this.generateVerificationLog(),
    };
  }

  private async scrapeOfficialWebsite(url: string): Promise<VerifiedCompanyInfo> {
    // Use existing WebResearchService
    // Extract: about, products, pricing, contact
    // Return with Tier 1 verification (✅)
  }

  private async collectProductCatalog(config: BrandConfiguration): Promise<VerifiedProduct[]> {
    // Scrape website + marketplaces
    // Cross-verify prices across platforms
    // Return array of products with sources
  }

  private async verifyPricing(config: BrandConfiguration): Promise<PricingTable> {
    // Check: website, Amazon, Blinkit, Instamart, BigBasket
    // Build comparison table
    // Mark verification tier for each price point
  }

  private async mapDistributionChannels(config: BrandConfiguration): Promise<DistributionMap> {
    // Verify presence on each platform
    // Check availability dates
    // Return with verification status
  }

  private async collectReviews(config: BrandConfiguration): Promise<VerifiedReview[]> {
    // Scrape Amazon reviews
    // Extract quotes with attribution
    // Classify sentiment
    // Return Tier 1 (✅ direct quotes)
  }
}
```

#### 1.2 Create DataQualityManager
```typescript
// src/services/data-quality-manager.ts

import { DATA_QUALITY_TIERS, type VerifiedDataPoint } from '../config/data-quality-standards.js';

export class DataQualityManager {
  classifyDataPoint(
    value: any,
    source: string,
    verificationDate: string,
    numSources: number
  ): VerifiedDataPoint {
    // Determine tier based on:
    // - Source type (official vs. third-party)
    // - Age of data
    // - Number of confirming sources

    const age = this.calculateAge(verificationDate);
    let tier: 'verified' | 'cross-verified' | 'single-source' | 'estimated';

    if (source.includes('official') && age <= 30 && numSources >= 1) {
      tier = 'verified';
    } else if (numSources >= 2 && age <= 90) {
      tier = 'cross-verified';
    } else if (numSources === 1 && age <= 180) {
      tier = 'single-source';
    } else {
      tier = 'estimated';
    }

    return {
      claim: `${value}`,
      value,
      source,
      verificationDate,
      tier,
      confidence: this.calculateConfidence(tier, age, numSources),
    };
  }

  formatCitation(dataPoint: VerifiedDataPoint): string {
    const tierInfo = DATA_QUALITY_TIERS[dataPoint.tier.toUpperCase().replace('-', '_')];
    return `${tierInfo.symbol} *[${dataPoint.source}, ${dataPoint.verificationDate}, ${dataPoint.confidence}% confidence]*`;
  }

  generateVerificationLog(dataPoints: VerifiedDataPoint[]): string {
    // Generate markdown verification log
    // Group by tier
    // Create summary statistics
  }
}
```

#### 1.3 Create EnhancedReportGenerator
```typescript
// src/services/enhanced-report-generator.ts

export class EnhancedReportGenerator {
  constructor(
    private brandConfig: BrandConfiguration,
    private discoveryReport: BrandDiscoveryReport,
    private strategyReport: any, // existing output
    private qualityManager: DataQualityManager
  ) {}

  async generate(): Promise<{ markdown: string; html: string }> {
    let report = this.buildHeader();

    // PART 1: Brand Discovery (NEW)
    report += this.buildBrandDiscoverySection();

    // PART 2: Brand Strategy (existing)
    report += this.buildBrandStrategySection();

    return {
      markdown: report,
      html: await this.convertToHTML(report),
    };
  }

  private buildBrandDiscoverySection(): string {
    let section = `# Part 1: Brand Discovery & Deep Understanding\n\n`;

    // Company Info
    section += `## About ${this.brandConfig.brandName}\n\n`;
    section += this.formatCompanyInfoTable(this.discoveryReport.companyInfo);

    // Products
    section += `## Product Portfolio\n\n`;
    section += this.formatProductCatalogTable(this.discoveryReport.products);

    // Pricing
    section += `## Pricing Analysis\n\n`;
    section += this.formatPricingComparisonTable(this.discoveryReport.pricing);

    // Distribution
    section += `## Distribution Channels\n\n`;
    section += this.formatDistributionTable(this.discoveryReport.distribution);

    // Customer Feedback
    section += `## Customer Feedback\n\n`;
    section += this.formatReviewsSection(this.discoveryReport.customerFeedback);

    return section;
  }

  private formatProductCatalogTable(products: VerifiedProduct[]): string {
    let table = `| Category | Product | Size | Price (₹) | Platform | Source | Date | Tier |\n`;
    table += `|----------|---------|------|-----------|----------|--------|------|------|\n`;

    products.forEach(product => {
      const verified = this.qualityManager.classifyDataPoint(
        product.price,
        product.source,
        product.verificationDate,
        product.numSources
      );

      const tierSymbol = DATA_QUALITY_TIERS[verified.tier.toUpperCase().replace('-', '_')].symbol;

      table += `| ${product.category} | ${product.name} | ${product.size} | ${product.price} | ${product.platform} | ${product.source} | ${product.verificationDate} | ${tierSymbol} |\n`;
    });

    return table + `\n*All data verified as of ${new Date().toISOString().split('T')[0]}*\n\n`;
  }

  // Similar methods for other tables...
}
```

### Phase 2: Integration (Priority 2)

#### 2.1 Modify professional-mode.ts
```typescript
// professional-mode.ts

async run(options: ProfessionalModeOptions) {
  // ... existing code ...

  // NEW: Run Brand Discovery FIRST
  console.log('🔍 Phase 0: Brand Discovery & Verification\n');
  const discoveryAgent = new BrandDiscoveryAgent(llm);
  const discoveryReport = await discoveryAgent.discoverBrand(completeBrandProfile);

  // Existing workflow
  const output = await this.orchestrator.runBrandDesignWorkflow(completeBrandProfile);

  // NEW: Enhanced report generation
  const qualityManager = new DataQualityManager();
  const enhancedReporter = new EnhancedReportGenerator(
    completeBrandProfile,
    discoveryReport,
    output,
    qualityManager
  );

  const { markdown, html } = await enhancedReporter.generate();

  // Save outputs
  await this.saveReport(markdown, html);
}
```

#### 2.2 Update orchestrator.ts
```typescript
// Add data verification to each agent output

async runBrandDesignWorkflow(profile: BrandProfile): Promise<WorkflowOutput> {
  // Research phase
  const research = await this.researcher.conductResearch(profile);

  // NEW: Convert research to verified data points
  const verifiedResearch = this.dataQualityManager.verifyResearchOutput(research);

  // Continue with verified data...
}
```

### Phase 3: Testing & Refinement (Priority 3)

#### 3.1 Test with Flyberry
```bash
npm run professional -- --brand "Flyberry Gourmet" --industry "Food & Beverage"
```

Expected output:
- Part 1: Brand Discovery with verified tables
- Part 2: Brand Strategy with citations
- DATA-VERIFICATION-LOG.md
- brand-book.html with verification badges

#### 3.2 Verify Data Quality
- Check all prices have sources
- Verify tier classifications are correct
- Ensure recency is tracked
- Confirm citations are formatted

---

## File Structure

```
src/
├── agents/
│   └── brand-discovery-agent.ts (NEW - 400 lines)
├── services/
│   ├── data-quality-manager.ts (NEW - 200 lines)
│   └── enhanced-report-generator.ts (NEW - 500 lines)
├── config/
│   └── data-quality-standards.ts (EXISTS - 200 lines)
├── types/
│   ├── verification-types.ts (NEW - 100 lines)
│   └── discovery-types.ts (NEW - 150 lines)
└── modes/
    └── professional-mode.ts (MODIFY - add discovery phase)
```

---

## Benefits

### Automatic:
1. ✅ Brand Discovery phase with actual data
2. ✅ All prices verified with sources
3. ✅ Distribution channels confirmed
4. ✅ Customer reviews collected with quotes
5. ✅ Tables formatted automatically
6. ✅ Citations inserted for every claim
7. ✅ Verification tiers assigned (✅/✓/⚠️/ⓘ)
8. ✅ Data recency tracked
9. ✅ Verification log generated
10. ✅ HTML report with badges

### For Every Brand:
- No manual data entry
- Consistent formatting
- Verifiable claims
- Up-to-date information
- Professional presentation

---

## Rollout Plan

### Week 1: Core Infrastructure
- Day 1-2: BrandDiscoveryAgent
- Day 3-4: DataQualityManager
- Day 5: Integration with professional-mode

### Week 2: Enhanced Reporting
- Day 1-2: EnhancedReportGenerator
- Day 3: Table formatters
- Day 4: Citation system
- Day 5: HTML enhancements

### Week 3: Testing
- Day 1-2: Test with Flyberry
- Day 3: Test with 2 other brands
- Day 4-5: Bug fixes and refinements

---

## Success Metrics

- [ ] 100% of prices have source citations
- [ ] 100% of claims have verification tiers
- [ ] 0 manual data entry required
- [ ] <5 minutes end-to-end generation time
- [ ] 90%+ data accuracy (verified)
- [ ] Reports look professional (tables, not bullets)
- [ ] Data freshness <30 days for Tier 1
- [ ] Verification log auto-generated

---

## Next Action

**Start Implementation**:
```bash
# Create new agent
touch src/agents/brand-discovery-agent.ts

# Implement discovery workflow
# Test with Flyberry
# Iterate based on results
```

Would you like me to proceed with implementation now?
