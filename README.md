# SalesPulse — Retail Business Analytics with SQL

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.x-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![DBeaver](https://img.shields.io/badge/DBeaver-Community-382923?logo=dbeaver&logoColor=white)](https://dbeaver.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Project Status](https://img.shields.io/badge/Status-Day%201%20Completed-success)]()

> A retail business analytics project utilizing PostgreSQL 17, Python 3.12, and SQL to model Brazilian e-commerce operations, resolve real-world data quality anomalies, uncover sales and customer trends, and lay the data foundation for business intelligence dashboards.

---

## Table of Contents

- [1. Project Title and Overview](#1-project-title-and-overview)
- [2. Real-World Business Problem](#2-real-world-business-problem)
- [3. Project Objectives](#3-project-objectives)
- [4. Dataset Information and Source](#4-dataset-information-and-source)
- [5. Technologies Used](#5-technologies-used)
- [6. Database Architecture](#6-database-architecture)
- [7. Entity-Relationship Diagram (ERD)](#7-entity-relationship-diagram-erd)
- [8. Database Tables and Relationships](#8-database-tables-and-relationships)
- [9. Data-Quality Investigation](#9-data-quality-investigation)
- [10. Duplicate Review ID Anomaly & Resolution](#10-duplicate-review-id-anomaly--resolution)
- [11. Dataset Inspection and Batch Import Process](#11-dataset-inspection-and-batch-import-process)
- [12. Current Project Progress](#12-current-project-progress)
- [13. Installation & Environment Setup](#13-installation--environment-setup)
- [14. PostgreSQL Database Setup](#14-postgresql-database-setup)
- [15. Python Virtual Environment Setup](#15-python-virtual-environment-setup)
- [16. How to Execute Python Scripts](#16-how-to-execute-python-scripts)
- [17. How to Run SQL Files](#17-how-to-run-sql-files)
- [18. Project Folder Structure](#18-project-folder-structure)
- [19. Planned Dashboard and Analytics Features](#19-planned-dashboard-and-analytics-features)
- [20. Project Limitations and Future Improvements](#20-project-limitations-and-future-improvements)

---

## 1. Project Title and Overview

**SalesPulse** is an end-to-end data engineering and retail business analytics repository focused on uncovering commercial, operational, and customer behavioral patterns within the Brazilian e-commerce sector.

The project models the end-to-end transaction journey: from customer order placement, payment installments, and multi-seller fulfillment to logistics delivery milestones and post-purchase customer satisfaction surveys.

---

## 2. Real-World Business Problem

In multi-sided e-commerce marketplaces such as Olist (which integrates thousands of independent Brazilian merchants with major sales channels), operational complexity presents significant business risks:

- **Delivery Delays Across Vast Geography**: Cross-state logistics in Brazil span extreme distances. Delivery latency severely impacts customer satisfaction ratings.
- **Freight Cost Inefficiencies**: High shipping fees compress seller margins and trigger cart abandonment.
- **Merchant Reliability & Fulfillment SLAs**: Unreliable sellers failing shipping deadlines harm the platform's brand reputation.
- **Customer Churn & Low Repeat Rates**: Understanding repeat purchase frequency and identifying high-value customer segments is critical for sustainable growth.
- **Customer Review Sentiment Gaps**: Negative ratings often stem from logistics bottlenecks rather than defective products; separating these factors is vital for seller remediation.

---

## 3. Project Objectives

1. **Relational Data Architecture**: Transform nine disparate flat CSV datasets into a normalized, high-performance PostgreSQL 17 relational database.
2. **Data Integrity & Anomaly Resolution**: Identify and solve real-world data quality flaws—specifically non-unique natural keys in customer reviews and misspelled attribute headers.
3. **Core Commercial KPIs** *(Planned - Day 2)*: Analyze Gross Merchandise Value (GMV), order volume velocity, Average Order Value (AOV), and payment installment trends.
4. **Customer Behavioral Intelligence** *(Planned - Day 3)*: Compute repeat purchase percentages, geographic concentration, and RFM (Recency, Frequency, Monetary) customer segmentation.
5. **Logistics & Delivery Efficiency** *(Planned - Day 4)*: Measure carrier delivery lead times, quantify estimated vs. actual delivery gaps, and identify logistics choke points.
6. **Product & Seller Analytics** *(Planned - Day 5)*: Determine top revenue-generating categories and correlate merchant response times with customer ratings.
7. **Business Intelligence Reporting** *(Planned - Day 6)*: Deliver an interactive BI dashboard and strategic executive briefing.

---

## 4. Dataset Information and Source

The dataset used is the **Brazilian E-Commerce Public Dataset by Olist**, publicly hosted on Kaggle:
- **Source**: [Kaggle — Brazilian E-Commerce Public Dataset by Olist](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce)
- **Timeframe**: October 2016 to October 2018
- **Coverage**: ~100k anonymized orders placed across all 27 Brazilian federative units.
- **Datasets**: 9 relational CSV files totaling ~1.55 million rows.

---

## 5. Technologies Used

- **Database Engine**: [PostgreSQL 17](https://www.postgresql.org/)
- **Database Client & Administration**: [DBeaver Community 24+](https://dbeaver.io/)
- **Scripting & ETL**: [Python 3.12](https://www.python.org/)
- **Database Driver**: [psycopg2-binary 2.9+](https://pypi.org/project/psycopg2-binary/)
- **Environment Management**: [python-dotenv](https://pypi.org/project/python-dotenv/)
- **Version Control**: Git & GitHub

---

## 6. Database Architecture

The schema follows a hybrid star/snowflake relational architecture centered around the `orders` fact entity, connected to `customers`, `order_items`, `order_payments`, `order_reviews`, `products`, `sellers`, `category_translation`, and `geolocation`.

All primary keys, foreign keys, and analytical B-tree indexes are implemented to guarantee ACID integrity and query performance.

---

## 7. Entity-Relationship Diagram (ERD)

The relational schema and foreign key constraints generated in DBeaver:

![SalesPulse Database Entity-Relationship Diagram](images/salespulse_erd.png)

*Figure 1: SalesPulse PostgreSQL 17 Entity-Relationship Diagram (ERD).*

---

## 8. Database Tables and Relationships

| # | Table Name | Primary Key | Foreign Keys | Row Count | Description |
| :-: | :--- | :--- | :--- | :-: | :--- |
| **1** | `customers` | `customer_id` | — | 99,441 | Unique order-level customer identifier and location |
| **2** | `sellers` | `seller_id` | — | 3,095 | Merchant identifiers, ZIP codes, cities, and states |
| **3** | `category_translation` | `product_category_name` | — | 71 | Portuguese-to-English product category mapping |
| **4** | `products` | `product_id` | — | 32,951 | Product catalog, dimensions, weight, photos count |
| **5** | `orders` | `order_id` | `customer_id` $\rightarrow$ `customers` | 99,441 | Order lifecycle timestamps and delivery status |
| **6** | `order_items` | `(order_id, order_item_id)` | `order_id` $\rightarrow$ `orders`<br>`product_id` $\rightarrow$ `products`<br>`seller_id` $\rightarrow$ `sellers` | 112,650 | Purchased line items, pricing, and freight charges |
| **7** | `order_payments` | `(order_id, payment_sequential)` | `order_id` $\rightarrow$ `orders` | 103,886 | Payment methods, installment counts, and values |
| **8** | `order_reviews` | `review_record_id` *(Surrogate PK)* | `order_id` $\rightarrow$ `orders` | 99,224 | Customer ratings (1-5), review comments, timestamps |
| **9** | `geolocation` | `geolocation_id` *(Identity PK)* | — | 1,000,163 | Brazilian geographic coordinates by ZIP code prefix |

**Total Verified Records in Database**: **1,547,842 rows** (100% matched with raw source data).

---

## 9. Data-Quality Investigation

Before importing any data, an automated data-quality audit was executed using [`python/check_data_quality.py`](python/check_data_quality.py). 

The audit evaluated:
1. **Primary Key Uniqueness**: Verified that candidate key combinations contained zero duplicate values.
2. **Missing Identifiers**: Verified that required primary key fields contained zero null or blank strings.

### Key Findings
- **8 out of 9 tables passed without issues**: `customers`, `orders`, `products`, `sellers`, `category_translation`, `order_items`, and `order_payments` exhibited 100% unique primary keys and 0 missing values.
- **An anomaly was identified in the reviews dataset**: The candidate natural key `review_id` contained 814 duplicate rows across 99,224 records, requiring detailed forensic investigation.

---

## 10. Duplicate Review ID Anomaly & Resolution

A dedicated diagnostic script, [`python/investigate_reviews.py`](python/investigate_reviews.py), was executed to inspect `olist_order_reviews_dataset.csv`.

### Quantitative Findings
- Total review records: **99,224**
- Unique `review_id` values: **98,410**
- `review_id` values occurring more than once: **789**
- Total excess duplicate rows: **814**
- **Exact duplicate rows across all columns**: **0**
- Duplicate IDs associated with a single order: **0**
- Duplicate IDs associated with multiple distinct orders: **789**

### Root Cause Analysis
In the Olist platform, when a buyer places a multi-item purchase or orders from multiple sellers in one session, the review system assigns the identical `review_id` to each individual order survey. Because each record points to a distinct `order_id` and has its own review timestamp, these records represent **valid customer feedback**, not corrupted duplicates.

### Architectural Solution
Using `review_id` as the table's primary key would cause PostgreSQL to reject 814 legitimate reviews due to primary key violations.

**The Solution**:
Introduced a surrogate auto-incrementing primary key (`review_record_id BIGINT GENERATED ALWAYS AS IDENTITY`), retaining `review_id` as an informational attribute:

```sql
CREATE TABLE IF NOT EXISTS order_reviews (
    review_record_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    review_id VARCHAR(50),
    order_id VARCHAR(50) NOT NULL,
    review_score INTEGER,
    review_comment_title TEXT,
    review_comment_message TEXT,
    review_creation_date TIMESTAMP,
    review_answer_timestamp TIMESTAMP,

    CONSTRAINT fk_reviews_orders
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id),

    CONSTRAINT chk_review_score
        CHECK (review_score BETWEEN 1 AND 5)
);
```

This structural correction allowed all **99,224** review records to be imported with 100% data preservation and strict relational integrity.

---

## 11. Dataset Inspection and Batch Import Process

### Dynamic Header Normalization
During inspection ([`python/inspect_dataset.py`](python/inspect_dataset.py)), two typos were detected in the raw products CSV:
- `product_name_lenght` $\rightarrow$ normalized to `product_name_length`
- `product_description_lenght` $\rightarrow$ normalized to `product_description_length`

The batch loader dynamically maps these column headers during the ingestion stream.

### Batch ETL Pipeline
The ingestion pipeline ([`python/import_olist_data.py`](python/import_olist_data.py)) utilizes `psycopg2.extras.execute_values` with a batch size of **2,000 rows**. Empty string fields are parsed as SQL `NULL` values.

```
Importing olist_customers_dataset.csv -> customers: 99,441 rows
Importing olist_sellers_dataset.csv -> sellers: 3,095 rows
Importing product_category_name_translation.csv -> category_translation: 71 rows
Importing olist_products_dataset.csv -> products: 32,951 rows
Importing olist_orders_dataset.csv -> orders: 99,441 rows
Importing olist_order_items_dataset.csv -> order_items: 112,650 rows
Importing olist_order_payments_dataset.csv -> order_payments: 103,886 rows
Importing olist_order_reviews_dataset.csv -> order_reviews: 99,224 rows
Importing olist_geolocation_dataset.csv -> geolocation: 1,000,163 rows
Total Ingested Records: 1,547,842 rows
```

---

## 12. Current Project Progress

| Phase | Milestone | Status | Details |
| :---: | :--- | :---: | :--- |
| **Day 1** | **Database Architecture & Data Ingestion** | **COMPLETED** | PostgreSQL 17 configured, data-quality profiling, review PK resolution, 1.55M rows loaded, ERD generated. |
| **Day 2** | **Core Business Metrics & Revenue Analytics** | Planned | SQL queries for GMV, monthly trends, AOV, payment splits. |
| **Day 3** | **Customer Segmentation & RFM Modeling** | Planned | Customer repeat purchase rates, cohort analysis, RFM segmentation. |
| **Day 4** | **Logistics & Delivery SLA Performance** | Planned | Estimated vs. actual delivery gap, carrier latency, freight analysis. |
| **Day 5** | **Product Category & Seller Merchandising** | Planned | Top-selling categories, return rates, seller fulfillment scoring. |
| **Day 6** | **Interactive BI Dashboard & Executive Briefing** | Planned | Metabase / Power BI dashboard and final portfolio presentation. |

---

## 13. Installation & Environment Setup

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

---

## 14. PostgreSQL Database Setup

1. Start your local PostgreSQL service.
2. Launch `psql` or DBeaver and create the `salespulse` database:
   ```sql
   CREATE DATABASE salespulse;
   ```
3. Execute the schema creation script to build the tables and indexes:
   ```bash
   psql -U postgres -d salespulse -f database/create_tables.sql
   ```

---

## 15. Python Virtual Environment Setup

1. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install project dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to configure your local PostgreSQL database credentials.*

---

## 16. How to Execute Existing Python Scripts

All scripts run from the project root directory:

```bash
# 1. Inspect raw CSV file structures and column names
python python/inspect_dataset.py

# 2. Run automated primary key and missing value checks
python python/check_data_quality.py

# 3. Investigate the duplicate review ID anomaly
python python/investigate_reviews.py

# 4. Ingest raw CSV data into PostgreSQL tables
python python/import_olist_data.py
```

---

## 17. How to Run SQL Files

### Via DBeaver:
1. Connect to the `salespulse` database.
2. Open [`sql/00_verify_tables.sql`](sql/00_verify_tables.sql).
3. Press `Alt + X` to execute the script.

### Via `psql` CLI:
```bash
psql -U postgres -d salespulse -f sql/00_verify_tables.sql
```

Expected output:
```
       table_name       
------------------------
 category_translation
 customers
 geolocation
 order_items
 order_payments
 order_reviews
 orders
 products
 sellers
(9 rows)
```

---

## 18. Project Folder Structure

```
SalesPulse-Retail-Business-Analytics/
│
├── README.md                           # Main repository overview and documentation
├── .gitignore                          # Excludes raw data, secrets, environments
├── .env.example                        # Template for database credentials
├── requirements.txt                    # Python dependencies
├── LICENSE                             # MIT License
│
├── database/
│   └── create_tables.sql               # PostgreSQL DDL and index creation script
│
├── data/
│   ├── raw/                            # Directory for source CSV files (git-ignored)
│   └── processed/                      # Directory for cleaned datasets (git-ignored)
│
├── python/
│   ├── inspect_dataset.py              # CSV profiling and structure inspection
│   ├── check_data_quality.py           # Primary key & missing value validator
│   ├── investigate_reviews.py          # Detailed duplicate review ID diagnostic
│   └── import_olist_data.py            # High-performance batch ETL ingestion script
│
├── sql/
│   └── 00_verify_tables.sql            # Verification query for database tables
│
├── reports/
│   ├── dataset_inspection.txt          # Raw dataset inspection output
│   ├── data_quality_report.txt         # Automated data quality report
│   └── review_duplicate_investigation.txt # Forensic review anomaly analysis
│
├── images/
│   └── salespulse_erd.png              # DBeaver-generated Entity-Relationship Diagram
│
├── dashboard/                          # Staging directory for future BI assets (Day 6)
│
└── docs/
    ├── project_overview.md             # In-depth business context and 6-day roadmap
    ├── database_schema.md              # Detailed schema specifications and dictionary
    └── day1_completion_report.md       # Formal Day 1 milestone verification report
```

---

## 19. Planned Dashboard and Analytics Features

The upcoming phases will build on this relational foundation:
- **Executive KPI Dashboard**: Real-time sales velocity, cumulative revenue trends, and dynamic geographic filters.
- **Logistics Health Matrix**: Carrier delivery SLA compliance tracking and shipping fee vs. distance elasticity.
- **Customer RFM Segmentation**: Categorizing buyers into Champions, Loyal Customers, At Risk, and Lost segments.
- **Product Profitability & Review Drivers**: Pinpointing categories with high order volume but low review satisfaction.

---

## 20. Project Limitations and Future Improvements

- **Historical Snapshot**: The Olist public dataset covers historical orders from 2016 through 2018; current macroeconomic shifts and currency inflation adjustments are not represented.
- **Geolocation Cardinality**: The `olist_geolocation_dataset.csv` contains 1,000,163 coordinate entries with duplicate ZIP code prefixes. Planned improvements include aggregating coordinate centroids by ZIP prefix.
- **Stock & Inventory**: The public dataset does not capture merchant inventory replenishment intervals or out-of-stock events.

---

## Author & Acknowledgments

- **Author**: Muhammad Awais
- **Dataset**: Provided by [Olist](https://www.olist.com/) via [Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce).
- **License**: This project is licensed under the [MIT License](LICENSE).

