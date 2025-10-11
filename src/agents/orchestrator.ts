// Main orchestrator for brand design workflow

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { LLMAdapter } from '../adapters/llm-interface.js';
import type {
  BrandProfile,
  BrandDesignOutput,
  ResearchReport,
  AuditReport,
  BrandStrategy,
  CompetitorAnalysis,
  CustomerPersona,
} from '../types/brand-types.js';
import { validateBrandProfile } from '../utils/validators.js';
import { ResearchAgent } from './researcher.js';
import { AuditorAgent } from './auditor.js';
import { StrategistAgent } from './strategist.js';
import { BrandEvaluationService } from '../services/evaluation-service.js';

export class BrandDesignOrchestrator {
  private researcher: ResearchAgent;
  private auditor: AuditorAgent;
  private strategist: StrategistAgent;
  private evaluationService: BrandEvaluationService;

  constructor(private llm: LLMAdapter, apiKey?: string) {
    this.researcher = new ResearchAgent(llm);
    this.auditor = new AuditorAgent(llm);
    this.strategist = new StrategistAgent(llm);
    this.evaluationService = new BrandEvaluationService(apiKey);
  }

  async runBrandDesignWorkflow(profile: BrandProfile): Promise<BrandDesignOutput> {
    // Validate input before starting
    validateBrandProfile(profile);

    console.log(`\n🎨 Brand Design Agent - Starting workflow for ${profile.brandName}\n`);
    console.log(`Brand Type: ${profile.brandType}`);
    console.log(`Goal: ${profile.primaryGoal}\n`);

    // Phase 1: Research
    const researchReport = await this.researcher.conductResearch(profile);
    await this.evaluationService.evaluateResearch(profile.brandName, researchReport);

    // Phase 2: Audit
    const auditReport = await this.auditor.conductAudit(profile, researchReport);
    await this.evaluationService.evaluateAudit(profile.brandName, auditReport);

    // Phase 3: Strategy
    const brandStrategy = await this.strategist.developStrategy(
      profile,
      researchReport,
      auditReport
    );
    await this.evaluationService.evaluateStrategy(profile.brandName, brandStrategy);

    const output: BrandDesignOutput = {
      metadata: {
        brandName: profile.brandName,
        brandType: profile.brandType,
        dateCreated: new Date().toISOString(),
        workflowVersion: '1.0.0',
      },
      brandProfile: profile,
      researchReport,
      auditReport,
      brandStrategy,
    };

    // Save outputs
    await this.saveOutputs(output);

    // Display quality summary
    const qualitySummary = await this.evaluationService.getQualitySummary();
    if (qualitySummary) {
      console.log(`\n📊 Quality Summary:`);
      console.log(`   Total Evaluations: ${qualitySummary.totalEvaluations}`);
      console.log(`   Pass Rate: ${(qualitySummary.passRate * 100).toFixed(1)}%`);
      console.log(`   Avg Quality Score: ${qualitySummary.avgScore.toFixed(1)}/10`);
    }

    return output;
  }

  private async saveOutputs(output: BrandDesignOutput): Promise<void> {
    const brandSlug = output.brandProfile.brandName.toLowerCase().replace(/\s+/g, '-');
    const baseDir = join(process.cwd(), 'outputs', brandSlug);

    // Create directory structure
    const dirs = [
      baseDir,
      join(baseDir, '01-discovery'),
      join(baseDir, '02-research'),
      join(baseDir, '03-audit'),
      join(baseDir, '04-strategy'),
    ];

    for (const dir of dirs) {
      await mkdir(dir, { recursive: true });
    }

    // Save discovery
    await writeFile(
      join(baseDir, '01-discovery', 'brand-profile.json'),
      JSON.stringify(output.brandProfile, null, 2)
    );

    // Save research
    await writeFile(
      join(baseDir, '02-research', 'research-report.json'),
      JSON.stringify(output.researchReport, null, 2)
    );

    await writeFile(
      join(baseDir, '02-research', 'research-synthesis.md'),
      this.formatResearchReport(output.researchReport)
    );

    // Save audit
    await writeFile(
      join(baseDir, '03-audit', 'audit-report.json'),
      JSON.stringify(output.auditReport, null, 2)
    );

    await writeFile(
      join(baseDir, '03-audit', 'audit-scorecard.md'),
      this.formatAuditReport(output.auditReport)
    );

    // Save strategy
    await writeFile(
      join(baseDir, '04-strategy', 'brand-strategy.json'),
      JSON.stringify(output.brandStrategy, null, 2)
    );

    await writeFile(
      join(baseDir, '04-strategy', 'brand-strategy.md'),
      this.formatBrandStrategy(output.brandStrategy)
    );

    // Save complete brand book
    await writeFile(
      join(baseDir, 'brand-book.md'),
      this.formatBrandBook(output)
    );

    console.log(`\n✅ All outputs saved to: ${baseDir}\n`);
  }

  private formatResearchReport(research: ResearchReport): string {
    return `# Research Report

## Market Insights

### Industry Trends
${(research.marketInsights.industryTrends || []).map((t: string) => `- ${t}`).join('\n') || '- No industry trends available'}

### Competitive Landscape
${(research.marketInsights.competitorLandscape || []).map((c: CompetitorAnalysis) => `
#### ${c.name}
- **Positioning**: ${c.positioning}
- **Strengths**: ${(c.strengths || []).join(', ')}
- **Weaknesses**: ${(c.weaknesses || []).join(', ')}
- **Opportunity**: ${c.differentiationOpportunity}
`).join('\n') || '- No competitors analyzed'}

### Market Opportunities
${(research.marketInsights.marketOpportunities || []).map((o: string) => `- ${o}`).join('\n') || '- No opportunities identified'}

## Audience Profile

### Customer Personas
${(research.audienceProfile.personas || []).map((p: CustomerPersona) => `
#### ${p.name}
- **Demographics**: ${p.demographics}
- **Psychographics**: ${p.psychographics}
- **Goals**: ${(p.goals || []).join(', ')}
- **Challenges**: ${(p.challenges || []).join(', ')}
- **Buying Behavior**: ${p.buyingBehavior}
`).join('\n') || '- No customer personas available'}

### Key Insights
- **Pain Points**: ${(research.audienceProfile.painPoints || []).join(', ')}
- **Desires**: ${(research.audienceProfile.desires || []).join(', ')}
- **Decision Factors**: ${(research.audienceProfile.decisionFactors || []).join(', ')}

## Brand DNA

**Unique Value Proposition**: ${research.brandDNA.uniqueValueProposition}

**Brand Story**: ${research.brandDNA.brandStory}

**Core Strengths**: ${(research.brandDNA.coreStrengths || []).join(', ')}

## Synthesis

${research.synthesisNotes}
`;
  }

  private formatAuditReport(audit: AuditReport): string {
    return `# Brand Audit Scorecard

**Overall Score**: ${audit.overallScore}/10

## Visual Identity
**Score**: ${audit.visualAudit.score}/10

### Findings
${(audit.visualAudit.findings || []).map((f: string) => `- ${f}`).join('\n') || '- No findings available'}

### Gaps
${(audit.visualAudit.gaps || []).map((g: string) => `- ${g}`).join('\n') || '- No gaps identified'}

### Opportunities
${(audit.visualAudit.opportunities || []).map((o: string) => `- ${o}`).join('\n') || '- No opportunities identified'}

## Messaging
**Score**: ${audit.messagingAudit.score}/10

### Findings
${(audit.messagingAudit.findings || []).map((f: string) => `- ${f}`).join('\n') || '- No findings available'}

### Gaps
${(audit.messagingAudit.gaps || []).map((g: string) => `- ${g}`).join('\n') || '- No gaps identified'}

### Opportunities
${(audit.messagingAudit.opportunities || []).map((o: string) => `- ${o}`).join('\n') || '- No opportunities identified'}

## Experience
**Score**: ${audit.experienceAudit.score}/10

### Findings
${(audit.experienceAudit.findings || []).map((f: string) => `- ${f}`).join('\n') || '- No findings available'}

### Gaps
${(audit.experienceAudit.gaps || []).map((g: string) => `- ${g}`).join('\n') || '- No gaps identified'}

### Opportunities
${(audit.experienceAudit.opportunities || []).map((o: string) => `- ${o}`).join('\n') || '- No opportunities identified'}

## Competitive Position
**Score**: ${audit.competitiveAudit.score}/10

### Findings
${(audit.competitiveAudit.findings || []).map((f: string) => `- ${f}`).join('\n') || '- No findings available'}

### Gaps
${(audit.competitiveAudit.gaps || []).map((g: string) => `- ${g}`).join('\n') || '- No gaps identified'}

### Opportunities
${(audit.competitiveAudit.opportunities || []).map((o: string) => `- ${o}`).join('\n') || '- No opportunities identified'}

## Top Priorities

### Top 5 Opportunities
${Array.isArray(audit.topOpportunities) ? audit.topOpportunities.map((o: string, i: number) => `${i + 1}. ${o}`).join('\n') : '- No top opportunities identified'}

### Quick Wins
${Array.isArray(audit.quickWins) ? audit.quickWins.map((w: string) => `- ${w}`).join('\n') : '- No quick wins identified'}
`;
  }

  private formatBrandStrategy(strategy: BrandStrategy): string {
    return `# Brand Strategy

## Brand Foundation

**Purpose**: ${strategy.foundation.purpose}

**Vision**: ${strategy.foundation.vision}

**Mission**: ${strategy.foundation.mission}

**Values**: ${(strategy.foundation.values || []).join(', ')}

## Positioning

**Target Audience**: ${strategy.positioning.targetAudience}

**Market Position**: ${strategy.positioning.marketPosition}

**Differentiation**:
${(strategy.positioning.differentiation || []).map((d: string) => `- ${d}`).join('\n') || '- No differentiation points defined'}

**Proof Points**:
${(strategy.positioning.proofPoints || []).map((p: string) => `- ${p}`).join('\n') || '- No proof points defined'}

## Brand Personality

**Primary Archetype**: ${strategy.personality.primaryArchetype}
${strategy.personality.secondaryArchetype ? `**Secondary Archetype**: ${strategy.personality.secondaryArchetype}` : ''}

**Traits**: ${(strategy.personality.traits || []).join(', ')}

**Voice**: ${strategy.personality.voiceAndTone?.voice || 'Not defined'}

**Tone Attributes**: ${(strategy.personality.voiceAndTone?.toneAttributes || []).join(', ')}

## Visual Direction

**Design Principles**:
${(strategy.visualDirection.designPrinciples || []).map((p: string) => `- ${p}`).join('\n') || '- No design principles defined'}

**Color Strategy**: ${strategy.visualDirection.colorStrategy?.psychology || 'Not defined'}
${(strategy.visualDirection.colorStrategy?.paletteDirection || []).map((d: string) => `- ${d}`).join('\n') || '- No palette direction defined'}

**Typography**: ${strategy.visualDirection.typographyStrategy}

**Imagery Guidelines**:
${(strategy.visualDirection.imageryGuidelines || []).map((g: string) => `- ${g}`).join('\n') || '- No imagery guidelines defined'}

## Messaging Framework

### Elevator Pitches

**15 seconds**: ${strategy.messagingFramework.elevatorPitch?.fifteenSecond || 'Not defined'}

**30 seconds**: ${strategy.messagingFramework.elevatorPitch?.thirtySecond || 'Not defined'}

**60 seconds**: ${strategy.messagingFramework.elevatorPitch?.sixtySecond || 'Not defined'}

### Key Messages
${(strategy.messagingFramework.keyMessages || []).map((m: string) => `- ${m}`).join('\n') || '- No key messages defined'}

### Tagline Options
${(strategy.messagingFramework.taglineOptions || []).map((t: string) => `- ${t}`).join('\n') || '- No tagline options defined'}

### Brand Story
${strategy.messagingFramework.brandStoryNarrative}

## Activation Strategy

**Primary Channels**: ${(strategy.activationStrategy.primaryChannels || []).join(', ')}

**Content Pillars**: ${(strategy.activationStrategy.contentPillars || []).join(', ')}

**Experience Map**:
${(strategy.activationStrategy.experienceMap || []).map((e: string) => `- ${e}`).join('\n') || '- No experience map defined'}

## Implementation Roadmap

### Phase 1: Quick Wins (${strategy.implementationRoadmap.quickWins?.timeline || 'Not defined'})
**Initiatives**:
${(strategy.implementationRoadmap.quickWins?.initiatives || []).map((i: string) => `- ${i}`).join('\n') || '- No initiatives defined'}

**Deliverables**:
${(strategy.implementationRoadmap.quickWins?.deliverables || []).map((d: string) => `- ${d}`).join('\n') || '- No deliverables defined'}

### Phase 2: Core Build (${strategy.implementationRoadmap.coreBuild?.timeline || 'Not defined'})
**Initiatives**:
${(strategy.implementationRoadmap.coreBuild?.initiatives || []).map((i: string) => `- ${i}`).join('\n') || '- No initiatives defined'}

**Deliverables**:
${(strategy.implementationRoadmap.coreBuild?.deliverables || []).map((d: string) => `- ${d}`).join('\n') || '- No deliverables defined'}

### Phase 3: Scale (${strategy.implementationRoadmap.scale?.timeline || 'Not defined'})
**Initiatives**:
${(strategy.implementationRoadmap.scale?.initiatives || []).map((i: string) => `- ${i}`).join('\n') || '- No initiatives defined'}

**Deliverables**:
${(strategy.implementationRoadmap.scale?.deliverables || []).map((d: string) => `- ${d}`).join('\n') || '- No deliverables defined'}

### Success Metrics
${(strategy.implementationRoadmap.successMetrics || []).map((m: string) => `- ${m}`).join('\n') || '- No success metrics defined'}
`;
  }

  private formatBrandBook(output: BrandDesignOutput): string {
    return `# ${output.brandProfile.brandName} - Complete Brand Book

**Brand Type**: ${output.brandProfile.brandType}
**Created**: ${new Date(output.metadata.dateCreated).toLocaleDateString()}

---

${this.formatBrandStrategy(output.brandStrategy)}

---

# Research Insights

${this.formatResearchReport(output.researchReport)}

---

# Audit Findings

${this.formatAuditReport(output.auditReport)}
`;
  }
}
