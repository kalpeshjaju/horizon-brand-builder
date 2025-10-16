// Flyberry Gourmet - COMPREHENSIVE Brand Configuration
// Updated with data from actual product catalogues (Oct 2025)
// Sources: Retail, Training, Gifting, E-commerce catalogues + Hope Gift Box case study

import type { BrandConfiguration } from '../types/project-types.js';

export const FLYBERRY_COMPREHENSIVE_CONFIG: BrandConfiguration = {
  brandName: 'Flyberry Gourmet',
  industry: 'Food & Beverage',
  category: 'Premium Healthy Snacks & Dry Fruits',

  companyProfile: {
    legalName: 'FLYBERRY GOURMET RETAIL PVT. LTD.',
    founded: 2020, // From E-comm Primary Cards
    currentRevenue: '₹50 Crores+',
    headquarters: 'Hyderabad, India',
    website: 'https://flyberry.in',
    contactEmail: 'hello@flyberry.in',
    contactPhone: '+91-9700319999',

    channels: [
      'D2C Website (flyberry.in)',
      'E-commerce (BigBasket, Amazon, Flipkart)',
      'Quick Commerce (Blinkit, Swiggy Instamart)',
      'Retail (Spencer\'s, Ratnadeep)',
      'Physical Stores (5 locations: Hyderabad & Vijaywada)',
      'B2B Corporate Gifting',
    ],

    stores: 5,
    geographicPresence: ['India (PAN India delivery)'],

    description:
      'Flyberry Gourmet is an omnichannel premium healthy snacks brand specializing in dates, exotic nuts, vacuum-fried chips, and value-added gourmet products. Known for creative recipes, nutritional transparency, and "Where healthy and snacks meet" positioning.',
  },

  // PRODUCT PORTFOLIO (from PDF catalogues)
  productPortfolio: {
    categories: {
      dates: {
        name: 'Premium Dates',
        count: 8,
        priceRange: '₹299 - ₹2,899',
        products: [
          {
            name: 'Medjoul Dates (Jumbo)',
            origin: 'Jordan',
            positioning: 'The King of Dates',
            sizes: ['200g (₹1,299)', '400g (₹2,399)', '500g (₹2,899)'],
            keyFeatures: ['20-30g per date', '5x larger than regular', '2x potassium vs banana', 'Caramel flavor with wild honey & cinnamon notes', 'Very low G.I.'],
            nutrition: '90 Kcal/date',
            recipe: 'Mawa Stuffed Dates',
            tagline: 'Don\'t wait. Just Date.',
          },
          {
            name: 'Ameri Dates',
            origin: 'Jordan',
            positioning: 'The date that leaves you wanting for more',
            keyFeatures: ['Rich in iron', 'Soft texture'],
            nutrition: '155 kcal/50g',
            recipe: 'Mawa Stuffed Dates',
            packaging: 'Orange',
          },
          {
            name: 'Ajwa Dates',
            origin: 'Saudi Arabia (Medina)',
            positioning: 'The only dates from paradise',
            keyFeatures: ['Traditional medicine', 'Spiritual significance', 'Premium quality'],
            nutrition: '181 kcal/50g',
            recipe: 'Ajwa Kalakand',
            packaging: 'Blue',
          },
          {
            name: 'Deglet Nour Dates',
            origin: 'Jordan',
            positioning: 'Queen of Dates',
            keyFeatures: ['Translucent blonde', '23% vitamin A', 'Semi-dry texture'],
            nutrition: '174 kcal/50g',
            recipe: 'Date Bars',
            packaging: 'Teal',
          },
          {
            name: 'Deri Dates',
            origin: 'Jordan',
            positioning: 'Dark. Dense. Delish.',
            keyFeatures: ['Sticky toffee texture', 'Rich dark color'],
            nutrition: '163 kcal/50g',
            recipe: 'Dark Chocolate Fondue',
            packaging: 'Blue',
          },
          {
            name: 'Halawi Dates',
            origin: 'Jordan',
            positioning: 'Juicy. Pulpy. Sweety.',
            keyFeatures: ['Sweet and pulpy', 'Soft texture'],
            nutrition: '185 kcal/50g',
            recipe: 'Date Bark',
            packaging: 'Peach',
          },
          {
            name: 'Kalmi Dates',
            origin: 'Saudi Arabia',
            positioning: 'Kalmi, Call Me Caramel',
            keyFeatures: ['Caramel-like taste', 'Premium quality'],
            nutrition: '180 kcal/50g',
            recipe: 'Caramel Date Sundae',
            packaging: 'Gold',
          },
          {
            name: 'Mabroom Dates',
            origin: 'Saudi Arabia',
            positioning: 'Nature\'s Toffee Minus the Calories',
            keyFeatures: ['33.2% vitamin A', 'Toffee-like texture'],
            nutrition: '185 kcal/50g',
            recipe: 'Natural Caramel',
            packaging: 'Pink',
          },
        ],
      },

      exoticNuts: {
        name: 'Exotic Nuts',
        count: 5,
        priceRange: '₹599 - ₹1,499',
        products: [
          {
            name: 'Macadamia Nuts',
            origin: 'Australia',
            positioning: 'Meet your MUFA!',
            keyFeatures: ['45.6% MUFA (Monounsaturated fatty acids)', 'Heart-healthy'],
            nutrition: '191 kcal/25g',
            recipe: 'Macadamia Pulao',
            packaging: 'Yellow',
            tagline: 'Rich in heart-healthy fats',
          },
          {
            name: 'Pecan Nuts',
            origin: 'USA',
            positioning: 'Key to Gamma-E!',
            keyFeatures: ['43.4% Omega 6', 'Antioxidant-rich'],
            nutrition: '184 kcal/25g',
            recipe: 'Roasted Spiced Pecans',
            packaging: 'Navy blue',
          },
          {
            name: 'Brazil Nuts',
            origin: 'Bolivia (Amazon rainforest)',
            positioning: 'Taste the Selenium!',
            keyFeatures: ['247% selenium DV', 'Testosterone support', 'Immunity booster'],
            nutrition: '59.3 kcal/8g',
            recipe: 'Vegan Parmesan',
            packaging: 'Maroon',
            price: '₹599/100g',
          },
          {
            name: 'Hazelnuts',
            origin: 'Turkey',
            positioning: 'Chocolate\'s bestie since 1830',
            keyFeatures: ['19% MUFA', 'Brain health'],
            nutrition: '87 kcal/12g',
            recipe: 'Hazelnut Katli',
            packaging: 'Teal',
            useCases: ['Hazelnut Chocolate Spread (unlike Nutella - healthier)'],
          },
          {
            name: 'Pine Nuts',
            origin: 'Afghanistan (Hindukush Mountains)',
            positioning: 'Vegan caviar from 100ft above',
            keyFeatures: ['29% Omega 6', 'Rare and premium'],
            nutrition: '88.7 kcal/12g',
            recipe: 'Pine Nut Candy',
            packaging: 'Green',
            price: '₹1,499/100g',
          },
        ],
      },

      valueAdded: {
        name: 'Value-Added Products',
        products: [
          {
            name: 'Date Bites',
            variants: 5,
            price: '₹399 box / ₹45 per piece',
            flavors: ['Blueberry Cheese', 'Orange Surprise', 'Chocodate', 'Paan Perfect', 'PB & Yay'],
          },
          {
            name: 'Stuffed Dates',
            variants: 5,
            price: '₹80 per piece',
            description: 'Premium dates stuffed with artisanal fillings',
          },
          {
            name: 'Trail Mix',
            priceRange: '₹49 - ₹1,999',
            description: 'Custom nut and fruit mixes',
          },
          {
            name: 'Hazelnut Chocolate Spread',
            positioning: 'Unlike Nutella - healthier alternative',
          },
          {
            name: 'Date Powder',
            useCase: 'Natural sweetener replacement',
          },
          {
            name: 'Date Syrup',
            useCase: 'Natural liquid sweetener',
          },
        ],
      },

      chips: {
        name: 'Vacuum-Fried Chips',
        price: '₹49 each',
        technology: '<10% rice-bran oil = 70% less oil than conventional chips',
        varieties: ['Jackfruit', 'Banana', 'Sweet Potato', 'Beetroot'],
      },

      nuts: {
        name: 'Flavored Nuts',
        count: 15,
        flavors: [
          'Chocolate', 'Coffee Mocha', 'Honey Cinnamon', 'Lime & Lemon',
          'Blueberry', 'Rose Petal', 'Mint', 'Peri Peri', 'Wasabi',
          'Tandoori', 'BBQ', 'Sea Salt', 'Caramel', 'Maple', 'Truffle',
        ],
      },
    },
  },

  // PRICING ARCHITECTURE (from Gifting Catalogue)
  pricingArchitecture: {
    retail: {
      entry: '₹49 (chips)',
      mainstream: '₹299 - ₹599 (dates, nuts)',
      premium: '₹599 - ₹1,499 (exotic nuts, Medjoul)',
      luxury: '₹1,499 - ₹2,899 (jumbo Medjoul, Pine Nuts)',
    },
    corporate: {
      entry: '₹399 (Lattice Box)',
      mainstream: '₹999 - ₹1,999 (Premium Hampers)',
      premium: '₹2,499 - ₹4,999 (Executive Hampers)',
      luxury: '₹4,999 - ₹7,249 (Gold 2-Tier Basket)',
    },
    customization: 'All corporate products have customizable contents and pricing',
  },

  // CORPORATE CLIENTS (from Gifting Catalogue)
  corporateClients: [
    'Google',
    'Facebook',
    'Deloitte',
    'Goldman Sachs',
    'Tata Steel',
    'Coca-Cola',
    'Sodexo', // Hope Gift Box case study
  ],

  // BRAND POSITIONING ELEMENTS
  brandPositioning: {
    tagline: 'Where healthy and snacks meet. Delivering PAN India!',

    coreMessages: [
      'Nothing but™ positioning (100% natural, no added sugar, no preservatives)',
      'Premium quality meets health consciousness',
      'Creative recipes and usage occasions',
      'Origin-based storytelling (Jordan, Saudi, USA, Australia, Bolivia, Turkey, Afghanistan)',
      'Nutritional transparency with test reports',
    ],

    brandVoice: {
      tone: 'Playful but premium, health-conscious but indulgent',
      examples: [
        'Don\'t wait. Just Date.',
        'Wanna Date?',
        'If Date married Chocolate',
        'Numbers don\'t lie, this Date\'s kinda Fly',
        'Meet your MUFA!',
        'Vegan caviar from 100ft above',
      ],
    },

    contentStrategy: {
      education: 'Every product includes "What makes this berry so fly?" educational panels',
      recipes: 'DIY recipes on every package (Indian & Western fusion)',
      verification: 'QR codes for test reports - "Taste ✓ Test ✓✓"',
      storytelling: 'Origin stories with country maps',
    },
  },

  projectObjectives: {
    primary:
      'Transform Flyberry from an operations-driven business into a distinctive, premium lifestyle brand with strong emotional connection and category leadership',

    goals: [
      'Establish clear brand positioning as "premium healthy indulgence"',
      'Create cohesive brand identity across 6 channels (D2C, retail, quick commerce, physical stores, e-commerce, B2B)',
      'Build emotional connection beyond functional benefits',
      'Leverage existing Fortune 500 corporate client relationships for B2B growth',
      'Optimize omnichannel experience and channel-specific messaging',
      'Position as thought leader in premium healthy snacking',
      'Scale corporate gifting business (proven with Sodexo Hope Gift Box success)',
      'Increase brand awareness by 40% in target segments',
    ],

    timeline: '16 weeks',
    budget: '₹50 Lakhs - ₹75 Lakhs',

    successMetrics: [
      'Brand awareness increase of 40% in target segments',
      'Premium price point acceptance (₹500-1000/product)',
      'Customer loyalty and repeat purchase rate +25%',
      'Corporate gifting revenue growth 50%',
      'Consistent brand experience across all 6 channels',
      'Revenue growth to ₹100 Crores in 24 months',
      'NPS score improvement to 50+',
    ],
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
      currentBehavior: 'Already purchasing from quick commerce (Blinkit, Swiggy) and e-commerce (Amazon, BigBasket)',
    },
    {
      name: 'Corporate Gifting Decision Makers',
      description:
        'HR heads, admin teams, and executives at Fortune 500 companies purchasing premium gifts',
      demographics: {
        ageRange: '30-55',
        companies: 'MNCs and large corporates',
      },
      provenSuccess: 'Already serving Google, Facebook, Deloitte, Goldman Sachs, Tata Steel, Coca-Cola',
    },
    {
      name: 'Premium Lifestyle Consumers',
      description:
        'Affluent consumers who view gourmet foods as part of their premium lifestyle choices',
      demographics: {
        ageRange: '35-60',
        income: '₹25L+ annually',
        location: 'Metro cities',
      },
      behavior: 'Shopping at Spencer\'s, physical Flyberry stores',
    },
    {
      name: 'Health & Fitness Enthusiasts',
      description:
        'Active individuals seeking nutritious, natural snacking options with transparent nutrition data',
      demographics: {
        ageRange: '20-40',
        income: '₹6L - ₹20L annually',
      },
      keyNeed: 'Nutritional transparency, test reports, clean label',
    },
  ],

  competitors: [
    {
      name: 'Nutraj',
      category: 'Direct competitor',
      positioning: 'Traditional premium dry fruits',
      differentiation: 'Flyberry has stronger omnichannel presence + creative recipes',
    },
    {
      name: 'Happilo',
      category: 'D2C competitor',
      positioning: 'D2C native healthy snacks',
      differentiation: 'Flyberry has physical stores + corporate clients (Google, FB)',
    },
    {
      name: 'Farmley',
      category: 'D2C competitor',
      positioning: 'Farm-to-table natural products',
      differentiation: 'Flyberry has international sourcing + exotic portfolio',
    },
    {
      name: 'Carnival',
      category: 'Mass market threat',
      positioning: 'Affordable quality',
      differentiation: 'Flyberry is premium positioning with origin stories',
    },
    {
      name: 'Vedaka/Solimo (Amazon)',
      category: 'Private label threat',
      positioning: 'Value for money',
      differentiation: 'Flyberry has brand storytelling + emotional connection',
    },
  ],

  brandChallenges: [
    'Need to unify brand experience across 6 channels (D2C, retail, QC, stores, e-comm, B2B)',
    'Corporate gifting success (Fortune 500 clients) not visible to B2C consumers',
    'Rich product portfolio (12 main SKUs) needs clearer architecture',
    'Playful brand voice may conflict with premium positioning',
    'Need to scale corporate gifting capabilities (Sodexo case study)',
    'Physical stores (5 locations) underutilized for brand experience',
  ],

  brandOpportunities: [
    'Proven Fortune 500 corporate relationships (Google, FB, Deloitte, Goldman)',
    'Omnichannel presence (rare in this category)',
    'Creative recipes and usage occasions (differentiation)',
    'International sourcing with transparent origins',
    'Vacuum-fry technology (70% less oil) for chips',
    'Bespoke corporate gifting capabilities (Hope Gift Box case study)',
    'Quick commerce boom (already on Blinkit, Swiggy)',
    'Growing premium gifting culture',
  ],

  // CUSTOM RESEARCH TOPICS
  customResearchTopics: {
    phase1: [
      'Flyberry omnichannel customer journey mapping',
      'Corporate vs B2C customer perception gaps',
      'Product portfolio architecture optimization (12 main SKUs)',
      'Physical store experience audit (5 locations)',
      'Quick commerce vs e-commerce performance comparison',
      'Corporate gifting scalability assessment',
    ],
  },

  // VERIFIED DATA SOURCES
  dataSources: [
    {
      name: 'Retail Catalogue (11zon)',
      date: '2025',
      pageCount: 15,
      extracted: 'Product portfolio, pricing, categories',
    },
    {
      name: 'Training Catalogue (11zon)',
      date: '2025',
      extracted: 'Product specs, sourcing, health benefits, B2B education',
    },
    {
      name: 'Gifting Catalogue (11zon)',
      date: '2025',
      pageCount: 24,
      extracted: 'Corporate clients, price architecture ₹399-₹7249, customization',
    },
    {
      name: 'Hope Gift Box',
      date: 'Diwali 2020',
      pageCount: 11,
      extracted: 'COVID-themed corporate gift for Sodexo, bespoke capabilities',
    },
    {
      name: 'E-comm Primary Cards (11zon)',
      date: '2025',
      pageCount: 74,
      extracted: 'Complete product cards for 12 products, brand voice, recipes',
    },
  ],

  additionalContext: `
**VERIFIED BRAND REALITY (from actual catalogues):**

**Product Portfolio (12 main SKUs):**
- 8 date varieties (Medjoul, Ameri, Ajwa, Deglet Nour, Deri, Halawi, Kalmi, Mabroom)
- 5 exotic nuts (Macadamia, Pecan, Brazil, Hazelnut, Pine)
- Value-added: Date Bites, Stuffed Dates, Hazelnut Spread, Date Powder/Syrup
- Chips: Vacuum-fried (70% less oil technology)

**Omnichannel Distribution:**
1. D2C: flyberry.in (PAN India delivery)
2. E-commerce: BigBasket, Amazon, Flipkart
3. Quick Commerce: Blinkit, Swiggy Instamart
4. Retail: Spencer's, Ratnadeep
5. Physical Stores: 5 locations (Hyderabad & Vijaywada)
6. B2B: Corporate gifting (Google, Facebook, Deloitte, Goldman Sachs, Tata Steel, Coca-Cola)

**Price Architecture:**
- Entry: ₹49 (chips)
- Mainstream: ₹299-₹599 (dates, nuts)
- Premium: ₹599-₹1,499 (exotic nuts, premium dates)
- Luxury: ₹1,499-₹2,899 (jumbo Medjoul, Pine Nuts)
- Corporate: ₹399-₹7,249 (customizable hampers)

**Brand Differentiation:**
- International sourcing with transparent origins (7 countries)
- Creative recipes on every package (Indian & Western fusion)
- Nutritional transparency with QR-code test reports
- Playful premium voice ("Don't wait. Just Date.", "Wanna Date?")
- Fortune 500 corporate relationships (proven with Sodexo Hope Gift Box)
- Vacuum-fry technology (70% less oil)

**Key Challenge:**
Corporate success (Fortune 500 clients) is invisible to B2C consumers. Need to unify brand story across 6 channels.

**Key Opportunity:**
Leverage corporate credibility (Google, Facebook, Goldman) to build premium B2C brand perception.
  `,
};

export default FLYBERRY_COMPREHENSIVE_CONFIG;
