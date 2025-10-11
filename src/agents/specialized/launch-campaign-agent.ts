/**
 * Launch Campaign Agent
 *
 * Generates comprehensive launch campaign plan including timeline, channel strategies,
 * press materials, and launch day checklist.
 *
 * Low-effort agent: Structured planning via LLM prompts
 */

import { EnhancedLLMService } from '../../services/llm-service.js';
import type {
  AgentInput,
  LaunchCampaignOutput,
  LaunchTimeline,
  ChannelPlan,
} from '../../types/specialized-agent-types.js';

export class LaunchCampaignAgent {
  private llm = new EnhancedLLMService();

  /**
   * Generate complete launch campaign package
   */
  async generateLaunchCampaign(input: AgentInput, weeks: number = 6): Promise<LaunchCampaignOutput> {
    console.log(`\n🚀 Launch Campaign Agent - ${input.brandProfile.brandName}\n`);

    const [campaignOverview, timeline, channelPlans, creativeAssets, pressRelease, launchChecklist, influencerOutreach] =
      await Promise.all([
        this.generateCampaignOverview(input),
        this.generateLaunchTimeline(input, weeks),
        this.generateChannelPlans(input),
        this.generateCreativeAssets(input),
        this.generatePressRelease(input),
        this.generateLaunchDayChecklist(input),
        this.generateInfluencerOutreach(input),
      ]);

    const output: LaunchCampaignOutput = {
      brandName: input.brandProfile.brandName,
      campaignOverview,
      timeline,
      channelPlans,
      creativeAssets,
      pressRelease,
      launchDayChecklist: launchChecklist,
      influencerOutreach,
    };

    console.log('✅ Launch campaign generation complete\n');
    return output;
  }

  /**
   * Generate campaign overview
   */
  private async generateCampaignOverview(input: AgentInput): Promise<{
    objective: string;
    targetAudience: string;
    keyMessage: string;
    duration: string;
  }> {
    console.log('  → Generating campaign overview...');

    const prompt = `
Create a launch campaign overview for ${input.brandProfile.brandName}.

**Brand Context:**
- Industry: ${input.brandProfile.industry}
- Target Audience: ${input.brandProfile.targetAudience}
- Business Stage: ${input.brandProfile.businessStage}
- Primary Goal: ${input.brandProfile.primaryGoal}

**Generate:**
1. **Objective** (1-2 sentences, what the launch aims to achieve)
2. **Target Audience** (1 sentence, specific audience segment)
3. **Key Message** (1 sentence, core campaign message)
4. **Duration** (e.g., "6 weeks")

Format as JSON:
{
  "objective": "...",
  "targetAudience": "...",
  "keyMessage": "...",
  "duration": "..."
}
`;

    const response = await this.llm.generateResponse({
      featureId: 'campaign-overview',
      userMessage: prompt,
      systemMessage: 'You are a launch campaign strategist.',
      context: { brandName: input.brandProfile.brandName },
    });

    return this.parseJSON(response.content, {
      objective: '',
      targetAudience: '',
      keyMessage: '',
      duration: '',
    });
  }

  /**
   * Generate launch timeline
   */
  private async generateLaunchTimeline(input: AgentInput, weeks: number): Promise<LaunchTimeline> {
    console.log(`  → Generating ${weeks}-week launch timeline...`);

    const prompt = `
Create a ${weeks}-week launch timeline for ${input.brandProfile.brandName}.

**Brand Context:**
- Industry: ${input.brandProfile.industry}
- Business Stage: ${input.brandProfile.businessStage}
- Primary Goal: ${input.brandProfile.primaryGoal}

**Generate week-by-week plan:**

For each week (Week 1 to Week ${weeks}):
1. **Focus** (Theme for the week, e.g., "Pre-launch buzz", "Launch week", "Post-launch optimization")
2. **Activities** (5-7 key activities for that week)
3. **Deliverables** (3-5 outputs to complete)

**Timeline Structure:**
- Weeks 1-2: Pre-launch preparation
- Weeks 3-4: Launch activation
- Weeks 5-${weeks}: Post-launch optimization

Format as JSON:
{
  "totalDuration": "${weeks} weeks",
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "...",
      "activities": ["...", "...", "...", "...", "..."],
      "deliverables": ["...", "...", "..."]
    }
  ]
}
`;

    const response = await this.llm.generateResponse({
      featureId: 'launch-timeline',
      userMessage: prompt,
      systemMessage: 'You are a project manager creating detailed launch timelines.',
      context: { brandName: input.brandProfile.brandName, weeks },
    });

    return this.parseJSON(response.content, {
      totalDuration: `${weeks} weeks`,
      weeks: [],
    });
  }

  /**
   * Generate channel plans
   */
  private async generateChannelPlans(input: AgentInput): Promise<ChannelPlan[]> {
    console.log('  → Generating channel activation plans...');

    const prompt = `
Create channel-specific activation plans for ${input.brandProfile.brandName} launch.

**Brand Context:**
- Industry: ${input.brandProfile.industry}
- Target Audience: ${input.brandProfile.targetAudience}

**Generate plans for 5 channels:**

1. **Social Media** (Instagram, Facebook, LinkedIn)
2. **Email Marketing**
3. **Content Marketing** (Blog, SEO)
4. **Paid Advertising** (Meta, Google)
5. **PR & Influencer**

For each channel:
- **Objective** (1 sentence, what this channel achieves)
- **Tactics** (5-7 specific tactics)
- **Budget** (estimated budget range or "TBD")
- **KPIs** (3-5 key performance indicators)

Format as JSON array:
[
  {
    "channel": "Social Media",
    "objective": "...",
    "tactics": ["...", "...", "...", "...", "..."],
    "budget": "...",
    "kpis": ["...", "...", "..."]
  }
]
`;

    const response = await this.llm.generateResponse({
      featureId: 'channel-plans',
      userMessage: prompt,
      systemMessage: 'You are a multi-channel marketing strategist.',
      context: { brandName: input.brandProfile.brandName },
    });

    return this.parseJSON(response.content, []);
  }

  /**
   * Generate creative assets list
   */
  private async generateCreativeAssets(input: AgentInput): Promise<Array<{
    assetType: string;
    description: string;
    specifications: string;
  }>> {
    console.log('  → Generating creative assets requirements...');

    const prompt = `
Create a creative assets list for ${input.brandProfile.brandName} launch campaign.

**Brand Context:**
- Industry: ${input.brandProfile.industry}

**Generate 10 essential creative assets:**

Types to include:
- Hero images/videos
- Social media graphics
- Email headers
- Ad creatives
- Landing page assets
- Print materials (if relevant)

For each asset:
- **Asset Type** (e.g., "Hero video", "Instagram carousel")
- **Description** (What it shows/communicates, 20-30 words)
- **Specifications** (Size, format, duration, e.g., "1920x1080, MP4, 30 seconds")

Format as JSON array:
[
  {
    "assetType": "...",
    "description": "...",
    "specifications": "..."
  }
]
`;

    const response = await this.llm.generateResponse({
      featureId: 'creative-assets',
      userMessage: prompt,
      systemMessage: 'You are a creative director planning campaign assets.',
      context: { brandName: input.brandProfile.brandName },
    });

    return this.parseJSON(response.content, []);
  }

  /**
   * Generate press release
   */
  private async generatePressRelease(input: AgentInput): Promise<{
    headline: string;
    subheadline: string;
    body: string;
    boilerplate: string;
    contacts: string;
  }> {
    console.log('  → Generating press release...');

    const prompt = `
Create a press release for ${input.brandProfile.brandName} launch.

**Brand Context:**
- Industry: ${input.brandProfile.industry}
- Target Audience: ${input.brandProfile.targetAudience}
- Business Stage: ${input.brandProfile.businessStage}

**Generate:**
1. **Headline** (10-15 words, newsworthy and compelling)
2. **Subheadline** (15-20 words, supporting detail)
3. **Body** (300-400 words, following AP style)
   - Lead paragraph (Who, What, When, Where, Why)
   - 2-3 supporting paragraphs
   - Quote from founder/CEO
   - Details and benefits
4. **Boilerplate** (50-75 words, "About [Brand]")
5. **Contacts** (Media contact information)

Format as JSON:
{
  "headline": "...",
  "subheadline": "...",
  "body": "...",
  "boilerplate": "...",
  "contacts": "..."
}
`;

    const response = await this.llm.generateResponse({
      featureId: 'press-release',
      userMessage: prompt,
      systemMessage: 'You are a PR professional writing press releases.',
      context: { brandName: input.brandProfile.brandName },
    });

    return this.parseJSON(response.content, {
      headline: '',
      subheadline: '',
      body: '',
      boilerplate: '',
      contacts: '',
    });
  }

  /**
   * Generate launch day checklist
   */
  private async generateLaunchDayChecklist(input: AgentInput): Promise<Array<{
    time: string;
    task: string;
    owner: string;
    priority: 'critical' | 'high' | 'medium';
  }>> {
    console.log('  → Generating launch day checklist...');

    const prompt = `
Create a launch day checklist for ${input.brandProfile.brandName}.

**Generate 20-25 tasks** organized by time:

**Time Blocks:**
- Pre-launch (7:00 AM - 9:00 AM): Final preparations
- Launch (9:00 AM - 10:00 AM): Go-live activities
- Morning (10:00 AM - 12:00 PM): Initial monitoring
- Afternoon (12:00 PM - 5:00 PM): Active engagement
- Evening (5:00 PM - 8:00 PM): Day-end review

For each task:
- **Time** (e.g., "9:00 AM")
- **Task** (Specific action item)
- **Owner** (Role: Marketing, Social, Tech, PR)
- **Priority** (critical, high, or medium)

Format as JSON array:
[
  {
    "time": "9:00 AM",
    "task": "...",
    "owner": "Marketing",
    "priority": "critical"
  }
]
`;

    const response = await this.llm.generateResponse({
      featureId: 'launch-checklist',
      userMessage: prompt,
      systemMessage: 'You are a launch manager creating detailed checklists.',
      context: { brandName: input.brandProfile.brandName },
    });

    return this.parseJSON(response.content, []);
  }

  /**
   * Generate influencer outreach strategy
   */
  private async generateInfluencerOutreach(input: AgentInput): Promise<{
    targetProfiles: string[];
    outreachScript: string;
    partnershipGuidelines: string;
  }> {
    console.log('  → Generating influencer outreach strategy...');

    const prompt = `
Create an influencer outreach strategy for ${input.brandProfile.brandName}.

**Brand Context:**
- Industry: ${input.brandProfile.industry}
- Target Audience: ${input.brandProfile.targetAudience}

**Generate:**

1. **Target Profiles** (5-7 influencer types to approach)
   - E.g., "Micro-influencers (10k-50k followers) in wellness space"

2. **Outreach Script** (150-200 words)
   - Personalized email template
   - Introduces brand
   - Proposes collaboration
   - Call to action

3. **Partnership Guidelines** (100-150 words)
   - Collaboration terms
   - Content expectations
   - Compensation structure
   - Timeline

Format as JSON:
{
  "targetProfiles": ["...", "...", "...", "...", "..."],
  "outreachScript": "...",
  "partnershipGuidelines": "..."
}
`;

    const response = await this.llm.generateResponse({
      featureId: 'influencer-outreach',
      userMessage: prompt,
      systemMessage: 'You are an influencer marketing specialist.',
      context: { brandName: input.brandProfile.brandName },
    });

    return this.parseJSON(response.content, {
      targetProfiles: [],
      outreachScript: '',
      partnershipGuidelines: '',
    });
  }

  /**
   * Generic JSON parser with fallback
   */
  private parseJSON<T>(content: string, fallback: T): T {
    try {
      const jsonMatch = content.match(/[\[{][\s\S]*[\]}]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse JSON response, using fallback');
    }
    return fallback;
  }
}
