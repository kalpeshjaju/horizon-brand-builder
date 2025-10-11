// Brand audit agent

import type { LLMAdapter } from '../adapters/llm-interface.js';
import type {
  BrandProfile,
  ResearchReport,
  AuditReport,
  AuditDimension,
} from '../types/brand-types.js';

export class AuditorAgent {
  constructor(private llm: LLMAdapter) {}

  async conductAudit(
    profile: BrandProfile,
    research: ResearchReport
  ): Promise<AuditReport> {
    console.log('\n📊 Starting brand audit...\n');

    const [visualAudit, messagingAudit, experienceAudit, competitiveAudit] =
      await Promise.all([
        this.auditVisual(profile, research),
        this.auditMessaging(profile, research),
        this.auditExperience(profile, research),
        this.auditCompetitive(profile, research),
      ]);

    const overallScore =
      (visualAudit.score +
        messagingAudit.score +
        experienceAudit.score +
        competitiveAudit.score) /
      4;

    const topOpportunities = await this.identifyTopOpportunities(
      profile,
      visualAudit,
      messagingAudit,
      experienceAudit,
      competitiveAudit
    );

    const quickWins = await this.identifyQuickWins(
      visualAudit,
      messagingAudit,
      experienceAudit,
      competitiveAudit
    );

    return {
      visualAudit,
      messagingAudit,
      experienceAudit,
      competitiveAudit,
      overallScore: Math.round(overallScore * 10) / 10,
      topOpportunities,
      quickWins,
    };
  }

  private async auditVisual(
    profile: BrandProfile,
    research: ResearchReport
  ): Promise<AuditDimension> {
    const prompt = `Audit the visual brand identity for ${profile.brandName}.

Brand Type: ${profile.brandType}
${profile.website ? `Website: ${profile.website}` : ''}

Market Context:
${JSON.stringify((research.marketInsights.competitorLandscape || []).slice(0, 3), null, 2)}

Audit Criteria:
1. Logo and brand mark (memorability, uniqueness, scalability)
2. Color palette (appropriateness, consistency, differentiation)
3. Typography (readability, brand fit, hierarchy)
4. Imagery and photography style (consistency, quality, brand alignment)
5. Overall visual appeal and aesthetic

Provide a score (0-10), findings, gaps, and opportunities.

Output Format: JSON
{
  "dimension": "Visual Identity",
  "score": 7,
  "findings": ["finding 1", "finding 2", ...],
  "gaps": ["gap 1", "gap 2", ...],
  "opportunities": ["opportunity 1", "opportunity 2", ...]
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async auditMessaging(
    profile: BrandProfile,
    research: ResearchReport
  ): Promise<AuditDimension> {
    const prompt = `Audit the brand messaging for ${profile.brandName}.

Brand Type: ${profile.brandType}
${profile.website ? `Website: ${profile.website}` : ''}

Brand DNA:
${JSON.stringify(research.brandDNA, null, 2)}

Audit Criteria:
1. Brand voice (distinctiveness, consistency, audience fit)
2. Tone across channels (appropriate, engaging, authentic)
3. Positioning statement (clarity, differentiation, relevance)
4. Tagline or slogan (memorable, meaningful, unique)
5. Key messaging consistency

Provide a score (0-10), findings, gaps, and opportunities.

Output Format: JSON
{
  "dimension": "Messaging",
  "score": 6,
  "findings": ["finding 1", "finding 2", ...],
  "gaps": ["gap 1", "gap 2", ...],
  "opportunities": ["opportunity 1", "opportunity 2", ...]
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async auditExperience(
    profile: BrandProfile,
    research: ResearchReport
  ): Promise<AuditDimension> {
    const prompt = `Audit the brand experience for ${profile.brandName}.

Brand Type: ${profile.brandType}
${profile.website ? `Website: ${profile.website}` : ''}

Target Audience:
${JSON.stringify((research.audienceProfile.personas || [])[0] || 'No persona data available', null, 2)}

Audit Criteria:
1. Website experience (usability, brand alignment, conversion)
2. Social media presence (engagement, consistency, value)
3. Customer touchpoints (quality, consistency, memorability)
4. Brand-specific touchpoints based on brand type
5. Overall customer journey coherence

Provide a score (0-10), findings, gaps, and opportunities.

Output Format: JSON
{
  "dimension": "Experience",
  "score": 6,
  "findings": ["finding 1", "finding 2", ...],
  "gaps": ["gap 1", "gap 2", ...],
  "opportunities": ["opportunity 1", "opportunity 2", ...]
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async auditCompetitive(
    profile: BrandProfile,
    research: ResearchReport
  ): Promise<AuditDimension> {
    const prompt = `Conduct a competitive brand audit for ${profile.brandName}.

Competitors:
${JSON.stringify(research.marketInsights.competitorLandscape, null, 2)}

Audit Criteria:
1. Differentiation (how distinct is the brand vs competitors)
2. Memorability (how memorable compared to alternatives)
3. Consistency (how coherent compared to market leaders)
4. Market positioning strength
5. Perceived value and credibility

Provide a score (0-10), findings, gaps, and opportunities.

Output Format: JSON
{
  "dimension": "Competitive Position",
  "score": 5,
  "findings": ["finding 1", "finding 2", ...],
  "gaps": ["gap 1", "gap 2", ...],
  "opportunities": ["opportunity 1", "opportunity 2", ...]
}`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async identifyTopOpportunities(
    profile: BrandProfile,
    ...audits: AuditDimension[]
  ): Promise<string[]> {
    const allOpportunities = audits.flatMap((a) => a.opportunities);

    const prompt = `Given these brand audit opportunities for ${profile.brandName}, identify the top 5 most impactful opportunities to prioritize.

All Opportunities:
${allOpportunities.map((o, i) => `${i + 1}. ${o}`).join('\n')}

Provide the top 5 in order of priority/impact.

Output Format: JSON array
["opportunity 1", "opportunity 2", "opportunity 3", "opportunity 4", "opportunity 5"]`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private async identifyQuickWins(
    ...audits: AuditDimension[]
  ): Promise<string[]> {
    const allGaps = audits.flatMap((a) => a.gaps);

    const prompt = `Given these brand gaps, identify 3-4 quick wins (easy to implement, high impact).

All Gaps:
${allGaps.map((g, i) => `${i + 1}. ${g}`).join('\n')}

Output Format: JSON array
["quick win 1", "quick win 2", "quick win 3"]`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(this.extractJSON(response.content));
  }

  private extractJSON(content: string): string {
    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    return jsonMatch ? jsonMatch[0] : content;
  }
}
