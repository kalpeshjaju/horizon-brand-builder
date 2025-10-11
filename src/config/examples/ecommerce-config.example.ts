// Example: E-commerce Fashion brand configuration
// This serves as a template for D2C fashion / lifestyle brands

import type { BrandConfiguration } from '../../types/project-types.js';

export const ECOMMERCE_BRAND_CONFIG: BrandConfiguration = {
  // Basic info
  brandName: 'Urban Thread',
  industry: 'Fashion & Lifestyle',
  category: 'Sustainable Fashion - Contemporary Basics',

  // Company details
  companyProfile: {
    founded: 2021,
    currentRevenue: '$2M Annual Revenue',
    channels: ['D2C Website', 'Instagram Shop', 'Marketplace (Amazon, Myntra)'],
    website: 'www.urbanthread.com',
    employees: 12,
    headquarters: 'Mumbai, India',
  },

  // Project objectives
  projectObjectives: {
    primary:
      'Build Urban Thread into a recognized sustainable fashion brand that resonates with conscious millennials and Gen Z',
    goals: [
      'Establish clear brand differentiation in crowded sustainable fashion space',
      'Create aspirational yet accessible brand positioning',
      'Build community of brand advocates and repeat customers',
      'Develop cohesive visual identity across digital touchpoints',
      'Scale brand presence while maintaining authentic sustainable values',
    ],
    successMetrics: [
      'Brand recall in target segment (Metro millennial women 25-35)',
      'Social media community growth (50K Instagram followers in 12 months)',
      'Repeat purchase rate > 35%',
      'NPS score > 50',
      'Avg order value increase by 25%',
    ],
  },

  // Competitors
  competitors: [
    { name: 'Bombay Shirt Company', category: 'd2c', positioning: 'Premium custom basics' },
    { name: 'Snitch', category: 'd2c', positioning: 'Fast fashion, trend-focused' },
    { name: 'The Souled Store', category: 'd2c', positioning: 'Pop culture casual wear' },
    { name: 'FabIndia', category: 'premium', positioning: 'Traditional crafts, ethnic wear' },
    {
      name: 'Bewakoof',
      category: 'd2c',
      positioning: 'Affordable casual wear, youth-focused',
    },
    { name: 'NorBlack NorWhite', category: 'premium', positioning: 'Luxury sustainable fashion' },
  ],

  // Target audience
  targetAudience: [
    'Millennial women (25-35 years, metro cities)',
    'Gen Z consumers (18-24 years, conscious buyers)',
    'Working professionals seeking quality basics',
    'Eco-conscious fashion enthusiasts',
  ],

  // Additional context
  additionalContext:
    'Urban Thread started as a side project focused on sustainable basics but has found product-market fit. Now looking to scale with proper brand positioning, visual identity, and community building. Key challenge is balancing "sustainable" (can feel preachy) with "aspirational cool" positioning.',
};
