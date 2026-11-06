# SalesPulse — Business Intelligence Dashboard Documentation

## 1. Overview

This document provides technical instructions for configuring, deploying, and maintaining the **SalesPulse Business Intelligence Dashboard**.

The dashboard connects directly to the PostgreSQL 17 `salespulse` relational database and presents real-time operational and commercial analytics. It is illustrated using **Metabase**, but the underlying SQL queries in [`dashboard/dashboard_queries.sql`](../dashboard/dashboard_queries.sql) are 100% ANSI-SQL compatible and can be executed inside **Power BI**, **Tableau**, or **Apache Superset**.

![SalesPulse Dashboard Preview](../images/metabase_dashboard.png)
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

In Metabase Native SQL mode, interactive dashboard filters require Field Filter parameters embedded in the underlying SQL queries (available in [`dashboard/dashboard_queries.sql`](../dashboard/dashboard_queries.sql)).

### 1. Filter Field Mappings
- **Date Range Filter**:
  - Variable Name: `date_filter`
  - Variable Type: **Field Filter**
  - Field to map to: `orders.order_purchase_timestamp`
  - Widget Type: Date Range / Date Filter
- **Customer State Filter**:
  - Variable Name: `state_filter`
  - Variable Type: **Field Filter**
  - Field to map to: `customers.customer_state`
  - Widget Type: Dropdown / Multiple Values
- **Product Category Filter**:
  - Variable Name: `category_filter`
  - Variable Type: **Field Filter**
  - Field to map to: `products.product_category_name`
  - Widget Type: Dropdown / Search

### 2. Card Connection Matrix
| Dashboard Card / Question | Date Range (`date_filter`) | Customer State (`state_filter`) | Product Category (`category_filter`) |
| :--- | :---: | :---: | :---: |
| **Total Orders** | Connected | Connected | Optional |
| **Total Customers** | Connected | Connected | No |
| **Merchandise GMV** | Connected | Connected | Connected |
| **Average Order Value (AOV)** | Connected | Connected | Connected |
| **Monthly Revenue Trend** | Connected | Optional | Connected |
| **Monthly Order Volume** | Connected | Optional | Optional |
| **Revenue by State** | Connected | Optional | Connected |
| **Top 10 Product Categories** | Connected | Connected | Connected |
| **Delivery SLA vs Review Score** | Connected | Connected | No |
| **Payment Method Distribution** | Connected | Connected | No |

### 3. Step-by-Step Dashboard Linking Procedure
1. Open the **SalesPulse Dashboard** in Metabase and click the **Pencil (Edit Dashboard)** icon.
2. Click **Add a filter** → **Time** → **Date Range**.
   - In each card's filter mapping dropdown, select `date_filter`.
3. Click **Add a filter** → **Location** → **State or Region**.
   - In each card's filter mapping dropdown, select `state_filter`.
4. Click **Add a filter** → **Other Categories** → **Dropdown** (labeled "Product Category").
   - In each card's filter mapping dropdown, select `category_filter`.
5. Click **Save** to lock in the filter wirings. Test selecting a date range (e.g., Year 2017) or state (e.g., `SP`) to confirm numbers dynamically update across connected tiles.

---

## 7. Connecting Alternative BI Tools (Power BI / Superset)

- **Power BI Desktop**:
  1. Click **Get Data** → **PostgreSQL database**.
  2. Server: `localhost:5432`, Database: `salespulse`.
  3. Data Connectivity mode: Select **DirectQuery** for live SQL execution or **Import** for in-memory caching.
  4. Paste SQL queries directly from [`dashboard/dashboard_queries.sql`](../dashboard/dashboard_queries.sql) (Section 2: Static ANSI-SQL Queries).
- **Apache Superset**:
  1. Add Database Connection string: `postgresql://postgres:[password]@localhost:5432/salespulse`.
  2. Use SQL Lab to execute query snippets and click **Explore** to save charts.

---

## 8. Dashboard Sharing & Public Demonstration

- **Live Published Metabase Dashboard**: [SalesPulse Public Metabase Dashboard](http://51.21.250.3:3000/public/dashboard/a9d2ce25-d3b7-4958-8aeb-a9096cb2770f)
- **YouTube Video Walkthrough**: [Watch SalesPulse Demo on YouTube](https://youtu.be/JfchSQo9VEQ)
