// Workflow and template types

import type { BrandType } from './brand-types.js';

export interface WorkflowPhase {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  description: string;
  type: 'research' | 'analysis' | 'synthesis' | 'generation';
  output: string;
}

export interface WorkflowTemplate {
  brandType: BrandType;
  phases: WorkflowPhase[];
  researchFocus: string[];
  auditEmphasis: string[];
  strategyPriorities: string[];
  uniqueDeliverables: string[];
}

export interface BrandTypeConfig {
  name: string;
  description: string;
  researchFocus: string[];
  auditDimensions: string[];
  strategyPriorities: string[];
  uniqueDeliverables: string[];
}

export interface DiscoveryQuestion {
  id: string;
  question: string;
  type: 'text' | 'choice' | 'multiChoice';
  options?: string[];
  required: boolean;
}

export interface DiscoveryQuestions {
  universal: DiscoveryQuestion[];
  brandTypeSpecific: Record<BrandType, DiscoveryQuestion[]>;
}
