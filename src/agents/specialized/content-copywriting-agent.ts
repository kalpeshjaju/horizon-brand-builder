/**
 * Content & Copywriting Agent
 *
 * Generates production-ready website copy, email templates, and product descriptions
 * based on brand strategy from horizon-brand-builder.
 *
 * Low-effort agent: Pure LLM prompts, no external dependencies
 */

import { EnhancedLLMService } from '../../services/llm-service.js';
import type {
  AgentInput,
  ContentCopyOutput,
  WebsiteCopy,
  EmailTemplates,
} from '../../types/specialized-agent-types.js';
import type { BrandStrategy } from '../../types/brand-types.js';

export class ContentCopywritingAgent {
  private llm = new EnhancedLLMService();

  /**
   * Generate complete content package
   */
  async generateContent(input: AgentInput): Promise<ContentCopyOutput> {
    console.log(`\n📝 Content & Copywriting Agent - ${input.brandProfile.brandName}\n`);

    const [websiteCopy, emailTemplates, productDescriptions, seoMetadata] = await Promise.all([
      this.generateWebsiteCopy(input),
      this.generateEmailTemplates(input),
      this.generateProductDescriptions(input),
      this.generateSEOMetadata(input),
    ]);

    const output: ContentCopyOutput = {
      brandName: input.brandProfile.brandName,
      websiteCopy,
      emailTemplates,
      productDescriptions,
      seoMetadata,
    };

    console.log('✅ Content generation complete\n');
    return output;
  }

  /**
   * Generate website copy (homepage, about, features)
   */
  private async generateWebsiteCopy(input: AgentInput): Promise<WebsiteCopy> {
    console.log('  → Generating website copy...');

    const prompt = this.buildWebsiteCopyPrompt(input);

    const response = await this.llm.generateResponse({
      featureId: 'website-copy',
      userMessage: prompt,
      systemMessage: 'You are an expert brand copywriter creating compelling website copy.',
      context: {
        brandName: input.brandProfile.brandName,
        industry: input.brandProfile.industry,
      },
    });

    // Parse structured response
    const content = response.content;

    return this.parseWebsiteCopy(content, input.brandProfile.brandName);
  }

  /**
   * Generate email templates
   */
  private async generateEmailTemplates(input: AgentInput): Promise<EmailTemplates> {
    console.log('  → Generating email templates...');

    const prompt = this.buildEmailTemplatesPrompt(input);

    const response = await this.llm.generateResponse({
      featureId: 'email-templates',
      userMessage: prompt,
      systemMessage: 'You are an expert email marketing copywriter.',
      context: {
        brandName: input.brandProfile.brandName,
      },
    });

    return this.parseEmailTemplates(response.content);
  }

  /**
   * Generate product descriptions
   */
  private async generateProductDescriptions(input: AgentInput): Promise<Array<{
    productName: string;
    shortDescription: string;
    longDescription: string;
    keyFeatures: string[];
  }>> {
    console.log('  → Generating product descriptions...');

    const prompt = this.buildProductDescriptionsPrompt(input);

    const response = await this.llm.generateResponse({
      featureId: 'product-descriptions',
      userMessage: prompt,
      systemMessage: 'You are an expert e-commerce copywriter creating product descriptions.',
      context: {
        brandName: input.brandProfile.brandName,
        industry: input.brandProfile.industry,
      },
    });

    return this.parseProductDescriptions(response.content);
  }

  /**
   * Generate SEO metadata
   */
  private async generateSEOMetadata(input: AgentInput): Promise<{
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  }> {
    console.log('  → Generating SEO metadata...');

    const prompt = this.buildSEOMetadataPrompt(input);

    const response = await this.llm.generateResponse({
      featureId: 'seo-metadata',
      userMessage: prompt,
      systemMessage: 'You are an SEO expert creating metadata for maximum visibility.',
      context: {
        brandName: input.brandProfile.brandName,
        industry: input.brandProfile.industry,
      },
    });

    return this.parseSEOMetadata(response.content);
  }

  /**
   * Build website copy prompt
   */
  private buildWebsiteCopyPrompt(input: AgentInput): string {
    const { brandProfile, brandStrategy } = input;

    return `
Create compelling website copy for ${brandProfile.brandName}.

**Brand Context:**
- Industry: ${brandProfile.industry}
- Target Audience: ${brandProfile.targetAudience}
- Business Stage: ${brandProfile.businessStage}
- Primary Goal: ${brandProfile.primaryGoal}

${brandStrategy ? `
**Brand Strategy:**
- Purpose: ${brandStrategy.foundation.purpose}
- Mission: ${brandStrategy.foundation.mission}
- Market Position: ${brandStrategy.positioning.marketPosition}
- Personality Traits: ${brandStrategy.personality.traits.join(', ')}
- Voice: ${brandStrategy.personality.voiceAndTone.voice}
` : ''}

**Generate:**

1. **Homepage Hero Section**
   - Headline (7-12 words, impactful)
   - Subheadline (15-25 words, supporting)
   - CTA button text (2-4 words)

2. **Features Section** (3 features)
   - Title (3-5 words)
   - Description (20-30 words)

3. **About Section** (150-200 words)
   - Brand story, purpose, and what makes them unique

Format as JSON:
{
  "homepage": {
    "hero": {
      "headline": "...",
      "subheadline": "...",
      "cta": "..."
    },
    "features": [
      {"title": "...", "description": "..."},
      {"title": "...", "description": "..."},
      {"title": "...", "description": "..."}
    ],
    "about": "..."
  }
}
`;
  }

  /**
   * Build email templates prompt
   */
  private buildEmailTemplatesPrompt(input: AgentInput): string {
    const { brandProfile, brandStrategy } = input;

    return `
Create email templates for ${brandProfile.brandName}.

**Brand Context:**
- Industry: ${brandProfile.industry}
- Target Audience: ${brandProfile.targetAudience}
- Voice: ${brandStrategy?.personality.voiceAndTone.voice || 'Professional and friendly'}

**Generate 3 email templates:**

1. **Welcome Email**
   - Subject line (compelling, 5-10 words)
   - Preheader text (supporting, 10-15 words)
   - Body copy (150-200 words, warm introduction)
   - CTA text (2-4 words)

2. **Order Confirmation**
   - Subject line
   - Body copy (100-150 words, confirming order, next steps)

3. **Promotional Email**
   - Subject line (attention-grabbing)
   - Preheader text
   - Body copy (150-200 words, compelling offer)
   - CTA text

Format as JSON:
{
  "welcome": {
    "subject": "...",
    "preheader": "...",
    "body": "...",
    "cta": "..."
  },
  "orderConfirmation": {
    "subject": "...",
    "body": "..."
  },
  "promotional": {
    "subject": "...",
    "preheader": "...",
    "body": "...",
    "cta": "..."
  }
}
`;
  }

  /**
   * Build product descriptions prompt
   */
  private buildProductDescriptionsPrompt(input: AgentInput): string {
    const { brandProfile } = input;

    return `
Create product descriptions for ${brandProfile.brandName} in the ${brandProfile.industry} industry.

**Brand Context:**
- Target Audience: ${brandProfile.targetAudience}
- Business Stage: ${brandProfile.businessStage}

**Generate 3 sample product descriptions:**

For each product:
1. **Short Description** (50-75 words, for product cards)
2. **Long Description** (150-200 words, for product pages)
3. **Key Features** (5 bullet points)

Format as JSON array:
[
  {
    "productName": "Premium Product 1",
    "shortDescription": "...",
    "longDescription": "...",
    "keyFeatures": ["...", "...", "...", "...", "..."]
  },
  {
    "productName": "Premium Product 2",
    "shortDescription": "...",
    "longDescription": "...",
    "keyFeatures": ["...", "...", "...", "...", "..."]
  },
  {
    "productName": "Premium Product 3",
    "shortDescription": "...",
    "longDescription": "...",
    "keyFeatures": ["...", "...", "...", "...", "..."]
  }
]
`;
  }

  /**
   * Build SEO metadata prompt
   */
  private buildSEOMetadataPrompt(input: AgentInput): string {
    const { brandProfile } = input;

    return `
Create SEO metadata for ${brandProfile.brandName}.

**Brand Context:**
- Industry: ${brandProfile.industry}
- Target Audience: ${brandProfile.targetAudience}

**Generate:**
1. **Meta Title** (50-60 characters, includes brand name)
2. **Meta Description** (150-160 characters, compelling)
3. **Keywords** (10 keywords, mix of branded, category, and long-tail)

Format as JSON:
{
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": ["...", "...", "...", "...", "...", "...", "...", "...", "...", "..."]
}
`;
  }

  /**
   * Parse website copy from LLM response
   */
  private parseWebsiteCopy(content: string, brandName: string): WebsiteCopy {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          homepage: parsed.homepage,
          productPages: [],
          aboutUs: {
            story: parsed.homepage.about,
            mission: '',
            values: [],
          },
        };
      }
    } catch (error) {
      console.warn('Failed to parse website copy, using fallback');
    }

    // Fallback structure
    return {
      homepage: {
        hero: {
          headline: `Welcome to ${brandName}`,
          subheadline: 'Your trusted partner',
          cta: 'Learn More',
        },
        features: [],
        about: '',
      },
      productPages: [],
      aboutUs: {
        story: '',
        mission: '',
        values: [],
      },
    };
  }

  /**
   * Parse email templates from LLM response
   */
  private parseEmailTemplates(content: string): EmailTemplates {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse email templates, using fallback');
    }

    // Fallback structure
    return {
      welcome: {
        subject: 'Welcome!',
        preheader: '',
        body: '',
        cta: 'Get Started',
      },
      orderConfirmation: {
        subject: 'Order Confirmed',
        body: '',
      },
      promotional: {
        subject: 'Special Offer',
        preheader: '',
        body: '',
        cta: 'Shop Now',
      },
    };
  }

  /**
   * Parse product descriptions from LLM response
   */
  private parseProductDescriptions(content: string): Array<{
    productName: string;
    shortDescription: string;
    longDescription: string;
    keyFeatures: string[];
  }> {
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse product descriptions, using fallback');
    }

    // Fallback structure
    return [];
  }

  /**
   * Parse SEO metadata from LLM response
   */
  private parseSEOMetadata(content: string): {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  } {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to parse SEO metadata, using fallback');
    }

    // Fallback structure
    return {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    };
  }
}
