// Multi-Brand Integration Tests
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProjectTracker } from '../../src/services/project-tracker.js';
import { ResearchDatabase } from '../../src/services/research-database/index.js';
import type { BrandConfiguration } from '../../src/types/project-types.js';
import type { ResearchFinding } from '../../src/types/research-types.js';
import fs from 'fs/promises';
import path from 'path';

const brand1Config: BrandConfiguration = {
  brandName: 'Brand One',
  industry: 'Technology',
  category: 'SaaS',
  projectObjectives: {
    primary: 'Establish market presence',
    goals: ['Build awareness', 'Drive adoption'],
  },
};

const brand2Config: BrandConfiguration = {
  brandName: 'Brand Two',
  industry: 'E-commerce',
  category: 'Fashion',
  projectObjectives: {
    primary: 'Launch new brand',
    goals: ['Create brand identity', 'Build customer base'],
  },
};

describe('Multi-Brand Support', () => {
  afterEach(async () => {
    // Clean up test data for both brands
    const brands = ['brand-one', 'brand-two'];
    for (const brand of brands) {
      try {
        await fs.rm(path.join(process.cwd(), 'data', brand), {
          recursive: true,
          force: true,
        });
        await fs.rm(path.join(process.cwd(), 'output', brand), {
          recursive: true,
          force: true,
        });
      } catch {
        // Ignore if doesn't exist
      }
    }
  });

  describe('Isolated Storage', () => {
    it('should store each brand in separate directories', async () => {
      const tracker1 = new ProjectTracker(brand1Config);
      const tracker2 = new ProjectTracker(brand2Config);

      await tracker1.initialize();
      await tracker2.initialize();

      const file1 = path.join(
        process.cwd(),
        'data',
        'brand-one',
        'project-status.json'
      );
      const file2 = path.join(
        process.cwd(),
        'data',
        'brand-two',
        'project-status.json'
      );

      const exists1 = await fs
        .access(file1)
        .then(() => true)
        .catch(() => false);
      const exists2 = await fs
        .access(file2)
        .then(() => true)
        .catch(() => false);

      expect(exists1).toBe(true);
      expect(exists2).toBe(true);
    });

    it('should maintain separate research databases', async () => {
      const db1 = new ResearchDatabase(brand1Config);
      const db2 = new ResearchDatabase(brand2Config);

      await db1.initialize();
      await db2.initialize();

      const finding1: ResearchFinding = {
        topic: 'Brand One Research',
        content: 'Research for brand one',
        sources: [{ title: 'Source 1', url: 'https://example.com/1' }],
      };

      const finding2: ResearchFinding = {
        topic: 'Brand Two Research',
        content: 'Research for brand two',
        sources: [{ title: 'Source 2', url: 'https://example.com/2' }],
      };

      await db1.addFinding(finding1);
      await db2.addFinding(finding2);

      const findings1 = await db1.getAllFindings();
      const findings2 = await db2.getAllFindings();

      expect(findings1).toHaveLength(1);
      expect(findings2).toHaveLength(1);
      expect(findings1[0].topic).toBe('Brand One Research');
      expect(findings2[0].topic).toBe('Brand Two Research');
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle simultaneous operations on different brands', async () => {
      const tracker1 = new ProjectTracker(brand1Config);
      const tracker2 = new ProjectTracker(brand2Config);

      await Promise.all([tracker1.initialize(), tracker2.initialize()]);

      await Promise.all([
        tracker1.updatePhase('phase1', { status: 'in-progress' }),
        tracker2.updatePhase('phase1', { status: 'in-progress' }),
      ]);

      const status1 = tracker1.getStatus();
      const status2 = tracker2.getStatus();

      expect(status1?.project.brandName).toBe('Brand One');
      expect(status2?.project.brandName).toBe('Brand Two');
      expect(status1?.phases.phase1.status).toBe('in-progress');
      expect(status2?.phases.phase1.status).toBe('in-progress');
    });

    it('should handle concurrent database writes', async () => {
      const db1 = new ResearchDatabase(brand1Config);
      const db2 = new ResearchDatabase(brand2Config);

      await Promise.all([db1.initialize(), db2.initialize()]);

      const findings1: ResearchFinding[] = Array.from({ length: 5 }, (_, i) => ({
        topic: `Topic ${i}`,
        content: `Content for brand one ${i}`,
        sources: [{ title: `Source ${i}`, url: `https://example.com/${i}` }],
      }));

      const findings2: ResearchFinding[] = Array.from({ length: 5 }, (_, i) => ({
        topic: `Topic ${i}`,
        content: `Content for brand two ${i}`,
        sources: [{ title: `Source ${i}`, url: `https://example.com/${i}` }],
      }));

      await Promise.all([db1.addFindings(findings1), db2.addFindings(findings2)]);

      const count1 = (await db1.getAllFindings()).length;
      const count2 = (await db2.getAllFindings()).length;

      expect(count1).toBe(5);
      expect(count2).toBe(5);
    });
  });

  describe('Data Isolation', () => {
    it('should not leak data between brands', async () => {
      const tracker1 = new ProjectTracker(brand1Config);
      const tracker2 = new ProjectTracker(brand2Config);

      await tracker1.initialize();
      await tracker2.initialize();

      await tracker1.updatePhase('phase1', { status: 'in-progress' });
      const status1 = tracker1.getStatus();
      const firstDeliverable = status1?.phases.phase1.deliverables[0];

      if (firstDeliverable) {
        await tracker1.updateDeliverable('phase1', firstDeliverable.name, {
          status: 'completed',
        });
      }

      const updatedStatus1 = tracker1.getStatus();
      const status2 = tracker2.getStatus();

      expect(updatedStatus1?.metrics.deliverables.completed).toBe(1);
      expect(status2?.metrics.deliverables.completed).toBe(0);
    });

    it('should maintain separate statistics', async () => {
      const db1 = new ResearchDatabase(brand1Config);
      const db2 = new ResearchDatabase(brand2Config);

      await db1.initialize();
      await db2.initialize();

      await db1.addFinding({
        topic: 'Topic A',
        content: 'Content A',
        sources: [{ title: 'Source A', url: 'https://a.com' }],
        confidence: 8,
      });

      await db2.addFindings([
        {
          topic: 'Topic B',
          content: 'Content B',
          sources: [{ title: 'Source B', url: 'https://b.com' }],
          confidence: 6,
        },
        {
          topic: 'Topic C',
          content: 'Content C',
          sources: [{ title: 'Source C', url: 'https://c.com' }],
          confidence: 9,
        },
      ]);

      const stats1 = await db1.getStats();
      const stats2 = await db2.getStats();

      expect(stats1.metadata.totalFindings).toBe(1);
      expect(stats2.metadata.totalFindings).toBe(2);
    });
  });

  describe('Output Separation', () => {
    it('should generate separate dashboards for each brand', async () => {
      const tracker1 = new ProjectTracker(brand1Config);
      const tracker2 = new ProjectTracker(brand2Config);

      await tracker1.initialize();
      await tracker2.initialize();

      await tracker1.updatePhase('phase1', { status: 'in-progress' });
      await tracker2.updatePhase('phase1', { status: 'in-progress' });

      await Promise.all([
        tracker1.generateDashboard(),
        tracker2.generateDashboard(),
      ]);

      const dashboard1 = path.join(
        process.cwd(),
        'output',
        'brand-one',
        'dashboard.md'
      );
      const dashboard2 = path.join(
        process.cwd(),
        'output',
        'brand-two',
        'dashboard.md'
      );

      const exists1 = await fs
        .access(dashboard1)
        .then(() => true)
        .catch(() => false);
      const exists2 = await fs
        .access(dashboard2)
        .then(() => true)
        .catch(() => false);

      expect(exists1).toBe(true);
      expect(exists2).toBe(true);

      const content1 = await fs.readFile(dashboard1, 'utf-8');
      const content2 = await fs.readFile(dashboard2, 'utf-8');

      expect(content1).toContain('Brand One');
      expect(content2).toContain('Brand Two');
    });
  });

  describe('Brand Slug Generation', () => {
    it('should handle brand names with spaces', async () => {
      const brandWithSpaces: BrandConfiguration = {
        brandName: 'My Test Brand',
        industry: 'Test',
        category: 'Test',
        projectObjectives: {
          primary: 'Test',
          goals: [],
        },
      };

      const tracker = new ProjectTracker(brandWithSpaces);
      await tracker.initialize();

      const dataFile = tracker.getDataFile();
      expect(dataFile).toContain('my-test-brand');
    });

    it('should handle brand names with special characters', async () => {
      const brandWithSpecial: BrandConfiguration = {
        brandName: "O'Reilly & Sons",
        industry: 'Test',
        category: 'Test',
        projectObjectives: {
          primary: 'Test',
          goals: [],
        },
      };

      const tracker = new ProjectTracker(brandWithSpecial);
      await tracker.initialize();

      // Should normalize to a valid directory name
      const dataFile = tracker.getDataFile();
      expect(dataFile).toBeDefined();

      // Clean up
      const brandSlug = brandWithSpecial.brandName.toLowerCase().replace(/\s+/g, '-');
      await fs
        .rm(path.join(process.cwd(), 'data', brandSlug), {
          recursive: true,
          force: true,
        })
        .catch(() => {});
    });
  });

  describe('Cross-Brand Workflows', () => {
    it('should support working on multiple brands in same session', async () => {
      const tracker1 = new ProjectTracker(brand1Config);
      const tracker2 = new ProjectTracker(brand2Config);
      const db1 = new ResearchDatabase(brand1Config);
      const db2 = new ResearchDatabase(brand2Config);

      // Initialize all
      await Promise.all([
        tracker1.initialize(),
        tracker2.initialize(),
        db1.initialize(),
        db2.initialize(),
      ]);

      // Work on brand 1
      await tracker1.updatePhase('phase1', { status: 'in-progress' });
      await db1.addFinding({
        topic: 'Research',
        content: 'Brand 1 research',
        sources: [{ title: 'Source', url: 'https://example.com' }],
      });

      // Work on brand 2
      await tracker2.updatePhase('phase1', { status: 'in-progress' });
      await db2.addFinding({
        topic: 'Research',
        content: 'Brand 2 research',
        sources: [{ title: 'Source', url: 'https://example.com' }],
      });

      // Verify both working independently
      const status1 = tracker1.getStatus();
      const status2 = tracker2.getStatus();
      const findings1 = await db1.getAllFindings();
      const findings2 = await db2.getAllFindings();

      expect(status1?.project.brandName).toBe('Brand One');
      expect(status2?.project.brandName).toBe('Brand Two');
      expect(findings1[0].content).toContain('Brand 1');
      expect(findings2[0].content).toContain('Brand 2');
    });
  });
});
