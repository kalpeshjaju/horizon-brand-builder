// LLM integration types

export type LLMProvider = 'claude' | 'openai' | 'managed-claude';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface PromptTemplate {
  system: string;
  task: string;
  context?: Record<string, unknown>;
  outputFormat?: string;
  examples?: string[];
}
