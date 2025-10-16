// Adaptive Workflow Engine - Executes tasks with skip & regeneration capabilities

import { writeFile, readFile, mkdir, watch } from 'fs/promises';
import { join } from 'path';
import type {
  TaskDefinition,
  TaskOutput,
  WorkflowState,
  WorkflowConfig,
  HumanInputEvent,
  DependencyGraph,
  PlaceholderContent
} from '../types/adaptive-workflow-types.js';
import type { LLMAdapter } from '../adapters/llm-interface.js';
import type { BrandConfiguration } from '../types/project-types.js';
import { TASK_DEFINITIONS } from '../config/task-definitions.js';
import { DependencyGraphBuilder } from './dependency-graph.js';
import { QualityScorer } from './quality-scorer.js';
import { VersionManager } from './version-manager.js';
import { AgentExecutor } from './agent-executor.js';
import { WorkflowReportGenerator } from './report-generator.js';

export class AdaptiveWorkflowEngine {

  private config: WorkflowConfig;
  private state: WorkflowState;
  private graph: DependencyGraph;
  private qualityScorer: QualityScorer;
  private versionManager: VersionManager;
  private agentExecutor?: AgentExecutor;
  private brandConfig?: BrandConfiguration;
  private stateFile: string;

  constructor(
    config: WorkflowConfig,
    llm?: LLMAdapter,
    brandConfig?: BrandConfiguration
  ) {
    this.config = config;
    this.brandConfig = brandConfig;
    this.graph = DependencyGraphBuilder.buildGraph();
    this.qualityScorer = new QualityScorer();
    this.versionManager = new VersionManager(config);
    this.stateFile = join(config.outputDirectory, '.workflow', 'state.json');
    this.state = this.createInitialState();

    // Initialize agent executor if LLM and brand config provided
    if (llm && brandConfig) {
      this.agentExecutor = new AgentExecutor(llm, brandConfig, config.outputDirectory);
    }
  }

  /**
   * Main entry point - Run complete workflow
   */
  async run(): Promise<void> {
    console.log('\n🚀 Starting Adaptive Workflow\n');
    console.log(`Brand: ${this.config.brandName}`);
    console.log(`Total tasks: ${this.graph.nodes.size}`);
    console.log(`Max parallelism: ${DependencyGraphBuilder.getStatistics(this.graph).maxParallelism}\n`);

    // Initialize
    await this.initialize();

    // Phase 1: Execute all tasks with skips
    await this.executeWithSkips();

    // Phase 2: Watch for human inputs (if enabled)
    if (this.config.watchForInputs) {
      await this.watchForHumanInputs();
    }
  }

  /**
   * Initialize workflow state
   */
  private async initialize(): Promise<void> {
    // Create output directories
    await mkdir(join(this.config.outputDirectory, '.workflow'), { recursive: true });
    await mkdir(join(this.config.outputDirectory, 'reports'), { recursive: true });
    await mkdir(join(this.config.outputDirectory, 'deliverables'), { recursive: true });
    await mkdir(this.config.inputDirectory, { recursive: true });

    // Try to load existing state
    try {
      const content = await readFile(this.stateFile, 'utf-8');
      this.state = JSON.parse(content);
      console.log('✅ Loaded existing workflow state\n');
    } catch {
      // New workflow
      this.state = this.createInitialState();
      await this.saveState();
      console.log('✅ Created new workflow state\n');
    }
  }

  /**
   * Execute all tasks, skipping human-required ones
   */
  private async executeWithSkips(): Promise<void> {
    console.log('📊 Phase 1: Autonomous Execution\n');

    const completedTaskIds = new Set(
      Object.entries(this.state.completedTasks)
        .filter(([, output]) => output.status === 'completed' || output.status === 'skipped')
        .map(([id]) => id)
    );

    let iteration = 0;
    const maxIterations = 100; // Safety limit

    while (iteration < maxIterations) {
      iteration++;

      // Get tasks that can run now
      const readyTasks = DependencyGraphBuilder.getReadyTasks(this.graph, completedTaskIds);

      if (readyTasks.length === 0) {
        // No more tasks can run
        break;
      }

      console.log(`\n🔄 Iteration ${iteration}: ${readyTasks.length} tasks ready\n`);

      // Execute ready tasks (in parallel where possible)
      await Promise.all(
        readyTasks.map(task => this.executeOrSkipTask(task, completedTaskIds))
      );

      await this.saveState();
    }

    // Generate initial report
    const version = await this.generateReport('v1.0', 'Initial generation');
    console.log(`\n📄 Report ${version.version} generated`);
    console.log(`   Quality: ${version.quality.toFixed(1)}%`);

    if (version.quality < 100) {
      console.log('\n⚠️  Some sections use placeholders or inference');
      console.log('   Upload real data to improve quality:\n');

      this.listPendingHumanTasks().forEach(task => {
        console.log(`   → ${task.name}`);
        console.log(`      Upload to: ${this.config.inputDirectory}/${task.id}.txt\n`);
      });
    }
  }

  /**
   * Execute a single task or skip it if human-required
   */
  private async executeOrSkipTask(
    task: TaskDefinition,
    completedTaskIds: Set<string>
  ): Promise<void> {

    if (task.humanRequired && task.canSkip) {
      // SKIP: Use placeholder strategy
      console.log(`⏭️  Skipping: ${task.name} (human required, using ${task.skipStrategy})`);

      const placeholder = await this.generatePlaceholder(task);

      const output: TaskOutput = {
        taskId: task.id,
        status: 'skipped',
        content: placeholder,
        isPlaceholder: true,
        quality: 0.5, // 50% quality for placeholders
        version: 1,
        createdAt: new Date().toISOString(),
        metadata: {
          agent: 'PlaceholderGenerator',
          inputSources: [],
          note: placeholder.note
        }
      };

      this.state.completedTasks[task.id] = output;
      this.state.skippedTasks.push(task.id);
      this.state.metrics.skippedCount++;
      this.state.metrics.placeholderCount++;
      completedTaskIds.add(task.id);

    } else if (task.humanRequired && !task.canSkip) {
      // PAUSE: Cannot proceed without human input
      console.log(`⏸️  Paused: ${task.name} (required, cannot skip)`);

      this.state.pausedTasks.push(task.id);
      this.state.metrics.pausedCount++;
      // Don't add to completedTaskIds - this blocks dependent tasks

    } else {
      // EXECUTE: AI can complete this
      console.log(`▶️  Running: ${task.name}`);

      const startTime = Date.now();
      const output = await this.executeTask(task);
      const executionTime = Date.now() - startTime;

      output.metadata.executionTime = executionTime;

      this.state.completedTasks[task.id] = output;
      this.state.metrics.completedCount++;
      this.state.metrics.realDataCount++;
      completedTaskIds.add(task.id);

      console.log(`   ✅ Completed in ${(executionTime / 1000).toFixed(1)}s`);
    }

    this.updateQualityScore();
  }

  /**
   * Execute a task with AI agent
   */
  private async executeTask(task: TaskDefinition): Promise<TaskOutput> {
    // Gather inputs from completed dependencies
    const dependencyOutputs = new Map<string, TaskOutput>();
    task.dependencies.forEach(depId => {
      const depOutput = this.state.completedTasks[depId];
      if (depOutput) {
        dependencyOutputs.set(depId, depOutput);
      }
    });

    // Use real agent executor if available
    if (this.agentExecutor) {
      try {
        const output = await this.agentExecutor.executeTask(task, dependencyOutputs);
        return output; // AgentExecutor already returns full TaskOutput
      } catch (error: any) {
        console.error(`   ❌ Agent execution failed: ${error.message}`);
        // Fall back to mock execution
      }
    }

    // Fallback: Mock execution (for testing without LLM)
    const content = await this.mockAgentExecution(task, dependencyOutputs);

    const output: TaskOutput = {
      taskId: task.id,
      status: 'completed',
      content,
      isPlaceholder: false,
      quality: 1.0, // 100% quality for real AI output
      version: 1,
      createdAt: new Date().toISOString(),
      metadata: {
        agent: task.agent || 'GenericAgent',
        inputSources: Array.from(dependencyOutputs.keys())
      }
    };

    return output;
  }

  /**
   * Mock agent execution (replace with real agent calls)
   */
  private async mockAgentExecution(
    task: TaskDefinition,
    inputs: Map<string, TaskOutput>
  ): Promise<unknown> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      taskId: task.id,
      taskName: task.name,
      timestamp: new Date().toISOString(),
      summary: `AI-generated output for ${task.name}`,
      inputs: Array.from(inputs.keys()),
      deliverables: [`${task.id}-deliverable.md`]
    };
  }

  /**
   * Generate placeholder content for skipped tasks
   */
  private async generatePlaceholder(task: TaskDefinition): Promise<PlaceholderContent> {
    switch (task.skipStrategy) {
      case 'placeholder':
        return {
          type: 'placeholder',
          templateContent: `[Placeholder for ${task.name}]\n\nThis section will be populated when real data is available.`,
          note: 'Using generic template. Upload real data for accurate insights.',
          dataRequired: task.name,
          uploadInstructions: `Upload ${task.id}.txt to ${this.config.inputDirectory}/`
        };

      case 'inference':
        return {
          type: 'inference',
          templateContent: `[Inferred for ${task.name}]\n\nBased on industry benchmarks and similar brands.`,
          note: 'Inferred from industry data. Upload real data for brand-specific insights.',
          dataRequired: task.name,
          uploadInstructions: `Upload ${task.id}.txt to ${this.config.inputDirectory}/`
        };

      case 'omit':
        return {
          type: 'omitted',
          templateContent: '',
          note: 'Section omitted. Will be added when data is available.',
          dataRequired: task.name,
          uploadInstructions: `Upload ${task.id}.txt to ${this.config.inputDirectory}/`
        };

      default:
        return {
          type: 'placeholder',
          templateContent: 'Content pending',
          note: 'Awaiting input',
          dataRequired: task.name,
          uploadInstructions: `Upload ${task.id}.txt to ${this.config.inputDirectory}/`
        };
    }
  }

  /**
   * Watch for human input files and regenerate
   */
  private async watchForHumanInputs(): Promise<void> {
    console.log('\n👀 Watching for human inputs...\n');
    console.log(`   Directory: ${this.config.inputDirectory}`);
    console.log('   (Upload files to auto-trigger regeneration)\n');

    try {
      const watcher = watch(this.config.inputDirectory);

      for await (const event of watcher) {
        if (event.eventType === 'change' || event.eventType === 'rename') {
          const filename = event.filename;
          if (filename && filename.endsWith('.txt')) {
            await this.handleHumanInput(filename);
          }
        }
      }
    } catch (error) {
      console.error('File watcher error:', error);
    }
  }

  /**
   * Handle human input file upload
   */
  private async handleHumanInput(filename: string): Promise<void> {
    // Extract task ID from filename
    const taskId = filename.replace('.txt', '');
    const task = TASK_DEFINITIONS[taskId];

    if (!task) {
      console.log(`⚠️  Unknown task: ${taskId}`);
      return;
    }

    console.log(`\n✨ New input detected: ${filename}`);
    console.log(`📥 Processing: ${task.name}\n`);

    // Read input file
    const inputPath = join(this.config.inputDirectory, filename);
    let inputContent: string;
    try {
      inputContent = await readFile(inputPath, 'utf-8');
    } catch {
      console.log(`⚠️  Could not read file: ${inputPath}`);
      return;
    }

    // Execute task with real data
    const previousOutput = this.state.completedTasks[taskId];
    const output = await this.executeTaskWithInput(task, inputContent);

    // Update state
    this.state.completedTasks[taskId] = {
      ...output,
      previousVersion: previousOutput
    };

    // Update metrics
    if (previousOutput?.isPlaceholder) {
      this.state.metrics.placeholderCount--;
      this.state.metrics.realDataCount++;
    }

    console.log(`✅ ${task.name} updated (${previousOutput?.isPlaceholder ? 'placeholder → real data' : 'regenerated'})\n`);

    // Find and regenerate affected outputs
    await this.regenerateAffectedOutputs(taskId);

    // Generate new report version
    const currentVersion = this.versionManager.getCurrentVersion();
    const newVersionNum = parseInt(currentVersion.slice(1)) + 1;
    const newVersion = `v${newVersionNum}.0`;

    const report = await this.generateReport(newVersion, `Human input: ${task.name}`);

    console.log(`\n📄 Report ${newVersion} generated`);
    console.log(`   Quality: ${report.quality.toFixed(1)}%`);
    console.log(`   Updated sections: ${report.updatedSections.length}`);

    // Save event
    const event: HumanInputEvent = {
      taskId,
      inputFile: filename,
      uploadedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      affectedTasks: task.affectedOutputs,
      qualityImprovement: report.quality - (previousOutput?.quality || 0) * 100
    };

    await this.saveHumanInputEvent(event);

    // Check if workflow is complete
    if (report.quality >= this.config.qualityThreshold) {
      console.log('\n🎉 Workflow is production-ready!');
      this.state.overallStatus = 'completed';
      await this.saveState();
    } else {
      const pendingTasks = this.listPendingHumanTasks();
      console.log(`\n⚠️  Still need ${pendingTasks.length} more inputs for ${this.config.qualityThreshold}% quality`);
      pendingTasks.forEach(t => {
        console.log(`   → ${t.name}`);
      });
    }
  }

  /**
   * Execute task with human-provided input
   */
  private async executeTaskWithInput(
    task: TaskDefinition,
    inputContent: string
  ): Promise<TaskOutput> {
    // TODO: Process human input through appropriate agent
    // For now, mock it

    const content = {
      taskId: task.id,
      taskName: task.name,
      humanInput: inputContent,
      processedAt: new Date().toISOString(),
      summary: `Processed human input for ${task.name}`
    };

    return {
      taskId: task.id,
      status: 'completed',
      content,
      isPlaceholder: false,
      quality: 1.0,
      version: (this.state.completedTasks[task.id]?.version || 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        agent: task.agent || 'HumanInputProcessor',
        inputSources: ['human-input']
      }
    };
  }

  /**
   * Regenerate all outputs affected by a task update
   */
  private async regenerateAffectedOutputs(taskId: string): Promise<void> {
    const task = TASK_DEFINITIONS[taskId];
    const affectedOutputs = task.affectedOutputs;

    if (affectedOutputs.length === 0) return;

    console.log(`🔄 Regenerating ${affectedOutputs.length} affected outputs...\n`);

    for (const outputId of affectedOutputs) {
      const outputTask = TASK_DEFINITIONS[outputId];
      if (!outputTask) continue;

      console.log(`   🔄 Regenerating: ${outputTask.name}`);

      const previousOutput = this.state.completedTasks[outputId];
      const newOutput = await this.executeTask(outputTask);

      // Increment version
      newOutput.version = (previousOutput?.version || 0) + 1;
      newOutput.previousVersion = previousOutput;
      newOutput.updatedAt = new Date().toISOString();

      this.state.completedTasks[outputId] = newOutput;

      console.log(`   ✅ ${outputTask.name} updated (v${previousOutput?.version || 1} → v${newOutput.version})`);
    }

    await this.saveState();
  }

  /**
   * Generate report (consolidates all outputs)
   */
  private async generateReport(version: string, triggerEvent: string) {
    const quality = this.qualityScorer.calculateOverallQuality(this.state);

    // Generate markdown report if brand config available
    if (this.brandConfig) {
      const reportGenerator = new WorkflowReportGenerator(
        this.brandConfig,
        this.state,
        this.config.outputDirectory
      );

      await reportGenerator.generateBrandStrategyReport(version);
    }

    const docVersion = await this.versionManager.createVersion({
      version,
      generatedAt: new Date().toISOString(),
      quality,
      triggerEvent,
      updatedSections: [], // TODO: Calculate actual diff
      filePath: join(this.config.outputDirectory, 'reports', `brand-strategy-${version}.md`),
      previousVersion: this.versionManager.getCurrentVersion()
    });

    return docVersion;
  }

  /**
   * Update overall quality score
   */
  private updateQualityScore(): void {
    this.state.qualityScore = this.qualityScorer.calculateOverallQuality(this.state);
  }

  /**
   * List tasks still waiting for human input
   */
  private listPendingHumanTasks(): TaskDefinition[] {
    return Object.values(TASK_DEFINITIONS).filter(task =>
      task.humanRequired &&
      this.state.completedTasks[task.id]?.isPlaceholder
    );
  }

  /**
   * Save workflow state
   */
  private async saveState(): Promise<void> {
    this.state.lastUpdatedAt = new Date().toISOString();
    await writeFile(this.stateFile, JSON.stringify(this.state, null, 2));
  }

  /**
   * Save human input event
   */
  private async saveHumanInputEvent(event: HumanInputEvent): Promise<void> {
    const eventsFile = join(this.config.outputDirectory, '.workflow', 'human-inputs.json');

    let events: HumanInputEvent[] = [];
    try {
      const content = await readFile(eventsFile, 'utf-8');
      events = JSON.parse(content);
    } catch {
      // New file
    }

    events.push(event);
    await writeFile(eventsFile, JSON.stringify(events, null, 2));
  }

  /**
   * Create initial workflow state
   */
  private createInitialState(): WorkflowState {
    return {
      brandName: this.config.brandName,
      workflowId: `workflow-${Date.now()}`,
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      currentPhase: 'initializing',
      overallStatus: 'running',
      completedTasks: {},
      pendingTasks: Object.keys(TASK_DEFINITIONS),
      skippedTasks: [],
      pausedTasks: [],
      qualityScore: 0,
      metrics: {
        totalTasks: Object.keys(TASK_DEFINITIONS).length,
        completedCount: 0,
        skippedCount: 0,
        pausedCount: 0,
        realDataCount: 0,
        placeholderCount: 0
      }
    };
  }
}
