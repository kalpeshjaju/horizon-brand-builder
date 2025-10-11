// Research Database - Main Export
// Unified interface for research database operations

import { DatabaseCore } from './database-core.js';
import { DatabaseSearch, type SearchOptions } from './database-search.js';
import { DatabaseIndexer, type IndexStats } from './database-indexer.js';
import type { ResearchFinding } from '../../types/research-types.js';
import type { BrandConfiguration } from '../../types/project-types.js';

export class ResearchDatabase {
  private core: DatabaseCore;
  private search: DatabaseSearch;
  private indexer: DatabaseIndexer;
  private brandConfig: BrandConfiguration;

  constructor(brandConfig: BrandConfiguration) {
    this.brandConfig = brandConfig;
    this.core = new DatabaseCore(brandConfig);
    this.search = new DatabaseSearch();
    this.indexer = new DatabaseIndexer();
  }

  async initialize(): Promise<void> {
    await this.core.initialize();
  }

  async addFinding(finding: ResearchFinding): Promise<void> {
    await this.core.addFinding(finding);
  }

  async addFindings(findings: ResearchFinding[]): Promise<void> {
    await this.core.addFindings(findings);
  }

  async getAllFindings(): Promise<ResearchFinding[]> {
    return await this.core.getAllFindings();
  }

  async searchFindings(options: SearchOptions): Promise<ResearchFinding[]> {
    const findings = await this.core.getAllFindings();
    return this.search.search(findings, options);
  }

  async searchByKeyword(keyword: string): Promise<ResearchFinding[]> {
    const findings = await this.core.getAllFindings();
    return this.search.searchByKeyword(findings, keyword);
  }

  async searchByTopic(topic: string): Promise<ResearchFinding[]> {
    return await this.core.getFindingsByTopic(topic);
  }

  async getHighConfidenceFindings(): Promise<ResearchFinding[]> {
    const findings = await this.core.getAllFindings();
    return this.search.getHighConfidenceFindings(findings);
  }

  async getLowConfidenceFindings(): Promise<ResearchFinding[]> {
    const findings = await this.core.getAllFindings();
    return this.search.getLowConfidenceFindings(findings);
  }

  async getStats(): Promise<{
    metadata: any;
    indexStats: IndexStats;
  }> {
    const metadata = await this.core.getMetadata();
    const findings = await this.core.getAllFindings();
    const index = this.indexer.createIndex(findings);
    const indexStats = this.indexer.getIndexStats(index);

    return {
      metadata,
      indexStats,
    };
  }

  async clear(): Promise<void> {
    await this.core.clear();
  }

  getDataFile(): string {
    return this.core.getDataFile();
  }

  // CLI interface
  async handleCLI(command: string, ...args: string[]): Promise<void> {
    await this.initialize();

    try {
      switch (command) {
        case 'init':
          console.log(`✅ Research database initialized: ${this.getDataFile()}`);
          break;

        case 'stats':
          const stats = await this.getStats();
          console.log(`\n📊 ${this.brandConfig.brandName} Research Database Stats\n`);
          console.log(`Total Findings: ${stats.metadata.totalFindings}`);
          console.log(`Topics: ${stats.metadata.topics.length}`);
          console.log(`Sources: ${stats.metadata.sources}`);
          console.log(`\nConfidence Levels:`);
          console.log(`  High (≥8): ${stats.indexStats.confidenceLevels.high}`);
          console.log(`  Medium (5-7): ${stats.indexStats.confidenceLevels.medium}`);
          console.log(`  Low (<5): ${stats.indexStats.confidenceLevels.low}`);
          if (stats.indexStats.topKeywords.length > 0) {
            console.log(`\nTop Keywords:`);
            stats.indexStats.topKeywords.slice(0, 10).forEach((kw, i) => {
              console.log(`  ${i + 1}. ${kw.keyword} (${kw.count})`);
            });
          }
          console.log();
          break;

        case 'search':
          const query = args[0];
          if (!query) {
            console.error('Usage: db:search <query>');
            process.exit(1);
          }
          const results = await this.searchByKeyword(query);
          console.log(`\n🔍 Search results for "${query}": ${results.length} findings\n`);
          results.slice(0, 10).forEach((r, i) => {
            console.log(`${i + 1}. [${r.topic}] ${r.content.substring(0, 100)}...`);
            console.log(`   Confidence: ${r.confidence || 'N/A'}/10`);
            console.log();
          });
          break;

        case 'topics':
          const allStats = await this.getStats();
          console.log(`\n📋 Topics (${allStats.metadata.topics.length}):\n`);
          allStats.metadata.topics.forEach((topic: string, i: number) => {
            console.log(`${i + 1}. ${topic}`);
          });
          console.log();
          break;

        case 'export':
          const findings = await this.getAllFindings();
          const exportFile = this.getDataFile().replace('.json', '-export.json');
          const fs = await import('fs/promises');
          await fs.writeFile(exportFile, JSON.stringify({ findings }, null, 2));
          console.log(`✅ Exported ${findings.length} findings to: ${exportFile}\n`);
          break;

        default:
          console.log(`
Horizon Brand Builder Pro - Research Database

Commands:
  init              Initialize research database
  stats             Show database statistics
  search <query>    Search findings by keyword
  topics            List all topics
  export            Export all findings to JSON

Examples:
  npm run db:stats
  npm run db:search "competitor analysis"
  npm run db:topics
          `);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error:', errorMessage);
      process.exit(1);
    }
  }
}

// CLI execution
if (import.meta.url.startsWith('file://')) {
  const modulePath = decodeURIComponent(new URL(import.meta.url).pathname);
  const scriptPath = process.argv[1];

  if (modulePath === scriptPath) {
    const command = process.argv[2] || 'stats';
    const args = process.argv.slice(3);

    // For CLI, use a default/example brand config
    const exampleConfig = {
      brandName: 'Example Brand',
      industry: 'Generic',
      category: 'General',
      projectObjectives: {
        primary: 'Build a strong brand',
        goals: ['Goal 1', 'Goal 2'],
      },
    };

    const db = new ResearchDatabase(exampleConfig as any);
    db.handleCLI(command, ...args).catch((err) => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
  }
}

export default ResearchDatabase;
export { DatabaseCore, DatabaseSearch, DatabaseIndexer };
export type { SearchOptions, IndexStats };
