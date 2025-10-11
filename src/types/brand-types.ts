// Core brand type definitions

export type BrandType =
  | 'b2c_consumer'
  | 'b2b_enterprise'
  | 'luxury_premium'
  | 'personal_brand'
  | 'startup_disruptor'
  | 'ecommerce_fashion'
  | 'saas_b2b';

export type BusinessStage = 'startup' | 'growth' | 'established' | 'rebrand';

export type BrandGoal = 'launch' | 'refresh' | 'reposition' | 'scale';

export interface BrandProfile {
  brandName: string;
  industry: string;
  targetAudience: string;
  businessStage: BusinessStage;
  primaryGoal: BrandGoal;
  brandType: BrandType;
  website?: string;
  additionalContext?: string;
}

export interface MarketInsights {
  industryTrends: string[];
  competitorLandscape: CompetitorAnalysis[];
  marketOpportunities: string[];
  keyFindings: string[];
}

export interface CompetitorAnalysis {
  name: string;
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  differentiationOpportunity: string;
}

export interface AudienceProfile {
  personas: CustomerPersona[];
  painPoints: string[];
  desires: string[];
  decisionFactors: string[];
}

export interface CustomerPersona {
  name: string;
  demographics: string;
  psychographics: string;
  goals: string[];
  challenges: string[];
  buyingBehavior: string;
}

export interface BrandDNA {
  uniqueValueProposition: string;
  brandStory: string;
  coreStrengths: string[];
  brandHeritage?: string;
  founderStory?: string;
}

export interface ResearchReport {
  marketInsights: MarketInsights;
  audienceProfile: AudienceProfile;
  brandDNA: BrandDNA;
  synthesisNotes: string;
}

export interface AuditDimension {
  dimension: string;
  score: number; // 0-10
  findings: string[];
  gaps: string[];
  opportunities: string[];
}

export interface AuditReport {
  visualAudit: AuditDimension;
  messagingAudit: AuditDimension;
  experienceAudit: AuditDimension;
  competitiveAudit: AuditDimension;
  overallScore: number;
  topOpportunities: string[];
  quickWins: string[];
}

export interface BrandFoundation {
  purpose: string;
  vision: string;
  mission: string;
  values: string[];
}

export interface BrandPositioning {
  targetAudience: string;
  marketPosition: string;
  differentiation: string[];
  proofPoints: string[];
}

export interface BrandPersonality {
  primaryArchetype: string;
  secondaryArchetype?: string;
  traits: string[];
  voiceAndTone: {
    voice: string;
    toneAttributes: string[];
    examples: string[];
  };
}

export interface VisualDirection {
  designPrinciples: string[];
  colorStrategy: {
    psychology: string;
    paletteDirection: string[];
  };
  typographyStrategy: string;
  imageryGuidelines: string[];
}

export interface MessagingFramework {
  elevatorPitch: {
    fifteenSecond: string;
    thirtySecond: string;
    sixtySecond: string;
  };
  keyMessages: string[];
  taglineOptions: string[];
  brandStoryNarrative: string;
}

export interface ActivationStrategy {
  primaryChannels: string[];
  contentPillars: string[];
  experienceMap: string[];
}

export interface ImplementationRoadmap {
  quickWins: RoadmapPhase;
  coreBuild: RoadmapPhase;
  scale: RoadmapPhase;
  successMetrics: string[];
}

export interface RoadmapPhase {
  timeline: string;
  initiatives: string[];
  deliverables: string[];
}

export interface BrandStrategy {
  foundation: BrandFoundation;
  positioning: BrandPositioning;
  personality: BrandPersonality;
  visualDirection: VisualDirection;
  messagingFramework: MessagingFramework;
  activationStrategy: ActivationStrategy;
  implementationRoadmap: ImplementationRoadmap;
}

export interface BrandDesignOutput {
  metadata: {
    brandName: string;
    brandType: BrandType;
    dateCreated: string;
    workflowVersion: string;
  };
  brandProfile: BrandProfile;
  researchReport: ResearchReport;
  auditReport: AuditReport;
  brandStrategy: BrandStrategy;
}
