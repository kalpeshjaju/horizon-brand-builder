// Brand research agent

import type { LLMAdapter } from '../adapters/llm-interface.js';
import type {
  BrandProfile,
  ResearchReport,
  MarketInsights,
  AudienceProfile,
  BrandDNA,
} from '../types/brand-types.js';

export class ResearchAgent {
  constructor(private llm: LLMAdapter) {}

  async conductResearch(profile: BrandProfile): Promise<ResearchReport> {
    console.log('\n🔍 Starting brand research...\n');

    const [marketInsights, audienceProfile, brandDNA] = await Promise.all([
      this.researchMarket(profile),
      this.researchAudience(profile),
      this.researchBrandDNA(profile),
    ]);

    const synthesisNotes = await this.synthesizeResearch(
      profile,
      marketInsights,
      audienceProfile,
      brandDNA
    );

    return {
      marketInsights,
      audienceProfile,
      brandDNA,
      synthesisNotes,
    };
  }

  private async researchMarket(profile: BrandProfile): Promise<MarketInsights> {
    const prompt = `Conduct market research for ${profile.brandName}, a ${profile.brandType} brand in the ${profile.industry} industry.

Brand Context:
- Target Audience: ${profile.targetAudience}
- Business Stage: ${profile.businessStage}
- Primary Goal: ${profile.primaryGoal}
${profile.website ? `- Website: ${profile.website}` : ''}

Research Tasks:
1. Identify 3-5 key industry trends relevant to this brand
2. Analyze the competitive landscape (identify 4-5 main competitors)
3. Identify market positioning opportunities

For each competitor, provide:
- Name
- Positioning statement
- Key strengths (2-3)
- Key weaknesses (2-3)
- Differentiation opportunity for ${profile.brandName}

Output Format: JSON matching this structure:
{
  "industryTrends": ["trend 1", "trend 2", ...],
  "competitorLandscape": [
    {
      "name": "Competitor Name",
      "positioning": "How they position themselves",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "differentiationOpportunity": "How to differentiate from them"
    }
  ],
  "marketOpportunities": ["opportunity 1", "opportunity 2", ...],
  "keyFindings": ["finding 1", "finding 2", ...]
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async researchAudience(profile: BrandProfile): Promise<AudienceProfile> {
    const prompt = `Research the target audience for ${profile.brandName}.

Brand Context:
- Industry: ${profile.industry}
- Brand Type: ${profile.brandType}
- Target Audience: ${profile.targetAudience}
- Business Stage: ${profile.businessStage}

Research Tasks:
1. Create 3-4 detailed customer personas
2. Identify key pain points (what frustrates them)
3. Identify desires (what they aspire to)
4. Identify decision factors (what influences their choices)

For each persona, provide:
- Name (e.g., "Fashion-Forward Millennial")
- Demographics (age, income, location, etc.)
- Psychographics (values, interests, lifestyle)
- Goals (what they want to achieve)
- Challenges (what holds them back)
- Buying behavior (how they make decisions)

Output Format: JSON matching this structure:
{
  "personas": [
    {
      "name": "Persona Name",
      "demographics": "Description",
      "psychographics": "Description",
      "goals": ["goal 1", "goal 2"],
      "challenges": ["challenge 1", "challenge 2"],
      "buyingBehavior": "Description"
    }
  ],
  "painPoints": ["pain 1", "pain 2", ...],
  "desires": ["desire 1", "desire 2", ...],
  "decisionFactors": ["factor 1", "factor 2", ...]
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async researchBrandDNA(profile: BrandProfile): Promise<BrandDNA> {
    const prompt = `Identify the brand DNA for ${profile.brandName}.

Brand Context:
- Industry: ${profile.industry}
- Brand Type: ${profile.brandType}
- Target Audience: ${profile.targetAudience}
- Additional Context: ${profile.additionalContext || 'None provided'}

Research Tasks:
1. Craft a unique value proposition (what makes this brand different and valuable)
2. Develop a compelling brand story (origin, purpose, journey)
3. Identify 5-7 core strengths (what this brand does exceptionally well)
4. If applicable, identify brand heritage or founder story elements

Output Format: JSON matching this structure:
{
  "uniqueValueProposition": "Clear UVP statement",
  "brandStory": "Compelling narrative",
  "coreStrengths": ["strength 1", "strength 2", ...],
  "brandHeritage": "Heritage story if applicable, or null",
  "founderStory": "Founder story if applicable, or null"
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async synthesizeResearch(
    profile: BrandProfile,
    market: MarketInsights,
    audience: AudienceProfile,
    dna: BrandDNA
  ): Promise<string> {
    const prompt = `Synthesize the research findings for ${profile.brandName} into key strategic insights.

Market Insights:
${JSON.stringify(market, null, 2)}

Audience Profile:
${JSON.stringify(audience, null, 2)}

Brand DNA:
${JSON.stringify(dna, null, 2)}

Provide a concise synthesis (300-400 words) that:
1. Highlights the most important insights
2. Identifies strategic opportunities
3. Notes potential challenges
4. Provides clear direction for brand strategy

Write in a professional, strategic tone.`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return response.content;
  }

  private extractJSON(content: string): string {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : content;
  }
}
