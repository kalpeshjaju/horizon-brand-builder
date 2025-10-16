// Quality Scorer - Calculate quality scores based on real vs placeholder data

import type { WorkflowState, QualityReport } from '../types/adaptive-workflow-types.js';
import { TASK_DEFINITIONS } from '../config/task-definitions.js';

export class QualityScorer {

  /**
   * Calculate overall workflow quality (0-100)
   */
  calculateOverallQuality(state: WorkflowState): number {
    const totalTasks = Object.keys(TASK_DEFINITIONS).length;
    const completedOutputs = Object.values(state.completedTasks);

    if (completedOutputs.length === 0) return 0;

    // Weight by task quality
    const totalQuality = completedOutputs.reduce((sum, output) => {
      return sum + output.quality;
    }, 0);

    const averageQuality = totalQuality / completedOutputs.length;

    // Also consider completion percentage
    const completionRate = completedOutputs.length / totalTasks;

    // Final score: 70% quality, 30% completion
    return (averageQuality * 0.7 + completionRate * 0.3) * 100;
  }

  /**
   * Generate detailed quality report
   */
  generateQualityReport(state: WorkflowState): QualityReport {
    const breakdown = Object.entries(state.completedTasks).map(([taskId, output]) => {
      const task = TASK_DEFINITIONS[taskId];

      let status: 'complete' | 'placeholder' | 'inference' | 'partial';
      if (output.isPlaceholder) {
        const placeholder = output.content as { type: string };
        status = placeholder.type === 'inference' ? 'inference' : 'placeholder';
      } else {
        status = 'complete';
      }

      const missingData: string[] = [];
      if (output.isPlaceholder && task) {
        missingData.push(task.name);
      }

      return {
        sectionId: taskId,
        sectionName: task?.name || taskId,
        quality: output.quality * 100,
        status,
        ...(missingData.length > 0 && { missingData })
      };
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations(state);

    return {
      overallQuality: this.calculateOverallQuality(state),
      breakdown,
      recommendations
    };
  }

  /**
   * Generate recommendations for improving quality
   */
  private generateRecommendations(state: WorkflowState): QualityReport['recommendations'] {
    const recommendations: QualityReport['recommendations'] = [];

    // Find placeholder tasks
    Object.entries(state.completedTasks).forEach(([taskId, output]) => {
      if (output.isPlaceholder) {
        const task = TASK_DEFINITIONS[taskId];
        if (!task) return;

        // Calculate potential improvement
        const affectedCount = task.affectedOutputs.length + 1;
        const expectedImprovement = (affectedCount / Object.keys(TASK_DEFINITIONS).length) * 50;

        recommendations.push({
          action: `Upload real data for: ${task.name}`,
          expectedImprovement,
          priority: expectedImprovement > 10 ? 'high' : expectedImprovement > 5 ? 'medium' : 'low'
        });
      }
    });

    // Sort by expected improvement
    recommendations.sort((a, b) => b.expectedImprovement - a.expectedImprovement);

    return recommendations;
  }

  /**
   * Get quality category label
   */
  getQualityCategory(score: number): string {
    if (score >= 95) return 'Production Ready';
    if (score >= 85) return 'High Quality';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Draft';
    return 'Initial';
  }

  /**
   * Check if quality meets threshold
   */
  meetsThreshold(state: WorkflowState, threshold: number): boolean {
    return this.calculateOverallQuality(state) >= threshold;
  }
}
