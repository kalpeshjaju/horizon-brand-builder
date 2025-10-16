#!/usr/bin/env node
// Professional Mode - Consulting-grade brand development with 77-subtopic research

import { LLMFactory } from '../adapters/llm-interface.js';
import { BrandDesignOrchestrator } from '../agents/orchestrator.js';
import { BrandClassifier } from '../utils/brand-classifier.js';
import { initializeLLMService } from '../services/llm-service.js';
import { ProjectManagementDashboard } from './pm-dashboard.js';
import { BrandDiscoveryAgent } from '../agents/brand-discovery-agent.js';
import { DataQualityManager } from '../services/data-quality-manager.js';
import { EnhancedReportGenerator } from '../services/enhanced-report-generator.js';
import type { BrandProfile } from '../types/brand-types.js';
import type { BrandConfiguration } from '../types/project-types.js';

interface ProfessionalModeOptions {
  brandName?: string;
  industry?: string;
  targetAudience?: string;
  businessStage?: 'startup' | 'growth' | 'established' | 'rebrand';
  primaryGoal?: 'launch' | 'refresh' | 'reposition' | 'scale';
  website?: string;
  additionalContext?: string;
  enableTracking?: boolean;
}

export class ProfessionalMode {
  private orchestrator: BrandDesignOrchestrator;
  private projectDashboard?: ProjectManagementDashboard;

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

  async run(options: ProfessionalModeOptions) {
    console.log('\n🏢 Brand Builder Pro - Professional Mode\n');
    console.log('🎯 Consulting-grade brand development with deep research\n');
    console.log('📊 64 deliverables across 5 phases\n');
    console.log('🔬 77-subtopic research system\n');
    console.log('📈 Project management tracking\n');

    // Initialize project management if enabled
    if (options.enableTracking !== false) {
      this.projectDashboard = new ProjectManagementDashboard();
      await this.projectDashboard.initialize();
      console.log('✅ Project management dashboard initialized\n');
    }

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

    // Run Professional Mode workflow
    const startTime = Date.now();

    console.log('📊 Running Professional Mode workflow...\n');
    console.log('  Phase 0: Brand Discovery & Verification (NEW)');
    console.log('  Phase 1: Deep Market Research (Extended)');
    console.log('  Phase 2: Comprehensive Brand Audit');
    console.log('  Phase 3: Strategic Brand Development');
    console.log('  Phase 4: Report Generation with Citations\n');

    console.log('⚡ This may take several minutes depending on research depth...\n');

    // Phase 0: Brand Discovery (NEW)
    console.log('🔍 Phase 0: Brand Discovery & Data Verification...\n');
    const llm = LLMFactory.create({
      provider: this.llmProvider,
      model: this.model,
      temperature: 0.7,
      maxTokens: 4000,
    });

    const discoveryAgent = new BrandDiscoveryAgent(llm);

    // Convert BrandProfile to BrandConfiguration
    const brandConfig: BrandConfiguration = {
      brandName: completeBrandProfile.brandName,
      industry: completeBrandProfile.industry,
      category: completeBrandProfile.targetAudience || 'General',
      companyProfile: {
        website: completeBrandProfile.website,
        founded: 2020, // Default, will be updated by discovery
        currentRevenue: 'Unknown',
        channels: [],
      },
      projectObjectives: {
        primary: `${completeBrandProfile.primaryGoal} for ${completeBrandProfile.brandName}`,
        goals: [],
      },
    };

    const discoveryReport = await discoveryAgent.discoverBrand(brandConfig);
    console.log('✅ Brand Discovery complete\n');

    // Phase 1-3: Run core strategy workflow
    console.log('📊 Phase 1-3: Strategic Brand Development...\n');
    const output = await this.orchestrator.runBrandDesignWorkflow(completeBrandProfile);

    // Phase 4: Enhanced Report Generation (NEW)
    console.log('\n📝 Phase 4: Generating Enhanced Reports with Citations...\n');

    const outputDir = `outputs/${brandProfile.brandName?.toLowerCase().replace(/\s+/g, '-') || 'brand'}`;

    const reportGenerator = new EnhancedReportGenerator(
      brandConfig,
      discoveryReport,
      output,
      outputDir
    );

    const { markdown, html } = await reportGenerator.generate();
    console.log('✅ Enhanced reports generated with verified data\n');

    // Update project tracking
    if (this.projectDashboard) {
      console.log('📊 Updating project dashboard...\n');

      // Mark initial deliverables as in-progress
      await this.projectDashboard.updateDeliverable('phase1', 'Brand Audit Report', {
        status: 'in-progress',
      });
      await this.projectDashboard.updateDeliverable('phase1', 'Competitive Landscape Analysis', {
        status: 'in-progress',
      });
      await this.projectDashboard.updateDeliverable('phase1', 'Brand Strategy Document', {
        status: 'in-progress',
      });

      // Generate dashboard
      await this.projectDashboard.generateDashboard();
    }

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

    console.log('\n✅ Professional Mode Complete!\n');
    console.log(`⏱️  Total time: ${duration} minutes\n`);
    console.log('📁 Outputs saved in: ' + outputDir + '/\n');
    console.log('📄 Deliverables generated:');
    console.log('  ✅ Part 1: Brand Discovery with verified data');
    console.log('    - Company information (from ' + (brandConfig.companyProfile?.website || 'config') + ')');
    console.log('    - Product catalog with prices (all sourced)');
    console.log('    - Distribution channel map');
    console.log('    - Customer feedback');
    console.log('    - Business metrics\n');
    console.log('  ✅ Part 2: Brand Strategy');
    console.log('    - Competitive Landscape Analysis');
    console.log('    - Brand Positioning & Architecture');
    console.log('    - Customer Personas');
    console.log('    - Messaging Framework\n');
    console.log('  ✅ Data Verification');
    console.log('    - Quality Score: ' + discoveryReport.verificationLog.averageConfidence + '/100');
    console.log('    - Total Data Points: ' + discoveryReport.verificationLog.totalDataPoints);
    console.log('    - Verified: ' + discoveryReport.verificationLog.verified);
    console.log('    - All data with sources + dates + confidence scores\n');
    console.log('📊 Reports:');
    console.log('  - brand-book.md (Complete markdown report)');
    console.log('  - brand-book.html (Styled HTML version)');
    console.log('  - DATA-VERIFICATION-LOG.md (Standalone verification log)\n');

    if (this.projectDashboard) {
      console.log('📊 Project Dashboard: output/project-dashboard.md\n');
    }

    console.log('📋 Next Steps:');
    console.log('  1. Review generated brand strategy');
    console.log('  2. Conduct deep research: npm run research');
    console.log('  3. Track progress: npm run pm:dashboard status');
    console.log('  4. Generate updated dashboard: npm run pm:dashboard dashboard\n');

    return output;
  }

  async runPhase(phaseNumber: 1 | 2 | 3 | 4 | 5) {
    console.log(`\n🏢 Professional Mode - Phase ${phaseNumber}\n`);

    switch (phaseNumber) {
      case 1:
        console.log('📊 Phase 1: Brand Strategy & Positioning\n');
        console.log('Deliverables:');
        console.log('  - Brand Audit Report');
        console.log('  - Competitive Landscape Analysis');
        console.log('  - Customer Perception Study');
        console.log('  - Category Trends Report');
        console.log('  - Brand Strategy Document');
        console.log('  - Brand Positioning Statement');
        console.log('  - Target Audience Personas');
        console.log('  - Brand Architecture\n');
        break;

      case 2:
        console.log('🎨 Phase 2: Brand Expression & Identity\n');
        console.log('Deliverables:');
        console.log('  - Brand Story & Messaging');
        console.log('  - Logo System');
        console.log('  - Color Palette & Typography');
        console.log('  - Photography Style Guide');
        console.log('  - Social Media Templates');
        console.log('  - Packaging Design System');
        console.log('  - Channel Architecture Strategy\n');
        break;

      case 3:
        console.log('💎 Phase 3: Brand Experience Design\n');
        console.log('Deliverables:');
        console.log('  - Customer Journey Maps');
        console.log('  - Store Design Concept');
        console.log('  - Website UX/UI Recommendations');
        console.log('  - Social Media Strategy');
        console.log('  - Content Calendar Template');
        console.log('  - Influencer Marketing Playbook\n');
        break;

      case 4:
        console.log('🚀 Phase 4: Brand Activation & Launch\n');
        console.log('Deliverables:');
        console.log('  - Brand Launch Plan');
        console.log('  - Performance Marketing Strategy');
        console.log('  - CRM & Lifecycle Framework');
        console.log('  - Corporate Gifting Catalogue');
        console.log('  - Brand Guidelines Manual\n');
        break;

      case 5:
        console.log('📈 Phase 5: Implementation Support\n');
        console.log('Deliverables:');
        console.log('  - Monthly Consultation Calls');
        console.log('  - Quarterly Brand Health Reviews');
        console.log('  - Innovation Framework');
        console.log('  - NPD Launch Playbook\n');
        break;
    }

    console.log('⚠️  Full phase implementation coming in next update\n');
    console.log('For now, use Fast Mode for complete brand strategy generation\n');
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const options: ProfessionalModeOptions = {};
  let phaseNumber: number | undefined;

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const value = args[i + 1];

    if (arg === '--phase' && value) {
      phaseNumber = parseInt(value, 10);
      i++;
    } else if (arg.startsWith('--')) {
      const key = arg.replace(/^--/, '');

      switch (key) {
        case 'brand':
        case 'name':
          options.brandName = value;
          i++;
          break;
        case 'industry':
          options.industry = value;
          i++;
          break;
        case 'audience':
          options.targetAudience = value;
          i++;
          break;
        case 'stage':
          options.businessStage = value as any;
          i++;
          break;
        case 'goal':
          options.primaryGoal = value as any;
          i++;
          break;
        case 'website':
          options.website = value;
          i++;
          break;
        case 'context':
          options.additionalContext = value;
          i++;
          break;
        case 'no-tracking':
          options.enableTracking = false;
          break;
      }
    }
  }

  const professionalMode = new ProfessionalMode();

  // Run specific phase if specified
  if (phaseNumber) {
    if (phaseNumber >= 1 && phaseNumber <= 5) {
      await professionalMode.runPhase(phaseNumber as 1 | 2 | 3 | 4 | 5);
    } else {
      console.error('Error: Phase must be between 1 and 5');
      process.exit(1);
    }
    return;
  }

  // Show usage if no brand name provided
  if (!options.brandName) {
    console.log(`
Brand Builder Pro - Professional Mode

Consulting-grade brand development with 77-subtopic research and project management

Usage:
  npm run professional -- --brand "Brand Name" [options]

Options:
  --brand <name>        Brand name (required)
  --industry <name>     Industry/category
  --audience <desc>     Target audience description
  --stage <stage>       Business stage: startup, growth, established, rebrand
  --goal <goal>         Primary goal: launch, refresh, reposition, scale
  --website <url>       Website URL
  --context <text>      Additional context
  --phase <1-5>         Run specific phase only
  --no-tracking         Disable project management tracking

Examples:
  npm run professional -- --brand "Flyberry" --industry "E-commerce Fashion"
  npm run professional -- --brand "TechCorp" --stage "startup" --goal "launch"
  npm run professional -- --phase 2

Features:
  ✅ 64 deliverables across 5 phases
  ✅ 77-subtopic research system
  ✅ V2.0 Intelligent Accuracy (source quality, fact-checking, confidence scoring)
  ✅ Project management dashboard
  ✅ Extended research and strategic depth
  ✅ Consulting-grade documentation

Phases:
  Phase 1: Brand Strategy & Positioning (6-8 weeks)
  Phase 2: Brand Expression & Identity (8-10 weeks)
  Phase 3: Brand Experience Design (12-14 weeks)
  Phase 4: Brand Activation & Launch (8-10 weeks)
  Phase 5: Implementation Support (6-12 months)

Project Management:
  npm run pm:dashboard status      - Quick status check
  npm run pm:dashboard dashboard   - Generate full dashboard
  npm run pm:dashboard update      - Update deliverable status
    `);
    process.exit(1);
  }

  await professionalMode.run(options);
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

export default ProfessionalMode;
