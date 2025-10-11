#!/usr/bin/env node
/**
 * Comprehensive Brand Discovery Interview System
 * Collects all necessary inputs before generating brand book
 */

import readline from 'readline';
import { writeFile } from 'fs/promises';
import { join } from 'path';

interface BrandDiscoveryData {
  // Section 1: Basic Information
  basicInfo: {
    brandName: string;
    website?: string;
    industry: string;
    yearFounded?: string;
    location: string;
    teamSize?: string;
  };

  // Section 2: Business Context
  businessContext: {
    businessStage: 'startup' | 'growth' | 'established' | 'scale';
    primaryGoal: 'launch' | 'rebrand' | 'scale' | 'repositioning';
    currentRevenue?: string;
    fundingStage?: string;
    keyMetrics: string[];
  };

  // Section 3: Target Audience (Deep Dive)
  targetAudience: {
    primaryAudience: string;
    ageRange: string;
    incomeLevel: string;
    geography: string;
    psychographics: string[];
    painPoints: string[];
    desires: string[];
    buyingBehavior: string;
  };

  // Section 4: Competitive Landscape
  competitive: {
    directCompetitors: Array<{
      name: string;
      url?: string;
      strengths: string;
      weaknesses: string;
    }>;
    indirectCompetitors: string[];
    marketPosition: string;
    uniqueAdvantage: string;
  };

  // Section 5: Brand Identity (Current State)
  currentBrand: {
    hasLogo: boolean;
    hasStyleGuide: boolean;
    hasBrandColors: boolean;
    currentTagline?: string;
    brandVoice?: string;
    existingAssets: string[];
    whatWorks: string[];
    whatDoesntWork: string[];
  };

  // Section 6: Brand Aspirations
  aspirations: {
    desiredPerception: string;
    brandPersonality: string[];
    coreValues: string[];
    missionStatement?: string;
    visionStatement?: string;
    brandStory: string;
  };

  // Section 7: Products/Services
  offerings: {
    primaryProducts: string[];
    keyFeatures: string[];
    pricingStrategy: string;
    uniqueSellingPoints: string[];
    productionProcess?: string;
  };

  // Section 8: Marketing & Distribution
  marketing: {
    currentChannels: string[];
    mostEffectiveChannel?: string;
    socialMediaPresence: {
      instagram?: string;
      facebook?: string;
      linkedin?: string;
      twitter?: string;
      others?: string[];
    };
    contentStrategy?: string;
    influencerPartnerships: boolean;
  };

  // Section 9: Budget & Resources
  resources: {
    brandingBudget: string;
    timeline: string;
    internalTeam: string[];
    externalPartners: string[];
    technologyStack?: string[];
  };

  // Section 10: Success Metrics
  successMetrics: {
    shortTermGoals: string[];
    longTermGoals: string[];
    kpis: string[];
    targetMetrics: Record<string, string>;
  };

  // Section 11: Challenges & Opportunities
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };

  // Section 12: Additional Context
  additional: {
    industryRegulations?: string[];
    seasonality?: string;
    sustainabilityFocus?: string;
    socialImpact?: string;
    culturalContext?: string;
    additionalNotes: string[];
  };
}

export class BrandDiscoveryInterview {
  private rl: readline.Interface;
  private data: Partial<BrandDiscoveryData> = {};

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private async ask(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private async askMultiple(question: string): Promise<string[]> {
    const answer = await this.ask(question + ' (separate with commas): ');
    return answer.split(',').map((item) => item.trim()).filter(Boolean);
  }

  private async askYesNo(question: string): Promise<boolean> {
    const answer = await this.ask(question + ' (yes/no): ');
    return answer.toLowerCase().startsWith('y');
  }

  async conductInterview(): Promise<BrandDiscoveryData> {
    console.log('\n🎨 COMPREHENSIVE BRAND DISCOVERY INTERVIEW');
    console.log('==========================================\n');
    console.log('This interview will take 15-20 minutes and covers:');
    console.log('✓ Basic brand information');
    console.log('✓ Business context and goals');
    console.log('✓ Target audience deep dive');
    console.log('✓ Competitive landscape');
    console.log('✓ Current brand state');
    console.log('✓ Brand aspirations');
    console.log('✓ Products/services');
    console.log('✓ Marketing & distribution');
    console.log('✓ Budget & resources');
    console.log('✓ Success metrics');
    console.log('✓ SWOT analysis');
    console.log('✓ Additional context\n');

    const proceed = await this.askYesNo('Ready to begin?');
    if (!proceed) {
      console.log('\nInterview cancelled. Run again when ready.');
      process.exit(0);
    }

    // Section 1: Basic Information
    console.log('\n📋 SECTION 1/12: BASIC INFORMATION');
    console.log('──────────────────────────────────\n');

    this.data.basicInfo = {
      brandName: await this.ask('1. What is your brand name? '),
      website: await this.ask('2. Website URL (if available): ') || undefined,
      industry: await this.ask('3. Industry/Category: '),
      yearFounded: await this.ask('4. Year founded (optional): ') || undefined,
      location: await this.ask('5. Primary location/market: '),
      teamSize: await this.ask('6. Team size (optional): ') || undefined,
    };

    // Section 2: Business Context
    console.log('\n💼 SECTION 2/12: BUSINESS CONTEXT');
    console.log('──────────────────────────────────\n');

    const stageAnswer = await this.ask('1. Business stage (startup/growth/established/scale): ');
    const goalAnswer = await this.ask('2. Primary goal (launch/rebrand/scale/repositioning): ');

    this.data.businessContext = {
      businessStage: stageAnswer as any || 'startup',
      primaryGoal: goalAnswer as any || 'launch',
      currentRevenue: await this.ask('3. Current monthly/annual revenue (optional): ') || undefined,
      fundingStage: await this.ask('4. Funding stage (bootstrap/seed/Series A/etc): ') || undefined,
      keyMetrics: await this.askMultiple('5. Key metrics you track'),
    };

    // Section 3: Target Audience
    console.log('\n👥 SECTION 3/12: TARGET AUDIENCE (DEEP DIVE)');
    console.log('──────────────────────────────────────────────\n');

    this.data.targetAudience = {
      primaryAudience: await this.ask('1. Describe your primary target audience: '),
      ageRange: await this.ask('2. Age range: '),
      incomeLevel: await this.ask('3. Income level: '),
      geography: await this.ask('4. Geographic focus: '),
      psychographics: await this.askMultiple('5. Psychographic traits (values, lifestyle, interests)'),
      painPoints: await this.askMultiple('6. Main pain points your audience faces'),
      desires: await this.askMultiple('7. What does your audience desire/aspire to'),
      buyingBehavior: await this.ask('8. Describe their buying behavior: '),
    };

    // Section 4: Competitive Landscape
    console.log('\n🏆 SECTION 4/12: COMPETITIVE LANDSCAPE');
    console.log('──────────────────────────────────────\n');

    const numCompetitors = parseInt(await this.ask('How many direct competitors to analyze? (1-5): ')) || 3;
    const competitors = [];

    for (let i = 0; i < Math.min(numCompetitors, 5); i++) {
      console.log(`\nCompetitor ${i + 1}:`);
      competitors.push({
        name: await this.ask(`  Name: `),
        url: await this.ask(`  Website (optional): `) || undefined,
        strengths: await this.ask(`  Their strengths: `),
        weaknesses: await this.ask(`  Their weaknesses: `),
      });
    }

    this.data.competitive = {
      directCompetitors: competitors,
      indirectCompetitors: await this.askMultiple('Indirect competitors'),
      marketPosition: await this.ask('How do you position vs competitors? '),
      uniqueAdvantage: await this.ask('What\'s your unique competitive advantage? '),
    };

    // Section 5: Current Brand State
    console.log('\n🎨 SECTION 5/12: CURRENT BRAND IDENTITY');
    console.log('───────────────────────────────────────\n');

    this.data.currentBrand = {
      hasLogo: await this.askYesNo('Do you have a logo?'),
      hasStyleGuide: await this.askYesNo('Do you have a brand style guide?'),
      hasBrandColors: await this.askYesNo('Do you have defined brand colors?'),
      currentTagline: await this.ask('Current tagline (if any): ') || undefined,
      brandVoice: await this.ask('Current brand voice/tone (if defined): ') || undefined,
      existingAssets: await this.askMultiple('Existing brand assets (logos, photos, etc)'),
      whatWorks: await this.askMultiple('What works well in your current branding'),
      whatDoesntWork: await this.askMultiple('What doesn\'t work or needs improvement'),
    };

    // Section 6: Brand Aspirations
    console.log('\n✨ SECTION 6/12: BRAND ASPIRATIONS');
    console.log('──────────────────────────────────\n');

    this.data.aspirations = {
      desiredPerception: await this.ask('How do you want to be perceived? '),
      brandPersonality: await this.askMultiple('Brand personality traits (innovative, trustworthy, fun, etc)'),
      coreValues: await this.askMultiple('Core brand values (3-5 values)'),
      missionStatement: await this.ask('Mission statement (what you do): ') || undefined,
      visionStatement: await this.ask('Vision statement (where you\'re going): ') || undefined,
      brandStory: await this.ask('Tell your brand story (origin, why you exist): '),
    };

    // Section 7: Products/Services
    console.log('\n📦 SECTION 7/12: PRODUCTS/SERVICES');
    console.log('──────────────────────────────────\n');

    this.data.offerings = {
      primaryProducts: await this.askMultiple('Primary products/services'),
      keyFeatures: await this.askMultiple('Key features/benefits'),
      pricingStrategy: await this.ask('Pricing strategy (premium/mid-range/value): '),
      uniqueSellingPoints: await this.askMultiple('Unique selling points (USPs)'),
      productionProcess: await this.ask('Production/delivery process (optional): ') || undefined,
    };

    // Section 8: Marketing & Distribution
    console.log('\n📢 SECTION 8/12: MARKETING & DISTRIBUTION');
    console.log('─────────────────────────────────────────\n');

    this.data.marketing = {
      currentChannels: await this.askMultiple('Current marketing channels'),
      mostEffectiveChannel: await this.ask('Most effective channel (if known): ') || undefined,
      socialMediaPresence: {
        instagram: await this.ask('Instagram handle: ') || undefined,
        facebook: await this.ask('Facebook page: ') || undefined,
        linkedin: await this.ask('LinkedIn page: ') || undefined,
        twitter: await this.ask('Twitter handle: ') || undefined,
      },
      contentStrategy: await this.ask('Current content strategy (if any): ') || undefined,
      influencerPartnerships: await this.askYesNo('Working with influencers?'),
    };

    // Section 9: Budget & Resources
    console.log('\n💰 SECTION 9/12: BUDGET & RESOURCES');
    console.log('───────────────────────────────────\n');

    this.data.resources = {
      brandingBudget: await this.ask('Branding budget for next 12 months: '),
      timeline: await this.ask('Timeline for brand development: '),
      internalTeam: await this.askMultiple('Internal team members involved'),
      externalPartners: await this.askMultiple('External partners/agencies (if any)'),
      technologyStack: await this.askMultiple('Technology stack (optional)') || undefined,
    };

    // Section 10: Success Metrics
    console.log('\n📊 SECTION 10/12: SUCCESS METRICS');
    console.log('──────────────────────────────────\n');

    this.data.successMetrics = {
      shortTermGoals: await this.askMultiple('Short-term goals (3-6 months)'),
      longTermGoals: await this.askMultiple('Long-term goals (12+ months)'),
      kpis: await this.askMultiple('Key Performance Indicators (KPIs)'),
      targetMetrics: {},
    };

    const numMetrics = parseInt(await this.ask('How many specific targets to set? (0-5): ')) || 0;
    for (let i = 0; i < Math.min(numMetrics, 5); i++) {
      const metricName = await this.ask(`  Metric ${i + 1} name: `);
      const metricTarget = await this.ask(`  Target value: `);
      this.data.successMetrics.targetMetrics[metricName] = metricTarget;
    }

    // Section 11: SWOT Analysis
    console.log('\n🔍 SECTION 11/12: SWOT ANALYSIS');
    console.log('───────────────────────────────────\n');

    this.data.swot = {
      strengths: await this.askMultiple('Internal strengths'),
      weaknesses: await this.askMultiple('Internal weaknesses'),
      opportunities: await this.askMultiple('External opportunities'),
      threats: await this.askMultiple('External threats'),
    };

    // Section 12: Additional Context
    console.log('\n📝 SECTION 12/12: ADDITIONAL CONTEXT');
    console.log('────────────────────────────────────\n');

    this.data.additional = {
      industryRegulations: await this.askMultiple('Industry regulations (if any)') || undefined,
      seasonality: await this.ask('Seasonality factors (optional): ') || undefined,
      sustainabilityFocus: await this.ask('Sustainability initiatives (optional): ') || undefined,
      socialImpact: await this.ask('Social impact goals (optional): ') || undefined,
      culturalContext: await this.ask('Cultural context/considerations (optional): ') || undefined,
      additionalNotes: await this.askMultiple('Any additional notes or context'),
    };

    console.log('\n✅ INTERVIEW COMPLETE!');
    console.log('══════════════════════\n');

    return this.data as BrandDiscoveryData;
  }

  async saveData(data: BrandDiscoveryData, filename?: string): Promise<string> {
    const timestamp = new Date().toISOString().split('T')[0];
    const brandSlug = data.basicInfo.brandName.toLowerCase().replace(/\s+/g, '-');
    const filepath = filename || join(process.cwd(), `brand-discovery-${brandSlug}-${timestamp}.json`);

    await writeFile(filepath, JSON.stringify(data, null, 2));
    return filepath;
  }

  close() {
    this.rl.close();
  }
}

// CLI execution
async function main() {
  const interview = new BrandDiscoveryInterview();

  try {
    const data = await interview.conductInterview();
    const filepath = await interview.saveData(data);

    console.log(`\n📁 Discovery data saved to: ${filepath}`);
    console.log('\n🚀 Next steps:');
    console.log('   1. Review the saved JSON file');
    console.log('   2. Run: npm run generate:brand -- --discovery=' + filepath);
    console.log('   3. Get your comprehensive brand book!\n');
  } catch (error) {
    console.error('Error during interview:', error);
  } finally {
    interview.close();
  }
}

if (import.meta.url.startsWith('file://')) {
  const modulePath = new URL(import.meta.url).pathname;
  if (process.argv[1] === modulePath) {
    main();
  }
}

export default BrandDiscoveryInterview;
