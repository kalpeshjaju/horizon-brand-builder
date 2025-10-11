/**
 * Managed LLM Adapter - Uses ManagedLLMService for automatic quality control
 * This adapter wraps the LLM² enforcement layer
 */

import { LLMAdapter } from './llm-interface.js';
import type { LLMConfig, LLMRequest, LLMResponse } from '../types/llm-types.js';
import { getManagedLLMService } from '../services/llm-service.js';
import type {
  ManagedLLMRequest,
  ManagedLLMResponse,
  ManagedLLMError,
} from '../services/llm-service.js';

/**
 * Adapter that uses ManagedLLMService instead of direct API calls
 * Provides automatic quality control, caching, rate limiting, and monitoring
 */
export class ManagedClaudeAdapter extends LLMAdapter {
  private featureContext: string;

  constructor(config: LLMConfig, featureContext = 'brand-design-agent') {
    super(config);
    this.featureContext = featureContext;
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    try {
      const managedService = getManagedLLMService();

      // Build the full prompt combining system prompt and messages
      const systemPrompt = request.systemPrompt || this.buildSystemPrompt('Brand Strategy Expert');

      // Combine all messages into a single prompt
      const messagesText = request.messages
        .map((msg) => {
          if (msg.role === 'system') {
            return `System: ${msg.content}`;
          } else if (msg.role === 'user') {
            return `User: ${msg.content}`;
          } else {
            return `Assistant: ${msg.content}`;
          }
        })
        .join('\n\n');

      const fullPrompt = `${systemPrompt}\n\n${messagesText}`;

      // Determine feature ID from context
      const featureId = this.determineFeatureId(request);

      // Create managed request
      const managedRequest: ManagedLLMRequest = {
        featureId,
        taskDescription: this.extractTaskDescription(request),
        prompt: fullPrompt,
        context: {
          originalRequest: request,
          adapter: 'ManagedClaudeAdapter',
        },
      };

      // Call managed service (automatic quality control, caching, etc.)
      const result = await managedService.generate(managedRequest);

      // Check if request was blocked
      if (!result.success) {
        const error = result as ManagedLLMError;
        throw new Error(
          `Request blocked by quality gate: ${error.error}\n` +
          `Reason: ${error.reason}\n` +
          `Suggestions:\n${error.suggestions.map((s) => `  - ${s}`).join('\n')}`
        );
      }

      // Extract successful response
      const success = result as ManagedLLMResponse;

      // Log quality metrics
      if (success.metadata.cached) {
        console.log(`   💾 Cache hit - instant response, $0 cost`);
      } else {
        console.log(`   ✅ Quality Score: ${success.metadata.qualityScore.toFixed(1)}/10`);
        console.log(`   💰 Cost: $${success.metadata.cost.toFixed(4)}`);
        console.log(`   ⏱️  Latency: ${success.metadata.latency}ms`);
      }

      // Convert to standard LLMResponse format
      return {
        content: success.content,
        usage: {
          promptTokens: 0, // ManagedLLMService tracks this internally
          completionTokens: success.metadata.tokensUsed,
          totalTokens: success.metadata.tokensUsed,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to generate response via ManagedLLMService: ${error.message}. ` +
          'Check your configuration and quality requirements.'
        );
      }
      throw error;
    }
  }

  /**
   * Determine feature ID based on request content
   */
  private determineFeatureId(request: LLMRequest): string {
    const content = request.messages[0]?.content.toLowerCase() || '';

    if (content.includes('market research') || content.includes('industry trends')) {
      return 'brand-market-research';
    } else if (content.includes('audience') || content.includes('persona')) {
      return 'brand-audience-research';
    } else if (content.includes('brand dna') || content.includes('value proposition')) {
      return 'brand-dna-research';
    } else if (content.includes('audit') || content.includes('score')) {
      return 'brand-audit';
    } else if (content.includes('strategy') || content.includes('positioning')) {
      return 'brand-strategy-generation';
    } else if (content.includes('personality') || content.includes('archetype')) {
      return 'brand-personality';
    } else if (content.includes('messaging') || content.includes('tagline')) {
      return 'brand-messaging';
    } else if (content.includes('visual') || content.includes('design')) {
      return 'brand-visual-direction';
    } else {
      return `${this.featureContext}-general`;
    }
  }

  /**
   * Extract task description from request
   */
  private extractTaskDescription(request: LLMRequest): string {
    const firstMessage = request.messages[0];
    if (!firstMessage) {
      return 'Generate brand content';
    }

    // Extract first sentence or first 200 chars as task description
    const content = firstMessage.content;
    const firstSentence = content.split('.')[0] || content;

    return firstSentence.length > 200
      ? firstSentence.substring(0, 197) + '...'
      : firstSentence;
  }
}
