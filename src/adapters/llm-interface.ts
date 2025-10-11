// LLM abstraction layer for Claude and OpenAI compatibility

import type { LLMConfig, LLMRequest, LLMResponse } from '../types/llm-types.js';

export abstract class LLMAdapter {
  protected config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  abstract generateResponse(request: LLMRequest): Promise<LLMResponse>;

  protected buildSystemPrompt(basePrompt: string): string {
    return `${basePrompt}

You are an expert brand strategist with 15+ years of experience in brand research, audits, and strategy development.

Your outputs should be:
- Professional and structured
- Actionable and practical
- Based on research and analysis
- Tailored to the specific brand context`;
  }
}

export class LLMFactory {
  static create(config: LLMConfig): LLMAdapter {
    if (config.provider === 'managed-claude') {
      // Use ManagedLLMService with automatic quality control
      // Dynamic import to avoid circular dependencies
      const { ManagedClaudeAdapter } = require('./managed-llm-adapter.js') as typeof import('./managed-llm-adapter.js');
      return new ManagedClaudeAdapter(config);
    } else if (config.provider === 'claude') {
      // Direct Claude API (not recommended - bypasses quality control)
      console.warn('⚠️  Using direct Claude API - consider switching to "managed-claude" for automatic quality control');
      return new ClaudeAdapter(config);
    } else if (config.provider === 'openai') {
      return new OpenAIAdapter(config);
    }
    throw new Error(`Unsupported LLM provider: ${String(config.provider)}`);
  }
}

// Claude adapter implementation
class ClaudeAdapter extends LLMAdapter {
  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    try {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;

      const apiKey = this.config.apiKey || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error(
          'Missing Anthropic API key. ' +
          'Set ANTHROPIC_API_KEY environment variable or provide apiKey in config. ' +
          'Get your key at: https://console.anthropic.com/settings/keys'
        );
      }

      const client = new Anthropic({ apiKey });

      const systemPrompt = request.systemPrompt || this.buildSystemPrompt('Brand Strategy Expert');

      const messages = request.messages.map(msg => ({
        role: msg.role === 'system' ? 'user' : msg.role,
        content: msg.content,
      }));

      type MessageParam = {
        role: 'user' | 'assistant';
        content: string;
      };

      const response = await client.messages.create({
        model: this.config.model,
        max_tokens: request.maxTokens || this.config.maxTokens || 4096,
        temperature: request.temperature ?? this.config.temperature ?? 0.7,
        system: systemPrompt,
        messages: messages as MessageParam[],
      });

      if (!response.content || response.content.length === 0) {
        throw new Error(
          'Empty response from Claude API. ' +
          'The model returned no content. ' +
          'Try adjusting your prompt or model settings.'
        );
      }

      const textContent = response.content[0];
      if (textContent.type !== 'text') {
        throw new Error(
          `Unexpected content type from Claude: ${textContent.type}. ` +
          'Expected text content.'
        );
      }

      return {
        content: textContent.text,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        // Check for specific API errors
        if ('status' in error && typeof error.status === 'number') {
          const status = error.status;
          if (status === 401) {
            throw new Error(
              'Authentication failed with Claude API. ' +
              'Check that your ANTHROPIC_API_KEY is correct and active. ' +
              `Error: ${error.message}`
            );
          } else if (status === 429) {
            throw new Error(
              'Rate limit exceeded with Claude API. ' +
              'Please wait a few moments before retrying. ' +
              `Error: ${error.message}`
            );
          } else if (status === 500 || status === 503) {
            throw new Error(
              'Claude API is experiencing issues. ' +
              'Please try again in a few minutes. ' +
              `Status: ${status}, Error: ${error.message}`
            );
          }
        }

        // Re-throw error with more context
        throw new Error(
          `Failed to generate response from Claude: ${error.message}. ` +
          'Check your API key, network connection, and model availability.'
        );
      }
      throw error;
    }
  }
}

// OpenAI adapter implementation
class OpenAIAdapter extends LLMAdapter {
  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    try {
      const OpenAI = (await import('openai')).default;

      const apiKey = this.config.apiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(
          'Missing OpenAI API key. ' +
          'Set OPENAI_API_KEY environment variable or provide apiKey in config. ' +
          'Get your key at: https://platform.openai.com/api-keys'
        );
      }

      const client = new OpenAI({ apiKey });

      const systemPrompt = request.systemPrompt || this.buildSystemPrompt('Brand Strategy Expert');

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...request.messages.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
        })),
      ];

      const response = await client.chat.completions.create({
        model: this.config.model,
        max_tokens: request.maxTokens || this.config.maxTokens,
        temperature: request.temperature ?? this.config.temperature,
        messages: messages,
      });

      if (!response.choices || response.choices.length === 0) {
        throw new Error(
          'Empty response from OpenAI API. ' +
          'The model returned no choices. ' +
          'Try adjusting your prompt or model settings.'
        );
      }

      const message = response.choices[0]?.message;
      if (!message || !message.content) {
        throw new Error(
          'No content in OpenAI response. ' +
          'The model returned an empty message. ' +
          'Check your request parameters.'
        );
      }

      return {
        content: message.content,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        // Check for specific API errors
        if ('status' in error && typeof error.status === 'number') {
          const status = error.status;
          if (status === 401) {
            throw new Error(
              'Authentication failed with OpenAI API. ' +
              'Check that your OPENAI_API_KEY is correct and active. ' +
              `Error: ${error.message}`
            );
          } else if (status === 429) {
            throw new Error(
              'Rate limit exceeded with OpenAI API. ' +
              'Please wait a few moments before retrying. ' +
              `Error: ${error.message}`
            );
          } else if (status === 500 || status === 503) {
            throw new Error(
              'OpenAI API is experiencing issues. ' +
              'Please try again in a few minutes. ' +
              `Status: ${status}, Error: ${error.message}`
            );
          }
        }

        // Re-throw error with more context
        throw new Error(
          `Failed to generate response from OpenAI: ${error.message}. ` +
          'Check your API key, network connection, and model availability.'
        );
      }
      throw error;
    }
  }
}
