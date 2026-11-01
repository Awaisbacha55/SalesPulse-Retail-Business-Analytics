# SalesPulse — SQL Analysis Documentation

## 1. Overview and Analysis Inventory

The SalesPulse analytical engine comprises **39 verified distinct business analyses** across three structured SQL scripts, plus 1 relational verification query (40 SQL queries in total).

| Script File | Query Range | Focus Area | Query Count |
| :--- | :---: | :--- | :---: |
| [`sql/00_verify_tables.sql`](../sql/00_verify_tables.sql) | — | Public schema table verification | 1 |
| [`sql/01_basic_aggregate_analysis.sql`](../sql/01_basic_aggregate_analysis.sql) | Q1–Q10, Q12–Q20 | Aggregations, Grouping, Financial Totals, Seasonality | 19 |
| [`sql/02_joins_and_cte_analysis.sql`](../sql/02_joins_and_cte_analysis.sql) | Q21–Q30 | Multi-Table Joins, CTEs, Customer Lifetime Value, Delivery Delays | 10 |
| [`sql/03_window_functions.sql`](../sql/03_window_functions.sql) | Q31–Q40 | Window Functions (`LAG`, `SUM OVER`, `ROW_NUMBER`, `DENSE_RANK`, Moving Avg) | 10 |
| **TOTAL** | **Q1–Q40** | **Comprehensive Business Intelligence Suite** | **39 Analyses + 1 Verification** |

*Note: In `sql/01_basic_aggregate_analysis.sql`, query numbering advances from Question 10 to Question 12 (Question 11 is not present). The actual count of unique business analyses is exactly 39.*

---

## 2. Revenue and Sales Analysis

### Analysis Q1: Total Revenue, Paid Orders, and Average Order Value (AOV)
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: What are the total revenue, paid order count, and average order value across the historical platform lifespan?
- **SQL Techniques**: Common Table Expression (CTE), `SUM()`, `COUNT(*)`, `AVG()`, numeric casting and rounding.
- **Tables Involved**: `order_payments`
- **Business Interpretation**: Identifies baseline commercial scale: **R\$ 16,008,872.12** in gross payment value, **99,440** paid orders, and an Average Order Value of **R\$ 160.99**. Serves as the North Star financial metric for the platform.

### Analysis Q2: Monthly Revenue Velocity and Order Trajectory
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: How much revenue did the business generate each month, and how did order volume evolve?
- **SQL Techniques**: `DATE_TRUNC('month', ...)`, `INNER JOIN`, `GROUP BY`, `ORDER BY`.
- **Tables Involved**: `orders`, `order_payments`
- **Business Interpretation**: Pinpoints monthly growth trajectory from nascent 2016 operations to maturity in mid-2018. Highlights seasonal demand peaks such as Black Friday in November 2017 (R\$ 1.19M).

### Analysis Q5: Geographic Revenue Distribution by Brazilian State
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: Which Brazilian states generate the highest merchandise sales revenue?
- **SQL Techniques**: Multi-table `INNER JOIN`, `GROUP BY`, aggregated `SUM()` and `AVG()`.
- **Tables Involved**: `orders`, `customers`, `order_items`
- **Business Interpretation**: Reveals extreme regional concentration. São Paulo (`SP`) leads with **R\$ 5,202,955.05** (38.28% of merchandise revenue), followed by Rio de Janeiro (`RJ`) with 13.42% and Minas Gerais (`MG`) with 11.66%. The top 3 Southeast states generate over 63% of all merchandise sales.

### Analysis Q9: Top 20 Brazilian Cities by Sales Revenue
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: Which specific municipalities drive the largest share of commercial sales?
- **SQL Techniques**: Multi-level `GROUP BY`, `SUM()`, `LIMIT 20`.
- **Tables Involved**: `orders`, `customers`, `order_items`
- **Business Interpretation**: Breaks state totals down into municipal commercial hubs. São Paulo city, Rio de Janeiro city, and Belo Horizonte emerge as top metropolitan centers for targeted marketing and localized fulfillment centers.

### Analysis Q10: Average Order Value by Customer State
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: How does customer purchasing power (AOV) vary across different Brazilian states?
- **SQL Techniques**: CTE for order item aggregation, outer aggregation with `AVG()`.
- **Tables Involved**: `orders`, `customers`, `order_items`
- **Business Interpretation**: Demonstrates that while high-volume states (like `SP`) exhibit moderate AOVs, smaller northern and northeastern states (such as Paraíba `PB`, Acre `AC`, and Roraima `RR`) have significantly higher average ticket sizes, driven by premium bundled orders offsetting high regional freight.

### Analysis Q15: Monthly Order Volume Velocity
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: What is the monthly trajectory of completed customer orders?
- **SQL Techniques**: `DATE_TRUNC()`, `COUNT(*)`, chronological ordering.
- **Tables Involved**: `orders`
- **Business Interpretation**: Tracks transaction volume expansion independent of currency inflation or product price changes, providing a pure measure of platform operational throughput.

### Analysis Q18: Day-of-Week Purchasing Patterns
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: Which days of the week generate the most customer orders?
- **SQL Techniques**: `TO_CHAR()`, `EXTRACT(DOW FROM ...)`, `COUNT(*)`.
- **Tables Involved**: `orders`
- **Business Interpretation**: Shows consumer purchase concentration during weekdays (especially Mondays and Tuesdays), tapering off over weekends. Enables marketing teams to optimize email campaign timing and ad spend schedules.

---

## 3. Product and Category Analysis

### Analysis Q3: Top 10 Products by Sales Revenue
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: Which 10 individual product SKUs generate the highest sales revenue?
- **SQL Techniques**: `INNER JOIN`, `LEFT JOIN` (with English translation fallback via `COALESCE`), `SUM()`, `LIMIT 10`.
- **Tables Involved**: `order_items`, `products`, `category_translation`
- **Business Interpretation**: Isolates individual superstar SKUs to inform merchant inventory stocking, vendor negotiations, and sponsored search rankings.

### Analysis Q4: Top Product Categories by Revenue and Unit Volume
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: Which overall product categories generate the highest total revenue?
- **SQL Techniques**: Multi-table joins, `COUNT(DISTINCT order_id)`, `SUM()`, `AVG()`.
- **Tables Involved**: `order_items`, `products`, `category_translation`
- **Business Interpretation**: Identifies core merchandise pillars: `health_beauty` (R\$ 1.26M), `watches_gifts` (R\$ 1.21M), `bed_bath_table` (R\$ 1.04M), `sports_leisure` (R\$ 988k), and `computers_accessories` (R\$ 912k).

### Analysis Q8: Monthly Category Revenue Trends
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: How does monthly revenue fluctuate across specific product categories?
- **SQL Techniques**: Multi-column grouping with `DATE_TRUNC()`, `COALESCE()`.
- **Tables Involved**: `orders`, `order_items`, `products`, `category_translation`
- **Business Interpretation**: Uncovers category-level seasonality (e.g., gift categories spiking in December and Mother's Day in May).

### Analysis Q12: Products with Highest Average Selling Prices
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: Which individual products command the highest price points?
- **SQL Techniques**: `AVG()`, `COUNT(*)`, `SUM()`, `LIMIT 20`.
- **Tables Involved**: `order_items`
- **Business Interpretation**: Identifies high-end luxury, electronics, and commercial equipment items, allowing financial teams to evaluate payment fraud risks and installment financing requirements.

### Analysis Q13: Product Categories with Highest Average Selling Prices
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: Which categories have the highest average item price?
- **SQL Techniques**: `JOIN`, `LEFT JOIN`, `AVG()`, `ORDER BY average_price DESC`.
- **Tables Involved**: `order_items`, `products`, `category_translation`
- **Business Interpretation**: Reveals high-ticket categories like `computers`, `small_appliances_home_oven_and_coffee`, and `agro_industry_and_commerce` compared to high-volume, low-margin items.

### Analysis Q19: Categories with Highest Distinct Product Variety
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: Which product categories feature the widest catalog depth and product assortment?
- **SQL Techniques**: `COUNT(DISTINCT p.product_id)`, `COUNT(*)`, `SUM()`.
- **Tables Involved**: `order_items`, `products`, `category_translation`
- **Business Interpretation**: Measures catalog breadth. `bed_bath_table` and `sports_leisure` feature thousands of distinct products, requiring advanced search filtering and recommendation systems.

---

## 4. Customer Analysis

### Analysis Q21: Customer Lifetime Revenue and Purchase Date Spans
- **Source File**: `sql/02_joins_and_cte_analysis.sql`
- **Business Question**: What is the lifetime gross revenue and order frequency generated by individual customers?
- **SQL Techniques**: Multi-table CTE joining `customers`, `orders`, and `order_items`, outer grouping on `customer_unique_id`.
- **Tables Involved**: `customers`, `orders`, `order_items`
- **Business Interpretation**: Unmasks individual buyer value by aggregating across transactions using the persistent `customer_unique_id` rather than single-transaction `customer_id`.

### Analysis Q22: Repeat Customer Count and Retention Percentage
- **Source File**: `sql/02_joins_and_cte_analysis.sql`
- **Business Question**: What proportion of the customer base makes more than one purchase?
- **SQL Techniques**: CTE with `COUNT(DISTINCT order_id)`, filtered aggregates using `COUNT(*) FILTER (WHERE ...)`.
- **Tables Involved**: `customers`, `orders`
- **Business Interpretation**: Discloses that only **2,997** out of **96,096** unique customers (**3.12%**) make repeat purchases. Indicates that Olist functioned predominantly as an acquisition funnel, underscoring massive untapped potential for post-purchase retention marketing.

### Analysis Q23: Customer Purchase Frequency Distribution
- **Source File**: `sql/02_joins_and_cte_analysis.sql`
- **Business Question**: How many total orders do customers place across their lifecycle?
- **SQL Techniques**: Two-stage CTE aggregation with window `SUM(COUNT(*)) OVER ()` for percentage share.
- **Tables Involved**: `customers`, `orders`
- **Business Interpretation**: Details the long-tail distribution: 96.88% place exactly 1 order, 2.85% place 2 orders, and only 0.27% place 3 or more orders.

### Analysis Q24: Average Interval (Days) Between Repeat Purchases
- **Source File**: `sql/02_joins_and_cte_analysis.sql`
- **Business Question**: For customers who purchase repeatedly, how many days elapse between consecutive orders?
- **SQL Techniques**: Window function `LAG()` partitioned by `customer_unique_id`, `EXTRACT(EPOCH FROM ...)` conversion to days.
- **Tables Involved**: `customers`, `orders`
- **Business Interpretation**: Informs retention campaign timing: automated win-back and re-engagement messaging should be triggered prior to the average repurchase cycle.

### Analysis Q29: Customer Tier Segmentation by Lifetime Spend
- **Source File**: `sql/02_joins_and_cte_analysis.sql`
- **Business Question**: How can customers be grouped into High Value, Medium Value, and Low Value tiers?
- **SQL Techniques**: CTE calculating lifetime spend, `CASE` statement segmentation, tier-level aggregation.
- **Tables Involved**: `customers`, `orders`, `order_items`
- **Business Interpretation**: Segments buyers into High Value (>= R\$ 1,000), Medium Value (R\$ 500–999), and Low Value (< R\$ 500), helping marketing teams allocate VIP support and customized loyalty incentives.

---

## 5. Seller Analysis

### Analysis Q27: Top-Performing Sellers by Gross Merchandise Value
- **Source File**: `sql/02_joins_and_cte_analysis.sql`
- **Business Question**: Which marketplace sellers generate the highest total sales volume?
- **SQL Techniques**: `INNER JOIN` between `sellers` and `order_items`, `SUM(oi.price)`, `LIMIT 20`.
- **Tables Involved**: `sellers`, `order_items`
- **Business Interpretation**: Identifies critical merchant partners responsible for disproportionate platform GMV, supporting strategic account management and volume-based commission tiering.

### Analysis Q40: Top Sellers Ranked by Monthly Revenue Across Time
- **Source File**: `sql/03_window_functions.sql`
- **Business Question**: Which sellers perform best in each individual calendar month?
- **SQL Techniques**: Monthly aggregation CTE, `DENSE_RANK() OVER (PARTITION BY sales_month ORDER BY monthly_revenue DESC)`.
- **Tables Involved**: `orders`, `order_items`
- **Business Interpretation**: Tracks seller churn and consistency at the top of the marketplace leaderboard, pinpointing merchants experiencing seasonal surges.

---

## 6. Order and Payment Analysis

### Analysis Q6: Distribution of Orders by Operational Status
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: What percentage of orders are delivered, shipped, canceled, or processing?
- **SQL Techniques**: Window function `SUM(COUNT(*)) OVER ()`, percentage calculation.
- **Tables Involved**: `orders`
- **Business Interpretation**: Confirms that over **97%** of placed orders reach `delivered` status, with cancellation rates remaining below 1%, demonstrating strong checkout completion.

### Analysis Q7: Payment Method Popularity and Monetary Value
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: Which payment methods are most popular and how much total value does each generate?
- **SQL Techniques**: `COUNT(*)`, `COUNT(DISTINCT order_id)`, `SUM()`, `AVG()`.
- **Tables Involved**: `order_payments`
- **Business Interpretation**: Quantifies payment distribution across credit cards, Boleto, vouchers, and debit cards.

### Analysis Q14: Average Item Count per Customer Order
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: How many individual items are contained in a standard customer basket?
- **SQL Techniques**: CTE grouping items by `order_id`, outer `AVG()`.
- **Tables Involved**: `order_items`
- **Business Interpretation**: Establishes that the vast majority of orders contain 1 to 2 items, signaling opportunity for cross-selling and product bundling strategies.

### Analysis Q17: Distribution of Payment Installments
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: How frequently do Brazilian consumers leverage installment financing?
- **SQL Techniques**: `GROUP BY payment_installments`, `SUM()`, `AVG()`.
- **Tables Involved**: `order_payments`
- **Business Interpretation**: Highlights Brazil's unique credit culture: significant portions of consumers finance purchases across 3, 6, and 10 installments, particularly for higher-priced goods.

### Analysis Q20: Percentage Share of Total Value by Payment Method
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: What exact percentage of total payment volume is captured by each payment method?
- **SQL Techniques**: CTE with `SUM() OVER ()` window percentage calculation.
- **Tables Involved**: `order_payments`
- **Business Interpretation**: Verifies that credit cards capture **78.34%** of all payment value, followed by Boleto Bancário at **17.92%**.

### Analysis Q39: Payment Type Share of Total Payment Value (Window Approach)
- **Source File**: `sql/03_window_functions.sql`
- **Business Question**: How is payment share calculated dynamically across methods using inline window functions?
- **SQL Techniques**: Inline window aggregate `SUM(total_payment_value) OVER ()`.
- **Tables Involved**: `order_payments`
- **Business Interpretation**: Provides an alternative window-driven architecture for BI tiles without requiring multi-stage CTE nesting.

---

## 7. Delivery and Operational Analysis

### Analysis Q16: Monthly Freight and Logistics Costs
- **Source File**: `sql/01_basic_aggregate_analysis.sql`
- **Business Question**: How do monthly freight costs and average shipping fees per item fluctuate over time?
- **SQL Techniques**: `DATE_TRUNC()`, `SUM(freight_value)`, `AVG(freight_value)`.
- **Tables Involved**: `orders`, `order_items`
- **Business Interpretation**: Monitors shipping fee stability, ensuring carrier contract renegotiations keep logistics inflation in check.

### Analysis Q25: Orders Experiencing Longest Delivery Delays
- **Source File**: `sql/02_joins_and_cte_analysis.sql`
- **Business Question**: Which specific customer orders suffered the most severe delivery delays beyond estimated dates?
- **SQL Techniques**: Date difference via `EXTRACT(EPOCH FROM ...) / 86400.0`, conditional filtering, `ORDER BY ... DESC LIMIT 20`.
- **Tables Involved**: `orders`
- **Business Interpretation**: Isolates extreme carrier failure cases (some orders delayed by over 100 days), highlighting geographical choke points in remote northern states.

### Analysis Q26: On-Time Delivery SLA Compliance Percentage
- **Source File**: `sql/02_joins_and_cte_analysis.sql`
- **Business Question**: What percentage of delivered orders arrived on or before the promised delivery date?
- **SQL Techniques**: `CASE` statement evaluation, window aggregate percentage calculation.
- **Tables Involved**: `orders`
- **Business Interpretation**: Establishes that **91.89%** of delivered orders meet customer SLAs, leaving an **8.11%** delay rate (7,826 orders) that requires operational intervention.

---

## 8. Review and Satisfaction Analysis

### Analysis Q28: Customer Satisfaction Scores by Brazilian State
- **Source File**: `sql/02_joins_and_cte_analysis.sql`
- **Business Question**: How do customer review ratings vary across Brazilian states?
- **SQL Techniques**: Order-level review score CTE, multi-table joins to customers, filtered count for positive reviews.
- **Tables Involved**: `order_reviews`, `orders`, `customers`
- **Business Interpretation**: Demonstrates that states with shorter shipping distances (e.g., `SP`, `PR`, `SC`) maintain higher average review scores (4.15–4.25), whereas distant states (e.g., `RR`, `AL`, `MA`) show lower satisfaction due to shipping latency.

### Analysis Q30: Correlation Between Delivery SLA Performance and Review Scores
- **Source File**: `sql/02_joins_and_cte_analysis.sql`
- **Business Question**: How does on-time delivery versus delayed delivery impact customer review ratings?
- **SQL Techniques**: Multi-stage CTEs joining delivery status and review scores, grouped average calculation.
- **Tables Involved**: `orders`, `order_reviews`
- **Business Interpretation**: **Critical commercial finding**: On-time orders average **4.29 / 5.0**, whereas delayed orders plunge to **2.57 / 5.0** (a 1.72-star reduction, -40%). Proves that logistics velocity is the single strongest determinant of customer sentiment.

---

## 9. Advanced SQL and Window Functions

### Analysis Q31: Month-over-Month Revenue Growth Percentage
- **Source File**: `sql/03_window_functions.sql`
- **Business Question**: What is the monthly rate of product sales revenue growth or decline?
- **SQL Techniques**: `DATE_TRUNC()`, `LAG(revenue) OVER (ORDER BY sales_month)`, percentage delta calculation.
- **Tables Involved**: `orders`, `order_items`
- **Business Interpretation**: Quantifies commercial momentum month-over-month, highlighting post-holiday contractions and promotional demand spikes.

### Analysis Q32: Running Cumulative Total of Monthly Revenue
- **Source File**: `sql/03_window_functions.sql`
- **Business Question**: How does cumulative platform sales revenue increase over time?
- **SQL Techniques**: `SUM(revenue) OVER (ORDER BY sales_month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`.
- **Tables Involved**: `orders`, `order_items`
- **Business Interpretation**: Produces the milestone financial curve showing platform scaling from zero to over R\$ 13.5M in merchandise item value.

### Analysis Q33: Top 3 Products in Each Category
- **Source File**: `sql/03_window_functions.sql`
- **Business Question**: Which three products generate the highest revenue within every individual category?
- **SQL Techniques**: `ROW_NUMBER() OVER (PARTITION BY category ORDER BY total_revenue DESC)`, outer filter `WHERE product_rank <= 3`.
- **Tables Involved**: `order_items`, `products`, `category_translation`
- **Business Interpretation**: Identifies top product leaders within all 71 catalog categories for merchandising display and sponsored ad placements.

### Analysis Q34: State Revenue Rankings
- **Source File**: `sql/03_window_functions.sql`
- **Business Question**: How do all 27 Brazilian states rank in merchandise revenue generation?
- **SQL Techniques**: `RANK() OVER (ORDER BY total_revenue DESC)`.
- **Tables Involved**: `orders`, `customers`, `order_items`
- **Business Interpretation**: Ranks all federative units sequentially, defining Tier 1, Tier 2, and Tier 3 expansion priority markets.

### Analysis Q35: Three-Month Moving Average of Monthly Revenue
- **Source File**: `sql/03_window_functions.sql`
- **Business Question**: What is the smoothed revenue trajectory over a rolling 3-month window?
- **SQL Techniques**: `AVG(revenue) OVER (ORDER BY sales_month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)`.
- **Tables Involved**: `orders`, `order_items`
- **Business Interpretation**: Eliminates monthly noise and calendar quirks to reveal underlying macro commercial trends.

### Analysis Q36: Customer Purchase Sequence Tracking
- **Source File**: `sql/03_window_functions.sql`
- **Business Question**: What is the chronological sequence of orders for each customer and the elapsed days between them?
- **SQL Techniques**: `ROW_NUMBER() OVER (PARTITION BY customer_unique_id ORDER BY order_purchase_timestamp)`, `LAG() OVER (...)`.
- **Tables Involved**: `orders`, `customers`
- **Business Interpretation**: Maps granular customer transaction journeys to detect repurchase velocity and customer lifetime milestones.

### Analysis Q37: Top 5 Highest-Value Orders Within Each State
- **Source File**: `sql/03_window_functions.sql`
- **Business Question**: What are the top 5 highest-ticket individual customer transactions in each state?
- **SQL Techniques**: `DENSE_RANK() OVER (PARTITION BY customer_state ORDER BY order_value DESC)`.
- **Tables Involved**: `orders`, `customers`, `order_items`
- **Business Interpretation**: Surfaces regional high-value transactions and corporate/bulk purchasing activity.

### Analysis Q38: Category Cumulative Running Revenue Over Time
- **Source File**: `sql/03_window_functions.sql`
- **Business Question**: How does each product category's cumulative revenue compound across months?
- **SQL Techniques**: `SUM(monthly_revenue) OVER (PARTITION BY category ORDER BY sales_month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`.
- **Tables Involved**: `orders`, `order_items`, `products`, `category_translation`
- **Business Interpretation**: Compares long-term category growth trajectories to identify emerging versus mature or declining merchandise segments.

---

## 10. Bonus Analytics: Reusable Views, Pareto (80/20) & Performance Profiling

### Part 1: Production Reusable SQL Views
- **Source File**: `sql/04_bonus_views_and_pareto.sql`
- **Implementation**:
  1. `v_monthly_revenue_kpis`: Pre-aggregates revenue, order volume, AOV, and freight costs by calendar month for zero-latency dashboard queries.
  2. `v_customer_lifetime_metrics`: Pre-calculates customer first/last purchase dates, order frequency, lifetime spend, and repeat buyer tags.
  3. `v_delivery_sla_performance`: Pre-computes transit duration, delay days, and review ratings per delivered order.
  4. `v_category_performance`: Merges Portuguese category names with English translations, seller counts, and commercial totals.

### Part 2: Pareto (80/20) Analysis
- **Source File**: `sql/04_bonus_views_and_pareto.sql`

#### Bonus Analysis Q41: Product Pareto (80/20 Rule)
- **Business Question**: Which top percentage of products generates 80% of total merchandise revenue?
- **SQL Techniques**: Multi-level CTE, `ROW_NUMBER() OVER (ORDER BY total_revenue DESC)`, cumulative running total `SUM() OVER ()`, and threshold filtering.
- **Verified Finding**: The top **8,536 products (25.91% of active catalog)** generate **80.00% of all merchandise revenue**. Confirms the classical Pareto power law: merchandising and inventory efforts should prioritize this top 26% of SKUs.

#### Bonus Analysis Q42: Customer Pareto (80/20 Rule)
- **Business Question**: What proportion of the customer base accounts for 80% of total revenue?
- **SQL Techniques**: CTE calculating customer lifetime spend, window running totals, and percentage threshold cutoff.
- **Verified Finding**: The top **42,831 customers (44.89%)** generate **80.00% of sales**. Demonstrates a more distributed customer revenue long-tail compared to products, reflecting Olist's predominantly single-purchase customer acquisition model.

### Part 3: Query Performance Optimization (EXPLAIN ANALYZE)
- **Source File**: `sql/04_bonus_views_and_pareto.sql`
- **Demonstration**: Benchmarking `idx_orders_customer` on `orders(customer_id)`.
- **Execution Impact**: Index scan reduces query execution from a sequential table scan (~99k rows evaluated, ~15ms) down to a direct index bitmap heap scan (<0.08ms), achieving a **180x query speedup** on customer order lookups.


