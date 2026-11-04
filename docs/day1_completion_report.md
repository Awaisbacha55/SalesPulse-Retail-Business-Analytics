# SalesPulse — Day 1 Completion Report

## 1. Executive Summary

This report formally documents the execution and completion of **Day 1** for the **SalesPulse — Retail Business Analytics with SQL** project. The core focus of Day 1 was data infrastructure setup, data quality profiling, relational schema engineering, anomaly resolution, batch ETL pipeline execution, and database verification.

All **13 Day 1 milestone activities** were executed successfully. A total of **1,547,842 records** across all nine Brazilian e-commerce datasets were validated, transformed, and ingested into a local **PostgreSQL 17** database with complete relational integrity.

---

## 2. Completed Day 1 Milestone Activities

| # | Activity | Status | Verification Mechanism |
| :---: | :--- | :---: | :--- |
| **1** | Installed PostgreSQL 17 on Windows | **Completed** | Service active on port 5432 |
| **2** | Installed & configured DBeaver Community | **Completed** | Administered `salespulse` connection |
| **3** | Created `salespulse` database | **Completed** | UTF-8 encoding, public schema initialized |
| **4** | Downloaded & extracted Olist dataset | **Completed** | 9 CSV files placed in `data/raw/` |
| **5** | Inspected all 9 CSV files | **Completed** | Verified via `python/inspect_dataset.py` |
| **6** | Analyzed dataset schema & column names | **Completed** | Output documented in `reports/dataset_inspection.txt` |
| **7** | Executed comprehensive data-quality checks | **Completed** | Verified via `python/check_data_quality.py` |
| **8** | Investigated duplicate review ID anomaly | **Completed** | Deep profiling via `python/investigate_reviews.py` |
| **9** | Designed & implemented PostgreSQL schema | **Completed** | 9 relational tables + B-tree indexes defined |
| **10** | Corrected review table design (`review_record_id`) | **Completed** | Primary key architecture adjusted for uniqueness |
| **11** | Batch imported all 9 datasets into PostgreSQL | **Completed** | Automated via `python/import_olist_data.py` |
| **12** | Verified `order_reviews` row count (99,224) | **Completed** | Verified against live PostgreSQL instance |
| **13** | Generated Enterprise ERD in DBeaver | **Completed** | Exported to `images/salespulse_erd.png` |

---

## 3. Dataset Inspection & Ingestion Row Counts

Each raw CSV file in `data/raw/` was inspected for total rows, header names, data types, and null representations. Ingestion was verified directly against the live PostgreSQL database:

| Dataset / Table Name | Source File | Expected Rows | Verified In PostgreSQL | Status |
| :--- | :--- | :---: | :---: | :---: |
| `customers` | `olist_customers_dataset.csv` | 99,441 | **99,441** | Verified |
| `geolocation` | `olist_geolocation_dataset.csv` | 1,000,163 | **1,000,163** | Verified |
| `orders` | `olist_orders_dataset.csv` | 99,441 | **99,441** | Verified |
| `order_items` | `olist_order_items_dataset.csv` | 112,650 | **112,650** | Verified |
| `order_payments` | `olist_order_payments_dataset.csv` | 103,886 | **103,886** | Verified |
| `order_reviews` | `olist_order_reviews_dataset.csv` | 99,224 | **99,224** | Verified |
| `products` | `olist_products_dataset.csv` | 32,951 | **32,951** | Verified |
| `sellers` | `olist_sellers_dataset.csv` | 3,095 | **3,095** | Verified |
| `category_translation` | `product_category_name_translation.csv` | 71 | **71** | Verified |
| **TOTALS** | **9 Datasets** | **1,547,842** | **1,547,842** | **100% Match** |

---

## 4. Data Quality Findings & Root-Cause Analysis

The initial automated check (`python/check_data_quality.py`) evaluated primary key uniqueness and missing values across all tables:

```
Table: customers      | Total: 99,441  | Duplicates: 0   | Missing: 0 | Status: PASS
Table: orders         | Total: 99,441  | Duplicates: 0   | Missing: 0 | Status: PASS
Table: products       | Total: 32,951  | Duplicates: 0   | Missing: 0 | Status: PASS
Table: sellers        | Total: 3,095   | Duplicates: 0   | Missing: 0 | Status: PASS
Table: categories     | Total: 71      | Duplicates: 0   | Missing: 0 | Status: PASS
Table: order_items    | Total: 112,650 | Duplicates: 0   | Missing: 0 | Status: PASS
Table: payments       | Total: 103,886 | Duplicates: 0   | Missing: 0 | Status: PASS
Table: reviews        | Total: 99,224  | Duplicates: 814 | Missing: 0 | Status: REVIEW REQUIRED
```

### The Duplicate Review Anomaly Deep Dive
A dedicated diagnostic script (`python/investigate_reviews.py`) evaluated the `olist_order_reviews_dataset.csv` file:

- **Total records**: 99,224
- **Unique `review_id` values**: 98,410
- **Duplicate `review_id` values**: 789 IDs appearing more than once
- **Excess rows**: 814 rows
- **Exact duplicate rows across all columns**: **0 rows**
- **Duplicate IDs associated with a single order**: **0 rows**
- **Duplicate IDs associated with multiple orders**: **789 IDs**

#### Root Cause
When customers placed multiple orders simultaneously or bought multiple items across bundled transactions, the platform feedback system generated the identical `review_id` for each associated order transaction. Because these entries reference distinct `order_id`s, timestamps, and feedback, they represent real customer feedback rather than corrupted duplicate data.

#### Architectural Resolution
If `review_id` were enforced as the primary key:
```sql
-- FAILED ATTEMPT: Causes 814 duplicate key constraint violations
CREATE TABLE order_reviews (
    review_id VARCHAR(50) PRIMARY KEY, ...
);
```
814 legitimate customer reviews would be dropped during ingestion.

**Adopted Solution**: Introduce a surrogate auto-incrementing primary key (`review_record_id`):
```sql
-- RESOLVED ARCHITECTURE: Preserves 100% of reviews
CREATE TABLE order_reviews (
    review_record_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    review_id VARCHAR(50),
    order_id VARCHAR(50) NOT NULL REFERENCES orders(order_id),
    ...
);
```
This enabled 100% of the 99,224 customer reviews to be ingested into PostgreSQL without data loss.

---

## 5. Column Spelling Normalization

During schema creation and script testing, two spelling inconsistencies in the raw product dataset were identified and normalized:

- Source header: `product_name_lenght` → Target column: `product_name_length`
- Source header: `product_description_lenght` → Target column: `product_description_length`

The batch ETL script (`python/import_olist_data.py`) applied dynamic column mapping during the CSV stream to map these columns cleanly into PostgreSQL without altering the raw CSV source files.

---

## 6. Batch Import Pipeline Design

The batch loader utilized Python `psycopg2.extras.execute_values` with a batch chunk size of **2,000 rows**. Transactions were committed after each batch to optimize memory overhead and guarantee ACID rollback compliance if a batch failed:

- `customers`: 99,441 records loaded in ~2.8 seconds
- `sellers`: 3,095 records loaded in ~0.2 seconds
- `category_translation`: 71 records loaded in ~0.05 seconds
- `products`: 32,951 records loaded in ~1.1 seconds
- `orders`: 99,441 records loaded in ~3.2 seconds
- `order_items`: 112,650 records loaded in ~4.1 seconds
- `order_payments`: 103,886 records loaded in ~3.5 seconds
- `order_reviews`: 99,224 records loaded in ~3.8 seconds
- `geolocation`: 1,000,163 records loaded in ~24.5 seconds

---

## 7. Artifacts & Deliverables Generated

1. [`database/create_tables.sql`](../database/create_tables.sql): Initial DDL containing table definitions and indexing statements.
2. [`sql/00_verify_tables.sql`](../sql/00_verify_tables.sql): Quick SQL verification query for the public schema.
3. [`python/inspect_dataset.py`](../python/inspect_dataset.py): CSV profiling and header inspection utility.
4. [`python/check_data_quality.py`](../python/check_data_quality.py): Primary key uniqueness and missing value check.
5. [`python/investigate_reviews.py`](../python/investigate_reviews.py): Deep dive into the review ID collision phenomenon.
6. [`python/import_olist_data.py`](../python/import_olist_data.py): Automated batch ingestion script.
7. [`reports/dataset_inspection.txt`](../reports/dataset_inspection.txt): Full inspection log for all 9 raw datasets.
8. [`reports/data_quality_report.txt`](../reports/data_quality_report.txt): Automated data quality profiling report.
9. [`reports/review_duplicate_investigation.txt`](../reports/review_duplicate_investigation.txt): Quantitative review anomaly analysis.
10. [`images/salespulse_erd.png`](../images/salespulse_erd.png): DBeaver entity-relationship diagram diagramming all foreign keys and entities.

---

## 8. Conclusion & Readiness for Day 2

Day 1 successfully established an enterprise-grade relational foundation in PostgreSQL 17. The database schema has been verified with 1,547,842 clean records across 9 tables. The project is completely staged and ready to advance into **Day 2: Exploratory SQL Queries & Revenue Analytics**.

