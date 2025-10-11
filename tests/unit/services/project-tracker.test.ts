// Project Tracker Unit Tests
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProjectTracker } from '../../../src/services/project-tracker.js';
import type { BrandConfiguration } from '../../../src/types/project-types.js';
import fs from 'fs/promises';
import path from 'path';

const testBrandConfig: BrandConfiguration = {
  brandName: 'Test Brand',
  industry: 'Technology',
  category: 'Software',
  projectObjectives: {
    primary: 'Build a strong brand',
    goals: ['Goal 1', 'Goal 2'],
  },
};

const dataDir = path.join(process.cwd(), 'data', 'test-brand');
const dataFile = path.join(dataDir, 'project-status.json');

describe('ProjectTracker', () => {
  let tracker: ProjectTracker;

  beforeEach(async () => {
    tracker = new ProjectTracker(testBrandConfig);
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
      await tracker.initialize();
      const exists = await fs
        .access(dataFile)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);
    });

    it('should create initial project structure', async () => {
      await tracker.initialize();
      const content = await fs.readFile(dataFile, 'utf-8');
      const data = JSON.parse(content);

      expect(data.project.brandName).toBe('Test Brand');
      expect(data.project.overallStatus).toBe('in-progress'); // Starts as in-progress by default
      expect(data.phases).toBeDefined();
      expect(Object.keys(data.phases).length).toBeGreaterThan(0);
    });

    it('should load existing data on re-initialization', async () => {
      await tracker.initialize();
      const tracker2 = new ProjectTracker(testBrandConfig);
      await tracker2.initialize();

      const content = await fs.readFile(dataFile, 'utf-8');
      const data = JSON.parse(content);
      expect(data.project.brandName).toBe('Test Brand');
    });
  });

  describe('Phase Management', () => {
    beforeEach(async () => {
      await tracker.initialize();
    });

    it('should start a phase', async () => {
      await tracker.updatePhase('phase1', { status: 'in-progress' });
      const status = tracker.getStatus();

      expect(status?.phases.phase1.status).toBe('in-progress');
    });

    it('should complete a phase', async () => {
      await tracker.updatePhase('phase1', { status: 'in-progress' });
      await tracker.updatePhase('phase1', { status: 'completed' });
      const status = tracker.getStatus();

      expect(status?.phases.phase1.status).toBe('completed');
      expect(status?.phases.phase1.endDate).toBeDefined();
    });

    it('should throw error for invalid phase', async () => {
      await expect(
        tracker.updatePhase('invalid-phase', { status: 'in-progress' })
      ).rejects.toThrow('Phase invalid-phase not found');
    });
  });

  describe('Deliverable Management', () => {
    beforeEach(async () => {
      await tracker.initialize();
      await tracker.updatePhase('phase1', { status: 'in-progress' });
    });

    it('should mark deliverable as completed', async () => {
      const status = tracker.getStatus();
      const firstDeliverable = status?.phases.phase1.deliverables[0];

      if (!firstDeliverable) throw new Error('No deliverables found');

      await tracker.updateDeliverable('phase1', firstDeliverable.name, {
        status: 'completed',
      });
      const updatedStatus = tracker.getStatus();

      expect(updatedStatus?.phases.phase1.deliverables[0].status).toBe(
        'completed'
      );
      expect(updatedStatus?.phases.phase1.deliverables[0].completedDate).toBeDefined();
    });

    it('should calculate metrics correctly', async () => {
      const status = tracker.getStatus();
      const deliverables = status?.phases.phase1.deliverables || [];

      // Mark half completed
      const halfCount = Math.floor(deliverables.length / 2);
      for (let i = 0; i < halfCount; i++) {
        await tracker.updateDeliverable('phase1', deliverables[i].name, {
          status: 'completed',
        });
      }

      const updatedStatus = tracker.getStatus();
      const completedCount = updatedStatus?.metrics.deliverables.completed || 0;

      expect(completedCount).toBe(halfCount);
    });
  });

  describe('Milestone Management', () => {
    beforeEach(async () => {
      await tracker.initialize();
      await tracker.updatePhase('phase1', { status: 'in-progress' });
    });

    it('should add a milestone', async () => {
      await tracker.addMilestone('phase1', {
        name: 'Test Milestone',
        targetDate: '2025-12-31',
      });

      const status = tracker.getStatus();
      expect(status?.phases.phase1.milestones).toContain('Test Milestone');
    });

    it('should throw error for invalid phase', async () => {
      await expect(
        tracker.addMilestone('invalid-phase', {
          name: 'Test Milestone',
          targetDate: '2025-12-31',
        })
      ).rejects.toThrow('Phase invalid-phase not found');
    });
  });

  describe('Risk Management', () => {
    beforeEach(async () => {
      await tracker.initialize();
      await tracker.updatePhase('phase1', { status: 'in-progress' });
    });

    it('should add a risk', async () => {
      await tracker.addRisk('phase1', {
        title: 'Test Risk',
        description: 'This is a test risk',
        severity: 'high',
      });

      const status = tracker.getStatus();
      expect(status?.phases.phase1.risks).toHaveLength(1);
      expect(status?.phases.phase1.risks[0]).toContain('Test Risk');
    });

    it('should throw error for invalid phase', async () => {
      await expect(
        tracker.addRisk('invalid-phase', {
          title: 'Test Risk',
          description: 'Test description',
        })
      ).rejects.toThrow('Phase invalid-phase not found');
    });
  });

  describe('Metrics Calculation', () => {
    beforeEach(async () => {
      await tracker.initialize();
    });

    it('should calculate deliverable metrics', async () => {
      await tracker.updatePhase('phase1', { status: 'in-progress' });
      const status = tracker.getStatus();
      const deliverables = status?.phases.phase1.deliverables || [];

      // Complete some deliverables
      for (let i = 0; i < 2 && i < deliverables.length; i++) {
        await tracker.updateDeliverable('phase1', deliverables[i].name, {
          status: 'completed',
        });
      }

      const updatedStatus = tracker.getStatus();
      expect(updatedStatus?.metrics.deliverables.completed).toBe(2);
      expect(updatedStatus?.metrics.deliverables.completionRate).toBeGreaterThan(0);
    });

    it('should track total deliverables', async () => {
      const status = tracker.getStatus();
      expect(status?.metrics.deliverables.total).toBeGreaterThan(0);
    });
  });

  describe('Dashboard Generation', () => {
    beforeEach(async () => {
      await tracker.initialize();
      await tracker.updatePhase('phase1', { status: 'in-progress' });
    });

    it('should generate dashboard markdown', async () => {
      const dashboardPath = await tracker.generateDashboard();
      expect(dashboardPath).toContain('dashboard.md');
      expect(dashboardPath).toContain('test-brand');
    });

    it('should save dashboard to file', async () => {
      await tracker.generateDashboard();
      const dashboardFile = path.join(
        process.cwd(),
        'output',
        'test-brand',
        'dashboard.md'
      );

      const exists = await fs
        .access(dashboardFile)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);

      // Clean up
      await fs.rm(path.join(process.cwd(), 'output', 'test-brand'), {
        recursive: true,
        force: true,
      });
    });
  });

  describe('Deliverables Export', () => {
    beforeEach(async () => {
      await tracker.initialize();
      await tracker.updatePhase('phase1', { status: 'in-progress' });
    });

    it('should export deliverables list', async () => {
      const csvPath = await tracker.exportDeliverablesList();
      expect(csvPath).toContain('deliverables-checklist.csv');
      expect(csvPath).toContain('test-brand');
    });
  });

  describe('Error Handling', () => {
    it('should return null when getting status before init', () => {
      const uninitializedTracker = new ProjectTracker(testBrandConfig);
      const status = uninitializedTracker.getStatus();
      expect(status).toBeNull();
    });

    it('should throw error for invalid phase', async () => {
      await tracker.initialize();
      await expect(
        tracker.updatePhase('invalid-phase', { status: 'in-progress' })
      ).rejects.toThrow('Phase invalid-phase not found');
    });

    it('should throw error for invalid deliverable', async () => {
      await tracker.initialize();
      await tracker.updatePhase('phase1', { status: 'in-progress' });
      await expect(
        tracker.updateDeliverable('phase1', 'Non-existent Deliverable', {
          status: 'completed',
        })
      ).rejects.toThrow('Deliverable "Non-existent Deliverable" not found');
    });
  });
});
