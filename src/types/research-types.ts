// Enhanced research types with source attribution and confidence scoring
// Version 2.0 - Web Research Integration

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unverified';

export interface SourcedClaim {
  claim: string;
  source?: string;
  sourceUrl?: string;
  confidence: ConfidenceLevel;
  dateAccessed?: string;
  verificationNotes?: string;
}

export interface IndustryTrendWithSource {
  trend: string;
  description: string;
  evidence: string[];
  sources: SourcedClaim[];
  confidence: ConfidenceLevel;
}

export interface CompetitorWebData {
  url: string;
  scrapedAt: string;
  positioning: string;
  products: string[];
  keyFeatures: string[];
  pricingInfo?: string;
  metadata: {
    title: string;
    description: string;
    [key: string]: any;
  };
}

export interface CompetitorAnalysisV2 {
  name: string;
  website: string;
  positioning: SourcedClaim;
  strengths: SourcedClaim[];
  weaknesses: SourcedClaim[];
  webData?: CompetitorWebData;
  differentiationOpportunity: string;
  lastUpdated: string;
}

export interface MarketStatistic {
  statistic: string;
  value: string | number;
  source: SourcedClaim;
  context: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface IndustryResearchData {
  industry: string;
  marketSize?: MarketStatistic;
  growthRate?: MarketStatistic;
  trends: IndustryTrendWithSource[];
  keyPlayers: string[];
  sources: string[];
  researchDate: string;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  relevanceScore: number;
}

export interface FactCheckResult {
  claim: string;
  isVerified: boolean;
  confidence: ConfidenceLevel;
  sources: SourcedClaim[];
  contradictions?: string[];
  recommendedAction: 'accept' | 'verify' | 'reject' | 'needs_review';
  notes: string;
}

export interface BusinessMetrics {
  revenue?: number;
  customers?: number;
  averageOrderValue?: number;
  conversionRate?: number;
  repeatPurchaseRate?: number;
  marketingSpend?: number;
  [key: string]: number | undefined;
}

export interface CustomerDataInput {
  totalCustomers?: number;
  demographics?: {
    ageRange: string;
    incomeLevel: string;
    location: string[];
  };
  topPainPoints?: string[];
  topFeatures?: string[];
  surveyData?: any;
}

export interface UserProvidedData {
  businessMetrics?: BusinessMetrics;
  customerData?: CustomerDataInput;
  competitorUrls?: string[];
  knownMarketData?: MarketStatistic[];
}

export interface EnhancedResearchReport {
  marketInsights: {
    industryData: IndustryResearchData;
    competitorLandscape: CompetitorAnalysisV2[];
    marketOpportunities: SourcedClaim[];
    keyFindings: SourcedClaim[];
  };
  audienceProfile: {
    personas: any[]; // Keep existing persona structure
    painPoints: SourcedClaim[];
    desires: SourcedClaim[];
    decisionFactors: SourcedClaim[];
  };
  brandDNA: {
    uniqueValueProposition: string;
    brandStory: string;
    coreStrengths: string[];
    brandHeritage?: string;
    founderStory?: string;
  };
  metadata: {
    researchDate: string;
    webResearchUsed: boolean;
    userDataProvided: boolean;
    overallConfidence: ConfidenceLevel;
    sources: string[];
  };
  synthesisNotes: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  confidence: ConfidenceLevel;
}

// Research Finding - for research database
export interface ResearchSource {
  title: string;
  url: string;
  tier?: number; // Source quality tier (1-4)
}

export interface ResearchFinding {
  topic: string;
  content: string;
  sources: ResearchSource[];
  confidence?: number; // 0-10 scale
  timestamp?: string;
}
