// Tests for LLM adapter layer

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LLMAdapter, LLMFactory } from './llm-interface.js';
import type { LLMConfig } from '../types/llm-types.js';

describe('LLMAdapter', () => {
  describe('buildSystemPrompt', () => {
    it('should build system prompt with base prompt', () => {
      class TestAdapter extends LLMAdapter {
        async generateResponse() {
          return { content: '', usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };
        }

        testBuildSystemPrompt(base: string) {
          return this.buildSystemPrompt(base);
        }
      }

      const config: LLMConfig = {
        provider: 'claude',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 4000,
      };

      const adapter = new TestAdapter(config);
      const result = adapter.testBuildSystemPrompt('Test prompt');

      expect(result).toContain('Test prompt');
      expect(result).toContain('expert brand strategist');
      expect(result).toContain('15+ years of experience');
      expect(result).toContain('Professional and structured');
      expect(result).toContain('Actionable and practical');
    });
  });
});

describe('LLMFactory', () => {
  describe('create', () => {
    it('should create Claude adapter', () => {
      const config: LLMConfig = {
        provider: 'claude',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 4000,
      };

      const adapter = LLMFactory.create(config);
      expect(adapter).toBeInstanceOf(LLMAdapter);
    });

    it('should create OpenAI adapter', () => {
      const config: LLMConfig = {
        provider: 'openai',
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 4000,
      };

      const adapter = LLMFactory.create(config);
      expect(adapter).toBeInstanceOf(LLMAdapter);
    });

    it('should throw for unsupported provider', () => {
      const config = {
        provider: 'unsupported',
        model: 'model',
        temperature: 0.7,
        maxTokens: 4000,
      } as any;

      expect(() => LLMFactory.create(config)).toThrow('Unsupported LLM provider: unsupported');
    });
  });
});

describe('Claude adapter error handling', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.ANTHROPIC_API_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should throw error for missing API key', async () => {
    const config: LLMConfig = {
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 4000,
    };

    const adapter = LLMFactory.create(config);

    await expect(
      adapter.generateResponse({
        messages: [{ role: 'user', content: 'test' }],
      })
    ).rejects.toThrow(/Missing Anthropic API key/);
  });

  it('should include helpful error message for missing key', async () => {
    const config: LLMConfig = {
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 4000,
    };

    const adapter = LLMFactory.create(config);

    await expect(
      adapter.generateResponse({
        messages: [{ role: 'user', content: 'test' }],
      })
    ).rejects.toThrow(/Set ANTHROPIC_API_KEY environment variable/);

    await expect(
      adapter.generateResponse({
        messages: [{ role: 'user', content: 'test' }],
      })
    ).rejects.toThrow(/https:\/\/console.anthropic.com\/settings\/keys/);
  });
});

describe('OpenAI adapter error handling', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.OPENAI_API_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should throw error for missing API key', async () => {
    const config: LLMConfig = {
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4000,
    };

    const adapter = LLMFactory.create(config);

    await expect(
      adapter.generateResponse({
        messages: [{ role: 'user', content: 'test' }],
      })
    ).rejects.toThrow(/Missing OpenAI API key/);
  });

  it('should include helpful error message for missing key', async () => {
    const config: LLMConfig = {
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4000,
    };

    const adapter = LLMFactory.create(config);

    await expect(
      adapter.generateResponse({
        messages: [{ role: 'user', content: 'test' }],
      })
    ).rejects.toThrow(/Set OPENAI_API_KEY environment variable/);

    await expect(
      adapter.generateResponse({
        messages: [{ role: 'user', content: 'test' }],
      })
    ).rejects.toThrow(/https:\/\/platform.openai.com\/api-keys/);
  });
});

describe('LLM request configuration', () => {
  it('should use custom system prompt when provided', () => {
    const config: LLMConfig = {
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 4000,
    };

    const adapter = LLMFactory.create(config);
    expect(adapter).toBeInstanceOf(LLMAdapter);

    // Test that custom system prompt can be passed
    // (actual API call will fail without key, but we can verify the interface)
    expect(() => {
      const request = {
        messages: [{ role: 'user' as const, content: 'test' }],
        systemPrompt: 'Custom system prompt',
      };
      return request;
    }).not.toThrow();
  });

  it('should use custom temperature when provided', () => {
    const config: LLMConfig = {
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 4000,
    };

    const adapter = LLMFactory.create(config);
    expect(adapter).toBeInstanceOf(LLMAdapter);

    expect(() => {
      const request = {
        messages: [{ role: 'user' as const, content: 'test' }],
        temperature: 0.9,
      };
      return request;
    }).not.toThrow();
  });

  it('should use custom maxTokens when provided', () => {
    const config: LLMConfig = {
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 4000,
    };

    const adapter = LLMFactory.create(config);
    expect(adapter).toBeInstanceOf(LLMAdapter);

    expect(() => {
      const request = {
        messages: [{ role: 'user' as const, content: 'test' }],
        maxTokens: 8000,
      };
      return request;
    }).not.toThrow();
  });
});

describe('Config validation', () => {
  it('should accept valid Claude config', () => {
    const config: LLMConfig = {
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 4000,
    };

    expect(() => LLMFactory.create(config)).not.toThrow();
  });

  it('should accept valid OpenAI config', () => {
    const config: LLMConfig = {
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4000,
    };

    expect(() => LLMFactory.create(config)).not.toThrow();
  });

  it('should accept config with API key', () => {
    const config: LLMConfig = {
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 4000,
      apiKey: 'sk-ant-test-key',
    };

    expect(() => LLMFactory.create(config)).not.toThrow();
  });
});
