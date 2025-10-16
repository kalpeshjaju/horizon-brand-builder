// Quick test of BrandDiscoveryAgent and EnhancedReportGenerator
import { LLMFactory } from './src/adapters/llm-interface.js';
import { BrandDiscoveryAgent } from './src/agents/brand-discovery-agent.js';
import { EnhancedReportGenerator } from './src/services/enhanced-report-generator.js';
import type { BrandConfiguration } from './src/types/project-types.js';
import { mkdir } from 'fs/promises';

const brandConfig: BrandConfiguration = {
  brandName: 'Flyberry Gourmet',
  industry: 'Food & Beverage',
  category: 'Healthy Snacks',
  companyProfile: {
    website: 'https://flyberry.in',
    founded: 2015,
    currentRevenue: 'Unknown',
    channels: ['D2C Website', 'Amazon', 'Blinkit', 'Swiggy Instamart'],
  },
  projectObjectives: {
    primary: 'Build omnichannel brand presence for premium healthy snacks',
    goals: [
      'Increase brand awareness',
      'Expand distribution channels',
      'Build customer loyalty',
    ],
  },
};

async function test() {
  console.log('\n🔍 Testing Data Verification Framework\n');
  console.log('═══════════════════════════════════════\n');

  // Initialize LLM
  const llm = LLMFactory.create({
    provider: 'claude',
    model: 'claude-sonnet-4-20250514',
    temperature: 0.7,
    maxTokens: 4000,
  });

  // Run Brand Discovery
  console.log('📊 Phase 1: Brand Discovery...\n');
  const discoveryAgent = new BrandDiscoveryAgent(llm);
  const discoveryReport = await discoveryAgent.discoverBrand(brandConfig);

  console.log('\n✅ Discovery Complete!\n');
  console.log(`   Total Data Points: ${discoveryReport.verificationLog.totalDataPoints}`);
  console.log(`   Verified: ${discoveryReport.verificationLog.verified}`);
  console.log(`   Average Confidence: ${discoveryReport.verificationLog.averageConfidence}%`);
  console.log(`   Products Found: ${discoveryReport.products.length}`);
  console.log(`   Channels Mapped: ${discoveryReport.distribution.channels.length}\n`);

  // Generate Enhanced Report
  console.log('📝 Phase 2: Generating Enhanced Reports...\n');

  const outputDir = './outputs/flyberry-test';
  await mkdir(outputDir, { recursive: true });

  // Create a minimal strategy output for testing
  const mockStrategyOutput = {
    brandStrategy: `## Brand Foundation\n\n**Purpose**: Premium healthy snacks\n**Values**: Quality, Health, Taste\n`,
  };

  const reportGenerator = new EnhancedReportGenerator(
    brandConfig,
    discoveryReport,
    mockStrategyOutput,
    outputDir
  );

  const { markdown, html } = await reportGenerator.generate();

  console.log('✅ Reports Generated!\n');
  console.log(`   Output Directory: ${outputDir}/`);
  console.log(`   Files Created:`);
  console.log(`   - brand-book.md (${Math.round(markdown.length / 1024)}KB)`);
  console.log(`   - brand-book.html (${Math.round(html.length / 1024)}KB)`);
  console.log(`   - DATA-VERIFICATION-LOG.md\n`);

  console.log('🎉 Test Complete! Check outputs/flyberry-test/ for generated files.\n');
}

test().catch(console.error);
