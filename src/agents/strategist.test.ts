import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StrategistAgent } from './strategist.js';
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

describe('StrategistAgent', () => {
  let mockLLM: LLMAdapter;
  let strategist: StrategistAgent;

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
          differentiationOpportunity: 'Affordability',
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
      decisionFactors: ['Price'],
    },
    brandDNA: {
      uniqueValueProposition: 'Simple tech',
      brandStory: 'Founded by engineers',
      coreStrengths: ['Innovation'],
      brandHeritage: undefined,
      founderStory: 'Garage story',
    },
    synthesisNotes: 'Strategic insights...',
  };

  const mockAudit: AuditReport = {
    visualAudit: {
      dimension: 'Visual',
      score: 7,
      findings: [],
      gaps: [],
      opportunities: [],
    },
    messagingAudit: {
      dimension: 'Messaging',
      score: 6,
      findings: [],
      gaps: [],
      opportunities: [],
    },
    experienceAudit: {
      dimension: 'Experience',
      score: 7,
      findings: [],
      gaps: [],
      opportunities: [],
    },
    competitiveAudit: {
      dimension: 'Competitive',
      score: 5,
      findings: [],
      gaps: [],
      opportunities: [],
    },
    overallScore: 6.25,
    topOpportunities: ['Opportunity 1'],
    quickWins: ['Quick win 1'],
  };

  beforeEach(() => {
    mockLLM = createMockLLM();
    strategist = new StrategistAgent(mockLLM);
    vi.clearAllMocks();
  });

  describe('developStrategy', () => {
    it('should successfully develop strategy and return all components', async () => {
      const mockFoundation = {
        purpose: 'Empower people',
        vision: 'Industry leader',
        mission: 'Deliver value',
        values: ['Innovation', 'Integrity'],
      };

      const mockPositioning = {
        targetAudience: 'Tech professionals',
        marketPosition: 'Affordable innovation',
        differentiation: ['Easy to use', 'Great support'],
        proofPoints: ['1000+ customers'],
      };

      const mockPersonality = {
        primaryArchetype: 'Creator',
        secondaryArchetype: null,
        traits: ['Innovative', 'Helpful'],
        voiceAndTone: {
          voice: 'Friendly expert',
          toneAttributes: ['Warm', 'Professional'],
          examples: ['Example 1'],
        },
      };

      const mockVisualDirection = {
        designPrinciples: ['Simplicity', 'Clarity'],
        colorStrategy: {
          psychology: 'Trust and innovation',
          paletteDirection: ['Blue tones', 'Clean whites'],
        },
        typographyStrategy: 'Modern sans-serif',
        imageryGuidelines: ['Authentic photos'],
      };

      const mockMessagingFramework = {
        elevatorPitch: {
          fifteenSecond: '15s pitch',
          thirtySecond: '30s pitch',
          sixtySecond: '60s pitch',
        },
        keyMessages: ['Message 1', 'Message 2'],
        taglineOptions: ['Tagline 1', 'Tagline 2'],
        brandStoryNarrative: 'Full story here...',
      };

      const mockActivationStrategy = {
        primaryChannels: ['LinkedIn', 'Website'],
        contentPillars: ['Education', 'Innovation'],
        experienceMap: ['Onboarding', 'Support'],
      };

      const mockImplementationRoadmap = {
        quickWins: {
          timeline: '0-3 months',
          initiatives: ['Initiative 1'],
          deliverables: ['Deliverable 1'],
        },
        coreBuild: {
          timeline: '3-6 months',
          initiatives: ['Initiative 2'],
          deliverables: ['Deliverable 2'],
        },
        scale: {
          timeline: '6-12 months',
          initiatives: ['Initiative 3'],
          deliverables: ['Deliverable 3'],
        },
        successMetrics: ['Metric 1'],
      };

      vi.spyOn(mockLLM, 'generateResponse')
        .mockResolvedValueOnce({ content: JSON.stringify(mockFoundation) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockPositioning) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockPersonality) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockVisualDirection) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockMessagingFramework) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockActivationStrategy) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockImplementationRoadmap) });

      const result = await strategist.developStrategy(
        validProfile,
        mockResearch,
        mockAudit
      );

      expect(result).toBeDefined();
      expect(result.foundation).toEqual(mockFoundation);
      expect(result.positioning).toEqual(mockPositioning);
      expect(result.personality).toEqual(mockPersonality);
      expect(result.visualDirection).toEqual(mockVisualDirection);
      expect(result.messagingFramework).toEqual(mockMessagingFramework);
      expect(result.activationStrategy).toEqual(mockActivationStrategy);
      expect(result.implementationRoadmap).toEqual(mockImplementationRoadmap);
      expect(mockLLM.generateResponse).toHaveBeenCalledTimes(7);
    });

    it('should execute strategy components in parallel', async () => {
      const startTime = Date.now();

      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse').mockImplementation(
        async () =>
          new Promise((resolve) => {
            setTimeout(
              () => resolve({ content: JSON.stringify(mockResponse) }),
              100
            );
          })
      );

      await strategist.developStrategy(validProfile, mockResearch, mockAudit);
      const duration = Date.now() - startTime;

      // Should take ~100-200ms (parallel) not ~700ms (sequential)
      expect(duration).toBeLessThan(300);
    });
  });

  describe('temperature settings', () => {
    it('should use temperature 0.7 for most strategy tasks', async () => {
      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await strategist.developStrategy(validProfile, mockResearch, mockAudit);

      const calls = (mockLLM.generateResponse as ReturnType<typeof vi.fn>).mock.calls;
      // Most calls should use 0.7 (6 out of 7)
      // Note: Calls happen in parallel via Promise.all, so order is not guaranteed
      const temp07Count = calls.filter((call) => call[0].temperature === 0.7).length;
      const temp08Count = calls.filter((call) => call[0].temperature === 0.8).length;

      expect(temp07Count).toBe(6); // 6 calls use temperature 0.7
      expect(temp08Count).toBe(1); // 1 call (messaging) uses temperature 0.8
    });

    it('should use temperature 0.8 and higher max tokens for messaging', async () => {
      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await strategist.developStrategy(validProfile, mockResearch, mockAudit);

      const calls = (mockLLM.generateResponse as ReturnType<typeof vi.fn>).mock.calls;
      // Messaging framework call (index 4) should use 0.8 and 2000 tokens
      const messagingCall = calls[4][0];
      expect(messagingCall.temperature).toBe(0.8);
      expect(messagingCall.maxTokens).toBe(2000);
    });
  });

  describe('brand type adaptation', () => {
    it('should load brand type config for b2c_consumer', async () => {
      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await strategist.developStrategy(validProfile, mockResearch, mockAudit);

      expect(mockLLM.generateResponse).toHaveBeenCalled();
    });

    it('should handle different brand types', async () => {
      const luxuryProfile: BrandProfile = {
        ...validProfile,
        brandType: 'luxury_premium',
      };

      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      const result = await strategist.developStrategy(
        luxuryProfile,
        mockResearch,
        mockAudit
      );

      expect(result).toBeDefined();
    });
  });

  describe('prompt construction', () => {
    it('should include research and audit data in prompts', async () => {
      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await strategist.developStrategy(validProfile, mockResearch, mockAudit);

      const calls = (mockLLM.generateResponse as ReturnType<typeof vi.fn>).mock.calls;
      const prompts = calls.map((call) => call[0].messages[0].content);

      // Check that prompts contain relevant data
      expect(prompts.some((p) => p.includes(validProfile.brandName))).toBe(true);
    });

    it('should include brand DNA in foundation prompt', async () => {
      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await strategist.developStrategy(validProfile, mockResearch, mockAudit);

      const foundationCall = (mockLLM.generateResponse as ReturnType<typeof vi.fn>)
        .mock.calls[0][0];
      const prompt = foundationCall.messages[0].content;

      expect(prompt).toContain('Brand DNA');
    });

    it('should include top opportunities in positioning prompt', async () => {
      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await strategist.developStrategy(validProfile, mockResearch, mockAudit);

      const positioningCall = (mockLLM.generateResponse as ReturnType<typeof vi.fn>)
        .mock.calls[1][0];
      const prompt = positioningCall.messages[0].content;

      expect(prompt).toContain('Top Opportunities');
    });

    it('should include quick wins in roadmap prompt', async () => {
      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await strategist.developStrategy(validProfile, mockResearch, mockAudit);

      const roadmapCall = (mockLLM.generateResponse as ReturnType<typeof vi.fn>)
        .mock.calls[6][0];
      const prompt = roadmapCall.messages[0].content;

      expect(prompt).toContain('Quick Wins');
    });
  });

  describe('error handling', () => {
    it('should throw error on invalid JSON response', async () => {
      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: 'Invalid JSON',
      });

      await expect(
        strategist.developStrategy(validProfile, mockResearch, mockAudit)
      ).rejects.toThrow();
    });

    it('should throw error on LLM failure', async () => {
      vi.spyOn(mockLLM, 'generateResponse').mockRejectedValue(
        new Error('LLM error')
      );

      await expect(
        strategist.developStrategy(validProfile, mockResearch, mockAudit)
      ).rejects.toThrow('LLM error');
    });
  });

  describe('JSON extraction', () => {
    it('should extract JSON from markdown code blocks', async () => {
      const mockData = { test: 'value' };
      const wrappedJSON = `\`\`\`json\n${JSON.stringify(mockData)}\n\`\`\``;

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: wrappedJSON,
      });

      const result = await strategist.developStrategy(
        validProfile,
        mockResearch,
        mockAudit
      );

      expect(result).toBeDefined();
    });

    it('should extract JSON from text with surrounding content', async () => {
      const mockData = { test: 'value' };
      const textWithJSON = `Here is the result:\n${JSON.stringify(mockData)}\nThank you.`;

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: textWithJSON,
      });

      const result = await strategist.developStrategy(
        validProfile,
        mockResearch,
        mockAudit
      );

      expect(result).toBeDefined();
    });
  });

  describe('brand archetypes', () => {
    it('should include archetype options in personality prompt', async () => {
      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await strategist.developStrategy(validProfile, mockResearch, mockAudit);

      const personalityCall = (mockLLM.generateResponse as ReturnType<typeof vi.fn>)
        .mock.calls[2][0];
      const prompt = personalityCall.messages[0].content;

      expect(prompt).toContain('Hero');
      expect(prompt).toContain('Creator');
      expect(prompt).toContain('Sage');
    });
  });

  describe('implementation roadmap phases', () => {
    it('should create roadmap with three phases', async () => {
      const mockRoadmap = {
        quickWins: {
          timeline: '0-3 months',
          initiatives: ['Quick initiative'],
          deliverables: ['Quick deliverable'],
        },
        coreBuild: {
          timeline: '3-6 months',
          initiatives: ['Core initiative'],
          deliverables: ['Core deliverable'],
        },
        scale: {
          timeline: '6-12 months',
          initiatives: ['Scale initiative'],
          deliverables: ['Scale deliverable'],
        },
        successMetrics: ['Metric 1', 'Metric 2'],
      };

      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse')
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockRoadmap) });

      const result = await strategist.developStrategy(
        validProfile,
        mockResearch,
        mockAudit
      );

      expect(result.implementationRoadmap.quickWins).toBeDefined();
      expect(result.implementationRoadmap.coreBuild).toBeDefined();
      expect(result.implementationRoadmap.scale).toBeDefined();
      expect(result.implementationRoadmap.successMetrics).toBeDefined();
    });
  });
});
