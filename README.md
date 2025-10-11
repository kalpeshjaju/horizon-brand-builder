# Horizon Brand Builder Pro 🚀

> **The Universal AI-Powered Brand Building System for ANY Brand**

Transform any brand - whether B2C, B2B, Luxury, SaaS, E-commerce, or Enterprise - into a distinctive market leader through intelligent, research-driven strategies.

---

## ✨ What Is This?

**Horizon Brand Builder Pro** is a comprehensive TypeScript-based system that automates brand research, strategy development, and project management for brand transformation projects.

### Key Features

- **🌍 Truly Generic**: Works for ANY brand, any industry, any category
- **🔬 AI-Powered Research**: Automated web research with source quality assessment
- **📊 Intelligent Accuracy**: V2.0 fact-checking with confidence scoring
- **📈 Project Tracking**: Track 64 deliverables across 5 phases
- **🗄️ Research Database**: Store, search, and index all findings
- **📝 Report Generation**: Professional markdown and HTML reports
- **🔄 Multi-Brand Support**: Work on multiple brands simultaneously
- **⚡ 4 Execution Modes**: Fast, Professional, Research, PM Dashboard

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20.0.0
- **TypeScript** knowledge (optional, for customization)
- **API Keys** (optional, for real web search):
  - Anthropic API Key (Claude)
  - Google Custom Search API Key (optional)

### Installation

```bash
# Clone or navigate to the project
cd ~/Development/horizon-brand-builder

# Install dependencies
npm install

# Copy environment example
cp .env.example .env

# Add your API keys to .env
# ANTHROPIC_API_KEY=your_key_here
# GOOGLE_API_KEY=your_google_key (optional)
# GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id (optional)
```

### Your First Brand Project

**1. Create Your Brand Configuration**

```bash
# Copy an example config as a starting point
cp src/config/examples/saas-config.example.ts src/config/my-brand.config.ts
```

**2. Edit with Your Brand Details**

Open `src/config/my-brand.config.ts` and customize:

```typescript
export const MY_BRAND_CONFIG: BrandConfiguration = {
  brandName: 'Your Brand Name',
  industry: 'Your Industry',
  category: 'Your Specific Category',
  companyProfile: {
    founded: 2020,
    currentRevenue: '$5M',
    channels: ['Online', 'Retail', 'B2B'],
  },
  projectObjectives: {
    primary: 'Your main objective',
    goals: [
      'Goal 1: Increase brand awareness',
      'Goal 2: Build thought leadership',
      'Goal 3: Drive customer engagement',
    ],
  },
  competitors: [
    { name: 'Competitor 1', website: 'https://competitor1.com' },
    { name: 'Competitor 2', website: 'https://competitor2.com' },
  ],
};
```

**3. Initialize Project**

```bash
# Initialize project tracker
npm run tracker:init

# Initialize research database
npm run db:init
```

**4. Run a Mode**

```bash
# Quick overview (fast mode)
npm run fast -- --brand "Your Brand"

# Comprehensive research (professional mode)
npm run professional -- --brand "Your Brand"

# Deep research mode
npm run research -- --brand "Your Brand"

# Project manager dashboard
npm run pm:dashboard
```

---

## 📊 Project Structure

```
horizon-brand-builder/
├── src/
│   ├── agents/              # AI agents (researcher, strategist, auditor)
│   ├── services/            # Core services
│   │   ├── project-tracker.ts
│   │   ├── research-database/
│   │   ├── report-generator.ts
│   │   ├── llm-service.ts
│   │   └── web-research-service.ts
│   ├── config/
│   │   ├── examples/        # Example brand configurations
│   │   ├── research-topic-templates.ts
│   │   └── deliverables-framework.ts
│   ├── types/               # TypeScript types
│   └── modes/               # Execution modes
├── data/                    # Per-brand data storage
│   └── {brand-name}/
│       ├── project-status.json
│       └── research-db.json
├── output/                  # Generated reports and dashboards
│   └── {brand-name}/
│       ├── dashboard.md
│       └── report.md
├── tests/                   # Unit and integration tests
└── docs/                    # Documentation

```

---

## 🎯 Core Concepts

### 1. **Generic Brand Configuration**

Every brand is configured using a standard `BrandConfiguration` interface. This ensures the system works identically for all brands while customizing research topics and deliverables.

```typescript
interface BrandConfiguration {
  brandName: string;        // "Acme Corp"
  industry: string;         // "Technology"
  category: string;         // "Cloud Services"
  companyProfile?: { ... };
  projectObjectives: { ... };
  competitors?: Competitor[];
}
```

### 2. **Research Topic Placeholder System**

Research topics use placeholders that get automatically replaced:

- `{brandName}` → Your brand name
- `{industry}` → Your industry
- `{category}` → Your category
- `{channels}` → Your sales channels

**Example**:
- Template: `"{brandName} brand positioning in {industry}"`
- Result: `"Acme Corp brand positioning in Technology"`

### 3. **Multi-Brand Support**

Work on multiple brands simultaneously without conflicts:

```
data/acme-corp/project-status.json
data/startup-x/project-status.json
data/luxury-brand/project-status.json
```

Each brand has its own isolated data and output folders.

### 4. **77-Subtopic Research System**

The system researches 77 specific subtopics across 4 phases:

- **Phase 1**: Brand Strategy & Positioning (18 subtopics)
- **Phase 2**: Creative Execution & Development (22 subtopics)
- **Phase 3**: Implementation & Launch (20 subtopics)
- **Phase 4**: Optimization & Growth (17 subtopics)

### 5. **64-Deliverable Framework**

Track project progress across 64 deliverables in 5 phases:

- **Phase 1**: Discovery & Research (12 deliverables)
- **Phase 2**: Strategy & Positioning (14 deliverables)
- **Phase 3**: Creative Development (15 deliverables)
- **Phase 4**: Implementation (13 deliverables)
- **Phase 5**: Launch & Optimization (10 deliverables)

---

## 🛠️ Available Commands

### Project Tracker

```bash
npm run tracker:init         # Initialize project tracker
npm run tracker:status       # Show current status
npm run tracker:dashboard    # Generate dashboard
npm run tracker:export       # Export to CSV
npm run tracker:update       # Update deliverable status
```

### Research Database

```bash
npm run db:init             # Initialize research database
npm run db:stats            # Show database statistics
npm run db:search <query>   # Search findings by keyword
npm run db:topics           # List all research topics
npm run db:export           # Export all findings to JSON
```

### Execution Modes

```bash
npm run fast -- --brand "Brand Name"          # Fast mode (quick overview)
npm run professional -- --brand "Brand Name"  # Professional mode (comprehensive)
npm run research -- --brand "Brand Name"      # Research mode (deep analysis)
npm run pm:dashboard                          # PM Dashboard (project overview)
```

### Development

```bash
npm run dev                 # Development mode
npm run build               # Production build
npm test                    # Run tests
npm run type-check          # TypeScript type checking
npm run lint                # Lint code
```

---

## 📚 Example Use Cases

### B2B SaaS Startup

```typescript
{
  brandName: 'CloudSync Pro',
  industry: 'B2B SaaS',
  category: 'Cloud Infrastructure',
  projectObjectives: {
    primary: 'Establish thought leadership in cloud infrastructure',
    goals: ['Build developer community', 'Drive enterprise adoption']
  }
}
```

### D2C E-commerce Fashion

```typescript
{
  brandName: 'EcoStyle',
  industry: 'E-commerce',
  category: 'Sustainable Fashion',
  projectObjectives: {
    primary: 'Launch sustainable fashion brand for Gen-Z',
    goals: ['Build community', 'Drive sustainability narrative']
  }
}
```

### Premium Food & Beverage

```typescript
{
  brandName: 'Flyberry Gourmet',
  industry: 'Food & Beverage',
  category: 'Premium Dry Fruits',
  projectObjectives: {
    primary: 'Transform into premium lifestyle brand',
    goals: ['Build brand equity', 'Expand channels']
  }
}
```

---

## 🔧 Advanced Usage

### Customizing Research Topics

Add your own custom research topics:

```typescript
const myBrandConfig: BrandConfiguration = {
  // ... other config
  customResearchTopics: {
    phase1: ['Custom topic 1', 'Custom topic 2']
  }
};
```

### Customizing Deliverables

Add custom deliverables to any phase:

```typescript
const myBrandConfig: BrandConfiguration = {
  // ... other config
  customDeliverables: {
    phase1: ['Custom deliverable 1', 'Custom deliverable 2']
  }
};
```

### Using Services Programmatically

```typescript
import { ProjectTracker } from './services/project-tracker.js';
import { ResearchDatabase } from './services/research-database/index.js';
import { ReportGenerator } from './services/report-generator.js';

const tracker = new ProjectTracker(myBrandConfig);
await tracker.initialize();

const database = new ResearchDatabase(myBrandConfig);
await database.initialize();

const reportGen = new ReportGenerator(myBrandConfig);
```

---

## 📖 Documentation

- **[IMPLEMENTATION-COMPLETE.md](./IMPLEMENTATION-COMPLETE.md)** - Full implementation details
- **[QUICK-START.md](./QUICK-START.md)** - Quick reference guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[CLAUDE.md](./CLAUDE.md)** - Claude Code AI assistant guide

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/unit/services/project-tracker.test.ts

# Run tests with coverage
npm test -- --coverage
```

**Test Coverage**: 267 tests across 13 test files

---

## 🤝 Contributing

This is a production system for brand building projects. Contributions welcome for:

- Additional example brand configurations
- New research topic templates
- Enhanced report formats
- Bug fixes and improvements

---

## 📝 License

MIT License - See LICENSE file for details

---

## 💡 Tips

1. **Start with an example**: Copy one of the example configs in `src/config/examples/`
2. **Run fast mode first**: Get a quick overview before running professional mode
3. **Check the dashboard**: Run `npm run tracker:dashboard` regularly to track progress
4. **Search your research**: Use `npm run db:search` to find specific findings
5. **Export for sharing**: Use export commands to share reports with stakeholders

---

## 🆘 Getting Help

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Review example configs in `src/config/examples/`
- Run `npm run pm:dashboard` to see current project status

---

## 🎉 What Makes This Special?

1. **Truly Generic**: Not tied to any specific brand or industry
2. **Production-Ready**: TypeScript strict mode, comprehensive tests
3. **Intelligent**: V2.0 accuracy with source quality assessment
4. **Scalable**: Multi-brand support, modular architecture
5. **Complete**: From research to strategy to execution tracking
6. **Professional**: Generates client-ready reports and dashboards

---

**Ready to transform your brand? Let's get started! 🚀**

```bash
cd ~/Development/horizon-brand-builder
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run fast -- --brand "Your Brand"
```
