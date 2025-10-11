#!/usr/bin/env node
/**
 * Specialized Agents Runner
 *
 * Runs all 3 specialized agents and audits their outputs
 * Designed to work with horizon-brand-builder strategy outputs
 */

import { initializeLLMService } from '../services/llm-service.js';
import {
  ContentCopywritingAgent,
  SocialMediaAgent,
  LaunchCampaignAgent,
  AgentAuditFramework,
} from '../agents/specialized/index.js';
import type { AgentInput } from '../types/specialized-agent-types.js';
import type { BrandProfile, BrandStrategy } from '../types/brand-types.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

interface SpecializedAgentsOptions {
  brandProfile: BrandProfile;
  brandStrategy?: BrandStrategy;
  enableAudit?: boolean;
  contentCalendarDays?: number;
  launchWeeks?: number;
}

export class SpecializedAgentsRunner {
  private contentAgent: ContentCopywritingAgent;
  private socialAgent: SocialMediaAgent;
  private launchAgent: LaunchCampaignAgent;
  private auditFramework: AgentAuditFramework;

  constructor() {
    this.contentAgent = new ContentCopywritingAgent();
    this.socialAgent = new SocialMediaAgent();
    this.launchAgent = new LaunchCampaignAgent();
    this.auditFramework = new AgentAuditFramework();
  }

  /**
   * Run all specialized agents
   */
  async runAll(options: SpecializedAgentsOptions): Promise<void> {
    console.log('\n🎨 Specialized Agents Runner\n');
    console.log(`Brand: ${options.brandProfile.brandName}`);
    console.log(`Industry: ${options.brandProfile.industry}\n`);

    // Initialize LLM service
    await initializeLLMService();

    const agentInput: AgentInput = {
      brandProfile: options.brandProfile,
      brandStrategy: options.brandStrategy,
    };

    // Run all agents in parallel
    console.log('🚀 Running all specialized agents in parallel...\n');

    const [contentOutput, socialOutput, launchOutput] = await Promise.all([
      this.contentAgent.generateContent(agentInput),
      this.socialAgent.generateSocialMediaContent(
        agentInput,
        options.contentCalendarDays || 30
      ),
      this.launchAgent.generateLaunchCampaign(
        agentInput,
        options.launchWeeks || 6
      ),
    ]);

    // Save outputs
    await this.saveOutputs(options.brandProfile.brandName, {
      content: contentOutput,
      social: socialOutput,
      launch: launchOutput,
    });

    // Run audits if enabled
    if (options.enableAudit !== false) {
      console.log('\n🔍 Running audits...\n');

      const [contentAudit, socialAudit, launchAudit] = await Promise.all([
        this.auditFramework.auditAgent(
          'Content & Copywriting Agent',
          contentOutput,
          options.brandStrategy
        ),
        this.auditFramework.auditAgent(
          'Social Media Manager Agent',
          socialOutput,
          options.brandStrategy
        ),
        this.auditFramework.auditAgent(
          'Launch Campaign Agent',
          launchOutput,
          options.brandStrategy
        ),
      ]);

      // Save audit reports
      await this.saveAuditReports(options.brandProfile.brandName, {
        content: contentAudit,
        social: socialAudit,
        launch: launchAudit,
      });

      // Print summary
      this.printSummary({
        content: contentAudit,
        social: socialAudit,
        launch: launchAudit,
      });
    }

    console.log('\n✅ All specialized agents completed successfully!\n');
    console.log(`📁 Outputs saved to: output/${this.slugify(options.brandProfile.brandName)}/specialized-agents/\n`);
  }

  /**
   * Save agent outputs
   */
  private async saveOutputs(
    brandName: string,
    outputs: {
      content: any;
      social: any;
      launch: any;
    }
  ): Promise<void> {
    const brandSlug = this.slugify(brandName);
    const baseDir = join(process.cwd(), 'output', brandSlug, 'specialized-agents');

    // Create directories
    await mkdir(baseDir, { recursive: true });

    // Save each output
    await Promise.all([
      writeFile(
        join(baseDir, 'content-copywriting-output.json'),
        JSON.stringify(outputs.content, null, 2)
      ),
      writeFile(
        join(baseDir, 'social-media-output.json'),
        JSON.stringify(outputs.social, null, 2)
      ),
      writeFile(
        join(baseDir, 'launch-campaign-output.json'),
        JSON.stringify(outputs.launch, null, 2)
      ),
    ]);

    console.log(`\n✅ Agent outputs saved to ${baseDir}\n`);
  }

  /**
   * Save audit reports
   */
  private async saveAuditReports(
    brandName: string,
    reports: {
      content: any;
      social: any;
      launch: any;
    }
  ): Promise<void> {
    const brandSlug = this.slugify(brandName);
    const baseDir = join(process.cwd(), 'output', brandSlug, 'specialized-agents', 'audits');

    // Create directory
    await mkdir(baseDir, { recursive: true });

    // Save each report
    await Promise.all([
      writeFile(
        join(baseDir, 'content-agent-audit.json'),
        JSON.stringify(reports.content, null, 2)
      ),
      writeFile(
        join(baseDir, 'social-agent-audit.json'),
        JSON.stringify(reports.social, null, 2)
      ),
      writeFile(
        join(baseDir, 'launch-agent-audit.json'),
        JSON.stringify(reports.launch, null, 2)
      ),
    ]);

    console.log(`\n✅ Audit reports saved to ${baseDir}\n`);
  }

  /**
   * Print audit summary
   */
  private printSummary(reports: {
    content: any;
    social: any;
    launch: any;
  }): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 AUDIT SUMMARY');
    console.log('='.repeat(60) + '\n');

    const agents = [
      { name: 'Content & Copywriting', report: reports.content },
      { name: 'Social Media Manager', report: reports.social },
      { name: 'Launch Campaign', report: reports.launch },
    ];

    agents.forEach((agent) => {
      const emoji = agent.report.verdict === 'PASS' ? '✅' : '⚠️';
      console.log(`${emoji} ${agent.name}`);
      console.log(`   Score: ${agent.report.overallScore}/10 (${agent.report.category})`);
      console.log(`   Verdict: ${agent.report.verdict}`);
      console.log('');
    });

    const avgScore = (reports.content.overallScore + reports.social.overallScore + reports.launch.overallScore) / 3;
    console.log(`Average Score: ${avgScore.toFixed(1)}/10`);
    console.log('='.repeat(60) + '\n');
  }

  /**
   * Helper: Slugify brand name
   */
  private slugify(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }
}

/**
 * CLI runner
 */
async function main() {
  const args = process.argv.slice(2);
  const brandName = args.find((arg) => arg.startsWith('--brand'))?.split('=')[1] || 'Test Brand';
  const industry = args.find((arg) => arg.startsWith('--industry'))?.split('=')[1] || 'General';

  const runner = new SpecializedAgentsRunner();

  const brandProfile: BrandProfile = {
    brandName,
    industry,
    targetAudience: 'General consumers',
    businessStage: 'growth',
    primaryGoal: 'launch',
    brandType: 'b2c_consumer',
  };

  await runner.runAll({
    brandProfile,
    enableAudit: true,
    contentCalendarDays: 30,
    launchWeeks: 6,
  });
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
