# SalesPulse — Retail Business Analytics with SQL

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.x-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![DBeaver](https://img.shields.io/badge/DBeaver-Community-382923?logo=dbeaver&logoColor=white)](https://dbeaver.io/)
[![Metabase](https://img.shields.io/badge/Metabase-BI%20Dashboard-509EE3?logo=metabase&logoColor=white)](https://www.metabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![SQL Analytics](https://img.shields.io/badge/SQL%20Analytics-40%2B%20Queries%20%26%20Views-blueviolet)]()

> An enterprise-grade retail business analytics and data engineering project modeling 100,000+ Brazilian e-commerce orders, resolving real-world data quality anomalies, executing 40+ commercial SQL analyses and saved views in PostgreSQL 17, and delivering an interactive executive Business Intelligence dashboard.

## Table of Contents

1. [Project Title](#1-project-title)
2. [Project Overview](#2-project-overview)
3. [Business Problem](#3-business-problem)
4. [Project Objectives](#4-project-objectives)
5. [Dataset Information](#5-dataset-information)
6. [Technology Stack](#6-technology-stack)
7. [System Architecture](#7-system-architecture)
8. [Database Structure and ERD](#8-database-structure-and-erd)
9. [Data Cleaning and Validation Process](#9-data-cleaning-and-validation-process)
10. [SQL Analysis Categories](#10-sql-analysis-categories)
11. [SQL Techniques Used](#11-sql-techniques-used)
12. [Dashboard Preview](#12-dashboard-preview)
13. [Business Insights](#13-business-insights)
14. [Repository Structure](#14-repository-structure)
15. [Installation Instructions](#15-installation-instructions)
16. [Database Setup](#16-database-setup)
17. [How to Run Python Scripts](#17-how-to-run-python-scripts)
18. [How to Execute SQL Analysis](#18-how-to-execute-sql-analysis)
19. [Dashboard Setup](#19-dashboard-setup)
20. [Project Limitations](#20-project-limitations)
21. [Future Improvements](#21-future-improvements)
22. [Author and Project Credits](#22-author-and-project-credits)

---

## 1. Project Title

**SalesPulse — Retail Business Analytics with SQL**  
*A comprehensive retail intelligence data warehouse and analytical platform modeling the Brazilian e-commerce ecosystem.*

---

## 2. Project Overview

**SalesPulse** is an end-to-end data engineering and retail business intelligence solution developed using **PostgreSQL 17**, **Python 3.12**, and **Metabase**. Based on the real-world **Brazilian E-Commerce Public Dataset by Olist**, the project models the full customer transaction lifecycle across **99,441 orders** and **1,547,842 total relational records** placed between 2016 and 2018.

The repository takes raw, unstructured CSV datasets through pre-ingestion profiling, relational schema design, primary key anomaly resolution, batch ETL ingestion, 39 deep diagnostic SQL analyses, and interactive visual dashboards.

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
4. **Interactive BI Dashboards**: Build an executive Metabase dashboard featuring scorecards, time-series velocity trends, geographic penetration maps, and SLA correlation charts.
5. **Actionable Recommendations**: Translate query findings into data-backed strategic interventions for executive management.

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
| **Database** | PostgreSQL | 17.x | Relational schema modeling, ACID transactions, B-tree indexing |
| **SQL Client** | DBeaver Community | 24.x+ | Database administration, query execution, ERD generation |
| **Data Scripting** | Python | 3.12 | Pre-ingestion profiling, data-quality auditing, batch ETL loader |
| **DB Driver** | psycopg2-binary | 2.9.x | High-throughput batch streaming into PostgreSQL |
| **Config Isolation**| python-dotenv | 1.0.x | Secure local environment variable isolation |
| **Business Intel** | Metabase | Latest OSS | Interactive executive dashboard, KPI cards, visual charts |
| **Version Control** | Git / GitHub | Latest | Source code tracking, documentation engineering |

---

## 7. System Architecture

The high-level end-to-end architecture from raw CSV data ingestion to PostgreSQL warehousing and Metabase visual analytics:

![Project Architecture](images/project_architecture.png)

*Figure 1: SalesPulse End-to-End System Architecture.*

---

## 8. Database Structure and ERD

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

## 12. Dashboard Preview

The interactive executive dashboard built in Metabase consolidates commercial KPIs, revenue trajectories, geographic distribution, and operational health:

![Dashboard Preview](images/dashboard_preview.png)

*Figure 5: SalesPulse Interactive Executive Business Intelligence Dashboard.*

---

## 13. Business Insights

The 39 SQL analyses produced five key commercial findings:

![Revenue Analysis](images/revenue_analysis.png)

*Figure 6: Revenue Analytics Execution in DBeaver.*

1. **Delivery Latency Directly Governs Customer Sentiment (The 1.72-Star Penalty)**:
   - On-time delivered orders average **4.29 / 5.0 stars** (88,163 reviews).
   - Delayed orders average **2.57 / 5.0 stars** (7,661 reviews).
   - Package delays trigger a **-1.72 star penalty (-40%)**, proving that logistics execution is the primary driver of negative feedback.
2. **Severe Repeat Purchase Deficit (96.88% One-Time Buyers)**:
   - Out of 96,096 unique customer profiles, only **2,997 customers (3.12%)** made more than one order.
   - **93,099 buyers (96.88%)** made only one purchase, highlighting an untapped opportunity for post-purchase retention marketing.
3. **Geographic Concentration in Southeast Brazil (63.36% in Top 3 States)**:
   - São Paulo (`SP`) alone generates **R\$ 5,202,955.05** (**38.28%** of item merchandise revenue).
   - Combined with Rio de Janeiro (`RJ`, 13.42%) and Minas Gerais (`MG`, 11.66%), the top 3 states capture **63.36%** of all merchandise sales.
4. **Credit Card Dominance and Installment Financing Culture**:
   - Credit cards capture **78.34%** of total payment volume (R\$ 12,542,084.19), followed by Boleto Bancário at **17.92%** (R\$ 2,869,361.27). Customers heavily leverage multi-month installments for higher-priced goods.
5. **Category Power Law Concentration**:
   - Top 5 categories (`health_beauty`, `watches_gifts`, `bed_bath_table`, `sports_leisure`, `computers_accessories`) generate **R\$ 5,400,679.03**, representing nearly **40%** of all item sales across 71 categories.

*For full strategic recommendations and action plans, see [`docs/business_insights.md`](docs/business_insights.md).*

---

## 14. Repository Structure

```
SalesPulse-Retail-Business-Analytics/
│
├── README.md                           # Main repository documentation
├── LICENSE                             # MIT License
├── .gitignore                          # Excludes raw data, credentials, virtualenvs
├── requirements.txt                    # Project Python dependencies
├── .env.example                        # Template for database credentials
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
├── images/
│   ├── project_architecture.png        # System architecture diagram
│   ├── dashboard_preview.png           # Metabase BI dashboard screenshot
│   ├── salespulse_erd.png              # DBeaver Entity-Relationship Diagram
│   ├── sql_analysis.png                # DBeaver SQL query execution screenshot
│   ├── revenue_analysis.png            # DBeaver revenue trends query execution
│   └── data_quality_report.png         # Terminal data quality execution screenshot
│
├── reports/
│   ├── dataset_inspection.txt          # Raw dataset inspection output
│   ├── data_quality_report.txt         # Automated data quality report
│   ├── review_duplicate_investigation.txt # Forensic review anomaly analysis
│   └── repository_audit.md             # Formal repository audit report
│
└── docs/
    ├── project_overview.md             # Business problem, scope, & 6-day roadmap
    ├── database_schema.md              # Complete relational schema documentation
    ├── sql_analysis_documentation.md   # Catalog of all SQL analyses & bonus views
    ├── dashboard_documentation.md      # Metabase setup and visual configuration
    ├── business_insights.md            # Data-backed insights & recommendations
    ├── executive_summary.md            # High-level summary for leadership
    ├── dashboard_walkthrough_script.md # 2-3 minute video walkthrough script
    └── deployment_guide.md             # Free-tier cloud hosting blueprint
```

---

## 15. Installation Instructions

### Prerequisites
- [Git](https://git-scm.com/)
- [PostgreSQL 17](https://www.postgresql.org/download/)
- [Python 3.12+](https://www.python.org/)
- [DBeaver Community](https://dbeaver.io/)

### Clone the Repository
```bash
git clone https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics.git
cd SalesPulse-Retail-Business-Analytics
```

### Python Virtual Environment Setup
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

## 16. Database Setup

1. Start your local PostgreSQL 17 service.
2. Create the `salespulse` database:
   ```sql
   CREATE DATABASE salespulse;
   ```
3. Execute the schema script to create all 9 tables and analytical B-tree indexes:
   ```bash
   psql -U postgres -d salespulse -f database/create_tables.sql
   ```
4. Configure your local `.env` file from the provided template:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to input your local PostgreSQL database credentials.*

---

## 17. How to Run Python Scripts

All scripts are executed from the project root directory:

```bash
# 1. Inspect raw CSV file structures and column names
python python/inspect_dataset.py

# 2. Run automated primary key and missing value audits
python python/check_data_quality.py

# 3. Investigate the duplicate review ID phenomenon
python python/investigate_reviews.py

# 4. Ingest raw CSV data into PostgreSQL tables (batch size: 2,000)
python python/import_olist_data.py
```

---

## 18. How to Execute SQL Analysis

### Via DBeaver:
1. Connect to the `salespulse` database.
2. Open any analysis script from `sql/`:
   - [`sql/00_verify_tables.sql`](sql/00_verify_tables.sql): Schema verification.
   - [`sql/01_basic_aggregate_analysis.sql`](sql/01_basic_aggregate_analysis.sql): Analyses Q1–Q20.
   - [`sql/02_joins_and_cte_analysis.sql`](sql/02_joins_and_cte_analysis.sql): Analyses Q21–Q30.
   - [`sql/03_window_functions.sql`](sql/03_window_functions.sql): Analyses Q31–Q40.
3. Highlight a query and press `Ctrl + Enter` (or `Alt + X` to run the entire script).

### Via `psql` CLI:
```bash
psql -U postgres -d salespulse -f sql/00_verify_tables.sql
psql -U postgres -d salespulse -f sql/01_basic_aggregate_analysis.sql
psql -U postgres -d salespulse -f sql/02_joins_and_cte_analysis.sql
psql -U postgres -d salespulse -f sql/03_window_functions.sql
```

---

## 19. Dashboard Setup

1. Launch Metabase locally via Docker or standalone JAR:
   ```bash
   java -jar metabase.jar
   # Or using Docker:
   docker run -d -p 3000:3000 --name salespulse-metabase metabase/metabase:latest
   ```
2. Navigate to `http://localhost:3000` and connect to the `salespulse` PostgreSQL database.
3. Import or execute the queries from [`dashboard/dashboard_queries.sql`](dashboard/dashboard_queries.sql) to populate dashboard cards.
4. For detailed configuration steps, consult [`docs/dashboard_documentation.md`](docs/dashboard_documentation.md).

---

## 20. Project Limitations

- **Historical Time Horizon**: The Olist public dataset covers historical orders from 2016 through 2018; current macroeconomic shifts and currency inflation adjustments are not reflected.
- **Geolocation Cardinality**: `olist_geolocation_dataset.csv` contains multiple coordinate entries per ZIP prefix; aggregating coordinate centroids by prefix optimizes spatial queries.
- **Inventory Visibility**: Real-time stock levels and merchant replenishment lead times are not recorded in the public dataset.

---

## 21. Future Improvements

- **Predictive Machine Learning**: Train logistic regression and XGBoost models to predict delivery delays and customer review sentiment at checkout.
- **Automated Cloud Data Pipeline**: Build automated ingestion DAGs using Apache Airflow or dbt for continuous incremental transformations.
- **Customer Lifetime Value (CLV) Forecasting**: Implement BG/NBD and Gamma-Gamma probabilistic models to forecast customer lifetime spend.

---

## 22. Author and Project Credits

- **Author**: Muhammad Awais  
- **GitHub**: [@Awaisbacha55](https://github.com/Awaisbacha55)  
- **Project Repository**: [SalesPulse-Retail-Business-Analytics](https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics)  
- **Dataset Provider**: [Olist](https://www.olist.com/) via [Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)  
- **License**: Licensed under the [MIT License](LICENSE).


## 🎥 Project Demo Video

Watch the complete SalesPulse project demonstration:

[▶️ Watch SalesPulse Demo on YouTube](https://youtu.be/JfchSQo9VEQ)

In this video, I demonstrate the PostgreSQL database, SQL analysis, database relationships, and interactive Metabase dashboard.
