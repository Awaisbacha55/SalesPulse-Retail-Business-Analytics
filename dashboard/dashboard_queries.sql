-- ==============================================================================
-- SALESPULSE BUSINESS INTELLIGENCE DASHBOARD QUERIES
-- Database: PostgreSQL 17 (salespulse)
-- Target Platform: Metabase (Primary) / Power BI / Superset / DBeaver
-- Live Published Dashboard: http://51.21.250.3:3000/public/dashboard/a9d2ce25-d3b7-4958-8aeb-a9096cb2770f
-- Dashboard Preview: images/metabase_dashboard.png
-- ==============================================================================
--
-- METABASE FIELD FILTER MAPPING REFERENCE:
-- 1. Date Range Filter:
--    - Variable Name: {{date_filter}}
--    - Filter Type: Field Filter
--    - Mapped PostgreSQL Field: orders.order_purchase_timestamp
--    - Dashboard Widget: Date Range / Date Filter
--
-- 2. Customer State Filter:
--    - Variable Name: {{state_filter}}
--    - Filter Type: Field Filter
--    - Mapped PostgreSQL Field: customers.customer_state
--    - Dashboard Widget: Dropdown / Multiple Values
--
-- 3. Product Category Filter:
--    - Variable Name: {{category_filter}}
--    - Filter Type: Field Filter
--    - Mapped PostgreSQL Field: products.product_category_name
--    - Dashboard Widget: Dropdown / Search
--
-- CARD-TO-FILTER CONNECTION MATRIX:
-- ┌──────────────────────────────────────┬────────────┬──────────────┬──────────────────┐
-- │ Dashboard Card / Tile                │ Date Range │ State Filter │ Category Filter  │
-- ├──────────────────────────────────────┼────────────┼──────────────┼──────────────────┤
-- │ 1. Total Orders                      │ Yes        │ Yes          │ Optional         │
-- │ 2. Total Customers                   │ Yes        │ Yes          │ No               │
-- │ 3. Merchandise GMV                   │ Yes        │ Yes          │ Yes              │
-- │ 4. Total Platform Payment Volume     │ Yes        │ Yes          │ No               │
-- │ 5. Average Order Value (AOV)         │ Yes        │ Yes          │ Yes              │
-- │ 6. On-Time Delivery Rate (%)         │ Yes        │ Yes          │ No               │
-- │ 7. Monthly Revenue Trend             │ Yes        │ Optional     │ Yes              │
-- │ 8. Month-over-Month Growth           │ Yes        │ Optional     │ Optional         │
-- │ 9. Top 10 Product Categories         │ Yes        │ Yes          │ Yes              │
-- │ 10. Revenue Distribution by State    │ Yes        │ Optional     │ Yes              │
-- │ 11. Delivery SLA vs. Review Score    │ Yes        │ Yes          │ No               │
-- │ 12. Payment Method Distribution      │ Yes        │ Yes          │ No               │
-- └──────────────────────────────────────┴────────────┴──────────────┴──────────────────┘
-- Note: When pasting into Metabase Native SQL mode, uncomment the [[AND {{...}}]] tags.
-- ==============================================================================


-- ==============================================================================
-- SECTION 1: METABASE CARD QUERIES (WITH FIELD FILTER BINDINGS)
-- ==============================================================================

-- Card M1: Total Orders
-- Metabase Variables: {{date_filter}}, {{state_filter}}
SELECT
    COUNT(DISTINCT o.order_id) AS total_orders
FROM public.orders o
INNER JOIN public.customers c
    ON o.customer_id = c.customer_id
WHERE 1=1
--  [[AND {{date_filter}}]]
--  [[AND {{state_filter}}]]
;


-- Card M2: Total Unique Customers
-- Metabase Variables: {{date_filter}}, {{state_filter}}
SELECT
    COUNT(DISTINCT c.customer_unique_id) AS total_customers
FROM public.customers c
INNER JOIN public.orders o
    ON c.customer_id = o.customer_id
WHERE 1=1
--  [[AND {{date_filter}}]]
--  [[AND {{state_filter}}]]
;


-- Card M3: Merchandise GMV
-- Metabase Variables: {{date_filter}}, {{state_filter}}, {{category_filter}}
SELECT
    ROUND(SUM(oi.price)::NUMERIC, 2) AS merchandise_gmv
FROM public.order_items oi
INNER JOIN public.orders o
    ON oi.order_id = o.order_id
INNER JOIN public.customers c
    ON o.customer_id = c.customer_id
INNER JOIN public.products p
    ON oi.product_id = p.product_id
WHERE 1=1
--  [[AND {{date_filter}}]]
--  [[AND {{state_filter}}]]
--  [[AND {{category_filter}}]]
;


-- Card M4: Total Platform Payment Volume
-- Metabase Variables: {{date_filter}}, {{state_filter}}
SELECT
    ROUND(SUM(p.payment_value)::NUMERIC, 2) AS total_payment_value
FROM public.order_payments p
INNER JOIN public.orders o
    ON p.order_id = o.order_id
INNER JOIN public.customers c
    ON o.customer_id = c.customer_id
WHERE 1=1
--  [[AND {{date_filter}}]]
--  [[AND {{state_filter}}]]
;


-- Card M5: Average Order Value (AOV)
-- Metabase Variables: {{date_filter}}, {{state_filter}}, {{category_filter}}
WITH order_basket_totals AS (
    SELECT
        oi.order_id,
        SUM(oi.price) AS order_total
    FROM public.order_items oi
    INNER JOIN public.orders o
        ON oi.order_id = o.order_id
    INNER JOIN public.customers c
        ON o.customer_id = c.customer_id
    INNER JOIN public.products p
        ON oi.product_id = p.product_id
    WHERE 1=1
--    [[AND {{date_filter}}]]
--    [[AND {{state_filter}}]]
--    [[AND {{category_filter}}]]
    GROUP BY oi.order_id
)
SELECT
    ROUND(AVG(order_total)::NUMERIC, 2) AS average_order_value
FROM order_basket_totals;


-- Card M6: On-Time Delivery Rate (%)
-- Metabase Variables: {{date_filter}}, {{state_filter}}
WITH delivery_status AS (
    SELECT
        o.order_id,
        CASE
            WHEN o.order_delivered_customer_date <= o.order_estimated_delivery_date THEN 1
            ELSE 0
        END AS is_on_time
    FROM public.orders o
    INNER JOIN public.customers c
        ON o.customer_id = c.customer_id
    WHERE o.order_status = 'delivered'
      AND o.order_delivered_customer_date IS NOT NULL
      AND o.order_estimated_delivery_date IS NOT NULL
--    [[AND {{date_filter}}]]
--    [[AND {{state_filter}}]]
)
SELECT
    ROUND(SUM(is_on_time) * 100.0 / NULLIF(COUNT(*), 0), 2) AS on_time_delivery_rate_pct
FROM delivery_status;


-- Card M7: Monthly Revenue Trajectory & Volume (Enforcing August 2018 Cutoff)
-- Metabase Variables: {{date_filter}}, {{state_filter}}, {{category_filter}}
SELECT
    DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS monthly_revenue,
    COUNT(DISTINCT o.order_id) AS monthly_orders
FROM public.orders o
INNER JOIN public.order_items oi
    ON o.order_id = oi.order_id
INNER JOIN public.customers c
    ON o.customer_id = c.customer_id
INNER JOIN public.products p
    ON oi.product_id = p.product_id
WHERE o.order_status = 'delivered'
  AND o.order_purchase_timestamp < '2018-09-01'
--  [[AND {{date_filter}}]]
--  [[AND {{state_filter}}]]
--  [[AND {{category_filter}}]]
GROUP BY DATE_TRUNC('month', o.order_purchase_timestamp)
ORDER BY sales_month;


-- Card M8: Top 10 Product Categories by Revenue
-- Metabase Variables: {{date_filter}}, {{state_filter}}
SELECT
    COALESCE(ct.product_category_name_english, p.product_category_name, 'Unknown') AS category_name,
    COUNT(DISTINCT oi.order_id) AS order_count,
    COUNT(*) AS units_sold,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS total_revenue
FROM public.order_items oi
INNER JOIN public.orders o
    ON oi.order_id = o.order_id
INNER JOIN public.customers c
    ON o.customer_id = c.customer_id
INNER JOIN public.products p
    ON oi.product_id = p.product_id
LEFT JOIN public.category_translation ct
    ON p.product_category_name = ct.product_category_name
WHERE 1=1
--  [[AND {{date_filter}}]]
--  [[AND {{state_filter}}]]
GROUP BY ct.product_category_name_english, p.product_category_name
ORDER BY total_revenue DESC
LIMIT 10;


-- Card M9: Revenue Distribution by Brazilian State
-- Metabase Variables: {{date_filter}}, {{category_filter}}
SELECT
    c.customer_state AS state_code,
    COUNT(DISTINCT o.order_id) AS total_orders,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS total_revenue,
    ROUND(
        SUM(oi.price) * 100.0 / NULLIF(SUM(SUM(oi.price)) OVER (), 0),
        2
    ) AS revenue_share_pct
FROM public.orders o
INNER JOIN public.customers c
    ON o.customer_id = c.customer_id
INNER JOIN public.order_items oi
    ON o.order_id = oi.order_id
INNER JOIN public.products p
    ON oi.product_id = p.product_id
WHERE 1=1
--  [[AND {{date_filter}}]]
--  [[AND {{category_filter}}]]
GROUP BY c.customer_state
ORDER BY total_revenue DESC;


-- Card M10: Delivery SLA vs. Customer Review Score
-- Metabase Variables: {{date_filter}}, {{state_filter}}
WITH delivery_status AS (
    SELECT
        o.order_id,
        CASE
            WHEN o.order_delivered_customer_date <= o.order_estimated_delivery_date THEN 'On Time'
            WHEN o.order_delivered_customer_date > o.order_estimated_delivery_date THEN 'Delayed'
        END AS delivery_status
    FROM public.orders o
    INNER JOIN public.customers c
        ON o.customer_id = c.customer_id
    WHERE o.order_status = 'delivered'
      AND o.order_delivered_customer_date IS NOT NULL
      AND o.order_estimated_delivery_date IS NOT NULL
--    [[AND {{date_filter}}]]
--    [[AND {{state_filter}}]]
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


-- Card M11: Payment Method Distribution
-- Metabase Variables: {{date_filter}}, {{state_filter}}
WITH filtered_payments AS (
    SELECT
        p.payment_type,
        SUM(p.payment_value) AS method_total
    FROM public.order_payments p
    INNER JOIN public.orders o
        ON p.order_id = o.order_id
    INNER JOIN public.customers c
        ON o.customer_id = c.customer_id
    WHERE 1=1
--    [[AND {{date_filter}}]]
--    [[AND {{state_filter}}]]
    GROUP BY p.payment_type
)
SELECT
    payment_type,
    ROUND(method_total::NUMERIC, 2) AS payment_value,
    ROUND(
        method_total * 100.0 / NULLIF(SUM(method_total) OVER (), 0),
        2
    ) AS percentage_of_total
FROM filtered_payments
ORDER BY payment_value DESC;


-- ==============================================================================
-- SECTION 2: STANDALONE ANSI-SQL QUERIES (DIRECT DATABASE EXECUTION)
-- Compatible with DBeaver, psql, Power BI, Tableau, and Apache Superset.
-- ==============================================================================

-- Static 1: Total Platform Revenue
SELECT
    ROUND(SUM(payment_value)::NUMERIC, 2) AS total_revenue
FROM public.order_payments;


-- Static 2: Total Paid Orders
SELECT
    COUNT(DISTINCT order_id) AS total_paid_orders
FROM public.order_payments;


-- Static 3: Merchandise AOV
WITH order_totals AS (
    SELECT
        order_id,
        SUM(price) AS order_total
    FROM public.order_items
    GROUP BY order_id
)
SELECT
    ROUND(AVG(order_total)::NUMERIC, 2) AS merchandise_aov
FROM order_totals;


-- Static 4: On-Time Delivery Rate (%)
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


-- Static 5: Monthly Revenue Velocity & Order Volume
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


-- Static 6: Month-over-Month Revenue Growth Percentage
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


-- Static 7: Top 10 Product Categories by Revenue
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


-- Static 8: Revenue Distribution by Brazilian State
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


-- Static 9: Payment Method Distribution
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


-- Static 10: Delivery SLA vs. Customer Review Score
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


-- Static 11: Customer Retention & Repeat Purchase Split
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
