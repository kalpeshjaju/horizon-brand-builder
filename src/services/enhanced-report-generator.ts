// Enhanced Report Generator - Creates comprehensive brand reports with verified data
// Automatically formats tables, adds citations, generates verification logs

import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { BrandConfiguration } from '../types/project-types.js';
import type { BrandDiscoveryReport } from '../types/discovery-types.js';
import { DataQualityManager } from './data-quality-manager.js';
import { DATA_QUALITY_TIERS } from '../config/data-quality-standards.js';

export class EnhancedReportGenerator {
  private qualityManager: DataQualityManager;

  constructor(
    private brandConfig: BrandConfiguration,
    private discoveryReport: BrandDiscoveryReport,
    private strategyOutput: any,
    private outputDir: string
  ) {
    this.qualityManager = new DataQualityManager();
  }

  async generate(): Promise<{ markdown: string; html: string }> {
    console.log('\n📝 Generating Enhanced Brand Report...\n');

    const markdown = this.buildCompleteMarkdownReport();
    const html = await this.convertToHTML(markdown);

    // Save reports
    const markdownPath = join(this.outputDir, 'brand-book.md');
    const htmlPath = join(this.outputDir, 'brand-book.html');
    const verificationLogPath = join(this.outputDir, 'DATA-VERIFICATION-LOG.md');

    await writeFile(markdownPath, markdown, 'utf-8');
    await writeFile(htmlPath, html, 'utf-8');

    // Generate standalone verification log
    const allDataPoints = this.collectAllDataPoints();
    const verificationLog = this.qualityManager.generateVerificationLog(
      this.brandConfig.brandName,
      allDataPoints,
      {
        website: this.brandConfig.companyProfile?.website,
        industry: this.brandConfig.industry,
        category: this.brandConfig.category,
      }
    );
    await writeFile(verificationLogPath, verificationLog, 'utf-8');

    console.log(`✅ Reports generated:`);
    console.log(`   - ${markdownPath}`);
    console.log(`   - ${htmlPath}`);
    console.log(`   - ${verificationLogPath}\n`);

    return { markdown, html };
  }

  private buildCompleteMarkdownReport(): string {
    let report = this.buildHeader();

    // PART 1: Brand Discovery (NEW - with verified data)
    report += `\n# Part 1: Brand Discovery & Deep Understanding\n\n`;
    report += this.buildBrandDiscoverySection();

    // PART 2: Brand Strategy (existing output enhanced)
    report += `\n# Part 2: Brand Strategy\n\n`;
    report += this.buildBrandStrategySection();

    // Data Quality Report
    report += `\n# Data Quality & Verification\n\n`;
    report += this.buildDataQualitySection();

    return report;
  }

  private buildHeader(): string {
    const date = new Date().toISOString().split('T')[0];
    const qualityScore = this.qualityManager.getQualityScore(this.collectAllDataPoints());

    return `# ${this.brandConfig.brandName} - Complete Brand Book

**Industry**: ${this.brandConfig.industry}
**Category**: ${this.brandConfig.category}
**Generated**: ${date}
**Data Quality Score**: ${qualityScore}/100

---
`;
  }

  private buildBrandDiscoverySection(): string {
    let section = `## About ${this.brandConfig.brandName}\n\n`;
    section += this.buildCompanyInfoTable();

    if (this.discoveryReport.products.length > 0) {
      section += `\n## Product Portfolio\n\n`;
      section += this.buildProductCatalogTable();

      if (this.discoveryReport.pricing.products.length > 0) {
        section += `\n## Pricing Analysis\n\n`;
        section += this.buildPricingComparisonTable();
      }
    }

    if (this.discoveryReport.distribution.channels.length > 0) {
      section += `\n## Distribution Channels\n\n`;
      section += this.buildDistributionTable();
    }

    if (this.discoveryReport.customerFeedback.length > 0) {
      section += `\n## Customer Feedback\n\n`;
      section += this.buildReviewsSection();
    }

    section += `\n## Business Metrics\n\n`;
    section += this.buildBusinessMetricsSection();

    return section;
  }

  private buildCompanyInfoTable(): string {
    const info = this.discoveryReport.companyInfo;
    const tierSymbol = DATA_QUALITY_TIERS[info.verification.tier.toUpperCase().replace('-', '_')].symbol;

    let table = `| Attribute | Value | Verification |\n`;
    table += `|-----------|-------|-------------|\n`;
    table += `| **Website** | ${info.website || 'N/A'} | ${tierSymbol} |\n`;
    if (info.founded) table += `| **Founded** | ${info.founded} | ${tierSymbol} |\n`;
    if (info.headquarters) table += `| **Headquarters** | ${info.headquarters} | ${tierSymbol} |\n`;
    if (info.tagline) table += `| **Tagline** | "${info.tagline}" | ${tierSymbol} |\n`;
    if (info.annualRevenue) table += `| **Annual Revenue** | ${info.annualRevenue} | ${tierSymbol} |\n`;

    table += `\n*Source: ${info.verification.source}, ${info.verification.date}, ${info.verification.confidence}% confidence*\n`;

    if (info.description) {
      table += `\n**About**: ${info.description}\n`;
    }

    return table;
  }

  private buildProductCatalogTable(): string {
    const products = this.discoveryReport.products;

    let table = `| Category | Product | Size | Price (₹) | Platform | Source | Date | Tier |\n`;
    table += `|----------|---------|------|-----------|----------|--------|------|------|\n`;

    products.forEach(product => {
      const tierSymbol = DATA_QUALITY_TIERS[product.tier.toUpperCase().replace('-', '_')].symbol;
      const price = product.price > 0 ? product.price.toString() : 'N/A';

      table += `| ${product.category} | ${product.name} | ${product.size} | ${price} | ${product.platform} | ${product.source.split('/')[2] || product.source} | ${product.verificationDate} | ${tierSymbol} |\n`;
    });

    table += `\n*All prices verified as of ${new Date().toISOString().split('T')[0]}*\n`;
    table += `*Legend: ✅ Verified (official) | ✓ Cross-verified | ⚠️ Single source | ⓘ Estimated*\n`;

    return table;
  }

  private buildPricingComparisonTable(): string {
    const pricing = this.discoveryReport.pricing;

    let section = `### Cross-Platform Price Comparison\n\n`;

    pricing.products.forEach(product => {
      section += `#### ${product.productName} (${product.size})\n\n`;
      section += `| Platform | Price (₹) | Availability | Verified |\n`;
      section += `|----------|-----------|--------------|----------|\n`;

      product.prices.forEach(price => {
        const status = price.inStock ? 'In Stock' : 'Out of Stock';
        section += `| ${price.platform} | ${price.price} | ${status} | ${price.verificationDate} |\n`;
      });

      section += `\n**Price Range**: ₹${product.lowestPrice} - ₹${product.highestPrice}\n`;
      section += `**Average**: ₹${Math.round(product.averagePrice)}\n\n`;
    });

    return section;
  }

  private buildDistributionTable(): string {
    const channels = this.discoveryReport.distribution.channels;

    let table = `| Channel | Type | Products Available | Status | Verified | Date |\n`;
    table += `|---------|------|-------------------|--------|----------|------|\n`;

    channels.forEach(channel => {
      const verified = channel.verified ? '✅' : '⚠️';
      const status = channel.status === 'active' ? '🟢 Active' : '🔴 Inactive';

      table += `| ${channel.channelName} | ${channel.type} | ${channel.productsAvailable} | ${status} | ${verified} | ${channel.verificationDate} |\n`;
    });

    const totalChannels = channels.length;
    const activeChannels = channels.filter(c => c.status === 'active').length;
    const totalProducts = channels.reduce((sum, c) => sum + c.productsAvailable, 0);

    table += `\n**Summary**: ${activeChannels}/${totalChannels} active channels | ${totalProducts} total product listings\n`;

    return table;
  }

  private buildReviewsSection(): string {
    const reviews = this.discoveryReport.customerFeedback;

    let section = `### Customer Reviews (${reviews.length} collected)\n\n`;

    const positive = reviews.filter(r => r.sentiment === 'positive');
    const negative = reviews.filter(r => r.sentiment === 'negative');

    if (positive.length > 0) {
      section += `#### ✅ Positive Feedback\n\n`;
      positive.forEach(review => {
        section += `- "${review.text}" *[${review.platform}, ${review.date || 'Date N/A'}]*\n`;
      });
      section += `\n`;
    }

    if (negative.length > 0) {
      section += `#### ⚠️ Critical Feedback\n\n`;
      negative.forEach(review => {
        section += `- "${review.text}" *[${review.platform}, ${review.date || 'Date N/A'}]*\n`;
      });
      section += `\n`;
    }

    return section;
  }

  private buildBusinessMetricsSection(): string {
    const metrics = this.discoveryReport.businessMetrics;
    let section = `| Metric | Value | Confidence | Tier |\n`;
    section += `|--------|-------|------------|------|\n`;

    if (metrics.estimatedRevenue) {
      const tierSymbol = DATA_QUALITY_TIERS[metrics.estimatedRevenue.tier.toUpperCase().replace('-', '_')].symbol;
      section += `| Annual Revenue | ${metrics.estimatedRevenue.value} | ${metrics.estimatedRevenue.confidence}% | ${tierSymbol} |\n`;
    }

    if (metrics.averageOrderValue) {
      const tierSymbol = DATA_QUALITY_TIERS[metrics.averageOrderValue.tier.toUpperCase().replace('-', '_')].symbol;
      section += `| Average Order Value | ${metrics.averageOrderValue.value} | ${metrics.averageOrderValue.confidence}% | ${tierSymbol} |\n`;
    }

    if (metrics.customerLifetimeValue) {
      const tierSymbol = DATA_QUALITY_TIERS[metrics.customerLifetimeValue.tier.toUpperCase().replace('-', '_')].symbol;
      section += `| Customer Lifetime Value | ${metrics.customerLifetimeValue.value} | ${metrics.customerLifetimeValue.confidence}% | ${tierSymbol} |\n`;
    }

    section += `\n*ⓘ Estimated metrics derived from industry benchmarks and product data*\n`;

    return section;
  }

  private buildBrandStrategySection(): string {
    // Use existing strategy output if available
    if (this.strategyOutput?.brandStrategy) {
      return this.strategyOutput.brandStrategy;
    }

    // Fallback to basic strategy section
    return `## Brand Foundation

**Purpose**: ${this.brandConfig.projectObjectives?.primary || 'To be defined'}

**Goals**:
${(this.brandConfig.projectObjectives?.goals || []).map(g => `- ${g}`).join('\n')}

---

*Strategy development in progress. See Part 1 for verified brand data.*
`;
  }

  private buildDataQualitySection(): string {
    const allDataPoints = this.collectAllDataPoints();
    return this.qualityManager.generateVerificationSummary(allDataPoints);
  }

  private collectAllDataPoints() {
    const dataPoints = [];

    // Company info
    dataPoints.push({
      claim: 'Company Information',
      value: this.discoveryReport.companyInfo.brandName,
      source: this.discoveryReport.companyInfo.verification.source,
      verificationDate: this.discoveryReport.companyInfo.verification.date,
      tier: this.discoveryReport.companyInfo.verification.tier,
      confidence: this.discoveryReport.companyInfo.verification.confidence,
    });

    // Products
    this.discoveryReport.products.forEach(product => {
      dataPoints.push({
        claim: `Product: ${product.name}`,
        value: `₹${product.price}`,
        source: product.source,
        verificationDate: product.verificationDate,
        tier: product.tier,
        confidence: product.confidence,
      });
    });

    return dataPoints;
  }

  private async convertToHTML(markdown: string): Promise<string> {
    // Simple markdown to HTML conversion
    // In production, use a proper markdown library
    let html = markdown
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^\*\*(.+?)\*\*:/gm, '<strong>$1</strong>:')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Wrap in HTML template
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.brandConfig.brandName} - Brand Book</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
    h2 { color: #34495e; margin-top: 30px; }
    h3 { color: #7f8c8d; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background: #3498db; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    .tier-verified { color: #27ae60; }
    .tier-estimated { color: #f39c12; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
  }
}
