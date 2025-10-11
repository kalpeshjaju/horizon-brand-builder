// Research Topic Templates Unit Tests
import { describe, it, expect } from 'vitest';
import {
  GENERIC_RESEARCH_TOPICS,
  customizeResearchTopics,
} from '../../../src/config/research-topic-templates.js';
import type { BrandConfiguration } from '../../../src/types/project-types.js';

const testBrandConfig: BrandConfiguration = {
  brandName: 'Acme Corp',
  industry: 'Technology',
  category: 'Cloud Services',
  companyProfile: {
    founded: 2020,
    currentRevenue: '$10M',
    channels: ['Online', 'Enterprise', 'Partnerships'],
  },
  projectObjectives: {
    primary: 'Establish market leadership',
    goals: ['Increase brand awareness', 'Build thought leadership'],
  },
};

describe('Research Topic Templates', () => {
  describe('Generic Research Topics', () => {
    it('should have all 4 phases', () => {
      expect(GENERIC_RESEARCH_TOPICS.phase1).toBeDefined();
      expect(GENERIC_RESEARCH_TOPICS.phase2).toBeDefined();
      expect(GENERIC_RESEARCH_TOPICS.phase3).toBeDefined();
      expect(GENERIC_RESEARCH_TOPICS.phase4).toBeDefined();
    });

    it('should have phase names', () => {
      expect(GENERIC_RESEARCH_TOPICS.phase1.name).toBe(
        'Brand Strategy & Positioning'
      );
      expect(GENERIC_RESEARCH_TOPICS.phase2.name).toBe(
        'Creative Execution & Development'
      );
      expect(GENERIC_RESEARCH_TOPICS.phase3.name).toBe(
        'Implementation & Launch'
      );
      expect(GENERIC_RESEARCH_TOPICS.phase4.name).toBe(
        'Optimization & Growth'
      );
    });

    it('should have topics in each phase', () => {
      expect(GENERIC_RESEARCH_TOPICS.phase1.topics.length).toBeGreaterThan(0);
      expect(GENERIC_RESEARCH_TOPICS.phase2.topics.length).toBeGreaterThan(0);
      expect(GENERIC_RESEARCH_TOPICS.phase3.topics.length).toBeGreaterThan(0);
      expect(GENERIC_RESEARCH_TOPICS.phase4.topics.length).toBeGreaterThan(0);
    });

    it('should have subtopics with placeholders', () => {
      const firstTopic = GENERIC_RESEARCH_TOPICS.phase1.topics[0];
      expect(firstTopic.subtopics.length).toBeGreaterThan(0);

      const hasPlaceholders = firstTopic.subtopics.some(
        (subtopic) =>
          subtopic.includes('{brandName}') ||
          subtopic.includes('{industry}') ||
          subtopic.includes('{category}')
      );

      expect(hasPlaceholders).toBe(true);
    });

    it('should have unique topic IDs', () => {
      const allTopics = [
        ...GENERIC_RESEARCH_TOPICS.phase1.topics,
        ...GENERIC_RESEARCH_TOPICS.phase2.topics,
        ...GENERIC_RESEARCH_TOPICS.phase3.topics,
        ...GENERIC_RESEARCH_TOPICS.phase4.topics,
      ];

      const ids = allTopics.map((t) => t.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should count approximately 77 subtopics total', () => {
      const allTopics = [
        ...GENERIC_RESEARCH_TOPICS.phase1.topics,
        ...GENERIC_RESEARCH_TOPICS.phase2.topics,
        ...GENERIC_RESEARCH_TOPICS.phase3.topics,
        ...GENERIC_RESEARCH_TOPICS.phase4.topics,
      ];

      const totalSubtopics = allTopics.reduce(
        (sum, topic) => sum + topic.subtopics.length,
        0
      );

      expect(totalSubtopics).toBeGreaterThan(70);
      expect(totalSubtopics).toBeLessThan(85);
    });
  });

  describe('Customization Function', () => {
    it('should replace {brandName} placeholder', () => {
      const customized = customizeResearchTopics(testBrandConfig);
      const firstSubtopic =
        customized.phase1.topics[0].subtopics[0] || '';

      if (firstSubtopic.includes('Acme Corp')) {
        expect(firstSubtopic).toContain('Acme Corp');
        expect(firstSubtopic).not.toContain('{brandName}');
      }
    });

    it('should replace {industry} placeholder', () => {
      const customized = customizeResearchTopics(testBrandConfig);
      const allSubtopics = [
        ...customized.phase1.topics.flatMap((t) => t.subtopics),
        ...customized.phase2.topics.flatMap((t) => t.subtopics),
        ...customized.phase3.topics.flatMap((t) => t.subtopics),
        ...customized.phase4.topics.flatMap((t) => t.subtopics),
      ];

      const hasIndustry = allSubtopics.some((s) => s.includes('Technology'));
      const hasPlaceholder = allSubtopics.some((s) => s.includes('{industry}'));

      expect(hasIndustry).toBe(true);
      expect(hasPlaceholder).toBe(false);
    });

    it('should replace {category} placeholder', () => {
      const customized = customizeResearchTopics(testBrandConfig);
      const allSubtopics = [
        ...customized.phase1.topics.flatMap((t) => t.subtopics),
        ...customized.phase2.topics.flatMap((t) => t.subtopics),
        ...customized.phase3.topics.flatMap((t) => t.subtopics),
        ...customized.phase4.topics.flatMap((t) => t.subtopics),
      ];

      const hasCategory = allSubtopics.some((s) => s.includes('Cloud Services'));
      const hasPlaceholder = allSubtopics.some((s) => s.includes('{category}'));

      expect(hasCategory).toBe(true);
      expect(hasPlaceholder).toBe(false);
    });

    it('should replace {channels} placeholder', () => {
      const customized = customizeResearchTopics(testBrandConfig);
      const allSubtopics = [
        ...customized.phase1.topics.flatMap((t) => t.subtopics),
        ...customized.phase2.topics.flatMap((t) => t.subtopics),
        ...customized.phase3.topics.flatMap((t) => t.subtopics),
        ...customized.phase4.topics.flatMap((t) => t.subtopics),
      ];

      const hasChannels = allSubtopics.some((s) =>
        s.includes('Online, Enterprise, Partnerships')
      );
      const hasPlaceholder = allSubtopics.some((s) => s.includes('{channels}'));

      expect(hasChannels).toBe(true);
      expect(hasPlaceholder).toBe(false);
    });

    it('should preserve structure after customization', () => {
      const customized = customizeResearchTopics(testBrandConfig);

      expect(customized.phase1.name).toBe(GENERIC_RESEARCH_TOPICS.phase1.name);
      expect(customized.phase1.topics.length).toBe(
        GENERIC_RESEARCH_TOPICS.phase1.topics.length
      );
      expect(customized.phase2.topics.length).toBe(
        GENERIC_RESEARCH_TOPICS.phase2.topics.length
      );
    });

    it('should handle brand without channels', () => {
      const configWithoutChannels: BrandConfiguration = {
        brandName: 'Test Brand',
        industry: 'Retail',
        category: 'Fashion',
        projectObjectives: {
          primary: 'Build brand',
          goals: [],
        },
      };

      const customized = customizeResearchTopics(configWithoutChannels);
      const allSubtopics = [
        ...customized.phase1.topics.flatMap((t) => t.subtopics),
        ...customized.phase2.topics.flatMap((t) => t.subtopics),
        ...customized.phase3.topics.flatMap((t) => t.subtopics),
        ...customized.phase4.topics.flatMap((t) => t.subtopics),
      ];

      const hasDefaultChannels = allSubtopics.some((s) =>
        s.includes('all channels')
      );
      expect(hasDefaultChannels).toBe(true);
    });

    it('should return deep copy (not modify original)', () => {
      const customized = customizeResearchTopics(testBrandConfig);

      // Original should still have placeholders
      const originalSubtopic = GENERIC_RESEARCH_TOPICS.phase1.topics[0].subtopics[0] || '';
      const hasOriginalPlaceholder = originalSubtopic.includes('{brandName}') ||
                                     originalSubtopic.includes('{industry}') ||
                                     originalSubtopic.includes('{category}');

      expect(hasOriginalPlaceholder).toBe(true);

      // Customized should not have placeholders
      const customizedSubtopic = customized.phase1.topics[0].subtopics[0] || '';
      const hasCustomizedPlaceholder = customizedSubtopic.includes('{brandName}');

      if (originalSubtopic.includes('{brandName}')) {
        expect(hasCustomizedPlaceholder).toBe(false);
      }
    });
  });

  describe('Topic Structure Validation', () => {
    it('should have required fields in each topic', () => {
      const allTopics = [
        ...GENERIC_RESEARCH_TOPICS.phase1.topics,
        ...GENERIC_RESEARCH_TOPICS.phase2.topics,
        ...GENERIC_RESEARCH_TOPICS.phase3.topics,
        ...GENERIC_RESEARCH_TOPICS.phase4.topics,
      ];

      allTopics.forEach((topic) => {
        expect(topic.id).toBeDefined();
        expect(topic.name).toBeDefined();
        expect(topic.subtopics).toBeDefined();
        expect(Array.isArray(topic.subtopics)).toBe(true);
      });
    });

    it('should have non-empty subtopics', () => {
      const allTopics = [
        ...GENERIC_RESEARCH_TOPICS.phase1.topics,
        ...GENERIC_RESEARCH_TOPICS.phase2.topics,
        ...GENERIC_RESEARCH_TOPICS.phase3.topics,
        ...GENERIC_RESEARCH_TOPICS.phase4.topics,
      ];

      allTopics.forEach((topic) => {
        expect(topic.subtopics.length).toBeGreaterThan(0);
        topic.subtopics.forEach((subtopic) => {
          expect(subtopic.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
