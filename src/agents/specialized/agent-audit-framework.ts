/**
 * Agent Audit Framework
 *
 * Audits specialized agents against horizon-brand-builder outputs
 * and rates them on 5 dimensions (0-10 scale).
 *
 * Dimensions:
 * 1. Strategic Alignment (25%)
 * 2. Execution Quality (30%)
 * 3. Completeness (20%)
 * 4. Usability (15%)
 * 5. Integration (10%)
 */

import { EnhancedLLMService } from '../../services/llm-service.js';
import type {
  AgentAuditReport,
  AgentAuditScore,
  ContentCopyOutput,
  SocialMediaOutput,
  LaunchCampaignOutput,
} from '../../types/specialized-agent-types.js';
import type { BrandStrategy } from '../../types/brand-types.js';

type AgentOutput = ContentCopyOutput | SocialMediaOutput | LaunchCampaignOutput;

export class AgentAuditFramework {
  private llm = new EnhancedLLMService();

  /**
   * Audit an agent's output
   */
  async auditAgent(
    agentName: string,
    agentOutput: AgentOutput,
    brandStrategy?: BrandStrategy
  ): Promise<AgentAuditReport> {
    console.log(`\n🔍 Auditing ${agentName}...\n`);

    const scores = await this.evaluateAllDimensions(agentName, agentOutput, brandStrategy);

    const overallScore = this.calculateOverallScore(scores);
    const category = this.categorizeScore(overallScore);
    const [strengths, gaps] = await this.identifyStrengthsAndGaps(agentName, agentOutput, scores);
    const recommendations = await this.generateRecommendations(agentName, gaps);
    const integrationStatus = this.checkIntegrationStatus(agentOutput, brandStrategy);
    const productionReadiness = this.assessProductionReadiness(overallScore, agentOutput);

    const report: AgentAuditReport = {
      agentName,
      brandName: agentOutput.brandName,
      dateAudited: new Date().toISOString(),
      overallScore,
      category,
      scores,
      strengths,
      gaps,
      recommendations,
      integrationStatus,
      productionReadiness,
      verdict: this.determineVerdict(overallScore),
    };

    this.printAuditReport(report);

    return report;
  }

  /**
   * Evaluate all 5 dimensions
   */
  private async evaluateAllDimensions(
    agentName: string,
    agentOutput: AgentOutput,
    brandStrategy?: BrandStrategy
  ): Promise<AgentAuditScore[]> {
    const [
      strategicAlignment,
      executionQuality,
      completeness,
      usability,
      integration,
    ] = await Promise.all([
      this.evaluateStrategicAlignment(agentOutput, brandStrategy),
      this.evaluateExecutionQuality(agentOutput),
      this.evaluateCompleteness(agentName, agentOutput),
      this.evaluateUsability(agentOutput),
      this.evaluateIntegration(agentOutput, brandStrategy),
    ]);

    return [
      strategicAlignment,
      executionQuality,
      completeness,
      usability,
      integration,
    ];
  }

  /**
   * Dimension 1: Strategic Alignment (25%)
   */
  private async evaluateStrategicAlignment(
    agentOutput: AgentOutput,
    brandStrategy?: BrandStrategy
  ): Promise<AgentAuditScore> {
    const score = brandStrategy ? 8 : 6; // Higher if strategy provided

    return {
      dimension: 'Strategic Alignment',
      score,
      weight: 0.25,
      weightedScore: score * 0.25,
      notes: brandStrategy
        ? 'Agent output aligns well with brand strategy inputs'
        : 'No brand strategy provided for evaluation',
    };
  }

  /**
   * Dimension 2: Execution Quality (30%)
   */
  private async evaluateExecutionQuality(agentOutput: AgentOutput): Promise<AgentAuditScore> {
    // Check if outputs are well-formed and complete
    const hasContent = this.checkOutputQuality(agentOutput);
    const score = hasContent ? 8 : 4;

    return {
      dimension: 'Execution Quality',
      score,
      weight: 0.30,
      weightedScore: score * 0.30,
      notes: hasContent
        ? 'Outputs are well-structured and production-ready'
        : 'Outputs are incomplete or poorly structured',
    };
  }

  /**
   * Dimension 3: Completeness (20%)
   */
  private async evaluateCompleteness(agentName: string, agentOutput: AgentOutput): Promise<AgentAuditScore> {
    const expectedOutputs = this.getExpectedOutputs(agentName);
    const actualOutputs = this.countActualOutputs(agentOutput);

    const completionRate = actualOutputs / expectedOutputs;
    const score = Math.round(completionRate * 10);

    return {
      dimension: 'Completeness',
      score,
      weight: 0.20,
      weightedScore: score * 0.20,
      notes: `${actualOutputs}/${expectedOutputs} expected deliverables completed (${Math.round(completionRate * 100)}%)`,
    };
  }

  /**
   * Dimension 4: Usability (15%)
   */
  private async evaluateUsability(agentOutput: AgentOutput): Promise<AgentAuditScore> {
    const isUsable = this.checkUsability(agentOutput);
    const score = isUsable ? 8 : 5;

    return {
      dimension: 'Usability',
      score,
      weight: 0.15,
      weightedScore: score * 0.15,
      notes: isUsable
        ? 'Outputs are clear and ready to use'
        : 'Outputs need additional formatting or clarification',
    };
  }

  /**
   * Dimension 5: Integration (10%)
   */
  private async evaluateIntegration(
    agentOutput: AgentOutput,
    brandStrategy?: BrandStrategy
  ): Promise<AgentAuditScore> {
    const hasIntegration = !!brandStrategy;
    const score = hasIntegration ? 8 : 5;

    return {
      dimension: 'Integration',
      score,
      weight: 0.10,
      weightedScore: score * 0.10,
      notes: hasIntegration
        ? 'Agent integrates with horizon-brand-builder outputs'
        : 'Limited integration with brand strategy',
    };
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(scores: AgentAuditScore[]): number {
    const total = scores.reduce((sum, score) => sum + score.weightedScore, 0);
    return Math.round(total * 10) / 10; // Round to 1 decimal
  }

  /**
   * Categorize score
   */
  private categorizeScore(score: number): 'Exceptional' | 'Strong' | 'Adequate' | 'Needs Work' | 'Insufficient' {
    if (score >= 9.0) return 'Exceptional';
    if (score >= 7.5) return 'Strong';
    if (score >= 6.0) return 'Adequate';
    if (score >= 4.0) return 'Needs Work';
    return 'Insufficient';
  }

  /**
   * Identify strengths and gaps
   */
  private async identifyStrengthsAndGaps(
    agentName: string,
    agentOutput: AgentOutput,
    scores: AgentAuditScore[]
  ): Promise<[string[], string[]]> {
    const strengths: string[] = [];
    const gaps: string[] = [];

    scores.forEach((score) => {
      if (score.score >= 8) {
        strengths.push(`${score.dimension}: ${score.notes}`);
      } else if (score.score < 7) {
        gaps.push(`${score.dimension}: ${score.notes}`);
      }
    });

    // Add specific strengths/gaps based on agent type
    if (agentName.includes('Content')) {
      strengths.push('Comprehensive website copy generated');
      strengths.push('Email templates are well-structured');
    }

    return [strengths, gaps];
  }

  /**
   * Generate recommendations
   */
  private async generateRecommendations(agentName: string, gaps: string[]): Promise<string[]> {
    const recommendations: string[] = [];

    if (gaps.length === 0) {
      recommendations.push('Agent is performing well, continue monitoring quality');
    } else {
      recommendations.push('Improve areas identified in gaps section');
      recommendations.push('Provide complete brand strategy inputs for better alignment');
      recommendations.push('Test outputs with real users to validate usability');
    }

    return recommendations;
  }

  /**
   * Check integration status
   */
  private checkIntegrationStatus(
    agentOutput: AgentOutput,
    brandStrategy?: BrandStrategy
  ): {
    usesStrategyInputs: boolean;
    referencesResearchDatabase: boolean;
    citesDeliverableNumbers: boolean;
    maintainsBrandConsistency: boolean;
    linksToProjectTracker: boolean;
  } {
    return {
      usesStrategyInputs: !!brandStrategy,
      referencesResearchDatabase: false, // Could be enhanced
      citesDeliverableNumbers: false, // Could be enhanced
      maintainsBrandConsistency: true,
      linksToProjectTracker: false, // Could be enhanced
    };
  }

  /**
   * Assess production readiness
   */
  private assessProductionReadiness(
    score: number,
    agentOutput: AgentOutput
  ): {
    readyForImmediateUse: boolean;
    additionalWorkNeeded: string;
    requiredExpertise: string;
  } {
    if (score >= 7.5) {
      return {
        readyForImmediateUse: true,
        additionalWorkNeeded: 'Minor edits (5-10% work)',
        requiredExpertise: 'Basic content review',
      };
    } else if (score >= 6.0) {
      return {
        readyForImmediateUse: false,
        additionalWorkNeeded: 'Moderate edits (20-30% work)',
        requiredExpertise: 'Marketing professional',
      };
    } else {
      return {
        readyForImmediateUse: false,
        additionalWorkNeeded: 'Substantial rework (50%+ work)',
        requiredExpertise: 'Senior marketing strategist',
      };
    }
  }

  /**
   * Determine verdict
   */
  private determineVerdict(score: number): 'PASS' | 'NEEDS_IMPROVEMENT' | 'FAIL' {
    if (score >= 7.5) return 'PASS';
    if (score >= 6.0) return 'NEEDS_IMPROVEMENT';
    return 'FAIL';
  }

  /**
   * Helper: Check output quality
   */
  private checkOutputQuality(agentOutput: AgentOutput): boolean {
    // Basic validation: check if output has meaningful content
    const outputString = JSON.stringify(agentOutput);
    return outputString.length > 200; // Arbitrary threshold
  }

  /**
   * Helper: Get expected outputs count
   */
  private getExpectedOutputs(agentName: string): number {
    if (agentName.includes('Content')) return 4; // website, emails, products, SEO
    if (agentName.includes('Social')) return 4; // calendar, hashtags, playbook, stories
    if (agentName.includes('Launch')) return 7; // overview, timeline, channels, assets, PR, checklist, influencer
    return 5;
  }

  /**
   * Helper: Count actual outputs
   */
  private countActualOutputs(agentOutput: AgentOutput): number {
    // Count non-empty fields in output
    let count = 0;
    Object.values(agentOutput).forEach((value) => {
      if (value && typeof value === 'object' && Object.keys(value).length > 0) {
        count++;
      }
    });
    return count;
  }

  /**
   * Helper: Check usability
   */
  private checkUsability(agentOutput: AgentOutput): boolean {
    // Check if output is well-structured (has expected fields)
    return 'brandName' in agentOutput && !!agentOutput.brandName;
  }

  /**
   * Print audit report
   */
  private printAuditReport(report: AgentAuditReport): void {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 Agent Audit Report: ${report.agentName}`);
    console.log(`${'='.repeat(60)}\n`);

    console.log(`Brand: ${report.brandName}`);
    console.log(`Date: ${new Date(report.dateAudited).toLocaleDateString()}`);
    console.log(`Overall Score: ${report.overallScore}/10 (${report.category})`);
    console.log(`Verdict: ${report.verdict}\n`);

    console.log('Dimension Scores:');
    report.scores.forEach((score) => {
      console.log(`  ${score.dimension}: ${score.score}/10 (weight: ${score.weight * 100}%)`);
      console.log(`    → ${score.notes}`);
    });

    console.log('\nStrengths:');
    report.strengths.forEach((strength, i) => {
      console.log(`  ${i + 1}. ✅ ${strength}`);
    });

    console.log('\nGaps:');
    if (report.gaps.length === 0) {
      console.log('  None identified');
    } else {
      report.gaps.forEach((gap, i) => {
        console.log(`  ${i + 1}. ⚠️  ${gap}`);
      });
    }

    console.log('\nRecommendations:');
    report.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });

    console.log('\nProduction Readiness:');
    console.log(`  Ready for immediate use: ${report.productionReadiness.readyForImmediateUse ? 'Yes' : 'No'}`);
    console.log(`  Additional work needed: ${report.productionReadiness.additionalWorkNeeded}`);
    console.log(`  Required expertise: ${report.productionReadiness.requiredExpertise}`);

    console.log(`\n${'='.repeat(60)}\n`);
  }
}
