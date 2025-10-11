// Tests for Research Database service

import { describe, it, expect, beforeEach } from 'vitest';
import { ResearchDatabase } from './research-database.js';
import type { ResearchInsight } from '../types/database-types.js';
import { rm, mkdir } from 'fs/promises';
import { join } from 'path';

describe('ResearchDatabase', () => {
  let db: ResearchDatabase;
  const testDbPath = join(process.cwd(), 'data', 'test-research-db.json');

  beforeEach(async () => {
    // Clean up test database
    try {
      await rm(testDbPath, { force: true });
    } catch {
      // File doesn't exist, ignore
    }

    db = new ResearchDatabase({
      storagePath: testDbPath,
      autoSave: false, // Disable auto-save for testing
      enableIndexing: true,
    });

    await db.initialize();
  });

  describe('initialize', () => {
    it('should initialize empty database', async () => {
      const stats = db.getStats();
      expect(stats.totalInsights).toBe(0);
    });

    it('should create data directory if missing', async () => {
      // Remove data directory
      try {
        await rm(join(process.cwd(), 'data'), { recursive: true, force: true });
      } catch {
        // Ignore
      }

      const newDb = new ResearchDatabase({ storagePath: testDbPath });
      await newDb.initialize();

      const stats = newDb.getStats();
      expect(stats.totalInsights).toBe(0);
    });
  });

  describe('store', () => {
    it('should store insight with generated ID and timestamp', async () => {
      const insight = await db.store({
        brandName: 'TestBrand',
        phase: 1,
        topic: 'Market Research',
        subtopic: 'Market Size',
        insight: 'The market is growing at 15% annually',
        confidence: 'HIGH',
        sources: [
          {
            url: 'https://example.com/report',
            title: 'Industry Report 2024',
            qualityScore: 85,
            tier: 'tier2',
          },
        ],
        metadata: {
          competitorName: 'CompetitorX',
          category: 'research',
        },
      });

      expect(insight.id).toBeDefined();
      expect(insight.id).toContain('insight-');
      expect(insight.timestamp).toBeDefined();
      expect(insight.brandName).toBe('TestBrand');
      expect(insight.confidence).toBe('HIGH');
    });

    it('should auto-save when enabled', async () => {
      const autoSaveDb = new ResearchDatabase({
        storagePath: testDbPath,
        autoSave: true,
      });
      await autoSaveDb.initialize();

      await autoSaveDb.store({
        brandName: 'TestBrand',
        phase: 1,
        topic: 'Research',
        subtopic: 'Test',
        insight: 'Test insight',
        confidence: 'MEDIUM',
        sources: [],
        metadata: {},
      });

      // Create new DB instance to verify persistence
      const newDb = new ResearchDatabase({ storagePath: testDbPath });
      await newDb.initialize();

      const stats = newDb.getStats();
      expect(stats.totalInsights).toBe(1);
    });

    it('should update indexes when storing', async () => {
      await db.store({
        brandName: 'BrandA',
        phase: 1,
        topic: 'Strategy',
        subtopic: 'Positioning',
        insight: 'Test insight',
        confidence: 'HIGH',
        sources: [],
        metadata: { competitorName: 'CompA' },
      });

      const byTopic = db.getByTopic('Strategy');
      expect(byTopic.length).toBe(1);

      const byCompetitor = db.getByCompetitor('CompA');
      expect(byCompetitor.length).toBe(1);

      const byBrand = db.getByBrand('BrandA');
      expect(byBrand.length).toBe(1);
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      // Add test data
      await db.store({
        brandName: 'BrandA',
        phase: 1,
        topic: 'Market Research',
        subtopic: 'Market Size',
        insight: 'Market size is $10B',
        confidence: 'HIGH',
        sources: [],
        metadata: { competitorName: 'CompA' },
      });

      await db.store({
        brandName: 'BrandA',
        phase: 2,
        topic: 'Branding',
        subtopic: 'Visual Identity',
        insight: 'Logo should be modern',
        confidence: 'MEDIUM',
        sources: [],
        metadata: {},
      });

      await db.store({
        brandName: 'BrandB',
        phase: 1,
        topic: 'Market Research',
        subtopic: 'Competitor Analysis',
        insight: 'CompA is the market leader',
        confidence: 'HIGH',
        sources: [],
        metadata: { competitorName: 'CompA' },
      });
    });

    it('should search by brand name', () => {
      const result = db.search({
        term: '',
        filters: { brandName: 'BrandA' },
      });

      expect(result.insights.length).toBe(2);
      expect(result.filtered).toBe(2);
      expect(result.total).toBe(3);
    });

    it('should search by phase', () => {
      const result = db.search({
        term: '',
        filters: { phase: 1 },
      });

      expect(result.insights.length).toBe(2);
      expect(result.insights.every((i) => i.phase === 1)).toBe(true);
    });

    it('should search by topic', () => {
      const result = db.search({
        term: '',
        filters: { topic: 'Market' },
      });

      expect(result.insights.length).toBe(2);
      expect(result.insights.every((i) => i.topic.includes('Market'))).toBe(true);
    });

    it('should search by confidence', () => {
      const result = db.search({
        term: '',
        filters: { confidence: 'HIGH' },
      });

      expect(result.insights.length).toBe(2);
      expect(result.insights.every((i) => i.confidence === 'HIGH')).toBe(true);
    });

    it('should search by competitor name', () => {
      const result = db.search({
        term: '',
        filters: { competitorName: 'CompA' },
      });

      expect(result.insights.length).toBe(2);
    });

    it('should search by text term in insight', () => {
      const result = db.search({
        term: 'market leader',
      });

      expect(result.insights.length).toBe(1);
      expect(result.insights[0].insight).toContain('market leader');
    });

    it('should combine multiple filters', () => {
      const result = db.search({
        term: '',
        filters: {
          brandName: 'BrandA',
          phase: 1,
          confidence: 'HIGH',
        },
      });

      expect(result.insights.length).toBe(1);
      expect(result.insights[0].brandName).toBe('BrandA');
      expect(result.insights[0].phase).toBe(1);
      expect(result.insights[0].confidence).toBe('HIGH');
    });

    it('should be case insensitive', () => {
      const result = db.search({
        term: 'MARKET SIZE',
      });

      expect(result.insights.length).toBe(1);
    });
  });

  describe('getByTopic', () => {
    beforeEach(async () => {
      await db.store({
        brandName: 'TestBrand',
        phase: 1,
        topic: 'Market Research',
        subtopic: 'Size',
        insight: 'Test',
        confidence: 'HIGH',
        sources: [],
        metadata: {},
      });
    });

    it('should retrieve insights by exact topic', () => {
      const insights = db.getByTopic('Market Research');
      expect(insights.length).toBe(1);
      expect(insights[0].topic).toBe('Market Research');
    });

    it('should retrieve insights by partial topic', () => {
      const insights = db.getByTopic('Market');
      expect(insights.length).toBe(1);
    });

    it('should return empty array for non-existent topic', () => {
      const insights = db.getByTopic('NonExistent');
      expect(insights.length).toBe(0);
    });
  });

  describe('getByCompetitor', () => {
    beforeEach(async () => {
      await db.store({
        brandName: 'TestBrand',
        phase: 1,
        topic: 'Competition',
        subtopic: 'Analysis',
        insight: 'Test',
        confidence: 'HIGH',
        sources: [],
        metadata: { competitorName: 'CompetitorX' },
      });
    });

    it('should retrieve insights by competitor', () => {
      const insights = db.getByCompetitor('CompetitorX');
      expect(insights.length).toBe(1);
      expect(insights[0].metadata.competitorName).toBe('CompetitorX');
    });

    it('should be case insensitive', () => {
      const insights = db.getByCompetitor('competitorx');
      expect(insights.length).toBe(1);
    });

    it('should return empty array for non-existent competitor', () => {
      const insights = db.getByCompetitor('NonExistent');
      expect(insights.length).toBe(0);
    });
  });

  describe('getByBrand', () => {
    beforeEach(async () => {
      await db.store({
        brandName: 'BrandA',
        phase: 1,
        topic: 'Test',
        subtopic: 'Test',
        insight: 'Test',
        confidence: 'HIGH',
        sources: [],
        metadata: {},
      });

      await db.store({
        brandName: 'BrandB',
        phase: 1,
        topic: 'Test',
        subtopic: 'Test',
        insight: 'Test',
        confidence: 'HIGH',
        sources: [],
        metadata: {},
      });
    });

    it('should retrieve insights by brand', () => {
      const insights = db.getByBrand('BrandA');
      expect(insights.length).toBe(1);
      expect(insights[0].brandName).toBe('BrandA');
    });

    it('should be case insensitive', () => {
      const insights = db.getByBrand('branda');
      expect(insights.length).toBe(1);
    });
  });

  describe('getStats', () => {
    beforeEach(async () => {
      await db.store({
        brandName: 'BrandA',
        phase: 1,
        topic: 'Market',
        subtopic: 'Size',
        insight: 'Test 1',
        confidence: 'HIGH',
        sources: [],
        metadata: {},
      });

      await db.store({
        brandName: 'BrandA',
        phase: 2,
        topic: 'Branding',
        subtopic: 'Identity',
        insight: 'Test 2',
        confidence: 'MEDIUM',
        sources: [],
        metadata: {},
      });

      await db.store({
        brandName: 'BrandB',
        phase: 1,
        topic: 'Market',
        subtopic: 'Competition',
        insight: 'Test 3',
        confidence: 'HIGH',
        sources: [],
        metadata: {},
      });
    });

    it('should return total insights', () => {
      const stats = db.getStats();
      expect(stats.totalInsights).toBe(3);
    });

    it('should count insights by phase', () => {
      const stats = db.getStats();
      expect(stats.byPhase['phase1']).toBe(2);
      expect(stats.byPhase['phase2']).toBe(1);
    });

    it('should count insights by topic', () => {
      const stats = db.getStats();
      expect(stats.byTopic['Market']).toBe(2);
      expect(stats.byTopic['Branding']).toBe(1);
    });

    it('should count insights by confidence', () => {
      const stats = db.getStats();
      expect(stats.byConfidence['HIGH']).toBe(2);
      expect(stats.byConfidence['MEDIUM']).toBe(1);
    });

    it('should count insights by brand', () => {
      const stats = db.getStats();
      expect(stats.byBrand['BrandA']).toBe(2);
      expect(stats.byBrand['BrandB']).toBe(1);
    });
  });

  describe('export', () => {
    beforeEach(async () => {
      await db.store({
        brandName: 'TestBrand',
        phase: 1,
        topic: 'Market',
        subtopic: 'Size',
        insight: 'Market is $10B',
        confidence: 'HIGH',
        sources: [
          {
            url: 'https://example.com',
            title: 'Report',
            qualityScore: 85,
            tier: 'tier2',
          },
        ],
        metadata: { competitorName: 'CompA' },
      });
    });

    it('should export to JSON', async () => {
      const json = await db.export({
        format: 'json',
        includeMetadata: false,
      });

      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
      expect(parsed[0].brandName).toBe('TestBrand');
    });

    it('should export to JSON with metadata', async () => {
      const json = await db.export({
        format: 'json',
        includeMetadata: true,
      });

      const parsed = JSON.parse(json);
      expect(parsed.insights).toBeDefined();
      expect(parsed.stats).toBeDefined();
      expect(parsed.stats.totalInsights).toBe(1);
    });

    it('should export to CSV', async () => {
      const csv = await db.export({ format: 'csv' });

      expect(csv).toContain('ID,Brand,Phase,Topic');
      expect(csv).toContain('TestBrand');
      expect(csv).toContain('Market is $10B');
    });

    it('should export to Markdown', async () => {
      const md = await db.export({ format: 'markdown' });

      expect(md).toContain('# Research Insights Database');
      expect(md).toContain('## Phase 1');
      expect(md).toContain('### Market');
      expect(md).toContain('Market is $10B');
      expect(md).toContain('**Confidence:** HIGH');
    });

    it('should export with filters', async () => {
      await db.store({
        brandName: 'OtherBrand',
        phase: 2,
        topic: 'Branding',
        subtopic: 'Identity',
        insight: 'Other insight',
        confidence: 'MEDIUM',
        sources: [],
        metadata: {},
      });

      const json = await db.export({
        format: 'json',
        filters: { brandName: 'TestBrand' },
        includeMetadata: false,
      });

      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
      expect(parsed[0].brandName).toBe('TestBrand');
    });
  });

  describe('clear', () => {
    beforeEach(async () => {
      await db.store({
        brandName: 'Test',
        phase: 1,
        topic: 'Test',
        subtopic: 'Test',
        insight: 'Test',
        confidence: 'HIGH',
        sources: [],
        metadata: {},
      });
    });

    it('should clear all insights', async () => {
      await db.clear();
      const stats = db.getStats();
      expect(stats.totalInsights).toBe(0);
    });

    it('should clear indexes', async () => {
      await db.clear();
      const byTopic = db.getByTopic('Test');
      expect(byTopic.length).toBe(0);
    });
  });
});
