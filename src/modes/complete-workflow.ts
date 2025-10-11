#!/usr/bin/env node
/**
 * Complete Workflow: Professional Mode + Specialized Agents
 *
 * This workflow:
 * 1. Runs horizon-brand-builder professional mode to generate strategy
 * 2. Passes strategy to specialized agents for execution content
 * 3. Runs audit framework to validate quality
 * 4. Generates comprehensive output report
 */

import { LLMFactory } from '../adapters/llm-interface.js';
import { BrandDesignOrchestrator } from '../agents/orchestrator.js';
import { BrandClassifier } from '../utils/brand-classifier.js';
import { initializeLLMService } from '../services/llm-service.js';
import {
  ContentCopywritingAgent,
  SocialMediaAgent,
  LaunchCampaignAgent,
  AgentAuditFramework,
} from '../agents/specialized/index.js';
import type { BrandProfile, BrandDesignOutput } from '../types/brand-types.js';
import type { AgentInput } from '../types/specialized-agent-types.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

interface CompleteWorkflowOptions {
  brandName: string;
  industry: string;
  targetAudience?: string;
  businessStage?: 'startup' | 'growth' | 'established' | 'rebrand';
  primaryGoal?: 'launch' | 'refresh' | 'reposition' | 'scale';
  website?: string;
  additionalContext?: string;
  contentCalendarDays?: number;
  launchWeeks?: number;
}

export class CompleteWorkflow {
  private brandOrchestrator: BrandDesignOrchestrator;
  private contentAgent: ContentCopywritingAgent;
  private socialAgent: SocialMediaAgent;
  private launchAgent: LaunchCampaignAgent;
  private auditFramework: AgentAuditFramework;

  constructor() {
    const llmConfig = {
      provider: 'claude' as const,
      model: 'claude-sonnet-4-20250514',
      temperature: 0.7,
      maxTokens: 4000,
    };

    const llm = LLMFactory.create(llmConfig);
    this.brandOrchestrator = new BrandDesignOrchestrator(llm);
    this.contentAgent = new ContentCopywritingAgent();
    this.socialAgent = new SocialMediaAgent();
    this.launchAgent = new LaunchCampaignAgent();
    this.auditFramework = new AgentAuditFramework();
  }

  async run(options: CompleteWorkflowOptions): Promise<void> {
    console.log('\n🎨 Complete Brand Workflow\n');
    console.log(`Brand: ${options.brandName}`);
    console.log(`Industry: ${options.industry}\n`);
    console.log('═'.repeat(60) + '\n');

    // Initialize LLM service
    await initializeLLMService();

    // ===================================================================
    // STEP 1: Run Professional Mode (Strategy Generation)
    // ===================================================================
    console.log('📊 STEP 1: Generating Brand Strategy (Professional Mode)\n');
    console.log('⏳ This may take several minutes...\n');

    const brandProfile: Partial<BrandProfile> = {
      brandName: options.brandName,
      industry: options.industry,
      targetAudience: options.targetAudience || `${options.industry} consumers`,
      businessStage: options.businessStage || 'growth',
      primaryGoal: options.primaryGoal || 'refresh',
      website: options.website,
      additionalContext: options.additionalContext,
    };

    const brandType = BrandClassifier.classify(brandProfile);
    const completeBrandProfile: BrandProfile = {
      ...brandProfile,
      brandType,
    } as BrandProfile;

    const brandOutput: BrandDesignOutput = await this.brandOrchestrator.runBrandDesignWorkflow(
      completeBrandProfile
    );

    console.log('\n✅ Step 1 Complete: Brand Strategy Generated\n');
    console.log(`   Brand Type: ${brandType}`);
    console.log(`   Purpose: ${brandOutput.brandStrategy.foundation.purpose}`);
    console.log(`   Positioning: ${brandOutput.brandStrategy.positioning.marketPosition}\n`);

    // Save strategy output
    await this.saveBrandStrategy(brandOutput);

    // ===================================================================
    // STEP 2: Run Specialized Agents (Execution Content)
    // ===================================================================
    console.log('═'.repeat(60) + '\n');
    console.log('🚀 STEP 2: Generating Execution Content (Specialized Agents)\n');
    console.log('⏳ Running all agents in parallel...\n');

    const agentInput: AgentInput = {
      brandProfile: completeBrandProfile,
      brandStrategy: brandOutput.brandStrategy,
      researchFindings: brandOutput.researchReport,
      deliverables: {
        auditReport: brandOutput.auditReport,
      },
    };

    const [contentOutput, socialOutput, launchOutput] = await Promise.all([
      this.contentAgent.generateContent(agentInput),
      this.socialAgent.generateSocialMediaContent(agentInput, options.contentCalendarDays || 30),
      this.launchAgent.generateLaunchCampaign(agentInput, options.launchWeeks || 6),
    ]);

    console.log('\n✅ Step 2 Complete: Execution Content Generated\n');

    // Save specialized agent outputs
    await this.saveSpecializedOutputs(options.brandName, {
      content: contentOutput,
      social: socialOutput,
      launch: launchOutput,
    });

    // ===================================================================
    // STEP 3: Run Audit Framework (Quality Validation)
    // ===================================================================
    console.log('═'.repeat(60) + '\n');
    console.log('🔍 STEP 3: Auditing Output Quality\n');

    const [contentAudit, socialAudit, launchAudit] = await Promise.all([
      this.auditFramework.auditAgent(
        'Content & Copywriting Agent',
        contentOutput,
        brandOutput.brandStrategy
      ),
      this.auditFramework.auditAgent(
        'Social Media Manager Agent',
        socialOutput,
        brandOutput.brandStrategy
      ),
      this.auditFramework.auditAgent(
        'Launch Campaign Agent',
        launchOutput,
        brandOutput.brandStrategy
      ),
    ]);

    console.log('\n✅ Step 3 Complete: Quality Audits Generated\n');

    // Save audit reports
    await this.saveAuditReports(options.brandName, {
      content: contentAudit,
      social: socialAudit,
      launch: launchAudit,
    });

    // ===================================================================
    // STEP 4: Generate Final Report
    // ===================================================================
    console.log('═'.repeat(60) + '\n');
    console.log('📄 STEP 4: Generating Final Report\n');

    await this.generateFinalReport(options.brandName, {
      brandOutput,
      contentAudit,
      socialAudit,
      launchAudit,
    });

    // ===================================================================
    // SUMMARY
    // ===================================================================
    console.log('═'.repeat(60) + '\n');
    console.log('🎉 COMPLETE WORKFLOW FINISHED\n');
    console.log('═'.repeat(60) + '\n');

    this.printSummary(options.brandName, {
      content: contentAudit,
      social: socialAudit,
      launch: launchAudit,
    });

    console.log('\n📁 All outputs saved to:');
    console.log(`   ${this.getOutputPath(options.brandName)}\n`);
  }

  private async saveBrandStrategy(brandOutput: BrandDesignOutput): Promise<void> {
    const brandSlug = this.slugify(brandOutput.brandProfile.brandName);
    const baseDir = join(process.cwd(), 'output', brandSlug, 'strategy');

    await mkdir(baseDir, { recursive: true });

    await writeFile(
      join(baseDir, 'brand-strategy.json'),
      JSON.stringify(brandOutput.brandStrategy, null, 2)
    );

    await writeFile(
      join(baseDir, 'research-report.json'),
      JSON.stringify(brandOutput.researchReport, null, 2)
    );

    await writeFile(
      join(baseDir, 'audit-report.json'),
      JSON.stringify(brandOutput.auditReport, null, 2)
    );
  }

  private async saveSpecializedOutputs(
    brandName: string,
    outputs: { content: any; social: any; launch: any }
  ): Promise<void> {
    const brandSlug = this.slugify(brandName);
    const baseDir = join(process.cwd(), 'output', brandSlug, 'execution');

    await mkdir(baseDir, { recursive: true });

    await Promise.all([
      writeFile(join(baseDir, 'content-copywriting-output.json'), JSON.stringify(outputs.content, null, 2)),
      writeFile(join(baseDir, 'social-media-output.json'), JSON.stringify(outputs.social, null, 2)),
      writeFile(join(baseDir, 'launch-campaign-output.json'), JSON.stringify(outputs.launch, null, 2)),
    ]);
  }

  private async saveAuditReports(
    brandName: string,
    reports: { content: any; social: any; launch: any }
  ): Promise<void> {
    const brandSlug = this.slugify(brandName);
    const baseDir = join(process.cwd(), 'output', brandSlug, 'audits');

    await mkdir(baseDir, { recursive: true });

    await Promise.all([
      writeFile(join(baseDir, 'content-agent-audit.json'), JSON.stringify(reports.content, null, 2)),
      writeFile(join(baseDir, 'social-agent-audit.json'), JSON.stringify(reports.social, null, 2)),
      writeFile(join(baseDir, 'launch-agent-audit.json'), JSON.stringify(reports.launch, null, 2)),
    ]);
  }

  private async generateFinalReport(
    brandName: string,
    data: {
      brandOutput: BrandDesignOutput;
      contentAudit: any;
      socialAudit: any;
      launchAudit: any;
    }
  ): Promise<void> {
    const brandSlug = this.slugify(brandName);
    const reportPath = join(process.cwd(), 'output', brandSlug, 'COMPLETE-BRAND-PACKAGE.md');

    const avgScore =
      (data.contentAudit.overallScore + data.socialAudit.overallScore + data.launchAudit.overallScore) / 3;

    const report = `# Complete Brand Package: ${brandName}

**Generated**: ${new Date().toISOString().split('T')[0]}
**Industry**: ${data.brandOutput.brandProfile.industry}
**Brand Type**: ${data.brandOutput.brandProfile.brandType}

---

## 📊 Quality Summary

**Average Quality Score**: ${avgScore.toFixed(1)}/10

| Agent | Score | Verdict |
|-------|-------|---------|
| Content & Copywriting | ${data.contentAudit.overallScore}/10 | ${data.contentAudit.verdict} |
| Social Media Manager | ${data.socialAudit.overallScore}/10 | ${data.socialAudit.verdict} |
| Launch Campaign | ${data.launchAudit.overallScore}/10 | ${data.launchAudit.verdict} |

---

## 📁 Deliverables

### Strategy (horizon-brand-builder)
- \`strategy/brand-strategy.json\` - Complete brand strategy
- \`strategy/research-report.json\` - Market research & insights
- \`strategy/audit-report.json\` - Brand audit results

### Execution Content (specialized agents)
- \`execution/content-copywriting-output.json\` - Website copy, emails, product descriptions
- \`execution/social-media-output.json\` - 30-day content calendar, hashtags, playbook
- \`execution/launch-campaign-output.json\` - 6-week launch plan, press release, checklist

### Quality Reports
- \`audits/content-agent-audit.json\`
- \`audits/social-agent-audit.json\`
- \`audits/launch-agent-audit.json\`

---

## 🎯 Brand Strategy Highlights

**Purpose**: ${data.brandOutput.brandStrategy.foundation.purpose}

**Mission**: ${data.brandOutput.brandStrategy.foundation.mission}

**Positioning**: ${data.brandOutput.brandStrategy.positioning.marketPosition}

**Brand Personality**: ${data.brandOutput.brandStrategy.personality.traits.join(', ')}

**Voice**: ${data.brandOutput.brandStrategy.personality.voiceAndTone.voice}

---

## 📈 Next Steps

1. **Review Strategy**: Read \`strategy/brand-strategy.json\`
2. **Deploy Content**: Use \`execution/content-copywriting-output.json\` for website
3. **Schedule Social**: Use \`execution/social-media-output.json\` for posts
4. **Execute Launch**: Follow \`execution/launch-campaign-output.json\` timeline

---

**Generated by**: horizon-brand-builder + specialized agents
**Status**: Ready for implementation
`;

    await writeFile(reportPath, report);
  }

  private printSummary(
    brandName: string,
    reports: { content: any; social: any; launch: any }
  ): void {
    const avgScore = (reports.content.overallScore + reports.social.overallScore + reports.launch.overallScore) / 3;

    console.log('📊 QUALITY SUMMARY\n');
    console.log(`   Average Score: ${avgScore.toFixed(1)}/10\n`);

    const agents = [
      { name: 'Content & Copywriting', report: reports.content },
      { name: 'Social Media Manager', report: reports.social },
      { name: 'Launch Campaign', report: reports.launch },
    ];

    agents.forEach((agent) => {
      const emoji = agent.report.verdict === 'PASS' ? '✅' : '⚠️';
      console.log(`   ${emoji} ${agent.name}: ${agent.report.overallScore}/10 (${agent.report.category})`);
    });

    console.log('\n📦 DELIVERABLES\n');
    console.log('   Strategy:');
    console.log('     • Brand strategy document');
    console.log('     • Research report');
    console.log('     • Audit report\n');
    console.log('   Execution:');
    console.log('     • Website copy + emails');
    console.log('     • 30-day social calendar');
    console.log('     • 6-week launch plan\n');
    console.log('   Quality:');
    console.log('     • 3 audit reports');
  }

  private getOutputPath(brandName: string): string {
    return join(process.cwd(), 'output', this.slugify(brandName));
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }
}

/**
 * CLI runner
 */
async function main() {
  const args = process.argv.slice(2);
  const brandName = args.find((arg) => arg.startsWith('--brand'))?.split('=')[1];
  const industry = args.find((arg) => arg.startsWith('--industry'))?.split('=')[1];

  if (!brandName || !industry) {
    console.error('Usage: npm run complete -- --brand="Brand Name" --industry="Industry"');
    process.exit(1);
  }

  const workflow = new CompleteWorkflow();

  await workflow.run({
    brandName,
    industry,
    businessStage: 'growth',
    primaryGoal: 'launch',
    contentCalendarDays: 30,
    launchWeeks: 6,
  });
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
