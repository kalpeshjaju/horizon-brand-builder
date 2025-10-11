// Tests for input validation utilities

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateBrandProfile, validateApiKey, ValidationError } from './validators.js';
import type { BrandProfile } from '../types/brand-types.js';

describe('validateBrandProfile', () => {
  const validProfile: BrandProfile = {
    brandName: 'Test Brand',
    industry: 'Technology',
    targetAudience: 'Tech professionals',
    businessStage: 'startup',
    primaryGoal: 'launch',
    brandType: 'b2c_consumer',
  };

  it('should accept valid profile', () => {
    expect(() => validateBrandProfile(validProfile)).not.toThrow();
  });

  describe('required fields', () => {
    it('should reject empty brandName', () => {
      const profile = { ...validProfile, brandName: '' };
      expect(() => validateBrandProfile(profile)).toThrow(ValidationError);
      expect(() => validateBrandProfile(profile)).toThrow(/brandName is required/);
    });

    it('should reject whitespace-only brandName', () => {
      const profile = { ...validProfile, brandName: '   ' };
      expect(() => validateBrandProfile(profile)).toThrow(/brandName is required/);
    });

    it('should reject empty industry', () => {
      const profile = { ...validProfile, industry: '' };
      expect(() => validateBrandProfile(profile)).toThrow(/industry is required/);
    });

    it('should reject empty targetAudience', () => {
      const profile = { ...validProfile, targetAudience: '' };
      expect(() => validateBrandProfile(profile)).toThrow(/targetAudience is required/);
    });
  });

  describe('field length validation', () => {
    it('should reject brandName over 100 characters', () => {
      const profile = { ...validProfile, brandName: 'a'.repeat(101) };
      expect(() => validateBrandProfile(profile)).toThrow(/brandName must be 100 characters or less/);
    });

    it('should accept brandName with exactly 100 characters', () => {
      const profile = { ...validProfile, brandName: 'a'.repeat(100) };
      expect(() => validateBrandProfile(profile)).not.toThrow();
    });
  });

  describe('businessStage enum validation', () => {
    it('should accept valid businessStage values', () => {
      const stages: Array<'startup' | 'growth' | 'established' | 'rebrand'> = [
        'startup',
        'growth',
        'established',
        'rebrand',
      ];

      stages.forEach(stage => {
        const profile = { ...validProfile, businessStage: stage };
        expect(() => validateBrandProfile(profile)).not.toThrow();
      });
    });

    it('should reject invalid businessStage', () => {
      const profile = { ...validProfile, businessStage: 'invalid' as any };
      expect(() => validateBrandProfile(profile)).toThrow(/businessStage must be one of/);
    });
  });

  describe('primaryGoal enum validation', () => {
    it('should accept valid primaryGoal values', () => {
      const goals: Array<'launch' | 'refresh' | 'reposition' | 'scale'> = [
        'launch',
        'refresh',
        'reposition',
        'scale',
      ];

      goals.forEach(goal => {
        const profile = { ...validProfile, primaryGoal: goal };
        expect(() => validateBrandProfile(profile)).not.toThrow();
      });
    });

    it('should reject invalid primaryGoal', () => {
      const profile = { ...validProfile, primaryGoal: 'invalid' as any };
      expect(() => validateBrandProfile(profile)).toThrow(/primaryGoal must be one of/);
    });
  });

  describe('brandType enum validation', () => {
    it('should accept valid brandType values', () => {
      const types = [
        'b2c_consumer',
        'b2b_enterprise',
        'luxury_premium',
        'personal_brand',
        'startup_disruptor',
        'ecommerce_fashion',
        'saas_b2b',
      ] as const;

      types.forEach(type => {
        const profile = { ...validProfile, brandType: type };
        expect(() => validateBrandProfile(profile)).not.toThrow();
      });
    });

    it('should reject invalid brandType', () => {
      const profile = { ...validProfile, brandType: 'invalid' as any };
      expect(() => validateBrandProfile(profile)).toThrow(/brandType must be one of/);
    });
  });

  describe('website URL validation', () => {
    it('should accept valid HTTP URL', () => {
      const profile = { ...validProfile, website: 'http://example.com' };
      expect(() => validateBrandProfile(profile)).not.toThrow();
    });

    it('should accept valid HTTPS URL', () => {
      const profile = { ...validProfile, website: 'https://example.com' };
      expect(() => validateBrandProfile(profile)).not.toThrow();
    });

    it('should accept URL with path', () => {
      const profile = { ...validProfile, website: 'https://example.com/path/to/page' };
      expect(() => validateBrandProfile(profile)).not.toThrow();
    });

    it('should reject invalid URL format', () => {
      const profile = { ...validProfile, website: 'not-a-url' };
      expect(() => validateBrandProfile(profile)).toThrow(/website must be a valid URL/);
    });

    it('should reject non-HTTP(S) protocols', () => {
      const profile = { ...validProfile, website: 'ftp://example.com' };
      expect(() => validateBrandProfile(profile)).toThrow(/website must be a valid HTTP or HTTPS URL/);
    });

    it('should allow missing website (optional field)', () => {
      const profile = { ...validProfile };
      delete profile.website;
      expect(() => validateBrandProfile(profile)).not.toThrow();
    });
  });

  describe('error aggregation', () => {
    it('should report multiple errors at once', () => {
      const profile = {
        ...validProfile,
        brandName: '',
        industry: '',
        businessStage: 'invalid' as any,
      };

      expect(() => validateBrandProfile(profile)).toThrow(ValidationError);
      expect(() => validateBrandProfile(profile)).toThrow(/brandName is required/);
      expect(() => validateBrandProfile(profile)).toThrow(/industry is required/);
      expect(() => validateBrandProfile(profile)).toThrow(/businessStage must be one of/);
    });
  });

  describe('ValidationError structure', () => {
    it('should create ValidationError with correct properties', () => {
      const profile = { ...validProfile, brandName: '' };

      try {
        validateBrandProfile(profile);
        expect.fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).name).toBe('ValidationError');
        expect((error as ValidationError).field).toBe('BrandProfile');
        expect((error as ValidationError).message).toContain('Invalid BrandProfile');
      }
    });
  });
});

describe('validateApiKey', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.OPENAI_API_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Claude API key validation', () => {
    it('should accept valid Claude API key', () => {
      expect(() => validateApiKey('claude', 'sk-ant-1234567890')).not.toThrow();
    });

    it('should accept Claude key from environment', () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-1234567890';
      expect(() => validateApiKey('claude')).not.toThrow();
    });

    it('should reject missing Claude API key', () => {
      expect(() => validateApiKey('claude')).toThrow(ValidationError);
      expect(() => validateApiKey('claude')).toThrow(/Missing API key for claude/);
    });

    it('should reject invalid Claude key format', () => {
      expect(() => validateApiKey('claude', 'invalid-key')).toThrow(ValidationError);
      expect(() => validateApiKey('claude', 'invalid-key')).toThrow(
        /Invalid Anthropic API key format/
      );
    });

    it('should provide helpful error message for missing key', () => {
      try {
        validateApiKey('claude');
        expect.fail('Should have thrown');
      } catch (error) {
        expect((error as ValidationError).message).toContain('ANTHROPIC_API_KEY');
        expect((error as ValidationError).message).toContain(
          'https://console.anthropic.com/settings/keys'
        );
      }
    });
  });

  describe('OpenAI API key validation', () => {
    it('should accept valid OpenAI API key', () => {
      expect(() => validateApiKey('openai', 'sk-1234567890')).not.toThrow();
    });

    it('should accept OpenAI key from environment', () => {
      process.env.OPENAI_API_KEY = 'sk-1234567890';
      expect(() => validateApiKey('openai')).not.toThrow();
    });

    it('should reject missing OpenAI API key', () => {
      expect(() => validateApiKey('openai')).toThrow(ValidationError);
      expect(() => validateApiKey('openai')).toThrow(/Missing API key for openai/);
    });

    it('should reject invalid OpenAI key format', () => {
      expect(() => validateApiKey('openai', 'invalid-key')).toThrow(ValidationError);
      expect(() => validateApiKey('openai', 'invalid-key')).toThrow(
        /Invalid OpenAI API key format/
      );
    });

    it('should provide helpful error message for missing key', () => {
      try {
        validateApiKey('openai');
        expect.fail('Should have thrown');
      } catch (error) {
        expect((error as ValidationError).message).toContain('OPENAI_API_KEY');
        expect((error as ValidationError).message).toContain(
          'https://platform.openai.com/api-keys'
        );
      }
    });
  });

  describe('key precedence', () => {
    it('should prefer provided key over environment', () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-env-key';
      expect(() => validateApiKey('claude', 'sk-ant-provided-key')).not.toThrow();
    });
  });
});
