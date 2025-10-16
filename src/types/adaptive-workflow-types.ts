// Adaptive Workflow Types - Task-based with skip & regeneration capabilities

export type TaskStatus = 'pending' | 'running' | 'completed' | 'skipped' | 'paused' | 'failed';

export type SkipStrategy = 'placeholder' | 'inference' | 'omit';

export interface TaskDefinition {
  id: string;
  name: string;
  description: string;
  dependencies: string[];
  humanRequired: boolean;
  canSkip: boolean;
  skipStrategy?: SkipStrategy;
  agent?: string;
  estimatedDuration?: string;
  affectedOutputs: string[];
  category: 'research' | 'synthesis' | 'strategy' | 'execution' | 'documentation';
}

export interface TaskOutput {
  taskId: string;
  status: TaskStatus;
  content: unknown;
  isPlaceholder: boolean;
  quality: number; // 0-1 score
  version: number;
  createdAt: string;
  updatedAt?: string;
  previousVersion?: TaskOutput;
  metadata: {
    executionTime?: number;
    agent?: string;
    inputSources: string[];
    note?: string;
    confidence?: number; // 0-1 confidence score
    sources?: string[]; // Source URLs/references
    artifacts?: string[]; // Generated file names
  };
}

export interface WorkflowState {
  brandName: string;
  workflowId: string;
  startedAt: string;
  lastUpdatedAt: string;
  currentPhase: string;
  overallStatus: 'initializing' | 'running' | 'paused' | 'completed' | 'failed';
  completedTasks: Record<string, TaskOutput>;
  pendingTasks: string[];
  skippedTasks: string[];
  pausedTasks: string[];
  qualityScore: number; // Overall quality 0-100
  metrics: {
    totalTasks: number;
    completedCount: number;
    skippedCount: number;
    pausedCount: number;
    realDataCount: number;
    placeholderCount: number;
  };
}

export interface DocumentVersion {
  version: string;
  generatedAt: string;
  quality: number;
  triggerEvent: string;
  updatedSections: SectionUpdate[];
  filePath: string;
  previousVersion?: string;
}

export interface SectionUpdate {
  id: string;
  name: string;
  oldContent?: string;
  newContent: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  changedFields: string[];
}

export interface HumanInputEvent {
  taskId: string;
  inputFile: string;
  uploadedAt: string;
  processedAt?: string;
  affectedTasks: string[];
  qualityImprovement: number;
}

export interface RegenerationPlan {
  triggeredBy: string;
  affectedOutputs: string[];
  estimatedTime: string;
  expectedQualityChange: number;
  tasks: {
    taskId: string;
    currentVersion: number;
    newVersion: number;
    regenerationReason: string;
  }[];
}

export interface WorkflowConfig {
  brandName: string;
  enableAutoRegeneration: boolean;
  qualityThreshold: number; // Minimum quality to consider "production-ready"
  watchForInputs: boolean;
  inputDirectory: string;
  outputDirectory: string;
  versioningEnabled: boolean;
  maxVersionsToKeep: number;
}

export interface TaskExecutionContext {
  taskId: string;
  inputs: Record<string, TaskOutput>;
  brandConfig: unknown;
  workflowState: WorkflowState;
  isRegeneration: boolean;
}

export interface PlaceholderContent {
  type: 'placeholder' | 'inference' | 'omitted';
  templateContent: string;
  note: string;
  dataRequired: string;
  uploadInstructions: string;
}

export interface QualityReport {
  overallQuality: number;
  breakdown: {
    sectionId: string;
    sectionName: string;
    quality: number;
    status: 'complete' | 'placeholder' | 'inference' | 'partial';
    missingData?: string[];
  }[];
  recommendations: {
    action: string;
    expectedImprovement: number;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export interface DependencyGraph {
  nodes: Map<string, TaskDefinition>;
  edges: Map<string, string[]>; // taskId -> dependent taskIds
  executionOrder: string[][];    // Batches of tasks that can run in parallel
}
