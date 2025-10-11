// Brand type configurations

import type { BrandType } from '../types/brand-types.js';
import type { BrandTypeConfig } from '../types/workflow-types.js';

export const brandTypeConfigs: Record<BrandType, BrandTypeConfig> = {
  b2c_consumer: {
    name: 'B2C Consumer Brand',
    description: 'Consumer-facing brands selling directly to individuals',
    researchFocus: [
      'Emotional triggers and motivations',
      'Lifestyle fit and aspirations',
      'Social proof and community',
      'Purchase behavior patterns',
      'Social media trends and conversations',
    ],
    auditDimensions: [
      'Visual appeal and aesthetic consistency',
      'Brand personality and emotional resonance',
      'Customer experience across touchpoints',
      'Social media presence and engagement',
      'Packaging and unboxing experience',
    ],
    strategyPriorities: [
      'Differentiation in crowded market',
      'Emotional connection with consumers',
      'Social shareability and word-of-mouth',
      'Community building and engagement',
      'Consistent brand experience',
    ],
    uniqueDeliverables: [
      'Social media personality guide',
      'Content calendar templates',
      'Influencer collaboration framework',
      'Packaging design principles',
      'Community engagement strategy',
    ],
  },

  b2b_enterprise: {
    name: 'B2B Enterprise Brand',
    description: 'Business-to-business brands targeting organizations',
    researchFocus: [
      'Decision-maker personas and buying committees',
      'Buying process and decision criteria',
      'Trust factors and risk mitigation',
      'Industry thought leadership landscape',
      'Customer success and retention factors',
    ],
    auditDimensions: [
      'Credibility signals and trust markers',
      'Thought leadership and expertise demonstration',
      'Case studies and proof of results',
      'Sales enablement alignment',
      'Executive presence and visibility',
    ],
    strategyPriorities: [
      'Authority and expertise positioning',
      'Value demonstration and ROI focus',
      'Relationship building and trust',
      'Thought leadership content',
      'Customer success storytelling',
    ],
    uniqueDeliverables: [
      'Sales enablement toolkit',
      'Executive messaging guide',
      'Thought leadership content strategy',
      'Customer proof points library',
      'Conference and speaking guidelines',
    ],
  },

  luxury_premium: {
    name: 'Luxury/Premium Brand',
    description: 'High-end brands focused on exclusivity and prestige',
    researchFocus: [
      'Aspiration drivers and status symbolism',
      'Exclusivity perception and scarcity value',
      'Heritage and craftsmanship appreciation',
      'Sensory experience expectations',
      'Affluent consumer psychographics',
    ],
    auditDimensions: [
      'Craftsmanship cues and quality signals',
      'Scarcity and exclusivity perception',
      'Prestige markers and status symbols',
      'Sensory brand experience',
      'Heritage and storytelling depth',
    ],
    strategyPriorities: [
      'Brand mythology and heritage narrative',
      'Sensory experience design',
      'Status symbolism and exclusivity',
      'Craftsmanship storytelling',
      'Selective distribution strategy',
    ],
    uniqueDeliverables: [
      'Heritage narrative framework',
      'VIP experience design guidelines',
      'Sensory branding strategy',
      'Exclusivity and scarcity playbook',
      'Ambassador and partnerships criteria',
    ],
  },

  personal_brand: {
    name: 'Personal Brand',
    description: 'Individual professionals building personal brands',
    researchFocus: [
      'Personal story and unique journey',
      'Expertise areas and unique perspectives',
      'Audience connection points',
      'Platform and medium preferences',
      'Personal values and beliefs',
    ],
    auditDimensions: [
      'Authenticity and genuine voice',
      'Consistency across platforms',
      'Thought leadership positioning',
      'Audience engagement quality',
      'Personal vs professional balance',
    ],
    strategyPriorities: [
      'Personal narrative development',
      'Content strategy and voice',
      'Community building approach',
      'Authentic self-expression',
      'Platform optimization',
    ],
    uniqueDeliverables: [
      'Content calendar and themes',
      'Personal style guide',
      'Platform-specific strategies',
      'Engagement playbook',
      'Personal story arc',
    ],
  },

  startup_disruptor: {
    name: 'Startup/Disruptor Brand',
    description: 'Innovative startups challenging established markets',
    researchFocus: [
      'Market gap and innovation opportunity',
      'Innovation positioning angle',
      'Early adopter profiles',
      'Disruptive value proposition',
      'Category creation potential',
    ],
    auditDimensions: [
      'Differentiation from incumbents',
      'Innovation signals and credibility',
      'Growth scalability potential',
      'Founder story and vision',
      'Market education effectiveness',
    ],
    strategyPriorities: [
      'Category creation or redefinition',
      'Viral potential and growth hacking',
      'Founder story leverage',
      'Challenger brand positioning',
      'Rapid market education',
    ],
    uniqueDeliverables: [
      'Launch narrative framework',
      'Growth playbook',
      'Market education strategy',
      'Founder voice guidelines',
      'Viral content templates',
    ],
  },

  ecommerce_fashion: {
    name: 'E-commerce Fashion Brand',
    description: 'Fashion and lifestyle e-commerce brands',
    researchFocus: [
      'Fashion trends and style movements',
      'Target lifestyle and aesthetic preferences',
      'Shopping behavior and conversion drivers',
      'Visual content consumption patterns',
      'Influencer and style icon alignment',
    ],
    auditDimensions: [
      'Visual identity and aesthetic consistency',
      'Product presentation and styling',
      'Website user experience',
      'Social commerce effectiveness',
      'Brand lifestyle representation',
    ],
    strategyPriorities: [
      'Lifestyle brand positioning',
      'Visual storytelling excellence',
      'Social commerce integration',
      'Community and style tribe building',
      'Seasonal campaign strategy',
    ],
    uniqueDeliverables: [
      'Style guide and lookbooks',
      'Social commerce playbook',
      'Influencer partnership framework',
      'Seasonal campaign themes',
      'User-generated content strategy',
    ],
  },

  saas_b2b: {
    name: 'B2B SaaS Brand',
    description: 'Software-as-a-Service brands serving businesses',
    researchFocus: [
      'Product-market fit and user needs',
      'Decision-maker personas',
      'Competitive feature and positioning analysis',
      'Customer onboarding and success patterns',
      'Product-led growth opportunities',
    ],
    auditDimensions: [
      'Product brand alignment',
      'Trust and security signals',
      'Customer education effectiveness',
      'Free trial to paid conversion',
      'Product differentiation clarity',
    ],
    strategyPriorities: [
      'Product-led brand strategy',
      'Developer/user community building',
      'Educational content excellence',
      'Trust and reliability signals',
      'Integration ecosystem positioning',
    ],
    uniqueDeliverables: [
      'Product marketing framework',
      'Developer relations guidelines',
      'Educational content strategy',
      'Product launch playbook',
      'Integration partner guidelines',
    ],
  },
};
