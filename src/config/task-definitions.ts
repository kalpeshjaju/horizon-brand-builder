// Task Definitions - Complete brand strategy workflow
// Maps to Kalpesh's 8-stage task list

import type { TaskDefinition } from '../types/adaptive-workflow-types.js';

export const TASK_DEFINITIONS: Record<string, TaskDefinition> = {

  // ============================================================================
  // STAGE 1: PROJECT SETUP
  // ============================================================================

  'project-setup': {
    id: 'project-setup',
    name: 'Project Setup & Infrastructure',
    description: 'Set up project infrastructure, shared drives, tracking systems',
    dependencies: [],
    humanRequired: false,
    canSkip: false,
    agent: 'ProjectSetupAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['project-dashboard'],
    category: 'research'
  },

  'stakeholder-interviews': {
    id: 'stakeholder-interviews',
    name: 'Stakeholder Interviews (CEO + Team)',
    description: 'Conduct interviews with CEO, founders, and key stakeholders',
    dependencies: ['project-setup'],
    humanRequired: true,
    canSkip: true,
    skipStrategy: 'placeholder',
    estimatedDuration: '1-2 weeks',
    affectedOutputs: [
      'stakeholder-synthesis',
      'brand-audit-report',
      'positioning-options',
      'brand-framework'
    ],
    category: 'research'
  },

  'brand-asset-collection': {
    id: 'brand-asset-collection',
    name: 'Brand Asset Collection & Audit',
    description: 'Gather and catalog existing brand materials, logos, packaging, guidelines',
    dependencies: ['project-setup'],
    humanRequired: false,
    canSkip: false,
    agent: 'BrandAssetAgent',
    estimatedDuration: '2-3 days',
    affectedOutputs: ['brand-audit-report', 'visual-audit'],
    category: 'research'
  },

  'touchpoint-mapping': {
    id: 'touchpoint-mapping',
    name: 'Customer Touchpoint Mapping',
    description: 'Map all customer touchpoints (digital, physical, service)',
    dependencies: ['project-setup'],
    humanRequired: false,
    canSkip: false,
    agent: 'TouchpointMappingAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['customer-journey-map', 'brand-audit-report'],
    category: 'research'
  },

  // ============================================================================
  // STAGE 2: COMPETITIVE ANALYSIS
  // ============================================================================

  'competitive-analysis': {
    id: 'competitive-analysis',
    name: 'Competitive Analysis (15 competitors)',
    description: 'Deep dive on 15 competitors across premium, mass market, D2C, international',
    dependencies: ['project-setup'],
    humanRequired: false,
    canSkip: false,
    agent: 'CompetitiveResearchAgent',
    estimatedDuration: '3-4 days',
    affectedOutputs: [
      'brand-audit-report',
      'positioning-map',
      'whitespace-analysis',
      'positioning-options'
    ],
    category: 'research'
  },

  'pricing-analysis': {
    id: 'pricing-analysis',
    name: 'Pricing Analysis',
    description: 'Price mapping across channels, SKUs, and competitors',
    dependencies: ['competitive-analysis', 'touchpoint-mapping'],
    humanRequired: false,
    canSkip: false,
    agent: 'PricingAnalysisAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['brand-audit-report', 'pricing-strategy'],
    category: 'research'
  },

  'packaging-audit': {
    id: 'packaging-audit',
    name: 'Packaging Audit',
    description: 'Photograph and analyze competitor packaging systems',
    dependencies: ['competitive-analysis'],
    humanRequired: true,
    canSkip: true,
    skipStrategy: 'omit',
    estimatedDuration: '1 week',
    affectedOutputs: ['visual-audit', 'brand-audit-report'],
    category: 'research'
  },

  'communication-analysis': {
    id: 'communication-analysis',
    name: 'Communication Analysis',
    description: 'Review competitor advertising, social content, messaging',
    dependencies: ['competitive-analysis'],
    humanRequired: false,
    canSkip: false,
    agent: 'CommunicationAnalysisAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['brand-audit-report', 'messaging-framework'],
    category: 'research'
  },

  'positioning-map': {
    id: 'positioning-map',
    name: 'Positioning Map Creation',
    description: 'Create 2x2 matrices showing competitive positions',
    dependencies: ['competitive-analysis', 'pricing-analysis'],
    humanRequired: false,
    canSkip: false,
    agent: 'PositioningMapAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['brand-audit-report', 'positioning-options'],
    category: 'synthesis'
  },

  'whitespace-analysis': {
    id: 'whitespace-analysis',
    name: 'Whitespace Analysis',
    description: 'Identify unoccupied positioning territories',
    dependencies: ['positioning-map'],
    humanRequired: false,
    canSkip: false,
    agent: 'WhitespaceAnalysisAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['brand-audit-report', 'positioning-options'],
    category: 'synthesis'
  },

  // ============================================================================
  // STAGE 3: CUSTOMER RESEARCH
  // ============================================================================

  'customer-survey-design': {
    id: 'customer-survey-design',
    name: 'Customer Survey Design',
    description: 'Create quantitative survey questionnaire',
    dependencies: ['project-setup'],
    humanRequired: false,
    canSkip: false,
    agent: 'SurveyDesignAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['customer-surveys'],
    category: 'research'
  },

  'customer-surveys': {
    id: 'customer-surveys',
    name: 'Customer Surveys (500 responses)',
    description: 'Launch surveys to current customers (300) and potential customers (200)',
    dependencies: ['customer-survey-design'],
    humanRequired: true,
    canSkip: true,
    skipStrategy: 'inference',
    estimatedDuration: '2-3 weeks',
    affectedOutputs: [
      'customer-synthesis',
      'personas',
      'brand-audit-report',
      'customer-journey-map'
    ],
    category: 'research'
  },

  'customer-interviews': {
    id: 'customer-interviews',
    name: 'Qualitative Customer Interviews (20 interviews)',
    description: 'Conduct 20 in-depth interviews (1 hour each)',
    dependencies: ['customer-survey-design'],
    humanRequired: true,
    canSkip: true,
    skipStrategy: 'inference',
    estimatedDuration: '2-3 weeks',
    affectedOutputs: [
      'customer-synthesis',
      'personas',
      'brand-audit-report',
      'positioning-options'
    ],
    category: 'research'
  },

  'mystery-shopping': {
    id: 'mystery-shopping',
    name: 'Mystery Shopping',
    description: 'Visit stores as customers, test experience',
    dependencies: ['touchpoint-mapping'],
    humanRequired: true,
    canSkip: true,
    skipStrategy: 'omit',
    estimatedDuration: '1 week',
    affectedOutputs: ['customer-journey-map', 'brand-audit-report'],
    category: 'research'
  },

  'digital-journey-audit': {
    id: 'digital-journey-audit',
    name: 'Digital Journey Audit',
    description: 'Test website, app, marketplace experiences',
    dependencies: ['touchpoint-mapping'],
    humanRequired: false,
    canSkip: false,
    agent: 'DigitalAuditAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['customer-journey-map', 'brand-audit-report'],
    category: 'research'
  },

  'social-listening': {
    id: 'social-listening',
    name: 'Social Listening',
    description: 'Monitor brand mentions and competitor mentions',
    dependencies: ['competitive-analysis'],
    humanRequired: false,
    canSkip: false,
    agent: 'SocialListeningAgent',
    estimatedDuration: '3-5 days',
    affectedOutputs: ['brand-audit-report', 'customer-synthesis'],
    category: 'research'
  },

  // ============================================================================
  // STAGE 4: SYNTHESIS & AUDIT
  // ============================================================================

  'stakeholder-synthesis': {
    id: 'stakeholder-synthesis',
    name: 'Stakeholder Insights Synthesis',
    description: 'Consolidate internal perspective themes',
    dependencies: ['stakeholder-interviews'],
    humanRequired: false,
    canSkip: false,
    agent: 'SynthesisAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['brand-audit-report', 'positioning-options'],
    category: 'synthesis'
  },

  'customer-synthesis': {
    id: 'customer-synthesis',
    name: 'Customer Research Synthesis',
    description: 'Synthesize survey, interview, and behavioral data',
    dependencies: ['customer-surveys', 'customer-interviews', 'social-listening'],
    humanRequired: false,
    canSkip: false,
    agent: 'CustomerSynthesisAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['brand-audit-report', 'personas', 'customer-journey-map'],
    category: 'synthesis'
  },

  'customer-journey-map': {
    id: 'customer-journey-map',
    name: 'Customer Journey Map',
    description: 'Create current state customer experience map',
    dependencies: [
      'touchpoint-mapping',
      'customer-synthesis',
      'digital-journey-audit'
    ],
    humanRequired: false,
    canSkip: false,
    agent: 'JourneyMappingAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['brand-audit-report'],
    category: 'synthesis'
  },

  'pain-points-analysis': {
    id: 'pain-points-analysis',
    name: 'Pain Points & Unmet Needs',
    description: 'Document unmet needs and friction points',
    dependencies: ['customer-synthesis', 'customer-journey-map'],
    humanRequired: false,
    canSkip: false,
    agent: 'PainPointsAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['brand-audit-report', 'opportunity-matrix'],
    category: 'synthesis'
  },

  'trend-analysis': {
    id: 'trend-analysis',
    name: 'Category Trends Analysis',
    description: 'Analyze category trends and future opportunities',
    dependencies: ['competitive-analysis', 'social-listening'],
    humanRequired: false,
    canSkip: false,
    agent: 'TrendAnalysisAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['brand-audit-report', 'opportunity-matrix'],
    category: 'synthesis'
  },

  'opportunity-matrix': {
    id: 'opportunity-matrix',
    name: 'Opportunity Matrix',
    description: 'Create 2x2 impact vs effort opportunities',
    dependencies: ['pain-points-analysis', 'trend-analysis', 'whitespace-analysis'],
    humanRequired: false,
    canSkip: false,
    agent: 'OpportunityMatrixAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['brand-audit-report'],
    category: 'synthesis'
  },

  'brand-audit-report': {
    id: 'brand-audit-report',
    name: 'Brand Audit Report (50-70 pages)',
    description: 'Comprehensive brand audit synthesizing all research',
    dependencies: [
      'stakeholder-synthesis',
      'competitive-analysis',
      'customer-synthesis',
      'customer-journey-map',
      'opportunity-matrix',
      'brand-asset-collection'
    ],
    humanRequired: false,
    canSkip: false,
    agent: 'BrandAuditAgent',
    estimatedDuration: '3-4 days',
    affectedOutputs: ['positioning-options', 'brand-framework', 'final-strategy'],
    category: 'documentation'
  },

  // ============================================================================
  // STAGE 5: STRATEGIC FOUNDATION
  // ============================================================================

  'positioning-options': {
    id: 'positioning-options',
    name: 'Positioning Territories (3 options)',
    description: 'Develop 3 distinct strategic positioning options',
    dependencies: ['brand-audit-report'],
    humanRequired: false,
    canSkip: false,
    agent: 'PositioningStrategyAgent',
    estimatedDuration: '3 days',
    affectedOutputs: ['client-workshop-materials', 'brand-framework'],
    category: 'strategy'
  },

  'purpose-statements': {
    id: 'purpose-statements',
    name: 'Purpose Statements (3 options)',
    description: 'Write purpose statements for each positioning territory',
    dependencies: ['positioning-options'],
    humanRequired: false,
    canSkip: false,
    agent: 'BrandFoundationAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['client-workshop-materials', 'brand-framework'],
    category: 'strategy'
  },

  'vision-statements': {
    id: 'vision-statements',
    name: 'Vision Statements (10-year)',
    description: 'Create 10-year vision for each strategic option',
    dependencies: ['positioning-options'],
    humanRequired: false,
    canSkip: false,
    agent: 'BrandFoundationAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['client-workshop-materials', 'brand-framework'],
    category: 'strategy'
  },

  'mission-statements': {
    id: 'mission-statements',
    name: 'Mission Statements',
    description: 'Define how to achieve vision for each option',
    dependencies: ['vision-statements'],
    humanRequired: false,
    canSkip: false,
    agent: 'BrandFoundationAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['client-workshop-materials', 'brand-framework'],
    category: 'strategy'
  },

  'core-values': {
    id: 'core-values',
    name: 'Core Values & Beliefs',
    description: 'Articulate core beliefs for each strategic territory',
    dependencies: ['positioning-options'],
    humanRequired: false,
    canSkip: false,
    agent: 'BrandFoundationAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['client-workshop-materials', 'brand-framework'],
    category: 'strategy'
  },

  'client-workshop-materials': {
    id: 'client-workshop-materials',
    name: 'Client Workshop Materials',
    description: 'Prepare materials for strategic direction decision workshop',
    dependencies: [
      'positioning-options',
      'purpose-statements',
      'vision-statements',
      'mission-statements',
      'core-values'
    ],
    humanRequired: false,
    canSkip: false,
    agent: 'WorkshopPreparationAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['client-workshop-decision'],
    category: 'documentation'
  },

  'client-workshop-decision': {
    id: 'client-workshop-decision',
    name: 'Client Workshop Decision',
    description: 'Facilitate workshop and capture strategic direction decision',
    dependencies: ['client-workshop-materials'],
    humanRequired: true,
    canSkip: true,
    skipStrategy: 'placeholder',
    estimatedDuration: '1 week',
    affectedOutputs: [
      'brand-framework',
      'personas',
      'brand-architecture',
      'messaging-framework',
      'final-strategy'
    ],
    category: 'strategy'
  },

  // ============================================================================
  // STAGE 6: TARGET AUDIENCE & ARCHITECTURE
  // ============================================================================

  'personas': {
    id: 'personas',
    name: 'Customer Personas (4 personas)',
    description: 'Develop detailed personas: health-conscious, gift buyer, families, B2B',
    dependencies: ['customer-synthesis', 'client-workshop-decision'],
    humanRequired: false,
    canSkip: false,
    agent: 'PersonaDevelopmentAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['messaging-framework', 'brand-framework'],
    category: 'strategy'
  },

  'brand-architecture': {
    id: 'brand-architecture',
    name: 'Brand Architecture',
    description: 'Design future brand architecture (master brand + sub-brands)',
    dependencies: ['client-workshop-decision'],
    humanRequired: false,
    canSkip: false,
    agent: 'BrandArchitectureAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['brand-framework', 'final-strategy'],
    category: 'strategy'
  },

  'product-line-roles': {
    id: 'product-line-roles',
    name: 'Product Line Roles',
    description: 'Define product line roles: lead, sustain, trial, value products',
    dependencies: ['brand-architecture'],
    humanRequired: false,
    canSkip: false,
    agent: 'ProductStrategyAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['brand-framework', 'final-strategy'],
    category: 'strategy'
  },

  // ============================================================================
  // STAGE 7: BRAND FRAMEWORK
  // ============================================================================

  'brand-personality': {
    id: 'brand-personality',
    name: 'Brand Personality',
    description: 'Finalize 5-6 personality traits with descriptions',
    dependencies: ['client-workshop-decision', 'personas'],
    humanRequired: false,
    canSkip: false,
    agent: 'BrandPersonalityAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['brand-framework', 'messaging-framework'],
    category: 'strategy'
  },

  'brand-pyramid': {
    id: 'brand-pyramid',
    name: 'Brand Pyramid',
    description: 'Create hierarchical brand framework',
    dependencies: ['brand-personality'],
    humanRequired: false,
    canSkip: false,
    agent: 'BrandFrameworkAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['brand-framework'],
    category: 'strategy'
  },

  'pricing-strategy': {
    id: 'pricing-strategy',
    name: 'Pricing Strategy Framework',
    description: 'Develop premium pricing justification ladder',
    dependencies: ['pricing-analysis', 'client-workshop-decision'],
    humanRequired: false,
    canSkip: false,
    agent: 'PricingStrategyAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['brand-framework', 'final-strategy'],
    category: 'strategy'
  },

  'brand-manifesto': {
    id: 'brand-manifesto',
    name: 'Brand Manifesto',
    description: 'Write one-page inspirational brand declaration',
    dependencies: ['brand-personality', 'brand-pyramid'],
    humanRequired: false,
    canSkip: false,
    agent: 'BrandManifestoAgent',
    estimatedDuration: '1 day',
    affectedOutputs: ['brand-framework', 'final-strategy'],
    category: 'documentation'
  },

  'messaging-framework': {
    id: 'messaging-framework',
    name: 'Messaging Hierarchy',
    description: 'Create key messages by audience',
    dependencies: ['brand-personality', 'personas'],
    humanRequired: false,
    canSkip: false,
    agent: 'MessagingAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['brand-framework', 'final-strategy'],
    category: 'strategy'
  },

  'brand-framework': {
    id: 'brand-framework',
    name: 'Complete Brand Framework',
    description: 'Consolidate all brand framework components',
    dependencies: [
      'brand-personality',
      'brand-pyramid',
      'pricing-strategy',
      'brand-manifesto',
      'messaging-framework',
      'brand-architecture',
      'personas'
    ],
    humanRequired: false,
    canSkip: false,
    agent: 'BrandFrameworkAgent',
    estimatedDuration: '2 days',
    affectedOutputs: ['final-strategy'],
    category: 'documentation'
  },

  // ============================================================================
  // STAGE 8: DOCUMENTATION & DELIVERABLES
  // ============================================================================

  'final-strategy': {
    id: 'final-strategy',
    name: 'Complete Strategy Document (100+ pages)',
    description: 'Write comprehensive strategy document',
    dependencies: ['brand-framework', 'brand-audit-report'],
    humanRequired: false,
    canSkip: false,
    agent: 'StrategyDocumentAgent',
    estimatedDuration: '3-5 days',
    affectedOutputs: ['executive-summary', 'presentation-deck'],
    category: 'documentation'
  },

  'executive-summary': {
    id: 'executive-summary',
    name: 'Executive Summary (2 pages)',
    description: 'Create 2-page strategy overview',
    dependencies: ['final-strategy'],
    humanRequired: false,
    canSkip: false,
    agent: 'ExecutiveSummaryAgent',
    estimatedDuration: '1 day',
    affectedOutputs: [],
    category: 'documentation'
  },

  'presentation-deck': {
    id: 'presentation-deck',
    name: 'Presentation Deck',
    description: 'Design visual strategy presentation',
    dependencies: ['final-strategy'],
    humanRequired: false,
    canSkip: false,
    agent: 'PresentationAgent',
    estimatedDuration: '2-3 days',
    affectedOutputs: [],
    category: 'documentation'
  },

  'phase2-recommendations': {
    id: 'phase2-recommendations',
    name: 'Phase 2 Recommendations',
    description: 'Outline next steps, timeline, and budget',
    dependencies: ['final-strategy'],
    humanRequired: false,
    canSkip: false,
    agent: 'Phase2PlanningAgent',
    estimatedDuration: '1 day',
    affectedOutputs: [],
    category: 'documentation'
  }
};

// Get all task IDs in a specific category
export function getTasksByCategory(category: TaskDefinition['category']): TaskDefinition[] {
  return Object.values(TASK_DEFINITIONS).filter(task => task.category === category);
}

// Get all tasks that require human input
export function getHumanRequiredTasks(): TaskDefinition[] {
  return Object.values(TASK_DEFINITIONS).filter(task => task.humanRequired);
}

// Get all tasks that can be skipped
export function getSkippableTasks(): TaskDefinition[] {
  return Object.values(TASK_DEFINITIONS).filter(task => task.canSkip);
}

// Count total tasks
export const TOTAL_TASKS = Object.keys(TASK_DEFINITIONS).length;
