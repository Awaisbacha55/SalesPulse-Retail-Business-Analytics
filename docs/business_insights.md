# SalesPulse — Business Insights & Strategic Recommendations

## 1. Executive Summary

This report synthesizes commercial findings extracted from the **39 verified SQL business analyses** executed on the PostgreSQL 17 `salespulse` database (1,547,842 records). Every insight and figure presented in this document is verified against actual database records.

---

## 2. Five Core Data-Backed Business Insights

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SALESPULSE CORE METRICS                         │
│   Gross Revenue: R$ 16.01M  │  Paid Orders: 99,440  │  AOV: R$ 160.99   │
│   Unique Customers: 96,096  │  Repeat Rate: 3.12%   │  On-Time: 91.89%  │
└────────────────────────────────────────────────────────────────────────┘
```

### Insight 1: Delivery Latency Directly Governs Customer Sentiment (The 1.72-Star Penalty)
- **Verified Metrics**:
  - Total delivered orders with reviews: **95,824** orders.
  - On-time delivered orders average review score: **4.29 / 5.0** (88,163 orders).
  - Delayed delivered orders average review score: **2.57 / 5.0** (7,661 orders).
  - Overall on-time delivery compliance: **91.89%** (88,644 orders); delayed rate: **8.11%** (7,826 orders).
- **Commercial Impact**:
  Delivery delays cause a **1.72-star reduction (-40%)** in customer satisfaction. More importantly, cross-analysis shows that product quality complaints drop significantly when packages arrive on schedule. Logistics execution is the single greatest determinant of brand sentiment and negative review volume.

---

### Insight 2: Severe Repeat Purchase Deficit (96.88% One-Time Buyers)
- **Verified Metrics**:
  - Total unique individuals (`customer_unique_id`): **96,096**.
  - One-time buyers: **93,099** customers (**96.88%**).
  - Repeat buyers (>1 order): **2,997** customers (**3.12%**).
  - Buyers with 3 or more orders: **263** customers (**0.27%**).
- **Commercial Impact**:
  The marketplace operated almost exclusively as an customer acquisition funnel rather than a customer retention engine. While acquiring 96k+ customers represents substantial market reach, failing to retain 96.88% of them results in high Customer Acquisition Cost (CAC) fatigue and leaves immense Customer Lifetime Value (LTV) unrealized.

---

### Insight 3: High Geographic Revenue Concentration in Southeast Brazil (63.36% in Top 3 States)
- **Verified Metrics**:
  - State of São Paulo (`SP`): **R\$ 5,202,955.05** merchandise sales (**38.28%** of item revenue across 41,375 orders).
  - State of Rio de Janeiro (`RJ`): **R\$ 1,824,092.67** (**13.42%** across 12,762 orders).
  - State of Minas Gerais (`MG`): **R\$ 1,585,308.03** (**11.66%** across 11,544 orders).
  - Combined Top 3 States (`SP`, `RJ`, `MG`): **63.36%** of total merchandise revenue.
- **Commercial Impact**:
  Demand is geographically clustered in the Southeast economic corridor. Conversely, northern and northeastern states (e.g., `BA`, `PE`, `CE`) exhibit higher average ticket sizes to compensate for freight, but order volumes remain constricted by shipping transit times exceeding 20–30 days.

---

### Insight 4: Credit Card Dominance and Installment Financing Culture
- **Verified Metrics**:
  - Credit Card: **R\$ 12,542,084.19** (**78.34%** of payment value across 76,505 orders).
  - Boleto Bancário: **R\$ 2,869,361.27** (**17.92%** across 19,784 orders).
  - Voucher: **R\$ 379,436.87** (**2.37%**).
  - Debit Card: **R\$ 217,989.79** (**1.36%**).
- **Commercial Impact**:
  Over **78%** of platform monetary volume depends on credit cards, with a substantial portion of transactions split across 3 to 10 monthly installments. Boleto Bancário accounts for nearly 18% of revenue, serving consumers without credit lines. Checkout optimization must prioritize zero-friction installment selection and digital Boleto payment options.

---

### Insight 5: Merchandising Revenue Concentrated in Five Power Categories
- **Verified Metrics**:
  - `health_beauty`: **R\$ 1,258,681.34** (8,836 orders, 9,670 units).
  - `watches_gifts`: **R\$ 1,205,005.68** (5,624 orders, 5,991 units).
  - `bed_bath_table`: **R\$ 1,036,988.68** (9,417 orders, 11,115 units).
  - `sports_leisure`: **R\$ 988,048.97** (7,720 orders, 8,641 units).
  - `computers_accessories`: **R\$ 911,954.32** (6,689 orders, 7,827 units).
  - Combined Top 5 Categories: **R\$ 5,400,679.03** (over 39.7% of all item sales across 71 categories).
- **Commercial Impact**:
  While Olist hosts 71 product categories, commercial success is anchored by personal care, gifting, home furnishings, and technology accessories. Merchandising campaigns and seller onboarding initiatives yield the highest ROI when concentrated in these five core categories.

---

## 3. Three Practical Business Recommendations

### Recommendation 1: Deploy Proactive Logistics SLA Alerts and Regional Carrier Diversification
- **The Problem**: 7,826 orders arrived late, slashing customer satisfaction scores from **4.29** down to **2.57**.
- **Actionable Solution**:
  1. Integrate automated carrier tracking webhooks to flag packages falling behind schedule at least 48 hours before estimated delivery dates.
  2. Implement automated customer courtesy notifications (e.g., SMS/Email with a R\$ 15 store voucher) *before* the customer discovers the delay, converting an operational failure into a proactive loyalty touchpoint.
  3. Reallocate carrier contracts in high-delay transit lanes (especially Southeast-to-Northeast routes) to regional carriers offering guaranteed delivery SLAs.

---

### Recommendation 2: Launch an Automated Customer Re-engagement & Loyalty Lifecycle Engine
- **The Problem**: 96.88% of customers purchase only once, leaving customer acquisition investments underleveraged.
- **Actionable Solution**:
  1. Trigger automated personalized replenishment campaigns 45 to 60 days post-delivery for consumable categories (`health_beauty`, `perfumery`).
  2. Implement cross-category recommendation modules at checkout and post-purchase (e.g., customers purchasing `bed_bath_table` receive targeted recommendations for `home_decor`).
  3. Introduce a tier-based VIP loyalty program for buyers crossing R\$ 500 in lifetime spend (High Value segment from Q29), providing free freight or exclusive merchant discounts.

---

### Recommendation 3: Establish Localized Micro-Fulfillment Hubs in São Paulo & Rio de Janeiro
- **The Problem**: 51.70% of total revenue originates from customers in São Paulo and Rio de Janeiro, yet fulfillment depends on distributed independent sellers.
- **Actionable Solution**:
  1. Create Olist-managed fulfillment micro-warehouses in Greater São Paulo and Rio de Janeiro for top-selling SKUs identified in Analysis Q3 and Q33.
  2. Offer fast-track 24-to-48-hour delivery badges for inventory housed within these hubs.
  3. Shortened shipping transit will simultaneously compress freight costs, boost conversion rates in the primary demographic market, and protect high review scores (4.3+ stars).

