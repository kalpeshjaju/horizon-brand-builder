#!/usr/bin/env node
// Adaptive Workflow CLI - Command-line interface for workflow management

import { AdaptiveWorkflowEngine } from '../workflow/adaptive-engine.js';
import { DependencyGraphBuilder } from '../workflow/dependency-graph.js';
import { QualityScorer } from '../workflow/quality-scorer.js';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { WorkflowConfig, WorkflowState } from '../types/adaptive-workflow-types.js';

class WorkflowCLI {

  /**
   * Start a new workflow
   */
  async start(brandName: string, options: {
    inputDir?: string;
    outputDir?: string;
    watch?: boolean;
    qualityThreshold?: number;
  } = {}): Promise<void> {

    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     ADAPTIVE BRAND STRATEGY WORKFLOW                          ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');

    const config: WorkflowConfig = {
      brandName,
      enableAutoRegeneration: true,
      qualityThreshold: options.qualityThreshold || 95,
      watchForInputs: options.watch !== false,
      inputDirectory: options.inputDir || join(process.cwd(), 'output', this.slugify(brandName), 'inputs'),
      outputDirectory: options.outputDir || join(process.cwd(), 'output', this.slugify(brandName)),
      versioningEnabled: true,
      maxVersionsToKeep: 10
    };

    const engine = new AdaptiveWorkflowEngine(config);
    await engine.run();
  }

  /**
   * Show workflow status
   */
  async status(brandName: string): Promise<void> {
    const stateFile = join(
      process.cwd(),
      'output',
      this.slugify(brandName),
      '.workflow',
      'state.json'
    );

    let state: WorkflowState;
    try {
      const content = await readFile(stateFile, 'utf-8');
      state = JSON.parse(content);
    } catch {
      console.log(`❌ No workflow found for ${brandName}`);
      console.log(`   Run: npm run workflow:start -- --brand="${brandName}"`);
      return;
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  WORKFLOW STATUS: ${brandName.toUpperCase()}`);
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');

    console.log(`Overall Status: ${this.getStatusEmoji(state.overallStatus)} ${state.overallStatus.toUpperCase()}`);
    console.log(`Quality Score:  ${this.getQualityBar(state.qualityScore)} ${state.qualityScore.toFixed(1)}%`);
    console.log(`Started:        ${new Date(state.startedAt).toLocaleString()}`);
    console.log(`Last Updated:   ${new Date(state.lastUpdatedAt).toLocaleString()}`);
    console.log('');

    console.log('📊 Progress:');
    console.log(`   Total Tasks:    ${state.metrics.totalTasks}`);
    console.log(`   ✅ Completed:   ${state.metrics.completedCount}`);
    console.log(`   ⏭️  Skipped:     ${state.metrics.skippedCount}`);
    console.log(`   ⏸️  Paused:      ${state.metrics.pausedCount}`);
    console.log('');

    console.log('📈 Data Quality:');
    console.log(`   Real Data:      ${state.metrics.realDataCount}`);
    console.log(`   Placeholders:   ${state.metrics.placeholderCount}`);
    console.log('');

    // Show quality breakdown
    const scorer = new QualityScorer();
    const report = scorer.generateQualityReport(state);

    console.log('📋 Quality Breakdown:');
    report.breakdown.slice(0, 10).forEach(section => {
      const statusIcon = this.getStatusIcon(section.status);
      const qualityBar = this.getMiniBar(section.quality);
      console.log(`   ${statusIcon} ${section.sectionName.substring(0, 35).padEnd(35)} ${qualityBar} ${section.quality.toFixed(0)}%`);
    });

    if (report.breakdown.length > 10) {
      console.log(`   ... and ${report.breakdown.length - 10} more sections`);
    }
    console.log('');

    // Show recommendations
    if (report.recommendations.length > 0) {
      console.log('💡 Top Recommendations:');
      report.recommendations.slice(0, 5).forEach((rec, i) => {
        const priority = this.getPriorityIcon(rec.priority);
        console.log(`   ${i + 1}. ${priority} ${rec.action}`);
        console.log(`      Expected improvement: +${rec.expectedImprovement.toFixed(1)}%`);
      });
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════════════');
  }

  /**
   * Show version history
   */
  async history(brandName: string): Promise<void> {
    const versionsFile = join(
      process.cwd(),
      'output',
      this.slugify(brandName),
      '.workflow',
      'versions.json'
    );

    let versions: any[];
    try {
      const content = await readFile(versionsFile, 'utf-8');
      versions = JSON.parse(content);
    } catch {
      console.log(`❌ No version history found for ${brandName}`);
      return;
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  VERSION HISTORY: ${brandName.toUpperCase()}`);
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');

    versions.reverse().forEach((version, index) => {
      const isCurrent = index === 0;
      const marker = isCurrent ? '→' : ' ';
      const date = new Date(version.generatedAt).toLocaleString();

      console.log(`${marker} ${version.version}${isCurrent ? ' (current)' : ''}`);
      console.log(`   Date:    ${date}`);
      console.log(`   Quality: ${version.quality.toFixed(1)}%`);
      console.log(`   Trigger: ${version.triggerEvent}`);
      console.log(`   Changes: ${version.updatedSections.length} sections updated`);
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════════');
  }

  /**
   * Validate task dependencies
   */
  async validate(): Promise<void> {
    console.log('🔍 Validating task dependencies...\n');

    const result = DependencyGraphBuilder.validateDependencies();

    if (result.valid) {
      console.log('✅ All dependencies are valid!\n');

      const graph = DependencyGraphBuilder.buildGraph();
      const stats = DependencyGraphBuilder.getStatistics(graph);

      console.log('📊 Statistics:');
      console.log(`   Total tasks:          ${stats.totalTasks}`);
      console.log(`   Max parallelism:      ${stats.maxParallelism} tasks`);
      console.log(`   Critical path length: ${stats.criticalPathLength} iterations`);
      console.log(`   Avg dependencies:     ${stats.averageDependencies.toFixed(1)}`);
      console.log('');

      console.log('🔄 Execution Order (parallel batches):');
      graph.executionOrder.forEach((batch, i) => {
        console.log(`   Batch ${i + 1}: ${batch.length} tasks can run in parallel`);
      });

    } else {
      console.log('❌ Dependency validation failed!\n');
      result.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
      console.log('');
      process.exit(1);
    }
  }

  /**
   * List all tasks
   */
  async listTasks(options: { category?: string; humanOnly?: boolean } = {}): Promise<void> {
    const { TASK_DEFINITIONS, getTasksByCategory, getHumanRequiredTasks } = await import('../config/task-definitions.js');

    let tasks = Object.values(TASK_DEFINITIONS);

    if (options.category) {
      tasks = getTasksByCategory(options.category as any);
    }

    if (options.humanOnly) {
      tasks = getHumanRequiredTasks();
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  TASK LIST (${tasks.length} tasks)`);
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');

    tasks.forEach((task, i) => {
      const humanIcon = task.humanRequired ? '👤' : '🤖';
      const skipIcon = task.canSkip ? '⏭️' : '🚫';

      console.log(`${i + 1}. ${humanIcon} ${task.name}`);
      console.log(`   ID: ${task.id}`);
      console.log(`   Category: ${task.category}`);
      console.log(`   Dependencies: ${task.dependencies.length}`);
      if (task.humanRequired) {
        console.log(`   ${skipIcon} ${task.canSkip ? `Can skip (${task.skipStrategy})` : 'Cannot skip'}`);
      }
      if (task.agent) {
        console.log(`   Agent: ${task.agent}`);
      }
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════════════════');
  }

  // Utility functions

  private slugify(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }

  private getStatusEmoji(status: string): string {
    const map: Record<string, string> = {
      'initializing': '🔄',
      'running': '▶️',
      'paused': '⏸️',
      'completed': '✅',
      'failed': '❌'
    };
    return map[status] || '❓';
  }

  private getStatusIcon(status: string): string {
    const map: Record<string, string> = {
      'complete': '✅',
      'placeholder': '⏭️',
      'inference': '🔮',
      'partial': '⚠️'
    };
    return map[status] || '❓';
  }

  private getPriorityIcon(priority: string): string {
    const map: Record<string, string> = {
      'high': '🔴',
      'medium': '🟡',
      'low': '🟢'
    };
    return map[priority] || '⚪';
  }

  private getQualityBar(quality: number): string {
    const width = 20;
    const filled = Math.round((quality / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  private getMiniBar(quality: number): string {
    const width = 10;
    const filled = Math.round((quality / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
}

// CLI Entry point
async function main() {
  const cli = new WorkflowCLI();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'start': {
      const brandName = args.find(arg => arg.startsWith('--brand='))?.split('=')[1];
      if (!brandName) {
        console.error('Error: --brand is required');
        console.log('Usage: npm run workflow:start -- --brand="Brand Name"');
        process.exit(1);
      }

      const watch = !args.includes('--no-watch');
      const qualityThreshold = parseInt(args.find(arg => arg.startsWith('--threshold='))?.split('=')[1] || '95');

      await cli.start(brandName, { watch, qualityThreshold });
      break;
    }

    case 'status': {
      const brandName = args.find(arg => arg.startsWith('--brand='))?.split('=')[1];
      if (!brandName) {
        console.error('Error: --brand is required');
        console.log('Usage: npm run workflow:status -- --brand="Brand Name"');
        process.exit(1);
      }
      await cli.status(brandName);
      break;
    }

    case 'history': {
      const brandName = args.find(arg => arg.startsWith('--brand='))?.split('=')[1];
      if (!brandName) {
        console.error('Error: --brand is required');
        console.log('Usage: npm run workflow:history -- --brand="Brand Name"');
        process.exit(1);
      }
      await cli.history(brandName);
      break;
    }

    case 'validate': {
      await cli.validate();
      break;
    }

    case 'tasks': {
      const category = args.find(arg => arg.startsWith('--category='))?.split('=')[1];
      const humanOnly = args.includes('--human-only');
      await cli.listTasks({ category, humanOnly });
      break;
    }

    default:
      console.log('');
      console.log('Adaptive Workflow CLI');
      console.log('');
      console.log('Commands:');
      console.log('  start     Start a new workflow');
      console.log('  status    Show workflow status');
      console.log('  history   Show version history');
      console.log('  validate  Validate task dependencies');
      console.log('  tasks     List all tasks');
      console.log('');
      console.log('Examples:');
      console.log('  npm run workflow:start -- --brand="Flyberry"');
      console.log('  npm run workflow:status -- --brand="Flyberry"');
      console.log('  npm run workflow:history -- --brand="Flyberry"');
      console.log('  npm run workflow:validate');
      console.log('  npm run workflow:tasks');
      console.log('  npm run workflow:tasks -- --category=research');
      console.log('  npm run workflow:tasks -- --human-only');
      console.log('');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

export { WorkflowCLI };
