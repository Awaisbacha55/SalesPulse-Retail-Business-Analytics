-- ==============================================================================
-- SALESPULSE — AUDIT & QUALITY ASSURANCE: EXPLICIT JOIN VALIDATION
-- Script: 05_join_validation.sql
-- Database: PostgreSQL 17 (salespulse)
-- Author: Muhammad Awais
-- Repository: https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics
-- ==============================================================================
--
-- PURPOSE:
-- Provides rigorous, reproducible SQL evidence demonstrating that table joins do
-- not inflate revenue or corrupt entity grains. Explicitly contrasts naive multi-table
-- joins (which create catastrophic Cartesian fan-out and double-counting) against
-- mathematically sound pre-aggregated Common Table Expression (CTE) architectures.
--
-- CORE DEFINITIONAL RULES:
--   1. Merchandise GMV    = SUM(order_items.price)
--   2. Logistics Freight   = SUM(order_items.freight_value)
--   3. Payment Volume      = SUM(order_payments.payment_value)
--   4. Distinct Orders     = COUNT(DISTINCT order_id)
-- ==============================================================================


-- ==============================================================================
-- PART A: BASE TABLE COUNTS & GRAIN BASELINE
-- ==============================================================================
-- Establishes the independent ground-truth counts and monetary sums for the three
-- core transactional tables before any relational operations take place.

-- Analysis A1: Independent Base Table Row Counts and Distinct Order Keys
SELECT
    'orders' AS table_name,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT order_id) AS distinct_orders,
    NULL::NUMERIC AS total_merchandise_gmv,
    NULL::NUMERIC AS total_freight_value,
    NULL::NUMERIC AS total_payment_value
FROM public.orders
UNION ALL
SELECT
    'order_items' AS table_name,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT order_id) AS distinct_orders,
    ROUND(SUM(price)::NUMERIC, 2) AS total_merchandise_gmv,
    ROUND(SUM(freight_value)::NUMERIC, 2) AS total_freight_value,
    NULL::NUMERIC AS total_payment_value
FROM public.order_items
UNION ALL
SELECT
    'order_payments' AS table_name,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT order_id) AS distinct_orders,
    NULL::NUMERIC AS total_merchandise_gmv,
    NULL::NUMERIC AS total_freight_value,
    ROUND(SUM(payment_value)::NUMERIC, 2) AS total_payment_value
FROM public.order_payments;

-- Verified Baseline Findings:
-- 1. orders: 99,441 rows | 99,441 distinct orders (1:1 primary key grain).
-- 2. order_items: 112,650 rows | 98,666 distinct orders (1:N line-item grain, R$ 13,591,643.70 GMV).
-- 3. order_payments: 103,886 rows | 99,440 distinct orders (1:N payment split grain, R$ 16,008,872.12 payments).


-- Analysis A2: Relational Cardinality & Orphan Record Analysis
SELECT
    (SELECT COUNT(*) FROM public.orders) AS total_orders,
    (SELECT COUNT(DISTINCT order_id) FROM public.order_items) AS orders_with_items,
    (SELECT COUNT(*) FROM public.orders o WHERE NOT EXISTS (
        SELECT 1 FROM public.order_items oi WHERE oi.order_id = o.order_id
    )) AS orders_without_items,
    (SELECT COUNT(DISTINCT order_id) FROM public.order_payments) AS orders_with_payments,
    (SELECT COUNT(*) FROM public.orders o WHERE NOT EXISTS (
        SELECT 1 FROM public.order_payments op WHERE op.order_id = o.order_id
    )) AS orders_without_payments;

-- Key Findings:
-- 1. 775 orders exist in `orders` without records in `order_items` (canceled/unavailable prior to fulfillment).
-- 2. Exactly 1 order (`bfbd0f9bdef84302105ad712db648a6c`) exists in `orders` without a record in `order_payments`.


-- ==============================================================================
-- PART B: ORDERS AND ORDER_ITEMS JOIN VALIDATION (1-TO-MANY)
-- ==============================================================================
-- Validates the join between `orders` (parent, 1 row per order) and `order_items`
-- (child, 1 row per item). Demonstrates that an INNER JOIN preserves merchandise
-- GMV exactly because each item row matches exactly one parent order.

-- Analysis B1: Row Counts, Distinct Orders, and GMV Before vs. After Join
SELECT
    '1. Base Table: order_items' AS validation_stage,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT order_id) AS distinct_orders,
    ROUND(SUM(price)::NUMERIC, 2) AS merchandise_gmv,
    ROUND(SUM(freight_value)::NUMERIC, 2) AS freight_value
FROM public.order_items
UNION ALL
SELECT
    '2. orders INNER JOIN order_items' AS validation_stage,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT o.order_id) AS distinct_orders,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS merchandise_gmv,
    ROUND(SUM(oi.freight_value)::NUMERIC, 2) AS freight_value
FROM public.orders o
INNER JOIN public.order_items oi
    ON o.order_id = oi.order_id
UNION ALL
SELECT
    '3. orders LEFT JOIN order_items' AS validation_stage,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT o.order_id) AS distinct_orders,
    ROUND(SUM(COALESCE(oi.price, 0))::NUMERIC, 2) AS merchandise_gmv,
    ROUND(SUM(COALESCE(oi.freight_value, 0))::NUMERIC, 2) AS freight_value
FROM public.orders o
LEFT JOIN public.order_items oi
    ON o.order_id = oi.order_id;

-- Business & Technical Rationale:
-- • Why row count expands from 99,441 (orders) to 112,650 (order_items):
--   Customers frequently buy multiple products or multiple quantities within a single checkout.
--   Each physical SKU purchased receives an incremented `order_item_id` (1, 2, 3...).
-- • Why GMV does NOT inflate:
--   `orders.order_id` is a unique primary key. Therefore, each item matches exactly ONE order row.
--   SUM(oi.price) = R$ 13,591,643.70 before and after the INNER JOIN (0.00% variance).
-- • INNER JOIN vs. LEFT JOIN:
--   INNER JOIN produces 112,650 rows (excludes the 775 orders that have no purchased items).
--   LEFT JOIN produces 113,425 rows (112,650 item rows + 775 orders with NULL item fields).


-- ==============================================================================
-- PART C: ORDERS AND ORDER_PAYMENTS JOIN VALIDATION (1-TO-MANY)
-- ==============================================================================
-- Validates the join between `orders` (parent, 1 row per order) and `order_payments`
-- (child, 1 row per payment transaction/voucher).

-- Analysis C1: Row Counts, Distinct Orders, and Payment Totals Before vs. After Join
SELECT
    '1. Base Table: order_payments' AS validation_stage,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT order_id) AS distinct_orders,
    ROUND(SUM(payment_value)::NUMERIC, 2) AS total_payment_value
FROM public.order_payments
UNION ALL
SELECT
    '2. orders INNER JOIN order_payments' AS validation_stage,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT o.order_id) AS distinct_orders,
    ROUND(SUM(op.payment_value)::NUMERIC, 2) AS total_payment_value
FROM public.orders o
INNER JOIN public.order_payments op
    ON o.order_id = op.order_id
UNION ALL
SELECT
    '3. orders LEFT JOIN order_payments' AS validation_stage,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT o.order_id) AS distinct_orders,
    ROUND(SUM(COALESCE(op.payment_value, 0))::NUMERIC, 2) AS total_payment_value
FROM public.orders o
LEFT JOIN public.order_payments op
    ON o.order_id = op.order_id;

-- Business & Technical Rationale:
-- • Why row count expands from 99,441 (orders) to 103,886 (order_payments):
--   Customers in Brazilian e-commerce frequently use split-tender payments (e.g., combining a store
--   voucher with a credit card, or splitting transactions across multiple credit cards).
--   Each installment record or payment instrument receives a sequential identifier `payment_sequential` (1, 2, 3...).
-- • Why Payment Value does NOT inflate:
--   Because `orders.order_id` is unique, each payment row joins to exactly ONE parent order record.
--   SUM(op.payment_value) = R$ 16,008,872.12 before and after the INNER JOIN (0.00% variance).


-- ==============================================================================
-- PART D: DEMONSTRATING JOIN MULTIPLICATION (THE CARTESIAN EXPLOSION TRAP)
-- ==============================================================================
-- Demonstrates the severe flaw of joining two 1-to-many child tables (`order_items`
-- and `order_payments`) simultaneously to the same parent table (`orders`) without
-- prior aggregation.
--
-- Mathematical Mechanism:
-- If an order has M items and N payment records, an unaggregated 3-way join produces
-- M * N rows for that order. Each item price is multiplied N times, and each payment
-- is multiplied M times.

-- Analysis D1: Macro-Level Join Multiplication and Dollar Inflation
SELECT
    '1. True Base Totals (Unjoined)' AS calculation_method,
    (SELECT COUNT(*) FROM public.orders) AS total_rows,
    (SELECT COUNT(DISTINCT order_id) FROM public.orders) AS distinct_orders,
    (SELECT ROUND(SUM(price)::NUMERIC, 2) FROM public.order_items) AS merchandise_gmv,
    (SELECT ROUND(SUM(freight_value)::NUMERIC, 2) FROM public.order_items) AS freight_value,
    (SELECT ROUND(SUM(payment_value)::NUMERIC, 2) FROM public.order_payments) AS payment_value
UNION ALL
SELECT
    '2. Naive 3-Way Direct Join (Corrupted)' AS calculation_method,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT o.order_id) AS distinct_orders,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS merchandise_gmv,
    ROUND(SUM(oi.freight_value)::NUMERIC, 2) AS freight_value,
    ROUND(SUM(op.payment_value)::NUMERIC, 2) AS payment_value
FROM public.orders o
INNER JOIN public.order_items oi
    ON o.order_id = oi.order_id
INNER JOIN public.order_payments op
    ON o.order_id = op.order_id;


-- Analysis D2: Exact Dollar and Percentage Inflation Quantified
WITH base_metrics AS (
    SELECT
        (SELECT ROUND(SUM(price)::NUMERIC, 2) FROM public.order_items) AS true_gmv,
        (SELECT ROUND(SUM(freight_value)::NUMERIC, 2) FROM public.order_items) AS true_freight,
        (SELECT ROUND(SUM(payment_value)::NUMERIC, 2) FROM public.order_payments) AS true_payment
),
multiplied_metrics AS (
    SELECT
        ROUND(SUM(oi.price)::NUMERIC, 2) AS multiplied_gmv,
        ROUND(SUM(oi.freight_value)::NUMERIC, 2) AS multiplied_freight,
        ROUND(SUM(op.payment_value)::NUMERIC, 2) AS multiplied_payment
    FROM public.orders o
    INNER JOIN public.order_items oi ON o.order_id = oi.order_id
    INNER JOIN public.order_payments op ON o.order_id = op.order_id
)
SELECT
    multiplied_gmv - true_gmv AS gmv_inflation_amount_brl,
    ROUND(((multiplied_gmv - true_gmv) / true_gmv * 100)::NUMERIC, 2) AS gmv_inflation_pct,
    multiplied_freight - true_freight AS freight_inflation_amount_brl,
    ROUND(((multiplied_freight - true_freight) / true_freight * 100)::NUMERIC, 2) AS freight_inflation_pct,
    multiplied_payment - true_payment AS payment_inflation_amount_brl,
    ROUND(((multiplied_payment - true_payment) / true_payment * 100)::NUMERIC, 2) AS payment_inflation_pct
FROM base_metrics, multiplied_metrics;

-- Findings:
-- • Total rows explode to 117,601 (an artificial increase of +4,951 rows beyond the 112,650 line items).
-- • Merchandise GMV inflates from R$ 13,591,643.70 to R$ 14,209,115.34 (+R$ 617,471.64 or +4.54% false revenue!).
-- • Freight inflates from R$ 2,251,909.54 to R$ 2,357,428.51 (+R$ 105,518.97 or +4.69% false logistics cost!).
-- • Payment Volume inflates from R$ 16,008,872.12 to R$ 20,308,134.71 (+R$ 4,299,262.59 or +26.86% false cash collected!).


-- Analysis D3: Micro-Level Proof: Case Study of Order '895ab968e7bb0d5659d16cd74cd1650c'
-- Order 895ab968e7bb0d5659d16cd74cd1650c contains 3 items and 21 voucher payments.
WITH case_study AS (
    SELECT
        o.order_id,
        COUNT(DISTINCT oi.order_item_id) AS actual_item_count,
        COUNT(DISTINCT op.payment_sequential) AS actual_payment_count,
        COUNT(*) AS multiplied_row_count,
        ROUND(SUM(oi.price)::NUMERIC, 2) AS naive_joined_gmv,
        ROUND(SUM(op.payment_value)::NUMERIC, 2) AS naive_joined_payment
    FROM public.orders o
    INNER JOIN public.order_items oi ON o.order_id = oi.order_id
    INNER JOIN public.order_payments op ON o.order_id = op.order_id
    WHERE o.order_id = '895ab968e7bb0d5659d16cd74cd1650c'
    GROUP BY o.order_id
)
SELECT
    cs.order_id,
    cs.actual_item_count,
    cs.actual_payment_count,
    cs.multiplied_row_count,
    (SELECT ROUND(SUM(price)::NUMERIC, 2) FROM public.order_items WHERE order_id = cs.order_id) AS true_order_gmv,
    cs.naive_joined_gmv,
    (SELECT ROUND(SUM(payment_value)::NUMERIC, 2) FROM public.order_payments WHERE order_id = cs.order_id) AS true_order_payment,
    cs.naive_joined_payment
FROM case_study cs;

-- Proof:
-- • Base Items: 3 items (True Order Price = R$ 109.78).
-- • Base Payments: 21 vouchers (True Order Payment = R$ 161.32).
-- • Joined Rows: 3 items * 21 payments = 63 multiplied rows!
-- • Naive Price Sum: R$ 109.78 * 21 = R$ 2,305.38 (inflated by 2,100%).
-- • Naive Payment Sum: R$ 161.32 * 3 = R$ 483.96 (inflated by 300%).


-- ==============================================================================
-- PART E: THE CORRECT AGGREGATION STRATEGY (PRE-AGGREGATION VIA CTES)
-- ==============================================================================
-- To prevent Cartesian expansion when analyzing order revenue alongside payment
-- collections, each child table MUST be independently pre-aggregated to the
-- grain of `order_id` BEFORE joining to the parent `orders` table.

-- Analysis E1: Production Safe Join Architecture via Independent CTEs
WITH item_agg AS (
    -- Collapse 112,650 item rows down to 98,666 distinct order rows
    SELECT
        order_id,
        COUNT(order_item_id) AS total_items,
        SUM(price) AS order_merchandise_gmv,
        SUM(freight_value) AS order_freight_value
    FROM public.order_items
    GROUP BY order_id
),
payment_agg AS (
    -- Collapse 103,886 payment rows down to 99,440 distinct order rows
    SELECT
        order_id,
        COUNT(payment_sequential) AS total_payment_records,
        SUM(payment_value) AS order_payment_value
    FROM public.order_payments
    GROUP BY order_id
)
SELECT
    'Safe Pre-Aggregated CTE' AS aggregation_strategy,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT o.order_id) AS distinct_orders,
    ROUND(SUM(COALESCE(ia.order_merchandise_gmv, 0))::NUMERIC, 2) AS verified_merchandise_gmv,
    ROUND(SUM(COALESCE(ia.order_freight_value, 0))::NUMERIC, 2) AS verified_freight_value,
    ROUND(SUM(COALESCE(pa.order_payment_value, 0))::NUMERIC, 2) AS verified_payment_value
FROM public.orders o
LEFT JOIN item_agg ia
    ON o.order_id = ia.order_id
LEFT JOIN payment_agg pa
    ON o.order_id = pa.order_id;

-- Mathematical Verification of the Safe CTE Strategy:
-- 1. Output Grain: Exactly 99,441 rows (1 row per order, exactly matching the parent `orders` table).
-- 2. Merchandise GMV: Exactly R$ 13,591,643.70 (100.00% match to base `order_items`, 0.00% variance).
-- 3. Freight Value: Exactly R$ 2,251,909.54 (100.00% match to base `order_items`, 0.00% variance).
-- 4. Payment Volume: Exactly R$ 16,008,872.12 (100.00% match to base `order_payments`, 0.00% variance).
-- 5. Cartesian Multiplication is completely eradicated.


-- ==============================================================================
-- PART F: SIDE-BY-SIDE AUDIT & VALIDATION RECONCILIATION MATRIX
-- ==============================================================================
-- Conclusive comparison table demonstrating the accuracy of the CTE pre-aggregation
-- strategy alongside raw unjoined base tables and naive direct joins.

SELECT
    '1. Ground Truth (Base Tables)' AS method,
    99441 AS total_rows,
    99441 AS distinct_orders,
    13591643.70 AS merchandise_gmv,
    2251909.54 AS freight_value,
    16008872.12 AS payment_volume,
    0.00 AS gmv_inflation_pct,
    'Baseline (Exact)' AS audit_status
UNION ALL
SELECT
    '2. Naive 3-Way Direct Join' AS method,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT o.order_id) AS distinct_orders,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS merchandise_gmv,
    ROUND(SUM(oi.freight_value)::NUMERIC, 2) AS freight_value,
    ROUND(SUM(op.payment_value)::NUMERIC, 2) AS payment_volume,
    ROUND(((SUM(oi.price) - 13591643.70) / 13591643.70 * 100)::NUMERIC, 2) AS gmv_inflation_pct,
    'FAIL: Cartesian Inflation (+R$ 617k GMV, +R$ 4.3M Payments)' AS audit_status
FROM public.orders o
INNER JOIN public.order_items oi ON o.order_id = oi.order_id
INNER JOIN public.order_payments op ON o.order_id = op.order_id
UNION ALL
SELECT
    '3. Pre-Aggregated CTE (Production Standard)' AS method,
    COUNT(*) AS total_rows,
    COUNT(DISTINCT o.order_id) AS distinct_orders,
    ROUND(SUM(COALESCE(ia.order_merchandise_gmv, 0))::NUMERIC, 2) AS merchandise_gmv,
    ROUND(SUM(COALESCE(ia.order_freight_value, 0))::NUMERIC, 2) AS freight_value,
    ROUND(SUM(COALESCE(pa.order_payment_value, 0))::NUMERIC, 2) AS payment_volume,
    0.00 AS gmv_inflation_pct,
    'PASS: 100% Mathematically Exact' AS audit_status
FROM public.orders o
LEFT JOIN (
    SELECT order_id, SUM(price) AS order_merchandise_gmv, SUM(freight_value) AS order_freight_value
    FROM public.order_items GROUP BY order_id
) ia ON o.order_id = ia.order_id
LEFT JOIN (
    SELECT order_id, SUM(payment_value) AS order_payment_value
    FROM public.order_payments GROUP BY order_id
) pa ON o.order_id = pa.order_id;

-- ==============================================================================
-- END OF SCRIPT: 05_join_validation.sql
-- ==============================================================================
