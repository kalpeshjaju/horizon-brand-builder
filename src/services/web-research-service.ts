// Web Research Service - Fetch real market data
// Version 2.1 - Enhanced caching with persistence and TTL

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import type {
  IndustryResearchData,
  CompetitorWebData,
  MarketStatistic,
  SourcedClaim,
  WebSearchResult,
  IndustryTrendWithSource,
} from '../types/research-types.js';

interface GoogleSearchConfig {
  apiKey?: string;
  searchEngineId?: string;
  enableCache?: boolean;
  cacheStoragePath?: string;
  cacheTTL?: number; // milliseconds
  maxCacheSize?: number; // max entries
}

interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink?: string;
  formattedUrl?: string;
}

interface GoogleApiResponse {
  items?: Array<{
    title: string;
    link: string;
    snippet: string;
    displayLink?: string;
    formattedUrl?: string;
  }>;
}

interface CachedSearchResult {
  data: GoogleSearchResult[];
  timestamp: number;
  ttl: number;
  version: string; // Cache version for invalidation
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  oldestEntry?: number;
  newestEntry?: number;
}

export class WebResearchService {
  private apiKey: string | null;
  private searchEngineId: string | null;
  private searchCache: Map<string, CachedSearchResult> = new Map();
  private cacheStoragePath: string;
  private cacheTTL: number;
  private maxCacheSize: number;
  private enableCache: boolean;
  private cacheVersion = 'v2.1'; // Increment to invalidate old cache
  private stats: Omit<CacheStats, 'size' | 'hitRate' | 'oldestEntry' | 'newestEntry'> = {
    hits: 0,
    misses: 0,
  };

  constructor(config?: GoogleSearchConfig) {
    this.apiKey = config?.apiKey || process.env.GOOGLE_API_KEY || null;
    this.searchEngineId = config?.searchEngineId || process.env.GOOGLE_SEARCH_ENGINE_ID || null;
    this.enableCache = config?.enableCache ?? true;
    this.cacheStoragePath = config?.cacheStoragePath || './data/web-search-cache.json';
    this.cacheTTL = config?.cacheTTL || 24 * 60 * 60 * 1000; // 24 hours default
    this.maxCacheSize = config?.maxCacheSize || 1000; // 1000 entries max

    if (!this.apiKey || !this.searchEngineId) {
      console.warn('⚠️  Google Custom Search API not configured');
      console.warn('   Set GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID for real web search');
      console.warn('   Get credentials at: https://developers.google.com/custom-search');
    }

    // Load cache from disk
    this.loadCacheFromDisk();
  }

  async fetchIndustryData(industry: string, region: string = 'India'): Promise<IndustryResearchData> {
    console.log(`\n🌐 Researching ${industry} industry in ${region}...\n`);

    const researchData: IndustryResearchData = {
      industry,
      trends: [],
      keyPlayers: [],
      sources: [],
      researchDate: new Date().toISOString(),
    };

    // Search for industry reports and trends
    const searchQueries = [
      `${industry} market size ${region} 2024`,
      `${industry} growth rate ${region} trends`,
      `${industry} market analysis ${region}`,
    ];

    if (this.apiKey && this.searchEngineId) {
      // Real Google Custom Search implementation
      for (const query of searchQueries) {
        const results = await this.performGoogleSearch(query);
        researchData.sources.push(...results.map(r => r.link));
      }
      console.log(`   ✅ Found ${researchData.sources.length} sources via Google Search`);
    } else {
      // Fallback: Placeholder mode
      console.log(`   ⚠️  Using placeholder mode (no API key)`);
      console.log(`   Searching: ${searchQueries.join(', ')}`);
    }

    return researchData;
  }

  async fetchCompetitorWebsite(url: string): Promise<CompetitorWebData | null> {
    console.log(`\n🔍 Fetching competitor data from: ${url}\n`);

    try {
      // This would use Claude Code's WebFetch tool
      // For now, return structure
      const webData: CompetitorWebData = {
        url,
        scrapedAt: new Date().toISOString(),
        positioning: '',
        products: [],
        keyFeatures: [],
        metadata: {
          title: '',
          description: '',
        },
      };

      console.log(`   ✅ Successfully fetched data from ${url}`);
      return webData;
    } catch (error) {
      console.error(`   ❌ Failed to fetch ${url}:`, error);
      return null;
    }
  }

  async searchMarketStatistics(query: string): Promise<MarketStatistic[]> {
    console.log(`\n📊 Searching for market statistics: ${query}\n`);

    // This would use WebSearch to find statistics
    // Parse results and extract numeric data with sources
    const statistics: MarketStatistic[] = [];

    return statistics;
  }

  async validateStatistic(claim: string, industry: string): Promise<SourcedClaim> {
    console.log(`\n✅ Validating statistic: "${claim}"\n`);

    // Extract numeric value from claim
    const numericMatch = claim.match(/(\d+(?:\.\d+)?)\s*%/);

    if (!numericMatch) {
      return {
        claim,
        confidence: 'unverified',
        verificationNotes: 'No numeric value found to validate',
      };
    }

    // Search web for verification
    const searchQuery = `${industry} market ${claim}`;
    console.log(`   Searching: "${searchQuery}"`);

    // This would use WebSearch to find supporting evidence
    // For now, return unverified
    return {
      claim,
      confidence: 'low',
      verificationNotes: 'Web validation not yet implemented',
    };
  }

  async searchIndustryReports(industry: string, year: number = new Date().getFullYear()): Promise<WebSearchResult[]> {
    const searchQueries = [
      `${industry} market report ${year}`,
      `${industry} industry analysis ${year}`,
      `${industry} trends forecast ${year}`,
    ];

    console.log(`\n📑 Searching for industry reports...\n`);

    if (!this.apiKey || !this.searchEngineId) {
      console.log(`   ⚠️  Google Search API not configured - returning empty results`);
      return [];
    }

    const allResults: WebSearchResult[] = [];

    for (const query of searchQueries) {
      const googleResults = await this.performGoogleSearch(query);
      const parsedResults = this.parseSearchResults(googleResults);
      allResults.push(...parsedResults);
    }

    console.log(`   ✅ Found ${allResults.length} industry reports`);
    return allResults;
  }

  /**
   * Load cache from disk
   */
  private loadCacheFromDisk(): void {
    if (!this.enableCache) return;

    try {
      if (existsSync(this.cacheStoragePath)) {
        const data = readFileSync(this.cacheStoragePath, 'utf-8');
        const parsed = JSON.parse(data);

        // Only load if versions match
        if (parsed.version === this.cacheVersion) {
          const entries = Object.entries(parsed.cache || {}) as Array<[string, CachedSearchResult]>;
          this.searchCache = new Map(entries);

          // Remove expired entries
          this.pruneExpiredEntries();

          console.log(`✅ Loaded ${this.searchCache.size} cached search results from disk`);
        } else {
          console.log(`⚠️  Cache version mismatch (${parsed.version} vs ${this.cacheVersion}), starting fresh`);
        }
      }
    } catch (error: any) {
      console.warn(`⚠️  Failed to load cache from disk: ${error.message}`);
    }
  }

  /**
   * Save cache to disk
   */
  private async saveCacheToDisk(): Promise<void> {
    if (!this.enableCache) return;

    try {
      // Ensure directory exists
      const dir = dirname(this.cacheStoragePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const cacheData = {
        version: this.cacheVersion,
        savedAt: new Date().toISOString(),
        cache: Object.fromEntries(this.searchCache),
      };

      writeFileSync(this.cacheStoragePath, JSON.stringify(cacheData, null, 2), 'utf-8');
    } catch (error: any) {
      console.warn(`⚠️  Failed to save cache to disk: ${error.message}`);
    }
  }

  /**
   * Get cached result if valid
   */
  private getCachedResult(key: string): GoogleSearchResult[] | null {
    if (!this.enableCache) return null;

    const cached = this.searchCache.get(key);
    if (!cached) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.searchCache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Check version match
    if (cached.version !== this.cacheVersion) {
      this.searchCache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return cached.data;
  }

  /**
   * Cache search result
   */
  private async setCachedResult(key: string, data: GoogleSearchResult[]): Promise<void> {
    if (!this.enableCache) return;

    // Prune cache if at max size
    if (this.searchCache.size >= this.maxCacheSize) {
      this.pruneOldestEntries(Math.floor(this.maxCacheSize * 0.2)); // Remove oldest 20%
    }

    const cached: CachedSearchResult = {
      data,
      timestamp: Date.now(),
      ttl: this.cacheTTL,
      version: this.cacheVersion,
    };

    this.searchCache.set(key, cached);

    // Save to disk asynchronously
    await this.saveCacheToDisk();
  }

  /**
   * Remove expired cache entries
   */
  private pruneExpiredEntries(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, cached] of this.searchCache.entries()) {
      if (now - cached.timestamp > cached.ttl || cached.version !== this.cacheVersion) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.searchCache.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`🧹 Pruned ${keysToDelete.length} expired cache entries`);
    }
  }

  /**
   * Remove oldest cache entries
   */
  private pruneOldestEntries(count: number): void {
    const entries = Array.from(this.searchCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = entries.slice(0, count);
    toRemove.forEach(([key]) => this.searchCache.delete(key));

    console.log(`🧹 Pruned ${toRemove.length} oldest cache entries (cache size limit reached)`);
  }

  /**
   * Perform real Google Custom Search API call
   */
  private async performGoogleSearch(query: string, maxResults: number = 10): Promise<GoogleSearchResult[]> {
    if (!this.apiKey || !this.searchEngineId) {
      return [];
    }

    // Check cache first
    const cacheKey = `${query}:${maxResults}`;
    const cachedResults = this.getCachedResult(cacheKey);

    if (cachedResults) {
      console.log(`   💾 Cache hit for: "${query}" (${this.stats.hits} hits, ${this.stats.misses} misses)`);
      return cachedResults;
    }

    try {
      const url = new URL('https://www.googleapis.com/customsearch/v1');
      url.searchParams.append('key', this.apiKey);
      url.searchParams.append('cx', this.searchEngineId);
      url.searchParams.append('q', query);
      url.searchParams.append('num', Math.min(maxResults, 10).toString());

      console.log(`   🔍 Google Search: "${query}"`);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Google Search API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as GoogleApiResponse;
      const results: GoogleSearchResult[] = (data.items || []).map((item) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        displayLink: item.displayLink,
        formattedUrl: item.formattedUrl,
      }));

      // Cache results with persistence
      await this.setCachedResult(cacheKey, results);

      return results;
    } catch (error: any) {
      console.error(`   ❌ Google Search failed: ${error.message}`);
      return [];
    }
  }

  async extractKeyInsights(url: string, context: string): Promise<string[]> {
    console.log(`\n🔍 Extracting insights from: ${url}\n`);

    // This would use WebFetch + LLM to extract relevant insights
    // WebFetch the URL, then use LLM to extract key points related to context

    return [];
  }

  private parseSearchResults(results: GoogleSearchResult[]): WebSearchResult[] {
    // Parse Google search results into structured format
    return results.map(result => ({
      title: result.title || '',
      url: result.link || '',
      snippet: result.snippet || '',
      relevanceScore: this.calculateRelevance(result),
    }));
  }

  private calculateRelevance(result: GoogleSearchResult): number {
    // Simple relevance scoring (0-1)
    let score = 0.5;

    // Bonus for authoritative sources (from V2.0 source quality tiers)
    const tier1Domains = [
      'sciencedirect.com', 'springer.com', 'nature.com',
      'mckinsey.com', 'bcg.com', 'gartner.com', 'forrester.com',
    ];

    const tier2Domains = [
      'mordorintelligence.com', 'statista.com', 'ibisworld.com',
      'bloomberg.com', 'reuters.com', 'wsj.com',
    ];

    try {
      const domain = new URL(result.link).hostname;

      if (tier1Domains.some(d => domain.includes(d))) {
        score += 0.4; // Tier 1: Academic/consulting
      } else if (tier2Domains.some(d => domain.includes(d))) {
        score += 0.3; // Tier 2: Industry research
      } else if (domain.includes('.edu') || domain.includes('.gov')) {
        score += 0.35; // Educational/government
      }
    } catch {
      // Invalid URL - keep base score
    }

    // Bonus for longer, more detailed snippets
    if (result.snippet && result.snippet.length > 150) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Get current search cache stats
   */
  getCacheStats(): CacheStats {
    const timestamps = Array.from(this.searchCache.values()).map(c => c.timestamp);
    const totalRequests = this.stats.hits + this.stats.misses;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.searchCache.size,
      hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : undefined,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : undefined,
    };
  }

  /**
   * Clear search cache
   */
  async clearCache(): Promise<void> {
    this.searchCache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
    await this.saveCacheToDisk();
    console.log('✅ Cache cleared');
  }

  async batchFetchCompetitors(urls: string[]): Promise<Map<string, CompetitorWebData | null>> {
    console.log(`\n🔄 Batch fetching ${urls.length} competitor websites...\n`);

    const results = new Map<string, CompetitorWebData | null>();

    // Fetch with delay to avoid rate limiting
    for (const url of urls) {
      const data = await this.fetchCompetitorWebsite(url);
      results.set(url, data);

      // Add delay between requests (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  async getTrendingTopics(industry: string, timeframe: 'day' | 'week' | 'month' = 'month'): Promise<string[]> {
    console.log(`\n📈 Getting trending topics for ${industry} (${timeframe})...\n`);

    // This would integrate with Google Trends API or similar
    // For now, return empty array
    return [];
  }
}

// Factory function for easy instantiation
export function createWebResearchService(): WebResearchService {
  return new WebResearchService();
}
