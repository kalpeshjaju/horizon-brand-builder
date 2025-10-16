// Flyberry Brand Configuration

import type { BrandConfiguration } from '../types/project-types.js';

export const FLYBERRY_CONFIG: BrandConfiguration = {
  brandName: 'Flyberry Gourmet',
  industry: 'Food & Beverage',
  category: 'Healthy Snacks & Dry Fruits',
  companyProfile: {
    founded: 2018,
    currentRevenue: '$2M-$5M',
    channels: ['E-commerce', 'Retail Stores', 'Online Marketplaces', 'Corporate Gifting'],
    geographicPresence: ['PAN India Delivery', 'Retail Experience Stores'],
    teamSize: 25,
    website: 'https://flyberry.in',
  },
  projectObjectives: {
    primary: 'Build comprehensive brand strategy for Flyberry Gourmet - India\'s premium healthy snacks and dry fruits brand',
    goals: [
      'Position as the go-to premium healthy snacking brand in India',
      'Differentiate through innovation (vacuum-fried chips, date-based products)',
      'Scale presence from premium niche to mass-premium segment',
      'Build strong gifting category leadership',
      'Achieve ₹50 Cr revenue by Year 3',
    ],
  },
  competitors: [
    {
      name: 'Nutraj',
      category: 'premium',
      website: 'https://www.nutraj.com',
      positioning: 'Premium dry fruits and nuts brand',
    },
    {
      name: 'Happilo',
      category: 'premium',
      website: 'https://www.happilo.com',
      positioning: 'Premium healthy snacks and dried fruits',
    },
    {
      name: 'True Elements',
      category: 'premium',
      website: 'https://www.trueelements.co.in',
      positioning: 'Clean label, healthy breakfast and snacks',
    },
    {
      name: 'Haldiram\'s',
      category: 'mass-market',
      website: 'https://www.haldirams.com',
      positioning: 'Traditional Indian snacks leader',
    },
    {
      name: 'Bikano',
      category: 'mass-market',
      website: 'https://www.bikanervala.com',
      positioning: 'Traditional sweets and snacks',
    },
    {
      name: 'Blue Diamond',
      category: 'international',
      website: 'https://www.bluediamond.com',
      positioning: 'Premium almond products',
    },
    {
      name: 'Wonderful Pistachios',
      category: 'international',
      website: 'https://www.wonderfulpistachios.com',
      positioning: 'Premium pistachio brand',
    },
  ],
  customDeliverables: {
    phase1: [
      'Product innovation roadmap (vacuum-fried technology)',
      'Gifting category strategy',
      'Health & wellness positioning framework',
    ],
    phase2: [
      'Retail expansion strategy',
      'Corporate B2B playbook',
      'Premium to mass-premium transition plan',
    ],
  },
};
