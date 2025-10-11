// Example: B2B SaaS brand configuration
// This serves as a template for B2B SaaS / Cloud infrastructure brands

import type { BrandConfiguration } from '../../types/project-types.js';

export const SAAS_BRAND_CONFIG: BrandConfiguration = {
  // Basic info
  brandName: 'CloudSync Pro',
  industry: 'B2B SaaS',
  category: 'Cloud Infrastructure Management',

  // Company details
  companyProfile: {
    founded: 2022,
    currentRevenue: '$5M ARR',
    channels: ['Direct Sales', 'Self-Service SaaS', 'Partner Channel'],
    website: 'www.cloudsyncpro.com',
    employees: 45,
    headquarters: 'San Francisco, CA',
  },

  // Project objectives
  projectObjectives: {
    primary:
      'Establish CloudSync Pro as the leading cloud infrastructure management platform for mid-market enterprises',
    goals: [
      'Differentiate from infrastructure giants (AWS, Azure, GCP native tools)',
      'Build trust with enterprise IT decision makers',
      'Simplify complex technical value proposition',
      'Create scalable go-to-market brand assets',
      'Position as the "easy button" for multi-cloud management',
    ],
    successMetrics: [
      'Brand awareness in target ICP (IT Directors, CTOs) - 30% in 12 months',
      'Inbound demo requests increase by 50%',
      'Sales cycle reduction by 20%',
      'Partner channel growth (10+ integration partners)',
    ],
  },

  // Competitors
  competitors: [
    { name: 'Datadog', category: 'enterprise', positioning: 'Monitoring and observability leader' },
    { name: 'New Relic', category: 'enterprise', positioning: 'Full-stack observability platform' },
    { name: 'PagerDuty', category: 'mid-market', positioning: 'Incident management focus' },
    { name: 'Splunk', category: 'enterprise', positioning: 'Data analytics and monitoring' },
    {
      name: 'AWS CloudWatch',
      category: 'enterprise',
      positioning: 'Native AWS monitoring (threat)',
    },
  ],

  // Target audience
  targetAudience: [
    'IT Directors and CTOs (mid-market companies, 500-5000 employees)',
    'DevOps Engineers and Platform Teams',
    'Cloud Architects',
    'IT Operations Managers',
  ],

  // Market segments
  marketSegments: [
    'Financial Services (primary)',
    'Healthcare Tech (secondary)',
    'E-commerce and Retail Tech (tertiary)',
  ],

  // Additional context
  additionalContext:
    'CloudSync Pro has strong product-market fit with mid-market enterprises but lacks brand differentiation in a crowded market. Need to establish thought leadership and trust while simplifying the technical message for executive buyers.',
};
