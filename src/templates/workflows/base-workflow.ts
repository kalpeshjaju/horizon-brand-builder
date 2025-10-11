// Base workflow template (universal for all brand types)

import type { WorkflowTemplate, WorkflowPhase } from '../../types/workflow-types.js';
import type { BrandType } from '../../types/brand-types.js';

export function createBaseWorkflow(brandType: BrandType): WorkflowTemplate {
  const phases: WorkflowPhase[] = [
    {
      id: 'discovery',
      name: 'Discovery',
      description: 'Understand brand context and classify type',
      estimatedTime: '15-20 minutes',
      tasks: [
        {
          id: 'intake',
          description: 'Gather basic brand information',
          type: 'research',
          output: 'BrandProfile',
        },
        {
          id: 'classification',
          description: 'Auto-detect brand type from answers',
          type: 'analysis',
          output: 'BrandType',
        },
        {
          id: 'workflow_selection',
          description: 'Load appropriate template with customizations',
          type: 'synthesis',
          output: 'ActiveWorkflow',
        },
      ],
    },
    {
      id: 'research',
      name: 'Research',
      description: 'Deep dive into brand ecosystem',
      estimatedTime: '30-45 minutes',
      tasks: [
        {
          id: 'market_research',
          description: 'Industry trends, competitor landscape, market positioning',
          type: 'research',
          output: 'MarketInsights',
        },
        {
          id: 'audience_research',
          description: 'Customer personas, pain points, desires',
          type: 'research',
          output: 'AudienceProfile',
        },
        {
          id: 'brand_context',
          description: 'Existing assets, brand story, unique value proposition',
          type: 'research',
          output: 'BrandDNA',
        },
        {
          id: 'synthesis',
          description: 'Combine all research into unified insights',
          type: 'synthesis',
          output: 'ResearchReport',
        },
      ],
    },
    {
      id: 'audit',
      name: 'Audit',
      description: 'Assess current state and identify gaps',
      estimatedTime: '20-30 minutes',
      tasks: [
        {
          id: 'visual_audit',
          description: 'Evaluate visual identity elements',
          type: 'analysis',
          output: 'VisualAuditDimension',
        },
        {
          id: 'messaging_audit',
          description: 'Assess voice, tone, and positioning',
          type: 'analysis',
          output: 'MessagingAuditDimension',
        },
        {
          id: 'experience_audit',
          description: 'Analyze customer touchpoints and experience',
          type: 'analysis',
          output: 'ExperienceAuditDimension',
        },
        {
          id: 'competitive_audit',
          description: 'Compare against key competitors',
          type: 'analysis',
          output: 'CompetitiveAuditDimension',
        },
        {
          id: 'audit_synthesis',
          description: 'Generate scorecard and gap analysis',
          type: 'synthesis',
          output: 'AuditReport',
        },
      ],
    },
    {
      id: 'strategy',
      name: 'Strategy Development',
      description: 'Build comprehensive brand framework',
      estimatedTime: '45-60 minutes',
      tasks: [
        {
          id: 'foundation',
          description: 'Define purpose, vision, mission, values',
          type: 'generation',
          output: 'BrandFoundation',
        },
        {
          id: 'positioning',
          description: 'Develop strategic market positioning',
          type: 'generation',
          output: 'BrandPositioning',
        },
        {
          id: 'personality',
          description: 'Create brand personality and voice',
          type: 'generation',
          output: 'BrandPersonality',
        },
        {
          id: 'visual_direction',
          description: 'Establish visual strategy and principles',
          type: 'generation',
          output: 'VisualDirection',
        },
        {
          id: 'messaging',
          description: 'Build messaging framework and narratives',
          type: 'generation',
          output: 'MessagingFramework',
        },
        {
          id: 'activation',
          description: 'Plan touchpoints and experience strategy',
          type: 'generation',
          output: 'ActivationStrategy',
        },
        {
          id: 'roadmap',
          description: 'Create implementation roadmap',
          type: 'generation',
          output: 'ImplementationRoadmap',
        },
      ],
    },
  ];

  return {
    brandType,
    phases,
    researchFocus: [],
    auditEmphasis: [],
    strategyPriorities: [],
    uniqueDeliverables: [],
  };
}
