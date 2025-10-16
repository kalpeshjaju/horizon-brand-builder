// Brand Discovery Types - For automatic brand data collection and verification

export interface BrandDiscoveryReport {
  companyInfo: VerifiedCompanyInfo;
  products: VerifiedProduct[];
  pricing: PricingComparison;
  distribution: DistributionMap;
  customerFeedback: VerifiedReview[];
  businessMetrics: BusinessMetrics;
  verificationLog: VerificationLog;
}

export interface VerifiedCompanyInfo {
  brandName: string;
  website: string;
  founded?: number;
  headquarters?: string;
  tagline?: string;
  annualRevenue?: string;
  description?: string;
  verification: {
    source: string;
    date: string;
    tier: 'verified' | 'cross-verified' | 'single-source' | 'estimated';
    confidence: number;
  };
}

export interface VerifiedProduct {
  category: string;
  name: string;
  size: string;
  price: number;
  currency: string;
  platform: string;
  url?: string;
  inStock: boolean;
  source: string;
  verificationDate: string;
  numSources: number;
  tier: 'verified' | 'cross-verified' | 'single-source' | 'estimated';
  confidence: number;
}

export interface PricingComparison {
  products: Array<{
    productName: string;
    size: string;
    prices: Array<{
      platform: string;
      price: number;
      url: string;
      verificationDate: string;
      inStock: boolean;
    }>;
    lowestPrice: number;
    highestPrice: number;
    averagePrice: number;
  }>;
}

export interface DistributionMap {
  channels: Array<{
    channelName: string;
    type: 'D2C' | 'Marketplace' | 'Quick Commerce' | 'Retail' | 'Other';
    url?: string;
    verified: boolean;
    productsAvailable: number;
    verificationDate: string;
    status: 'active' | 'inactive' | 'unknown';
  }>;
}

export interface VerifiedReview {
  platform: string;
  rating?: number;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  date?: string;
  verified: boolean;
  productName?: string;
  reviewerName?: string;
  source: string;
}

export interface BusinessMetrics {
  estimatedRevenue?: {
    value: string;
    source: string;
    confidence: number;
    tier: 'verified' | 'cross-verified' | 'single-source' | 'estimated';
  };
  averageOrderValue?: {
    value: string;
    source: string;
    confidence: number;
    tier: 'estimated';
  };
  customerLifetimeValue?: {
    value: string;
    source: string;
    confidence: number;
    tier: 'estimated';
  };
  marketingMetrics?: {
    socialFollowers?: Record<string, number>;
    websiteTraffic?: string;
    source: string;
  };
}

export interface VerificationLog {
  totalDataPoints: number;
  verified: number;
  crossVerified: number;
  singleSource: number;
  estimated: number;
  averageConfidence: number;
  verificationDate: string;
  sources: string[];
  staleClaims: Array<{ claim: string; age: number }>;
}

export interface ScrapingResult {
  success: boolean;
  data?: any;
  error?: string;
  source: string;
  timestamp: string;
}
