// Input validation utilities

import type { BrandProfile } from '../types/brand-types.js';

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateBrandProfile(profile: BrandProfile): void {
  const errors: string[] = [];

  // Required string fields
  if (!profile.brandName || profile.brandName.trim().length === 0) {
    errors.push('brandName is required and cannot be empty');
  }

  if (!profile.industry || profile.industry.trim().length === 0) {
    errors.push('industry is required and cannot be empty');
  }

  if (!profile.targetAudience || profile.targetAudience.trim().length === 0) {
    errors.push('targetAudience is required and cannot be empty');
  }

  // Validate brandName length
  if (profile.brandName && profile.brandName.length > 100) {
    errors.push('brandName must be 100 characters or less');
  }

  // Validate businessStage enum
  const validBusinessStages = ['startup', 'growth', 'established', 'rebrand'];
  if (!validBusinessStages.includes(profile.businessStage)) {
    errors.push(
      `businessStage must be one of: ${validBusinessStages.join(', ')}. ` +
      `Got: ${profile.businessStage}`
    );
  }

  // Validate primaryGoal enum
  const validGoals = ['launch', 'refresh', 'reposition', 'scale'];
  if (!validGoals.includes(profile.primaryGoal)) {
    errors.push(
      `primaryGoal must be one of: ${validGoals.join(', ')}. ` +
      `Got: ${profile.primaryGoal}`
    );
  }

  // Validate brandType enum
  const validBrandTypes = [
    'b2c_consumer',
    'b2b_enterprise',
    'luxury_premium',
    'personal_brand',
    'startup_disruptor',
    'ecommerce_fashion',
    'saas_b2b',
  ];
  if (!validBrandTypes.includes(profile.brandType)) {
    errors.push(
      `brandType must be one of: ${validBrandTypes.join(', ')}. ` +
      `Got: ${profile.brandType}`
    );
  }

  // Validate website URL if provided
  if (profile.website) {
    try {
      const url = new URL(profile.website);
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.push('website must be a valid HTTP or HTTPS URL');
      }
    } catch {
      errors.push(
        `website must be a valid URL. Got: ${profile.website}`
      );
    }
  }

  // Throw aggregated errors
  if (errors.length > 0) {
    throw new ValidationError(
      `Invalid BrandProfile:\n${errors.map(e => `  - ${e}`).join('\n')}\n\n` +
      'Please provide all required fields with valid values.',
      'BrandProfile',
      profile
    );
  }
}

export function validateApiKey(provider: 'claude' | 'openai', apiKey?: string): void {
  const envKey = provider === 'claude'
    ? process.env.ANTHROPIC_API_KEY
    : process.env.OPENAI_API_KEY;

  const key = apiKey || envKey;

  if (!key) {
    const envVarName = provider === 'claude' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY';
    throw new ValidationError(
      `Missing API key for ${provider}. ` +
      `Set ${envVarName} environment variable or provide apiKey in config.\n\n` +
      `Get your key at: ${provider === 'claude'
        ? 'https://console.anthropic.com/settings/keys'
        : 'https://platform.openai.com/api-keys'}`,
      'apiKey',
      undefined
    );
  }

  // Basic format validation
  if (provider === 'claude' && !key.startsWith('sk-ant-')) {
    throw new ValidationError(
      'Invalid Anthropic API key format. ' +
      'Keys should start with "sk-ant-". ' +
      'Check your key at: https://console.anthropic.com/settings/keys',
      'apiKey',
      key.substring(0, 10) + '...'
    );
  }

  if (provider === 'openai' && !key.startsWith('sk-')) {
    throw new ValidationError(
      'Invalid OpenAI API key format. ' +
      'Keys should start with "sk-". ' +
      'Check your key at: https://platform.openai.com/api-keys',
      'apiKey',
      key.substring(0, 10) + '...'
    );
  }
}
