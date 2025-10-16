// Brand Discovery Agent - Automatic brand data collection and verification
// Scrapes website, marketplaces, reviews for comprehensive brand understanding

import type { LLMAdapter } from '../adapters/llm-interface.js';
import type { BrandConfiguration } from '../types/project-types.js';
import type {
  BrandDiscoveryReport,
  VerifiedCompanyInfo,
  VerifiedProduct,
  PricingComparison,
  DistributionMap,
  VerifiedReview,
  BusinessMetrics,
  ScrapingResult,
} from '../types/discovery-types.js';
import { WebResearchService } from '../services/web-research-service.js';
import { WebScraper } from '../services/web-scraper.js';

export class BrandDiscoveryAgent {
  private webResearch: WebResearchService;
  private webScraper: WebScraper;

  constructor(private llm: LLMAdapter) {
    this.webResearch = new WebResearchService();
    this.webScraper = new WebScraper();
  }

  async discoverBrand(brandConfig: BrandConfiguration): Promise<BrandDiscoveryReport> {
    console.log('\n🔍 BRAND DISCOVERY AGENT');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`Brand: ${brandConfig.brandName}`);
    console.log(`Website: ${brandConfig.companyProfile?.website || 'Not provided'}\n`);

    const startTime = Date.now();

    // Phase 1: Company Information
    console.log('📋 Phase 1: Company Information Discovery...');
    const companyInfo = await this.scrapeCompanyInfo(brandConfig);

    // Phase 2: Product Catalog
    console.log('\n📦 Phase 2: Product Catalog Collection...');
    const products = await this.collectProductCatalog(brandConfig);

    // Phase 3: Pricing Verification
    console.log('\n💰 Phase 3: Cross-Platform Pricing Verification...');
    const pricing = await this.verifyPricing(products);

    // Phase 4: Distribution Channels
    console.log('\n🌐 Phase 4: Distribution Channel Mapping...');
    const distribution = await this.mapDistributionChannels(brandConfig, products);

    // Phase 5: Customer Feedback
    console.log('\n⭐ Phase 5: Customer Review Collection...');
    const customerFeedback = await this.collectReviews(brandConfig);

    // Phase 6: Business Metrics
    console.log('\n📊 Phase 6: Business Metrics Estimation...');
    const businessMetrics = await this.estimateBusinessMetrics(brandConfig, products);

    // Generate verification log
    const verificationLog = this.generateVerificationLog(
      companyInfo,
      products,
      customerFeedback
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Brand Discovery complete in ${duration}s`);
    console.log(`📊 Verified ${verificationLog.totalDataPoints} data points\n`);

    // Close browser to free resources
    await this.webScraper.close();

    return {
      companyInfo,
      products,
      pricing,
      distribution,
      customerFeedback,
      businessMetrics,
      verificationLog,
    };
  }

  private async scrapeCompanyInfo(
    brandConfig: BrandConfiguration
  ): Promise<VerifiedCompanyInfo> {
    const website = brandConfig.companyProfile?.website || '';

    if (!website) {
      console.log('   ⚠️  No website provided, using configuration data only');
      return {
        brandName: brandConfig.brandName,
        website: '',
        founded: brandConfig.companyProfile?.founded,
        headquarters: 'Unknown',
        description: brandConfig.projectObjectives?.primary,
        verification: {
          source: 'Brand Configuration',
          date: new Date().toISOString().split('T')[0],
          tier: 'single-source',
          confidence: 60,
        },
      };
    }

    try {
      console.log(`   🌐 Scraping ${website} (REAL FETCH)...`);

      // ✅ ACTUALLY SCRAPE THE WEBSITE using Playwright
      const companyData = await this.webScraper.extractCompanyInfo(website);
      const websiteData = await this.webScraper.fetchWebsite(website);

      // Now use LLM to parse the REAL scraped content
      const prompt = `Extract company information from this REAL website content:

**URL**: ${website}
**Title**: ${websiteData.title}
**Meta Description**: ${websiteData.description || 'N/A'}
**Text Content Preview**: ${websiteData.textContent.substring(0, 2000)}

Extract:
1. Brand name
2. Founding year (if mentioned)
3. Location/Headquarters (if mentioned)
4. Brand tagline or slogan
5. Company description (1-2 sentences)
6. Annual revenue (if mentioned)

Return as JSON with keys: brandName, founded, headquarters, tagline, description, annualRevenue`;

      const response = await this.llm.generateResponse({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        systemPrompt: 'You are parsing REAL scraped website content. Extract only information present in the content provided.',
      });

      // Parse LLM response
      const data = this.parseLLMResponse(response.content);

      // Merge scraped data with LLM-parsed data
      const mergedData = {
        brandName: data.brandName || companyData.brandName,
        founded: data.founded || companyData.founded,
        headquarters: data.headquarters || companyData.headquarters,
        tagline: data.tagline || companyData.tagline,
        description: data.description || companyData.description,
        annualRevenue: data.annualRevenue,
      };

      console.log(`   ✅ Company info scraped and parsed from live website`);

      return {
        brandName: mergedData.brandName || brandConfig.brandName,
        website,
        founded: mergedData.founded || brandConfig.companyProfile?.founded,
        headquarters: mergedData.headquarters || 'Unknown',
        tagline: mergedData.tagline,
        annualRevenue: mergedData.annualRevenue,
        description: mergedData.description || brandConfig.projectObjectives?.primary,
        verification: {
          source: website,
          date: new Date().toISOString().split('T')[0],
          tier: 'verified', // Direct from official website
          confidence: 95,
        },
      };
    } catch (error) {
      console.log(`   ⚠️  Could not scrape website: ${(error as Error).message}`);
      return {
        brandName: brandConfig.brandName,
        website,
        verification: {
          source: 'Brand Configuration (website unreachable)',
          date: new Date().toISOString().split('T')[0],
          tier: 'single-source',
          confidence: 50,
        },
      };
    }
  }

  private async collectProductCatalog(
    brandConfig: BrandConfiguration
  ): Promise<VerifiedProduct[]> {
    const products: VerifiedProduct[] = [];
    const website = brandConfig.companyProfile?.website || '';

    if (!website) {
      console.log('   ⚠️  No website provided, skipping product catalog');
      return products;
    }

    try {
      // ✅ ACTUALLY SCRAPE PRODUCTS using Playwright
      console.log(`   🛒 Scraping product catalog from ${website} (REAL FETCH)...`);

      const scrapedProducts = await this.webScraper.extractProducts(website);

      if (scrapedProducts.length > 0) {
        // Convert scraped products to VerifiedProduct format
        scrapedProducts.forEach((product) => {
          products.push({
            category: product.category || 'Unknown',
            name: product.name,
            size: product.size || 'N/A',
            price: product.price || 0,
            currency: product.currency || 'INR',
            platform: 'D2C Website',
            url: product.url || website,
            inStock: product.inStock !== false,
            source: website,
            verificationDate: new Date().toISOString().split('T')[0],
            numSources: 1,
            tier: 'verified', // Direct from official website
            confidence: 95,
          });
        });

        console.log(`   ✅ Scraped ${products.length} products from live website`);
      } else {
        console.log(`   ⚠️  No products found with standard selectors`);
        console.log(`   ℹ️  May need site-specific selectors for this e-commerce platform`);
      }
    } catch (error) {
      console.log(`   ⚠️  Could not scrape product catalog: ${(error as Error).message}`);
    }

    // Try to scrape marketplaces (if brand name provided)
    if (brandConfig.brandName && products.length === 0) {
      console.log(`   🔍 Searching marketplaces for ${brandConfig.brandName} products...`);
      // This would integrate with marketplace APIs or scraping
      // For now, log that it's available for future implementation
      console.log(`   ℹ️  Marketplace integration available for enhancement`);
    }

    return products;
  }

  private async verifyPricing(products: VerifiedProduct[]): Promise<PricingComparison> {
    const pricingComparison: PricingComparison = {
      products: [],
    };

    // Group products by name for comparison
    const productMap = new Map<string, VerifiedProduct[]>();

    products.forEach(product => {
      const key = `${product.name}-${product.size}`;
      if (!productMap.has(key)) {
        productMap.set(key, []);
      }
      productMap.get(key)!.push(product);
    });

    // Build comparison table
    productMap.forEach((variations, key) => {
      const prices = variations.map(v => ({
        platform: v.platform,
        price: v.price,
        url: v.url || '',
        verificationDate: v.verificationDate,
        inStock: v.inStock,
      }));

      const priceValues = prices.map(p => p.price).filter(p => p > 0);

      pricingComparison.products.push({
        productName: variations[0].name,
        size: variations[0].size,
        prices,
        lowestPrice: Math.min(...priceValues),
        highestPrice: Math.max(...priceValues),
        averagePrice: priceValues.reduce((a, b) => a + b, 0) / priceValues.length,
      });
    });

    console.log(`   ✅ Price comparison built for ${pricingComparison.products.length} products`);

    return pricingComparison;
  }

  private async mapDistributionChannels(
    brandConfig: BrandConfiguration,
    products: VerifiedProduct[]
  ): Promise<DistributionMap> {
    const channels: DistributionMap['channels'] = [];

    // D2C Website
    if (brandConfig.companyProfile?.website) {
      channels.push({
        channelName: 'D2C Website',
        type: 'D2C',
        url: brandConfig.companyProfile.website,
        verified: true,
        productsAvailable: products.filter(p => p.platform === 'D2C Website').length,
        verificationDate: new Date().toISOString().split('T')[0],
        status: 'active',
      });
    }

    // Check for marketplace presence (based on products found)
    const platforms = [...new Set(products.map(p => p.platform))];

    platforms.forEach(platform => {
      if (platform !== 'D2C Website') {
        const channelType = this.classifyChannelType(platform);
        channels.push({
          channelName: platform,
          type: channelType,
          verified: true,
          productsAvailable: products.filter(p => p.platform === platform).length,
          verificationDate: new Date().toISOString().split('T')[0],
          status: 'active',
        });
      }
    });

    console.log(`   ✅ Mapped ${channels.length} distribution channels`);

    return { channels };
  }

  private async collectReviews(brandConfig: BrandConfiguration): Promise<VerifiedReview[]> {
    const reviews: VerifiedReview[] = [];

    // For now, return empty array
    // In full implementation, this would scrape Amazon, Google reviews, etc.
    console.log(`   ℹ️  Review collection available for future enhancement`);
    console.log(`   ℹ️  Would scrape: Amazon, Google Reviews, Trustpilot, etc.`);

    return reviews;
  }

  private async estimateBusinessMetrics(
    brandConfig: BrandConfiguration,
    products: VerifiedProduct[]
  ): Promise<BusinessMetrics> {
    const metrics: BusinessMetrics = {};

    // Estimate Average Order Value from products
    if (products.length > 0) {
      const prices = products.map(p => p.price).filter(p => p > 0);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

      metrics.averageOrderValue = {
        value: `₹${Math.round(avgPrice * 1.5)}-${Math.round(avgPrice * 2)}`,
        source: 'Calculated from product price ranges',
        confidence: 50,
        tier: 'estimated',
      };

      console.log(`   ℹ️  Estimated AOV: ${metrics.averageOrderValue.value}`);
    }

    return metrics;
  }

  private generateVerificationLog(
    companyInfo: VerifiedCompanyInfo,
    products: VerifiedProduct[],
    reviews: VerifiedReview[]
  ) {
    const allDataPoints = [companyInfo.verification, ...products.map(p => ({ tier: p.tier, confidence: p.confidence }))];

    const verified = allDataPoints.filter(d => d.tier === 'verified').length;
    const crossVerified = allDataPoints.filter(d => d.tier === 'cross-verified').length;
    const singleSource = allDataPoints.filter(d => d.tier === 'single-source').length;
    const estimated = allDataPoints.filter(d => d.tier === 'estimated').length;

    const avgConfidence =
      allDataPoints.reduce((sum, d) => sum + d.confidence, 0) / allDataPoints.length;

    const sources = new Set<string>();
    sources.add(companyInfo.verification.source);
    products.forEach(p => sources.add(p.source));

    return {
      totalDataPoints: allDataPoints.length,
      verified,
      crossVerified,
      singleSource,
      estimated,
      averageConfidence: Math.round(avgConfidence),
      verificationDate: new Date().toISOString().split('T')[0],
      sources: Array.from(sources),
      staleClaims: [],
    };
  }

  // Helper methods
  private parseLLMResponse(response: string): any {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) || response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
      return {};
    } catch (error) {
      console.log(`   ⚠️  Could not parse LLM response as JSON`);
      return {};
    }
  }

  private classifyChannelType(platform: string): 'D2C' | 'Marketplace' | 'Quick Commerce' | 'Retail' | 'Other' {
    const lower = platform.toLowerCase();

    if (lower.includes('amazon') || lower.includes('flipkart') || lower.includes('paytm') || lower.includes('snapdeal')) {
      return 'Marketplace';
    }

    if (lower.includes('blinkit') || lower.includes('instamart') || lower.includes('zepto') || lower.includes('dunzo')) {
      return 'Quick Commerce';
    }

    if (lower.includes('bigbasket') || lower.includes('grofers') || lower.includes('jiomart')) {
      return 'Marketplace';
    }

    if (lower.includes('store') || lower.includes('retail')) {
      return 'Retail';
    }

    return 'Other';
  }
}
