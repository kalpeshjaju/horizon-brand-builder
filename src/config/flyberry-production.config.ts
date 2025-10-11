// Flyberry.in Production Brand Configuration
// Complete configuration for Flyberry Gourmet brand transformation project

import type { BrandConfiguration } from '../types/project-types.js';

export const FLYBERRY_PRODUCTION_CONFIG: BrandConfiguration = {
  brandName: 'Flyberry Gourmet',
  industry: 'Food & Beverage',
  category: 'Premium Dry Fruits, Nuts, and Gourmet Foods',

  companyProfile: {
    founded: 2017,
    currentRevenue: '₹50 Crores',
    targetRevenue: '₹100 Crores (next 2 years)',
    teamSize: 50,
    headquarters: 'India',
    website: 'www.flyberry.in',
    channels: ['D2C', 'Offline Retail', 'Quick Commerce', 'B2B'],
    stores: 4,
    geographicPresence: ['India'],
    description:
      'Premium gourmet food brand specializing in dry fruits, nuts, and artisanal food products with a focus on quality and direct consumer engagement.',
  },

  projectObjectives: {
    primary:
      'Transform Flyberry from an operations-driven business into a distinctive, premium lifestyle brand that commands higher margins and deeper customer loyalty',
    goals: [
      'Establish clear brand positioning in the premium gourmet segment',
      'Build emotional connection with health-conscious urban consumers',
      'Create a cohesive brand identity across all touchpoints',
      'Develop thought leadership in the premium dry fruits category',
      'Increase brand awareness and recall among target audiences',
      'Drive customer loyalty and repeat purchase behavior',
      'Optimize channel strategy and omnichannel experience',
      'Position for sustainable growth to ₹100 Crores',
    ],
    timeline: '16 weeks',
    budget: '₹50 Lakhs - ₹75 Lakhs',
  },

  targetAudiences: [
    {
      name: 'Health-Conscious Professionals',
      description:
        'Urban professionals (25-45) who prioritize health and wellness, seek premium quality, and value convenience',
      demographics: {
        ageRange: '25-45',
        income: '₹8L - ₹25L annually',
        location: 'Tier 1 & 2 cities',
        occupation: 'Corporate professionals, entrepreneurs',
      },
      psychographics: [
        'Health and wellness focused',
        'Quality over price',
        'Time-starved, value convenience',
        'Premium lifestyle aspirations',
      ],
      behaviors: [
        'Regular online shoppers',
        'Subscribe to health/wellness content',
        'Active on social media',
        'Seek trustworthy brands',
      ],
    },
    {
      name: 'Gifting Occasions',
      description:
        'Individuals purchasing premium gifts for festivals, celebrations, and corporate occasions',
      demographics: {
        ageRange: '30-55',
        income: '₹10L+ annually',
        location: 'Pan-India',
        occasion: 'Diwali, weddings, corporate gifting',
      },
      psychographics: [
        'Value presentation and packaging',
        'Seek unique, premium options',
        'Brand-conscious',
        'Relationship-focused',
      ],
      behaviors: [
        'Seasonal/occasion-based purchase',
        'Research before buying',
        'Share on social media',
        'Value recommendations',
      ],
    },
    {
      name: 'Health & Fitness Enthusiasts',
      description:
        'Active individuals seeking nutritious, natural snacking options to support fitness goals',
      demographics: {
        ageRange: '20-40',
        income: '₹6L - ₹20L annually',
        location: 'Urban metros',
        lifestyle: 'Gym-goers, yoga practitioners, athletes',
      },
      psychographics: [
        'Nutrition-conscious',
        'Natural/organic preference',
        'Performance-oriented',
        'Community-engaged',
      ],
      behaviors: [
        'Read nutrition labels',
        'Follow fitness influencers',
        'Active on health apps',
        'Subscribe to wellness brands',
      ],
    },
    {
      name: 'Conscious Parents',
      description:
        'Parents seeking healthy, natural snack options for their children and families',
      demographics: {
        ageRange: '30-45',
        income: '₹8L - ₹30L annually',
        location: 'Tier 1 & 2 cities',
        familySize: '3-5 members',
      },
      psychographics: [
        'Child health priority',
        'Natural/chemical-free focus',
        'Quality-conscious',
        'Long-term thinking',
      ],
      behaviors: [
        'Research extensively',
        'Value transparency',
        'Engage in parenting communities',
        'Bulk/subscription purchases',
      ],
    },
    {
      name: 'Premium Lifestyle Consumers',
      description:
        'Affluent consumers who view gourmet foods as part of their premium lifestyle choices',
      demographics: {
        ageRange: '35-60',
        income: '₹25L+ annually',
        location: 'Metro cities',
        lifestyle: 'Luxury lifestyle, fine dining',
      },
      psychographics: [
        'Premium everything',
        'Experience-driven',
        'Brand loyalty',
        'Aesthetic appreciation',
      ],
      behaviors: [
        'Premium retail shoppers',
        'Fine dining patrons',
        'Travel frequently',
        'Curate lifestyle',
      ],
    },
  ],

  competitors: [
    {
      name: 'Nutraj',
      website: 'https://www.nutraj.com',
      category: 'Direct competitor',
      strengths: ['Strong brand presence', 'Wide distribution', 'Established trust'],
      weaknesses: ['Less premium positioning', 'Limited online presence'],
      positioning: 'Quality dry fruits for everyone',
    },
    {
      name: 'Happilo',
      website: 'https://www.happilo.com',
      category: 'Direct competitor',
      strengths: ['Strong D2C presence', 'Modern branding', 'Digital-first'],
      weaknesses: ['Limited offline presence', 'Price-conscious positioning'],
      positioning: 'Healthy snacking made easy',
    },
    {
      name: 'Farmley',
      website: 'https://www.farmley.com',
      category: 'Direct competitor',
      strengths: ['Farm-to-table story', 'Natural positioning', 'Good packaging'],
      weaknesses: ['Limited offline retail', 'Regional focus'],
      positioning: 'Natural and pure from farms',
    },
    {
      name: 'Carnival',
      website: 'https://www.carnivalfoods.com',
      category: 'Direct competitor',
      strengths: ['Wide product range', 'Affordable pricing', 'Good distribution'],
      weaknesses: ['Mass market positioning', 'Less premium appeal'],
      positioning: 'Quality at affordable prices',
    },
    {
      name: 'Vedaka (Amazon)',
      website: 'https://www.amazon.in/vedaka',
      category: 'Private label competitor',
      strengths: ['Amazon backing', 'Competitive pricing', 'Wide reach'],
      weaknesses: ['Generic branding', 'No emotional connection'],
      positioning: 'Value for money',
    },
    {
      name: 'Tulsi',
      website: 'https://www.tulsiproducts.com',
      category: 'Traditional competitor',
      strengths: ['Heritage brand', 'Trust', 'Offline presence'],
      weaknesses: ['Old-fashioned image', 'Limited innovation'],
      positioning: 'Traditional quality',
    },
    {
      name: 'Miltop',
      website: 'https://www.miltop.com',
      category: 'Direct competitor',
      strengths: ['Export quality', 'Product range', 'B2B presence'],
      weaknesses: ['Limited brand building', 'B2B focus'],
      positioning: 'Export quality products',
    },
    {
      name: 'Rostaa',
      website: 'https://www.rostaa.com',
      category: 'Premium competitor',
      strengths: ['Premium positioning', 'Gift packaging', 'Retail presence'],
      weaknesses: ['Higher price points', 'Limited availability'],
      positioning: 'Premium gifting solutions',
    },
    {
      name: 'NourishYou',
      website: 'https://www.nourishyou.in',
      category: 'Health-focused competitor',
      strengths: ['Health positioning', 'Modern appeal', 'Digital presence'],
      weaknesses: ['Newer brand', 'Limited awareness'],
      positioning: 'Nourishing healthy living',
    },
    {
      name: 'The Butternut Co.',
      website: 'https://www.thebutternutco.com',
      category: 'Premium artisanal competitor',
      strengths: ['Premium artisanal image', 'Strong D2C', 'Brand storytelling'],
      weaknesses: ['Limited product range', 'Higher prices'],
      positioning: 'Artisanal nut butters and snacks',
    },
    {
      name: 'Urban Platter',
      website: 'https://www.urbanplatter.in',
      category: 'Gourmet competitor',
      strengths: ['Wide gourmet range', 'International products', 'Modern image'],
      weaknesses: ['Less focus on dry fruits', 'Premium pricing'],
      positioning: 'Global gourmet foods',
    },
    {
      name: 'Yoga Bar',
      website: 'https://www.yogabars.in',
      category: 'Healthy snacking competitor',
      strengths: ['Health positioning', 'Strong brand', 'Innovation'],
      weaknesses: ['Focused on bars/snacks', 'Not dry fruits specialist'],
      positioning: 'Healthy snacking revolution',
    },
  ],

  brandChallenges: [
    'Currently perceived as operations/distribution-focused, not brand-focused',
    'Lack of clear brand positioning and differentiation',
    'No emotional connection with consumers beyond transactions',
    'Inconsistent brand experience across channels',
    'Limited brand awareness outside existing customer base',
    'Fragmented channel strategy (D2C, retail, B2B, quick commerce)',
    'Competing on price rather than brand value',
    'No thought leadership or category ownership',
  ],

  brandOpportunities: [
    'Growing premium gourmet food market in India (15-20% CAGR)',
    'Increasing health consciousness post-pandemic',
    'Rising disposable incomes in urban India',
    'Shift to branded products from unorganized sector',
    'Growing gifting culture for premium products',
    'D2C and quick commerce boom',
    'Limited strong premium brands in dry fruits category',
    'Opportunity to own "premium lifestyle" positioning',
  ],

  customResearchTopics: {
    phase1: [
      'Flyberry brand perception study among existing customers',
      'Flyberry channel performance analysis (D2C vs Retail vs B2B)',
      'Flyberry.in website user experience audit',
      'Flyberry social media presence analysis',
      'Premium dry fruits market size and growth in India',
      'Consumer behavior in premium gourmet food category',
      'Gifting trends in premium food products',
      'Health and wellness trends in Indian snacking',
    ],
  },

  customDeliverables: {
    phase1: [
      'Flyberry Brand Perception Report',
      'Premium Dry Fruits Market Analysis (India)',
      'Flyberry Channel Optimization Strategy',
    ],
    phase2: [
      'Flyberry Visual Identity Redesign',
      'Flyberry Packaging System Overhaul',
      'Flyberry.in Website Redesign Brief',
    ],
    phase3: [
      'Flyberry Retail Store Experience Guidelines',
      'Flyberry Quick Commerce Optimization Plan',
      'Flyberry Gifting Range Strategy',
    ],
  },

  additionalContext: `
**Current State:**
- 8-year-old brand with ₹50 Crores revenue
- Strong operational foundation with 4 retail stores
- Presence across D2C, offline retail, quick commerce, and B2B
- Known for quality products but lacking brand differentiation
- Operations and distribution strength, but limited brand building

**Desired State:**
- Recognized premium lifestyle brand in gourmet foods
- Clear positioning as the go-to premium dry fruits brand
- Strong emotional connection with health-conscious urban consumers
- Cohesive brand experience across all 4 channels
- Thought leadership in premium dry fruits category
- Sustainable growth path to ₹100 Crores
- Premium brand equity commanding higher margins

**Key Success Metrics:**
- Brand awareness increase by 40% in target audiences
- Premium pricing acceptance (10-15% price premium)
- Customer loyalty and repeat purchase rate +25%
- Omnichannel revenue growth (all channels performing)
- Social media engagement increase by 100%
- NPS score improvement to 50+
- Revenue growth to ₹100 Crores in 24 months

**Stakeholder Priorities:**
- Founder: Build lasting brand legacy, not just sales
- Marketing: Clear positioning and compelling brand story
- Sales: Tools and assets to sell premium effectively
- Operations: Consistent brand experience delivery
- Customers: Trust, quality, and premium experience
  `,
};

export default FLYBERRY_PRODUCTION_CONFIG;
