-- ==============================================================================
-- SALESPULSE — BONUS ANALYTICS: SAVED VIEWS & PARETO (80/20) ANALYSIS
-- Database: PostgreSQL 17 (salespulse)
-- Author: Muhammad Awais
-- Repository: https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics
-- ==============================================================================

-- ==============================================================================
-- PART 1: REUSABLE PRODUCTION SQL VIEWS
-- ==============================================================================

-- VIEW 1: Monthly Financial & Logistics KPIs
-- Pre-aggregates revenue, order volume, AOV, and freight costs by calendar month
CREATE OR REPLACE VIEW public.v_monthly_revenue_kpis AS
SELECT
    DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COUNT(DISTINCT o.customer_id) AS unique_customers,
    ROUND(SUM(p.payment_value)::NUMERIC, 2) AS total_monthly_revenue,
    ROUND(AVG(p.payment_value)::NUMERIC, 2) AS average_order_value,
    ROUND(SUM(oi.freight_value)::NUMERIC, 2) AS total_freight_value
FROM public.orders o
INNER JOIN public.order_payments p
    ON o.order_id = p.order_id
LEFT JOIN public.order_items oi
    ON o.order_id = oi.order_id
WHERE o.order_status = 'delivered'
GROUP BY DATE_TRUNC('month', o.order_purchase_timestamp);


-- VIEW 2: Customer Lifetime Value & Purchase Profile
-- Summarizes customer spend, order frequency, date ranges, and repeat status
CREATE OR REPLACE VIEW public.v_customer_lifetime_metrics AS
WITH customer_orders AS (
    SELECT
        c.customer_unique_id,
        o.order_id,
        o.order_purchase_timestamp,
        SUM(oi.price) AS order_value
    FROM public.customers c
    INNER JOIN public.orders o
        ON c.customer_id = o.customer_id
    INNER JOIN public.order_items oi
        ON o.order_id = oi.order_id
    GROUP BY
        c.customer_unique_id,
        o.order_id,
        o.order_purchase_timestamp
)
SELECT
    customer_unique_id,
    COUNT(order_id) AS total_orders,
    ROUND(SUM(order_value)::NUMERIC, 2) AS lifetime_revenue,
    ROUND(AVG(order_value)::NUMERIC, 2) AS average_order_value,
    MIN(order_purchase_timestamp) AS first_order_date,
    MAX(order_purchase_timestamp) AS last_order_date,
    CASE
        WHEN COUNT(order_id) > 1 THEN 'Repeat Buyer'
        ELSE 'One-Time Buyer'
    END AS customer_type
FROM customer_orders
GROUP BY customer_unique_id;


-- VIEW 3: Delivery SLA Compliance and Customer Ratings
-- Evaluates carrier lead times, delay days, and customer satisfaction scores
CREATE OR REPLACE VIEW public.v_delivery_sla_performance AS
SELECT
    o.order_id,
    o.customer_id,
    c.customer_state,
    o.order_purchase_timestamp,
    o.order_estimated_delivery_date,
    o.order_delivered_customer_date,
    ROUND(
        (EXTRACT(EPOCH FROM (o.order_delivered_customer_date - o.order_purchase_timestamp)) / 86400.0)::NUMERIC,
        2
    ) AS actual_delivery_days,
    ROUND(
        (EXTRACT(EPOCH FROM (o.order_delivered_customer_date - o.order_estimated_delivery_date)) / 86400.0)::NUMERIC,
        2
    ) AS delay_days,
    CASE
        WHEN o.order_delivered_customer_date <= o.order_estimated_delivery_date THEN 'On Time'
        WHEN o.order_delivered_customer_date > o.order_estimated_delivery_date THEN 'Delayed'
        ELSE 'Unknown'
    END AS delivery_sla_status,
    r.review_score
FROM public.orders o
INNER JOIN public.customers c
    ON o.customer_id = c.customer_id
LEFT JOIN public.order_reviews r
    ON o.order_id = r.order_id
WHERE o.order_status = 'delivered';


-- VIEW 4: Product Category Commercial Performance
-- Combines Portuguese category names with English translations, volume, and revenue
CREATE OR REPLACE VIEW public.v_category_performance AS
SELECT
    COALESCE(ct.product_category_name_english, p.product_category_name, 'Unknown') AS category_name,
    COUNT(DISTINCT oi.order_id) AS total_orders,
    COUNT(DISTINCT oi.product_id) AS distinct_products_sold,
    COUNT(DISTINCT oi.seller_id) AS active_sellers,
    COUNT(*) AS units_sold,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS total_revenue,
    ROUND(AVG(oi.price)::NUMERIC, 2) AS average_item_price
FROM public.order_items oi
INNER JOIN public.products p
    ON oi.product_id = p.product_id
LEFT JOIN public.category_translation ct
    ON p.product_category_name = ct.product_category_name
GROUP BY
    ct.product_category_name_english,
    p.product_category_name;


-- ==============================================================================
-- PART 2: PARETO (80/20) ANALYSIS
-- ==============================================================================

-- BONUS QUESTION 41:
-- Which top percentage of products generates 80% of total merchandise revenue?
-- (Pareto Principle / 80-20 Rule on Product Catalog)

WITH product_revenue AS (
    SELECT
        product_id,
        SUM(price) AS total_revenue
    FROM public.order_items
    GROUP BY product_id
),
revenue_ranked AS (
    SELECT
        product_id,
        total_revenue,
        ROW_NUMBER() OVER (ORDER BY total_revenue DESC) AS product_rank,
        COUNT(*) OVER () AS total_products,
        SUM(total_revenue) OVER () AS platform_revenue,
        SUM(total_revenue) OVER (
            ORDER BY total_revenue DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS running_revenue
    FROM product_revenue
)
SELECT
    product_rank,
    total_products,
    ROUND(product_rank * 100.0 / total_products, 2) AS product_percentile,
    ROUND(total_revenue::NUMERIC, 2) AS product_revenue,
    ROUND(running_revenue::NUMERIC, 2) AS cumulative_revenue,
    ROUND((running_revenue * 100.0 / platform_revenue)::NUMERIC, 2) AS cumulative_revenue_share_pct
FROM revenue_ranked
WHERE running_revenue >= platform_revenue * 0.80
ORDER BY product_rank
LIMIT 1;
-- Finding: The top 8,536 products (25.91% of active catalog) generate 80.00% of all sales.


-- BONUS QUESTION 42:
-- What proportion of the customer base accounts for 80% of total revenue?
-- (Pareto Principle on Customer Lifetime Spend)

WITH customer_revenue AS (
    SELECT
        c.customer_unique_id,
        SUM(oi.price) AS lifetime_spend
    FROM public.customers c
    INNER JOIN public.orders o
        ON c.customer_id = o.customer_id
    INNER JOIN public.order_items oi
        ON o.order_id = oi.order_id
    GROUP BY c.customer_unique_id
),
customer_ranked AS (
    SELECT
        customer_unique_id,
        lifetime_spend,
        ROW_NUMBER() OVER (ORDER BY lifetime_spend DESC) AS customer_rank,
        COUNT(*) OVER () AS total_customers,
        SUM(lifetime_spend) OVER () AS total_revenue,
        SUM(lifetime_spend) OVER (
            ORDER BY lifetime_spend DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS running_spend
    FROM customer_revenue
)
SELECT
    customer_rank,
    total_customers,
    ROUND(customer_rank * 100.0 / total_customers, 2) AS customer_percentile,
    ROUND(running_spend::NUMERIC, 2) AS cumulative_spend,
    ROUND((running_spend * 100.0 / total_revenue)::NUMERIC, 2) AS cumulative_spend_share_pct
FROM customer_ranked
WHERE running_spend >= total_revenue * 0.80
ORDER BY customer_rank
LIMIT 1;
-- Finding: Top 42,831 customers (44.89%) generate 80.00% of sales, highlighting customer acquisition spread.


-- ==============================================================================
-- PART 3: QUERY PERFORMANCE BENCHMARKING (EXPLAIN ANALYZE)
-- ==============================================================================

-- Demonstration: Verifying B-Tree Index Acceleration on Customer Order History
-- Compares execution plan leveraging idx_orders_customer vs full table scan

EXPLAIN ANALYZE
SELECT
    o.order_id,
    o.order_purchase_timestamp,
    o.order_status,
    p.payment_value
FROM public.orders o
INNER JOIN public.order_payments p
    ON o.order_id = p.order_id
WHERE o.customer_id = '06b8999e2fba1a1fbc88172c00ba8bc7';

