// Research Mode: 77-subtopic research configuration for deep brand research
// NOTE: This is Flyberry-specific. For generic system, use research-topic-templates.ts

export const RESEARCH_MODE_TOPICS = {
  phase1: {
    name: 'Brand Strategy & Positioning',
    topics: [
      {
        id: 'brand-audit',
        name: 'Brand Audit & Current State',
        subtopics: ['Current brand assets inventory', 'Touchpoint analysis', 'Brand perception gaps', 'Operational vs brand maturity'],
      },
      {
        id: 'competitive-landscape',
        name: 'Competitive Landscape Analysis',
        subtopics: [
          'Premium competitors analysis (10-15 brands)',
          'Mass market players threatening premium space',
          'International gourmet brands in India',
          'Quick commerce category dynamics',
          'D2C native brands positioning',
        ],
      },
      {
        id: 'target-audience',
        name: 'Target Audience Deep Dive',
        subtopics: [
          'Premium consumers psychographics',
          'Health-conscious millennials',
          'Corporate gifting decision makers',
          'Quick commerce user behavior',
          'B2B customer profiles',
        ],
      },
      {
        id: 'category-trends',
        name: 'Category Trends & Whitespace',
        subtopics: [
          'Premium snacking trends',
          'Health & wellness positioning',
          'Sustainability in gourmet foods',
          'Premiumization drivers',
          'Untapped category opportunities',
        ],
      },
      {
        id: 'pricing-analysis',
        name: 'Pricing & Value Perception',
        subtopics: [
          'Category price architecture',
          'Premium price elasticity',
          'Channel-specific pricing',
          'Value perception drivers',
          'Price-quality equation',
        ],
      },
    ],
  },
  phase2: {
    name: 'Brand Expression & Identity',
    topics: [
      {
        id: 'visual-trends',
        name: 'Visual Identity Trends',
        subtopics: [
          'Premium food branding aesthetics',
          'Color psychology in gourmet category',
          'Typography trends',
          'Packaging innovation',
          'Global premium brand benchmarks',
        ],
      },
      {
        id: 'packaging-landscape',
        name: 'Packaging Landscape Analysis',
        subtopics: [
          'Sustainable packaging innovations',
          'Shelf presence optimization',
          'Gift packaging trends',
          'Quick commerce format requirements',
          'Unboxing experience benchmarks',
        ],
      },
      {
        id: 'verbal-identity',
        name: 'Brand Voice & Messaging',
        subtopics: [
          'Tone of voice in premium category',
          'Storytelling approaches',
          'Message hierarchy',
          'Cultural resonance factors',
          'Luxury vs accessible premium language',
        ],
      },
    ],
  },
  phase3: {
    name: 'Brand Experience & Digital',
    topics: [
      {
        id: 'customer-journey',
        name: 'Customer Journey Mapping',
        subtopics: [
          'Discovery to purchase paths',
          'Omnichannel behavior patterns',
          'Pain points and friction areas',
          'Delight moments opportunities',
          'Post-purchase engagement',
        ],
      },
      {
        id: 'digital-shelf',
        name: 'Digital Shelf Excellence',
        subtopics: [
          'E-commerce conversion factors',
          'PDP optimization benchmarks',
          'Review and rating strategies',
          'Quick commerce tile performance',
          'Amazon/Flipkart best practices',
        ],
      },
      {
        id: 'social-media-landscape',
        name: 'Social Media & Content',
        subtopics: [
          'Platform-wise brand presence',
          'Content that drives engagement',
          'Influencer landscape analysis',
          'UGC trends in food category',
          'Social commerce opportunities',
        ],
      },
      {
        id: 'retail-experience',
        name: 'Retail Experience Benchmarks',
        subtopics: [
          'Premium retail store design',
          'Sensory experience strategies',
          'Visual merchandising best practices',
          'Store-to-digital integration',
          'Sampling and trials effectiveness',
        ],
      },
      {
        id: 'provenance-storytelling',
        name: 'Provenance & Authenticity',
        subtopics: [
          'Origin storytelling approaches',
          'Traceability and transparency',
          'Sustainability narratives',
          'Farmer partnership stories',
          'Quality certification impact',
        ],
      },
    ],
  },
  phase4: {
    name: 'Activation & Growth',
    topics: [
      {
        id: 'performance-marketing',
        name: 'Performance Marketing Intelligence',
        subtopics: [
          'Channel ROI benchmarks',
          'Creative performance patterns',
          'Audience targeting strategies',
          'Attribution modeling',
          'CAC optimization tactics',
        ],
      },
      {
        id: 'crm-lifecycle',
        name: 'CRM & Retention Strategies',
        subtopics: [
          'Customer segmentation models',
          'Lifecycle marketing flows',
          'Loyalty program benchmarks',
          'Repurchase triggers',
          'Winback strategies',
        ],
      },
      {
        id: 'gifting-market',
        name: 'Corporate & Festive Gifting',
        subtopics: [
          'B2B gifting market size',
          'Corporate procurement processes',
          'Festival calendar opportunities',
          'Hamper trends and preferences',
          'Personalization expectations',
        ],
      },
      {
        id: 'community-building',
        name: 'Community & Advocacy',
        subtopics: [
          'Brand community strategies',
          'Advocacy program models',
          'Engagement tactics',
          'Co-creation opportunities',
          'Event and activation ideas',
        ],
      },
    ],
  },
};
