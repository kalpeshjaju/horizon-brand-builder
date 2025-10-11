/**
 * Social Media Manager Agent
 *
 * Generates content calendar, social posts, hashtag strategy, and engagement playbook
 * based on social media strategy from horizon-brand-builder.
 *
 * Low-effort agent: Pure LLM prompts + structured calendar generation
 */

import { EnhancedLLMService } from '../../services/llm-service.js';
import type {
  AgentInput,
  SocialMediaOutput,
  ContentCalendar,
  SocialPost,
  HashtagStrategy,
} from '../../types/specialized-agent-types.js';

export class SocialMediaAgent {
  private llm = new EnhancedLLMService();

  /**
   * Generate complete social media package
   */
  async generateSocialMediaContent(
    input: AgentInput,
    duration: number = 30 // days
  ): Promise<SocialMediaOutput> {
    console.log(`\n📱 Social Media Manager Agent - ${input.brandProfile.brandName}\n`);

    const [contentCalendar, hashtagStrategy, engagementPlaybook, storyIdeas] = await Promise.all([
      this.generateContentCalendar(input, duration),
      this.generateHashtagStrategy(input),
      this.generateEngagementPlaybook(input),
      this.generateStoryIdeas(input),
    ]);

    const output: SocialMediaOutput = {
      brandName: input.brandProfile.brandName,
      contentCalendar,
      hashtagStrategy,
      engagementPlaybook,
      storyIdeas,
    };

    console.log('✅ Social media content generation complete\n');
    return output;
  }

  /**
   * Generate content calendar
   */
  private async generateContentCalendar(input: AgentInput, days: number): Promise<ContentCalendar> {
    console.log(`  → Generating ${days}-day content calendar...`);

    const prompt = this.buildContentCalendarPrompt(input, days);

    const response = await this.llm.generateResponse({
      featureId: 'content-calendar',
      userMessage: prompt,
      systemMessage: 'You are an expert social media strategist creating engaging content calendars.',
      context: {
        brandName: input.brandProfile.brandName,
        industry: input.brandProfile.industry,
        duration: days,
      },
    });

    return this.parseContentCalendar(response.content, input.brandProfile.brandName, days);
  }

  /**
   * Generate hashtag strategy
   */
  private async generateHashtagStrategy(input: AgentInput): Promise<HashtagStrategy> {
    console.log('  → Generating hashtag strategy...');

    const prompt = this.buildHashtagStrategyPrompt(input);

    const response = await this.llm.generateResponse({
      featureId: 'hashtag-strategy',
      userMessage: prompt,
      systemMessage: 'You are a social media expert specializing in hashtag strategy.',
      context: {
        brandName: input.brandProfile.brandName,
        industry: input.brandProfile.industry,
      },
    });

    return this.parseHashtagStrategy(response.content);
  }

  /**
   * Generate engagement playbook
   */
  private async generateEngagementPlaybook(input: AgentInput): Promise<{
    responseTemplates: string[];
    engagementTactics: string[];
    communityGuidelines: string;
  }> {
    console.log('  → Generating engagement playbook...');

    const prompt = this.buildEngagementPlaybookPrompt(input);

    const response = await this.llm.generateResponse({
      featureId: 'engagement-playbook',
      userMessage: prompt,
      systemMessage: 'You are a community manager expert creating engagement strategies.',
      context: {
        brandName: input.brandProfile.brandName,
      },
    });

    return this.parseEngagementPlaybook(response.content);
  }

  /**
   * Generate story ideas
   */
  private async generateStoryIdeas(input: AgentInput): Promise<Array<{
    title: string;
    description: string;
    visualConcept: string;
  }>> {
    console.log('  → Generating Instagram story ideas...');

    const prompt = this.buildStoryIdeasPrompt(input);

    const response = await this.llm.generateResponse({
      featureId: 'story-ideas',
      userMessage: prompt,
      systemMessage: 'You are a social media content creator specializing in Instagram Stories.',
      context: {
        brandName: input.brandProfile.brandName,
      },
    });

    return this.parseStoryIdeas(response.content);
  }

  /**
   * Build content calendar prompt
   */
  private buildContentCalendarPrompt(input: AgentInput, days: number): string {
    const { brandProfile, brandStrategy } = input;
    const postsPerWeek = 3; // Conservative: 3 posts/week
    const totalPosts = Math.ceil((days / 7) * postsPerWeek);

    return `
Create a ${days}-day social media content calendar for ${brandProfile.brandName}.

**Brand Context:**
- Industry: ${brandProfile.industry}
- Target Audience: ${brandProfile.targetAudience}
- Brand Voice: ${brandStrategy?.personality.voiceAndTone.voice || 'Professional and engaging'}
- Personality Traits: ${brandStrategy?.personality.traits.join(', ') || 'Authentic, helpful'}

**Content Mix:**
- Educational (40%): Tips, how-tos, industry insights
- Inspirational (30%): Stories, testimonials, behind-the-scenes
- Promotional (20%): Products, offers, launches
- Engaging (10%): Questions, polls, user-generated content

**Generate ${totalPosts} posts** (${postsPerWeek} posts/week) with:

1. **Date** (YYYY-MM-DD, spread across ${days} days)
2. **Platform** (instagram, facebook, linkedin, or twitter)
3. **Post Type** (image, carousel, video, or story)
4. **Caption** (50-150 words, engaging and on-brand)
5. **Hashtags** (5-10 relevant hashtags)
6. **Visual Guidance** (What the image/video should show)
7. **Call to Action** (optional)

Also provide **weekly themes** for ${Math.ceil(days / 7)} weeks.

Format as JSON:
{
  "posts": [
    {
      "date": "2025-01-01",
      "platform": "instagram",
      "postType": "image",
      "caption": "...",
      "hashtags": ["#...", "#...", "#..."],
      "visualGuidance": "...",
      "callToAction": "..."
    }
  ],
  "themes": [
    {
      "week": 1,
      "theme": "...",
      "focus": "..."
    }
  ]
}
`;
  }

  /**
   * Build hashtag strategy prompt
   */
  private buildHashtagStrategyPrompt(input: AgentInput): string {
    const { brandProfile } = input;

    return `
Create a comprehensive hashtag strategy for ${brandProfile.brandName}.

**Brand Context:**
- Industry: ${brandProfile.industry}
- Target Audience: ${brandProfile.targetAudience}

**Generate 4 hashtag categories:**

1. **Branded** (5 hashtags)
   - Brand name variations
   - Branded campaigns
   - Brand-specific terms

2. **Industry** (10 hashtags)
   - Category/niche hashtags
   - Industry-specific terms
   - Professional hashtags

3. **Community** (10 hashtags)
   - Audience lifestyle
   - Community interests
   - Values-based hashtags

4. **Trending** (5 hashtags)
   - Evergreen trending hashtags
   - Seasonal opportunities
   - Cultural moments

Format as JSON:
{
  "branded": ["#...", "#...", "#...", "#...", "#..."],
  "industry": ["#...", "#...", "#...", "#...", "#...", "#...", "#...", "#...", "#...", "#..."],
  "community": ["#...", "#...", "#...", "#...", "#...", "#...", "#...", "#...", "#...", "#..."],
  "trending": ["#...", "#...", "#...", "#...", "#..."]
}
`;
  }

  /**
   * Build engagement playbook prompt
   */
  private buildEngagementPlaybookPrompt(input: AgentInput): string {
    const { brandProfile, brandStrategy } = input;

    return `
Create an engagement playbook for ${brandProfile.brandName}.

**Brand Context:**
- Industry: ${brandProfile.industry}
- Brand Voice: ${brandStrategy?.personality.voiceAndTone.voice || 'Professional and friendly'}

**Generate:**

1. **Response Templates** (10 templates)
   - Thank you responses
   - Handling complaints
   - Answering questions
   - Encouraging engagement
   - Sharing user content

2. **Engagement Tactics** (10 tactics)
   - Daily engagement actions
   - Community building techniques
   - Content amplification strategies
   - Relationship building approaches

3. **Community Guidelines** (100-150 words)
   - Tone and voice rules
   - Response time expectations
   - Escalation procedures
   - Do's and don'ts

Format as JSON:
{
  "responseTemplates": [
    "Thank you for...",
    "We appreciate...",
    "Great question! Here's...",
    ...
  ],
  "engagementTactics": [
    "Respond to all comments within 2 hours",
    "Like and comment on 10 customer posts daily",
    ...
  ],
  "communityGuidelines": "..."
}
`;
  }

  /**
   * Build story ideas prompt
   */
  private buildStoryIdeasPrompt(input: AgentInput): string {
    const { brandProfile } = input;

    return `
Create 15 Instagram Story ideas for ${brandProfile.brandName}.

**Brand Context:**
- Industry: ${brandProfile.industry}
- Target Audience: ${brandProfile.targetAudience}

**Story Types:**
- Behind-the-scenes (5 ideas)
- Educational/Tips (5 ideas)
- Interactive/Engaging (5 ideas)

For each story:
1. **Title** (3-5 words)
2. **Description** (30-50 words, what to show/say)
3. **Visual Concept** (What viewers will see)

Format as JSON array:
[
  {
    "title": "...",
    "description": "...",
    "visualConcept": "..."
  }
]
`;
  }

  /**
   * Parse content calendar from LLM response
   */
  private parseContentCalendar(content: string, brandName: string, days: number): ContentCalendar {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          brandName,
          duration: days,
          posts: parsed.posts || [],
          themes: parsed.themes || [],
        };
      }
    } catch (error) {
      console.warn('Failed to parse content calendar, using fallback');
    }

    // Fallback structure
    return {
      brandName,
      duration: days,
      posts: [],
      themes: [],
    };
  }

  /**
   * Parse hashtag strategy from LLM response
   */
  private parseHashtagStrategy(content: string): HashtagStrategy {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse hashtag strategy, using fallback');
    }

    // Fallback structure
    return {
      branded: [],
      industry: [],
      community: [],
      trending: [],
    };
  }

  /**
   * Parse engagement playbook from LLM response
   */
  private parseEngagementPlaybook(content: string): {
    responseTemplates: string[];
    engagementTactics: string[];
    communityGuidelines: string;
  } {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse engagement playbook, using fallback');
    }

    // Fallback structure
    return {
      responseTemplates: [],
      engagementTactics: [],
      communityGuidelines: '',
    };
  }

  /**
   * Parse story ideas from LLM response
   */
  private parseStoryIdeas(content: string): Array<{
    title: string;
    description: string;
    visualConcept: string;
  }> {
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse story ideas, using fallback');
    }

    // Fallback structure
    return [];
  }
}
