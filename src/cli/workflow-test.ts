#!/usr/bin/env node
// Test runner for adaptive workflow (runs once, no watch mode)

import { AdaptiveWorkflowEngine } from '../workflow/adaptive-engine.js';
import type { WorkflowConfig } from '../types/adaptive-workflow-types.js';
import { FLYBERRY_CONFIG } from '../config/flyberry-config.js';
import { ManagedClaudeAdapter } from '../adapters/managed-llm-adapter.js';
import { join } from 'path';

async function testWorkflow(brandName: string) {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     ADAPTIVE WORKFLOW - TEST MODE                             ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  const config: WorkflowConfig = {
    brandName,
    enableAutoRegeneration: true,
    qualityThreshold: 95,
    watchForInputs: false, // Disable watch mode for testing
    inputDirectory: join(process.cwd(), 'output', slugify(brandName), 'inputs'),
    outputDirectory: join(process.cwd(), 'output', slugify(brandName)),
    versioningEnabled: true,
    maxVersionsToKeep: 10
  };

  // Initialize LLM (will use managed service if API key available)
  let llm: ManagedClaudeAdapter | undefined;
  let brandConfig = FLYBERRY_CONFIG;

  if (process.env.ANTHROPIC_API_KEY) {
    llm = new ManagedClaudeAdapter({
      provider: 'claude',
      model: 'claude-3-5-sonnet-20241022',
      apiKey: process.env.ANTHROPIC_API_KEY,
      temperature: 0.7,
      maxTokens: 8000,
    }, 'adaptive-workflow');
    console.log('✅ LLM initialized (real AI agents enabled)\n');
  } else {
    console.log('⚠️  No API key found - using mock execution\n');
  }

  const engine = new AdaptiveWorkflowEngine(config, llm, brandConfig);

  // Override run to not watch
  await engine['initialize']();
  await engine['executeWithSkips']();

  console.log('\n✅ Test workflow complete!');
  console.log(`📁 Output directory: ${config.outputDirectory}`);
  console.log(`📊 Check status: npm run workflow:status -- --brand="${brandName}"\n`);
}

// Run
const brandName = process.argv[2] || 'Flyberry';
testWorkflow(brandName).catch(console.error);
