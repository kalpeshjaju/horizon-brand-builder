// User Data Collection - Interactive CLI for real business data
// Version 2.0

import type {
  BusinessMetrics,
  CustomerDataInput,
  UserProvidedData,
  MarketStatistic,
} from '../types/research-types.js';

export class DataCollector {
  // In real implementation, would use readline or prompts library
  // For now, provide methods that can be called programmatically

  async collectBusinessMetrics(): Promise<BusinessMetrics> {
    console.log('\n💼 Collecting Business Metrics...\n');
    console.log('Please provide the following metrics (leave blank to skip):\n');

    // In interactive mode, would prompt user for each field
    // For now, return structure with example prompts

    const metrics: BusinessMetrics = {};

    // These would be interactive prompts:
    // - Annual revenue (₹)
    // - Total customers
    // - Average order value (₹)
    // - Conversion rate (%)
    // - Repeat purchase rate (%)
    // - Monthly marketing spend (₹)

    console.log('   [Prompts would appear here in interactive mode]\n');

    return metrics;
  }

  async collectCustomerData(): Promise<CustomerDataInput> {
    console.log('\n👥 Collecting Customer Data...\n');

    const customerData: CustomerDataInput = {};

    // Interactive prompts for:
    // - Total customers
    // - Age range (e.g., "25-40")
    // - Income level (e.g., "₹12-40 LPA")
    // - Primary locations
    // - Top 3-5 pain points
    // - Top 3-5 valued features

    console.log('   [Customer data prompts would appear here]\n');

    return customerData;
  }

  async collectCompetitorURLs(): Promise<string[]> {
    console.log('\n🔗 Collecting Competitor URLs...\n');
    console.log('Please provide competitor websites (one per line, press Enter twice when done):\n');

    // Interactive prompt for competitor URLs
    const urls: string[] = [];

    console.log('   [URL collection interface would appear here]\n');

    return urls;
  }

  async collectKnownMarketData(): Promise<MarketStatistic[]> {
    console.log('\n📊 Collecting Known Market Data...\n');
    console.log('Do you have any verified market statistics? (y/n)\n');

    // If yes, collect:
    // - Statistic description
    // - Value
    // - Source
    // - URL (optional)

    const stats: MarketStatistic[] = [];

    return stats;
  }

  async collectAllData(): Promise<UserProvidedData> {
    console.log('\n═══════════════════════════════════════════════════════════\n');
    console.log('📋 USER DATA COLLECTION - Version 2.0');
    console.log('\n═══════════════════════════════════════════════════════════\n');

    console.log('To generate the most accurate brand strategy, please provide:');
    console.log('1. Business metrics (revenue, customers, etc.)');
    console.log('2. Customer data (demographics, pain points)');
    console.log('3. Competitor URLs (for live website analysis)');
    console.log('4. Known market data (if you have verified statistics)\n');

    console.log('All fields are optional, but more data = better strategy!\n');

    const userData: UserProvidedData = {};

    // Collect each data type
    try {
      const collectMetrics = await this.prompt('Collect business metrics? (y/n)', 'y');
      if (collectMetrics.toLowerCase() === 'y') {
        userData.businessMetrics = await this.collectBusinessMetrics();
      }

      const collectCustomers = await this.prompt('Collect customer data? (y/n)', 'y');
      if (collectCustomers.toLowerCase() === 'y') {
        userData.customerData = await this.collectCustomerData();
      }

      const collectCompetitors = await this.prompt('Collect competitor URLs? (y/n)', 'y');
      if (collectCompetitors.toLowerCase() === 'y') {
        userData.competitorUrls = await this.collectCompetitorURLs();
      }

      const collectMarket = await this.prompt('Collect known market data? (y/n)', 'n');
      if (collectMarket.toLowerCase() === 'y') {
        userData.knownMarketData = await this.collectKnownMarketData();
      }
    } catch (error) {
      console.error('Error collecting data:', error);
    }

    console.log('\n✅ Data collection complete!\n');

    return userData;
  }

  private async prompt(question: string, defaultValue?: string): Promise<string> {
    // In real implementation, would use readline or prompts library
    // For now, return default value or empty string

    console.log(`${question} ${defaultValue ? `[${defaultValue}]` : ''}`);

    // Simulated: would wait for user input
    return defaultValue || '';
  }

  validateBusinessMetrics(metrics: BusinessMetrics): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate ranges and logical consistency
    if (metrics.revenue !== undefined && metrics.revenue < 0) {
      errors.push('Revenue cannot be negative');
    }

    if (metrics.customers !== undefined && metrics.customers < 0) {
      errors.push('Customer count cannot be negative');
    }

    if (metrics.conversionRate !== undefined) {
      if (metrics.conversionRate < 0 || metrics.conversionRate > 100) {
        errors.push('Conversion rate must be between 0 and 100%');
      }
    }

    if (metrics.repeatPurchaseRate !== undefined) {
      if (metrics.repeatPurchaseRate < 0 || metrics.repeatPurchaseRate > 100) {
        errors.push('Repeat purchase rate must be between 0 and 100%');
      }
    }

    // Logical consistency checks
    if (
      metrics.revenue !== undefined &&
      metrics.customers !== undefined &&
      metrics.averageOrderValue !== undefined
    ) {
      const expectedRevenue = metrics.customers * metrics.averageOrderValue;
      const variance = Math.abs(metrics.revenue - expectedRevenue) / metrics.revenue;

      if (variance > 0.5) {
        // More than 50% variance
        errors.push(
          'Revenue, customers, and AOV seem inconsistent. Please verify your numbers.'
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateCompetitorURLs(urls: string[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const url of urls) {
      try {
        new URL(url);
      } catch {
        errors.push(`Invalid URL format: ${url}`);
      }
    }

    if (urls.length > 10) {
      errors.push('Too many competitor URLs (max 10). Please prioritize your top competitors.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  formatUserData(data: UserProvidedData): string {
    const lines: string[] = [];

    lines.push('USER-PROVIDED DATA SUMMARY:');
    lines.push('═══════════════════════════════════════\n');

    if (data.businessMetrics && Object.keys(data.businessMetrics).length > 0) {
      lines.push('📊 Business Metrics:');
      for (const [key, value] of Object.entries(data.businessMetrics)) {
        if (value !== undefined) {
          lines.push(`   - ${this.formatFieldName(key)}: ${this.formatValue(key, value)}`);
        }
      }
      lines.push('');
    }

    if (data.customerData) {
      lines.push('👥 Customer Data:');
      if (data.customerData.totalCustomers) {
        lines.push(`   - Total Customers: ${data.customerData.totalCustomers.toLocaleString()}`);
      }
      if (data.customerData.demographics) {
        lines.push('   - Demographics:');
        lines.push(`     - Age: ${data.customerData.demographics.ageRange}`);
        lines.push(`     - Income: ${data.customerData.demographics.incomeLevel}`);
        lines.push(`     - Locations: ${data.customerData.demographics.location.join(', ')}`);
      }
      if (data.customerData.topPainPoints && data.customerData.topPainPoints.length > 0) {
        lines.push(`   - Top Pain Points: ${data.customerData.topPainPoints.join(', ')}`);
      }
      lines.push('');
    }

    if (data.competitorUrls && data.competitorUrls.length > 0) {
      lines.push('🔗 Competitor URLs:');
      data.competitorUrls.forEach(url => lines.push(`   - ${url}`));
      lines.push('');
    }

    if (data.knownMarketData && data.knownMarketData.length > 0) {
      lines.push('📈 Known Market Data:');
      data.knownMarketData.forEach(stat => {
        lines.push(`   - ${stat.statistic}: ${stat.value}`);
        if (stat.source.source) {
          lines.push(`     Source: ${stat.source.source}`);
        }
      });
    }

    return lines.join('\n');
  }

  private formatFieldName(key: string): string {
    // Convert camelCase to Title Case
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private formatValue(key: string, value: number): string {
    if (key.includes('rate') || key.includes('Rate')) {
      return `${value}%`;
    }
    if (key.includes('revenue') || key.includes('spend') || key.includes('value') || key.includes('Value')) {
      return `₹${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  }
}

// Factory function
export function createDataCollector(): DataCollector {
  return new DataCollector();
}
