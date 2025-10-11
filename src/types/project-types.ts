// Generic project and brand configuration types for Horizon Brand Builder Pro

export interface CompanyProfile {
  founded: number;
  currentRevenue?: string;
  channels: string[];
  stores?: number;
  website?: string;
  employees?: number;
  headquarters?: string;
}

export interface ProjectObjectives {
  primary: string;
  goals: string[];
  successMetrics?: string[];
}

export interface Competitor {
  name: string;
  category: 'premium' | 'mass-market' | 'd2c' | 'international' | 'enterprise' | 'mid-market';
  positioning: string;
  website?: string;
  strengths?: string[];
  weaknesses?: string[];
}

export interface BrandConfiguration {
  // Basic info (required)
  brandName: string;
  industry: string;
  category: string;

  // Company details (optional)
  companyProfile?: CompanyProfile;

  // Project details (required)
  projectObjectives: ProjectObjectives;

  // Research customization (optional)
  competitors?: Competitor[];
  targetAudience?: string[];
  marketSegments?: string[];

  // Deliverables customization (optional)
  customDeliverables?: Record<string, string[]>;

  // Research topics customization (optional)
  customResearchTopics?: any;

  // Additional context
  additionalContext?: string;
}

export interface Deliverable {
  name: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  assignee?: string;
  dueDate?: string;
  completedDate?: string;
  notes: string[];
  dependencies: string[];
  progress?: number;
}

export interface Phase {
  number: number;
  name: string;
  duration: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startDate: string | null;
  endDate: string | null;
  deliverables: Deliverable[];
  milestones: string[];
  risks: string[];
  progress: number;
}

export interface ProjectStatus {
  project: {
    name: string;
    brandName: string;
    startDate: string;
    totalDuration: string;
    currentPhase: string;
    overallStatus: 'not-started' | 'in-progress' | 'completed';
  };
  phases: Record<string, Phase>;
  metrics: {
    timeline: {
      plannedStartDate: string;
      actualStartDate: string;
      plannedEndDate: string | null;
      actualEndDate: string | null;
      daysElapsed: number;
    };
    deliverables: {
      total: number;
      completed: number;
      inProgress: number;
      notStarted: number;
      completionRate: number;
    };
    phases: {
      total: number;
      completed: number;
      inProgress: number;
      notStarted: number;
    };
  };
  lastUpdated: string;
}

export interface ProjectTimeline {
  totalDuration: string;
  phases: Array<{
    phase: number;
    name: string;
    duration: string;
  }>;
}
