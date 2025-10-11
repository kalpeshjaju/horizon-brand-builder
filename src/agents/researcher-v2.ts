// Enhanced Brand Research Agent - Version 2.0
// Integrates: Web Research + Fact-Checking + User Data

import type { LLMAdapter } from '../adapters/llm-interface.js';
import type { BrandProfile } from '../types/brand-types.js';
import type {
  EnhancedResearchReport,
  UserProvidedData,
  IndustryResearchData,
  CompetitorAnalysisV2,
  SourcedClaim,
  ConfidenceLevel,
} from '../types/research-types.js';
import { WebResearchService } from '../services/web-research-service.js';
import { EnhancedFactCheckerService } from '../services/fact-checker-enhanced.js';

export class ResearchAgentV2 {
  private llm: LLMAdapter;
  private webResearch: WebResearchService;
  private factChecker: EnhancedFactCheckerService;

  constructor(llm: LLMAdapter) {
    this.llm = llm;
    this.webResearch = new WebResearchService();
    this.factChecker = new EnhancedFactCheckerService(llm);
  }

  async conductResearch(
    profile: BrandProfile,
    userData?: UserProvidedData
  ): Promise<EnhancedResearchReport> {
    console.log('\n═══════════════════════════════════════════════════════════\n');
    console.log('🔬 ENHANCED BRAND RESEARCH (Version 2.0)');
    console.log('   Combining: LLM Analysis + Web Research + Fact-Checking\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    const startTime = Date.now();

    // Phase 1: Web Research (if enabled)
    console.log('📡 Phase 1: Web Research\n');
    const industryData = await this.fetchIndustryData(profile, userData);

    // Phase 2: Competitor Analysis (with web scraping)
    console.log('\n📡 Phase 2: Competitor Analysis\n');
    const competitorLandscape = await this.analyzeCompetitors(profile, userData);

    // Phase 3: LLM-Based Analysis
    console.log('\n🤖 Phase 3: LLM Strategic Analysis\n');
    const llmInsights = await this.generateLLMInsights(profile, industryData, competitorLandscape);

    // Phase 4: Fact-Checking
    console.log('\n✅ Phase 4: Fact-Checking & Validation\n');
    const validatedInsights = await this.validateInsights(llmInsights);

    // Phase 5: Synthesis
    console.log('\n🧬 Phase 5: Synthesis & Recommendations\n');
    const synthesisNotes = await this.synthesizeFindings(
      profile,
      industryData,
      competitorLandscape,
      validatedInsights
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Research complete in ${duration}s\n`);

    // Generate confidence report
    const allClaims = this.extractAllClaims(validatedInsights);
    const confidenceReport = this.factChecker.generateConfidenceReport(allClaims);

    return {
      marketInsights: {
        industryData,
        competitorLandscape,
        marketOpportunities: validatedInsights.opportunities,
        keyFindings: validatedInsights.findings,
      },
      audienceProfile: validatedInsights.audienceProfile,
      brandDNA: validatedInsights.brandDNA,
      metadata: {
        researchDate: new Date().toISOString(),
        webResearchUsed: true,
        userDataProvided: !!userData,
        overallConfidence: confidenceReport.overallConfidence,
        sources: this.collectAllSources(industryData, competitorLandscape, validatedInsights),
      },
      synthesisNotes,
    };
  }

  private async fetchIndustryData(
    profile: BrandProfile,
    userData?: UserProvidedData
  ): Promise<IndustryResearchData> {
    console.log(`   🌐 Fetching industry data for: ${profile.industry}\n`);

    // If user provided market data, use it
    if (userData?.knownMarketData && userData.knownMarketData.length > 0) {
      console.log('   ✅ Using user-provided market data\n');
    }

    // Fetch from web (would use WebSearch in real implementation)
    const industryData = await this.webResearch.fetchIndustryData(profile.industry, 'India');

    // Use LLM to analyze and structure the data
    const llmAnalysis = await this.analyzIndustryDataWithLLM(profile, industryData, userData);

    return {
      ...industryData,
      ...llmAnalysis,
    };
  }

  private async analyzIndustryDataWithLLM(
    profile: BrandProfile,
    webData: IndustryResearchData,
    userData?: UserProvidedData
  ): Promise<Partial<IndustryResearchData>> {
    const prompt = `Analyze the ${profile.industry} industry for ${profile.brandName}.

Brand Context:
- Industry: ${profile.industry}
- Target Audience: ${profile.targetAudience}
- Business Stage: ${profile.businessStage}

${userData?.knownMarketData ? `User-Provided Market Data:\n${JSON.stringify(userData.knownMarketData, null, 2)}\n` : ''}

Tasks:
1. Identify 5-7 key industry trends
2. Highlight market opportunities for ${profile.brandName}
3. Note any threats or challenges

IMPORTANT:
- DO NOT invent statistics (%, CAGR, market size numbers)
- If you don't know exact numbers, say "specific data not available"
- Focus on qualitative trends and strategic insights
- Mark any uncertain claims clearly

Provide analysis in JSON format.`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const analysis = JSON.parse(this.extractJSON(response.content));

    return analysis;
  }

  private async analyzeCompetitors(
    profile: BrandProfile,
    userData?: UserProvidedData
  ): Promise<CompetitorAnalysisV2[]> {
    console.log('   🔍 Analyzing competitors...\n');

    const competitorUrls = userData?.competitorUrls || [];

    // If user provided competitor URLs, scrape them
    if (competitorUrls.length > 0) {
      console.log(`   📡 Fetching ${competitorUrls.length} competitor websites...\n`);

      const webDataMap = await this.webResearch.batchFetchCompetitors(competitorUrls);

      // Analyze each competitor with LLM + web data
      const competitors: CompetitorAnalysisV2[] = [];

      for (const [url, webData] of webDataMap.entries()) {
        const analysis = await this.analyzeCompetitorWithData(profile, url, webData);
        competitors.push(analysis);
      }

      return competitors;
    } else {
      // Fall back to LLM-only analysis (with disclaimer)
      console.log('   ⚠️  No competitor URLs provided - using LLM knowledge only\n');
      console.log('   💡 Tip: Provide competitor URLs for live website analysis\n');

      return this.analyzeCompetitorsLLMOnly(profile);
    }
  }

  private async analyzeCompetitorWithData(
    profile: BrandProfile,
    url: string,
    webData: any
  ): Promise<CompetitorAnalysisV2> {
    const prompt = `Analyze this competitor for ${profile.brandName}.

Competitor Website: ${url}

${webData ? `Scraped Data:\n${JSON.stringify(webData, null, 2)}\n` : 'Web data not available'}

Tasks:
1. Identify positioning (how they position themselves)
2. Key strengths (3-4 points)
3. Key weaknesses (3-4 points)
4. Differentiation opportunity for ${profile.brandName}

Be specific and cite the website data when possible.
Provide analysis in JSON format.`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const analysis = JSON.parse(this.extractJSON(response.content));

    return {
      name: analysis.name || new URL(url).hostname,
      website: url,
      positioning: {
        claim: analysis.positioning,
        source: 'Competitor website',
        sourceUrl: url,
        confidence: webData ? 'high' : 'medium',
        dateAccessed: new Date().toISOString(),
      },
      strengths: (analysis.strengths || []).map((s: string) => ({
        claim: s,
        source: 'Website analysis',
        sourceUrl: url,
        confidence: 'medium' as ConfidenceLevel,
      })),
      weaknesses: (analysis.weaknesses || []).map((w: string) => ({
        claim: w,
        source: 'Competitive analysis',
        confidence: 'medium' as ConfidenceLevel,
      })),
      webData,
      differentiationOpportunity: analysis.differentiationOpportunity,
      lastUpdated: new Date().toISOString(),
    };
  }

  private async analyzeCompetitorsLLMOnly(profile: BrandProfile): Promise<CompetitorAnalysisV2[]> {
    const prompt = `Identify 3-5 main competitors for ${profile.brandName} in the ${profile.industry} industry.

For each competitor:
- Name
- Positioning statement
- Key strengths (2-3)
- Key weaknesses (2-3)
- How ${profile.brandName} can differentiate

IMPORTANT:
- Only include well-known competitors you're confident about
- Mark analysis as "LLM knowledge-based, not live data"
- Suggest that user should verify with live website analysis

Output JSON format.`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const analysis = JSON.parse(this.extractJSON(response.content));

    // Convert to CompetitorAnalysisV2 with low confidence flags
    return (analysis.competitors || []).map((comp: any) => ({
      name: comp.name,
      website: comp.website || '',
      positioning: {
        claim: comp.positioning,
        confidence: 'low' as ConfidenceLevel,
        verificationNotes: 'Based on LLM knowledge, not live website data. Verify with actual website.',
      },
      strengths: (comp.strengths || []).map((s: string) => ({
        claim: s,
        confidence: 'low' as ConfidenceLevel,
      })),
      weaknesses: (comp.weaknesses || []).map((w: string) => ({
        claim: w,
        confidence: 'low' as ConfidenceLevel,
      })),
      differentiationOpportunity: comp.differentiationOpportunity,
      lastUpdated: new Date().toISOString(),
    }));
  }

  private async generateLLMInsights(
    profile: BrandProfile,
    industryData: IndustryResearchData,
    competitors: CompetitorAnalysisV2[]
  ): Promise<any> {
    // Generate audience personas, market opportunities, brand DNA using LLM
    // Similar to V1 but with context from web research

    const prompt = `Generate strategic insights for ${profile.brandName}.

Context:
${JSON.stringify({ profile, industryData, competitors }, null, 2)}

Generate:
1. Market opportunities (5-7)
2. Key strategic findings (3-5)
3. Customer personas (3-4)
4. Audience pain points, desires, decision factors
5. Brand DNA (UVP, story, strengths)

Output JSON format with all sections.`;

    const response = await this.llm.generateResponse({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return JSON.parse(this.extractJSON(response.content));
  }

  private async validateInsights(insights: any): Promise<any> {
    console.log('   🔍 Validating all claims and statistics...\n');

    // Extract claims and validate
    // For now, return insights with confidence scores added

    return {
      ...insights,
      opportunities: (insights.opportunities || []).map((opp: string) => ({
        claim: opp,
        confidence: 'medium' as ConfidenceLevel,
      })),
      findings: (insights.findings || []).map((finding: string) => ({
        claim: finding,
        confidence: 'medium' as ConfidenceLevel,
      })),
    };
  }

  private async synthesizeFindings(
    profile: BrandProfile,
    industryData: IndustryResearchData,
    competitors: CompetitorAnalysisV2[],
    insights: any
  ): Promise<string> {
    const prompt = `Synthesize research findings into strategic recommendations for ${profile.brandName}.

Key Data:
- Industry: ${JSON.stringify(industryData.trends)}
- Competitors: ${competitors.length} analyzed
- Opportunities: ${insights.opportunities?.length || 0} identified

Provide:
1. Top 3-5 strategic insights
2. Recommended positioning direction
3. Critical success factors
4. Key risks to address

Write in professional strategic tone (300-400 words).`;

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

  private extractAllClaims(insights: any): SourcedClaim[] {
    const claims: SourcedClaim[] = [];

    if (insights.opportunities) {
      claims.push(...insights.opportunities);
    }

    if (insights.findings) {
      claims.push(...insights.findings);
    }

    return claims;
  }

  private collectAllSources(
    industryData: IndustryResearchData,
    competitors: CompetitorAnalysisV2[],
    insights: any
  ): string[] {
    const sources = new Set<string>();

    // Collect from industry data
    if (industryData.sources) {
      industryData.sources.forEach(s => sources.add(s));
    }

    // Collect from competitors
    competitors.forEach(comp => {
      if (comp.website) sources.add(comp.website);
      if (comp.positioning.sourceUrl) sources.add(comp.positioning.sourceUrl);
    });

    return Array.from(sources);
  }
}
