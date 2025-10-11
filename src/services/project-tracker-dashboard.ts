// Project Tracker Dashboard Generation Helper
// Extracted from project-tracker.ts to comply with <500 line rule

import fs from 'fs/promises';
import path from 'path';
import type { ProjectStatus } from '../types/project-types.js';

export async function generateDashboard(
  data: ProjectStatus,
  brandName: string
): Promise<string> {
  const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-');
  const outputDir = path.join(process.cwd(), 'output', brandSlug);
  await fs.mkdir(outputDir, { recursive: true });

  const dashboardFile = path.join(outputDir, 'dashboard.md');

  let markdown = `# ${data.project.name} - Project Dashboard\n\n`;
  markdown += `**Brand:** ${data.project.brandName}\n`;
  markdown += `**Started:** ${new Date(data.project.startDate).toLocaleDateString()}\n`;
  markdown += `**Status:** ${data.project.overallStatus}\n`;
  markdown += `**Current Phase:** ${data.project.currentPhase}\n`;
  markdown += `**Last Updated:** ${new Date(data.lastUpdated).toLocaleDateString()}\n\n`;
  markdown += `---\n\n`;

  // Overall metrics
  markdown += `## 📊 Overall Progress\n\n`;
  markdown += `### Deliverables\n`;
  markdown += `- **Total:** ${data.metrics.deliverables.total}\n`;
  markdown += `- **Completed:** ${data.metrics.deliverables.completed} (${data.metrics.deliverables.completionRate}%)\n`;
  markdown += `- **In Progress:** ${data.metrics.deliverables.inProgress}\n`;
  markdown += `- **Not Started:** ${data.metrics.deliverables.notStarted}\n\n`;

  markdown += `### Phases\n`;
  markdown += `- **Total:** ${data.metrics.phases.total}\n`;
  markdown += `- **Completed:** ${data.metrics.phases.completed}\n`;
  markdown += `- **In Progress:** ${data.metrics.phases.inProgress}\n`;
  markdown += `- **Not Started:** ${data.metrics.phases.notStarted}\n\n`;

  // Progress bar
  const progressBarWidth = 50;
  const filledWidth = Math.round(
    (data.metrics.deliverables.completionRate / 100) * progressBarWidth
  );
  const progressBar = '█'.repeat(filledWidth) + '░'.repeat(progressBarWidth - filledWidth);
  markdown += `\`\`\`\n${progressBar} ${data.metrics.deliverables.completionRate}%\n\`\`\`\n\n`;

  markdown += `---\n\n`;

  // Phase details
  markdown += `## 📋 Phase Status\n\n`;

  for (const phase of Object.values(data.phases)) {
    const statusEmoji =
      {
        completed: '✅',
        'in-progress': '🔄',
        'not-started': '⏸️',
      }[phase.status] || '❓';

    markdown += `### ${statusEmoji} Phase ${phase.number}: ${phase.name}\n\n`;
    markdown += `- **Duration:** ${phase.duration}\n`;
    markdown += `- **Status:** ${phase.status}\n`;
    markdown += `- **Progress:** ${phase.progress}%\n`;

    if (phase.startDate) {
      markdown += `- **Started:** ${new Date(phase.startDate).toLocaleDateString()}\n`;
    }
    if (phase.endDate) {
      markdown += `- **Completed:** ${new Date(phase.endDate).toLocaleDateString()}\n`;
    }

    markdown += `\n#### Deliverables (${phase.deliverables.filter((d) => d.status === 'completed').length}/${phase.deliverables.length})\n\n`;

    // Group by status
    const byStatus = {
      completed: phase.deliverables.filter((d) => d.status === 'completed'),
      'in-progress': phase.deliverables.filter((d) => d.status === 'in-progress'),
      'not-started': phase.deliverables.filter((d) => d.status === 'not-started'),
    };

    for (const [status, deliverables] of Object.entries(byStatus)) {
      if (deliverables.length > 0) {
        const emoji = { completed: '✅', 'in-progress': '🔄', 'not-started': '⬜' }[status];
        markdown += `**${emoji} ${status.charAt(0).toUpperCase() + status.slice(1)} (${deliverables.length})**\n`;
        deliverables.forEach((d) => {
          markdown += `- ${d.name}`;
          if (d.assignee) markdown += ` - *Assignee: ${d.assignee}*`;
          if (d.dueDate) markdown += ` - *Due: ${new Date(d.dueDate).toLocaleDateString()}*`;
          markdown += `\n`;
        });
        markdown += `\n`;
      }
    }

    markdown += `---\n\n`;
  }

  await fs.writeFile(dashboardFile, markdown, 'utf-8');

  console.log(`\n✅ Dashboard generated: ${dashboardFile}\n`);
  return dashboardFile;
}

export async function exportDeliverablesList(
  data: ProjectStatus,
  brandName: string
): Promise<string> {
  const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-');
  const outputDir = path.join(process.cwd(), 'output', brandSlug);
  await fs.mkdir(outputDir, { recursive: true });

  const csvFile = path.join(outputDir, 'deliverables-checklist.csv');

  let csv = 'Phase,Phase Name,Deliverable,Status,Assignee,Due Date,Completed Date,Notes\n';

  for (const phase of Object.values(data.phases)) {
    phase.deliverables.forEach((d) => {
      csv += `"Phase ${phase.number}","${phase.name}","${d.name}","${d.status}","${d.assignee || ''}","${d.dueDate || ''}","${d.completedDate || ''}","${d.notes.join('; ')}"\n`;
    });
  }

  await fs.writeFile(csvFile, csv, 'utf-8');

  console.log(`\n✅ Deliverables exported: ${csvFile}\n`);
  return csvFile;
}
