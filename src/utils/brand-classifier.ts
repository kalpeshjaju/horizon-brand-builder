// Automatically classify brand type based on inputs

import type { BrandType, BrandProfile } from '../types/brand-types.js';

export class BrandClassifier {
  static classify(profile: Partial<BrandProfile>): BrandType {
    const industry = profile.industry?.toLowerCase() || '';
    const audience = profile.targetAudience?.toLowerCase() || '';
    const context = profile.additionalContext?.toLowerCase() || '';

    // Check for fashion/e-commerce
    if (
      industry.includes('fashion') ||
      industry.includes('apparel') ||
      industry.includes('clothing') ||
      industry.includes('ecommerce') ||
      industry.includes('e-commerce')
    ) {
      return 'ecommerce_fashion';
    }

    // Check for luxury
    if (
      industry.includes('luxury') ||
      context.includes('premium') ||
      context.includes('high-end') ||
      context.includes('exclusive')
    ) {
      return 'luxury_premium';
    }

    // Check for SaaS
    if (
      industry.includes('saas') ||
      industry.includes('software') ||
      context.includes('platform') ||
      (industry.includes('tech') && audience.includes('b2b'))
    ) {
      return 'saas_b2b';
    }

    // Check for B2B enterprise
    if (
      audience.includes('b2b') ||
      audience.includes('business') ||
      audience.includes('enterprise') ||
      audience.includes('companies')
    ) {
      return 'b2b_enterprise';
    }

    // Check for personal brand
    if (
      context.includes('personal') ||
      context.includes('influencer') ||
      context.includes('creator') ||
      context.includes('consultant')
    ) {
      return 'personal_brand';
    }

    // Check for startup/disruptor
    if (
      profile.businessStage === 'startup' ||
      context.includes('disrupt') ||
      context.includes('innovative') ||
      context.includes('new category')
    ) {
      return 'startup_disruptor';
    }

    // Default to B2C consumer
    return 'b2c_consumer';
  }

  static getConfidenceScore(profile: Partial<BrandProfile>, suggestedType: BrandType): number {
    // Simple confidence scoring (can be enhanced)
    let score = 0.5; // baseline

    const industry = profile.industry?.toLowerCase() || '';
    const audience = profile.targetAudience?.toLowerCase() || '';
    const context = profile.additionalContext?.toLowerCase() || '';

    // Increase confidence if multiple signals align
    const allText = `${industry} ${audience} ${context}`;

    if (suggestedType === 'ecommerce_fashion' &&
        (allText.match(/fashion|apparel|clothing|ecommerce/g) || []).length > 1) {
      score = 0.9;
    }

    if (suggestedType === 'b2b_enterprise' &&
        (allText.match(/b2b|business|enterprise/g) || []).length > 1) {
      score = 0.85;
    }

    return score;
  }
}
