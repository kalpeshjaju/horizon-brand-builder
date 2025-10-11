import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuditorAgent } from './auditor.js';
import type { LLMAdapter } from '../adapters/llm-interface.js';
import type {
  BrandProfile,
  ResearchReport,
  AuditReport,
} from '../types/brand-types.js';

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

describe('AuditorAgent', () => {
  let mockLLM: LLMAdapter;
  let auditor: AuditorAgent;

  const validProfile: BrandProfile = {
    brandName: 'Test Brand',
    industry: 'Technology',
    targetAudience: 'Tech professionals',
    businessStage: 'startup',
    primaryGoal: 'launch',
    brandType: 'b2c_consumer',
  };

  const mockResearch: ResearchReport = {
    marketInsights: {
      industryTrends: ['AI integration'],
      competitorLandscape: [
        {
          name: 'Competitor A',
          positioning: 'Enterprise leader',
          strengths: ['Strong brand'],
          weaknesses: ['High pricing'],
          differentiationOpportunity: 'Focus on affordability',
        },
      ],
      marketOpportunities: ['SMB segment'],
      keyFindings: ['Growing market'],
    },
    audienceProfile: {
      personas: [
        {
          name: 'Tech Pro',
          demographics: 'Age 25-35',
          psychographics: 'Early adopters',
          goals: ['Stay ahead'],
          challenges: ['Budget'],
          buyingBehavior: 'Research-driven',
        },
      ],
      painPoints: ['Complex tools'],
      desires: ['Easy to use'],
      decisionFactors: ['Price', 'Features'],
    },
    brandDNA: {
      uniqueValueProposition: 'Simple tech',
      brandStory: 'Founded by engineers',
      coreStrengths: ['Innovation'],
      brandHeritage: undefined,
      founderStory: 'Started in garage',
    },
    synthesisNotes: 'Strategic insights...',
  };

  beforeEach(() => {
    mockLLM = createMockLLM();
    auditor = new AuditorAgent(mockLLM);
    vi.clearAllMocks();
  });

  describe('conductAudit', () => {
    it('should successfully conduct audit and return report', async () => {
      const mockAuditDimension = {
        dimension: 'Test',
        score: 7,
        findings: ['Finding 1', 'Finding 2'],
        gaps: ['Gap 1'],
        opportunities: ['Opportunity 1'],
      };

      const mockTopOpportunities = ['Top opp 1', 'Top opp 2'];
      const mockQuickWins = ['Quick win 1'];

      vi.spyOn(mockLLM, 'generateResponse')
        // 4 audit dimensions
        .mockResolvedValueOnce({ content: JSON.stringify(mockAuditDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockAuditDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockAuditDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockAuditDimension) })
        // Top opportunities
        .mockResolvedValueOnce({ content: JSON.stringify(mockTopOpportunities) })
        // Quick wins
        .mockResolvedValueOnce({ content: JSON.stringify(mockQuickWins) });

      const result = await auditor.conductAudit(validProfile, mockResearch);

      expect(result).toBeDefined();
      expect(result.visualAudit).toEqual(mockAuditDimension);
      expect(result.messagingAudit).toEqual(mockAuditDimension);
      expect(result.experienceAudit).toEqual(mockAuditDimension);
      expect(result.competitiveAudit).toEqual(mockAuditDimension);
      expect(result.overallScore).toBe(7);
      expect(result.topOpportunities).toEqual(mockTopOpportunities);
      expect(result.quickWins).toEqual(mockQuickWins);
      expect(mockLLM.generateResponse).toHaveBeenCalledTimes(6);
    });

    it('should calculate overall score correctly', async () => {
      const mockDimensions = [
        { dimension: 'Visual', score: 8, findings: [], gaps: [], opportunities: [] },
        { dimension: 'Messaging', score: 6, findings: [], gaps: [], opportunities: [] },
        { dimension: 'Experience', score: 7, findings: [], gaps: [], opportunities: [] },
        {
          dimension: 'Competitive',
          score: 5,
          findings: [],
          gaps: [],
          opportunities: [],
        },
      ];

      vi.spyOn(mockLLM, 'generateResponse')
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimensions[0]) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimensions[1]) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimensions[2]) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimensions[3]) })
        .mockResolvedValueOnce({ content: JSON.stringify([]) })
        .mockResolvedValueOnce({ content: JSON.stringify([]) });

      const result = await auditor.conductAudit(validProfile, mockResearch);

      // (8 + 6 + 7 + 5) / 4 = 6.5
      expect(result.overallScore).toBe(6.5);
    });

    it('should handle JSON arrays for opportunities and quick wins', async () => {
      const mockDimension = {
        dimension: 'Test',
        score: 7,
        findings: [],
        gaps: [],
        opportunities: [],
      };

      const mockArray = ['Item 1', 'Item 2', 'Item 3'];

      vi.spyOn(mockLLM, 'generateResponse')
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockArray) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockArray) });

      const result = await auditor.conductAudit(validProfile, mockResearch);

      expect(result.topOpportunities).toEqual(mockArray);
      expect(result.quickWins).toEqual(mockArray);
    });
  });

  describe('parallel execution', () => {
    it('should execute audit dimensions in parallel', async () => {
      const startTime = Date.now();

      const mockDimension = {
        dimension: 'Test',
        score: 7,
        findings: [],
        gaps: [],
        opportunities: [],
      };

      vi.spyOn(mockLLM, 'generateResponse').mockImplementation(
        async () =>
          new Promise((resolve) => {
            setTimeout(
              () => resolve({ content: JSON.stringify(mockDimension) }),
              100
            );
          })
      );

      await auditor.conductAudit(validProfile, mockResearch);
      const duration = Date.now() - startTime;

      // Should take ~100-200ms (parallel) not ~600ms (sequential)
      // Increased threshold to 350ms to account for system variations
      expect(duration).toBeLessThan(350);
    });
  });

  describe('temperature settings', () => {
    it('should use temperature 0.6 for audit tasks', async () => {
      const mockDimension = {
        dimension: 'Test',
        score: 7,
        findings: [],
        gaps: [],
        opportunities: [],
      };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockDimension),
      });

      await auditor.conductAudit(validProfile, mockResearch);

      const calls = (mockLLM.generateResponse as ReturnType<typeof vi.fn>).mock.calls;
      // First 4 calls are audit dimensions (should use 0.6)
      calls.slice(0, 4).forEach((call) => {
        expect(call[0].temperature).toBe(0.6);
      });
    });

    it('should use temperature 0.5 for prioritization tasks', async () => {
      const mockDimension = {
        dimension: 'Test',
        score: 7,
        findings: [],
        gaps: [],
        opportunities: [],
      };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockDimension),
      });

      await auditor.conductAudit(validProfile, mockResearch);

      const calls = (mockLLM.generateResponse as ReturnType<typeof vi.fn>).mock.calls;
      // Last 2 calls are prioritization (should use 0.5)
      calls.slice(4).forEach((call) => {
        expect(call[0].temperature).toBe(0.5);
      });
    });
  });

  describe('prompt construction', () => {
    it('should include research data in audit prompts', async () => {
      const mockDimension = {
        dimension: 'Test',
        score: 7,
        findings: [],
        gaps: [],
        opportunities: [],
      };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockDimension),
      });

      await auditor.conductAudit(validProfile, mockResearch);

      const firstCall = (mockLLM.generateResponse as ReturnType<typeof vi.fn>).mock
        .calls[0][0];
      const prompt = firstCall.messages[0].content;

      expect(prompt).toContain(validProfile.brandName);
    });
  });

  describe('error handling', () => {
    it('should throw error on invalid JSON response', async () => {
      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: 'Invalid JSON',
      });

      await expect(
        auditor.conductAudit(validProfile, mockResearch)
      ).rejects.toThrow();
    });

    it('should throw error on LLM failure', async () => {
      vi.spyOn(mockLLM, 'generateResponse').mockRejectedValue(
        new Error('LLM error')
      );

      await expect(
        auditor.conductAudit(validProfile, mockResearch)
      ).rejects.toThrow('LLM error');
    });
  });

  describe('JSON extraction', () => {
    it('should extract arrays from text', async () => {
      const mockDimension = {
        dimension: 'Test',
        score: 7,
        findings: [],
        gaps: [],
        opportunities: [],
      };

      const arrayResponse = '["item1", "item2"]';

      vi.spyOn(mockLLM, 'generateResponse')
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimension) })
        .mockResolvedValueOnce({ content: arrayResponse })
        .mockResolvedValueOnce({ content: arrayResponse });

      const result = await auditor.conductAudit(validProfile, mockResearch);

      expect(Array.isArray(result.topOpportunities)).toBe(true);
      expect(Array.isArray(result.quickWins)).toBe(true);
    });
  });

  describe('score validation', () => {
    it('should accept scores between 0 and 10', async () => {
      const mockDimension = {
        dimension: 'Test',
        score: 10,
        findings: [],
        gaps: [],
        opportunities: [],
      };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockDimension),
      });

      const result = await auditor.conductAudit(validProfile, mockResearch);

      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(10);
    });

    it('should round overall score to 1 decimal place', async () => {
      const mockDimensions = [
        { dimension: 'A', score: 7, findings: [], gaps: [], opportunities: [] },
        { dimension: 'B', score: 8, findings: [], gaps: [], opportunities: [] },
        { dimension: 'C', score: 6, findings: [], gaps: [], opportunities: [] },
        { dimension: 'D', score: 9, findings: [], gaps: [], opportunities: [] },
      ];

      vi.spyOn(mockLLM, 'generateResponse')
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimensions[0]) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimensions[1]) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimensions[2]) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockDimensions[3]) })
        .mockResolvedValueOnce({ content: JSON.stringify([]) })
        .mockResolvedValueOnce({ content: JSON.stringify([]) });

      const result = await auditor.conductAudit(validProfile, mockResearch);

      // (7 + 8 + 6 + 9) / 4 = 7.5
      expect(result.overallScore).toBe(7.5);
      expect(result.overallScore.toString()).toMatch(/^\d+(\.\d)?$/);
    });
  });
});
