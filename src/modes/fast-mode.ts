#!/usr/bin/env node
// Fast Mode - 2-5 minute brand book generation

import { LLMFactory } from '../adapters/llm-interface.js';
import { BrandDesignOrchestrator } from '../agents/orchestrator.js';
import { BrandClassifier } from '../utils/brand-classifier.js';
import { initializeLLMService } from '../services/llm-service.js';
import type { BrandProfile } from '../types/brand-types.js';

interface FastModeOptions {
  brandName?: string;
  industry?: string;
  targetAudience?: string;
  businessStage?: 'startup' | 'growth' | 'established' | 'rebrand';
  primaryGoal?: 'launch' | 'refresh' | 'reposition' | 'scale';
  website?: string;
  additionalContext?: string;
}

export class FastMode {
  private orchestrator: BrandDesignOrchestrator;

  constructor(
    private llmProvider: 'claude' | 'openai' = 'claude',
    private model: string = 'claude-sonnet-4-20250514'
  ) {
    const llmConfig = {
      provider: this.llmProvider,
      model: this.model,
      temperature: 0.7,
      maxTokens: 4000,
    };

    const llm = LLMFactory.create(llmConfig);
    this.orchestrator = new BrandDesignOrchestrator(llm);
  }

  async run(options: FastModeOptions) {
    console.log('\n🚀 Brand Builder Pro - Fast Mode\n');
    console.log('⚡ Generate complete brand books in 2-5 minutes\n');

    // Initialize V2.0 Intelligent Accuracy System
    await initializeLLMService();

    // Create brand profile
    const brandProfile: Partial<BrandProfile> = {
      brandName: options.brandName || 'Your Brand',
      industry: options.industry || 'General',
      targetAudience: options.targetAudience || 'General consumers',
      businessStage: options.businessStage || 'growth',
      primaryGoal: options.primaryGoal || 'refresh',
      website: options.website,
      additionalContext: options.additionalContext,
    };

    // Auto-detect brand type
    const brandType = BrandClassifier.classify(brandProfile);
    console.log(`🔍 Auto-detected brand type: ${brandType}\n`);

    const completeBrandProfile: BrandProfile = {
      ...brandProfile,
      brandType,
    } as BrandProfile;

    // Run Fast Mode workflow
    const startTime = Date.now();

    console.log('📊 Running Fast Mode workflow...\n');
    console.log('  Phase 1: Market Research (30-60 sec)');
    console.log('  Phase 2: Brand Audit (30-60 sec)');
    console.log('  Phase 3: Strategy Development (60-180 sec)\n');

    const output = await this.orchestrator.runBrandDesignWorkflow(completeBrandProfile);

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n✅ Fast Mode completed!\n');
    console.log(`⏱️  Total time: ${duration} seconds\n`);
    console.log('📁 Outputs saved in: outputs/' + brandProfile.brandName?.toLowerCase().replace(/\s+/g, '-') + '/\n');
    console.log('📄 Key deliverables:');
    console.log('  - Complete Brand Book (brand-book.md)');
    console.log('  - Research Report (02-research/)');
    console.log('  - Brand Audit (03-audit/)');
    console.log('  - Brand Strategy (04-strategy/)\n');

    return output;
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const options: FastModeOptions = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '');
    const value = args[i + 1];

    if (key && value) {
      switch (key) {
        case 'brand':
        case 'name':
          options.brandName = value;
          break;
        case 'industry':
          options.industry = value;
          break;
        case 'audience':
          options.targetAudience = value;
          break;
        case 'stage':
          options.businessStage = value as any;
          break;
        case 'goal':
          options.primaryGoal = value as any;
          break;
        case 'website':
          options.website = value;
          break;
        case 'context':
          options.additionalContext = value;
          break;
      }
    }
  }

  // Show usage if no brand name provided
  if (!options.brandName) {
    console.log(`
Brand Builder Pro - Fast Mode

Generate complete brand books in 2-5 minutes

Usage:
  npm run fast -- --brand "Brand Name" [options]

Options:
  --brand <name>        Brand name (required)
  --industry <name>     Industry/category
  --audience <desc>     Target audience description
  --stage <stage>       Business stage: startup, growth, established, rebrand
  --goal <goal>         Primary goal: launch, refresh, reposition, scale
  --website <url>       Website URL
  --context <text>      Additional context

Examples:
  npm run fast -- --brand "Flyberry" --industry "E-commerce Fashion" --website "https://flyberry.in"
  npm run fast -- --brand "TechCorp" --industry "B2B SaaS" --stage "startup" --goal "launch"

Features:
  ✅ V2.0 Intelligent Accuracy (source quality, fact-checking, confidence scoring)
  ✅ Adaptive workflows based on brand type
  ✅ Complete brand strategy in 2-5 minutes
  ✅ Research, Audit, and Strategy deliverables
    `);
    process.exit(1);
  }

  const fastMode = new FastMode();
  await fastMode.run(options);
}

// Run CLI if executed directly
if (import.meta.url.startsWith('file://')) {
  const modulePath = decodeURIComponent(new URL(import.meta.url).pathname);
  if (process.argv[1] && modulePath === process.argv[1]) {
    main().catch((error) => {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    });
  }
}

export default FastMode;
