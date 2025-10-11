// Generic Project Tracker for Horizon Brand Builder Pro
// Tracks 64 deliverables across 5 phases for ANY brand

import fs from 'fs/promises';
import path from 'path';
import {
  customizeDeliverables,
  GENERIC_PROJECT_TIMELINE,
} from '../config/deliverables-framework.js';
import type {
  BrandConfiguration,
  ProjectStatus,
  Deliverable,
  Phase,
} from '../types/project-types.js';
import {
  generateDashboard,
  exportDeliverablesList,
} from './project-tracker-dashboard.js';

export class ProjectTracker {
  private dataFile: string;
  private data: ProjectStatus | null;
  private brandConfig: BrandConfiguration;

  constructor(brandConfig: BrandConfiguration) {
    this.brandConfig = brandConfig;
    this.data = null;

    // Store per-brand: data/{brandName}/project-status.json
    const brandSlug = brandConfig.brandName.toLowerCase().replace(/\s+/g, '-');
    this.dataFile = path.join(process.cwd(), 'data', brandSlug, 'project-status.json');
  }

  async initialize(): Promise<void> {
    try {
      const brandSlug = this.brandConfig.brandName.toLowerCase().replace(/\s+/g, '-');
      const dataDir = path.join(process.cwd(), 'data', brandSlug);
      await fs.mkdir(dataDir, { recursive: true });

      // Try to load existing data
      try {
        const content = await fs.readFile(this.dataFile, 'utf-8');
        this.data = JSON.parse(content);
      } catch {
        // Initialize new project
        this.data = this.createInitialStructure();
        await this.save();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        `Failed to initialize project tracker at ${this.dataFile}\n` +
          `Reason: ${errorMessage}\n` +
          `Fix: Ensure you have write permissions for the directory and sufficient disk space.`
      );
    }
  }

  private createInitialStructure(): ProjectStatus {
    const deliverables = customizeDeliverables(this.brandConfig);

    const structure: ProjectStatus = {
      project: {
        name: `${this.brandConfig.brandName} Brand Transformation`,
        brandName: this.brandConfig.brandName,
        startDate: new Date().toISOString(),
        totalDuration: GENERIC_PROJECT_TIMELINE.totalDuration,
        currentPhase: 'phase1',
        overallStatus: 'in-progress',
      },
      phases: {},
      metrics: {
        timeline: {
          plannedStartDate: new Date().toISOString(),
          actualStartDate: new Date().toISOString(),
          plannedEndDate: null,
          actualEndDate: null,
          daysElapsed: 0,
        },
        deliverables: {
          total: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          completionRate: 0,
        },
        phases: {
          total: GENERIC_PROJECT_TIMELINE.phases.length,
          completed: 0,
          inProgress: 1,
          notStarted: GENERIC_PROJECT_TIMELINE.phases.length - 1,
        },
      },
      lastUpdated: new Date().toISOString(),
    };

    // Initialize phases with deliverables
    GENERIC_PROJECT_TIMELINE.phases.forEach((phase) => {
      const phaseKey = `phase${phase.phase}`;
      const phaseDeliverables = deliverables[phaseKey] || [];

      structure.phases[phaseKey] = {
        number: phase.phase,
        name: phase.name,
        duration: phase.duration,
        status: phase.phase === 1 ? 'in-progress' : 'not-started',
        startDate: phase.phase === 1 ? new Date().toISOString() : null,
        endDate: null,
        deliverables: phaseDeliverables.map((d) => ({
          name: d,
          status: 'not-started',
          assignee: undefined,
          dueDate: undefined,
          completedDate: undefined,
          notes: [],
          dependencies: [],
        })),
        milestones: [],
        risks: [],
        progress: 0,
      };

      structure.metrics.deliverables.total += phaseDeliverables.length;
      structure.metrics.deliverables.notStarted += phaseDeliverables.length;
    });

    return structure;
  }

  async save(): Promise<void> {
    if (!this.data) {
      throw new Error('No project data to save. Call initialize() first.');
    }

    this.data.lastUpdated = new Date().toISOString();
    await fs.writeFile(this.dataFile, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  async updateDeliverable(
    phase: string,
    deliverableName: string,
    updates: Partial<Deliverable>
  ): Promise<Deliverable> {
    if (!this.data) {
      throw new Error('Project tracker not initialized. Call initialize() first.');
    }

    const phaseData = this.data.phases[phase];
    if (!phaseData) {
      throw new Error(`Phase ${phase} not found`);
    }

    const deliverable = phaseData.deliverables.find((d) => d.name === deliverableName);
    if (!deliverable) {
      throw new Error(`Deliverable "${deliverableName}" not found in ${phase}`);
    }

    const oldStatus = deliverable.status;

    Object.assign(deliverable, updates);

    if (updates.status && updates.status !== oldStatus) {
      if (updates.status === 'completed') {
        deliverable.completedDate = new Date().toISOString();
      }
      this.recalculateMetrics();
    }

    await this.save();
    return deliverable;
  }

  async addMilestone(
    phase: string,
    milestone: { name: string; description?: string; targetDate: string }
  ): Promise<void> {
    if (!this.data) {
      throw new Error('Project tracker not initialized. Call initialize() first.');
    }

    const phaseData = this.data.phases[phase];
    if (!phaseData) {
      throw new Error(`Phase ${phase} not found`);
    }

    phaseData.milestones.push(milestone.name);

    await this.save();
  }

  async addRisk(
    phase: string,
    risk: { title: string; description: string; severity?: string; mitigation?: string }
  ): Promise<void> {
    if (!this.data) {
      throw new Error('Project tracker not initialized. Call initialize() first.');
    }

    const phaseData = this.data.phases[phase];
    if (!phaseData) {
      throw new Error(`Phase ${phase} not found`);
    }

    phaseData.risks.push(`${risk.title}: ${risk.description}`);

    await this.save();
  }

  async updatePhase(
    phase: string,
    updates: Partial<Pick<Phase, 'status' | 'startDate' | 'endDate'>>
  ): Promise<void> {
    if (!this.data) {
      throw new Error('Project tracker not initialized. Call initialize() first.');
    }

    const phaseData = this.data.phases[phase];
    if (!phaseData) {
      throw new Error(`Phase ${phase} not found`);
    }

    Object.assign(phaseData, updates);

    if (updates.status === 'completed') {
      phaseData.endDate = new Date().toISOString();
    }

    this.recalculateMetrics();
    await this.save();
  }

  private recalculateMetrics(): void {
    if (!this.data) return;

    let totalDeliverables = 0;
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    let phasesCompleted = 0;
    let phasesInProgress = 0;
    let phasesNotStarted = 0;

    for (const phase of Object.values(this.data.phases)) {
      // Count deliverables
      phase.deliverables.forEach((d) => {
        totalDeliverables++;
        if (d.status === 'completed') completed++;
        else if (d.status === 'in-progress') inProgress++;
        else notStarted++;
      });

      // Calculate phase progress
      const phaseCompleted = phase.deliverables.filter((d) => d.status === 'completed').length;
      phase.progress = Math.round((phaseCompleted / phase.deliverables.length) * 100);

      // Count phase status
      if (phase.status === 'completed') phasesCompleted++;
      else if (phase.status === 'in-progress') phasesInProgress++;
      else phasesNotStarted++;
    }

    this.data.metrics.deliverables = {
      total: totalDeliverables,
      completed,
      inProgress,
      notStarted,
      completionRate: totalDeliverables > 0 ? Math.round((completed / totalDeliverables) * 100) : 0,
    };

    this.data.metrics.phases = {
      total: Object.keys(this.data.phases).length,
      completed: phasesCompleted,
      inProgress: phasesInProgress,
      notStarted: phasesNotStarted,
    };

    // Calculate days elapsed
    const startDate = new Date(this.data.project.startDate);
    const now = new Date();
    this.data.metrics.timeline.daysElapsed = Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  async generateDashboard(): Promise<string> {
    if (!this.data) {
      throw new Error('Project tracker not initialized. Call initialize() first.');
    }
    return generateDashboard(this.data, this.brandConfig.brandName);
  }

  async exportDeliverablesList(): Promise<string> {
    if (!this.data) {
      throw new Error('Project tracker not initialized. Call initialize() first.');
    }
    return exportDeliverablesList(this.data, this.brandConfig.brandName);
  }

  getStatus(): ProjectStatus | null {
    return this.data;
  }

  // CLI interface
  async handleCLI(command: string, ...args: string[]): Promise<void> {
    await this.initialize();

    try {
      switch (command) {
        case 'init':
          console.log(`✅ Project tracker initialized at: ${this.dataFile}`);
          console.log(
            `📊 Tracking ${this.data?.metrics.deliverables.total} deliverables across ${this.data?.metrics.phases.total} phases`
          );
          break;

        case 'dashboard':
          await this.generateDashboard();
          break;

        case 'export':
          await this.exportDeliverablesList();
          break;

        case 'update':
          const [phase, deliverable, status] = args;
          if (!phase || !deliverable || !status) {
            console.error(
              'Usage: tracker:update <phase> "<deliverable>" <status>'
            );
            process.exit(1);
          }
          await this.updateDeliverable(phase, deliverable, { status: status as any });
          console.log(`✅ Updated ${deliverable} to ${status}`);
          await this.generateDashboard();
          break;

        case 'status':
          console.log(`\n📊 Project Status:`);
          console.log(
            `Overall Completion: ${this.data?.metrics.deliverables.completionRate}%`
          );
          console.log(`Current Phase: ${this.data?.project.currentPhase}`);
          console.log(`Days Elapsed: ${this.data?.metrics.timeline.daysElapsed}\n`);
          break;

        default:
          console.log(`
Horizon Brand Builder Pro - Project Tracker

Commands:
  init              Initialize project tracker
  dashboard         Generate project dashboard
  export            Export deliverables checklist (CSV)
  status            Show quick status
  update <phase> "<deliverable>" <status>
                    Update deliverable status
                    Status: not-started, in-progress, completed

Examples:
  npm run tracker:dashboard
  npm run tracker:update phase1 "Brand Audit Report" completed
  npm run tracker:export
          `);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error:', errorMessage);
      process.exit(1);
    }
  }
}

// CLI execution (when run directly)
if (import.meta.url.startsWith('file://')) {
  const modulePath = decodeURIComponent(new URL(import.meta.url).pathname);
  const scriptPath = process.argv[1];

  if (modulePath === scriptPath) {
    const command = process.argv[2] || 'status';
    const args = process.argv.slice(3);

    // For CLI, use a default/example brand config
    // In production, this would be loaded from user's config
    const exampleConfig = {
      brandName: 'Example Brand',
      industry: 'Generic',
      category: 'General',
      projectObjectives: {
        primary: 'Build a strong brand',
        goals: ['Goal 1', 'Goal 2'],
      },
    };

    const tracker = new ProjectTracker(exampleConfig as any);
    tracker.handleCLI(command, ...args).catch((err) => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
  }
}

export default ProjectTracker;
