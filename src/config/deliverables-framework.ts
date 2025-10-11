// Generic 64-deliverable framework for ANY brand
// Placeholder: {brandName}

import type { BrandConfiguration, ProjectTimeline } from '../types/project-types.js';

export const GENERIC_DELIVERABLES: Record<string, string[]> = {
  phase1: [
    '{brandName} Brand Audit Report',
    'Competitive Landscape Analysis',
    'Target Audience Research',
    'Market Trends Analysis',
    'Brand Positioning Strategy',
    'Brand Architecture Framework',
    'Value Proposition Development',
    'Competitor Benchmarking',
    'Category Trends Report',
    'Pricing Strategy Analysis',
    'Channel Strategy Report',
    'Brand Gap Analysis',
  ],
  phase2: [
    'Visual Identity System',
    'Brand Naming Guidelines',
    'Logo Design Concepts',
    'Color Palette Strategy',
    'Typography System',
    'Iconography & Graphic Elements',
    'Photography Style Guide',
    'Illustration Guidelines',
    'Packaging Design System',
    'Brand Voice & Tone Guidelines',
    'Messaging Framework',
    'Tagline Development',
    'Brand Story Narrative',
  ],
  phase3: [
    'Customer Journey Map',
    'Touchpoint Audit',
    'Digital Shelf Strategy',
    'E-commerce Experience Guidelines',
    'Retail Experience Blueprint',
    'Quick Commerce Optimization',
    'Social Media Strategy',
    'Content Strategy Framework',
    'Community Building Plan',
    'Influencer Strategy',
    'Partnership Guidelines',
    'Brand Activation Plan',
  ],
  phase4: [
    'Launch Communication Strategy',
    'Channel Activation Plan',
    'Sales Enablement Materials',
    'Trade Marketing Guidelines',
    'Performance Marketing Strategy',
    'CRM & Retention Strategy',
    'Gifting Strategy',
    'B2B Communication Framework',
    'Internal Brand Launch Plan',
    'Brand Training Materials',
    'Brand Governance Guidelines',
  ],
  phase5: [
    'Complete Brand Guidelines Document',
    'Digital Asset Library',
    'Vendor Onboarding Guide',
    'Brand Compliance Checklist',
    'Launch Roadmap',
    'Success Metrics Dashboard',
    'Post-Launch Monitoring Framework',
    'Brand Evolution Roadmap',
    'Future Innovation Pipeline',
  ],
};

export const GENERIC_PROJECT_TIMELINE: ProjectTimeline = {
  totalDuration: '16 weeks',
  phases: [
    { phase: 1, name: 'Brand Strategy & Positioning', duration: '3 weeks' },
    { phase: 2, name: 'Brand Expression & Identity', duration: '4 weeks' },
    { phase: 3, name: 'Experience & Digital Strategy', duration: '4 weeks' },
    { phase: 4, name: 'Activation & Growth', duration: '3 weeks' },
    { phase: 5, name: 'Delivery & Implementation', duration: '2 weeks' },
  ],
};

/**
 * Customizes deliverables by replacing {brandName} placeholder
 */
export function customizeDeliverables(
  brandConfig: BrandConfiguration
): Record<string, string[]> {
  const customized: Record<string, string[]> = {};

  // Replace {brandName} in all deliverables
  Object.entries(GENERIC_DELIVERABLES).forEach(([phase, items]) => {
    customized[phase] = items.map((item) =>
      item.replace(/\{brandName\}/g, brandConfig.brandName)
    );
  });

  // Merge with custom deliverables if provided
  if (brandConfig.customDeliverables) {
    Object.entries(brandConfig.customDeliverables).forEach(([phase, items]) => {
      if (customized[phase]) {
        customized[phase] = [...customized[phase], ...items];
      } else {
        customized[phase] = items;
      }
    });
  }

  return customized;
}
