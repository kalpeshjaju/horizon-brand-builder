#!/usr/bin/env node
// Manual regeneration trigger for testing

import { AdaptiveWorkflowEngine } from '../workflow/adaptive-engine.js';
import type { WorkflowConfig } from '../types/adaptive-workflow-types.js';
import { join } from 'path';
import { readFile } from 'fs/promises';

async function testRegeneration(brandName: string, taskId: string) {
  console.log('\n🔄 Testing Manual Regeneration\n');
  console.log(`Brand: ${brandName}`);
  console.log(`Task: ${taskId}\n`);

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  const config: WorkflowConfig = {
    brandName,
    enableAutoRegeneration: true,
    qualityThreshold: 95,
    watchForInputs: false,
    inputDirectory: join(process.cwd(), 'output', slugify(brandName), 'inputs'),
    outputDirectory: join(process.cwd(), 'output', slugify(brandName)),
    versioningEnabled: true,
    maxVersionsToKeep: 10
  };

  const engine = new AdaptiveWorkflowEngine(config);
  await engine['initialize']();

  // Load state
  const stateFile = join(config.outputDirectory, '.workflow', 'state.json');
  const state = JSON.parse(await readFile(stateFile, 'utf-8'));

  console.log(`📊 Current Quality: ${state.qualityScore.toFixed(1)}%`);
  console.log(`📋 Completed Tasks: ${state.metrics.completedCount}/${state.metrics.totalTasks}`);
  console.log(`⏭️  Skipped Tasks: ${state.metrics.skippedCount}\n`);

  // Simulate human input
  const filename = `${taskId}.txt`;
  console.log(`✨ Simulating input: ${filename}\n`);

  try {
    await engine['handleHumanInput'](filename);
    console.log('\n✅ Regeneration complete!');
  } catch (error) {
    console.error('❌ Regeneration failed:', error);
  }
}

// Run
const brandName = process.argv[2] || 'Flyberry';
const taskId = process.argv[3] || 'stakeholder-interviews';

testRegeneration(brandName, taskId).catch(console.error);
