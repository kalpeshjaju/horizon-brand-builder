// Example: Flyberry Gourmet brand configuration
// This serves as a template for Food & Beverage / Gourmet brands

import type { BrandConfiguration } from '../../types/project-types.js';

export const FLYBERRY_BRAND_CONFIG: BrandConfiguration = {
  // Basic info
  brandName: 'Flyberry Gourmet',
  industry: 'Food & Beverage',
  category: 'Premium Dry Fruits, Nuts, and Gourmet Foods',

  // Company details
  companyProfile: {
    founded: 2017,
    currentRevenue: '₹50 Crores',
    channels: ['D2C', 'Offline Retail', 'Quick Commerce', 'B2B'],
    stores: 4,
    website: 'www.flyberry.in',
  },

  // Project objectives
  projectObjectives: {
    primary:
      'Transform Flyberry from an operations-driven business into a distinctive, premium lifestyle brand',
    goals: [
      'Establish clear brand positioning that differentiates from competitors',
      'Create cohesive brand identity system across all touchpoints',
      'Develop brand architecture that supports premium pricing and expansion',
      'Build emotional connection beyond functional benefits',
      'Create scalable brand assets and guidelines for consistent execution',
    ],
    successMetrics: [
      'Brand awareness increase of 40% in target segments',
      'Premium price point acceptance (₹500-1000/product)',
      'Customer loyalty and repeat purchase rate improvement',
      'Consistent brand experience across all channels',
    ],
  },

  // Competitors
  competitors: [
    { name: 'Nutraj', category: 'premium', positioning: 'Traditional premium dry fruits' },
    { name: 'Tulsi', category: 'premium', positioning: 'Premium quality focus' },
    { name: 'Happilo', category: 'd2c', positioning: 'D2C native healthy snacks' },
    { name: 'Carnival', category: 'mass-market', positioning: 'Mass market threat' },
    { name: 'Vedaka', category: 'mass-market', positioning: 'Amazon private label' },
    { name: 'Solimo', category: 'mass-market', positioning: 'Amazon budget brand' },
    { name: 'Farmley', category: 'd2c', positioning: 'D2C native, farm-fresh focus' },
    { name: 'Nutty Gritties', category: 'd2c', positioning: 'D2C healthy positioning' },
    { name: 'Urban Platter', category: 'd2c', positioning: 'D2C gourmet foods' },
    {
      name: 'Raw Pressery',
      category: 'premium',
      positioning: 'Premium gifting and wellness',
    },
    { name: 'The Whole Truth', category: 'd2c', positioning: 'Clean label, transparency' },
    { name: 'Yoga Bar', category: 'd2c', positioning: 'Health and wellness snacking' },
  ],

  // Target audience
  targetAudience: [
    'Premium consumers (HHI >₹15L/year)',
    'Health-conscious millennials (25-40 years)',
    'Corporate gifting decision makers',
    'Quick commerce users in metro cities',
    'B2B customers (retailers, corporates)',
  ],

  // Additional context
  additionalContext:
    'Flyberry has strong operations and product quality but lacks brand differentiation. The ₹50 Crore transformation project aims to build a lifestyle brand that commands premium pricing across D2C, retail, and quick commerce channels.',
};
