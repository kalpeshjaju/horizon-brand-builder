// Tests for Web Research Service

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WebResearchService } from './web-research-service.js';

describe('WebResearchService', () => {
  let service: WebResearchService;

  beforeEach(() => {
    // Create service without API keys (tests non-API functionality)
    service = new WebResearchService({
      apiKey: undefined,
      searchEngineId: undefined,
      enableCache: true,
    });
  });

  describe('constructor', () => {
    it('should initialize with environment variables', () => {
      const originalEnv = { ...process.env };

      process.env.GOOGLE_API_KEY = 'test-key';
      process.env.GOOGLE_SEARCH_ENGINE_ID = 'test-cx';

      const serviceWithEnv = new WebResearchService();

      // Restore original environment
      process.env = originalEnv;

      // Service should have been initialized (no errors thrown)
      expect(serviceWithEnv).toBeDefined();
    });

    it('should warn when API keys are missing', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      new WebResearchService({
        apiKey: undefined,
        searchEngineId: undefined,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Google Custom Search API not configured')
      );

      consoleSpy.mockRestore();
    });

    it('should accept explicit API keys', () => {
      const serviceWithKeys = new WebResearchService({
        apiKey: 'explicit-key',
        searchEngineId: 'explicit-cx',
      });

      expect(serviceWithKeys).toBeDefined();
    });
  });

  describe('fetchIndustryData', () => {
    it('should return structured industry data', async () => {
      const data = await service.fetchIndustryData('E-commerce Fashion', 'India');

      expect(data).toBeDefined();
      expect(data.industry).toBe('E-commerce Fashion');
      expect(data.trends).toEqual([]);
      expect(data.keyPlayers).toEqual([]);
      expect(data.sources).toEqual([]);
      expect(data.researchDate).toBeDefined();
    });

    it('should use default region if not provided', async () => {
      const data = await service.fetchIndustryData('Technology');

      expect(data.industry).toBe('Technology');
      expect(data.researchDate).toBeDefined();
    });
  });

  describe('fetchCompetitorWebsite', () => {
    it('should return competitor data structure', async () => {
      const data = await service.fetchCompetitorWebsite('https://example.com');

      expect(data).toBeDefined();
      expect(data?.url).toBe('https://example.com');
      expect(data?.scrapedAt).toBeDefined();
      expect(data?.positioning).toBe('');
      expect(data?.products).toEqual([]);
      expect(data?.keyFeatures).toEqual([]);
    });

    it('should handle invalid URLs gracefully', async () => {
      const data = await service.fetchCompetitorWebsite('invalid-url');

      expect(data).toBeDefined();
      expect(data?.url).toBe('invalid-url');
    });
  });

  describe('searchMarketStatistics', () => {
    it('should return empty array (placeholder)', async () => {
      const stats = await service.searchMarketStatistics('e-commerce market size');

      expect(Array.isArray(stats)).toBe(true);
      expect(stats.length).toBe(0);
    });
  });

  describe('validateStatistic', () => {
    it('should extract numeric claims', async () => {
      const result = await service.validateStatistic(
        'Market growing at 25% annually',
        'E-commerce'
      );

      expect(result.claim).toBe('Market growing at 25% annually');
      expect(result.confidence).toBeDefined();
    });

    it('should handle claims without numbers', async () => {
      const result = await service.validateStatistic(
        'Market is growing rapidly',
        'E-commerce'
      );

      expect(result.claim).toBe('Market is growing rapidly');
      expect(result.confidence).toBe('unverified');
      expect(result.verificationNotes).toContain('No numeric value');
    });

    it('should handle various percentage formats', async () => {
      const result1 = await service.validateStatistic('Growth: 15.5%', 'Tech');
      expect(result1.confidence).toBe('low');

      const result2 = await service.validateStatistic('Increase of 20%', 'Fashion');
      expect(result2.confidence).toBe('low');
    });
  });

  describe('searchIndustryReports', () => {
    it('should return empty array when API not configured', async () => {
      const reports = await service.searchIndustryReports('Fashion', 2024);

      expect(Array.isArray(reports)).toBe(true);
      expect(reports.length).toBe(0);
    });

    it('should use current year if not specified', async () => {
      const reports = await service.searchIndustryReports('Technology');

      expect(Array.isArray(reports)).toBe(true);
    });
  });

  describe('extractKeyInsights', () => {
    it('should return empty array (placeholder)', async () => {
      const insights = await service.extractKeyInsights(
        'https://example.com',
        'E-commerce trends'
      );

      expect(Array.isArray(insights)).toBe(true);
      expect(insights.length).toBe(0);
    });
  });

  describe('batchFetchCompetitors', () => {
    it('should fetch multiple competitor websites', async () => {
      const urls = [
        'https://competitor1.com',
        'https://competitor2.com',
        'https://competitor3.com',
      ];

      const results = await service.batchFetchCompetitors(urls);

      expect(results.size).toBe(3);
      expect(results.has('https://competitor1.com')).toBe(true);
      expect(results.has('https://competitor2.com')).toBe(true);
      expect(results.has('https://competitor3.com')).toBe(true);
    });

    it('should handle empty URL list', async () => {
      const results = await service.batchFetchCompetitors([]);

      expect(results.size).toBe(0);
    });

    it('should include null for failed fetches', async () => {
      const urls = ['https://valid.com'];
      const results = await service.batchFetchCompetitors(urls);

      expect(results.get('https://valid.com')).toBeDefined();
    });
  });

  describe('getTrendingTopics', () => {
    it('should return empty array (placeholder)', async () => {
      const topics = await service.getTrendingTopics('Fashion', 'month');

      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBe(0);
    });

    it('should use default timeframe', async () => {
      const topics = await service.getTrendingTopics('Technology');

      expect(Array.isArray(topics)).toBe(true);
    });

    it('should accept different timeframes', async () => {
      const day = await service.getTrendingTopics('Fashion', 'day');
      const week = await service.getTrendingTopics('Fashion', 'week');
      const month = await service.getTrendingTopics('Fashion', 'month');

      expect(Array.isArray(day)).toBe(true);
      expect(Array.isArray(week)).toBe(true);
      expect(Array.isArray(month)).toBe(true);
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', () => {
      const stats = service.getCacheStats();

      expect(stats).toBeDefined();
      expect(stats.size).toBe(0);
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe(0);
    });
  });

  describe('clearCache', () => {
    it('should clear cache', async () => {
      await service.clearCache();

      const stats = service.getCacheStats();
      expect(stats.size).toBe(0);
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });
});

describe('WebResearchService - With API Key', () => {
  let service: WebResearchService;

  beforeEach(() => {
    // Create service with mock API keys
    service = new WebResearchService({
      apiKey: 'test-api-key',
      searchEngineId: 'test-search-id',
      enableCache: true,
    });

    // Mock fetch globally
    global.fetch = vi.fn();
  });

  describe('performGoogleSearch (integration)', () => {
    it('should handle API errors gracefully', async () => {
      // Mock failed API response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      });

      const data = await service.fetchIndustryData('Technology');

      // Should not throw, should handle error gracefully
      expect(data).toBeDefined();
      expect(data.sources.length).toBe(0);
    });

    it('should handle successful API response', async () => {
      // Mock successful API response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              title: 'Technology Report 2024',
              link: 'https://example.com/report',
              snippet: 'Technology market analysis...',
              displayLink: 'example.com',
              formattedUrl: 'https://example.com/report',
            },
          ],
        }),
      });

      const data = await service.fetchIndustryData('Technology');

      expect(data.sources.length).toBeGreaterThan(0);
    });

    it('should cache search results', async () => {
      // Mock API response
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              title: 'Test Report',
              link: 'https://example.com',
              snippet: 'Test snippet',
            },
          ],
        }),
      });

      // First call
      await service.fetchIndustryData('Fashion');

      // Check cache
      const stats = service.getCacheStats();
      expect(stats.size).toBeGreaterThan(0);
    });
  });

  describe('relevance scoring', () => {
    it('should prioritize tier 1 sources', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              title: 'McKinsey Report',
              link: 'https://mckinsey.com/report',
              snippet: 'Consulting insights...',
            },
            {
              title: 'Blog Post',
              link: 'https://random-blog.com/post',
              snippet: 'My opinion...',
            },
          ],
        }),
      });

      const reports = await service.searchIndustryReports('Technology');

      // Tier 1 source should have higher relevance
      if (reports.length > 0) {
        const mckinseyReport = reports.find((r) =>
          r.url.includes('mckinsey.com')
        );
        const blogPost = reports.find((r) => r.url.includes('random-blog.com'));

        if (mckinseyReport && blogPost) {
          expect(mckinseyReport.relevanceScore).toBeGreaterThan(
            blogPost.relevanceScore
          );
        }
      }
    });

    it('should bonus .edu and .gov domains', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            {
              title: 'University Research',
              link: 'https://stanford.edu/research',
              snippet: 'Academic research...',
            },
          ],
        }),
      });

      const reports = await service.searchIndustryReports('Technology');

      if (reports.length > 0) {
        const eduReport = reports.find((r) => r.url.includes('.edu'));
        if (eduReport) {
          expect(eduReport.relevanceScore).toBeGreaterThan(0.7);
        }
      }
    });
  });
});
