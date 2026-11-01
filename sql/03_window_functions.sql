
-- Q31. MONTH-OVER-MONTH REVENUE GROWTH
-- Business Question:
-- How much does monthly product sales revenue grow or decline?

WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
        SUM(oi.price) AS revenue
    FROM public.orders o
    INNER JOIN public.order_items oi
        ON o.order_id = oi.order_id
    GROUP BY 1
),
revenue_comparison AS (
    SELECT
        sales_month,
        revenue,
        LAG(revenue) OVER (ORDER BY sales_month) AS previous_month_revenue
    FROM monthly_revenue
)
SELECT
    sales_month,
    ROUND(revenue::NUMERIC, 2) AS current_revenue,
    ROUND(previous_month_revenue::NUMERIC, 2) AS previous_revenue,
    ROUND(
        ((revenue - previous_month_revenue)
        / NULLIF(previous_month_revenue, 0) * 100)::NUMERIC,
        2
    ) AS growth_percentage
FROM revenue_comparison
ORDER BY sales_month;


-- Q32. RUNNING TOTAL OF MONTHLY REVENUE
-- Business Question:
-- How does cumulative product sales revenue increase over time?

WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
        SUM(oi.price) AS revenue
    FROM public.orders o
    INNER JOIN public.order_items oi
        ON o.order_id = oi.order_id
    GROUP BY 1
)
SELECT
    sales_month,
    ROUND(revenue::NUMERIC, 2) AS monthly_revenue,
    ROUND(
        SUM(revenue) OVER (
            ORDER BY sales_month
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        )::NUMERIC,
        2
    ) AS cumulative_revenue
FROM monthly_revenue
ORDER BY sales_month;


-- Q33. TOP 3 PRODUCTS IN EACH CATEGORY
-- Business Question:
-- Which three products generate the highest sales in each category?

WITH product_revenue AS (
    SELECT
        p.product_id,
        COALESCE(
            ct.product_category_name_english,
            p.product_category_name,
            'Unknown'
        ) AS category,
        SUM(oi.price) AS total_revenue
    FROM public.order_items oi
    INNER JOIN public.products p
        ON oi.product_id = p.product_id
    LEFT JOIN public.category_translation ct
        ON p.product_category_name = ct.product_category_name
    GROUP BY p.product_id, category
),
ranked_products AS (
    SELECT
        product_id,
        category,
        total_revenue,
        ROW_NUMBER() OVER (
            PARTITION BY category
            ORDER BY total_revenue DESC, product_id
        ) AS product_rank
    FROM product_revenue
)
SELECT
    product_id,
    category,
    ROUND(total_revenue::NUMERIC, 2) AS total_revenue,
    product_rank
FROM ranked_products
WHERE product_rank <= 3
ORDER BY category, product_rank;


-- Q34. RANK CUSTOMER STATES BY REVENUE
-- Business Question:
-- Which Brazilian states generate the highest product sales revenue?

WITH state_revenue AS (
    SELECT
        c.customer_state,
        SUM(oi.price) AS total_revenue
    FROM public.orders o
    INNER JOIN public.customers c
        ON o.customer_id = c.customer_id
    INNER JOIN public.order_items oi
        ON o.order_id = oi.order_id
    GROUP BY c.customer_state
)
SELECT
    customer_state,
    ROUND(total_revenue::NUMERIC, 2) AS total_revenue,
    RANK() OVER (
        ORDER BY total_revenue DESC
    ) AS revenue_rank
FROM state_revenue
ORDER BY revenue_rank;


-- Q35. THREE-MONTH MOVING AVERAGE REVENUE
-- Business Question:
-- What is the average revenue over the current and previous two months?

WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
        SUM(oi.price) AS revenue
    FROM public.orders o
    INNER JOIN public.order_items oi
        ON o.order_id = oi.order_id
    GROUP BY 1
)
SELECT
    sales_month,
    ROUND(revenue::NUMERIC, 2) AS monthly_revenue,
    ROUND(
        AVG(revenue) OVER (
            ORDER BY sales_month
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        )::NUMERIC,
        2
    ) AS three_month_moving_average
FROM monthly_revenue
ORDER BY sales_month;


-- Q36. CUSTOMER PURCHASE SEQUENCE
-- Business Question:
-- What is the sequence of purchases made by each customer?

WITH customer_purchase_sequence AS (
    SELECT
        c.customer_unique_id,
        o.order_id,
        o.order_purchase_timestamp,
        ROW_NUMBER() OVER (
            PARTITION BY c.customer_unique_id
            ORDER BY o.order_purchase_timestamp, o.order_id
        ) AS purchase_number,
        LAG(o.order_purchase_timestamp) OVER (
            PARTITION BY c.customer_unique_id
            ORDER BY o.order_purchase_timestamp, o.order_id
        ) AS previous_purchase_date
    FROM public.orders o
    INNER JOIN public.customers c
        ON o.customer_id = c.customer_id
)
SELECT
    customer_unique_id,
    order_id,
    order_purchase_timestamp,
    purchase_number,
    previous_purchase_date,
    CASE
        WHEN previous_purchase_date IS NULL THEN NULL
        ELSE EXTRACT(
            EPOCH FROM (
                order_purchase_timestamp - previous_purchase_date
            )
        ) / 86400
    END AS days_since_previous_purchase
FROM customer_purchase_sequence
ORDER BY customer_unique_id, purchase_number
LIMIT 1000;


-- Q37. RANK ORDERS BY VALUE WITHIN EACH STATE
-- Business Question:
-- What are the highest-value orders in each customer state?

WITH order_values AS (
    SELECT
        o.order_id,
        c.customer_state,
        SUM(oi.price) AS order_value
    FROM public.orders o
    INNER JOIN public.customers c
        ON o.customer_id = c.customer_id
    INNER JOIN public.order_items oi
        ON o.order_id = oi.order_id
    GROUP BY o.order_id, c.customer_state
),
ranked_orders AS (
    SELECT
        order_id,
        customer_state,
        order_value,
        DENSE_RANK() OVER (
            PARTITION BY customer_state
            ORDER BY order_value DESC
        ) AS state_order_rank
    FROM order_values
)
SELECT
    order_id,
    customer_state,
    ROUND(order_value::NUMERIC, 2) AS order_value,
    state_order_rank
FROM ranked_orders
WHERE state_order_rank <= 5
ORDER BY customer_state, state_order_rank;


-- Q38. CATEGORY MONTHLY REVENUE AND RUNNING TOTAL
-- Business Question:
-- How does each product category's cumulative revenue change over time?

WITH category_monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
        COALESCE(
            ct.product_category_name_english,
            p.product_category_name,
            'Unknown'
        ) AS category,
        SUM(oi.price) AS monthly_revenue
    FROM public.orders o
    INNER JOIN public.order_items oi
        ON o.order_id = oi.order_id
    INNER JOIN public.products p
        ON oi.product_id = p.product_id
    LEFT JOIN public.category_translation ct
        ON p.product_category_name = ct.product_category_name
    GROUP BY 1, 2
)
SELECT
    category,
    sales_month,
    ROUND(monthly_revenue::NUMERIC, 2) AS monthly_revenue,
    ROUND(
        SUM(monthly_revenue) OVER (
            PARTITION BY category
            ORDER BY sales_month
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        )::NUMERIC,
        2
    ) AS category_cumulative_revenue
FROM category_monthly_revenue
ORDER BY category, sales_month;


-- Q39. PAYMENT TYPE SHARE OF TOTAL PAYMENT VALUE
-- Business Question:
-- What percentage of total payment value comes from each payment type?

WITH payment_type_revenue AS (
    SELECT
        payment_type,
        SUM(payment_value) AS total_payment_value
    FROM public.order_payments
    GROUP BY payment_type
)
SELECT
    payment_type,
    ROUND(total_payment_value::NUMERIC, 2) AS payment_value,
    ROUND(
        (
            total_payment_value
            / NULLIF(SUM(total_payment_value) OVER (), 0)
            * 100
        )::NUMERIC,
        2
    ) AS percentage_of_total
FROM payment_type_revenue
ORDER BY total_payment_value DESC;


-- Q40. RANK SELLERS BY MONTHLY REVENUE
-- Business Question:
-- Which sellers perform best each month?

WITH seller_monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
        oi.seller_id,
        SUM(oi.price) AS monthly_revenue
    FROM public.orders o
    INNER JOIN public.order_items oi
        ON o.order_id = oi.order_id
    GROUP BY 1, 2
),
ranked_sellers AS (
    SELECT
        sales_month,
        seller_id,
        monthly_revenue,
        DENSE_RANK() OVER (
            PARTITION BY sales_month
            ORDER BY monthly_revenue DESC
        ) AS seller_rank
    FROM seller_monthly_revenue
)
SELECT
    sales_month,
    seller_id,
    ROUND(monthly_revenue::NUMERIC, 2) AS monthly_revenue,
    seller_rank
FROM ranked_sellers
WHERE seller_rank <= 5
ORDER BY sales_month, seller_rank;

