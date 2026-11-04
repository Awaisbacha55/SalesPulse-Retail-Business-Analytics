# SalesPulse — Business Intelligence Dashboard Documentation

## 1. Overview

This document provides technical instructions for configuring, deploying, and maintaining the **SalesPulse Business Intelligence Dashboard**.

The dashboard connects directly to the PostgreSQL 17 `salespulse` relational database and presents real-time operational and commercial analytics. It is illustrated using **Metabase**, but the underlying SQL queries in [`dashboard/dashboard_queries.sql`](../dashboard/dashboard_queries.sql) are 100% ANSI-SQL compatible and can be executed inside **Power BI**, **Tableau**, or **Apache Superset**.

![SalesPulse Dashboard Preview](../images/dashboard_preview.png)
*Figure 1: Metabase Business Intelligence Dashboard for SalesPulse.*

---

## 2. Prerequisites

- **PostgreSQL 17** active and running on `localhost:5432` with the `salespulse` database populated.
- **Java Runtime Environment (JRE 11+)** or **Docker Desktop** installed on the host machine.
- Downloaded Metabase open-source edition (JAR or Docker container).

---

## 3. Local Metabase Setup Guide

### Method A: Running Metabase via Docker (Recommended)

1. Launch a Metabase container attached to the host network:
   ```bash
   docker run -d -p 3000:3000 --name salespulse-metabase metabase/metabase:latest
   ```
2. Navigate to `http://localhost:3000` in your web browser.

### Method B: Running Metabase via Standalone JAR

1. Download `metabase.jar` from [Metabase Official Downloads](https://www.metabase.com/start/oss/).
2. Run the JAR file from your terminal:
   ```bash
   java -jar metabase.jar
   ```
3. Open `http://localhost:3000` once the initialization completes.

---

## 4. Connecting Metabase to the PostgreSQL Database

1. On the initial Metabase welcome screen, complete your administrator profile.
2. Select **Add your data** → **PostgreSQL**.
3. Fill in the connection parameters:
   - **Display Name**: `SalesPulse Production DB`
   - **Host**: `localhost` (or `host.docker.internal` if running inside Docker)
   - **Port**: `5432`
   - **Database Name**: `salespulse`
   - **Database Username**: `postgres`
   - **Database Password**: `[Your local database password]`
   - **Use an SSL connection for your database**: Disabled (for local development)
4. Click **Connect database**. Metabase will sync tables, schema metadata, and foreign key relationships automatically.

---

## 5. Dashboard Cards & Visual Construction

Open the **SalesPulse Dashboard** canvas and assemble the following cards using Native SQL mode:

### 1. KPI Metric: Gross Revenue
- **Query**:
  ```sql
  SELECT ROUND(SUM(payment_value)::NUMERIC, 2) AS total_revenue FROM public.order_payments;
  ```
- **Visualization**: Number Card (Formatted as Currency: Brazilian Real `R$`).

### 2. KPI Metric: Paid Orders
- **Query**:
  ```sql
  SELECT COUNT(DISTINCT order_id) AS total_paid_orders FROM public.order_payments;
  ```
- **Visualization**: Number Card (Integer format).

### 3. KPI Metric: Average Order Value (AOV)
- **Query**:
  ```sql
  WITH order_totals AS (
      SELECT order_id, SUM(payment_value) AS order_total
      FROM public.order_payments
      GROUP BY order_id
  )
  SELECT ROUND(AVG(order_total)::NUMERIC, 2) AS aov FROM order_totals;
  ```
- **Visualization**: Number Card (Currency `R$`).

### 4. KPI Metric: On-Time Delivery Rate (%)
- **Query**:
  ```sql
  WITH delivery_status AS (
      SELECT order_id,
          CASE WHEN order_delivered_customer_date <= order_estimated_delivery_date THEN 1 ELSE 0 END AS on_time
      FROM public.orders
      WHERE order_status = 'delivered'
        AND order_delivered_customer_date IS NOT NULL
        AND order_estimated_delivery_date IS NOT NULL
  )
  SELECT ROUND(SUM(on_time) * 100.0 / COUNT(*), 2) AS on_time_rate FROM delivery_status;
  ```
- **Visualization**: Progress / Gauge / Number Card (Percentage format: `91.89%`).

### 5. Time-Series: Monthly Revenue & Order Velocity
- **Query**: `dashboard/dashboard_queries.sql` (Section 2, Visual 1).
- **Visualization**: Combo Chart (Bar: Monthly Orders, Line: Monthly Revenue).

### 6. Bar Chart: Top 10 Product Categories by Revenue
- **Query**: `dashboard/dashboard_queries.sql` (Section 3, Visual 3).
- **Visualization**: Horizontal Bar Chart (Sorted descending by `total_revenue`).

### 7. Geospatial / Ranked Bar: State Revenue Breakdown
- **Query**: `dashboard/dashboard_queries.sql` (Section 4, Visual 4).
- **Visualization**: Pinned Map / Bar Chart (Ranked by `total_revenue`).

### 8. Donut Chart: Payment Method Distribution
- **Query**: `dashboard/dashboard_queries.sql` (Section 5, Visual 5).
- **Visualization**: Donut / Pie Chart (`payment_type` dimension, `payment_value` metric).

### 9. Comparative Bar: Delivery SLA vs. Customer Review Score
- **Query**: `dashboard/dashboard_queries.sql` (Section 6, Visual 6).
- **Visualization**: Grouped Bar Chart comparing On Time (4.29) vs. Delayed (2.57).

---

## 6. Configuring Interactive Global Dashboard Filters

Metabase allows parameters to bind to multiple cards simultaneously:

1. Click the **Pencil (Edit Dashboard)** icon.
2. Select **Add a Filter** → **Time** → **Date Range**.
   - Connect filter to `o.order_purchase_timestamp` across all time-series queries.
3. Select **Add a Filter** → **Location** → **State or Region**.
   - Connect filter to `c.customer_state` in geographic and order queries.
4. Select **Add a Filter** → **Dropdown** → **Product Category**.
   - Connect filter to `ct.product_category_name_english`.
5. Click **Save**.

---

## 7. Connecting Alternative BI Tools (Power BI / Superset)

- **Power BI Desktop**:
  1. Click **Get Data** → **PostgreSQL database**.
  2. Server: `localhost:5432`, Database: `salespulse`.
  3. Data Connectivity mode: Select **DirectQuery** for live SQL execution or **Import** for in-memory caching.
  4. Paste SQL queries directly from [`dashboard/dashboard_queries.sql`](../dashboard/dashboard_queries.sql).
- **Apache Superset**:
  1. Add Database Connection string: `postgresql://postgres:[password]@localhost:5432/salespulse`.
  2. Use SQL Lab to execute query snippets and click **Explore** to save charts.

---

## 8. Dashboard Sharing & Public Demonstration

- **YouTube Video Walkthrough**: [Watch SalesPulse Demo on YouTube](https://youtu.be/JfchSQo9VEQ)
- **Metabase Public Link**: `[METABASE_PUBLIC_DASHBOARD_URL_PLACEHOLDER]` *(To generate: open Metabase → Dashboard Settings → Sharing and Embedding → Enable Public Link).*
