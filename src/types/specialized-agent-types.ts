// Type definitions for specialized brand agents

import type { BrandProfile, BrandStrategy } from './brand-types.js';

/**
 * Content & Copywriting Agent Types
 */
export interface WebsiteCopy {
  homepage: {
    hero: {
      headline: string;
      subheadline: string;
      cta: string;
    };
    features: Array<{
      title: string;
      description: string;
    }>;
    about: string;
  };
  productPages: Array<{
    productName: string;
    description: string;
    features: string[];
    benefits: string[];
  }>;
  aboutUs: {
    story: string;
    mission: string;
    values: string[];
  };
}

export interface EmailTemplates {
  welcome: {
    subject: string;
    preheader: string;
    body: string;
    cta: string;
  };
  orderConfirmation: {
    subject: string;
    body: string;
  };
  promotional: {
    subject: string;
    preheader: string;
    body: string;
    cta: string;
  };
}

export interface ContentCopyOutput {
  brandName: string;
  websiteCopy: WebsiteCopy;
  emailTemplates: EmailTemplates;
  productDescriptions: Array<{
    productName: string;
    shortDescription: string;
    longDescription: string;
    keyFeatures: string[];
  }>;
  seoMetadata: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

/**
 * Social Media Manager Agent Types
 */
export interface SocialPost {
  date: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter';
  postType: 'image' | 'carousel' | 'video' | 'story';
  caption: string;
  hashtags: string[];
  visualGuidance: string;
  callToAction?: string;
}

export interface ContentCalendar {
  brandName: string;
  duration: number; // days
  posts: SocialPost[];
  themes: Array<{
    week: number;
    theme: string;
    focus: string;
  }>;
}

export interface HashtagStrategy {
  branded: string[];
  industry: string[];
  community: string[];
  trending: string[];
}

export interface SocialMediaOutput {
  brandName: string;
  contentCalendar: ContentCalendar;
  hashtagStrategy: HashtagStrategy;
  engagementPlaybook: {
    responseTemplates: string[];
    engagementTactics: string[];
    communityGuidelines: string;
  };
  storyIdeas: Array<{
    title: string;
    description: string;
    visualConcept: string;
  }>;
}

/**
 * Launch Campaign Agent Types
 */
export interface LaunchTimeline {
  totalDuration: string;
  weeks: Array<{
    weekNumber: number;
    focus: string;
    activities: string[];
    deliverables: string[];
  }>;
}

export interface ChannelPlan {
  channel: string;
  objective: string;
  tactics: string[];
  budget?: string;
  kpis: string[];
}

export interface LaunchCampaignOutput {
  brandName: string;
  campaignOverview: {
    objective: string;
    targetAudience: string;
    keyMessage: string;
    duration: string;
  };
  timeline: LaunchTimeline;
  channelPlans: ChannelPlan[];
  creativeAssets: Array<{
    assetType: string;
    description: string;
    specifications: string;
  }>;
  pressRelease: {
    headline: string;
    subheadline: string;
    body: string;
    boilerplate: string;
    contacts: string;
  };
  launchDayChecklist: Array<{
    time: string;
    task: string;
    owner: string;
    priority: 'critical' | 'high' | 'medium';
  }>;
  influencerOutreach: {
    targetProfiles: string[];
    outreachScript: string;
    partnershipGuidelines: string;
  };
}

/**
 * Agent Audit Types
 */
export interface AgentAuditScore {
  dimension: string;
  score: number; // 0-10
  weight: number;
  weightedScore: number;
  notes: string;
}

export interface AgentAuditReport {
  agentName: string;
  brandName: string;
  dateAudited: string;
  overallScore: number;
  category: 'Exceptional' | 'Strong' | 'Adequate' | 'Needs Work' | 'Insufficient';
  scores: AgentAuditScore[];
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  integrationStatus: {
    usesStrategyInputs: boolean;
    referencesResearchDatabase: boolean;
    citesDeliverableNumbers: boolean;
    maintainsBrandConsistency: boolean;
    linksToProjectTracker: boolean;
  };
  productionReadiness: {
    readyForImmediateUse: boolean;
    additionalWorkNeeded: string;
    requiredExpertise: string;
  };
  verdict: 'PASS' | 'NEEDS_IMPROVEMENT' | 'FAIL';
}

/**
 * Specialized Agent Input (from horizon-brand-builder)
 */
export interface AgentInput {
  brandProfile: BrandProfile;
  brandStrategy?: BrandStrategy;
  researchFindings?: any;
  deliverables?: Record<string, any>;
  customInstructions?: string;
}
