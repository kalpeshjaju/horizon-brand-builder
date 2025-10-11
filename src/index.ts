// Main entry point for Brand Design Agent

import { LLMFactory } from './adapters/llm-interface.js';
import { BrandDesignOrchestrator } from './agents/orchestrator.js';
import { BrandClassifier } from './utils/brand-classifier.js';
import { initializeLLMService } from './services/llm-service.js';
import type { BrandProfile } from './types/brand-types.js';

async function main() {
  // Initialize ManagedLLMService with automatic quality control
  await initializeLLMService();

  // Configure LLM (Direct Claude API with V2.0 intelligence)
  const llmConfig = {
    provider: 'claude' as const,
    model: 'claude-sonnet-4-20250514',
    temperature: 0.7,
    maxTokens: 4000,
  };

  const llm = LLMFactory.create(llmConfig);

  // Create brand profile for flyberry.in
  const brandProfile: Partial<BrandProfile> = {
    brandName: 'Flyberry',
    industry: 'E-commerce Fashion (Resale/Pre-loved luxury)',
    targetAudience: 'B2C consumers interested in luxury fashion resale',
    businessStage: 'growth',
    primaryGoal: 'reposition',
    website: 'https://flyberry.in',
    additionalContext: 'Flyberry is a curated marketplace for pre-loved luxury fashion and lifestyle products, focusing on sustainability and accessibility to luxury.',
  };

  // Classify brand type
  const brandType = BrandClassifier.classify(brandProfile);
  console.log(`\n🔍 Auto-detected brand type: ${brandType}\n`);

  const completeBrandProfile: BrandProfile = {
    ...brandProfile,
    brandType,
  } as BrandProfile;

  // Run workflow
  const orchestrator = new BrandDesignOrchestrator(llm);
  await orchestrator.runBrandDesignWorkflow(completeBrandProfile);

  console.log('\n✅ Brand design workflow completed!\n');
  console.log('📁 Outputs saved in: outputs/flyberry/\n');
  console.log('Key deliverables:');
  console.log('  - Brand Book: outputs/flyberry/brand-book.md');
  console.log('  - Research: outputs/flyberry/02-research/');
  console.log('  - Audit: outputs/flyberry/03-audit/');
  console.log('  - Strategy: outputs/flyberry/04-strategy/\n');
}

main().catch(console.error);
