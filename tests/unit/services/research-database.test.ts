// Research Database Unit Tests
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ResearchDatabase } from '../../../src/services/research-database/index.js';
import type { BrandConfiguration } from '../../../src/types/project-types.js';
import type { ResearchFinding } from '../../../src/types/research-types.js';
import fs from 'fs/promises';
import path from 'path';

const testBrandConfig: BrandConfiguration = {
  brandName: 'Test Research Brand',
  industry: 'Technology',
  category: 'Software',
  projectObjectives: {
    primary: 'Build a strong brand',
    goals: ['Goal 1', 'Goal 2'],
  },
};

const dataDir = path.join(process.cwd(), 'data', 'test-research-brand');
const dataFile = path.join(dataDir, 'research-db.json');

const sampleFinding: ResearchFinding = {
  topic: 'Market Research',
  content: 'The technology market is growing rapidly with AI adoption.',
  sources: [
    {
      title: 'Tech Trends 2025',
      url: 'https://example.com/tech-trends',
      tier: 1,
    },
  ],
  confidence: 8,
  timestamp: new Date().toISOString(),
};

describe('ResearchDatabase', () => {
  let database: ResearchDatabase;

  beforeEach(async () => {
    database = new ResearchDatabase(testBrandConfig);
  });

  afterEach(async () => {
    // Clean up test data
    try {
      await fs.rm(dataDir, { recursive: true, force: true });
    } catch {
      // Ignore if doesn't exist
    }
  });

  describe('Initialization', () => {
    it('should initialize with brand configuration', async () => {
      await database.initialize();
      const exists = await fs
        .access(dataFile)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);
    });

    it('should create empty database on first init', async () => {
      await database.initialize();
      const findings = await database.getAllFindings();
      expect(findings).toHaveLength(0);
    });

    it('should load existing data on re-initialization', async () => {
      await database.initialize();
      await database.addFinding(sampleFinding);

      const database2 = new ResearchDatabase(testBrandConfig);
      await database2.initialize();
      const findings = await database2.getAllFindings();

      expect(findings).toHaveLength(1);
    });
  });

  describe('Adding Findings', () => {
    beforeEach(async () => {
      await database.initialize();
    });

    it('should add a single finding', async () => {
      await database.addFinding(sampleFinding);
      const findings = await database.getAllFindings();

      expect(findings).toHaveLength(1);
      expect(findings[0].topic).toBe('Market Research');
    });

    it('should add multiple findings', async () => {
      const findings: ResearchFinding[] = [
        sampleFinding,
        {
          ...sampleFinding,
          topic: 'Competitor Analysis',
          content: 'Different content',
        },
      ];

      await database.addFindings(findings);
      const allFindings = await database.getAllFindings();

      expect(allFindings).toHaveLength(2);
    });

    it('should update metadata after adding', async () => {
      await database.addFinding(sampleFinding);
      const stats = await database.getStats();

      expect(stats.metadata.totalFindings).toBe(1);
      expect(stats.metadata.topics).toContain('Market Research');
    });
  });

  describe('Search Functionality', () => {
    beforeEach(async () => {
      await database.initialize();
      await database.addFindings([
        sampleFinding,
        {
          topic: 'Competitor Analysis',
          content: 'Competitor ABC is leading in cloud services.',
          sources: [
            {
              title: 'Competitor Report',
              url: 'https://example.com/competitor',
              tier: 2,
            },
          ],
          confidence: 7,
        },
        {
          topic: 'Market Research',
          content: 'AI and machine learning are key trends.',
          sources: [
            {
              title: 'AI Report',
              url: 'https://example.com/ai',
              tier: 1,
            },
          ],
          confidence: 9,
        },
      ]);
    });

    it('should search by keyword', async () => {
      const results = await database.searchByKeyword('AI');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].content).toContain('AI');
    });

    it('should search by topic', async () => {
      const results = await database.searchByTopic('Market Research');
      expect(results).toHaveLength(2);
    });

    it('should filter by confidence level', async () => {
      const highConfidence = await database.getHighConfidenceFindings();
      expect(highConfidence.length).toBeGreaterThan(0);
      expect(highConfidence.every((f) => (f.confidence || 0) >= 8)).toBe(true);
    });

    it('should find low confidence findings', async () => {
      const lowConfidence = await database.getLowConfidenceFindings();
      expect(lowConfidence.length).toBeGreaterThan(0);
      expect(lowConfidence.every((f) => (f.confidence || 10) < 6)).toBe(true);
    });

    it('should search with multiple filters', async () => {
      const results = await database.searchFindings({
        query: 'market',
        minConfidence: 8,
      });

      expect(results.length).toBeGreaterThan(0);
      expect(results.every((f) => (f.confidence || 0) >= 8)).toBe(true);
    });

    it('should limit search results', async () => {
      const results = await database.searchFindings({
        maxResults: 1,
      });

      expect(results).toHaveLength(1);
    });
  });

  describe('Statistics', () => {
    beforeEach(async () => {
      await database.initialize();
      await database.addFindings([
        sampleFinding,
        {
          topic: 'Competitor Analysis',
          content: 'Analysis content here',
          sources: [
            {
              title: 'Source 1',
              url: 'https://example.com/1',
            },
          ],
          confidence: 6,
        },
        {
          topic: 'Market Research',
          content: 'More market research',
          sources: [
            {
              title: 'Source 2',
              url: 'https://example.com/2',
            },
          ],
          confidence: 4,
        },
      ]);
    });

    it('should calculate total findings', async () => {
      const stats = await database.getStats();
      expect(stats.metadata.totalFindings).toBe(3);
    });

    it('should track unique topics', async () => {
      const stats = await database.getStats();
      expect(stats.metadata.topics).toHaveLength(2);
      expect(stats.metadata.topics).toContain('Market Research');
      expect(stats.metadata.topics).toContain('Competitor Analysis');
    });

    it('should track unique sources', async () => {
      const stats = await database.getStats();
      expect(stats.metadata.sources).toBe(3); // 3 unique URLs
    });

    it('should categorize by confidence levels', async () => {
      const stats = await database.getStats();
      expect(stats.indexStats.confidenceLevels.high).toBeGreaterThan(0);
      expect(stats.indexStats.confidenceLevels.medium).toBeGreaterThan(0);
      expect(stats.indexStats.confidenceLevels.low).toBeGreaterThan(0);
    });

    it('should extract top keywords', async () => {
      const stats = await database.getStats();
      expect(stats.indexStats.topKeywords.length).toBeGreaterThan(0);
    });
  });

  describe('Indexing', () => {
    beforeEach(async () => {
      await database.initialize();
      await database.addFindings([
        sampleFinding,
        {
          topic: 'Different Topic',
          content: 'Different content with unique keywords',
          sources: [
            {
              title: 'Source',
              url: 'https://example.com/source',
            },
          ],
          confidence: 7,
        },
      ]);
    });

    it('should index by topics', async () => {
      const stats = await database.getStats();
      expect(stats.indexStats.totalTopics).toBe(2);
    });

    it('should index by sources', async () => {
      const stats = await database.getStats();
      expect(stats.indexStats.totalSources).toBe(2);
    });
  });

  describe('Database Operations', () => {
    beforeEach(async () => {
      await database.initialize();
    });

    it('should clear database', async () => {
      await database.addFinding(sampleFinding);
      await database.clear();

      const findings = await database.getAllFindings();
      expect(findings).toHaveLength(0);

      const stats = await database.getStats();
      expect(stats.metadata.totalFindings).toBe(0);
    });

    it('should get data file path', () => {
      const filePath = database.getDataFile();
      expect(filePath).toContain('test-research-brand');
      expect(filePath).toContain('research-db.json');
    });

    it('should persist data to disk', async () => {
      await database.addFinding(sampleFinding);

      // Read file directly
      const content = await fs.readFile(dataFile, 'utf-8');
      const data = JSON.parse(content);

      expect(data.findings).toHaveLength(1);
      expect(data.metadata.brandName).toBe('Test Research Brand');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when operating on uninitialized database', async () => {
      const uninitializedDb = new ResearchDatabase(testBrandConfig);
      await expect(uninitializedDb.getAllFindings()).rejects.toThrow();
    });

    it('should handle missing confidence gracefully', async () => {
      await database.initialize();
      const findingWithoutConfidence: ResearchFinding = {
        topic: 'Test',
        content: 'Content',
        sources: [{ title: 'Source', url: 'https://example.com' }],
      };

      await database.addFinding(findingWithoutConfidence);
      const findings = await database.getAllFindings();

      expect(findings).toHaveLength(1);
    });
  });
});
