// Brand strategy agent

import type { LLMAdapter } from '../adapters/llm-interface.js';
import type {
  BrandProfile,
  ResearchReport,
  AuditReport,
  BrandStrategy,
  BrandFoundation,
  BrandPositioning,
  BrandPersonality,
  VisualDirection,
  MessagingFramework,
  ActivationStrategy,
  ImplementationRoadmap,
} from '../types/brand-types.js';
import type { BrandTypeConfig } from '../types/workflow-types.js';
import { brandTypeConfigs } from '../config/brand-type-configs.js';
import { ProofPointValidator } from '../services/proof-point-validator.js';

export class StrategistAgent {
  private proofPointValidator: ProofPointValidator;

  constructor(private llm: LLMAdapter) {
    this.proofPointValidator = new ProofPointValidator(llm);
  }

  async developStrategy(
    profile: BrandProfile,
    research: ResearchReport,
    audit: AuditReport
  ): Promise<BrandStrategy> {
    console.log('\n🎯 Developing brand strategy...\n');

    const config = brandTypeConfigs[profile.brandType];

    const [
      foundation,
      positioning,
      personality,
      visualDirection,
      messagingFramework,
      activationStrategy,
      implementationRoadmap,
    ] = await Promise.all([
      this.createFoundation(profile, research),
      this.createPositioning(profile, research, audit),
      this.createPersonality(profile, research),
      this.createVisualDirection(profile, research, audit),
      this.createMessagingFramework(profile, research),
      this.createActivationStrategy(profile, config),
      this.createImplementationRoadmap(profile, audit, config),
    ]);

    return {
      foundation,
      positioning,
      personality,
      visualDirection,
      messagingFramework,
      activationStrategy,
      implementationRoadmap,
    };
  }

  private async createFoundation(
    profile: BrandProfile,
    research: ResearchReport
  ): Promise<BrandFoundation> {
    const prompt = `Create the brand foundation for ${profile.brandName}.

Brand DNA:
${JSON.stringify(research.brandDNA, null, 2)}

Market Context:
${research.synthesisNotes}

Create:
1. Purpose: Why the brand exists (beyond making money)
2. Vision: Where the brand is going (future aspiration)
3. Mission: How the brand gets there (what it does)
4. Values: What the brand stands for (5-7 core values)

Output Format: JSON
{
  "purpose": "Purpose statement",
  "vision": "Vision statement",
  "mission": "Mission statement",
  "values": ["value 1", "value 2", "value 3", "value 4", "value 5"]
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async createPositioning(
    profile: BrandProfile,
    research: ResearchReport,
    audit: AuditReport
  ): Promise<BrandPositioning> {
    const prompt = `Develop strategic positioning for ${profile.brandName}.

Target Audience:
${JSON.stringify((research.audienceProfile.personas || [])[0] || 'No persona data available', null, 2)}

Competitive Landscape:
${JSON.stringify(research.marketInsights.competitorLandscape || [], null, 2)}

Top Opportunities:
${Array.isArray(audit.topOpportunities) ? audit.topOpportunities.join('\n') : 'No opportunities available'}

Create:
1. Target Audience: Precisely defined primary audience
2. Market Position: Unique space in the market
3. Differentiation: 3-5 key differentiators
4. Proof Points: Evidence that supports claims

Output Format: JSON
{
  "targetAudience": "Precise audience definition",
  "marketPosition": "Positioning statement",
  "differentiation": ["diff 1", "diff 2", "diff 3"],
  "proofPoints": ["proof 1", "proof 2", "proof 3"]
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const positioning = JSON.parse(this.extractJSON(response.content)) as {
      targetAudience: string;
      marketPosition: string;
      differentiation: string[];
      proofPoints: string[];
    };

    // Validate proof points with sources (only if they exist)
    console.log('\n🔍 Validating proof points with sources...\n');
    const validationResult = positioning.proofPoints && positioning.proofPoints.length > 0
      ? await this.proofPointValidator.validateProofPoints(
          positioning.proofPoints,
          {
            brandName: profile.brandName,
            industry: profile.brandName || 'Consumer Goods',
            category: profile.brandType || 'General',
          }
        )
      : { validatedPoints: [], invalidPoints: [] };

    // If some proof points are invalid, generate alternatives
    if (validationResult.invalidPoints.length > 0) {
      console.log(`\n🔄 Generating alternative proof points for ${validationResult.invalidPoints.length} invalid claims...\n`);
      const alternatives = await this.proofPointValidator.generateAlternativeProofPoints(
        validationResult.invalidPoints,
        {
          brandName: profile.brandName,
          industry: profile.industry || 'Consumer Goods',
          category: profile.brandType || 'General',
        },
        5 - validationResult.validatedPoints.length // Generate enough to have 5 total
      );

      (validationResult.validatedPoints as any[]).push(...alternatives);
    }

    // Format proof points with citations
    const proofPointsWithCitations = validationResult.validatedPoints.map(p => {
      return `${p.claim} (Source: ${p.source}, Confidence: ${p.confidence}/10)`;
    });

    console.log(`\n✅ Proof points validated and cited\n`);

    return {
      ...positioning,
      proofPoints: proofPointsWithCitations.slice(0, 5), // Keep top 5
    };
  }

  private async createPersonality(
    profile: BrandProfile,
    research: ResearchReport
  ): Promise<BrandPersonality> {
    const prompt = `Define the brand personality for ${profile.brandName}.

Brand Type: ${profile.brandType}
Target Audience: ${JSON.stringify((research.audienceProfile.personas || [])[0] || 'No persona data available', null, 2)}

Create:
1. Primary Archetype: Choose from (Hero, Outlaw, Magician, Lover, Jester, Everyman, Caregiver, Ruler, Creator, Innocent, Sage, Explorer)
2. Secondary Archetype: Supporting archetype (optional)
3. Traits: 5-7 defining characteristics
4. Voice & Tone: Communication style guide with examples

Output Format: JSON
{
  "primaryArchetype": "Archetype name",
  "secondaryArchetype": "Archetype name or null",
  "traits": ["trait 1", "trait 2", "trait 3", "trait 4", "trait 5"],
  "voiceAndTone": {
    "voice": "Overall voice description",
    "toneAttributes": ["attribute 1", "attribute 2", "attribute 3"],
    "examples": ["example 1", "example 2", "example 3"]
  }
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async createVisualDirection(
    profile: BrandProfile,
    research: ResearchReport,
    audit: AuditReport
  ): Promise<VisualDirection> {
    const prompt = `Establish visual brand direction for ${profile.brandName}.

Brand Type: ${profile.brandType}
Brand Personality would be: ${profile.brandType === 'luxury_premium' ? 'Sophisticated, exclusive' : profile.brandType === 'startup_disruptor' ? 'Bold, innovative' : 'Depends on persona'}

Visual Audit Findings:
${JSON.stringify(audit.visualAudit, null, 2)}

Create:
1. Design Principles: 4-5 guiding principles
2. Color Strategy: Psychology and palette direction
3. Typography Strategy: Font personality and hierarchy
4. Imagery Guidelines: Photography/illustration style

Output Format: JSON
{
  "designPrinciples": ["principle 1", "principle 2", "principle 3", "principle 4"],
  "colorStrategy": {
    "psychology": "Color psychology rationale",
    "paletteDirection": ["direction 1", "direction 2", "direction 3"]
  },
  "typographyStrategy": "Typography approach description",
  "imageryGuidelines": ["guideline 1", "guideline 2", "guideline 3"]
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async createMessagingFramework(
    profile: BrandProfile,
    research: ResearchReport
  ): Promise<MessagingFramework> {
    const prompt = `Build messaging framework for ${profile.brandName}.

Brand Story:
${research.brandDNA.brandStory}

UVP:
${research.brandDNA.uniqueValueProposition}

Target Audience Desires:
${(research.audienceProfile.desires || []).join(', ')}

Create:
1. Elevator Pitches: 15-second, 30-second, and 60-second versions
2. Key Messages: 4-5 core talking points
3. Tagline Options: 3-5 memorable tagline concepts
4. Brand Story Narrative: Compelling story arc

Output Format: JSON
{
  "elevatorPitch": {
    "fifteenSecond": "15-second pitch",
    "thirtySecond": "30-second pitch",
    "sixtySecond": "60-second pitch"
  },
  "keyMessages": ["message 1", "message 2", "message 3", "message 4"],
  "taglineOptions": ["tagline 1", "tagline 2", "tagline 3"],
  "brandStoryNarrative": "Full narrative (200-300 words)"
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      maxTokens: 2000,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async createActivationStrategy(
    profile: BrandProfile,
    config: BrandTypeConfig
  ): Promise<ActivationStrategy> {
    const prompt = `Plan brand activation for ${profile.brandName}.

Brand Type: ${profile.brandType}
Business Stage: ${profile.businessStage}
Primary Goal: ${profile.primaryGoal}

Brand Type Priorities:
${config.strategyPriorities.join('\n')}

Create:
1. Primary Channels: Where the brand should be most active
2. Content Pillars: 4-5 themes to consistently communicate
3. Experience Map: Key branded moments in customer journey

Output Format: JSON
{
  "primaryChannels": ["channel 1", "channel 2", "channel 3"],
  "contentPillars": ["pillar 1", "pillar 2", "pillar 3", "pillar 4"],
  "experienceMap": ["moment 1", "moment 2", "moment 3"]
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async createImplementationRoadmap(
    profile: BrandProfile,
    audit: AuditReport,
    _config: BrandTypeConfig
  ): Promise<ImplementationRoadmap> {
    const prompt = `Create 12-month implementation roadmap for ${profile.brandName}.

Quick Wins Identified:
${Array.isArray(audit.quickWins) ? audit.quickWins.join('\n') : 'No quick wins available'}

Top Opportunities:
${Array.isArray(audit.topOpportunities) ? audit.topOpportunities.join('\n') : 'No opportunities available'}

Create roadmap with three phases:
1. Quick Wins (0-3 months): Easy, high-impact initiatives
2. Core Build (3-6 months): Foundation-building work
3. Scale (6-12 months): Growth and optimization

Include success metrics to track progress.

Output Format: JSON
{
  "quickWins": {
    "timeline": "0-3 months",
    "initiatives": ["initiative 1", "initiative 2", "initiative 3"],
    "deliverables": ["deliverable 1", "deliverable 2"]
  },
  "coreBuild": {
    "timeline": "3-6 months",
    "initiatives": ["initiative 1", "initiative 2", "initiative 3"],
    "deliverables": ["deliverable 1", "deliverable 2"]
  },
  "scale": {
    "timeline": "6-12 months",
    "initiatives": ["initiative 1", "initiative 2", "initiative 3"],
    "deliverables": ["deliverable 1", "deliverable 2"]
  },
  "successMetrics": ["metric 1", "metric 2", "metric 3"]
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private extractJSON(content: string): string {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : content;
  }
}
