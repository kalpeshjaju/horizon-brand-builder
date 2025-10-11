# Web Search Setup Guide

**Purpose**: Enable real web research for comprehensive brand analysis

**Status**: Optional (system works with AI-generated insights without it)

---

## 🎯 What Web Search Adds

### Without Web Search (Current State)
✅ AI-generated brand strategy based on Claude's training data
✅ Professional consulting-grade insights
✅ Comprehensive brand book, positioning, messaging
✅ Placeholder research reports with framework

### With Web Search (Enhanced)
🔍 **Real-time market data** from live web sources
🔍 **Current competitor information** (pricing, products, campaigns)
🔍 **Latest industry trends** and news
🔍 **Factual verification** with source attribution
🔍 **Source quality assessment** (Tier 1-4)
🔍 **Confidence scoring** on all findings

---

## 🚀 Quick Decision

### Option 1: Continue Without Web Search ✅ **RECOMMENDED**
**Use this if**:
- You want to move fast (already have professional strategy)
- Budget is limited (Google Custom Search costs money)
- You'll do manual research separately

**What you have**:
- Complete brand book (458 lines)
- Market insights and competitive analysis
- Strategic positioning and messaging
- All based on Claude's extensive training data

**Cost**: $0

### Option 2: Enable Web Search
**Use this if**:
- You need real-time market data
- You want automated fact-checking
- You want source attribution for findings
- You need current competitor pricing/products

**Cost**: ~$5/1000 queries (Google Custom Search API)

---

## 📋 Setup Instructions (Option 2)

### Step 1: Get Google Custom Search API Credentials

#### 1.1 Create API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Custom Search API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Custom Search API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key (starts with `AIza...`)

#### 1.2 Create Custom Search Engine

1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click "Add" to create new search engine
3. Configure:
   - **Sites to search**: `www.google.com` (search entire web)
   - **Name**: "Horizon Brand Builder Research"
   - **Search the entire web**: Enable this option
4. Click "Create"
5. Copy the **Search Engine ID** (cx parameter)

### Step 2: Add to Environment Variables

Edit `.env` file in the project root:

```bash
# Existing (already configured)
ANTHROPIC_API_KEY=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

# Add these two lines (replace with your actual values)
GOOGLE_API_KEY=AIza...your-google-api-key-here
GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id-here
```

### Step 3: Test Web Search

```bash
# Run research mode again
npm run research -- --brand "Flyberry Gourmet"

# You should see:
# ✅ Google Custom Search API configured
# 🔍 Searching web for real-time data...
```

---

## 💰 Pricing

### Google Custom Search API

**Free Tier**:
- 100 queries per day (FREE)
- Perfect for testing and small projects

**Paid Tier**:
- $5 per 1,000 queries
- Up to 10,000 queries per day

### Typical Usage for Flyberry Project

**Professional Mode** (already run):
- Uses AI only (no web search)
- Cost: $0 (uses Anthropic API only)

**Research Mode** (77 subtopics):
- Without web search: $0
- With web search: ~770 queries (77 subtopics × 10 searches each)
- Cost: ~$3.85 one-time

**Recommendation**: Free tier (100/day) is sufficient if you spread research over 8 days

---

## 🎯 Recommended Approach

### For Flyberry Project Right Now

**Option 1: Use What You Have** ✅ **BEST FOR NOW**

You already have:
- ✅ Complete brand book (458 lines)
- ✅ Market insights from professional mode
- ✅ Competitive analysis (5 competitors)
- ✅ Strategic positioning and messaging
- ✅ Brand audit and strategy documents

**Next steps**:
1. Review the generated brand strategy
2. Use it for stakeholder discussions
3. Implement Phase 2: Brand Identity
4. Add web search later if needed for validation

**Option 2: Enable Web Search for Validation**

If you want real-time data to validate the strategy:
1. Set up Google Custom Search API (10 minutes)
2. Re-run research mode with web search enabled
3. Compare AI insights vs real-time data
4. Use for fact-checking and source attribution

---

## 🔍 What Web Search Actually Does

### Research Process Without Web Search
```
1. Claude analyzes brand configuration
2. Generates insights from training data
3. Creates strategic recommendations
4. Produces professional-grade deliverables
```

**Output**: High-quality strategy based on Claude's knowledge (trained on vast internet data up to 2024)

### Research Process With Web Search
```
1. Claude analyzes brand configuration
2. Searches web for current data (Google)
3. Fact-checks findings across sources
4. Assesses source quality (Tier 1-4)
5. Scores confidence (HIGH/MEDIUM/LOW)
6. Generates insights with attribution
7. Creates professional-grade deliverables
```

**Output**: Strategy + Real-time market data + Source attribution

---

## 📊 Comparison

| Feature | Without Web Search | With Web Search |
|---------|-------------------|-----------------|
| **Brand Strategy** | ✅ Complete | ✅ Complete |
| **Market Insights** | ✅ AI-generated | ✅ Real-time data |
| **Competitor Analysis** | ✅ Based on training | ✅ Current pricing/products |
| **Source Attribution** | ❌ No sources | ✅ Tier 1-4 sources |
| **Fact-Checking** | ❌ Not verified | ✅ Cross-verified |
| **Speed** | ⚡ Fast | 🐢 Slower (API calls) |
| **Cost** | 💰 $0 | 💰 ~$5/1000 queries |
| **Setup Time** | ✅ 0 minutes | ⏱️ 10-15 minutes |

---

## ✅ Current Status for Flyberry

### What You Have Now (Without Web Search)

**Professional Mode Output** (1.4 minutes):
- ✅ 458-line brand book with complete strategy
- ✅ Market insights (12-15% CAGR, 73% sustainability preference)
- ✅ 5 competitors analyzed with strengths/weaknesses
- ✅ Clear positioning: "Accessible artisanal food brand"
- ✅ 5 differentiation points vs competitors
- ✅ Complete messaging framework
- ✅ Visual direction and brand personality

**Research Mode Output** (just run):
- ✅ 77-subtopic framework created
- ✅ 24 Phase 1 subtopics outlined
- ⚠️ Placeholder data (pending web search)

### Recommendation: **Use Professional Mode Output**

The professional mode already gave you comprehensive, actionable strategy. The research mode adds depth but isn't required to move forward.

**Use the brand book** (`outputs/flyberry-gourmet/brand-book.md`) as your strategic foundation.

---

## 🚀 Quick Commands

### Check What You Have
```bash
# View brand book (comprehensive strategy)
open outputs/flyberry-gourmet/brand-book.md

# View research report (current state)
open output/research/flyberry-gourmet/phase1-research-report.md
```

### Enable Web Search (If Needed)
```bash
# 1. Edit .env file
nano .env

# 2. Add:
# GOOGLE_API_KEY=your-key-here
# GOOGLE_SEARCH_ENGINE_ID=your-id-here

# 3. Re-run research
npm run research -- --brand "Flyberry Gourmet"
```

---

## 💡 Bottom Line

**For Flyberry Gourmet project**:

✅ **You already have everything you need** to move forward:
- Complete brand strategy
- Market positioning
- Competitive analysis
- Messaging framework
- Visual direction

🔍 **Web search is optional** and adds:
- Real-time validation
- Source attribution
- Current market data

**Recommended**: Move to Phase 2 (Brand Identity) with what you have. Add web search later if needed for specific validation.

---

## 📞 Support

**Need help setting up web search?**
1. Check Google Cloud Console setup guide
2. Verify API is enabled
3. Test with small query first
4. Check `.env` file has both variables

**Questions about whether you need it?**
- Review `outputs/flyberry-gourmet/brand-book.md`
- If it has what you need → skip web search
- If you need real-time data → set up web search

---

**Status**: Web search is **optional** for Horizon Brand Builder Pro

**Current**: Professional mode provides comprehensive strategy without it

**Setup Time**: 10-15 minutes if needed

**Cost**: $0 (free tier) or ~$5/1000 queries

