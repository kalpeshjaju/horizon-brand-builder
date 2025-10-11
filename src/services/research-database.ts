// Research Database Service - Centralized insights repository

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type {
  ResearchInsight,
  SearchQuery,
  SearchResult,
  DatabaseStats,
  ExportOptions,
  DatabaseConfig,
} from '../types/database-types.js';

export class ResearchDatabase {
  private insights: ResearchInsight[] = [];
  private indexByTopic: Map<string, Set<string>> = new Map();
  private indexByCompetitor: Map<string, Set<string>> = new Map();
  private indexByBrand: Map<string, Set<string>> = new Map();
  private config: DatabaseConfig;

  constructor(config?: Partial<DatabaseConfig>) {
    this.config = {
      storagePath: config?.storagePath || join(process.cwd(), 'data', 'research-db.json'),
      autoSave: config?.autoSave ?? true,
      enableIndexing: config?.enableIndexing ?? true,
    };
  }

  /**
   * Initialize database - load from disk if exists
   */
  async initialize(): Promise<void> {
    try {
      const dataDir = join(process.cwd(), 'data');
      await mkdir(dataDir, { recursive: true });

      try {
        const content = await readFile(this.config.storagePath, 'utf-8');
        const data = JSON.parse(content);
        this.insights = data.insights || [];

        if (this.config.enableIndexing) {
          this.rebuildIndexes();
        }

        console.log(`✅ Research database loaded: ${this.insights.length} insights`);
      } catch {
        // File doesn't exist yet - initialize empty
        this.insights = [];
        console.log('✅ Research database initialized (empty)');
      }
    } catch (error: any) {
      throw new Error(
        `Failed to initialize research database at ${this.config.storagePath}\n` +
        `Reason: ${error.message}\n` +
        `Fix: Ensure write permissions and sufficient disk space.`
      );
    }
  }

  /**
   * Store a new research insight
   */
  async store(insight: Omit<ResearchInsight, 'id' | 'timestamp'>): Promise<ResearchInsight> {
    const fullInsight: ResearchInsight = {
      ...insight,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };

    this.insights.push(fullInsight);

    if (this.config.enableIndexing) {
      this.updateIndexes(fullInsight);
    }

    if (this.config.autoSave) {
      await this.save();
    }

    return fullInsight;
  }

  /**
   * Search insights by query
   */
  search(query: SearchQuery): SearchResult {
    let results = [...this.insights];

    // Apply filters
    if (query.filters) {
      const { brandName, phase, topic, confidence, competitorName } = query.filters;

      if (brandName) {
        results = results.filter((i) => i.brandName.toLowerCase() === brandName.toLowerCase());
      }

      if (phase) {
        results = results.filter((i) => i.phase === phase);
      }

      if (topic) {
        results = results.filter((i) =>
          i.topic.toLowerCase().includes(topic.toLowerCase()) ||
          i.subtopic.toLowerCase().includes(topic.toLowerCase())
        );
      }

      if (confidence) {
        results = results.filter((i) => i.confidence === confidence);
      }

      if (competitorName) {
        results = results.filter((i) =>
          i.metadata.competitorName?.toLowerCase().includes(competitorName.toLowerCase())
        );
      }
    }

    // Text search in insights
    if (query.term) {
      const term = query.term.toLowerCase();
      results = results.filter((i) =>
        i.insight.toLowerCase().includes(term) ||
        i.topic.toLowerCase().includes(term) ||
        i.subtopic.toLowerCase().includes(term)
      );
    }

    return {
      insights: results,
      total: this.insights.length,
      filtered: results.length,
    };
  }

  /**
   * Get insights by topic
   */
  getByTopic(topic: string): ResearchInsight[] {
    if (this.config.enableIndexing && this.indexByTopic.has(topic)) {
      const ids = this.indexByTopic.get(topic)!;
      return this.insights.filter((i) => ids.has(i.id));
    }

    return this.insights.filter((i) =>
      i.topic.toLowerCase().includes(topic.toLowerCase())
    );
  }

  /**
   * Get insights by competitor
   */
  getByCompetitor(competitor: string): ResearchInsight[] {
    if (this.config.enableIndexing && this.indexByCompetitor.has(competitor)) {
      const ids = this.indexByCompetitor.get(competitor)!;
      return this.insights.filter((i) => ids.has(i.id));
    }

    return this.insights.filter((i) =>
      i.metadata.competitorName?.toLowerCase().includes(competitor.toLowerCase())
    );
  }

  /**
   * Get insights by brand
   */
  getByBrand(brandName: string): ResearchInsight[] {
    if (this.config.enableIndexing && this.indexByBrand.has(brandName)) {
      const ids = this.indexByBrand.get(brandName)!;
      return this.insights.filter((i) => ids.has(i.id));
    }

    return this.insights.filter((i) =>
      i.brandName.toLowerCase() === brandName.toLowerCase()
    );
  }

  /**
   * Get database statistics
   */
  getStats(): DatabaseStats {
    const stats: DatabaseStats = {
      totalInsights: this.insights.length,
      byPhase: {},
      byTopic: {},
      byConfidence: {},
      byBrand: {},
    };

    for (const insight of this.insights) {
      // By phase
      const phaseKey = `phase${insight.phase}`;
      stats.byPhase[phaseKey] = (stats.byPhase[phaseKey] || 0) + 1;

      // By topic
      stats.byTopic[insight.topic] = (stats.byTopic[insight.topic] || 0) + 1;

      // By confidence
      stats.byConfidence[insight.confidence] = (stats.byConfidence[insight.confidence] || 0) + 1;

      // By brand
      stats.byBrand[insight.brandName] = (stats.byBrand[insight.brandName] || 0) + 1;
    }

    return stats;
  }

  /**
   * Export insights in various formats
   */
  async export(options: ExportOptions): Promise<string> {
    const searchResult = this.search({
      term: '',
      filters: options.filters,
    });

    const { format, includeMetadata = true } = options;

    switch (format) {
      case 'json':
        return JSON.stringify(
          includeMetadata
            ? { insights: searchResult.insights, stats: this.getStats() }
            : searchResult.insights,
          null,
          2
        );

      case 'csv':
        return this.exportToCsv(searchResult.insights);

      case 'markdown':
        return this.exportToMarkdown(searchResult.insights);

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Save database to disk
   */
  async save(): Promise<void> {
    const data = {
      insights: this.insights,
      metadata: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        totalInsights: this.insights.length,
      },
    };

    await writeFile(this.config.storagePath, JSON.stringify(data, null, 2));
  }

  /**
   * Clear all insights (use with caution!)
   */
  async clear(): Promise<void> {
    this.insights = [];
    this.indexByTopic.clear();
    this.indexByCompetitor.clear();
    this.indexByBrand.clear();

    if (this.config.autoSave) {
      await this.save();
    }
  }

  // Private helper methods

  private generateId(): string {
    return `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private rebuildIndexes(): void {
    this.indexByTopic.clear();
    this.indexByCompetitor.clear();
    this.indexByBrand.clear();

    for (const insight of this.insights) {
      this.updateIndexes(insight);
    }
  }

  private updateIndexes(insight: ResearchInsight): void {
    // Index by topic
    if (!this.indexByTopic.has(insight.topic)) {
      this.indexByTopic.set(insight.topic, new Set());
    }
    this.indexByTopic.get(insight.topic)!.add(insight.id);

    // Index by competitor
    if (insight.metadata.competitorName) {
      if (!this.indexByCompetitor.has(insight.metadata.competitorName)) {
        this.indexByCompetitor.set(insight.metadata.competitorName, new Set());
      }
      this.indexByCompetitor.get(insight.metadata.competitorName)!.add(insight.id);
    }

    // Index by brand
    if (!this.indexByBrand.has(insight.brandName)) {
      this.indexByBrand.set(insight.brandName, new Set());
    }
    this.indexByBrand.get(insight.brandName)!.add(insight.id);
  }

  private exportToCsv(insights: ResearchInsight[]): string {
    const headers = [
      'ID',
      'Brand',
      'Phase',
      'Topic',
      'Subtopic',
      'Insight',
      'Confidence',
      'Sources',
      'Competitor',
      'Timestamp',
    ];

    const rows = insights.map((i) => [
      i.id,
      i.brandName,
      i.phase,
      i.topic,
      i.subtopic,
      i.insight,
      i.confidence,
      i.sources.map((s) => s.url).join('; '),
      i.metadata.competitorName || '',
      i.timestamp,
    ]);

    return [
      headers.join(','),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(',')),
    ].join('\n');
  }

  private exportToMarkdown(insights: ResearchInsight[]): string {
    let md = '# Research Insights Database\n\n';
    md += `**Total Insights:** ${insights.length}\n`;
    md += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    md += `---\n\n`;

    // Group by phase
    const byPhase: Record<number, ResearchInsight[]> = {};
    for (const insight of insights) {
      if (!byPhase[insight.phase]) {
        byPhase[insight.phase] = [];
      }
      byPhase[insight.phase].push(insight);
    }

    for (const [phase, phaseInsights] of Object.entries(byPhase)) {
      md += `## Phase ${phase}\n\n`;

      // Group by topic
      const byTopic: Record<string, ResearchInsight[]> = {};
      for (const insight of phaseInsights) {
        if (!byTopic[insight.topic]) {
          byTopic[insight.topic] = [];
        }
        byTopic[insight.topic].push(insight);
      }

      for (const [topic, topicInsights] of Object.entries(byTopic)) {
        md += `### ${topic}\n\n`;

        for (const insight of topicInsights) {
          md += `#### ${insight.subtopic}\n\n`;
          md += `**Insight:** ${insight.insight}\n\n`;
          md += `**Confidence:** ${insight.confidence}\n\n`;

          if (insight.sources.length > 0) {
            md += `**Sources:**\n`;
            for (const source of insight.sources) {
              md += `- [${source.title}](${source.url})`;
              if (source.qualityScore) {
                md += ` (Quality: ${source.qualityScore}/100, Tier: ${source.tier})`;
              }
              md += `\n`;
            }
            md += `\n`;
          }

          if (insight.metadata.competitorName) {
            md += `**Competitor:** ${insight.metadata.competitorName}\n\n`;
          }

          md += `---\n\n`;
        }
      }
    }

    return md;
  }
}

export default ResearchDatabase;
