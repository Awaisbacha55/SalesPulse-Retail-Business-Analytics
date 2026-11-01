# SalesPulse — Executive Summary

## 1. Project Overview

**SalesPulse** is an enterprise data engineering and business analytics project built on real-world Brazilian e-commerce transaction data provided by Olist. The project establishes a robust relational data warehouse in **PostgreSQL 17**, validates and cleans **1,547,842 records** across nine relational entities, executes **39 commercial SQL analyses**, and visualizes key findings through an interactive **Metabase Business Intelligence Dashboard**.

The primary objective is to evaluate commercial scale, uncover customer behavioral bottlenecks, diagnose logistics delivery SLAs, and provide data-driven strategic interventions for e-commerce executive leadership.

---

## 2. Key Business Metrics at a Glance

| Strategic Metric | Value | Business Significance |
| :--- | :---: | :--- |
| **Gross Merchandise Value (GMV)** | **R\$ 16,008,872.12** | Total commercial payment volume processed |
| **Total Paid Orders** | **99,440** | Total successful transactional orders |
| **Average Order Value (AOV)** | **R\$ 160.99** | Average basket spend per customer order |
| **Unique Customer Individuals** | **96,096** | Total distinct buyer base across Brazil |
| **Customer Retention Rate** | **3.12%** | Proportion of buyers making 2 or more orders |
| **On-Time Delivery SLA Compliance** | **91.89%** | Packages delivered on or before promised date |
| **Average On-Time Review Score** | **4.29 / 5.0** | High satisfaction when packages arrive on schedule |
| **Average Delayed Review Score** | **2.57 / 5.0** | Critical -1.72 star penalty (-40%) for delayed shipments |
| **Top 3 States Revenue Contribution** | **63.36%** | Market concentration in `SP`, `RJ`, and `MG` |
| **Credit Card Share of Payment Volume** | **78.34%** | Primary consumer tender type, heavily installment-driven |

---

## 3. Core Strategic Findings

### 1. Logistics SLA is the Primary Driver of Brand Reputation
Analysis of 95,824 delivered orders with customer reviews proves that delivery timeliness directly dictates customer sentiment. On-time orders average **4.29 stars**, while delayed orders plunge to **2.57 stars**. The 8.11% of packages arriving late account for a disproportionate volume of 1-star reviews. Operational logistics improvements directly remediate brand sentiment.

### 2. High Acquisition Scale Masking Retention Bottleneck
While the marketplace successfully acquired 96,096 unique buyers, **96.88% purchased only once**. Repeat buyers (3.12%) generated higher lifetime value and stability. Shifting organizational focus from pure top-of-funnel paid acquisition to automated retention, replenishment notifications, and cross-category recommendations represents the highest-leverage growth opportunity.

### 3. Geographic and Category Power Laws
- **Geography**: São Paulo alone generates **38.28%** of item merchandise revenue (R\$ 5.20M). Combined with Rio de Janeiro and Minas Gerais, the Southeast region represents **63.36%** of all sales.
- **Catalog**: Five categories (`health_beauty`, `watches_gifts`, `bed_bath_table`, `sports_leisure`, `computers_accessories`) account for nearly **40%** of all merchandise sales across 71 total catalog categories.

---

## 4. Technical Stack & Deliverables

- **Database Engine**: PostgreSQL 17 (Relational DDL, B-tree analytical indexing, ACID compliance).
- **Data Pipeline**: Python 3.12 (`psycopg2-binary` batch insertion streaming 2,000 rows/batch with dynamic header normalization).
- **SQL Analytics**: 39 distinct business queries spanning aggregations, CTEs, multi-table joins, and advanced window functions (`LAG`, `ROW_NUMBER`, `DENSE_RANK`, running totals, moving averages).
- **Business Intelligence**: Metabase interactive dashboard featuring KPI scorecards, time-series revenue trends, geographic penetration maps, and SLA correlation charts.
- **Repository Architecture**: Enterprise-ready GitHub repository with comprehensive documentation, data dictionaries, installation blueprints, and cloud deployment guides.

---

## 5. Strategic Roadmap & Recommendations

1. **Logistics Optimization**: Implement automated 48-hour delay alerts and diversify regional carrier partnerships on Southeast-to-Northeast transit corridors.
2. **Lifecycle Marketing**: Deploy automated win-back campaigns at the 45-to-60-day mark for consumable categories and launch a loyalty tier for buyers spending over R\$ 500.
3. **Fulfillment Infrastructure**: Establish localized micro-fulfillment centers in Greater São Paulo and Rio de Janeiro for top-selling SKUs to guarantee 24-to-48-hour delivery SLAs.

