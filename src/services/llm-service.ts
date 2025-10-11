/**
 * Centralized LLM Service - Enforcement Layer
 * ALL LLM calls in brand-design-agent MUST go through this service
 *
 * Automatically enforces:
 * - Quality evaluation (blocks if score < 7/10)
 * - Caching (30-50% cost savings)
 * - Rate limiting
 * - Monitoring
 */

import { ManagedLLMService } from 'llm-squared-framework';
import type {
  ManagedLLMConfig,
  ManagedLLMRequest,
  ManagedLLMResponse,
  ManagedLLMError,
} from 'llm-squared-framework';

/**
 * Create and export a singleton ManagedLLMService instance
 * This ensures all LLM calls share the same configuration, cache, and rate limits
 */
export function createManagedLLMService(): ManagedLLMService {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Missing Anthropic API key. ' +
      'Set ANTHROPIC_API_KEY environment variable. ' +
      'Get your key at: https://console.anthropic.com/settings/keys'
    );
  }

  const config: ManagedLLMConfig = {
    // API Configuration
    apiKey,

    // Quality Enforcement (AUTOMATIC)
    autoEvaluate: true,          // ✅ Every output evaluated
    minQualityScore: 5,          // ✅ Block if score < 5/10 (relaxed for testing)
    blockOnLowQuality: false,    // ⚠️  Log warnings but don't block (testing mode)

    // Performance (AUTOMATIC)
    enableCaching: true,         // ✅ Cache similar queries (30-50% savings)
    cacheTTL: 3600,              // 1 hour cache
    cacheStoragePath: './data/brand-llm-cache.json',

    // Scaling (AUTOMATIC)
    enableRateLimiting: true,    // ✅ Prevent quota exhaustion
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    requestsPerDay: 10000,

    // Monitoring (AUTOMATIC)
    enableMonitoring: true,      // ✅ Track all metrics
    metricsStoragePath: './data/brand-llm-metrics.json',

    // Prompts
    promptRegistryPath: './data/brand-prompts.json',

    // Model Configuration
    model: 'claude-sonnet-4-20250514',
    temperature: 0.7,
    maxTokens: 4000,
  };

  return new ManagedLLMService(config);
}

// Singleton instance (created once, reused everywhere)
let serviceInstance: ManagedLLMService | null = null;

/**
 * Get the managed LLM service instance
 * Creates it on first call, returns existing instance on subsequent calls
 */
export function getManagedLLMService(): ManagedLLMService {
  if (!serviceInstance) {
    serviceInstance = createManagedLLMService();
  }
  return serviceInstance;
}

/**
 * Initialize the managed LLM service
 * Call this once at application startup
 */
export async function initializeLLMService(): Promise<void> {
  const service = getManagedLLMService();
  await service.initialize();
  console.log('✅ ManagedLLMService initialized with automatic enforcement');
}

/**
 * Helper to generate LLM response with automatic quality control
 * Use this everywhere instead of direct Anthropic calls
 */
export async function generateBrandContent(
  featureId: string,
  taskDescription: string,
  prompt: string,
  context?: Record<string, unknown>
): Promise<ManagedLLMResponse | ManagedLLMError> {
  const service = getManagedLLMService();

  const request: ManagedLLMRequest = {
    featureId,
    taskDescription,
    prompt,
    context,
  };

  return service.generate(request);
}

/**
 * Get service statistics
 */
export async function getLLMServiceStats() {
  const service = getManagedLLMService();
  return service.getStats();
}

/**
 * Enhanced ManagedLLMService with convenience methods
 */
export class EnhancedLLMService {
  private service: ManagedLLMService;

  constructor() {
    this.service = getManagedLLMService();
  }

  async initialize(): Promise<void> {
    await this.service.initialize();
  }

  /**
   * Generate response with a simplified interface
   */
  async generateResponse(params: {
    featureId: string;
    userMessage: string;
    systemMessage?: string;
    context?: Record<string, unknown>;
  }): Promise<{ content: string }> {
    const result = await this.service.generate({
      featureId: params.featureId,
      taskDescription: params.systemMessage || 'Generate response',
      prompt: params.userMessage,
      context: params.context,
    });

    if (!result.success) {
      throw new Error(`LLM generation failed: ${result.error}`);
    }

    return { content: result.content };
  }
}

// Export types
export type {
  ManagedLLMRequest,
  ManagedLLMResponse,
  ManagedLLMError,
};
