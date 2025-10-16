// Version Manager - Track document versions and changes

import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { DocumentVersion, WorkflowConfig } from '../types/adaptive-workflow-types.js';

export class VersionManager {

  private config: WorkflowConfig;
  private versionsFile: string;
  private versions: DocumentVersion[] = [];

  constructor(config: WorkflowConfig) {
    this.config = config;
    this.versionsFile = join(config.outputDirectory, '.workflow', 'versions.json');
  }

  /**
   * Initialize version manager
   */
  async initialize(): Promise<void> {
    try {
      const content = await readFile(this.versionsFile, 'utf-8');
      this.versions = JSON.parse(content);
    } catch {
      // No existing versions
      this.versions = [];
    }
  }

  /**
   * Create a new document version
   */
  async createVersion(version: DocumentVersion): Promise<DocumentVersion> {
    // Add to history
    this.versions.push(version);

    // Keep only last N versions if configured
    if (this.config.maxVersionsToKeep > 0 &&
        this.versions.length > this.config.maxVersionsToKeep) {
      this.versions = this.versions.slice(-this.config.maxVersionsToKeep);
    }

    // Save versions
    await this.saveVersions();

    return version;
  }

  /**
   * Get current version
   */
  getCurrentVersion(): string {
    if (this.versions.length === 0) return 'v0.0';
    return this.versions[this.versions.length - 1].version;
  }

  /**
   * Get version by ID
   */
  getVersion(version: string): DocumentVersion | undefined {
    return this.versions.find(v => v.version === version);
  }

  /**
   * Get all versions
   */
  getAllVersions(): DocumentVersion[] {
    return [...this.versions];
  }

  /**
   * Get version history (most recent first)
   */
  getHistory(): DocumentVersion[] {
    return [...this.versions].reverse();
  }

  /**
   * Compare two versions
   */
  compareVersions(v1: string, v2: string): {
    older: DocumentVersion | undefined;
    newer: DocumentVersion | undefined;
    qualityChange: number;
    sectionsChanged: number;
  } {
    const version1 = this.getVersion(v1);
    const version2 = this.getVersion(v2);

    if (!version1 || !version2) {
      return {
        older: version1,
        newer: version2,
        qualityChange: 0,
        sectionsChanged: 0
      };
    }

    // Determine which is older
    const v1Index = this.versions.indexOf(version1);
    const v2Index = this.versions.indexOf(version2);

    const older = v1Index < v2Index ? version1 : version2;
    const newer = v1Index < v2Index ? version2 : version1;

    return {
      older,
      newer,
      qualityChange: newer.quality - older.quality,
      sectionsChanged: newer.updatedSections.length
    };
  }

  /**
   * Save versions to disk
   */
  private async saveVersions(): Promise<void> {
    await mkdir(join(this.config.outputDirectory, '.workflow'), { recursive: true });
    await writeFile(this.versionsFile, JSON.stringify(this.versions, null, 2));
  }
}
