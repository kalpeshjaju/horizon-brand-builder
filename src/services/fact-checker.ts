// Fact-Checking Service - Validate LLM-generated claims
// Version 2.0

import type {
  SourcedClaim,
  FactCheckResult,
  ConfidenceLevel,
  ValidationResult,
} from '../types/research-types.js';
import { WebResearchService } from './web-research-service.js';

export class FactCheckerService {
  private webResearch: WebResearchService;

  constructor() {
    this.webResearch = new WebResearchService();
  }

  async checkClaim(claim: string, context: string): Promise<FactCheckResult> {
    console.log(`\n🔍 Fact-checking: "${claim.substring(0, 100)}..."\n`);

    // Detect if claim contains statistics
    const hasStatistics = this.detectStatistics(claim).length > 0;

    if (hasStatistics) {
      return this.checkStatisticalClaim(claim, context);
    } else {
      return this.checkQualitativeClaim(claim, context);
    }
  }

  detectStatistics(text: string): string[] {
    const patterns = [
      /\d+(?:\.\d+)?%/g, // Percentages (23%, 18.5%)
      /\d+(?:\.\d+)?\s*(?:CAGR|cagr)/gi, // CAGR
      /\$\d+(?:\.\d+)?[BMK]?/gi, // Money ($50M, $2.3B)
      /\d+(?:\.\d+)?x/gi, // Multiples (3x, 2.5x)
      /\d+,\d+/g, // Numbers with commas (10,000)
    ];

    const statistics: string[] = [];

    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        statistics.push(...matches);
      }
    }

    return [...new Set(statistics)]; // Remove duplicates
  }

  private async checkStatisticalClaim(claim: string, context: string): Promise<FactCheckResult> {
    console.log('   📊 Statistical claim detected - validating...\n');

    // Extract statistics from claim
    const stats = this.detectStatistics(claim);

    // Try to validate via web search
    const validationResult = await this.webResearch.validateStatistic(claim, context);

    // Determine confidence and recommendation
    const confidence: ConfidenceLevel = validationResult.confidence || 'unverified';
    let recommendedAction: 'accept' | 'verify' | 'reject' | 'needs_review' = 'needs_review';

    if (confidence === 'high') {
      recommendedAction = 'accept';
    } else if (confidence === 'medium') {
      recommendedAction = 'verify';
    } else if (confidence === 'low') {
      recommendedAction = 'verify';
    } else {
      recommendedAction = 'needs_review';
    }

    return {
      claim,
      isVerified: confidence === 'high',
      confidence,
      sources: [validationResult],
      recommendedAction,
      notes: this.generateVerificationNotes(claim, stats, confidence),
    };
  }

  private async checkQualitativeClaim(claim: string, context: string): Promise<FactCheckResult> {
    console.log('   📝 Qualitative claim - assigning confidence based on context...\n');

    // For qualitative claims, assess confidence based on:
    // 1. Specificity (specific claims more verifiable)
    // 2. Context (industry knowledge)
    // 3. Source availability

    const confidence = this.assessQualitativeConfidence(claim);

    return {
      claim,
      isVerified: false,
      confidence,
      sources: [],
      recommendedAction: confidence === 'high' ? 'accept' : 'verify',
      notes: `Qualitative claim assessed as ${confidence} confidence. ${
        confidence === 'low' ? 'Consider providing evidence or sources.' : ''
      }`,
    };
  }

  private assessQualitativeConfidence(claim: string): ConfidenceLevel {
    // Simple heuristic-based confidence assessment
    const lowerClaim = claim.toLowerCase();

    // Low confidence indicators
    const lowConfidenceKeywords = [
      'likely',
      'probably',
      'might',
      'could',
      'possibly',
      'seems',
      'appears',
    ];

    // High confidence indicators
    const highConfidenceKeywords = [
      'leading',
      'established',
      'known for',
      'recognized',
      'standard',
      'typical',
    ];

    if (lowConfidenceKeywords.some(keyword => lowerClaim.includes(keyword))) {
      return 'low';
    }

    if (highConfidenceKeywords.some(keyword => lowerClaim.includes(keyword))) {
      return 'medium';
    }

    // Default to medium for neutral claims
    return 'medium';
  }

  private generateVerificationNotes(claim: string, stats: string[], confidence: ConfidenceLevel): string {
    const notes: string[] = [];

    if (stats.length > 0) {
      notes.push(`Contains ${stats.length} statistic(s): ${stats.join(', ')}`);
    }

    if (confidence === 'unverified') {
      notes.push('⚠️ Unable to verify this claim via web research.');
      notes.push('Recommendation: Provide source or replace with verified data.');
    } else if (confidence === 'low') {
      notes.push('⚠️ Low confidence in this claim.');
      notes.push('Recommendation: Seek additional verification before using in critical decisions.');
    } else if (confidence === 'medium') {
      notes.push('✅ Moderate confidence in this claim.');
      notes.push('Recommendation: Acceptable for strategic planning, verify for external communications.');
    } else {
      notes.push('✅ High confidence in this claim.');
      notes.push('Verified via web research.');
    }

    return notes.join(' ');
  }

  async batchCheckClaims(claims: string[], context: string): Promise<Map<string, FactCheckResult>> {
    console.log(`\n🔄 Batch fact-checking ${claims.length} claims...\n`);

    const results = new Map<string, FactCheckResult>();

    for (const claim of claims) {
      const result = await this.checkClaim(claim, context);
      results.set(claim, result);

      // Small delay to avoid overwhelming APIs
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  }

  generateConfidenceReport(claims: SourcedClaim[]): {
    overallConfidence: ConfidenceLevel;
    breakdown: Record<ConfidenceLevel, number>;
    flaggedClaims: SourcedClaim[];
  } {
    const breakdown: Record<ConfidenceLevel, number> = {
      high: 0,
      medium: 0,
      low: 0,
      unverified: 0,
    };

    for (const claim of claims) {
      breakdown[claim.confidence] = (breakdown[claim.confidence] || 0) + 1;
    }

    // Calculate overall confidence
    const total = claims.length;
    const highPercentage = (breakdown.high / total) * 100;
    const mediumPercentage = (breakdown.medium / total) * 100;

    let overallConfidence: ConfidenceLevel;
    if (highPercentage >= 70) {
      overallConfidence = 'high';
    } else if (highPercentage + mediumPercentage >= 60) {
      overallConfidence = 'medium';
    } else {
      overallConfidence = 'low';
    }

    // Flag low confidence and unverified claims
    const flaggedClaims = claims.filter(
      c => c.confidence === 'low' || c.confidence === 'unverified'
    );

    return {
      overallConfidence,
      breakdown,
      flaggedClaims,
    };
  }

  validateInput(data: any, schema: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation logic
    // In production, would use a proper validation library like Zod or Joi

    if (!data) {
      errors.push('Data is required');
      return {
        isValid: false,
        errors,
        warnings,
        confidence: 'low',
      };
    }

    // Check for required fields in schema
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in data) || data[field] === undefined || data[field] === null) {
          errors.push(`Required field missing: ${field}`);
        }
      }
    }

    // Check for suspicious values
    if (typeof data === 'object') {
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
          warnings.push(`Suspicious numeric value for ${key}: ${value}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      confidence: errors.length === 0 ? 'high' : 'low',
    };
  }
}

// Factory function
export function createFactChecker(): FactCheckerService {
  return new FactCheckerService();
}
