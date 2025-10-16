// Adaptive Workflow Report Generator - Creates comprehensive brand strategy reports

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { WorkflowState, TaskOutput } from '../types/adaptive-workflow-types.js';
import type { BrandConfiguration } from '../types/project-types.js';
import { TASK_DEFINITIONS } from '../config/task-definitions.js';

export class WorkflowReportGenerator {
  constructor(
    private brandConfig: BrandConfiguration,
    private state: WorkflowState,
    private outputDir: string
  ) {}

  async generateBrandStrategyReport(version: string): Promise<string> {
    const reportDir = join(this.outputDir, 'reports');
    await mkdir(reportDir, { recursive: true });

    const filename = `brand-strategy-v${version}.md`;
    const filepath = join(reportDir, filename);

    const content = this.buildFullReport();

    await writeFile(filepath, content, 'utf-8');

    console.log(`\n📄 Generated report: ${filename}`);
    return filepath;
  }

  private buildFullReport(): string {
    let report = '';

    // Header
    report += this.buildHeader();

    // Executive Summary
    report += this.buildExecutiveSummary();

    // Stage 1: Discovery & Research
    report += this.buildSection('Stage 1: Discovery & Research', [
      'project-setup',
      'stakeholder-interviews',
      'brand-asset-collection',
      'touchpoint-mapping',
      'competitive-analysis',
      'pricing-analysis',
      'packaging-audit',
      'communication-analysis',
    ]);

    // Stage 2: Customer Research
    report += this.buildSection('Stage 2: Customer Research', [
      'customer-surveys',
      'customer-interviews',
      'mystery-shopping',
      'customer-synthesis',
    ]);

    // Stage 3: Synthesis & Analysis
    report += this.buildSection('Stage 3: Synthesis & Analysis', [
      'stakeholder-synthesis',
      'competitive-synthesis',
      'brand-audit-report',
      'positioning-map',
      'whitespace-analysis',
    ]);

    // Stage 4: Strategic Foundation
    report += this.buildSection('Stage 4: Strategic Foundation', [
      'positioning-options',
      'client-workshop-decision',
      'brand-purpose',
      'brand-values',
      'brand-personality',
      'target-audience-definition',
    ]);

    // Stage 5: Brand Framework
    report += this.buildSection('Stage 5: Brand Framework', [
      'brand-architecture',
      'messaging-framework',
      'brand-voice-guide',
      'visual-identity-system',
      'brand-framework',
    ]);

    // Stage 6: Execution Assets
    report += this.buildSection('Stage 6: Execution Assets', [
      'brand-guidelines',
      'messaging-playbook',
      'content-strategy',
      'experience-principles',
    ]);

    // Stage 7: Documentation
    report += this.buildSection('Stage 7: Final Deliverables', [
      'master-brand-book',
      'quick-reference-guide',
      'implementation-roadmap',
      'stakeholder-presentation',
    ]);

    // Quality Report
    report += this.buildQualityReport();

    // Next Steps
    report += this.buildNextSteps();

    return report;
  }

  private buildHeader(): string {
    return `# ${this.brandConfig.brandName} - Brand Strategy Report

**Generated**: ${new Date().toISOString().split('T')[0]}
**Version**: ${this.calculateVersion()}
**Overall Quality**: ${this.state.qualityScore.toFixed(1)}%
**Status**: ${this.state.overallStatus}

---

`;
  }

  private buildExecutiveSummary(): string {
    const completedCount = this.state.metrics.completedCount;
    const totalTasks = this.state.metrics.totalTasks;
    const realDataCount = this.state.metrics.realDataCount;
    const placeholderCount = this.state.metrics.placeholderCount;

    let summary = `## Executive Summary

This brand strategy report for **${this.brandConfig.brandName}** synthesizes insights from ${completedCount} completed research and strategy tasks.

### Project Overview

- **Industry**: ${this.brandConfig.industry}
- **Category**: ${this.brandConfig.category}
- **Primary Objective**: ${this.brandConfig.projectObjectives.primary}

### Progress Status

- **Total Tasks**: ${totalTasks}
- **Completed**: ${completedCount} (${((completedCount/totalTasks)*100).toFixed(0)}%)
- **Real Data**: ${realDataCount} sections
- **Placeholder Content**: ${placeholderCount} sections (awaiting input)
- **Overall Quality Score**: ${this.state.qualityScore.toFixed(1)}%

`;

    if (placeholderCount > 0) {
      summary += `
> **Note**: This report contains ${placeholderCount} placeholder sections that will be enhanced when additional data becomes available. See "Missing Inputs" section for details.

`;
    }

    summary += `---\n\n`;
    return summary;
  }

  private buildSection(sectionTitle: string, taskIds: string[]): string {
    let section = `## ${sectionTitle}\n\n`;

    taskIds.forEach(taskId => {
      const task = TASK_DEFINITIONS[taskId];
      if (!task) return;

      const output = this.state.completedTasks[taskId];

      section += `### ${task.name}\n\n`;

      if (!output) {
        if (this.state.pausedTasks.includes(taskId)) {
          section += `⏸️ **Status**: Paused (required human input)\n\n`;
          section += `This task requires human input before proceeding.\n\n`;
        } else if (this.state.skippedTasks.includes(taskId)) {
          section += `⏭️ **Status**: Skipped (optional)\n\n`;
          section += `This task was skipped to maintain workflow progress.\n\n`;
        } else {
          section += `⏳ **Status**: Pending\n\n`;
        }
        section += `---\n\n`;
        return;
      }

      // Status indicator
      const statusEmoji = output.isPlaceholder ? '📝' : '✅';
      const qualityPercent = (output.quality * 100).toFixed(0);
      section += `${statusEmoji} **Status**: ${output.status} | **Quality**: ${qualityPercent}%\n\n`;

      // Confidence and metadata
      if (output.metadata.confidence) {
        section += `**Confidence**: ${(output.metadata.confidence * 100).toFixed(0)}%\n\n`;
      }

      if (output.isPlaceholder) {
        section += `> ⚠️ **Placeholder Content**: This section uses inferred data or templates. Real data will improve accuracy.\n\n`;
      }

      // Content
      section += this.formatTaskContent(output);

      // Sources
      if (output.metadata.sources && output.metadata.sources.length > 0) {
        section += `\n**Sources**:\n`;
        output.metadata.sources.forEach(source => {
          section += `- ${source}\n`;
        });
        section += `\n`;
      }

      // Artifacts
      if (output.metadata.artifacts && output.metadata.artifacts.length > 0) {
        section += `**Deliverables**: ${output.metadata.artifacts.join(', ')}\n\n`;
      }

      section += `---\n\n`;
    });

    return section;
  }

  private formatTaskContent(output: TaskOutput): string {
    const content = output.content;

    if (typeof content === 'string') {
      return `${content}\n\n`;
    }

    if (typeof content === 'object' && content !== null) {
      // Format structured content
      return this.formatStructuredContent(content as Record<string, any>);
    }

    return `_Content not available_\n\n`;
  }

  private formatStructuredContent(data: Record<string, any>): string {
    let formatted = '';

    Object.entries(data).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

      if (Array.isArray(value)) {
        formatted += `**${label}**:\n`;
        value.forEach(item => {
          if (typeof item === 'string') {
            formatted += `- ${item}\n`;
          } else if (typeof item === 'object' && item !== null) {
            formatted += this.formatObjectInList(item);
          }
        });
        formatted += `\n`;
      } else if (typeof value === 'object' && value !== null) {
        formatted += `**${label}**:\n\n`;
        formatted += this.formatStructuredContent(value as Record<string, any>);
      } else if (value !== undefined && value !== null) {
        formatted += `**${label}**: ${value}\n\n`;
      }
    });

    return formatted;
  }

  private formatObjectInList(obj: Record<string, any>): string {
    // Special handling for competitor data
    if (obj.name && obj.website) {
      let formatted = `\n**${obj.name}**\n`;
      if (obj.website) formatted += `  - Website: ${obj.website}\n`;
      if (obj.positioning) {
        // Handle positioning as object or string
        if (typeof obj.positioning === 'object') {
          formatted += `  - Positioning: ${JSON.stringify(obj.positioning, null, 2)}\n`;
        } else {
          formatted += `  - Positioning: ${obj.positioning}\n`;
        }
      }
      if (obj.category) formatted += `  - Category: ${obj.category}\n`;
      if (obj.strengths && obj.strengths.length > 0) {
        formatted += `  - Strengths: ${obj.strengths.join(', ')}\n`;
      }
      if (obj.weaknesses && obj.weaknesses.length > 0) {
        formatted += `  - Weaknesses: ${obj.weaknesses.join(', ')}\n`;
      }
      if (obj.priceRange) formatted += `  - Price Range: ${obj.priceRange}\n`;
      return formatted;
    }

    // Generic object formatting
    let formatted = '\n';
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'webData' && key !== 'lastUpdated') {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        if (typeof value === 'object' && !Array.isArray(value)) {
          // Format nested objects properly
          formatted += `  - ${label}: ${JSON.stringify(value, null, 2)}\n`;
          return;
        }
        formatted += `  - ${label}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
      }
    });
    return formatted;
  }

  private buildQualityReport(): string {
    let section = `## Quality Assessment\n\n`;

    section += `### Overall Score: ${this.state.qualityScore.toFixed(1)}%\n\n`;

    section += `This score represents the percentage of content based on real data vs. placeholder/inferred content.\n\n`;

    section += `### Breakdown\n\n`;
    section += `- **Real Data**: ${this.state.metrics.realDataCount} sections (100% quality)\n`;
    section += `- **Placeholder**: ${this.state.metrics.placeholderCount} sections (50% quality)\n`;
    section += `- **Paused**: ${this.state.metrics.pausedCount} tasks (awaiting input)\n`;
    section += `- **Skipped**: ${this.state.metrics.skippedCount} tasks (optional)\n\n`;

    if (this.state.qualityScore >= 95) {
      section += `✅ **Status**: Production-ready\n\n`;
    } else if (this.state.qualityScore >= 85) {
      section += `🟡 **Status**: High quality, minor improvements possible\n\n`;
    } else if (this.state.qualityScore >= 70) {
      section += `🟠 **Status**: Good quality, several sections need real data\n\n`;
    } else {
      section += `🔴 **Status**: Early draft, significant data needed\n\n`;
    }

    section += `---\n\n`;
    return section;
  }

  private buildNextSteps(): string {
    let section = `## Next Steps\n\n`;

    // Identify missing inputs
    const missingInputs: string[] = [];
    this.state.skippedTasks.forEach(taskId => {
      const task = TASK_DEFINITIONS[taskId];
      if (task && task.humanRequired) {
        missingInputs.push(`- ${task.name}: ${task.description}`);
      }
    });

    this.state.pausedTasks.forEach(taskId => {
      const task = TASK_DEFINITIONS[taskId];
      if (task) {
        missingInputs.push(`- ${task.name}: ${task.description}`);
      }
    });

    if (missingInputs.length > 0) {
      section += `### Missing Inputs\n\n`;
      section += `The following inputs would improve report quality:\n\n`;
      missingInputs.forEach(input => {
        section += `${input}\n`;
      });
      section += `\n`;
      section += `**How to provide**: Upload files to \`${this.outputDir}/inputs/\` directory.\n\n`;
      section += `**File naming**: Use task ID (e.g., \`stakeholder-interviews.txt\`, \`customer-surveys.txt\`)\n\n`;
    }

    if (this.state.qualityScore < 95) {
      section += `### Quality Improvements\n\n`;
      section += `To achieve production-ready quality (95%+), focus on:\n\n`;
      section += `1. Providing real stakeholder interview data\n`;
      section += `2. Adding customer research findings\n`;
      section += `3. Conducting mystery shopping exercises\n\n`;
    }

    section += `### Implementation Timeline\n\n`;
    section += `1. **Week 1-2**: Gather missing inputs\n`;
    section += `2. **Week 3**: Review regenerated sections\n`;
    section += `3. **Week 4**: Finalize brand strategy\n`;
    section += `4. **Week 5-6**: Begin implementation\n\n`;

    section += `---\n\n`;
    section += `**Report End**\n`;

    return section;
  }

  private calculateVersion(): string {
    // Count total versions across all tasks
    let maxVersion = 1;
    Object.values(this.state.completedTasks).forEach(output => {
      if (output.version > maxVersion) {
        maxVersion = output.version;
      }
    });

    return `${maxVersion}.0`;
  }
}
