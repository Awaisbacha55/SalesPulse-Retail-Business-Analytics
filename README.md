# SalesPulse — Retail Business Analytics with SQL & Next.js

[![Next.js 15](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.x%20%7C%20Neon-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Metabase](https://img.shields.io/badge/Metabase-BI%20Dashboard-509EE3?logo=metabase&logoColor=white)](https://www.metabase.com/)
[![YouTube Walkthrough](https://img.shields.io/badge/YouTube-Video%20Demo-FF0000?logo=youtube&logoColor=white)](https://youtu.be/JfchSQo9VEQ)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![SQL Analytics](https://img.shields.io/badge/SQL%20Analytics-40%2B%20Queries%20%26%20Views-blueviolet)]()

> An enterprise-grade retail business analytics platform modeling 100,000+ Brazilian e-commerce orders. Features **PostgreSQL 17** / **Neon Serverless PostgreSQL**, 40+ commercial SQL analyses and saved views, a **Next.js 15 + React 19 + Recharts** interactive analytics dashboard deployable to **Vercel**, and an executive **Metabase BI Dashboard**.

📺 **Video Walkthrough**: [Watch the SalesPulse Dashboard Demo on YouTube (2:45)](https://youtu.be/JfchSQo9VEQ)  
🚀 **Deployment Guide**: [Step-by-step Vercel + Neon Cloud Deployment Guide](DEPLOYMENT.md)  
📖 **Data Dictionary**: [Complete Relational Schema & 9-Table Catalog](DATA_DICTIONARY.md)

---

## Table of Contents

1. [Project Title](#1-project-title)
2. [Project Overview](#2-project-overview)
3. [Business Problem](#3-business-problem)
4. [Project Objectives](#4-project-objectives)
5. [Dataset Information](#5-dataset-information)
6. [Technology Stack](#6-technology-stack)
7. [System Architecture](#7-system-architecture)
8. [Database Structure and Data Dictionary](#8-database-structure-and-data-dictionary)
9. [Data Cleaning and Validation Process](#9-data-cleaning-and-validation-process)
10. [SQL Analysis Categories](#10-sql-analysis-categories)
11. [SQL Techniques Used](#11-sql-techniques-used)
12. [Next.js Interactive Web Dashboard](#12-nextjs-interactive-web-dashboard)
13. [Metabase BI Dashboard](#13-metabase-bi-dashboard)
14. [Business Insights & Executive Recommendations](#14-business-insights--executive-recommendations)
15. [Repository Structure](#15-repository-structure)
16. [Installation & Local Setup](#16-installation--local-setup)
17. [Database Setup & Data Ingestion](#17-database-setup--data-ingestion)
18. [Executing SQL Analyses](#18-executing-sql-analyses)
19. [Running the Next.js Dashboard Locally](#19-running-the-nextjs-dashboard-locally)
20. [Deploying to Vercel](#20-deploying-to-vercel)
21. [Project Limitations & Future Improvements](#21-project-limitations--future-improvements)
22. [Author & Credits](#22-author--credits)

---

## 1. Project Title

**SalesPulse — Retail Business Analytics with SQL & Next.js**  
*A complete retail intelligence warehouse and interactive web analytics application modeling the Brazilian e-commerce ecosystem.*

---

## 2. Project Overview

**SalesPulse** is an end-to-end retail business intelligence and analytics solution powered by **PostgreSQL 17 / Neon Serverless PostgreSQL**, **Python 3.12**, **Next.js 15**, and **Metabase**. Built using the real-world **Brazilian E-Commerce Public Dataset by Olist**, the project models the full customer transaction lifecycle across **99,441 orders** and **1,547,842 total relational records** placed between 2016 and 2018.

Key highlights of the solution:
- **Relational Data Warehouse**: 9 normalized tables and 4 reusable analytical views in PostgreSQL.
- **Enterprise SQL Suite**: 39 verified business queries answering revenue, customer, product, and logistics questions.
- **Modern Full-Stack Dashboard (`salespulse-dashboard/`)**: Built with **Next.js 15 App Router**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Recharts**, connecting directly to **Neon PostgreSQL** via server-side connection pooling.
- **Executive BI Dashboard**: Metabase dashboard featuring interactive KPI scorecards, date filters, and SLA correlation charts.
- **Evidence-Based Recommendations**: 5 empirical insights and 3 actionable business strategies to optimize delivery SLA, improve repeat rates, and capture regional demand.

---

## 3. Business Problem

Olist operates a major marketplace integrator connecting small and medium-sized independent merchants to the largest e-commerce platforms across Brazil. In multi-sided marketplace operations, key business bottlenecks arise:

- **Logistics Latency Across Extreme Geographies**: Brazil spans vast transit corridors. Package delivery delays severely depress customer satisfaction and brand loyalty.
- **Customer Churn & Retention Deficit**: While customer acquisition is high, understanding the repeat purchasing rate is critical to maximizing Customer Lifetime Value (LTV).
- **Regional Sales Polarization**: Pinpointing revenue contribution across Brazilian states is vital for allocating fulfillment centers and localized advertising budgets.
- **Payment Method Dynamics**: Brazilian consumers rely heavily on credit card installments and Boleto Bancário; optimizing checkout conversion requires understanding tender type distributions.
- **Customer Satisfaction Sensitivity**: Understanding whether negative customer review scores are driven by product defects or logistics delivery delays is essential for seller remediation.

---

## 4. Project Objectives

1. **Relational Data Architecture**: Transform nine disparate flat CSV datasets into a normalized, high-performance PostgreSQL 17 relational database with strict primary/foreign key constraints and analytical B-tree indexing.
2. **Data Integrity & Anomaly Resolution**: Detect and resolve real-world data quality anomalies—specifically non-unique natural keys in customer reviews and misspelled column headers.
3. **Deep Commercial Analytics**: Author and execute 39 verified business queries answering strategic questions across revenue growth, customer segmentation, seller performance, and operational SLAs.
4. **Interactive Web Dashboard**: Build and deploy an enterprise Next.js 15 web application with serverless database connectivity, parameterized SQL caching, and responsive charts.
5. **Interactive BI Dashboards**: Build an executive Metabase dashboard featuring scorecards, time-series velocity trends, geographic penetration maps, and SLA correlation charts.
6. **Actionable Recommendations**: Translate query findings into data-backed strategic interventions for executive management.

---

## 5. Dataset Information

- **Source**: [Brazilian E-Commerce Public Dataset by Olist (Kaggle)](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)
- **Timeframe**: October 2016 – October 2018
- **Scope**: ~100k real customer orders spanning all 27 Brazilian federative units.
- **Relational Scale**: 9 datasets totaling 1,547,842 ingested records.

---

## 6. Technology Stack

| Domain | Technology / Tool | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) | 15.x | Server-side rendering, API routes, fast edge delivery |
| **UI Library** | React | 19.x | Component lifecycle, hooks, reactive state management |
| **Language** | TypeScript | 5.x | Strict end-to-end type safety for data models and APIs |
| **Styling** | Tailwind CSS | 3.4.x | Utility-first responsive styling and dark/light accents |
| **Data Visualization** | Recharts | 2.15.x | Responsive SVG charts (Area, Bar, Donut, Multi-line) |
| **Iconography** | Lucide React | Latest | Clean, consistent modern UI icons |
| **Database** | PostgreSQL / Neon | 17.x | Relational warehousing, ACID transactions, SSL pooling |
| **DB Client Driver** | `pg` / `psycopg2` | Latest | Serverless connection pooling and batch ETL ingestion |
| **BI Tool** | Metabase | Latest OSS | Self-service executive analytics and embedded dashboards |
| **Cloud Hosting** | Vercel | Free Tier | Global edge deployment with zero-config Next.js hosting |
| **Scripting / ETL** | Python | 3.12 | Pre-ingestion profiling, quality validation, ETL loader |
| **SQL Administration** | DBeaver Community | 24.x+ | Visual querying, EXPLAIN ANALYZE, ERD generation |

---

## 7. System Architecture

The high-level end-to-end architecture from raw CSV data ingestion to PostgreSQL warehousing, Next.js web application, and Metabase visual analytics:

![Project Architecture](images/project_architecture.png)

*Figure 1: SalesPulse End-to-End System Architecture.*

---

## 8. Database Structure and Data Dictionary

The database schema is organized into a hybrid star/snowflake relational model centered around the `orders` fact entity, linked to `customers`, `order_items`, `order_payments`, `order_reviews`, `products`, `sellers`, `category_translation`, and `geolocation`.

![Database ERD](images/salespulse_erd.png)

*Figure 2: SalesPulse PostgreSQL 17 Entity-Relationship Diagram (ERD).*

### Database Tables and Verified Record Counts

| # | Table Name | Primary Key | Foreign Keys | Row Count | Description |
| :-: | :--- | :--- | :--- | :-: | :--- |
| **1** | `customers` | `customer_id` | — | 99,441 | Order-level customer identifier and location |
| **2** | `sellers` | `seller_id` | — | 3,095 | Merchant identifiers, ZIP codes, cities, and states |
| **3** | `category_translation` | `product_category_name` | — | 71 | Portuguese-to-English product category mapping |
| **4** | `products` | `product_id` | — | 32,951 | Product catalog, dimensions, weight, photos count |
| **5** | `orders` | `order_id` | `customer_id` $\rightarrow$ `customers` | 99,441 | Order lifecycle timestamps and delivery status |
| **6** | `order_items` | `(order_id, order_item_id)` | `order_id` $\rightarrow$ `orders`<br>`product_id` $\rightarrow$ `products`<br>`seller_id` $\rightarrow$ `sellers` | 112,650 | Purchased line items, pricing, and freight charges |
| **7** | `order_payments` | `(order_id, payment_sequential)` | `order_id` $\rightarrow$ `orders` | 103,886 | Payment methods, installment counts, and values |
| **8** | `order_reviews` | `review_record_id` *(Surrogate PK)* | `order_id` $\rightarrow$ `orders` | 99,224 | Customer ratings (1-5), review comments, timestamps |
| **9** | `geolocation` | `geolocation_id` *(Identity PK)* | — | 1,000,163 | Brazilian geographic coordinates by ZIP code prefix |

**Total Verified Records**: **1,547,842 rows** (100% data fidelity verified).  
*For complete column-level definitions, constraints, and data types, refer to [`DATA_DICTIONARY.md`](DATA_DICTIONARY.md).*

---

## 9. Data Cleaning and Validation Process

Before importing data, automated profiling scripts inspected all nine CSV files for structural integrity, missing values, and candidate key uniqueness.

![Data Quality Report](images/data_quality_report.png)

*Figure 3: Automated Data Quality Audit Output.*

### Key Validation Findings & Fixes
1. **Header Normalization**: Two misspelled headers in the raw products CSV were detected and dynamically mapped during stream ingestion:
   - `product_name_lenght` $\rightarrow$ normalized to `product_name_length`
   - `product_description_lenght` $\rightarrow$ normalized to `product_description_length`
2. **Duplicate Review Anomaly Resolution**:
   - Automated checks revealed that the candidate natural key `review_id` contained **814 duplicate rows** across 99,224 records (**789 distinct review IDs** appearing more than once).
   - Forensic analysis confirmed that when buyers purchased items across multiple orders in one session, the platform generated the identical `review_id` for distinct order evaluations.
   - **Resolution**: Enforcing `review_id` as the primary key would have rejected 814 valid reviews. A surrogate primary key (`review_record_id BIGINT GENERATED ALWAYS AS IDENTITY`) was introduced, ensuring **100% of customer reviews** were ingested without data loss.

---

## 10. SQL Analysis Categories

The 39 verified business queries are organized into eight commercial domains:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        39 SQL BUSINESS ANALYSES                        │
├───────────────────────────────────┬────────────────────────────────────┤
│ • Revenue & Sales Analysis (7)    │ • Seller Performance Analysis (2)  │
│ • Product & Category Metrics (6)  │ • Order & Payment Dynamics (6)     │
│ • Customer Analytics & LTV (5)    │ • Delivery & Operational SLAs (3)  │
│ • Customer Satisfaction (2)       │ • Advanced Window Functions (8)    │
└───────────────────────────────────┴────────────────────────────────────┘
```

For complete technical documentation of all 39 queries, see [`docs/sql_analysis_documentation.md`](docs/sql_analysis_documentation.md).

---

## 11. SQL Techniques Used

The analytical query suite demonstrates enterprise SQL competency:

- **Aggregations & Grouping**: `SUM()`, `AVG()`, `COUNT(DISTINCT ...)`, multi-column `GROUP BY`, `HAVING`.
- **Date & Time Intelligence**: `DATE_TRUNC('month', ...)`, `EXTRACT(DOW FROM ...)`, `TO_CHAR()`, timestamp intervals.
- **Common Table Expressions (CTEs)**: Modular multi-level CTEs for customer lifetime value and order status pipelines.
- **Complex Multi-Table Joins**: 3-to-5 table joins linking orders, customers, items, products, sellers, and translations.
- **Window Functions**:
  - `LAG()` for month-over-month revenue growth and customer repurchase intervals.
  - `SUM() OVER (ORDER BY ... ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` for running totals.
  - `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)` for top 3 products per category and purchase sequence numbers.
  - `RANK()` and `DENSE_RANK()` for state revenue rankings and top-value order rankings.
  - `AVG() OVER (ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)` for rolling 3-month moving averages.

![SQL Analysis](images/sql_analysis.png)

*Figure 4: Executing Complex SQL Customer & Window Analyses in DBeaver.*

---

## 12. Next.js Interactive Web Dashboard

Located in the [`salespulse-dashboard/`](salespulse-dashboard/) directory, the Next.js web application provides an interactive, executive analytics dashboard designed for live public deployment on Vercel:

### Key Application Features
- **Real-Time Database Connectivity**: Connects to Neon Serverless PostgreSQL with SSL encryption and connection pooling (`lib/db.ts`).
- **Interactive Global Filters**: Filter by date range (2016-2018), Brazilian state (e.g., `SP`, `RJ`, `MG`), and English product category with instant state propagation.
- **Live Recharts Visualizations**:
  - **Monthly Revenue & MoM Velocity**: Area chart and dual-axis growth velocity.
  - **Top Categories Horizontal Bar Chart**: Top categories by GMV and units sold.
  - **State Revenue Geographic Chart**: Highlighting Southeast corridor dominance.
  - **Customer Retention Donut**: Visualizing 96.9% one-time vs. 3.1% repeat buyers.
  - **Logistics SLA vs. CSAT Rating Chart**: Visualizing the -1.72 star drop on delayed orders.
  - **Pareto 80/20 Distribution Card**: Top 20% SKU revenue contribution.
- **Seven Dedicated Analytical Pages**:
  1. `/` — Executive Overview with 8 live KPI scorecards.
  2. `/revenue` — Monthly revenue trajectory, AOV trend line, and monthly ledger table.
  3. `/products` — Category rankings, Pareto 80/20 analysis, and top revenue items.
  4. `/customers` — Buyer retention donut, average repurchase gap (86.4 days), and top customer lifetime values.
  5. `/regions` — Geographic state distribution and regional revenue shares.
  6. `/delivery` — Delivery transit averages, on-time SLA rate (91.89%), and worst-case delay table.
  7. `/insights` — 5 empirical data findings and 3 prioritized strategic recommendations.

---

## 13. Metabase BI Dashboard

The project includes a production-grade Metabase BI dashboard:

![Dashboard Preview](images/dashboard_preview.png)

*Figure 5: SalesPulse Interactive Metabase Business Intelligence Dashboard.*

- **Video Demonstration**: [Watch the Metabase Dashboard Demo on YouTube](https://youtu.be/JfchSQo9VEQ)
- **Verified Baseline Metrics**:
  - **Total Revenue**: R\$ 13,591,643.70 (Merchandise GMV)
  - **Total Orders**: 99,441
  - **Average Order Value (AOV)**: R\$ 137.75
  - **Total Unique Customers**: 96,096
  - **Average Delivery Duration**: 12.6 Days
  - **On-Time Delivery Rate**: 91.89%

---

## 14. Business Insights & Executive Recommendations

The 39 SQL analyses and dashboard analytics produced five critical empirical findings and three strategic recommendations:

![Revenue Analysis](images/revenue_analysis.png)

*Figure 6: Revenue Analytics Execution in DBeaver.*

### 5 Empirical Findings
1. **Logistics SLA vs. Customer Review Rating (-1.72 Star Penalty)**:
   - On-time orders average **4.29 / 5.0 stars** (88,649 orders).
   - Delayed orders drop to **2.57 / 5.0 stars** (8,199 orders), representing a **-40.1% collapse** in satisfaction.
2. **Severe Repeat Purchase Deficit (96.88% One-Time Buyers)**:
   - Only **2,997 of 96,096 customers (3.12%)** made a second order.
   - The average repurchase interval is **86.4 days**.
3. **Extreme Geographic Concentration in Southeast Brazil (63.36% Share)**:
   - São Paulo (`SP`) generates **R\$ 5.20M (38.28%)**, Rio de Janeiro (`RJ`) **R\$ 1.69M (12.44%)**, and Minas Gerais (`MG`) **R\$ 1.58M (11.64%)**.
4. **Credit Card Dominance and Installment Financing**:
   - Credit cards capture **73.9%** of payments (R\$ 12.54M), followed by Boleto Bancário (**19.0%**). Over **52%** of credit transactions use multi-month installments.
5. **Top 5 Product Category Pareto Dominance**:
   - Top 5 of 73 categories generate **36.8%** of total revenue (`bed_bath_table`, `health_beauty`, `computers_accessories`, `furniture_decor`, `sports_leisure`).

### 3 Actionable Executive Recommendations
1. **Automated Carrier SLA Exception Triggers**: Deploy automated carrier webhook triggers. When an order is 48 hours from estimated delivery and still in transit, trigger a proactive SMS/email apology and a 10% voucher to mitigate 1-star reviews.
2. **86-Day Customer Retention Lifecycle Flow**: Capitalize on the 86.4-day average repurchase window by sending triggered email replenishment recommendations between Days 60 and 75, targeting a 2x increase in repeat customer rate.
3. **Regional 3PL Micro-Fulfillment in Northern Corridors**: Pre-stock top 20 Pareto SKUs in regional fulfillment hubs in Salvador or Recife to slash 20+ day shipping delays and capture underserved regional demand.

*For complete details, see [`docs/business_insights.md`](docs/business_insights.md) and [`docs/executive_summary.md`](docs/executive_summary.md).*

---

## 15. Repository Structure

```
SalesPulse-Retail-Business-Analytics/
│
├── README.md                           # Main repository documentation & guide
├── DEPLOYMENT.md                       # Vercel & Neon PostgreSQL deployment guide
├── DATA_DICTIONARY.md                  # Comprehensive schema & column data dictionary
├── LICENSE                             # MIT License
├── .gitignore                          # Excludes raw data, credentials, virtualenvs
├── requirements.txt                    # Project Python dependencies
├── .env.example                        # Template for database credentials
│
├── salespulse-dashboard/               # Next.js 15 Full-Stack Web Application
│   ├── app/                            # App Router (pages & API routes)
│   │   ├── api/                        # Serverless SQL API endpoints (/overview, /revenue, etc.)
│   │   ├── revenue/                    # Revenue analytics page
│   │   ├── products/                   # Products & Pareto analysis page
│   │   ├── customers/                  # Customer lifecycle page
│   │   ├── regions/                    # Regional distribution page
│   │   ├── delivery/                   # Logistics SLA page
│   │   ├── insights/                   # 5 Insights & 3 Recommendations page
│   │   ├── layout.tsx                  # Root layout with Client Providers
│   │   └── page.tsx                    # Executive Overview page
│   ├── components/                     # Reusable UI components
│   │   ├── charts/                     # Recharts components (Area, Bar, Donut, SLA)
│   │   ├── filters/                    # FilterBar & React Context Provider
│   │   ├── header/                     # Top bar with Neon DB status badge
│   │   ├── kpi/                        # Metric cards with loading states
│   │   ├── layout/                     # Responsive DashboardShell
│   │   └── sidebar/                    # Dark navy sidebar navigation
│   ├── lib/                            # Database pool (pg) and SQL queries
│   │   ├── db.ts                       # Neon SSL PostgreSQL pool singleton
│   │   ├── formatters.ts               # Currency (BRL), percentages, numbers
│   │   └── queries/analytics.ts        # Parameterized SQL query suite
│   ├── types/dashboard.ts              # TypeScript domain interfaces
│   ├── package.json                    # Dashboard dependencies
│   ├── tsconfig.json                   # TypeScript configuration
│   └── tailwind.config.ts              # Tailwind CSS configuration
│
├── database/
│   └── create_tables.sql               # PostgreSQL 17 DDL and index creation script
│
├── data/
│   ├── raw/                            # Directory for source CSV files (git-ignored)
│   └── processed/                      # Directory for processed datasets (git-ignored)
│
├── python/
│   ├── inspect_dataset.py              # CSV profiling and structure inspector
│   ├── check_data_quality.py           # Primary key & missing value validator
│   ├── investigate_reviews.py          # Forensic review ID duplicate diagnostic
│   └── import_olist_data.py            # High-performance batch ETL loader
│
├── sql/
│   ├── 00_verify_tables.sql            # Table verification query
│   ├── 01_basic_aggregate_analysis.sql # 19 foundational aggregate analyses (Q1-Q20)
│   ├── 02_joins_and_cte_analysis.sql   # 10 joins, CTEs, and customer analyses (Q21-Q30)
│   ├── 03_window_functions.sql         # 10 advanced window function analyses (Q31-Q40)
│   └── 04_bonus_views_and_pareto.sql   # 4 reusable views, Pareto 80/20 & EXPLAIN
│
├── dashboard/
│   ├── dashboard_overview.md           # Dashboard architecture and KPI layout
│   ├── dashboard_queries.sql           # SQL queries powering dashboard tiles
│   └── screenshots/                    # Dashboard preview screenshots
│
├── images/                             # Architectural, ERD, and SQL execution screenshots
│   ├── project_architecture.png
│   ├── dashboard_preview.png
│   ├── salespulse_erd.png
│   ├── sql_analysis.png
│   ├── revenue_analysis.png
│   └── data_quality_report.png
│
├── reports/                            # Automated profiling & forensic reports
│   ├── dataset_inspection.txt
│   ├── data_quality_report.txt
│   ├── review_duplicate_investigation.txt
│   └── repository_audit.md
│
└── docs/                               # Formal engineering & analytics documentation
    ├── project_overview.md
    ├── database_schema.md
    ├── sql_analysis_documentation.md
    ├── dashboard_documentation.md
    ├── business_insights.md
    ├── executive_summary.md
    ├── dashboard_walkthrough_script.md
    └── deployment_guide.md
```

---

## 16. Installation & Local Setup

### Prerequisites
- [Git](https://git-scm.com/)
- [PostgreSQL 17](https://www.postgresql.org/download/) or a free [Neon](https://neon.tech/) account
- [Node.js 18+ or 20+](https://nodejs.org/)
- [Python 3.12+](https://www.python.org/)
- [DBeaver Community](https://dbeaver.io/)

### Clone the Repository
```bash
git clone https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics.git
cd SalesPulse-Retail-Business-Analytics
```

### Python Virtual Environment Setup (For ETL Scripts)
```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# macOS / Linux
python3 -m venv venv
source venv/bin/activate

# Install required dependencies
pip install -r requirements.txt
```

---

## 17. Database Setup & Data Ingestion

1. Start your local PostgreSQL service or provision a Neon Serverless instance.
2. Create the `salespulse` database:
   ```sql
   CREATE DATABASE salespulse;
   ```
3. Execute the schema script to create all 9 tables and analytical B-tree indexes:
   ```bash
   psql -U postgres -d salespulse -f database/create_tables.sql
   ```
4. Configure your `.env` file from the provided template:
   ```bash
   cp .env.example .env
   ```
5. Run the automated data quality checks and batch ingestion ETL:
   ```bash
   python python/check_data_quality.py
   python python/investigate_reviews.py
   python python/import_olist_data.py
   ```

---

## 18. Executing SQL Analyses

Connect using DBeaver or run directly via `psql`:

```bash
# 1. Verify all 9 tables and record counts
psql -U postgres -d salespulse -f sql/00_verify_tables.sql

# 2. Foundational aggregate queries (Q1 - Q20)
psql -U postgres -d salespulse -f sql/01_basic_aggregate_analysis.sql

# 3. Joins, CTEs, and customer analytics (Q21 - Q30)
psql -U postgres -d salespulse -f sql/02_joins_and_cte_analysis.sql

# 4. Advanced window functions (Q31 - Q40)
psql -U postgres -d salespulse -f sql/03_window_functions.sql

# 5. Create 4 reusable views and run Pareto 80/20 analysis
psql -U postgres -d salespulse -f sql/04_bonus_views_and_pareto.sql
```

---

## 19. Running the Next.js Dashboard Locally

```bash
# 1. Navigate to dashboard directory
cd salespulse-dashboard

# 2. Copy the environment template
cp .env.example .env.local

# 3. Add your database connection string to .env.local:
# DATABASE_URL=postgresql://user:password@host/salespulse?sslmode=require

# 4. Install dependencies
npm install

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 20. Deploying to Vercel

The dashboard is configured for free-tier deployment on Vercel:

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Import Project**.
3. Select `Awaisbacha55/SalesPulse-Retail-Business-Analytics`.
4. In **Project Settings**, set **Root Directory** to `salespulse-dashboard`.
5. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string (with `?sslmode=require`).
6. Click **Deploy**.

For complete step-by-step instructions and troubleshooting, see [`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## 21. Project Limitations & Future Improvements

- **Historical Time Horizon**: The Olist public dataset covers historical orders from 2016 through 2018; current macroeconomic shifts and currency inflation adjustments are not reflected.
- **Geolocation Cardinality**: `olist_geolocation_dataset.csv` contains multiple coordinate entries per ZIP prefix; aggregating coordinate centroids by prefix optimizes spatial queries.
- **Machine Learning Integration**: Future roadmap includes training XGBoost models to predict delivery delays and forecast customer churn risk.

---

## 22. Author & Credits

- **Author**: Muhammad Awais  
- **GitHub**: [@Awaisbacha55](https://github.com/Awaisbacha55)  
- **Project Repository**: [SalesPulse-Retail-Business-Analytics](https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics)  
- **Demonstration Video**: [YouTube Walkthrough](https://youtu.be/JfchSQo9VEQ)  
- **Dataset Provider**: [Olist](https://www.olist.com/) via [Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)  
- **License**: Licensed under the [MIT License](LICENSE).


## 🎥 Project Demo Video

Watch the complete SalesPulse project demonstration:

[▶️ Watch SalesPulse Demo on YouTube](https://youtu.be/JfchSQo9VEQ)

In this video, I demonstrate the PostgreSQL database, SQL analysis, database relationships, and interactive Metabase dashboard.
