-- ==============================================================================
-- SALESPULSE BUSINESS INTELLIGENCE DASHBOARD QUERIES
-- Database: PostgreSQL 17 (salespulse)
-- Target Platform: Metabase / Power BI / Superset
-- Dashboard Preview: images/dashboard_preview.png
-- ==============================================================================

-- ==============================================================================
-- 1. EXECUTIVE KPI SUMMARY CARDS
-- ==============================================================================

-- KPI Card 1: Total Platform Revenue
-- Returns total gross merchandise value processed through platform payments
SELECT
    ROUND(SUM(payment_value)::NUMERIC, 2) AS total_revenue
FROM public.order_payments;


-- KPI Card 2: Total Paid Orders
-- Returns total distinct orders with confirmed payment transactions
SELECT
    COUNT(DISTINCT order_id) AS total_paid_orders
FROM public.order_payments;


-- KPI Card 3: Average Order Value (AOV)
-- Returns average monetary value per completed order
WITH order_totals AS (
    SELECT
        order_id,
        SUM(payment_value) AS order_total
    FROM public.order_payments
    GROUP BY order_id
)
SELECT
    ROUND(AVG(order_total)::NUMERIC, 2) AS average_order_value
FROM order_totals;


-- KPI Card 4: On-Time Delivery Rate (%)
-- Calculates the percentage of orders delivered on or before estimated date
WITH delivery_status AS (
    SELECT
        order_id,
        CASE
            WHEN order_delivered_customer_date <= order_estimated_delivery_date THEN 1
            ELSE 0
        END AS is_on_time
    FROM public.orders
    WHERE order_status = 'delivered'
      AND order_delivered_customer_date IS NOT NULL
      AND order_estimated_delivery_date IS NOT NULL
)
SELECT
    ROUND(SUM(is_on_time) * 100.0 / COUNT(*), 2) AS on_time_delivery_rate_pct
FROM delivery_status;


-- ==============================================================================
-- 2. TIME-SERIES & TREND VISUALIZATIONS
-- ==============================================================================

-- Visual 1: Monthly Revenue Velocity & Order Volume
-- Time series chart displaying monthly financial trajectory and order counts
-- Note: Excludes incomplete months (September and October 2018) to ensure consistent date boundaries
SELECT
    DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
    ROUND(SUM(p.payment_value)::NUMERIC, 2) AS monthly_revenue,
    COUNT(DISTINCT o.order_id) AS monthly_orders
FROM public.orders o
INNER JOIN public.order_payments p
    ON o.order_id = p.order_id
WHERE o.order_status = 'delivered'
  AND o.order_purchase_timestamp < '2018-09-01'
GROUP BY DATE_TRUNC('month', o.order_purchase_timestamp)
ORDER BY sales_month;


-- Visual 2: Month-over-Month Revenue Growth Percentage
-- Evaluates growth acceleration across consecutive months
-- Note: Excludes incomplete months (September and October 2018) so LAG compares complete months
WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
        SUM(p.payment_value) AS revenue
    FROM public.orders o
    INNER JOIN public.order_payments p
        ON o.order_id = p.order_id
    WHERE o.order_status = 'delivered'
      AND o.order_purchase_timestamp < '2018-09-01'
    GROUP BY 1
),
growth_calc AS (
    SELECT
        sales_month,
        revenue,
        LAG(revenue) OVER (ORDER BY sales_month) AS prior_month_revenue
    FROM monthly_sales
)
SELECT
    sales_month,
    ROUND(revenue::NUMERIC, 2) AS current_revenue,
    ROUND(prior_month_revenue::NUMERIC, 2) AS prior_revenue,
    ROUND(
        ((revenue - prior_month_revenue) / NULLIF(prior_month_revenue, 0) * 100)::NUMERIC,
        2
    ) AS mom_growth_pct
FROM growth_calc
ORDER BY sales_month;


-- ==============================================================================
-- 3. CATEGORY & PRODUCT PERFORMANCE
-- ==============================================================================

-- Visual 3: Top 10 Product Categories by Revenue
-- Bar chart highlighting top revenue drivers in English
SELECT
    COALESCE(ct.product_category_name_english, p.product_category_name, 'Unknown') AS category_name,
    COUNT(DISTINCT oi.order_id) AS order_count,
    COUNT(*) AS units_sold,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS total_revenue
FROM public.order_items oi
INNER JOIN public.products p
    ON oi.product_id = p.product_id
LEFT JOIN public.category_translation ct
    ON p.product_category_name = ct.product_category_name
GROUP BY ct.product_category_name_english, p.product_category_name
ORDER BY total_revenue DESC
LIMIT 10;


-- ==============================================================================
-- 4. GEOGRAPHIC MARKET PENETRATION
-- ==============================================================================

-- Visual 4: Revenue & Order Distribution by Brazilian State
-- Geospatial choropleth map / ranked bar chart across 27 federative units
SELECT
    c.customer_state AS state_code,
    COUNT(DISTINCT o.order_id) AS total_orders,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS total_revenue,
    ROUND(
        SUM(oi.price) * 100.0 / SUM(SUM(oi.price)) OVER (),
        2
    ) AS revenue_share_pct
FROM public.orders o
INNER JOIN public.customers c
    ON o.customer_id = c.customer_id
INNER JOIN public.order_items oi
    ON o.order_id = oi.order_id
GROUP BY c.customer_state
ORDER BY total_revenue DESC;


-- ==============================================================================
-- 5. PAYMENT METHOD DYNAMICS
-- ==============================================================================

-- Visual 5: Payment Method Share of Total Volume
-- Donut / pie chart illustrating tender type breakdown
WITH payment_breakdown AS (
    SELECT
        payment_type,
        SUM(payment_value) AS method_total
    FROM public.order_payments
    GROUP BY payment_type
)
SELECT
    payment_type,
    ROUND(method_total::NUMERIC, 2) AS payment_value,
    ROUND(
        method_total * 100.0 / NULLIF(SUM(method_total) OVER (), 0),
        2
    ) AS percentage_of_total
FROM payment_breakdown
ORDER BY payment_value DESC;


-- ==============================================================================
-- 6. LOGISTICS EFFICIENCY & CUSTOMER SENTIMENT
-- ==============================================================================

-- Visual 6: Delivery SLA Performance vs. Customer Review Score
-- Correlation chart measuring customer satisfaction against delivery timeliness
WITH delivery_status AS (
    SELECT
        order_id,
        CASE
            WHEN order_delivered_customer_date <= order_estimated_delivery_date THEN 'On Time'
            WHEN order_delivered_customer_date > order_estimated_delivery_date THEN 'Delayed'
        END AS delivery_status
    FROM public.orders
    WHERE order_status = 'delivered'
      AND order_delivered_customer_date IS NOT NULL
      AND order_estimated_delivery_date IS NOT NULL
),
review_scores AS (
    SELECT
        order_id,
        AVG(review_score) AS average_review_score
    FROM public.order_reviews
    GROUP BY order_id
)
SELECT
    d.delivery_status,
    COUNT(*) AS total_reviewed_orders,
    ROUND(AVG(r.average_review_score)::NUMERIC, 2) AS avg_customer_rating
FROM delivery_status d
INNER JOIN review_scores r
    ON d.order_id = r.order_id
GROUP BY d.delivery_status
ORDER BY avg_customer_rating DESC;


-- Visual 7: Customer Retention & Repeat Purchase Split
-- Evaluates one-time buyers versus repeat customer base
WITH customer_orders AS (
    SELECT
        c.customer_unique_id,
        COUNT(DISTINCT o.order_id) AS total_orders
    FROM public.customers c
    INNER JOIN public.orders o
        ON c.customer_id = o.customer_id
    GROUP BY c.customer_unique_id
)
SELECT
    CASE
        WHEN total_orders > 1 THEN 'Repeat Customer (>1 Order)'
        ELSE 'One-Time Customer (1 Order)'
    END AS customer_type,
    COUNT(*) AS customer_count,
    ROUND(
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (),
        2
    ) AS percentage_of_customers
FROM customer_orders
GROUP BY
    CASE
        WHEN total_orders > 1 THEN 'Repeat Customer (>1 Order)'
        ELSE 'One-Time Customer (1 Order)'
    END;

