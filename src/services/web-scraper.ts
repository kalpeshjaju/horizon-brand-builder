// Web Scraper Service - REAL website scraping using Playwright
// Fetches actual website content, not LLM knowledge

import { chromium, type Browser, type Page } from 'playwright';

export interface ScrapedWebsiteData {
  url: string;
  title: string;
  description?: string;
  htmlContent: string;
  textContent: string;
  metaTags: Record<string, string>;
  structuredData: any[];
  scrapedAt: string;
}

export interface ScrapedProduct {
  name: string;
  price?: number;
  currency?: string;
  size?: string;
  category?: string;
  inStock?: boolean;
  imageUrl?: string;
  url?: string;
}

export class WebScraper {
  private browser: Browser | null = null;

  /**
   * Initialize browser (reusable for multiple scrapes)
   */
  async init(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
  }

  /**
   * Close browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Fetch complete website data
   */
  async fetchWebsite(url: string): Promise<ScrapedWebsiteData> {
    await this.init();

    const page = await this.browser!.newPage();

    try {
      console.log(`   🌐 Fetching ${url}...`);

      // Navigate to URL
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Extract basic page data
      const title = await page.title();
      const htmlContent = await page.content();

      // Extract meta tags
      const metaTags: Record<string, string> = {};
      const metaElements = await page.$$('meta');
      for (const meta of metaElements) {
        const name = await meta.getAttribute('name') || await meta.getAttribute('property');
        const content = await meta.getAttribute('content');
        if (name && content) {
          metaTags[name] = content;
        }
      }

      const description = metaTags['description'] || metaTags['og:description'];

      // Extract text content (runs in browser context, not Node.js)
      // @ts-ignore - document exists in browser context
      const textContent = await page.evaluate(() => document.body.innerText);

      // Extract JSON-LD structured data
      const structuredData = await page.$$eval(
        'script[type="application/ld+json"]',
        (scripts) => scripts.map(s => {
          try {
            return JSON.parse(s.textContent || '{}');
          } catch {
            return null;
          }
        }).filter(Boolean)
      );

      await page.close();

      console.log(`   ✅ Successfully scraped ${url}`);

      return {
        url,
        title,
        description,
        htmlContent,
        textContent,
        metaTags,
        structuredData,
        scrapedAt: new Date().toISOString(),
      };
    } catch (error) {
      await page.close();
      throw new Error(`Failed to scrape ${url}: ${(error as Error).message}`);
    }
  }

  /**
   * Extract products from e-commerce website
   * Uses common selectors - can be customized per site
   */
  async extractProducts(url: string): Promise<ScrapedProduct[]> {
    await this.init();

    const page = await this.browser!.newPage();
    const products: ScrapedProduct[] = [];

    try {
      console.log(`   🛒 Extracting products from ${url}...`);

      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Try multiple common e-commerce selectors
      const productSelectors = [
        '.product-item',
        '.product-card',
        '[data-product]',
        '.woocommerce-LoopProduct-link',
        '.product',
        'article.product',
      ];

      let productElements: any[] = [];
      for (const selector of productSelectors) {
        productElements = await page.$$(selector);
        if (productElements.length > 0) {
          console.log(`   ✅ Found ${productElements.length} products using selector: ${selector}`);
          break;
        }
      }

      // Extract product data
      for (const element of productElements) {
        try {
          const product: ScrapedProduct = {
            name: await this.extractText(element, [
              '.product-title',
              '.product-name',
              'h2',
              'h3',
              '.title',
            ]),
          };

          // Extract price
          const priceText = await this.extractText(element, [
            '.price',
            '.product-price',
            '[data-price]',
            '.amount',
            '.woocommerce-Price-amount',
          ]);

          if (priceText) {
            const priceMatch = priceText.match(/[\d,]+(?:\.\d{2})?/);
            if (priceMatch) {
              product.price = parseFloat(priceMatch[0].replace(/,/g, ''));

              // Detect currency
              if (priceText.includes('₹') || priceText.includes('INR')) {
                product.currency = 'INR';
              } else if (priceText.includes('$') || priceText.includes('USD')) {
                product.currency = 'USD';
              }
            }
          }

          // Extract size/weight
          product.size = await this.extractText(element, [
            '.product-size',
            '.weight',
            '.size',
          ]);

          // Extract category
          product.category = await this.extractText(element, [
            '.product-category',
            '.category',
          ]);

          // Check stock status
          const stockText = await this.extractText(element, [
            '.stock-status',
            '.availability',
          ]);
          product.inStock = !stockText || !stockText.toLowerCase().includes('out of stock');

          // Extract image
          const imgElement = await element.$('img');
          if (imgElement) {
            product.imageUrl = await imgElement.getAttribute('src');
          }

          // Extract product URL
          const linkElement = await element.$('a');
          if (linkElement) {
            product.url = await linkElement.getAttribute('href');
          }

          if (product.name) {
            products.push(product);
          }
        } catch (error) {
          // Skip products that fail to parse
          console.log(`   ⚠️  Skipped product: ${(error as Error).message}`);
        }
      }

      await page.close();

      console.log(`   ✅ Extracted ${products.length} products`);

      return products;
    } catch (error) {
      await page.close();
      throw new Error(`Failed to extract products from ${url}: ${(error as Error).message}`);
    }
  }

  /**
   * Helper: Extract text from element using multiple selectors
   */
  private async extractText(element: any, selectors: string[]): Promise<string> {
    for (const selector of selectors) {
      try {
        const el = await element.$(selector);
        if (el) {
          const text = await el.textContent();
          if (text && text.trim()) {
            return text.trim();
          }
        }
      } catch {
        // Try next selector
      }
    }
    return '';
  }

  /**
   * Extract company information from website
   */
  async extractCompanyInfo(url: string): Promise<{
    brandName?: string;
    tagline?: string;
    description?: string;
    founded?: number;
    headquarters?: string;
  }> {
    const data = await this.fetchWebsite(url);

    // Try to extract company info from structured data
    const organization = data.structuredData.find(
      (item: any) => item['@type'] === 'Organization'
    );

    return {
      brandName: organization?.name || data.metaTags['og:site_name'] || data.title,
      tagline: data.metaTags['og:description'] || data.description,
      description: data.description,
      founded: organization?.foundingDate ? new Date(organization.foundingDate).getFullYear() : undefined,
      headquarters: organization?.address?.addressLocality || undefined,
    };
  }
}
