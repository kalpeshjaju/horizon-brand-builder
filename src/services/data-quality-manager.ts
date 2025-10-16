// Data Quality Manager - Classifies, verifies, and formats brand data
// Implements 4-tier verification system: ✅ Verified, ✓ Cross-Verified, ⚠️ Single Source, ⓘ Estimated

import {
  DATA_QUALITY_TIERS,
  type VerifiedDataPoint,
  type DataVerificationReport,
  calculateDataAge,
} from '../config/data-quality-standards.js';

export class DataQualityManager {
  /**
   * Classify a data point into one of 4 verification tiers
   */
  classifyDataPoint(
    claim: string,
    value: any,
    source: string,
    verificationDate: string,
    numSources: number = 1,
    sourceType: 'official' | 'third-party' | 'calculated' = 'third-party'
  ): VerifiedDataPoint {
    const age = calculateDataAge(verificationDate);
    let tier: 'verified' | 'cross-verified' | 'single-source' | 'estimated';
    let confidence: number;

    // Classification logic based on source quality, age, and cross-verification
    if (sourceType === 'official' && age <= 30 && numSources >= 1) {
      // Direct from brand website or official channels, fresh data
      tier = 'verified';
      confidence = 95;
    } else if (numSources >= 2 && age <= 90) {
      // Multiple independent sources confirm
      tier = 'cross-verified';
      confidence = 85 - Math.floor(age / 10); // Decrease confidence with age
    } else if (numSources === 1 && age <= 180 && sourceType === 'third-party') {
      // Single credible source
      tier = 'single-source';
      confidence = 70 - Math.floor(age / 20);
    } else if (sourceType === 'calculated') {
      // Derived from other data or industry benchmarks
      tier = 'estimated';
      confidence = 50;
    } else {
      // Stale or questionable data
      tier = 'estimated';
      confidence = 40;
    }

    return {
      claim,
      value,
      source,
      verificationDate,
      tier,
      confidence,
    };
  }

  /**
   * Format citation for a verified data point
   * Example: "✅ *[Source: flyberry.in, Oct 2025, 95% confidence]*"
   */
  formatCitation(dataPoint: VerifiedDataPoint, includeSymbol: boolean = true): string {
    const tierInfo = DATA_QUALITY_TIERS[dataPoint.tier.toUpperCase().replace('-', '_')];
    const symbol = includeSymbol ? `${tierInfo.symbol} ` : '';

    return `${symbol}*[Source: ${dataPoint.source}, ${dataPoint.verificationDate}, ${dataPoint.confidence}% confidence]*`;
  }

  /**
   * Format inline value with citation
   * Example: "₹24 Crores ✓ *[Source: Tracxn.com, March 2024, 85% confidence]*"
   */
  formatValueWithCitation(dataPoint: VerifiedDataPoint): string {
    const tierInfo = DATA_QUALITY_TIERS[dataPoint.tier.toUpperCase().replace('-', '_')];
    return `${dataPoint.value} ${tierInfo.symbol}\n${this.formatCitation(dataPoint, false)}`;
  }

  /**
   * Generate markdown table row with verification
   */
  formatTableRow(
    columns: string[],
    dataPoint: VerifiedDataPoint,
    includeVerificationColumns: boolean = true
  ): string {
    const tierInfo = DATA_QUALITY_TIERS[dataPoint.tier.toUpperCase().replace('-', '_')];

    if (includeVerificationColumns) {
      // Add source, date, and tier columns
      return `| ${columns.join(' | ')} | ${dataPoint.source} | ${dataPoint.verificationDate} | ${tierInfo.symbol} |`;
    } else {
      return `| ${columns.join(' | ')} |`;
    }
  }

  /**
   * Generate verification summary for a collection of data points
   */
  generateVerificationSummary(dataPoints: VerifiedDataPoint[]): string {
    const report = this.generateVerificationReport(dataPoints);

    let summary = `## Data Verification Summary\n\n`;
    summary += `**Total Data Points**: ${report.totalClaims}\n`;
    summary += `**Average Confidence**: ${report.averageConfidence.toFixed(1)}%\n\n`;

    summary += `**Breakdown by Tier**:\n`;
    summary += `- ✅ Verified: ${report.verified} (${((report.verified / report.totalClaims) * 100).toFixed(0)}%)\n`;
    summary += `- ✓ Cross-Verified: ${report.crossVerified} (${((report.crossVerified / report.totalClaims) * 100).toFixed(0)}%)\n`;
    summary += `- ⚠️ Single Source: ${report.singleSource} (${((report.singleSource / report.totalClaims) * 100).toFixed(0)}%)\n`;
    summary += `- ⓘ Estimated: ${report.estimated} (${((report.estimated / report.totalClaims) * 100).toFixed(0)}%)\n\n`;

    if (report.staleClaims.length > 0) {
      summary += `**⚠️ Stale Data Warning**: ${report.staleClaims.length} data points are older than recommended\n`;
    }

    summary += `**Verification Date**: ${new Date().toISOString().split('T')[0]}\n`;

    return summary;
  }

  /**
   * Generate full verification report
   */
  generateVerificationReport(dataPoints: VerifiedDataPoint[]): DataVerificationReport {
    const report: DataVerificationReport = {
      totalClaims: dataPoints.length,
      verified: 0,
      crossVerified: 0,
      singleSource: 0,
      estimated: 0,
      unverified: 0,
      averageConfidence: 0,
      staleClaims: [],
      missingSources: [],
    };

    let totalConfidence = 0;

    dataPoints.forEach(point => {
      totalConfidence += point.confidence;
      const age = calculateDataAge(point.verificationDate);

      // Count by tier
      switch (point.tier) {
        case 'verified':
          report.verified++;
          break;
        case 'cross-verified':
          report.crossVerified++;
          break;
        case 'single-source':
          report.singleSource++;
          break;
        case 'estimated':
          report.estimated++;
          break;
      }

      // Check for stale data
      const tierDef = DATA_QUALITY_TIERS[point.tier.toUpperCase().replace('-', '_')];
      if (tierDef && age > tierDef.maxAge) {
        report.staleClaims.push({ claim: point.claim, age });
      }

      // Check for missing sources
      if (!point.source || point.source.trim() === '') {
        report.missingSources.push({ claim: point.claim, section: 'unknown' });
      }
    });

    report.averageConfidence = dataPoints.length > 0 ? totalConfidence / dataPoints.length : 0;

    return report;
  }

  /**
   * Generate detailed markdown verification log
   */
  generateVerificationLog(
    brandName: string,
    dataPoints: VerifiedDataPoint[],
    metadata: { website?: string; industry?: string; category?: string }
  ): string {
    const report = this.generateVerificationReport(dataPoints);
    const date = new Date().toISOString().split('T')[0];

    let log = `# ${brandName} - Data Verification Log\n\n`;
    log += `**Report Generated**: ${date}\n`;
    log += `**Brand**: ${brandName}\n`;
    if (metadata.website) log += `**Website**: ${metadata.website}\n`;
    if (metadata.industry) log += `**Industry**: ${metadata.industry}\n`;
    if (metadata.category) log += `**Category**: ${metadata.category}\n`;
    log += `\n---\n\n`;

    // Summary
    log += this.generateVerificationSummary(dataPoints);
    log += `\n---\n\n`;

    // Tier 1: Verified Data
    const verifiedData = dataPoints.filter(p => p.tier === 'verified');
    if (verifiedData.length > 0) {
      log += `## ✅ Verified Data (Tier 1)\n\n`;
      log += `*Source: Official channels, <30 days old, 95-100% confidence*\n\n`;
      log += `| Claim | Value | Source | Date | Confidence |\n`;
      log += `|-------|-------|--------|------|------------|\n`;
      verifiedData.forEach(point => {
        log += `| ${point.claim} | ${point.value} | ${point.source} | ${point.verificationDate} | ${point.confidence}% |\n`;
      });
      log += `\n`;
    }

    // Tier 2: Cross-Verified
    const crossVerified = dataPoints.filter(p => p.tier === 'cross-verified');
    if (crossVerified.length > 0) {
      log += `## ✓ Cross-Verified Data (Tier 2)\n\n`;
      log += `*Source: 2+ independent sources, <90 days old, 80-94% confidence*\n\n`;
      log += `| Claim | Value | Source | Date | Confidence |\n`;
      log += `|-------|-------|--------|------|------------|\n`;
      crossVerified.forEach(point => {
        log += `| ${point.claim} | ${point.value} | ${point.source} | ${point.verificationDate} | ${point.confidence}% |\n`;
      });
      log += `\n`;
    }

    // Tier 3: Single Source
    const singleSource = dataPoints.filter(p => p.tier === 'single-source');
    if (singleSource.length > 0) {
      log += `## ⚠️ Single Source Data (Tier 3)\n\n`;
      log += `*Source: 1 credible source, <180 days old, 60-79% confidence*\n\n`;
      log += `| Claim | Value | Source | Date | Confidence |\n`;
      log += `|-------|-------|--------|------|------------|\n`;
      singleSource.forEach(point => {
        log += `| ${point.claim} | ${point.value} | ${point.source} | ${point.verificationDate} | ${point.confidence}% |\n`;
      });
      log += `\n`;
    }

    // Tier 4: Estimated
    const estimated = dataPoints.filter(p => p.tier === 'estimated');
    if (estimated.length > 0) {
      log += `## ⓘ Estimated Data (Tier 4)\n\n`;
      log += `*Source: Industry benchmarks or calculations, 40-59% confidence*\n\n`;
      log += `| Claim | Value | Source | Date | Confidence |\n`;
      log += `|-------|-------|--------|------|------------|\n`;
      estimated.forEach(point => {
        log += `| ${point.claim} | ${point.value} | ${point.source} | ${point.verificationDate} | ${point.confidence}% |\n`;
      });
      log += `\n`;
    }

    // Warnings
    if (report.staleClaims.length > 0) {
      log += `## ⚠️ Data Freshness Warnings\n\n`;
      log += `The following data points exceed the recommended freshness threshold:\n\n`;
      report.staleClaims.forEach(stale => {
        log += `- **${stale.claim}**: ${stale.age} days old (needs refresh)\n`;
      });
      log += `\n`;
    }

    // Footer
    log += `---\n\n`;
    log += `**Next Update Due**: ${this.getNextUpdateDate(date)}\n`;
    log += `**Verification Standards**: See ACCURACY-FRAMEWORK.md\n`;

    return log;
  }

  /**
   * Helper: Calculate next update date (30 days from now)
   */
  private getNextUpdateDate(currentDate: string): string {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  }

  /**
   * Validate data point quality
   */
  isHighQuality(dataPoint: VerifiedDataPoint): boolean {
    return dataPoint.confidence >= 80;
  }

  /**
   * Check if data is stale
   */
  isStale(dataPoint: VerifiedDataPoint): boolean {
    const age = calculateDataAge(dataPoint.verificationDate);
    const tierDef = DATA_QUALITY_TIERS[dataPoint.tier.toUpperCase().replace('-', '_')];
    return tierDef ? age > tierDef.maxAge : true;
  }

  /**
   * Get quality score (0-100) for a set of data points
   */
  getQualityScore(dataPoints: VerifiedDataPoint[]): number {
    if (dataPoints.length === 0) return 0;

    const report = this.generateVerificationReport(dataPoints);

    // Weight by tier: Verified=100%, Cross=85%, Single=70%, Estimated=50%
    const score =
      (report.verified * 100 +
        report.crossVerified * 85 +
        report.singleSource * 70 +
        report.estimated * 50) /
      report.totalClaims;

    return Math.round(score);
  }
}
