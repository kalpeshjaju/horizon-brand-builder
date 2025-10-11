// Interactive version - runs directly in Claude Code without API calls
// Uses prompts that YOU (Claude Code) will respond to

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { BrandProfile } from './types/brand-types.js';
import { BrandClassifier } from './utils/brand-classifier.js';

console.log(`
╔════════════════════════════════════════════════════════════════╗
║        BRAND DESIGN AGENT - Interactive Mode                   ║
║        Running with Claude Code (No API Key Needed!)           ║
╚════════════════════════════════════════════════════════════════╝

This mode generates prompts that Claude Code will answer.
After each phase, I'll save the outputs and generate the next prompt.
`);

// Brand profile for flyberry.in
const brandProfile: Partial<BrandProfile> = {
  brandName: 'Flyberry',
  industry: 'E-commerce Fashion (Resale/Pre-loved luxury)',
  targetAudience: 'B2C consumers interested in luxury fashion resale',
  businessStage: 'growth',
  primaryGoal: 'reposition',
  website: 'https://flyberry.in',
  additionalContext: 'Flyberry is a curated marketplace for pre-loved luxury fashion and lifestyle products, focusing on sustainability and accessibility to luxury.',
};

const brandType = BrandClassifier.classify(brandProfile);

console.log(`✅ Auto-detected brand type: ${brandType}\n`);

const completeBrandProfile: BrandProfile = {
  ...brandProfile,
  brandType,
} as BrandProfile;

// Create output directory
const brandSlug = 'flyberry';
const baseDir = join(process.cwd(), 'outputs', brandSlug);
await mkdir(baseDir, { recursive: true });

// Save brand profile
await writeFile(
  join(baseDir, '00-brand-profile.json'),
  JSON.stringify(completeBrandProfile, null, 2)
);

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  PHASE 1: MARKET RESEARCH                                      ║
╚════════════════════════════════════════════════════════════════╝

Please analyze the market for Flyberry and provide research in this format:
`);

const researchPrompt = `
# Market Research for Flyberry

**Brand Context:**
- Name: ${completeBrandProfile.brandName}
- Industry: ${completeBrandProfile.industry}
- Target Audience: ${completeBrandProfile.targetAudience}
- Business Stage: ${completeBrandProfile.businessStage}
- Primary Goal: ${completeBrandProfile.primaryGoal}
- Website: ${completeBrandProfile.website}

## Task 1: Industry Trends

Identify 5-7 key trends in the luxury resale/pre-loved fashion industry that are relevant to Flyberry. Consider:
- Sustainability and circular fashion movement
- Luxury resale market growth
- Consumer behavior shifts
- Technology and authentication innovations
- Indian market specific trends

## Task 2: Competitive Landscape

Analyze 4-5 main competitors in the luxury resale space. For each competitor provide:

**Competitor Name:**
- **Positioning:** How they position themselves in the market
- **Strengths:** 2-3 key strengths
- **Weaknesses:** 2-3 key weaknesses
- **Differentiation Opportunity:** How Flyberry can differentiate from them

Consider both global players (TheRealReal, Vestiaire Collective, Rebag) and Indian/regional competitors.

## Task 3: Market Opportunities

Identify 4-6 white space opportunities in the market that Flyberry could exploit.

## Task 4: Customer Personas

Create 3-4 detailed customer personas. For each persona:

**Persona Name:** (e.g., "Sustainable Luxury Seeker")
- **Demographics:** Age, income, location, occupation
- **Psychographics:** Values, interests, lifestyle, attitudes
- **Goals:** What they want to achieve
- **Challenges:** What holds them back or frustrates them
- **Buying Behavior:** How they make purchase decisions
- **Pain Points:** Specific problems they face
- **Desires:** What they aspire to

## Task 5: Brand DNA

Based on the brand context and market research:

1. **Unique Value Proposition:** Craft a clear UVP for Flyberry (what makes it different and valuable)
2. **Brand Story:** Develop a compelling brand narrative (origin, purpose, journey)
3. **Core Strengths:** Identify 5-7 things Flyberry does exceptionally well or could do exceptionally well

---

**Output Format:** Please provide detailed responses for all 5 tasks above. Be specific, insightful, and strategic.
`;

// Save the prompt
await writeFile(join(baseDir, '01-research-prompt.md'), researchPrompt);

console.log(`
📝 Research prompt saved to: outputs/flyberry/01-research-prompt.md

════════════════════════════════════════════════════════════════

👉 NEXT STEP: Please answer the research prompt above.

Once you provide the research, I'll:
1. Save it to outputs/flyberry/02-research-report.md
2. Generate the audit prompt
3. Continue through strategy development
4. Create the complete brand book

════════════════════════════════════════════════════════════════
`);

console.log(researchPrompt);
