# SalesPulse — Retail Business Analytics: Project Overview

## 1. Executive Summary

**SalesPulse** is an enterprise-grade retail business analytics and data engineering initiative designed to extract actionable commercial intelligence from Brazilian e-commerce operations. Built on top of the real-world **Brazilian E-Commerce Public Dataset by Olist**, SalesPulse models, queries, and evaluates transaction lifecycles covering over 100,000 customer orders placed between 2016 and 2018 across Brazilian states.

Modern e-commerce platforms operate at the intersection of complex supply chain dynamics, dynamic pricing, regional logistics hurdles, seller performance variability, and multi-channel customer satisfaction. The goal of SalesPulse is to construct a scalable PostgreSQL relational data warehouse, execute deep diagnostic SQL analytical workflows, and deliver strategic business intelligence dashboards to guide executive decision-making.

---

## 2. Real-World Business Problem

Olist operates as a marketplace integrator connecting small and medium-sized independent merchants to major Brazilian e-commerce platforms. While this marketplace model accelerates merchant onboarding and expands product catalog breadth, it presents critical operational challenges:

1. **Logistics & Geographic Latency**: Brazil spans continental distances with varying infrastructure quality. Delivery delays directly deteriorate customer retention and drive negative review sentiment.
2. **Freight Economics & Price Sensitivity**: Freight costs often represent an outsized percentage of order value, leading to cart abandonment or compressed merchant margins.
3. **Seller Reliability & Fulfillment Bottlenecks**: With thousands of independent merchants fulfilling orders, monitoring on-time shipping limits and return/cancellation rates is essential.
4. **Customer Retention & Lifetime Value**: E-commerce growth relies on repeat customers; understanding cohort behavior and retention bottlenecks across regional hubs is paramount.
5. **Customer Sentiment Disconnect**: Customer feedback scores fluctuate based on actual delivery timelines versus estimated delivery dates, requiring rigorous root-cause correlation.

---

## 3. Project Objectives

SalesPulse delivers an end-to-end data pipeline and analytical solution to address these core business questions:

- **Revenue & Order Performance**: Quantify historical Gross Merchandise Value (GMV), Monthly Recurring Trends, Average Order Value (AOV), and freight contribution ratios.
- **Customer Intelligence & Segmentation**: Track repeat purchase frequency, geographical concentration across Brazilian states, and RFM (Recency, Frequency, Monetary) behavioral clusters.
- **Logistics & Carrier SLA Tracking**: Measure delivery duration, evaluate carrier performance against promised SLAs (estimated vs. actual delivery dates), and identify regional delivery bottlenecks.
- **Product Category & Merchandising Optimization**: Identify top revenue-generating categories, assess category-level return/dissatisfaction drivers, and uncover cross-selling dynamics.
- **Review & Feedback Analysis**: Dissect customer review ratings, investigate duplicate feedback patterns, and quantify the monetary impact of negative review scores.

---

## 4. Project Scope & Architecture

### In-Scope
- Ingestion, validation, and relational modeling of all 9 Olist datasets in PostgreSQL 17.
- Resolution of data-quality anomalies (e.g., non-unique review identifiers, Portuguese-to-English category translations, column name discrepancies).
- Optimization with targeted B-tree indexes for analytical query acceleration.
- Multi-tier SQL exploratory and analytical queries.
- Interactive BI reporting and executive presentation.

### Out-of-Scope (Dataset Boundaries)
- Real-time streaming order updates (the dataset represents a historical snapshot spanning 2016–2018).
- Direct inventory replenishment tracking (raw stock quantities are not present in the Olist public dataset).

---

## 5. Technology Stack

| Domain | Technology / Tool | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Database** | PostgreSQL | 17.x | Relational database management system, schema modeling, ACID transactions |
| **Database Client** | DBeaver Community | 24.x+ | Database administration, SQL script execution, ERD generation |
| **Programming Language** | Python | 3.12 | Pre-ingestion validation, data-quality profiling, batch ETL automation |
| **Database Connector** | psycopg2-binary | 2.9.x | High-performance Python-PostgreSQL adapter with batch execution |
| **Version Control** | Git / GitHub | Latest | Source code tracking, repository management, peer review |
| **Business Intelligence** | Metabase / Power BI | Planned (Day 6) | Interactive visual dashboards, KPI scorecards, drill-down analytics |

---

## 6. Six-Day Implementation Roadmap

```
  ┌────────────────────────────────────────────────────────┐
  │ Day 1: Foundation & Data Architecture (COMPLETED)      │
  │ • Environment configuration (PostgreSQL 17, DBeaver)   │
  │ • Dataset inspection & exploratory quality checks      │
  │ • Review duplication anomaly investigation             │
  │ • Relational DDL design & primary key resolution       │
  │ • Batch ingestion of 9 datasets (1.54M+ records)       │
  │ • Enterprise ERD generation                            │
  └──────────────────────────┬─────────────────────────────┘
                             │
  ┌──────────────────────────▼─────────────────────────────┐
  │ Day 2: Foundational SQL & Revenue Metrics (PLANNED)    │
  │ • Data integrity verification scripts                  │
  │ • Historical GMV, total order volume, active customers │
  │ • Monthly sales velocity & seasonal peak analysis      │
  │ • Payment method distribution and installment trends   │
  └──────────────────────────┬─────────────────────────────┘
                             │
  ┌──────────────────────────▼─────────────────────────────┐
  │ Day 3: Customer Behavior & Segmentation (PLANNED)      │
  │ • Geographic density by Brazilian states & cities      │
  │ • Customer repeat purchase rate & retention cohorts    │
  │ • RFM (Recency, Frequency, Monetary) segmentation SQL  │
  └──────────────────────────┬─────────────────────────────┘
                             │
  ┌──────────────────────────▼─────────────────────────────┐
  │ Day 4: Logistics, Delivery & SLA Performance (PLANNED) │
  │ • Delivery lead time calculation (purchase to customer)│
  │ • Estimated vs. actual delivery gap (SLA adherence)    │
  │ • Regional freight cost ratios and carrier latency     │
  └──────────────────────────┬─────────────────────────────┘
                             │
  ┌──────────────────────────▼─────────────────────────────┐
  │ Day 5: Product & Seller Merchandising Analytics(PLANNED│
  │ • Top product categories by revenue & unit volume      │
  │ • Low-scoring categories vs. high return rates         │
  │ • Seller fulfillment efficiency & SLA compliance      │
  └──────────────────────────┬─────────────────────────────┘
                             │
  ┌──────────────────────────▼─────────────────────────────┐
  │ Day 6: BI Dashboard & Executive Presentation (PLANNED) │
  │ • Metabase / BI dashboard design with interactive KPIs │
  │ • Executive narrative presentation & final findings    │
  │ • Portfolio publication & documentation wrap-up        │
  └────────────────────────────────────────────────────────┘
```

> [!NOTE]
> Days 2 through 6 represent planned milestones. All Day 1 foundational milestones have been fully implemented, verified, and cataloged.

