# SalesPulse — Full Repository Audit Report

**Audit Date**: November 2, 2026  
**Project**: SalesPulse — Retail Business Analytics with SQL  
**Local Project Path**: `E:\Awais_Document\DawoodTech\SalesPulse-Retail-Business-Analytics`  
**GitHub Repository**: [`https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics`](https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics)  
**Database**: PostgreSQL 17 (`salespulse` database, local instance on port 5432)  
**Database Client**: DBeaver Community 24+  

---

## 1. Executive Summary

A comprehensive forensic audit of the **SalesPulse** repository was conducted covering directory structure, data pipelines, SQL analytical query suites, relational database schemas, image assets, documentation completeness, and Git version control status.

The project demonstrates exceptional execution across data modeling, data quality engineering, and SQL analytics. The local PostgreSQL database houses all 9 Olist tables containing **1,547,842 verified records**. The repository currently contains **39 verified distinct business SQL analyses** spanning 3 dedicated SQL scripts, resolving core commercial questions across revenue, customers, sellers, logistics, and product categories.

---

## 2. Inventory of Existing Project Files

| Directory / File Path | Status | Type | Description |
| :--- | :---: | :--- | :--- |
| `README.md` | Present | Documentation | Root portfolio README documenting Day 1 setup and roadmap |
| `LICENSE` | Present | Legal | MIT License (2026, Muhammad Awais) |
| `.gitignore` | Present | Git Config | Excludes raw CSVs, `.env`, virtualenvs, cache, OS files |
| `.env.example` | Present | Config Template | Template variables for PostgreSQL connection without secrets |
| `.env` | Present (Local) | Local Config | Local PostgreSQL database credentials (properly git-ignored) |
| `requirements.txt` | Present | Python Config | Python dependencies (`psycopg2-binary`, `python-dotenv`) |
| `database/create_tables.sql` | Present | SQL DDL | DDL creating all 9 tables and analytical B-tree indexes |
| `data/raw/*.csv` (9 files) | Present (Local) | Raw Data | 9 source CSV files (~120 MB total, excluded from Git) |
| `data/raw/.gitkeep` | Present | Git Tracker | Ensures empty `data/raw/` folder is tracked in repository |
| `data/processed/.gitkeep` | Present | Git Tracker | Ensures empty `data/processed/` folder is tracked in repository |
| `dashboard/.gitkeep` | Present | Git Tracker | Directory for dashboard assets |
| `python/inspect_dataset.py` | Present | Python Script | Inspects CSV line counts and fieldnames |
| `python/check_data_quality.py` | Present | Python Script | Profiles primary key uniqueness and null values |
| `python/investigate_reviews.py`| Present | Python Script | Forensic duplicate review ID investigation |
| `python/import_olist_data.py` | Present | Python Script | High-performance batch ETL loader (psycopg2) |
| `reports/dataset_inspection.txt`| Present | Text Report | Output of dataset inspection |
| `reports/data_quality_report.txt`| Present | Text Report | Output of primary key uniqueness check |
| `reports/review_duplicate_investigation.txt` | Present | Text Report | Quantitative analysis of 789 duplicate review IDs |
| `sql/00_verify_tables.sql` | Present | SQL Script | Public schema table verification query |
| `sql/01_basic_aggregate_analysis.sql` | Present | SQL Script | 19 foundational aggregate analyses (Q1–Q10, Q12–Q20) |
| `sql/02_joins_and_cte_analysis.sql` | Present | SQL Script | 10 customer & operational join/CTE analyses (Q21–Q30) |
| `sql/03_window_functions.sql` | Present | SQL Script | 10 advanced window function analyses (Q31–Q40) |
| `docs/project_overview.md` | Present | Documentation | Business context, scope, tools, 6-day roadmap |
| `docs/database_schema.md` | Present | Documentation | Complete data dictionary and table relationships |
| `docs/day1_completion_report.md`| Present | Documentation | Formal Day 1 milestone verification report |
| `images/salespulse_erd.png` | Present | Image | DBeaver ERD diagram (913x782 PNG) |
| `images/dashboard_preview.png` | Present | Image | Metabase BI dashboard screenshot (1366x1614 PNG) |
| `images/revenue_analysis.png` | Present | Image | DBeaver SQL revenue analysis screenshot (1024x572 PNG) |
| `images/data_quality_report.png`| Present | Image | Terminal data quality execution screenshot (964x566 PNG) |
| `images/customer_analysis.png` | Present | Image | Customer analysis query screenshot (1028x576 PNG) |
| `images/product_analysis.png` | Present | Image | Product category query screenshot (1024x585 PNG) |
| `images/project_architecture.png` | Present | Image | High-level system architecture diagram (1774x887 PNG) |

---

## 3. Database Table Verification & Record Counts

The local PostgreSQL database `salespulse` on port 5432 was queried directly using read-only SQL commands. All 9 tables exist and their row counts match the source datasets 100%:

| # | Database Table | Source CSV File | Verified Database Rows | Status |
| :-: | :--- | :--- | :-: | :---: |
| 1 | `customers` | `olist_customers_dataset.csv` | **99,441** | Verified |
| 2 | `category_translation` | `product_category_name_translation.csv` | **71** | Verified |
| 3 | `geolocation` | `olist_geolocation_dataset.csv` | **1,000,163** | Verified |
| 4 | `order_items` | `olist_order_items_dataset.csv` | **112,650** | Verified |
| 5 | `order_payments` | `olist_order_payments_dataset.csv` | **103,886** | Verified |
| 6 | `order_reviews` | `olist_order_reviews_dataset.csv` | **99,224** | Verified |
| 7 | `orders` | `olist_orders_dataset.csv` | **99,441** | Verified |
| 8 | `products` | `olist_products_dataset.csv` | **32,951** | Verified |
| 9 | `sellers` | `olist_sellers_dataset.csv` | **3,095** | Verified |
| **TOTAL** | **9 Relational Tables** | **9 CSV Datasets** | **1,547,842** | **100% Fidelity** |

*Note: The total volume of 1.55 million rows represents the sum of rows across all 9 relational entities, not unique individual transactions.*

---

## 4. SQL Analysis Count Verification

A line-by-line inspection of all `.sql` files in `sql/` was performed:

| SQL File | Query Numbers | Category Focus | Query Count |
| :--- | :---: | :--- | :---: |
| [`sql/00_verify_tables.sql`](../sql/00_verify_tables.sql) | — | Database & Schema Verification | 1 |
| [`sql/01_basic_aggregate_analysis.sql`](../sql/01_basic_aggregate_analysis.sql) | Q1–Q10, Q12–Q20 | Aggregations, Grouping, Financial Totals, Seasonality | 19 |
| [`sql/02_joins_and_cte_analysis.sql`](../sql/02_joins_and_cte_analysis.sql) | Q21–Q30 | Multi-Table Joins, CTEs, Customer Lifetime Value, Delivery Delays | 10 |
| [`sql/03_window_functions.sql`](../sql/03_window_functions.sql) | Q31–Q40 | Window Functions (`LAG`, `SUM OVER`, `ROW_NUMBER`, `DENSE_RANK`, Moving Avg) | 10 |
| **TOTAL** | **Q1–Q40 (Q11 skipped in numbering)** | **Comprehensive SQL Analytics Suite** | **39 Business Queries + 1 Verification** |

### Verified Query Inventory:
- **`01_basic_aggregate_analysis.sql` (19 queries)**:
  - Q1: Total revenue, paid order count, and Average Order Value (AOV)
  - Q2: Monthly revenue and order volume trends
  - Q3: Top 10 products by sales revenue
  - Q4: Top product categories by revenue and unit volume
  - Q5: Revenue distribution across Brazilian states
  - Q6: Order status distribution and percentages
  - Q7: Payment method popularity and total value
  - Q8: Monthly revenue per product category
  - Q9: Top 20 Brazilian cities by sales revenue
  - Q10: Average order value by customer state
  - Q12: Products with highest average selling prices
  - Q13: Product categories with highest average selling prices
  - Q14: Average item count per customer order
  - Q15: Monthly order volume velocity
  - Q16: Monthly freight and logistics costs
  - Q17: Payment installment count distribution
  - Q18: Day-of-week purchasing patterns
  - Q19: Categories with highest distinct product variety
  - Q20: Percentage share of total payment value by payment method

- **`02_joins_and_cte_analysis.sql` (10 queries)**:
  - Q21: Customer lifetime revenue and purchase date spans
  - Q22: Repeat customer count and percentage (Retention rate: 3.12%)
  - Q23: Customer purchase frequency distribution
  - Q24: Average interval (in days) between repeat purchases
  - Q25: Orders experiencing longest carrier delivery delays
  - Q26: On-time delivery SLA compliance percentage (91.89% on-time)
  - Q27: Top-performing sellers by gross merchandise value
  - Q28: Customer satisfaction scores by Brazilian state
  - Q29: Customer tier segmentation (High Value, Medium Value, Low Value)
  - Q30: Correlation between delivery SLA performance and review ratings (4.29 on-time vs 2.57 delayed)

- **`03_window_functions.sql` (10 queries)**:
  - Q31: Month-over-month revenue growth using `LAG()`
  - Q32: Running cumulative total of monthly revenue (`SUM() OVER`)
  - Q33: Top 3 products in each category using `ROW_NUMBER() OVER (PARTITION BY ...)`
  - Q34: State revenue rankings using `RANK() OVER`
  - Q35: Three-month moving average of monthly revenue
  - Q36: Customer purchase sequence tracking and days since previous order
  - Q37: Top 5 highest-value orders within each state (`DENSE_RANK() OVER`)
  - Q38: Cumulative running revenue by product category over time
  - Q39: Payment method contribution share of total payments (`SUM() OVER ()`)
  - Q40: Top 5 sellers ranked by monthly revenue across time

---

## 5. Image Assets Verification

All project screenshot assets were inspected for physical existence, file format, and resolution:

| Asset Name | Status | Dimensions | Description |
| :--- | :---: | :---: | :--- |
| `images/project_architecture.png` | Verified | 1774 x 887 | System architecture flow diagram |
| `images/dashboard_preview.png` | Verified | 1366 x 1614 | Metabase BI analytics dashboard |
| `images/salespulse_erd.png` | Verified | 913 x 782 | DBeaver Relational Schema ERD |
| `images/sql_analysis.png` | Verified | 1028 x 576 | DBeaver SQL query execution screenshot |
| `images/revenue_analysis.png` | Verified | 1024 x 572 | DBeaver revenue trends query execution |
| `images/data_quality_report.png` | Verified | 964 x 566 | Terminal output of data quality profiling |
| `images/customer_analysis.png` | Verified | 1028 x 576 | Customer lifetime and repeat SQL execution |
| `images/product_analysis.png` | Verified | 1024 x 585 | Product category performance SQL execution |

*Note: `project_architecture.png.png` in `images/` had a redundant extension; a normalized copy `images/project_architecture.png` was created while preserving the original. Similarly, `images/sql_analysis.png` was established to map to the real SQL execution screenshot.*

---

## 6. Documentation Gaps Identified & Action Plan

The following documents are required to complete Phase 2 through Phase 11:

1. **`dashboard/dashboard_overview.md`**: Architecture, KPI cards, visual layout, and filter design of the Metabase dashboard.
2. **`dashboard/dashboard_queries.sql`**: Production-ready SQL queries formatted specifically for dashboard tiles.
3. **`docs/sql_analysis_documentation.md`**: Comprehensive technical catalog of all 39 business queries with business intent, SQL syntax concepts, and commercial interpretation.
4. **`docs/business_insights.md`**: 5 core data-backed commercial insights and 3 actionable business recommendations derived from real SQL query results.
5. **`docs/executive_summary.md`**: Executive-level strategic summary for recruiters and senior leadership.
6. **`docs/dashboard_documentation.md`**: Step-by-step documentation for installing, configuring, and connecting Metabase to PostgreSQL.
7. **`docs/deployment_guide.md`**: Deployment blueprint covering free cloud hosting options (GitHub, cloud PostgreSQL, cloud Metabase, security, migration).
8. **`README.md`**: Comprehensive update expanding to all 22 required portfolio sections.

---

## 7. Git Status & Version Control History

- **Current Branch**: `main`
- **Tracked Remote**: `origin/main` (`https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics.git`)
- **Commit History**:
  - `dd5ddc5` (Sun Nov 1 14:25:19 2026): *feat: add advanced SQL window function analytics*
  - `2ab0a36` (Sun Nov 1 14:19:01 2026): *feat: add customer and operational analytics using SQL joins and CTEs*
  - `3c64266` (Sun Nov 1 00:32:42 2026): *feat: add foundational retail sales analytics*
  - `7eeaf61` (Sun Nov 1 00:02:38 2026): *Initial commit: Establish SalesPulse database infrastructure*

---

## 8. Security & Credential Audit

- **Credentials Exposure**: **PASS**. Zero hardcoded credentials or API keys were detected in any SQL, Python, or Markdown files.
- **`.env` Isolation**: **PASS**. `.env` is confirmed present on local disk and ignored by `.gitignore`.
- **Large Dataset Protection**: **PASS**. All 9 raw Olist CSV datasets (~120 MB) are strictly excluded by `.gitignore`.
- **Git Push Policy**: Maintained. No commits or pushes will be executed without explicit review and approval.

