-- Business Question 1:
-- What are the total revenue, paid order count,
-- and average order value?

WITH order_revenue AS (
    SELECT
        order_id,
        SUM(payment_value) AS order_total
    FROM order_payments
    GROUP BY order_id
)

SELECT
    ROUND(SUM(order_total)::NUMERIC, 2) AS total_revenue,
    COUNT(*) AS orders_with_payments,
    ROUND(AVG(order_total)::NUMERIC, 2) AS average_order_value
FROM order_revenue;

-- Business Question 2:
-- How much revenue did the business generate each month?

SELECT
    DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
    ROUND(SUM(p.payment_value)::NUMERIC, 2) AS monthly_revenue,
    COUNT(DISTINCT o.order_id) AS total_orders
FROM orders o
INNER JOIN order_payments p
    ON o.order_id = p.order_id
GROUP BY DATE_TRUNC('month', o.order_purchase_timestamp)
ORDER BY sales_month;

-- Business Question 3:
-- Which 10 products generate the highest sales revenue?

SELECT
    p.product_id,
    COALESCE(
        ct.product_category_name_english,
        p.product_category_name,
        'Unknown'
    ) AS product_category,
    COUNT(*) AS units_sold,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS total_sales_revenue
FROM order_items oi
INNER JOIN products p
    ON oi.product_id = p.product_id
LEFT JOIN category_translation ct
    ON p.product_category_name = ct.product_category_name
GROUP BY
    p.product_id,
    ct.product_category_name_english,
    p.product_category_name
ORDER BY total_sales_revenue DESC
LIMIT 10;

-- Business Question 4:
-- Which product categories generate the highest revenue?

SELECT
    COALESCE(
        ct.product_category_name_english,
        p.product_category_name,
        'Unknown'
    ) AS product_category,
    COUNT(DISTINCT oi.order_id) AS total_orders,
    COUNT(*) AS units_sold,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS total_revenue,
    ROUND(AVG(oi.price)::NUMERIC, 2) AS average_product_price
FROM order_items oi
INNER JOIN products p
    ON oi.product_id = p.product_id
LEFT JOIN category_translation ct
    ON p.product_category_name = ct.product_category_name
GROUP BY
    ct.product_category_name_english,
    p.product_category_name
ORDER BY total_revenue DESC;


-- Business Question 5:
-- Which Brazilian states generate the highest sales revenue?

SELECT
    c.customer_state AS state,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COUNT(*) AS units_sold,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS total_revenue,
    ROUND(AVG(oi.price)::NUMERIC, 2) AS average_item_price
FROM orders o
INNER JOIN customers c
    ON o.customer_id = c.customer_id
INNER JOIN order_items oi
    ON o.order_id = oi.order_id
GROUP BY c.customer_state
ORDER BY total_revenue DESC;


-- Business Question 6:
-- What is the distribution of orders by status?

SELECT
    order_status,
    COUNT(order_id) AS total_orders,
    ROUND(
        COUNT(order_id) * 100.0 /
        SUM(COUNT(order_id)) OVER (),
        2
    ) AS percentage_of_orders
FROM orders
GROUP BY order_status
ORDER BY total_orders DESC;


-- Business Question 7:
-- Which payment methods are most popular and
-- how much payment value does each method generate?

SELECT
    payment_type,
    COUNT(*) AS total_payment_records,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(SUM(payment_value)::NUMERIC, 2) AS total_payment_value,
    ROUND(AVG(payment_value)::NUMERIC, 2) AS average_payment_value
FROM order_payments
GROUP BY payment_type
ORDER BY total_payment_value DESC;


-- Business Question 8:
-- How much revenue does each product category generate monthly?

SELECT
    DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
    COALESCE(
        ct.product_category_name_english,
        p.product_category_name,
        'Unknown'
    ) AS product_category,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COUNT(*) AS units_sold,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS monthly_revenue
FROM orders o
INNER JOIN order_items oi
    ON o.order_id = oi.order_id
INNER JOIN products p
    ON oi.product_id = p.product_id
LEFT JOIN category_translation ct
    ON p.product_category_name = ct.product_category_name
GROUP BY
    DATE_TRUNC('month', o.order_purchase_timestamp),
    ct.product_category_name_english,
    p.product_category_name
ORDER BY sales_month, monthly_revenue DESC;


-- Business Question 9:
-- Which Brazilian cities generate the highest sales revenue?

SELECT
    c.customer_city,
    c.customer_state,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COUNT(*) AS units_sold,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS total_revenue
FROM orders o
INNER JOIN customers c
    ON o.customer_id = c.customer_id
INNER JOIN order_items oi
    ON o.order_id = oi.order_id
GROUP BY
    c.customer_city,
    c.customer_state
ORDER BY total_revenue DESC
LIMIT 20;


-- Business Question 10:
-- What is the average order value by customer state?

WITH order_totals AS (
    SELECT
        o.order_id,
        c.customer_state,
        SUM(oi.price) AS order_value
    FROM orders o
    INNER JOIN customers c
        ON o.customer_id = c.customer_id
    INNER JOIN order_items oi
        ON o.order_id = oi.order_id
    GROUP BY
        o.order_id,
        c.customer_state
)

SELECT
    customer_state,
    COUNT(*) AS total_orders,
    ROUND(SUM(order_value)::NUMERIC, 2) AS total_revenue,
    ROUND(AVG(order_value)::NUMERIC, 2) AS average_order_value
FROM order_totals
GROUP BY customer_state
ORDER BY average_order_value DESC;


-- BUSINESS QUESTION 12:
-- Which products have the highest average selling prices?

SELECT
    oi.product_id,
    COUNT(*) AS units_sold,
    ROUND(AVG(oi.price)::NUMERIC, 2) AS average_selling_price,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS total_revenue
FROM order_items oi
GROUP BY oi.product_id
ORDER BY average_selling_price DESC
LIMIT 20;


-- BUSINESS QUESTION 13:
-- Which product categories have the highest average selling prices?

SELECT
    COALESCE(
        ct.product_category_name_english,
        p.product_category_name,
        'Unknown'
    ) AS product_category,
    COUNT(*) AS units_sold,
    ROUND(AVG(oi.price)::NUMERIC, 2) AS average_price,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS total_revenue
FROM order_items oi
JOIN products p
    ON oi.product_id = p.product_id
LEFT JOIN category_translation ct
    ON p.product_category_name = ct.product_category_name
GROUP BY
    ct.product_category_name_english,
    p.product_category_name
ORDER BY average_price DESC;


-- BUSINESS QUESTION 14:
-- How many items are purchased per order on average?

WITH order_items_count AS (
    SELECT
        order_id,
        COUNT(*) AS total_items
    FROM order_items
    GROUP BY order_id
)
SELECT
    COUNT(*) AS total_orders,
    SUM(total_items) AS total_items_sold,
    ROUND(AVG(total_items)::NUMERIC, 2) AS average_items_per_order
FROM order_items_count;


-- BUSINESS QUESTION 15:
-- What is the monthly order volume?

SELECT
    DATE_TRUNC('month', order_purchase_timestamp) AS sales_month,
    COUNT(*) AS total_orders
FROM orders
GROUP BY DATE_TRUNC('month', order_purchase_timestamp)
ORDER BY sales_month;


-- BUSINESS QUESTION 16:
-- What is the monthly freight and shipping cost?

SELECT
    DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
    COUNT(DISTINCT oi.order_id) AS total_orders,
    ROUND(SUM(oi.freight_value)::NUMERIC, 2) AS total_freight,
    ROUND(AVG(oi.freight_value)::NUMERIC, 2) AS average_freight_per_item
FROM orders o
JOIN order_items oi
    ON o.order_id = oi.order_id
GROUP BY DATE_TRUNC('month', o.order_purchase_timestamp)
ORDER BY sales_month;


-- BUSINESS QUESTION 17:
-- What is the distribution of payment installments?

SELECT
    payment_installments,
    COUNT(*) AS payment_records,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(SUM(payment_value)::NUMERIC, 2) AS total_payment_value,
    ROUND(AVG(payment_value)::NUMERIC, 2) AS average_payment_value
FROM order_payments
GROUP BY payment_installments
ORDER BY payment_installments;


-- BUSINESS QUESTION 18:
-- Which days of the week generate the most orders?

SELECT
    TO_CHAR(order_purchase_timestamp, 'Day') AS purchase_day,
    EXTRACT(DOW FROM order_purchase_timestamp) AS day_number,
    COUNT(*) AS total_orders
FROM orders
GROUP BY
    TO_CHAR(order_purchase_timestamp, 'Day'),
    EXTRACT(DOW FROM order_purchase_timestamp)
ORDER BY day_number;


-- BUSINESS QUESTION 19:
-- Which product categories have the highest number of distinct products sold?

SELECT
    COALESCE(
        ct.product_category_name_english,
        p.product_category_name,
        'Unknown'
    ) AS product_category,
    COUNT(DISTINCT p.product_id) AS distinct_products,
    COUNT(*) AS units_sold,
    ROUND(SUM(oi.price)::NUMERIC, 2) AS total_revenue
FROM order_items oi
JOIN products p
    ON oi.product_id = p.product_id
LEFT JOIN category_translation ct
    ON p.product_category_name = ct.product_category_name
GROUP BY
    ct.product_category_name_english,
    p.product_category_name
ORDER BY distinct_products DESC;


-- BUSINESS QUESTION 20:
-- What percentage of total payment value comes from each payment method?

WITH payment_totals AS (
    SELECT
        payment_type,
        SUM(payment_value) AS method_total
    FROM order_payments
    GROUP BY payment_type
)
SELECT
    payment_type,
    ROUND(method_total::NUMERIC, 2) AS payment_value,
    ROUND(
        method_total * 100.0 /
        NULLIF(SUM(method_total) OVER (), 0),
        2
    ) AS percentage_of_total
FROM payment_totals
ORDER BY method_total DESC;



