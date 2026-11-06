# SalesPulse — Executive Summary

## 1. Project Overview

**SalesPulse** is an enterprise data engineering and business analytics platform built on the real-world Brazilian e-commerce transaction dataset provided by Olist. The project establishes a robust relational data warehouse in **PostgreSQL 17**, validates and cleans **1,547,842 records** across nine relational entities, executes **40+ commercial SQL analyses and saved views**, and visualizes key findings through an interactive **Metabase Business Intelligence Dashboard**.

The primary objective is to evaluate commercial scale, uncover customer behavioral bottlenecks, diagnose logistics delivery SLAs, and provide data-driven strategic interventions for e-commerce executive leadership.

---

## 2. Key Business Metrics & KPI Definitions

### Master KPI Definitions & Status Scope
To eliminate ambiguity across commercial, financial, and logistics reporting, SalesPulse enforces strict definitional and population boundaries:

1. **Total Placed Orders (`99,441` orders)**: Represents all customer transactions registered in `orders` across all 8 lifecycle statuses: `delivered` (96,478, 97.02%), `shipped` (1,107, 1.11%), `canceled` (625, 0.63%), `unavailable` (609, 0.61%), `invoiced` (314, 0.32%), `processing` (301, 0.30%), `created` (5, 0.01%), and `approved` (2, 0.00%).
2. **Total Delivered Orders (`96,478` orders)**: Represents successfully fulfilled and delivered shipments (`order_status = 'delivered'`), accounting for 97.02% of all placed orders.
3. **Merchandise GMV (`R$ 13,591,643.70`)**: Calculated strictly as `SUM(order_items.price)`, representing pure item sales revenue excluding logistics freight. It encompasses all 112,650 line items across 98,666 item-containing orders, including delivered items (R$ 13.22M, 97.28%), shipped items (R$ 150.7k), canceled items (R$ 95.2k), invoiced items (R$ 61.5k), and processing items (R$ 60.4k). *(Note: when filtered to complete operating months `< '2018-09-01'`, GMV is R$ 13,591,498.70, reflecting 1 shipped order of R$ 145.00 in September 2018).*
4. **Delivered Payment Revenue (`R$ 15,422,461.77`)**: Calculated as `SUM(order_payments.payment_value)` where `orders.order_status = 'delivered'`. Represents realized customer cash collections (item price + freight fees) on fulfilled orders. Distinct from total platform payment volume across all statuses (`R$ 16,008,872.12`).
5. **Average Order Value (AOV)**: Calculated with strictly matching numerators and denominators:
   - **Merchandise AOV (Pure Basket Size)**:
\[
\text{Merchandise AOV} =
\frac{13,591,643.70}{98,666}
= 137.75
\]
   - **Delivered Merchandise AOV**:
\[
\text{Delivered Merchandise AOV} =
\frac{13,221,498.11}{96,478}
= 137.04
\]
   - **Delivered Payment AOV**:
\[
\text{Delivered Payment AOV} =
\frac{15,422,461.77}{96,477}
= 159.86
\]
   - **Gross Payment AOV (Q1)**:
\[
\text{Gross Payment AOV} =
\frac{16,008,872.12}{99,440}
= 160.99
\]
6. **Total Unique Customers (`96,096` individuals)**: Count of distinct human consumers (`COUNT(DISTINCT customer_unique_id)`). Distinct from order-level customer tokens (`customer_id`, 99,441 records), which represent individual purchase sessions.

### Executive KPI Summary Table

| Strategic Metric | Value | Business Definition & Scope | Primary SQL Table / View |
| :--- | :---: | :--- | :--- |
| **Gross Payment Volume** | **R\$ 16,008,872.12** | Total payment tender processed (items + freight + installments) across all 99,440 paid orders | `order_payments` |
| **Delivered Payment Revenue** | **R\$ 15,422,461.77** | Realized customer cash collections on fulfilled orders (`order_status = 'delivered'`) | `order_payments` / `orders` |
| **Merchandise GMV** | **R\$ 13,591,643.70** | Pure product sales value across all 112,650 line items (excl. freight) | `order_items` |
| **Total Placed Orders** | **99,441** | Commercial orders placed across all 8 lifecycle statuses (96,478 delivered, 97.02%) | `orders` |
| **Delivered Orders** | **96,478** | Completed orders delivered to customer doorsteps | `orders` (`delivered`) |
| **Merchandise Basket AOV** | **R\$ 137.75** | Average product spend per item-containing order (R\$ 13,591,643.70 / 98,666 orders) | `order_items` |
| **Delivered Payment AOV** | **R\$ 159.86** | Average cash collected per delivered order (R\$ 15,422,461.77 / 96,477 orders) | `order_payments` / `orders` |
| **Unique Customer Buyers** | **96,096** | Distinct human individuals (`customer_unique_id`) across 99,441 order sessions | `customers` |
| **Customer Retention Rate** | **3.12%** | Proportion of unique buyers making 2 or more orders (2,997 / 96,096) | `customers` / `orders` |
| **On-Time Delivery SLA Rate** | **91.89%** | Deliveries fulfilled on or before estimated date (88,649 / 96,470 evaluated deliveries) | `v_delivery_sla_performance` |
| **Average On-Time Review Score** | **4.29 / 5.0** | Satisfaction rating when shipments arrive on schedule (88,163 reviews) | `order_reviews` / `orders` |
| **Average Delayed Review Score** | **2.57 / 5.0** | Severe -1.72 star penalty (-40.1%) observed on delayed orders (7,661 reviews) | `order_reviews` / `orders` |
| **Top 3 States Revenue Share** | **63.36%** | Regional GMV concentration across Southeast corridor (`SP`, `RJ`, and `MG`) | `customers` / `order_items` |
| **Product Pareto Concentration** | **25.91%** | Proportion of active product catalog (8,536 / 32,951 SKUs) generating 80.00% of GMV | Bonus Q41 (Pareto) |
| **Credit Card Transaction Share** | **73.92%** | Dominant payment tender method across marketplace checkouts (76,795 / 103,886 payments) | `order_payments` (Q7 / Q20) |

---

## 3. Five Core Data-Backed Business Insights

### 1. Delivery Latency Strongly Correlates with Customer Review Score Reductions
- **Numerical Finding**: Across 95,824 delivered orders with customer review submissions, on-time orders (88,163 orders, 92.01%) achieved a high average rating of **4.29 / 5.0 stars**. In sharp contrast, delayed orders (7,661 orders, 7.99%) dropped to an average rating of **2.57 / 5.0 stars**, representing a measurable decline of **-1.72 stars (-40.1%)**. Across all 96,470 evaluated deliveries, the overall on-time delivery SLA rate was **91.89%** (88,644 orders), leaving an **8.11% delay rate** (7,826 orders).
- **Business Interpretation**: The data demonstrates a strong empirical correlation between delivery delays and lower customer review scores. Delayed orders exhibit a 40.1% lower average rating than on-time orders, indicating that fulfillment punctuality is a primary factor associated with buyer satisfaction. A key operational hypothesis is that carrier delays represent a leading contributor to low customer review scores, making proactive delivery management a high-priority area for sentiment protection.
- **Source Query / View**: `sql/02_joins_and_cte_analysis.sql` (Analysis Q26 & Q30) and `public.v_delivery_sla_performance`.

---

### 2. High Customer Acquisition Scale Accompanied by Low Retention (96.88% One-Time Buyers)
- **Numerical Finding**: Out of **96,096 unique customer profiles** (`customer_unique_id`), **93,099 customers (96.88%) purchased only once**. Only **2,997 customers (3.12%)** placed a second order. Customers making three or more purchases accounted for just **263 individuals (0.27%)**. For the repeat buyer cohort, the average interval between consecutive orders was **86.4 days**.
- **Business Interpretation**: The high proportion of single-order customers indicates that the marketplace has operated primarily through top-of-funnel customer acquisition rather than recurring customer retention. This pattern suggests that customer lifetime value remains largely unrealized after initial conversion, and marketing efficiency would likely benefit from structured post-purchase re-engagement initiatives tailored to the observed 86.4-day repurchase window.
- **Source Query / View**: `sql/02_joins_and_cte_analysis.sql` (Analysis Q21, Q22, Q23 & Q24) and `public.v_customer_lifetime_metrics`.

---

### 3. Geographic Revenue Concentration in Southeast Brazil (63.36% across Top 3 States)
- **Numerical Finding**: Commercial revenue is geographically concentrated in Brazil's Southeast economic corridor. The state of São Paulo (`SP`) alone generated **R\$ 5,202,955.05** in merchandise sales (**38.28%** of total item revenue across 41,375 orders). Combined with Rio de Janeiro (`RJ`, R\$ 1,824,092.67, **13.42%**) and Minas Gerais (`MG`, R\$ 1,585,308.03, **11.66%**), the top three states account for **63.36%** of all merchandise sales. Average delivery times in São Paulo are **8.8 days**, compared to **24 to 29 days** in distant northern states (such as Roraima at 29.4 days, Amapá at 27.2 days, and Amazonas at 26.4 days).
- **Business Interpretation**: Commercial revenue strongly aligns with regional logistics density and geographic proximity to seller hubs. The substantial transit disparity between the Southeast (8.8 days) and the North/Northeast (24–29 days) suggests that delivery lead times and freight friction are plausible factors constraining customer demand and order volume outside the primary economic corridor.
- **Source Query / View**: `sql/03_window_functions.sql` (Analysis Q34) and `sql/01_basic_aggregate_analysis.sql` (Analysis Q10).

---

### 4. Product Catalog Pareto Distribution (25.91% of SKUs Generate 80.00% of Revenue)
- **Numerical Finding**: Applying the Pareto (80/20) principle across the active product catalog demonstrates that out of **32,951 distinct products sold**, the top **8,536 products (25.91%)** generate **80.00% of total cumulative merchandise revenue (R\$ 10,873,463.56)**. The remaining 24,415 products (74.09% of the catalog) account for the remaining 20.00% of sales.
- **Business Interpretation**: The active product catalog exhibits a pronounced Pareto distribution, with approximately one quarter of items generating four-fifths of total revenue. This concentration indicates that merchandising focus, inventory buffering, supplier performance monitoring, and promotional campaigns are likely to yield the highest operational return when targeted at these top ~8,500 core SKUs.
- **Source Query / View**: `sql/04_bonus_views_and_pareto.sql` (Bonus Analysis Q41) and `public.v_category_performance`.

---

### 5. Credit Card Dominance and Multi-Month Installment Financing (73.92% of Payments)
- **Numerical Finding**: Payment method analysis across 103,886 payment transactions reveals that **credit cards represent 76,795 transactions (73.92%)** and account for **R\$ 12,542,084.19 (78.34% of total monetary value)**. Boleto Bancário is the second-largest payment channel with **19,784 transactions (19.04%)** and **R\$ 2,869,361.27 (17.92%)**, followed by vouchers (5.56%) and debit cards (1.47%). Furthermore, **over 52% of credit card transactions are financed across multi-month installments** (ranging from 2 to 24 months).
- **Business Interpretation**: The high adoption of credit cards (73.92% of payments) and installment plans (used in over 52% of credit transactions) demonstrates that flexible payment scheduling is an integral component of Brazilian consumer purchasing behavior. Maintaining seamless installment options at checkout and rapid digital Boleto validation represents a strategic hypothesis for minimizing checkout abandonment.
- **Source Query / View**: `sql/01_basic_aggregate_analysis.sql` (Analysis Q7, Q17 & Q20) and `public.v_monthly_revenue_kpis`.

---

## 4. Technical Stack & Analytical Deliverables

- **Database Engine**: PostgreSQL 17 (Enterprise relational schema modeling, 9 normalized tables, foreign key constraints, and analytical B-tree indexing).
- **Data Pipeline**: Python 3.12 batch ETL loader (`psycopg2-binary`) streaming records at 2,000 rows/batch with dynamic header normalization.
- **Relational Integrity Resolution**: Introduced a synthetic surrogate primary key (`review_record_id BIGINT GENERATED ALWAYS AS IDENTITY`) resolving 789 duplicate review IDs without discarding 814 legitimate customer evaluations.
- **SQL Analysis Suite**: 40+ production SQL analyses spanning multi-table joins, modular CTEs, window functions (`LAG`, `ROW_NUMBER`, `RANK`, `DENSE_RANK`, running totals, rolling moving averages), and 4 reusable analytical views.
- **Business Intelligence**: Interactive Metabase executive dashboard with date and geographic filters, backed by an ERD, query catalog, and video demonstration.

---

## 5. Three Actionable Business Recommendations

### Recommendation 1: Deploy Proactive Logistics Delay Triggers and Regional Carrier Reallocation
- **Connected Insights**: **Insight 1** (Delivery SLA correlation) and **Insight 3** (Regional transit disparity).
- **Business Context**: Delayed deliveries correlate with a 1.72-star reduction in customer review ratings, while transit times to northern states (24–29 days) are substantially longer than in the Southeast (8.8 days).
- **Actionable Steps**:
  1. **Automated Delay Warnings**: Integrate carrier tracking API webhooks to detect in-transit package slippage 48 hours prior to the estimated SLA delivery date. Automatically notify customers via SMS/email with a proactive status update and a courtesy credit (e.g., R\$ 15 coupon) *before* the package is officially late.
  2. **Regional Carrier Diversification**: Contract specialized regional 3PL carriers for shipping lanes between the Southeast and North/Northeast to replace underperforming transit routes.
  3. **Realistic Dynamic SLAs**: Update checkout delivery estimations to incorporate state-specific transit historical averages, aligning customer expectations with empirical delivery lead times in distant geographies.

---

### Recommendation 2: Implement an Automated Lifecycle Re-engagement & Retention Engine
- **Connected Insights**: **Insight 2** (96.88% one-time buyer pattern), **Insight 4** (Product Pareto concentration), and **Insight 5** (Installment financing habits).
- **Business Context**: With 96.88% of buyers currently purchasing only once and repeat purchases averaging an 86.4-day interval, structured post-purchase retention represents an underutilized lever for growing customer lifetime value.
- **Actionable Steps**:
  1. **Timed Replenishment Flows**: Launch automated email and WhatsApp re-engagement campaigns scheduled between Day 45 and Day 70 post-purchase for consumable categories (`health_beauty`, `perfumery`), engaging customers prior to the observed 86.4-day average repurchase window.
  2. **Pareto Cross-Sell Recommendations**: Embed high-converting items from the top 25.91% Pareto catalog into order confirmation receipts and post-delivery follow-ups, pairing complementary items (e.g., bedding accessories with furniture).
  3. **High-Value Loyalty Program**: Create a dedicated VIP tier for customers who spend over R\$ 500 in lifetime value (the High Value customer tier identified in SQL Analysis Q29), providing free shipping vouchers and flexible installment incentives to lift repeat rates from 3.12% toward 6.0%.

---

### Recommendation 3: Establish Localized Micro-Fulfillment Hubs for Top-Velocity Pareto SKUs
- **Connected Insights**: **Insight 3** (Southeast generates 63.36% of sales), **Insight 4** (25.91% of SKUs generate 80% of revenue), and **Insight 1** (Delivery SLA compliance).
- **Business Context**: 63.36% of merchandise sales originate from customers in São Paulo, Rio de Janeiro, and Minas Gerais. Centralizing fulfillment for top-selling SKUs in this high-density corridor addresses the primary customer base directly.
- **Actionable Steps**:
  1. **Consignment Micro-Warehouses**: Partner with top marketplace merchants to pre-position inventory for the top 8,536 Pareto SKUs (Insight 4) in centralized micro-fulfillment centers located in Greater São Paulo and Rio de Janeiro.
  2. **Fast-Shipping Listing Badges**: Offer a guaranteed 24-to-48-hour delivery badge for listings fulfilled from these hubs, driving higher search visibility and increasing checkout conversion.
  3. **Transit and SLA Optimization**: Forward-stocking top products in the primary consumer region is expected to compress fulfillment lead times, lower transit expenses, and help sustain high customer review ratings above 4.3 stars.
