// Data Quality & Verification Standards for Brand Builder

export interface DataQualityTier {
  name: string;
  symbol: string;
  confidence: { min: number; max: number };
  requirements: string[];
  maxAge: number; // days
}

export interface VerifiedDataPoint {
  claim: string;
  value: any;
  source: string;
  sourceUrl?: string;
  verificationDate: string;
  tier: 'verified' | 'cross-verified' | 'single-source' | 'estimated';
  confidence: number;
  notes?: string;
}

export const DATA_QUALITY_TIERS: Record<string, DataQualityTier> = {
  VERIFIED: {
    name: 'Verified',
    symbol: '✅',
    confidence: { min: 95, max: 100 },
    requirements: [
      'Direct from official source (brand website, official statements)',
      'Data < 30 days old',
      'Direct observation or primary documentation',
    ],
    maxAge: 30,
  },
  CROSS_VERIFIED: {
    name: 'Cross-Verified',
    symbol: '✓',
    confidence: { min: 80, max: 94 },
    requirements: [
      '2+ independent sources agree',
      'Data < 90 days old',
      'Cross-reference validation completed',
    ],
    maxAge: 90,
  },
  SINGLE_SOURCE: {
    name: 'Single Source',
    symbol: '⚠️',
    confidence: { min: 60, max: 79 },
    requirements: [
      'Single credible source',
      'Data < 180 days old',
      'Not independently verified',
    ],
    maxAge: 180,
  },
  ESTIMATED: {
    name: 'Estimated',
    symbol: 'ⓘ',
    confidence: { min: 40, max: 59 },
    requirements: [
      'Derived from industry benchmarks or calculations',
      'Clearly marked as estimate',
      'Methodology documented',
    ],
    maxAge: 365,
  },
};

export const CITATION_REQUIREMENTS = {
  pricing: {
    requiresSource: true,
    requiresDate: true,
    requiresPlatform: true,
    minTier: 'CROSS_VERIFIED',
  },
  financials: {
    requiresSource: true,
    requiresDate: true,
    requiresPlatform: false,
    minTier: 'CROSS_VERIFIED',
  },
  customerFeedback: {
    requiresSource: true,
    requiresDate: true,
    requiresPlatform: true,
    minTier: 'VERIFIED', // Must be actual quotes with attribution
  },
  companyInfo: {
    requiresSource: true,
    requiresDate: true,
    requiresPlatform: false,
    minTier: 'CROSS_VERIFIED',
  },
  estimates: {
    requiresSource: true, // Must cite methodology
    requiresDate: true,
    requiresPlatform: false,
    minTier: 'ESTIMATED',
    requiresDisclaimer: true,
  },
};

export interface DataVerificationReport {
  totalClaims: number;
  verified: number;
  crossVerified: number;
  singleSource: number;
  estimated: number;
  unverified: number;
  averageConfidence: number;
  staleClaims: Array<{ claim: string; age: number }>;
  missingSources: Array<{ claim: string; section: string }>;
}

export function calculateDataAge(verificationDate: string): number {
  const now = new Date();
  const verified = new Date(verificationDate);
  const diffTime = Math.abs(now.getTime() - verified.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDataQualityTier(
  confidence: number,
  source: string,
  dataAge: number
): DataQualityTier | null {
  for (const [key, tier] of Object.entries(DATA_QUALITY_TIERS)) {
    if (
      confidence >= tier.confidence.min &&
      confidence <= tier.confidence.max &&
      dataAge <= tier.maxAge
    ) {
      return tier;
    }
  }
  return null;
}

export function formatCitation(data: VerifiedDataPoint): string {
  const tier = DATA_QUALITY_TIERS[data.tier.toUpperCase().replace('-', '_')];
  const symbol = tier?.symbol || '•';

  return `${symbol} [Source: ${data.source}, ${data.verificationDate}, Confidence: ${data.confidence}%]`;
}

export function generateVerificationReport(
  dataPoints: VerifiedDataPoint[]
): DataVerificationReport {
  const report: DataVerificationReport = {
    totalClaims: dataPoints.length,
    verified: 0,
    crossVerified: 0,
    singleSource: 0,
    estimated: 0,
    unverified: 0,
    averageConfidence: 0,
    staleClaims: [],
    missingSources: [],
  };

  let totalConfidence = 0;

  dataPoints.forEach(point => {
    totalConfidence += point.confidence;

    const age = calculateDataAge(point.verificationDate);

    // Count by tier
    switch (point.tier) {
      case 'verified':
        report.verified++;
        break;
      case 'cross-verified':
        report.crossVerified++;
        break;
      case 'single-source':
        report.singleSource++;
        break;
      case 'estimated':
        report.estimated++;
        break;
    }

    // Check for stale data
    const tierDef = DATA_QUALITY_TIERS[point.tier.toUpperCase().replace('-', '_')];
    if (tierDef && age > tierDef.maxAge) {
      report.staleClaims.push({ claim: point.claim, age });
    }

    // Check for missing sources
    if (!point.source || point.source.trim() === '') {
      report.missingSources.push({ claim: point.claim, section: 'unknown' });
    }
  });

  report.averageConfidence = totalConfidence / dataPoints.length;

  return report;
}

// Example usage in report generation:
export function formatDataWithCitation(
  value: any,
  source: string,
  date: string,
  confidence: number,
  tier: 'verified' | 'cross-verified' | 'single-source' | 'estimated'
): string {
  const tierInfo = DATA_QUALITY_TIERS[tier.toUpperCase().replace('-', '_')];
  return `${value} ${tierInfo.symbol} *[${source}, ${date}, ${confidence}% confidence]*`;
}

// Table formatting helper
export interface DataTable {
  headers: string[];
  rows: Array<Record<string, any>>;
  citations?: Record<string, VerifiedDataPoint>;
}

export function formatAsMarkdownTable(table: DataTable): string {
  let markdown = '| ' + table.headers.join(' | ') + ' |\n';
  markdown += '|' + table.headers.map(() => ' --- ').join('|') + '|\n';

  table.rows.forEach(row => {
    const rowValues = table.headers.map(header => row[header] || '-');
    markdown += '| ' + rowValues.join(' | ') + ' |\n';
  });

  return markdown;
}
