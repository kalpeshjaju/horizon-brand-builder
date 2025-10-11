#!/usr/bin/env node
// Project Management Dashboard - TypeScript version

import { writeFile, readFile, mkdir, access } from 'fs/promises';
import { join } from 'path';
import { PROJECT_CONFIG, DELIVERABLES_CONFIG } from '../config/pm-dashboard-config.js';

interface Deliverable {
  name: string;
  status: 'not-started' | 'in-progress' | 'completed';
  assignee: string | null;
  dueDate: string | null;
  completedDate: string | null;
  notes: string[];
  dependencies: string[];
}

interface Milestone {
  id: string;
  name: string;
  description?: string;
  targetDate: string;
  createdAt: string;
}

interface Risk {
  id: string;
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  mitigation?: string;
  status: 'open' | 'mitigated' | 'closed';
  createdAt: string;
}

interface Phase {
  number: number;
  name: string;
  duration: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startDate: string | null;
  endDate: string | null;
  deliverables: Deliverable[];
  milestones: Milestone[];
  risks: Risk[];
  progress: number;
}

interface ProjectData {
  project: {
    name: string;
    startDate: string;
    totalDuration: string;
    currentPhase: string;
    overallStatus: string;
  };
  phases: Record<string, Phase>;
  metrics: {
    timeline: {
      plannedStartDate: string;
      actualStartDate: string;
      plannedEndDate: string | null;
      actualEndDate: string | null;
      daysElapsed: number;
    };
    deliverables: {
      total: number;
      completed: number;
      inProgress: number;
      notStarted: number;
      completionRate: number;
    };
    phases: {
      total: number;
      completed: number;
      inProgress: number;
      notStarted: number;
    };
  };
  lastUpdated: string;
}

// Configuration imported from pm-dashboard-config.ts

export class ProjectManagementDashboard {
  private dataFile: string;
  private data: ProjectData | null = null;

  constructor() {
    this.dataFile = join(process.cwd(), 'data', 'project-status.json');
  }

  async initialize(): Promise<void> {
    try {
      const dataDir = join(process.cwd(), 'data');
      await mkdir(dataDir, { recursive: true });

      // Try to load existing data
      try {
        const content = await readFile(this.dataFile, 'utf-8');
        this.data = JSON.parse(content);
      } catch {
        // Initialize new project
        this.data = this.createInitialStructure();
        await this.save();
      }
    } catch (error: any) {
      throw new Error(
        `Failed to initialize project tracker at ${this.dataFile}\n` +
          `Reason: ${error.message}\n` +
          `Fix: Ensure write permissions and sufficient disk space.`
      );
    }
  }

  private createInitialStructure(): ProjectData {
    const structure: ProjectData = {
      project: {
        name: PROJECT_CONFIG.name,
        startDate: new Date().toISOString(),
        totalDuration: PROJECT_CONFIG.totalDuration,
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
          total: PROJECT_CONFIG.phases.length,
          completed: 0,
          inProgress: 1,
          notStarted: PROJECT_CONFIG.phases.length - 1,
        },
      },
      lastUpdated: new Date().toISOString(),
    };

    // Initialize phases with deliverables
    PROJECT_CONFIG.phases.forEach((phase) => {
      const phaseKey = `phase${phase.phase}`;
      const deliverables = DELIVERABLES_CONFIG[phaseKey] || [];

      structure.phases[phaseKey] = {
        number: phase.phase,
        name: phase.name,
        duration: phase.duration,
        status: phase.phase === 1 ? 'in-progress' : 'not-started',
        startDate: phase.phase === 1 ? new Date().toISOString() : null,
        endDate: null,
        deliverables: deliverables.map((d) => ({
          name: d,
          status: 'not-started',
          assignee: null,
          dueDate: null,
          completedDate: null,
          notes: [],
          dependencies: [],
        })),
        milestones: [],
        risks: [],
        progress: 0,
      };

      structure.metrics.deliverables.total += deliverables.length;
      structure.metrics.deliverables.notStarted += deliverables.length;
    });

    return structure;
  }

  private async save(): Promise<void> {
    if (!this.data) return;

    this.data.lastUpdated = new Date().toISOString();
    await writeFile(this.dataFile, JSON.stringify(this.data, null, 2));
  }

  async updateDeliverable(
    phase: string,
    deliverableName: string,
    updates: Partial<Deliverable>
  ): Promise<Deliverable> {
    if (!this.data) throw new Error('Project data not initialized');

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
      completionRate: Math.round((completed / totalDeliverables) * 100),
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
    this.data.metrics.timeline.daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  async generateDashboard(): Promise<string> {
    if (!this.data) throw new Error('Project data not initialized');

    const outputDir = join(process.cwd(), 'output');
    await mkdir(outputDir, { recursive: true });

    const dashboardFile = join(outputDir, 'project-dashboard.md');

    let markdown = `# ${this.data.project.name} - Project Dashboard\n\n`;
    markdown += `**Last Updated:** ${new Date(this.data.lastUpdated).toLocaleString()}\n`;
    markdown += `**Days Elapsed:** ${this.data.metrics.timeline.daysElapsed}\n`;
    markdown += `**Current Phase:** ${this.data.project.currentPhase.toUpperCase()}\n`;
    markdown += `**Overall Status:** ${this.data.project.overallStatus.toUpperCase()}\n\n`;
    markdown += `---\n\n`;

    // Overall metrics
    markdown += `## 📊 Overall Progress\n\n`;
    markdown += `### Deliverables\n`;
    markdown += `- **Total:** ${this.data.metrics.deliverables.total}\n`;
    markdown += `- **Completed:** ${this.data.metrics.deliverables.completed} (${this.data.metrics.deliverables.completionRate}%)\n`;
    markdown += `- **In Progress:** ${this.data.metrics.deliverables.inProgress}\n`;
    markdown += `- **Not Started:** ${this.data.metrics.deliverables.notStarted}\n\n`;

    // Progress bar
    const progressBarWidth = 50;
    const filledWidth = Math.round((this.data.metrics.deliverables.completionRate / 100) * progressBarWidth);
    const progressBar = '█'.repeat(filledWidth) + '░'.repeat(progressBarWidth - filledWidth);
    markdown += `\`\`\`\n${progressBar} ${this.data.metrics.deliverables.completionRate}%\n\`\`\`\n\n`;
    markdown += `---\n\n`;

    // Phase details
    markdown += `## 📋 Phase Status\n\n`;

    for (const phase of Object.values(this.data.phases)) {
      const statusEmoji = { 'completed': '✅', 'in-progress': '🔄', 'not-started': '⏸️' }[phase.status] || '❓';

      markdown += `### ${statusEmoji} Phase ${phase.number}: ${phase.name}\n\n`;
      markdown += `- **Duration:** ${phase.duration}\n`;
      markdown += `- **Status:** ${phase.status}\n`;
      markdown += `- **Progress:** ${phase.progress}%\n\n`;

      markdown += `#### Deliverables (${phase.deliverables.filter((d) => d.status === 'completed').length}/${phase.deliverables.length})\n\n`;

      // Group by status
      const byStatus = {
        completed: phase.deliverables.filter((d) => d.status === 'completed'),
        'in-progress': phase.deliverables.filter((d) => d.status === 'in-progress'),
        'not-started': phase.deliverables.filter((d) => d.status === 'not-started'),
      };

      for (const [status, deliverables] of Object.entries(byStatus)) {
        if (deliverables.length > 0) {
          const emoji = { completed: '✅', 'in-progress': '🔄', 'not-started': '⬜' }[status];
          markdown += `**${emoji} ${status.charAt(0).toUpperCase() + status.slice(1)} (${deliverables.length})**\n`;
          deliverables.forEach((d) => {
            markdown += `- ${d.name}\n`;
          });
          markdown += `\n`;
        }
      }

      markdown += `---\n\n`;
    }

    await writeFile(dashboardFile, markdown);

    console.log(`\n✅ Dashboard generated: ${dashboardFile}\n`);
    return dashboardFile;
  }

  async getStatus(): Promise<void> {
    if (!this.data) throw new Error('Project data not initialized');

    console.log(`\n📊 Project Status:`);
    console.log(`Overall Completion: ${this.data.metrics.deliverables.completionRate}%`);
    console.log(`Current Phase: ${this.data.project.currentPhase}`);
    console.log(`Days Elapsed: ${this.data.metrics.timeline.daysElapsed}\n`);
  }
}

// CLI Interface
async function main() {
  const command = process.argv[2];
  const dashboard = new ProjectManagementDashboard();
  await dashboard.initialize();

  try {
    switch (command) {
      case 'init':
        console.log('✅ Project management dashboard initialized');
        await dashboard.getStatus();
        break;

      case 'dashboard':
        await dashboard.generateDashboard();
        break;

      case 'status':
        await dashboard.getStatus();
        break;

      case 'update':
        const phase = process.argv[3];
        const deliverable = process.argv[4];
        const status = process.argv[5] as 'not-started' | 'in-progress' | 'completed';

        if (!phase || !deliverable || !status) {
          console.error('Usage: npm run pm:dashboard update <phase> "<deliverable>" <status>');
          process.exit(1);
        }

        await dashboard.updateDeliverable(phase, deliverable, { status });
        console.log(`✅ Updated ${deliverable} to ${status}`);
        await dashboard.generateDashboard();
        break;

      default:
        console.log(`
Brand Builder Pro - Project Management Dashboard

Commands:
  init              Initialize project tracker
  dashboard         Generate project dashboard
  status            Show quick status
  update <phase> "<deliverable>" <status>
                    Update deliverable status

Status values: not-started, in-progress, completed

Examples:
  npm run pm:dashboard dashboard
  npm run pm:dashboard status
  npm run pm:dashboard update phase1 "Brand Audit Report" completed
        `);
    }
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run CLI if executed directly
if (import.meta.url.startsWith('file://')) {
  const modulePath = decodeURIComponent(new URL(import.meta.url).pathname);
  if (process.argv[1] && modulePath === process.argv[1]) {
    main().catch((err) => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
  }
}

export default ProjectManagementDashboard;
