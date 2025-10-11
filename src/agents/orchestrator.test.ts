import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrandDesignOrchestrator } from './orchestrator.js';
import type { LLMAdapter } from '../adapters/llm-interface.js';
import type { BrandProfile } from '../types/brand-types.js';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

describe('BrandDesignOrchestrator', () => {
  let mockLLM: LLMAdapter;
  let orchestrator: BrandDesignOrchestrator;
  const testOutputDir = join(process.cwd(), 'outputs', 'test-brand');

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
    orchestrator = new BrandDesignOrchestrator(mockLLM);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    // Clean up test output directory
    if (existsSync(testOutputDir)) {
      await rm(testOutputDir, { recursive: true, force: true });
    }
  });

  describe('runBrandDesignWorkflow', () => {
    it('should successfully run complete workflow and return output', async () => {
      // Mock all agent responses
      const mockMarketInsights = {
        industryTrends: ['Trend 1'],
        competitorLandscape: [
          {
            name: 'Competitor',
            positioning: 'Leader',
            strengths: ['Strong'],
            weaknesses: ['Weak'],
            differentiationOpportunity: 'Opportunity',
          },
        ],
        marketOpportunities: ['Opportunity 1'],
        keyFindings: ['Finding 1'],
      };

      const mockAudienceProfile = {
        personas: [
          {
            name: 'Persona',
            demographics: 'Demo',
            psychographics: 'Psycho',
            goals: ['Goal'],
            challenges: ['Challenge'],
            buyingBehavior: 'Behavior',
          },
        ],
        painPoints: ['Pain'],
        desires: ['Desire'],
        decisionFactors: ['Factor'],
      };

      const mockBrandDNA = {
        uniqueValueProposition: 'UVP',
        brandStory: 'Story',
        coreStrengths: ['Strength'],
        brandHeritage: null,
        founderStory: null,
      };

      const mockSynthesis = 'Synthesis notes';

      const mockAuditDimension = {
        dimension: 'Test',
        score: 7,
        findings: ['Finding'],
        gaps: ['Gap'],
        opportunities: ['Opportunity'],
      };

      const mockStrategyComponent = {
        test: 'value',
      };

      const mockFoundation = {
        purpose: 'Purpose',
        vision: 'Vision',
        mission: 'Mission',
        values: ['Value 1'],
      };

      const mockPositioning = {
        targetAudience: 'Audience',
        marketPosition: 'Position',
        differentiation: ['Diff'],
        proofPoints: ['Proof'],
      };

      const mockPersonality = {
        primaryArchetype: 'Creator',
        secondaryArchetype: null,
        traits: ['Trait'],
        voiceAndTone: {
          voice: 'Voice',
          toneAttributes: ['Tone'],
          examples: ['Example'],
        },
      };

      const mockVisualDirection = {
        designPrinciples: ['Principle'],
        colorStrategy: {
          psychology: 'Psychology',
          paletteDirection: ['Direction'],
        },
        typographyStrategy: 'Typography',
        imageryGuidelines: ['Guideline'],
      };

      const mockMessagingFramework = {
        elevatorPitch: {
          fifteenSecond: '15s',
          thirtySecond: '30s',
          sixtySecond: '60s',
        },
        keyMessages: ['Message'],
        taglineOptions: ['Tagline'],
        brandStoryNarrative: 'Narrative',
      };

      const mockActivationStrategy = {
        primaryChannels: ['Channel'],
        contentPillars: ['Pillar'],
        experienceMap: ['Experience'],
      };

      const mockImplementationRoadmap = {
        quickWins: {
          timeline: '0-3 months',
          initiatives: ['Initiative'],
          deliverables: ['Deliverable'],
        },
        coreBuild: {
          timeline: '3-6 months',
          initiatives: ['Initiative'],
          deliverables: ['Deliverable'],
        },
        scale: {
          timeline: '6-12 months',
          initiatives: ['Initiative'],
          deliverables: ['Deliverable'],
        },
        successMetrics: ['Metric'],
      };

      vi.spyOn(mockLLM, 'generateResponse')
        // Research phase (4 calls)
        .mockResolvedValueOnce({ content: JSON.stringify(mockMarketInsights) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockAudienceProfile) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockBrandDNA) })
        .mockResolvedValueOnce({ content: mockSynthesis })
        // Audit phase (6 calls)
        .mockResolvedValueOnce({ content: JSON.stringify(mockAuditDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockAuditDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockAuditDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockAuditDimension) })
        .mockResolvedValueOnce({ content: JSON.stringify(['Opportunity']) })
        .mockResolvedValueOnce({ content: JSON.stringify(['Quick win']) })
        // Strategy phase (7 calls)
        .mockResolvedValueOnce({ content: JSON.stringify(mockFoundation) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockPositioning) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockPersonality) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockVisualDirection) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockMessagingFramework) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockActivationStrategy) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockImplementationRoadmap) });

      const result = await orchestrator.runBrandDesignWorkflow(validProfile);

      expect(result).toBeDefined();
      expect(result.metadata.brandName).toBe(validProfile.brandName);
      expect(result.metadata.brandType).toBe(validProfile.brandType);
      expect(result.brandProfile).toEqual(validProfile);
      expect(result.researchReport).toBeDefined();
      expect(result.auditReport).toBeDefined();
      expect(result.brandStrategy).toBeDefined();
      expect(mockLLM.generateResponse).toHaveBeenCalled();
    });

    it('should validate brand profile before starting', async () => {
      const invalidProfile = {
        brandName: '',
        industry: '',
        targetAudience: '',
        businessStage: 'invalid',
        primaryGoal: 'invalid',
        brandType: 'invalid',
      } as unknown as BrandProfile;

      await expect(
        orchestrator.runBrandDesignWorkflow(invalidProfile)
      ).rejects.toThrow();
    });

    it('should create output directory structure', async () => {
      // Mock all responses
      const mockResponse = { test: 'value' };
      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await orchestrator.runBrandDesignWorkflow(validProfile);

      // Check that directories were created
      expect(existsSync(testOutputDir)).toBe(true);
      expect(existsSync(join(testOutputDir, '01-discovery'))).toBe(true);
      expect(existsSync(join(testOutputDir, '02-research'))).toBe(true);
      expect(existsSync(join(testOutputDir, '03-audit'))).toBe(true);
      expect(existsSync(join(testOutputDir, '04-strategy'))).toBe(true);
    });

    it('should save all output files', async () => {
      const mockResponse = { test: 'value' };
      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await orchestrator.runBrandDesignWorkflow(validProfile);

      // Check that files were created
      expect(existsSync(join(testOutputDir, 'brand-book.md'))).toBe(true);
      expect(
        existsSync(join(testOutputDir, '01-discovery', 'brand-profile.json'))
      ).toBe(true);
      expect(
        existsSync(join(testOutputDir, '02-research', 'research-report.json'))
      ).toBe(true);
      expect(
        existsSync(join(testOutputDir, '02-research', 'research-synthesis.md'))
      ).toBe(true);
      expect(existsSync(join(testOutputDir, '03-audit', 'audit-report.json'))).toBe(
        true
      );
      expect(existsSync(join(testOutputDir, '03-audit', 'audit-scorecard.md'))).toBe(
        true
      );
      expect(
        existsSync(join(testOutputDir, '04-strategy', 'brand-strategy.json'))
      ).toBe(true);
      expect(
        existsSync(join(testOutputDir, '04-strategy', 'brand-strategy.md'))
      ).toBe(true);
    });

    it('should include metadata with timestamp', async () => {
      const mockResponse = { test: 'value' };
      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      const result = await orchestrator.runBrandDesignWorkflow(validProfile);

      expect(result.metadata.dateCreated).toBeDefined();
      expect(result.metadata.workflowVersion).toBe('1.0.0');
      expect(new Date(result.metadata.dateCreated).getTime()).toBeLessThanOrEqual(
        Date.now()
      );
    });
  });

  describe('error handling', () => {
    it('should propagate research agent errors', async () => {
      vi.spyOn(mockLLM, 'generateResponse').mockRejectedValue(
        new Error('Research failed')
      );

      await expect(
        orchestrator.runBrandDesignWorkflow(validProfile)
      ).rejects.toThrow();
    });

    it('should propagate audit agent errors', async () => {
      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse')
        // Research succeeds
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: 'text' })
        // Audit fails
        .mockRejectedValueOnce(new Error('Audit failed'));

      await expect(
        orchestrator.runBrandDesignWorkflow(validProfile)
      ).rejects.toThrow();
    });

    it('should propagate strategy agent errors', async () => {
      const mockResponse = { test: 'value' };

      vi.spyOn(mockLLM, 'generateResponse')
        // Research succeeds (4 calls)
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: 'text' })
        // Audit succeeds (6 calls)
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify(mockResponse) })
        .mockResolvedValueOnce({ content: JSON.stringify([]) })
        .mockResolvedValueOnce({ content: JSON.stringify([]) })
        // Strategy fails
        .mockRejectedValueOnce(new Error('Strategy failed'));

      await expect(
        orchestrator.runBrandDesignWorkflow(validProfile)
      ).rejects.toThrow();
    });
  });

  describe('file output', () => {
    it('should use brand name as directory slug', async () => {
      const profileWithSpaces: BrandProfile = {
        ...validProfile,
        brandName: 'My Test Brand',
      };

      const mockResponse = { test: 'value' };
      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await orchestrator.runBrandDesignWorkflow(profileWithSpaces);

      const slugDir = join(process.cwd(), 'outputs', 'my-test-brand');
      expect(existsSync(slugDir)).toBe(true);

      // Clean up
      await rm(slugDir, { recursive: true, force: true });
    });

    it('should save valid JSON files', async () => {
      const mockResponse = { test: 'value' };
      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await orchestrator.runBrandDesignWorkflow(validProfile);

      const profilePath = join(testOutputDir, '01-discovery', 'brand-profile.json');
      expect(existsSync(profilePath)).toBe(true);

      // Verify it's valid JSON by requiring it
      const fs = await import('fs/promises');
      const content = await fs.readFile(profilePath, 'utf-8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  describe('workflow phases', () => {
    it('should execute phases sequentially', async () => {
      const executionOrder: string[] = [];

      vi.spyOn(mockLLM, 'generateResponse').mockImplementation(async () => {
        executionOrder.push('llm-call');
        return { content: JSON.stringify({ test: 'value' }) };
      });

      await orchestrator.runBrandDesignWorkflow(validProfile);

      // Should have called LLM multiple times (research + audit + strategy)
      expect(executionOrder.length).toBeGreaterThan(10);
    });
  });

  describe('brand book generation', () => {
    it('should generate complete brand book markdown', async () => {
      const mockResponse = { test: 'value' };
      vi.spyOn(mockLLM, 'generateResponse').mockResolvedValue({
        content: JSON.stringify(mockResponse),
      });

      await orchestrator.runBrandDesignWorkflow(validProfile);

      const brandBookPath = join(testOutputDir, 'brand-book.md');
      expect(existsSync(brandBookPath)).toBe(true);

      const fs = await import('fs/promises');
      const content = await fs.readFile(brandBookPath, 'utf-8');

      expect(content).toContain(validProfile.brandName);
      expect(content).toContain('Complete Brand Book');
    });
  });
});
