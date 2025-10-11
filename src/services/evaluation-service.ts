/**
 * Evaluation Service for Brand Design Agent
 * Uses LLM² Framework to evaluate brand outputs
 */

import { LLMEvaluator, QualityMonitor } from 'llm-squared-framework';
import type { EvaluationResult } from 'llm-squared-framework';
import type {
  BrandStrategy,
  ResearchReport,
  AuditReport,
} from '../types/brand-types.js';

export class BrandEvaluationService {
  private evaluator?: LLMEvaluator;
  private monitor?: QualityMonitor;
  private enabled: boolean;

  constructor(apiKey?: string) {
    this.enabled = !!apiKey;

    if (this.enabled) {
      this.evaluator = new LLMEvaluator({
        apiKey: apiKey!,
        model: 'claude-sonnet-4-20250514',
        temperature: 0.0,
      });

      this.monitor = new QualityMonitor({
        storagePath: './data/brand-quality-metrics.json',
        alertThresholds: {
          accuracyDrop: 0.1,
          costIncrease: 50,
          latencyIncrease: 100,
          errorRateIncrease: 0.05,
        },
      });
    } else {
      console.log('⚠️  Evaluation disabled: No ANTHROPIC_API_KEY for evaluation');
    }
  }

  /**
   * Evaluate brand strategy output
   */
  async evaluateStrategy(
    brandName: string,
    strategy: BrandStrategy
  ): Promise<EvaluationResult | null> {
    if (!this.enabled) return null;

    console.log('\n🔍 Evaluating brand strategy quality...');

    try {
      const taskDescription = `Generate a comprehensive brand strategy for ${brandName} including positioning, personality, messaging, and implementation roadmap`;

      const output = JSON.stringify(strategy, null, 2);

      const result = await this.evaluator!.evaluate(taskDescription, output);

      console.log(`   Quality Score: ${result.scores.overall.toFixed(1)}/10`);
      console.log(`   Status: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);

      if (!result.passed) {
        console.log('\n   ⚠️  Quality concerns:');
        result.recommendations.forEach((rec) => console.log(`      - ${rec}`));
      }

      console.log(`   Cost: $${(result.metadata?.estimatedCost as number)?.toFixed(4)}`);

      // Record metrics
      await this.recordMetrics('brand-strategy-generation', result);

      return result;
    } catch (error) {
      console.error('   ❌ Evaluation failed:', error);
      return null;
    }
  }

  /**
   * Evaluate research report
   */
  async evaluateResearch(
    brandName: string,
    research: ResearchReport
  ): Promise<EvaluationResult | null> {
    if (!this.enabled) return null;

    console.log('\n🔍 Evaluating research quality...');

    try {
      const taskDescription = `Conduct market research for ${brandName} including market trends, competitor analysis, and customer personas`;

      const output = JSON.stringify(research, null, 2);

      const result = await this.evaluator!.evaluate(taskDescription, output);

      console.log(`   Quality Score: ${result.scores.overall.toFixed(1)}/10`);
      console.log(`   Status: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);

      if (!result.passed) {
        console.log('\n   ⚠️  Quality concerns:');
        result.recommendations.forEach((rec) => console.log(`      - ${rec}`));
      }

      // Record metrics
      await this.recordMetrics('brand-research', result);

      return result;
    } catch (error) {
      console.error('   ❌ Evaluation failed:', error);
      return null;
    }
  }

  /**
   * Evaluate audit report
   */
  async evaluateAudit(
    brandName: string,
    audit: AuditReport
  ): Promise<EvaluationResult | null> {
    if (!this.enabled) return null;

    console.log('\n🔍 Evaluating audit quality...');

    try {
      const taskDescription = `Audit brand ${brandName} across multiple dimensions and identify gaps and opportunities`;

      const output = JSON.stringify(audit, null, 2);

      const result = await this.evaluator!.evaluate(taskDescription, output);

      console.log(`   Quality Score: ${result.scores.overall.toFixed(1)}/10`);
      console.log(`   Status: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);

      if (!result.passed) {
        console.log('\n   ⚠️  Quality concerns:');
        result.recommendations.forEach((rec) => console.log(`      - ${rec}`));
      }

      // Record metrics
      await this.recordMetrics('brand-audit', result);

      return result;
    } catch (error) {
      console.error('   ❌ Evaluation failed:', error);
      return null;
    }
  }

  /**
   * Record metrics for monitoring
   */
  private async recordMetrics(
    featureId: string,
    evaluation: EvaluationResult
  ): Promise<void> {
    if (!this.enabled) return;

    try {
      await this.monitor!.load().catch(() => {
        // File doesn't exist yet, that's ok
      });

      const metadata = evaluation.metadata as {
        estimatedCost: number;
        evaluationTime: number;
        tokensUsed: { total: number };
      };

      await this.monitor!.recordMetrics({
        timestamp: new Date().toISOString(),
        llmFeatureId: featureId,
        metrics: {
          accuracy: evaluation.scores.overall / 10, // Convert to 0-1
          precision: evaluation.scores.quality / 10,
          recall: evaluation.scores.correctness / 10,
          f1Score: evaluation.scores.overall / 10,
          avgResponseTime: metadata.evaluationTime,
          avgTokens: metadata.tokensUsed.total,
          avgCost: metadata.estimatedCost,
          errorRate: evaluation.passed ? 0 : 1,
        },
        aggregationPeriod: '1h',
      });
    } catch (error) {
      // Don't fail if monitoring fails
      console.warn('   ⚠️  Failed to record metrics:', error);
    }
  }

  /**
   * Get quality summary
   */
  async getQualitySummary(): Promise<{
    totalEvaluations: number;
    passRate: number;
    avgScore: number;
  } | null> {
    if (!this.enabled) return null;

    try {
      await this.monitor!.load();

      const strategyMetrics = this.monitor!.getMetrics('brand-strategy-generation');
      const researchMetrics = this.monitor!.getMetrics('brand-research');
      const auditMetrics = this.monitor!.getMetrics('brand-audit');

      const allMetrics = [
        ...strategyMetrics,
        ...researchMetrics,
        ...auditMetrics,
      ];

      if (allMetrics.length === 0) {
        return { totalEvaluations: 0, passRate: 0, avgScore: 0 };
      }

      const avgAccuracy =
        allMetrics.reduce((sum, m) => sum + m.metrics.accuracy, 0) /
        allMetrics.length;

      const passRate =
        allMetrics.filter((m) => m.metrics.errorRate === 0).length /
        allMetrics.length;

      return {
        totalEvaluations: allMetrics.length,
        passRate,
        avgScore: avgAccuracy * 10, // Convert back to 0-10
      };
    } catch (error) {
      return null;
    }
  }
}
