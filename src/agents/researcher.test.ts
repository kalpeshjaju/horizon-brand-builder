import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResearchAgent } from './researcher.js';
import type { LLMAdapter } from '../adapters/llm-interface.js';
import type { BrandProfile, ResearchReport } from '../types/brand-types.js';

// Mock LLM adapter
const createMockLLM = (): LLMAdapter => ({
  generateResponse: vi.fn(),
  config: {
    provider: 'claude',
    model: 'claude-sonnet-4-20250514',
    temperature: 0.7,
    maxTokens: 4000,
  },
  buildSystemPrompt: vi.fn((base: string) => base),
} as unknown as LLMAdapter);

describe('ResearchAgent', () => {
  let mockLLM: LLMAdapter;
  let researcher: ResearchAgent;

  const validProfile: BrandProfile = {
    brandName: 'Test Brand',
    industry: 'Technology',
    targetAudience: 'Tech professionals',
    businessStage: 'startup',
    primaryGoal: 'launch',
    brandType: 'b2c_consumer',
  };

  beforeEach(() => {
    mockLLM = createMockLLM();
    researcher = new ResearchAgent(mockLLM);
    vi.clearAllMocks();
  });

  describe('conductResearch', () => {
    it('should successfully conduct research and return report', async () => {
      const mockMarketInsights = {
        industryTrends: ['AI integration', 'Cloud computing'],
        competitorLandscape: [
          {
            name: 'Competitor A',
            positioning: 'Enterprise leader',
            strengths: ['Strong brand', 'Large market share'],
            weaknesses: ['High pricing', 'Slow innovation'],
            differentiationOpportunity: 'Focus on affordability',
          },
        ],
        marketOpportunities: ['Small business segment', 'International expansion'],
        keyFindings: ['Market growing at 15% annually'],
      };

      const mockAudienceProfile = {
        personas: [
          {
            name: 'Tech Enthusiast',
            demographics: 'Age 25-35, urban professionals',
            psychographics: 'Early adopters, value innovation',
            goals: ['Stay ahead of trends', 'Improve efficiency'],
            challenges: ['Information overload', 'Budget constraints'],
            buyingBehavior: 'Research-driven, compare multiple options',
          },
        ],
        painPoints: ['Complex tools', 'Poor support'],
        desires: ['Easy to use', 'Great customer service'],
        decisionFactors: ['Price', 'Features', 'Reviews'],
      };

      const mockBrandDNA = {
        uniqueValueProposition: 'Simple yet powerful technology solutions',
        brandStory: 'Founded by engineers who saw a gap in the market',
        coreStrengths: ['Innovation', 'User-friendly design', 'Reliability'],
        brandHeritage: null,
        founderStory: 'Started in a garage in 2020',
      };

      const mockSynthesis = 'Strategic synthesis of research findings...';

      // Mock LLM responses
      vi.spyOn(mockLLM, 'generateResponse')
        .mockResolvedValueOnce({ content: JSON.stringify(mockMarketInsights) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockAudienceProfile) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockBrandDNA) })
        .mockResolvedValueOnce({ content: mockSynthesis });

      const result = await researcher.conductResearch(validProfile);

      expect(result).toBeDefined();
      expect(result.marketInsights).toEqual(mockMarketInsights);
      expect(result.audienceProfile).toEqual(mockAudienceProfile);
      expect(result.brandDNA).toEqual(mockBrandDNA);
      expect(result.synthesisNotes).toBe(mockSynthesis);
      expect(mockLLM.generateResponse).toHaveBeenCalledTimes(4);
    });

    it('should handle JSON wrapped in markdown code blocks', async () => {
      const mockData = { industryTrends: ['Trend 1'] };
      const wrappedJSON = `Here is the result:\n\`\`\`json\n${JSON.stringify(mockData)}\n\`\`\``;

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: wrappedJSON,
      });

      // This should not throw
      const result = await researcher.conductResearch(validProfile);
      expect(result).toBeDefined();
    });

    it('should handle LLM errors gracefully', async () => {
      vi.spyOn(mockLLM, 'generateResponse').mockRejectedValue(
        new Error('LLM API error')
      );

      await expect(researcher.conductResearch(validProfile)).rejects.toThrow();
    });
  });

  describe('JSON extraction', () => {
    it('should extract JSON from markdown code blocks', async () => {
      const mockData = { test: 'value' };
      const wrappedJSON = `\`\`\`json\n${JSON.stringify(mockData)}\n\`\`\``;

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: wrappedJSON,
      });

      const result = await researcher.conductResearch(validProfile);
      expect(result).toBeDefined();
    });

    it('should extract JSON from text with surrounding content', async () => {
      const mockData = { industryTrends: ['test'] };
      const textWithJSON = `Here is the analysis:\n${JSON.stringify(mockData)}\nThank you.`;

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: textWithJSON,
      });

      const result = await researcher.conductResearch(validProfile);
      expect(result).toBeDefined();
    });
  });

  describe('prompt construction', () => {
    it('should include brand profile details in prompts', async () => {
      const mockResponse = {
        industryTrends: [],
        competitorLandscape: [],
        marketOpportunities: [],
        keyFindings: [],
      };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await researcher.conductResearch(validProfile);

      const firstCall = (mockLLM.generateResponse as ReturnType<typeof vi.fn>).mock
        .calls[0][0];
      const prompt = firstCall.messages[0].content;

      expect(prompt).toContain(validProfile.brandName);
      expect(prompt).toContain(validProfile.industry);
      expect(prompt).toContain(validProfile.targetAudience);
    });

    it('should include website URL if provided', async () => {
      const profileWithWebsite = {
        ...validProfile,
        website: 'https://example.com',
      };

      const mockResponse = {
        industryTrends: [],
        competitorLandscape: [],
        marketOpportunities: [],
        keyFindings: [],
      };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await researcher.conductResearch(profileWithWebsite);

      const firstCall = (mockLLM.generateResponse as ReturnType<typeof vi.fn>).mock
        .calls[0][0];
      const prompt = firstCall.messages[0].content;

      expect(prompt).toContain('https://example.com');
    });
  });

  describe('parallel execution', () => {
    it('should execute research phases in parallel', async () => {
      const startTime = Date.now();

      // Mock responses with delays
      vi.spyOn(mockLLM, 'generateResponse').mockImplementation(
        async () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  content: JSON.stringify({
                    industryTrends: [],
                    competitorLandscape: [],
                    marketOpportunities: [],
                    keyFindings: [],
                  }),
                }),
              100
            );
          })
      );

      await researcher.conductResearch(validProfile);
      const duration = Date.now() - startTime;

      // Should take ~100ms (parallel) not ~300ms (sequential)
      // Increased threshold to 250ms to account for system variations
      expect(duration).toBeLessThan(250);
    });
  });

  describe('temperature settings', () => {
    it('should use temperature 0.7 for research tasks', async () => {
      const mockResponse = {
        industryTrends: [],
        competitorLandscape: [],
        marketOpportunities: [],
        keyFindings: [],
      };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await researcher.conductResearch(validProfile);

      const calls = (mockLLM.generateResponse as ReturnType<typeof vi.fn>).mock.calls;
      calls.forEach((call) => {
        expect(call[0].temperature).toBe(0.7);
      });
    });
  });

  describe('error handling', () => {
    it('should throw error on invalid JSON response', async () => {
      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: 'This is not valid JSON',
      });

      await expect(researcher.conductResearch(validProfile)).rejects.toThrow();
    });

    it('should throw error on network failure', async () => {
      vi.spyOn(mockLLM, 'generateResponse').mockRejectedValue(
        new Error('Network error')
      );

      await expect(researcher.conductResearch(validProfile)).rejects.toThrow(
        'Network error'
      );
    });
  });
});
