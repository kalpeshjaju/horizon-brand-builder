// Research Database Types

export interface ResearchInsight {
  id: string;
  brandName: string;
  phase: 1 | 2 | 3 | 4;
  topic: string;
  subtopic: string;
  insight: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED';
  sources: SourceReference[];
  timestamp: string;
  metadata: InsightMetadata;
}

export interface SourceReference {
  url: string;
  title: string;
  qualityScore?: number;
  tier?: 'tier1' | 'tier2' | 'tier3' | 'tier4';
  recency?: 'recent' | 'dated' | 'outdated';
}

export interface InsightMetadata {
  competitorName?: string;
  category?: string;
  tags?: string[];
  relatedInsights?: string[];
}

export interface SearchQuery {
  term: string;
  filters?: {
    brandName?: string;
    phase?: number;
    topic?: string;
    confidence?: string;
    competitorName?: string;
  };
}

export interface SearchResult {
  insights: ResearchInsight[];
  total: number;
  filtered: number;
}

export interface DatabaseStats {
  totalInsights: number;
  byPhase: Record<string, number>;
  byTopic: Record<string, number>;
  byConfidence: Record<string, number>;
  byBrand: Record<string, number>;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'markdown';
  filters?: SearchQuery['filters'];
  includeMetadata?: boolean;
}

export interface DatabaseConfig {
  storagePath: string;
  autoSave: boolean;
  enableIndexing: boolean;
}
