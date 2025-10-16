# Brand Builder Pro - Accuracy & Verification Framework

**Created**: 2025-10-11
**Purpose**: Ensure all brand reports contain verified, recent, and properly cited data

---

## Problem Statement

### Issues Identified:
1. **Inaccurate Data**: Revenue model incorrectly described (marketplace commissions)
2. **Missing Prices**: Vacuum-fried chips pricing incomplete
3. **No Source Citations**: Claims without verification
4. **Poor Presentation**: Data in bullets instead of tables
5. **No Recency Indicators**: Can't tell if data is current or stale

---

## Solution: 4-Tier Verification System

### Tier 1: ✅ VERIFIED (95-100% confidence)
- **Source**: Direct from brand website or official channels
- **Age**: < 30 days
- **Method**: Direct observation
- **Example**: Prices from flyberry.in (Oct 11, 2025)

### Tier 2: ✓ CROSS-VERIFIED (80-94% confidence)
- **Source**: 2+ independent sources agree
- **Age**: < 90 days
- **Method**: Cross-reference validation
- **Example**: Revenue (₹24 Cr) from Tracxn + company filings

### Tier 3: ⚠️ SINGLE SOURCE (60-79% confidence)
- **Source**: Single credible source
- **Age**: < 180 days
- **Method**: Not independently verified
- **Example**: Customer review from Amazon (single user)

### Tier 4: ⓘ ESTIMATED (40-59% confidence)
- **Source**: Industry benchmarks or calculations
- **Method**: Derived data
- **Must State**: Clearly marked as "Estimated"
- **Example**: CAC (₹200-400) from industry averages

---

## Implementation

### 1. Every Data Point Must Have:

```markdown
**Data Point** [Tier Symbol]
*Source: [Platform], [Date], [Confidence%]*

Example:
**Annual Revenue**: ₹24 Crores ✓
*Source: Tracxn.com, March 2024, 85% confidence*
```

### 2. Use Tables for Structured Data:

#### ❌ BAD (Before):
```markdown
- Medjoul Dates: ₹265 - ₹899
- Ameri Dates: ₹399
- Available on Blinkit, Instamart
```

#### ✅ GOOD (After):
```markdown
| Product | Size | Price (₹) | Platform | Source | Date | Tier |
|---------|------|-----------|----------|--------|------|------|
| Medjoul Dates (Mini) | 200g | 375 | Blinkit | Blinkit.com | Oct 2025 | ✅ |
| Ameri Dates | 200g | 399 | Instamart | Swiggy.com | Oct 2025 | ✅ |
```

### 3. Fix Factual Errors Immediately:

#### ❌ INCORRECT:
```markdown
**Revenue Streams**:
- Marketplace Commissions (15-20%)
```

#### ✅ CORRECTED:
```markdown
**Revenue Channels** (After Platform Fees):
- D2C Website: 100% margin retention
- Amazon/Marketplaces: **Pay 15-20% commission** → Keep 80-85%
- Quick Commerce: **Pay 25-30% commission** → Keep 70-75%
```

### 4. Mark Estimates Clearly:

#### ❌ STATED AS FACT:
```markdown
**Average Order Value**: ₹600-800
**Customer Acquisition Cost**: ₹200-400
```

#### ✅ MARKED AS ESTIMATE:
```markdown
**Average Order Value**: ₹600-800 ⓘ *Est.*
*Source: Calculated from product price ranges, Oct 2025, 50% confidence*

**Customer Acquisition Cost**: ₹200-400 ⓘ *Est.*
*Source: Food & Beverage D2C industry benchmarks, 2024, 55% confidence*
```

---

## Data Collection Process

### Step 1: Primary Research (Tier 1)
1. Visit brand website (flyberry.in)
2. Check official social media
3. Screenshot/document findings
4. Record date and time

### Step 2: Marketplace Verification (Tier 1-2)
1. Amazon India → Prices, reviews, seller info
2. Blinkit → Availability, pricing
3. Swiggy Instamart → Availability, pricing
4. BigBasket → Product range
5. JioMart → Additional verification

### Step 3: Third-Party Sources (Tier 2-3)
1. Tracxn → Company financials
2. SellerRatings → Seller history
3. PriceHistory.app → Price trends
4. News articles → Recent developments

### Step 4: Estimates (Tier 4)
1. Use ONLY when primary data unavailable
2. Document methodology
3. Cite industry benchmarks
4. Mark clearly as estimate

---

## Quality Control Checklist

### Before Publishing Any Report:

- [ ] Every price has source + date + platform
- [ ] Every financial claim has source + confidence
- [ ] Every customer quote has attribution
- [ ] All tables properly formatted
- [ ] Revenue model accurately describes who pays whom
- [ ] Estimates clearly marked with ⓘ
- [ ] No data older than 180 days (unless historical context)
- [ ] Verification log created
- [ ] Confidence scores calculated

---

## Files Created

### 1. `DATA-VERIFICATION-LOG.md`
**Location**: `outputs/flyberry-gourmet/`
**Purpose**: Track all verified data points with sources
**Updates**: Monthly (pricing), Quarterly (availability), Annually (financials)

### 2. `data-quality-standards.ts`
**Location**: `src/config/`
**Purpose**: TypeScript interfaces and functions for data verification
**Use**: Import into report generation workflows

### 3. `ACCURACY-FRAMEWORK.md` (this file)
**Location**: Root directory
**Purpose**: Documentation and guidelines for maintaining accuracy

---

## Automated Checks (Future Enhancement)

### Phase 1: Manual (Current)
- Human verification of all data points
- Manual table creation
- Manual citation addition

### Phase 2: Semi-Automated (Next)
- Script to check data age
- Automated table generation from structured data
- Citation template auto-fill

### Phase 3: Fully Automated (Future)
- API integration (Amazon, Tracxn, etc.)
- Real-time price monitoring
- Automated staleness alerts
- Confidence score calculation

---

## Example: Corrected Product Table

| Product Category | Product Name | Size | Price (₹) | Platform | Source | Date | Tier |
|-----------------|--------------|------|-----------|----------|--------|------|------|
| **Dates** | Mini Medjoul | 200g | 375 | Blinkit | Blinkit.com | Oct 2025 | ✅ |
| | Ameri Dates | 200g | 399 | Instamart | Swiggy.com | Oct 2025 | ✅ |
| | Premium Medjoul | 200g | 499 | Instamart | Swiggy.com | Oct 2025 | ✅ |
| | Large Medjoul | 500g | [TBD] | Instamart | - | - | - |
| **Vacuum Chips** | Okra Chips | 240g (6x40g) | 594 | D2C | flyberry.in | Oct 2025 | ✅ |
| | Okra Chips | 120g (3x40g) | 279 | Amazon | Amazon.in | Oct 2025 | ✅ |
| | Chickpea Chips | Pack of 4 | 196 | D2C | flyberry.in | Oct 2025 | ✅ |
| | Banana Chips | Pack of 4 | 196 | D2C | flyberry.in | Oct 2025 | ✅ |
| | Coconut Chips | 50g | 99 | BigBasket | BigBasket.com | Oct 2025 | ✅ |
| | Taro Chips | 40g | 99 | BigBasket | BigBasket.com | Oct 2025 | ✅ |
| **Others** | Date Powder | - | 464 | Blinkit | Blinkit.com | Oct 2025 | ✅ |
| | Brazil Nuts | - | 484 | Blinkit | Blinkit.com | Oct 2025 | ✅ |

*All prices verified October 11, 2025*

---

## Monthly Maintenance

### 1st of Every Month:
1. Update pricing data (all platforms)
2. Check product availability
3. Verify platform presence
4. Review customer feedback
5. Update confidence scores
6. Archive old data
7. Regenerate reports

### Quarterly:
1. Full competitive audit
2. Revenue verification (if available)
3. Market position reassessment
4. New product launches

### Annually:
1. Complete brand review
2. Financial year data (March 31)
3. Strategic reassessment
4. Full report regeneration

---

## Training: How to Verify Data

### Example: Verifying a Price Claim

**Step 1**: Find the source
```bash
# Navigate to platform
visit: https://blinkit.com/brand/Flyberry
or: https://www.swiggy.com/instamart
```

**Step 2**: Screenshot evidence
- Capture product page
- Include date/time
- Show price clearly

**Step 3**: Record in verification log
```markdown
| Product | Price | Source | Date | Tier |
|---------|-------|--------|------|------|
| Mini Medjoul Dates | ₹375 | Blinkit.com | Oct 11, 2025 | ✅ |
```

**Step 4**: Add citation in report
```markdown
**Mini Medjoul Dates (200g)**: ₹375 ✅
*Source: Blinkit, Oct 11 2025, 95% confidence*
```

---

## Next Steps

1. ✅ Create verification framework (DONE)
2. ✅ Document accuracy standards (DONE)
3. ✅ Build verification log (DONE)
4. ⏳ Regenerate Flyberry report with corrections (IN PROGRESS)
5. ⏳ Add tables for all structured data (IN PROGRESS)
6. ⏳ Add source citations throughout (IN PROGRESS)
7. 📋 Create automated staleness checker (FUTURE)
8. 📋 Build price monitoring system (FUTURE)

---

## Contact for Questions

If unsure about data verification:
1. Check this framework first
2. Review DATA-VERIFICATION-LOG.md
3. When in doubt → Mark as estimate ⓘ + document why
4. Never present unverified data as fact

---

**Remember**: Trust is earned through accuracy. One incorrect claim can undermine an entire report.

