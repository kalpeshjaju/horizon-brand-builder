#!/usr/bin/env tsx
// Initialize Flyberry Gourmet brand project
// This script sets up the project tracker and research database for Flyberry

import { ProjectTracker } from '../src/services/project-tracker.js';
import { ResearchDatabase } from '../src/services/research-database/index.js';
import FLYBERRY_PRODUCTION_CONFIG from '../src/config/flyberry-production.config.js';

async function initializeFlyberry() {
  console.log('🚀 Initializing Flyberry Gourmet Brand Transformation Project...\n');

  try {
    // 1. Initialize Project Tracker
    console.log('1️⃣  Setting up Project Tracker...');
    const tracker = new ProjectTracker(FLYBERRY_PRODUCTION_CONFIG);
    await tracker.initialize();
    const brandSlug = FLYBERRY_PRODUCTION_CONFIG.brandName.toLowerCase().replace(/\s+/g, '-');
    console.log(`   ✅ Project tracker initialized at: data/${brandSlug}/project-status.json\n`);

    // 2. Initialize Research Database
    console.log('2️⃣  Setting up Research Database...');
    const database = new ResearchDatabase(FLYBERRY_PRODUCTION_CONFIG);
    await database.initialize();
    console.log(`   ✅ Research database initialized at: ${database.getDataFile()}\n`);

    // 3. Generate Initial Dashboard
    console.log('3️⃣  Generating initial project dashboard...');
    const dashboardPath = await tracker.generateDashboard();
    console.log(`   ✅ Dashboard generated at: ${dashboardPath}\n`);

    // 4. Show Project Status
    console.log('4️⃣  Project Status Summary:');
    const status = tracker.getStatus();
    if (status) {
      console.log(`   📊 Brand: ${status.project.brandName}`);
      console.log(`   📅 Started: ${new Date(status.project.startDate).toLocaleDateString()}`);
      console.log(`   ⏱️  Duration: ${status.project.totalDuration}`);
      console.log(`   📋 Total Deliverables: ${status.metrics.deliverables.total}`);
      console.log(`   🎯 Total Phases: ${status.metrics.phases.total}\n`);
    }

    // 5. Show Database Stats
    console.log('5️⃣  Research Database Status:');
    const stats = await database.getStats();
    console.log(`   📚 Total Findings: ${stats.metadata.totalFindings}`);
    console.log(`   📁 Topics: ${stats.metadata.topics.length}`);
    console.log(`   🔗 Sources: ${stats.metadata.sources}\n`);

    // Success message
    console.log('✅ Flyberry Gourmet project initialization complete!\n');
    console.log('📍 Next Steps:');
    console.log('   1. Review the project dashboard:');
    console.log(`      open ${dashboardPath}`);
    console.log('');
    console.log('   2. View project status:');
    console.log('      npm run tracker:status');
    console.log('');
    console.log('   3. Start research mode:');
    console.log('      npm run professional -- --brand "Flyberry Gourmet"');
    console.log('');
    console.log('   4. Generate reports:');
    console.log('      npm run tracker:dashboard');
    console.log('      npm run tracker:export');
    console.log('');
    console.log('🎉 Ready to transform Flyberry into a premium lifestyle brand!\n');
  } catch (error) {
    console.error('❌ Error initializing Flyberry project:');
    console.error(error);
    process.exit(1);
  }
}

// Run initialization
initializeFlyberry();
