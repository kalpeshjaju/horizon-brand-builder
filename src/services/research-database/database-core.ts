// Research Database Core - Generic storage for ANY brand
// Handles basic CRUD operations for research findings

import fs from 'fs/promises';
import path from 'path';
import type { ResearchFinding, ResearchSource } from '../../types/research-types.js';
import type { BrandConfiguration } from '../../types/project-types.js';

export interface ResearchDatabase {
  findings: ResearchFinding[];
  metadata: {
    totalFindings: number;
    lastUpdated: string;
    sources: number;
    topics: string[];
    brandName: string;
  };
}

export class DatabaseCore {
  private dataFile: string;
  private data: ResearchDatabase | null;
  private brandConfig: BrandConfiguration;

  constructor(brandConfig: BrandConfiguration) {
    this.brandConfig = brandConfig;
    this.data = null;

    // Store per-brand: data/{brandName}/research-db.json
    const brandSlug = brandConfig.brandName.toLowerCase().replace(/\s+/g, '-');
    this.dataFile = path.join(process.cwd(), 'data', brandSlug, 'research-db.json');
  }

  async initialize(): Promise<void> {
    try {
      const brandSlug = this.brandConfig.brandName.toLowerCase().replace(/\s+/g, '-');
      const dataDir = path.join(process.cwd(), 'data', brandSlug);
      await fs.mkdir(dataDir, { recursive: true });

      try {
        const content = await fs.readFile(this.dataFile, 'utf-8');
        this.data = JSON.parse(content);
      } catch {
        this.data = {
          findings: [],
          metadata: {
            totalFindings: 0,
            lastUpdated: new Date().toISOString(),
            sources: 0,
            topics: [],
            brandName: this.brandConfig.brandName,
          },
        };
        await this.save();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        `Failed to initialize research database at ${this.dataFile}\n` +
          `Reason: ${errorMessage}\n` +
          `Fix: Ensure you have write permissions for the directory.`
      );
    }
  }

  async save(): Promise<void> {
    if (!this.data) {
      throw new Error('No database data to save. Call initialize() first.');
    }

    this.data.metadata.lastUpdated = new Date().toISOString();
    await fs.writeFile(this.dataFile, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  async addFinding(finding: ResearchFinding): Promise<void> {
    if (!this.data) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    this.data.findings.push(finding);
    this.data.metadata.totalFindings++;

    // Update topics list
    if (!this.data.metadata.topics.includes(finding.topic)) {
      this.data.metadata.topics.push(finding.topic);
    }

    // Update sources count (unique URLs)
    const uniqueUrls = new Set(
      this.data.findings.flatMap((f) => f.sources.map((s: ResearchSource) => s.url))
    );
    this.data.metadata.sources = uniqueUrls.size;

    await this.save();
  }

  async addFindings(findings: ResearchFinding[]): Promise<void> {
    for (const finding of findings) {
      await this.addFinding(finding);
    }
  }

  async getAllFindings(): Promise<ResearchFinding[]> {
    if (!this.data) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.data.findings;
  }

  async getFindingsByTopic(topic: string): Promise<ResearchFinding[]> {
    const findings = await this.getAllFindings();
    return findings.filter((f) => f.topic.toLowerCase() === topic.toLowerCase());
  }

  async getMetadata(): Promise<ResearchDatabase['metadata']> {
    if (!this.data) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.data.metadata;
  }

  async clear(): Promise<void> {
    if (!this.data) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    this.data.findings = [];
    this.data.metadata.totalFindings = 0;
    this.data.metadata.sources = 0;
    this.data.metadata.topics = [];

    await this.save();
  }

  getDataFile(): string {
    return this.dataFile;
  }
}
