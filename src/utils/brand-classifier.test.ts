// Tests for brand classification logic

import { describe, it, expect } from 'vitest';
import { BrandClassifier } from './brand-classifier.js';
import type { BrandProfile } from '../types/brand-types.js';

describe('BrandClassifier.classify', () => {
  describe('ecommerce_fashion classification', () => {
    it('should classify fashion brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Fashion',
        targetAudience: 'Young professionals',
      };
      expect(BrandClassifier.classify(profile)).toBe('ecommerce_fashion');
    });

    it('should classify apparel brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Apparel manufacturing',
        targetAudience: 'Consumers',
      };
      expect(BrandClassifier.classify(profile)).toBe('ecommerce_fashion');
    });

    it('should classify clothing brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Clothing retail',
        targetAudience: 'Fashion enthusiasts',
      };
      expect(BrandClassifier.classify(profile)).toBe('ecommerce_fashion');
    });

    it('should classify ecommerce brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'ecommerce',
        targetAudience: 'Online shoppers',
      };
      expect(BrandClassifier.classify(profile)).toBe('ecommerce_fashion');
    });

    it('should classify e-commerce brand with hyphen', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'E-commerce platform',
        targetAudience: 'Consumers',
      };
      expect(BrandClassifier.classify(profile)).toBe('ecommerce_fashion');
    });
  });

  describe('luxury_premium classification', () => {
    it('should classify luxury brand by industry', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Luxury goods',
        targetAudience: 'Affluent consumers',
      };
      expect(BrandClassifier.classify(profile)).toBe('luxury_premium');
    });

    it('should classify premium brand by context', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Jewelry',
        targetAudience: 'High net worth individuals',
        additionalContext: 'Premium positioning',
      };
      expect(BrandClassifier.classify(profile)).toBe('luxury_premium');
    });

    it('should classify high-end brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Watches',
        targetAudience: 'Collectors',
        additionalContext: 'High-end Swiss timepieces',
      };
      expect(BrandClassifier.classify(profile)).toBe('luxury_premium');
    });

    it('should classify exclusive brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Jewelry',
        targetAudience: 'VIP clients',
        additionalContext: 'Exclusive membership',
      };
      expect(BrandClassifier.classify(profile)).toBe('luxury_premium');
    });
  });

  describe('saas_b2b classification', () => {
    it('should classify SaaS brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'SaaS',
        targetAudience: 'Businesses',
      };
      expect(BrandClassifier.classify(profile)).toBe('saas_b2b');
    });

    it('should classify software brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Software development',
        targetAudience: 'Enterprises',
      };
      expect(BrandClassifier.classify(profile)).toBe('saas_b2b');
    });

    it('should classify platform brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Technology',
        targetAudience: 'Developers',
        additionalContext: 'Cloud platform',
      };
      expect(BrandClassifier.classify(profile)).toBe('saas_b2b');
    });

    it('should classify tech B2B brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Tech',
        targetAudience: 'B2B customers',
      };
      expect(BrandClassifier.classify(profile)).toBe('saas_b2b');
    });
  });

  describe('b2b_enterprise classification', () => {
    it('should classify B2B brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Manufacturing',
        targetAudience: 'B2B clients',
      };
      expect(BrandClassifier.classify(profile)).toBe('b2b_enterprise');
    });

    it('should classify business-focused brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Consulting',
        targetAudience: 'Business leaders',
      };
      expect(BrandClassifier.classify(profile)).toBe('b2b_enterprise');
    });

    it('should classify enterprise brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Professional services',
        targetAudience: 'Enterprise companies',
      };
      expect(BrandClassifier.classify(profile)).toBe('b2b_enterprise');
    });

    it('should classify companies-focused brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Financial services',
        targetAudience: 'Companies and organizations',
      };
      expect(BrandClassifier.classify(profile)).toBe('b2b_enterprise');
    });
  });

  describe('personal_brand classification', () => {
    it('should classify personal brand by context', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Media',
        targetAudience: 'Followers',
        additionalContext: 'Personal brand',
      };
      expect(BrandClassifier.classify(profile)).toBe('personal_brand');
    });

    it('should classify influencer brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Social media',
        targetAudience: 'Audience',
        additionalContext: 'Influencer',
      };
      expect(BrandClassifier.classify(profile)).toBe('personal_brand');
    });

    it('should classify creator brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Content creation',
        targetAudience: 'Subscribers',
        additionalContext: 'Creator economy',
      };
      expect(BrandClassifier.classify(profile)).toBe('personal_brand');
    });

    it('should classify consultant brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Consulting',
        targetAudience: 'Clients',
        additionalContext: 'Independent consultant',
      };
      expect(BrandClassifier.classify(profile)).toBe('personal_brand');
    });
  });

  describe('startup_disruptor classification', () => {
    it('should classify startup by stage', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Technology',
        targetAudience: 'Early adopters',
        businessStage: 'startup',
      };
      expect(BrandClassifier.classify(profile)).toBe('startup_disruptor');
    });

    it('should classify disruptive brand by context', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Fintech',
        targetAudience: 'Consumers',
        additionalContext: 'Disrupting traditional banking',
      };
      expect(BrandClassifier.classify(profile)).toBe('startup_disruptor');
    });

    it('should classify innovative brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Healthcare',
        targetAudience: 'Patients',
        additionalContext: 'Innovative healthcare delivery',
      };
      expect(BrandClassifier.classify(profile)).toBe('startup_disruptor');
    });

    it('should classify new category brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Technology',
        targetAudience: 'Users',
        additionalContext: 'Creating a new category',
      };
      expect(BrandClassifier.classify(profile)).toBe('startup_disruptor');
    });
  });

  describe('b2c_consumer default classification', () => {
    it('should default to B2C for generic consumer brand', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Retail',
        targetAudience: 'Consumers',
      };
      expect(BrandClassifier.classify(profile)).toBe('b2c_consumer');
    });

    it('should default to B2C for unmatched patterns', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Food and beverage',
        targetAudience: 'Families',
      };
      expect(BrandClassifier.classify(profile)).toBe('b2c_consumer');
    });

    it('should default to B2C for minimal input', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Services',
        targetAudience: 'People',
      };
      expect(BrandClassifier.classify(profile)).toBe('b2c_consumer');
    });
  });

  describe('case insensitivity', () => {
    it('should handle uppercase industry', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'FASHION',
        targetAudience: 'Consumers',
      };
      expect(BrandClassifier.classify(profile)).toBe('ecommerce_fashion');
    });

    it('should handle mixed case audience', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Manufacturing',
        targetAudience: 'B2B Customers',
      };
      expect(BrandClassifier.classify(profile)).toBe('b2b_enterprise');
    });

    it('should handle uppercase context', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Jewelry',
        targetAudience: 'Collectors',
        additionalContext: 'PREMIUM POSITIONING',
      };
      expect(BrandClassifier.classify(profile)).toBe('luxury_premium');
    });
  });

  describe('priority order', () => {
    it('should prioritize fashion over luxury', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'Fashion',
        targetAudience: 'Affluent consumers',
        additionalContext: 'Luxury brand',
      };
      expect(BrandClassifier.classify(profile)).toBe('ecommerce_fashion');
    });

    it('should prioritize SaaS over B2B', () => {
      const profile: Partial<BrandProfile> = {
        industry: 'SaaS',
        targetAudience: 'B2B customers',
      };
      expect(BrandClassifier.classify(profile)).toBe('saas_b2b');
    });
  });

  describe('empty inputs', () => {
    it('should handle empty profile', () => {
      const profile: Partial<BrandProfile> = {};
      expect(BrandClassifier.classify(profile)).toBe('b2c_consumer');
    });

    it('should handle undefined fields', () => {
      const profile: Partial<BrandProfile> = {
        industry: undefined,
        targetAudience: undefined,
      };
      expect(BrandClassifier.classify(profile)).toBe('b2c_consumer');
    });
  });
});

describe('BrandClassifier.getConfidenceScore', () => {
  it('should return baseline score for weak match', () => {
    const profile: Partial<BrandProfile> = {
      industry: 'Generic',
      targetAudience: 'People',
    };
    const score = BrandClassifier.getConfidenceScore(profile, 'b2c_consumer');
    expect(score).toBe(0.5);
  });

  it('should return high confidence for ecommerce_fashion with multiple signals', () => {
    const profile: Partial<BrandProfile> = {
      industry: 'Fashion ecommerce',
      targetAudience: 'Fashion lovers',
      additionalContext: 'Apparel and clothing',
    };
    const score = BrandClassifier.getConfidenceScore(profile, 'ecommerce_fashion');
    expect(score).toBe(0.9);
  });

  it('should return high confidence for B2B with multiple signals', () => {
    const profile: Partial<BrandProfile> = {
      industry: 'B2B services',
      targetAudience: 'Enterprise businesses',
      additionalContext: 'B2B solutions',
    };
    const score = BrandClassifier.getConfidenceScore(profile, 'b2b_enterprise');
    expect(score).toBe(0.85);
  });

  it('should return baseline for mismatched type', () => {
    const profile: Partial<BrandProfile> = {
      industry: 'Fashion',
      targetAudience: 'Consumers',
    };
    const score = BrandClassifier.getConfidenceScore(profile, 'b2b_enterprise');
    expect(score).toBe(0.5);
  });

  it('should handle empty profile', () => {
    const profile: Partial<BrandProfile> = {};
    const score = BrandClassifier.getConfidenceScore(profile, 'b2c_consumer');
    expect(score).toBe(0.5);
  });

  it('should count signals case-insensitively', () => {
    const profile: Partial<BrandProfile> = {
      industry: 'FASHION',
      targetAudience: 'Fashion lovers',
      additionalContext: 'ECOMMERCE',
    };
    const score = BrandClassifier.getConfidenceScore(profile, 'ecommerce_fashion');
    expect(score).toBe(0.9);
  });
});
