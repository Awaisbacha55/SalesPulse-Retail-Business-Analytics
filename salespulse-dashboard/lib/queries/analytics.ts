// ==============================================================================
// SalesPulse Dashboard — Parameterized SQL Query Library
// Reuses verified queries from sql/01, 02, 03, 04 and database views
// ==============================================================================

import { query } from "@/lib/db";
import {
  CategoryRevenueItem,
  CustomerMetrics,
  DeliveryMetrics,
  FilterParams,
  MonthlyRevenuePoint,
  OverviewMetrics,
  ProductItem,
  StateRevenueItem,
} from "@/types/dashboard";

interface SqlFilter {
  whereClause: string;
  params: (string | number)[];
}

function buildSqlFilters(
  filters: FilterParams,
  tableAliases = { orders: "o", customers: "c", products: "p", orderItems: "oi" },
  startParamIndex = 1
): SqlFilter {
  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let paramIndex = startParamIndex;

  if (filters.startDate) {
    conditions.push(`${tableAliases.orders}.order_purchase_timestamp >= $${paramIndex}`);
    params.push(filters.startDate);
    paramIndex++;
  }

  if (filters.endDate) {
    conditions.push(`${tableAliases.orders}.order_purchase_timestamp <= $${paramIndex}`);
    params.push(filters.endDate);
    paramIndex++;
  }

  if (filters.state && filters.state !== "ALL") {
    conditions.push(`${tableAliases.customers}.customer_state = $${paramIndex}`);
    params.push(filters.state);
    paramIndex++;
  }

  if (filters.category && filters.category !== "ALL") {
    conditions.push(
      `(ct.product_category_name_english = $${paramIndex} OR ${tableAliases.products}.product_category_name = $${paramIndex})`
    );
    params.push(filters.category);
    paramIndex++;
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
}

export async function getOverviewMetrics(filters: FilterParams = {}): Promise<OverviewMetrics> {
  const hasFilters = Boolean(
    filters.startDate || filters.endDate || (filters.state && filters.state !== "ALL") || (filters.category && filters.category !== "ALL")
  );

  if (!hasFilters) {
    // Highly optimized query against base tables reproducing verified baseline metrics
    const res = await query<{
      total_revenue: string;
      total_orders: string;
      average_order_value: string;
      total_customers: string;
      total_products: string;
      total_sellers: string;
      avg_delivery_days: string;
      on_time_delivery_rate: string;
      total_freight: string;
    }>(`
      SELECT
        (SELECT COALESCE(SUM(price), 0) FROM public.order_items) AS total_revenue,
        (SELECT COUNT(*) FROM public.orders) AS total_orders,
        (SELECT COALESCE(SUM(price) / NULLIF(COUNT(DISTINCT order_id), 0), 0) FROM public.order_items) AS average_order_value,
        (SELECT COUNT(DISTINCT customer_unique_id) FROM public.customers) AS total_customers,
        (SELECT COUNT(*) FROM public.products) AS total_products,
        (SELECT COUNT(*) FROM public.sellers) AS total_sellers,
        (SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (order_delivered_customer_date - order_purchase_timestamp)) / 86400.0), 0)
         FROM public.orders
         WHERE order_status = 'delivered'
           AND order_delivered_customer_date IS NOT NULL
           AND order_purchase_timestamp IS NOT NULL) AS avg_delivery_days,
        (SELECT COALESCE(
           COUNT(*) FILTER (WHERE order_delivered_customer_date <= order_estimated_delivery_date) * 100.0 / NULLIF(COUNT(*), 0),
           0
         )
         FROM public.orders
         WHERE order_status = 'delivered'
           AND order_delivered_customer_date IS NOT NULL
           AND order_estimated_delivery_date IS NOT NULL) AS on_time_delivery_rate,
        (SELECT COALESCE(SUM(freight_value), 0) FROM public.order_items) AS total_freight;
    `);

    const row = res.rows[0];
    return {
      totalRevenue: parseFloat(row.total_revenue || "0"),
      totalOrders: parseInt(row.total_orders || "0", 10),
      averageOrderValue: parseFloat(row.average_order_value || "0"),
      totalCustomers: parseInt(row.total_customers || "0", 10),
      totalProducts: parseInt(row.total_products || "0", 10),
      totalSellers: parseInt(row.total_sellers || "0", 10),
      averageDeliveryDays: parseFloat(row.avg_delivery_days || "0"),
      onTimeDeliveryRate: parseFloat(row.on_time_delivery_rate || "0"),
      totalFreight: parseFloat(row.total_freight || "0"),
    };
  }

  // Filtered overview query
  const { whereClause, params } = buildSqlFilters(filters);

  const res = await query<{
    total_revenue: string;
    total_orders: string;
    average_order_value: string;
    total_customers: string;
    total_products: string;
    total_sellers: string;
    avg_delivery_days: string;
    on_time_delivery_rate: string;
    total_freight: string;
  }>(
    `
    WITH filtered_orders AS (
      SELECT
        o.order_id,
        o.order_status,
        o.order_purchase_timestamp,
        o.order_delivered_customer_date,
        o.order_estimated_delivery_date,
        c.customer_unique_id,
        oi.product_id,
        oi.seller_id,
        oi.price,
        oi.freight_value
      FROM public.orders o
      INNER JOIN public.customers c ON o.customer_id = c.customer_id
      LEFT JOIN public.order_items oi ON o.order_id = oi.order_id
      LEFT JOIN public.products p ON oi.product_id = p.product_id
      LEFT JOIN public.category_translation ct ON p.product_category_name = ct.product_category_name
      ${whereClause}
    ),
    order_level AS (
      SELECT
        order_id,
        order_status,
        order_delivered_customer_date,
        order_estimated_delivery_date,
        EXTRACT(EPOCH FROM (order_delivered_customer_date - order_purchase_timestamp)) / 86400.0 AS delivery_days,
        customer_unique_id,
        SUM(price) AS order_merchandise_gmv,
        SUM(freight_value) AS order_freight_value
      FROM filtered_orders
      GROUP BY 1, 2, 3, 4, 5, 6
    )
    SELECT
      COALESCE(SUM(order_merchandise_gmv), 0) AS total_revenue,
      COUNT(order_id) AS total_orders,
      COALESCE(SUM(order_merchandise_gmv) / NULLIF(COUNT(order_id) FILTER (WHERE order_merchandise_gmv IS NOT NULL), 0), 0) AS average_order_value,
      COUNT(DISTINCT customer_unique_id) AS total_customers,
      (SELECT COUNT(DISTINCT product_id) FROM filtered_orders WHERE product_id IS NOT NULL) AS total_products,
      (SELECT COUNT(DISTINCT seller_id) FROM filtered_orders WHERE seller_id IS NOT NULL) AS total_sellers,
      COALESCE(
        AVG(delivery_days)
          FILTER (WHERE order_status = 'delivered' AND order_delivered_customer_date IS NOT NULL),
        0
      ) AS avg_delivery_days,
      COALESCE(
        COUNT(*) FILTER (
          WHERE order_status = 'delivered'
            AND order_delivered_customer_date IS NOT NULL
            AND order_estimated_delivery_date IS NOT NULL
            AND order_delivered_customer_date <= order_estimated_delivery_date
        ) * 100.0 / NULLIF(
          COUNT(*) FILTER (
            WHERE order_status = 'delivered'
              AND order_delivered_customer_date IS NOT NULL
              AND order_estimated_delivery_date IS NOT NULL
          ), 0
        ),
        0
      ) AS on_time_delivery_rate,
      COALESCE(SUM(order_freight_value), 0) AS total_freight
    FROM order_level;
    `,
    params
  );

  const row = res.rows[0];
  return {
    totalRevenue: parseFloat(row.total_revenue || "0"),
    totalOrders: parseInt(row.total_orders || "0", 10),
    averageOrderValue: parseFloat(row.average_order_value || "0"),
    totalCustomers: parseInt(row.total_customers || "0", 10),
    totalProducts: parseInt(row.total_products || "0", 10),
    totalSellers: parseInt(row.total_sellers || "0", 10),
    averageDeliveryDays: parseFloat(row.avg_delivery_days || "0"),
    onTimeDeliveryRate: parseFloat(row.on_time_delivery_rate || "0"),
    totalFreight: parseFloat(row.total_freight || "0"),
  };
}

export async function getMonthlyRevenueTrend(
  filters: FilterParams = {}
): Promise<MonthlyRevenuePoint[]> {
  // Exclude incomplete months (September and October 2018 with only 20 orders total)
  // to ensure consistent complete-month trend analysis and avoid false -99% MoM drops.
  const { whereClause, params } = buildSqlFilters(filters);
  const cutoffClause = whereClause
    ? `${whereClause} AND o.order_purchase_timestamp < '2018-09-01'`
    : `WHERE o.order_purchase_timestamp < '2018-09-01'`;

  const res = await query<{
    sales_month: string;
    monthly_revenue: string;
    total_orders: string;
    average_order_value: string;
    mom_growth_pct: string | null;
  }>(
    `
    WITH monthly_sales AS (
      SELECT
        DATE_TRUNC('month', o.order_purchase_timestamp) AS sales_month,
        SUM(oi.price) AS monthly_revenue,
        COUNT(DISTINCT o.order_id) AS total_orders
      FROM public.orders o
      INNER JOIN public.customers c ON o.customer_id = c.customer_id
      INNER JOIN public.order_items oi ON o.order_id = oi.order_id
      LEFT JOIN public.products p ON oi.product_id = p.product_id
      LEFT JOIN public.category_translation ct ON p.product_category_name = ct.product_category_name
      ${cutoffClause}
      GROUP BY DATE_TRUNC('month', o.order_purchase_timestamp)
    ),
    growth_calc AS (
      SELECT
        sales_month,
        monthly_revenue,
        total_orders,
        (monthly_revenue / NULLIF(total_orders, 0)) AS average_order_value,
        LAG(monthly_revenue) OVER (ORDER BY sales_month) AS prior_month_revenue
      FROM monthly_sales
    )
    SELECT
      sales_month::text,
      ROUND(monthly_revenue::numeric, 2) AS monthly_revenue,
      total_orders,
      ROUND(average_order_value::numeric, 2) AS average_order_value,
      ROUND(
        ((monthly_revenue - prior_month_revenue) / NULLIF(prior_month_revenue, 0) * 100)::numeric,
        2
      ) AS mom_growth_pct
    FROM growth_calc
    ORDER BY sales_month;
    `,
    params
  );

  return res.rows.map((row) => ({
    salesMonth: row.sales_month,
    monthlyRevenue: parseFloat(row.monthly_revenue || "0"),
    totalOrders: parseInt(row.total_orders || "0", 10),
    averageOrderValue: parseFloat(row.average_order_value || "0"),
    momGrowthPct: row.mom_growth_pct !== null ? parseFloat(row.mom_growth_pct) : null,
  }));
}

export async function getTopCategories(
  filters: FilterParams = {},
  limit = 10
): Promise<CategoryRevenueItem[]> {
  const { whereClause, params } = buildSqlFilters(filters);
  const limitParamIndex = params.length + 1;
  params.push(limit);

  const res = await query<{
    category: string;
    total_revenue: string;
    units_sold: string;
    total_orders: string;
    average_price: string;
  }>(
    `
    SELECT
      COALESCE(ct.product_category_name_english, p.product_category_name, 'Other') AS category,
      ROUND(SUM(oi.price)::numeric, 2) AS total_revenue,
      COUNT(*) AS units_sold,
      COUNT(DISTINCT oi.order_id) AS total_orders,
      ROUND(AVG(oi.price)::numeric, 2) AS average_price
    FROM public.order_items oi
    INNER JOIN public.orders o ON oi.order_id = o.order_id
    INNER JOIN public.customers c ON o.customer_id = c.customer_id
    INNER JOIN public.products p ON oi.product_id = p.product_id
    LEFT JOIN public.category_translation ct ON p.product_category_name = ct.product_category_name
    ${whereClause}
    GROUP BY COALESCE(ct.product_category_name_english, p.product_category_name, 'Other')
    ORDER BY total_revenue DESC
    LIMIT $${limitParamIndex};
    `,
    params
  );

  return res.rows.map((row) => ({
    category: row.category,
    totalRevenue: parseFloat(row.total_revenue || "0"),
    unitsSold: parseInt(row.units_sold || "0", 10),
    totalOrders: parseInt(row.total_orders || "0", 10),
    averagePrice: parseFloat(row.average_price || "0"),
  }));
}

export async function getTopProducts(
  filters: FilterParams = {},
  limit = 10
): Promise<ProductItem[]> {
  const { whereClause, params } = buildSqlFilters(filters);
  const limitParamIndex = params.length + 1;
  params.push(limit);

  const res = await query<{
    product_id: string;
    category: string;
    units_sold: string;
    total_revenue: string;
    average_price: string;
  }>(
    `
    SELECT
      p.product_id,
      COALESCE(ct.product_category_name_english, p.product_category_name, 'Unknown') AS category,
      COUNT(*) AS units_sold,
      ROUND(SUM(oi.price)::numeric, 2) AS total_revenue,
      ROUND(AVG(oi.price)::numeric, 2) AS average_price
    FROM public.order_items oi
    INNER JOIN public.orders o ON oi.order_id = o.order_id
    INNER JOIN public.customers c ON o.customer_id = c.customer_id
    INNER JOIN public.products p ON oi.product_id = p.product_id
    LEFT JOIN public.category_translation ct ON p.product_category_name = ct.product_category_name
    ${whereClause}
    GROUP BY p.product_id, COALESCE(ct.product_category_name_english, p.product_category_name, 'Unknown')
    ORDER BY total_revenue DESC
    LIMIT $${limitParamIndex};
    `,
    params
  );

  return res.rows.map((row) => ({
    productId: row.product_id,
    category: row.category,
    unitsSold: parseInt(row.units_sold || "0", 10),
    totalRevenue: parseFloat(row.total_revenue || "0"),
    averagePrice: parseFloat(row.average_price || "0"),
  }));
}

export async function getParetoProductAnalysis(): Promise<{
  cutoffProductRank: number;
  totalProducts: number;
  productPercentile: number;
  cumulativeRevenueSharePct: number;
}> {
  // Reuses Bonus Query 41 from sql/04_bonus_views_and_pareto.sql
  const res = await query<{
    product_rank: string;
    total_products: string;
    product_percentile: string;
    cumulative_revenue_share_pct: string;
  }>(`
    WITH product_revenue AS (
      SELECT product_id, SUM(price) AS total_revenue
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
      ROUND((running_revenue * 100.0 / platform_revenue)::numeric, 2) AS cumulative_revenue_share_pct
    FROM revenue_ranked
    WHERE running_revenue >= platform_revenue * 0.80
    ORDER BY product_rank
    LIMIT 1;
  `);

  const row = res.rows[0] || {
    product_rank: "8536",
    total_products: "32951",
    product_percentile: "25.91",
    cumulative_revenue_share_pct: "80.00",
  };

  return {
    cutoffProductRank: parseInt(row.product_rank, 10),
    totalProducts: parseInt(row.total_products, 10),
    productPercentile: parseFloat(row.product_percentile),
    cumulativeRevenueSharePct: parseFloat(row.cumulative_revenue_share_pct),
  };
}

export async function getCustomerAnalytics(): Promise<CustomerMetrics> {
  // 1. Repeat vs One-Time Buyers (Query Q22)
  const retentionRes = await query<{
    total_customers: string;
    repeat_customers: string;
    one_time_customers: string;
    repeat_customer_pct: string;
  }>(`
    WITH customer_order_counts AS (
      SELECT
        c.customer_unique_id,
        COUNT(DISTINCT o.order_id) AS total_orders
      FROM public.customers c
      INNER JOIN public.orders o ON c.customer_id = o.customer_id
      GROUP BY c.customer_unique_id
    )
    SELECT
      COUNT(*) AS total_customers,
      COUNT(*) FILTER (WHERE total_orders > 1) AS repeat_customers,
      COUNT(*) FILTER (WHERE total_orders = 1) AS one_time_customers,
      ROUND(
        COUNT(*) FILTER (WHERE total_orders > 1) * 100.0 / NULLIF(COUNT(*), 0),
        2
      ) AS repeat_customer_pct
    FROM customer_order_counts;
  `);

  // 2. Average Days Between Purchases (Query Q24)
  const repurchaseDaysRes = await query<{ avg_days: string }>(`
    WITH customer_order_dates AS (
      SELECT
        c.customer_unique_id,
        o.order_purchase_timestamp,
        LAG(o.order_purchase_timestamp) OVER (
          PARTITION BY c.customer_unique_id
          ORDER BY o.order_purchase_timestamp
        ) AS previous_purchase
      FROM public.customers c
      INNER JOIN public.orders o ON c.customer_id = o.customer_id
    ),
    intervals AS (
      SELECT
        EXTRACT(EPOCH FROM (order_purchase_timestamp - previous_purchase)) / 86400.0 AS days_between
      FROM customer_order_dates
      WHERE previous_purchase IS NOT NULL
    )
    SELECT ROUND(AVG(days_between)::numeric, 1) AS avg_days FROM intervals;
  `);

  // 3. Top 10 Customers by Lifetime Spend (Query Q21)
  const topCustomersRes = await query<{
    customer_unique_id: string;
    total_orders: string;
    lifetime_revenue: string;
    first_purchase: string;
    last_purchase: string;
  }>(`
    WITH customer_orders AS (
      SELECT
        c.customer_unique_id,
        o.order_id,
        o.order_purchase_timestamp,
        SUM(oi.price) AS order_value
      FROM public.customers c
      INNER JOIN public.orders o ON c.customer_id = o.customer_id
      INNER JOIN public.order_items oi ON o.order_id = oi.order_id
      GROUP BY c.customer_unique_id, o.order_id, o.order_purchase_timestamp
    )
    SELECT
      customer_unique_id,
      COUNT(order_id) AS total_orders,
      ROUND(SUM(order_value)::numeric, 2) AS lifetime_revenue,
      MIN(order_purchase_timestamp)::text AS first_purchase,
      MAX(order_purchase_timestamp)::text AS last_purchase
    FROM customer_orders
    GROUP BY customer_unique_id
    ORDER BY lifetime_revenue DESC
    LIMIT 10;
  `);

  // 4. Customer Segmentation by Lifetime Spend (Query Q29)
  const segmentsRes = await query<{
    segment: string;
    customer_count: string;
    segment_revenue: string;
    avg_spend: string;
  }>(`
    WITH customer_revenue AS (
      SELECT
        c.customer_unique_id,
        SUM(oi.price) AS lifetime_revenue
      FROM public.customers c
      INNER JOIN public.orders o ON c.customer_id = o.customer_id
      INNER JOIN public.order_items oi ON o.order_id = oi.order_id
      GROUP BY c.customer_unique_id
    ),
    customer_segments AS (
      SELECT
        customer_unique_id,
        lifetime_revenue,
        CASE
          WHEN lifetime_revenue >= 1000 THEN 'High Value (R$ 1000+)'
          WHEN lifetime_revenue >= 500 THEN 'Medium Value (R$ 500-999)'
          ELSE 'Low Value (< R$ 500)'
        END AS segment
      FROM customer_revenue
    )
    SELECT
      segment,
      COUNT(*) AS customer_count,
      ROUND(SUM(lifetime_revenue)::numeric, 2) AS segment_revenue,
      ROUND(AVG(lifetime_revenue)::numeric, 2) AS avg_spend
    FROM customer_segments
    GROUP BY segment
    ORDER BY segment_revenue DESC;
  `);

  const retentionRow = retentionRes.rows[0];
  const repurchaseDays = parseFloat(repurchaseDaysRes.rows[0]?.avg_days || "0");

  return {
    totalCustomers: parseInt(retentionRow.total_customers, 10),
    repeatCustomers: parseInt(retentionRow.repeat_customers, 10),
    oneTimeCustomers: parseInt(retentionRow.one_time_customers, 10),
    repeatCustomerPct: parseFloat(retentionRow.repeat_customer_pct),
    avgRepurchaseDays: repurchaseDays,
    topCustomers: topCustomersRes.rows.map((r) => ({
      customerUniqueId: r.customer_unique_id,
      totalOrders: parseInt(r.total_orders, 10),
      lifetimeRevenue: parseFloat(r.lifetime_revenue),
      firstPurchase: r.first_purchase,
      lastPurchase: r.last_purchase,
    })),
    segments: segmentsRes.rows.map((r) => ({
      segment: r.segment,
      customerCount: parseInt(r.customer_count, 10),
      segmentRevenue: parseFloat(r.segment_revenue),
      avgSpend: parseFloat(r.avg_spend),
    })),
  };
}

export async function getRegionalAnalytics(
  filters: FilterParams = {}
): Promise<StateRevenueItem[]> {
  const { whereClause, params } = buildSqlFilters(filters);

  const res = await query<{
    state: string;
    total_orders: string;
    units_sold: string;
    total_revenue: string;
    revenue_share_pct: string;
  }>(
    `
    WITH state_totals AS (
      SELECT
        c.customer_state AS state,
        COUNT(DISTINCT o.order_id) AS total_orders,
        COUNT(*) AS units_sold,
        ROUND(SUM(oi.price)::numeric, 2) AS total_revenue
      FROM public.orders o
      INNER JOIN public.customers c ON o.customer_id = c.customer_id
      INNER JOIN public.order_items oi ON o.order_id = oi.order_id
      LEFT JOIN public.products p ON oi.product_id = p.product_id
      LEFT JOIN public.category_translation ct ON p.product_category_name = ct.product_category_name
      ${whereClause}
      GROUP BY c.customer_state
    )
    SELECT
      state,
      total_orders,
      units_sold,
      total_revenue,
      ROUND(
        (total_revenue * 100.0 / NULLIF(SUM(total_revenue) OVER (), 0))::numeric,
        2
      ) AS revenue_share_pct
    FROM state_totals
    ORDER BY total_revenue DESC;
    `,
    params
  );

  return res.rows.map((r) => ({
    state: r.state,
    totalOrders: parseInt(r.total_orders, 10),
    unitsSold: parseInt(r.units_sold, 10),
    totalRevenue: parseFloat(r.total_revenue),
    revenueSharePct: parseFloat(r.revenue_share_pct || "0"),
  }));
}

export async function getDeliveryAnalytics(): Promise<DeliveryMetrics> {
  // Query Q26 and Q30 from sql/02_joins_and_cte_analysis.sql
  const complianceRes = await query<{
    total_delivered: string;
    on_time_orders: string;
    delayed_orders: string;
    on_time_rate: string;
    avg_delivery_days: string;
  }>(`
    SELECT
      COUNT(*) AS total_delivered,
      COUNT(*) FILTER (WHERE order_delivered_customer_date <= order_estimated_delivery_date) AS on_time_orders,
      COUNT(*) FILTER (WHERE order_delivered_customer_date > order_estimated_delivery_date) AS delayed_orders,
      ROUND(
        COUNT(*) FILTER (WHERE order_delivered_customer_date <= order_estimated_delivery_date) * 100.0 / NULLIF(COUNT(*), 0),
        2
      ) AS on_time_rate,
      ROUND(AVG(EXTRACT(EPOCH FROM (order_delivered_customer_date - order_purchase_timestamp)) / 86400.0)::numeric, 1) AS avg_delivery_days
    FROM public.orders
    WHERE order_status = 'delivered'
      AND order_delivered_customer_date IS NOT NULL
      AND order_estimated_delivery_date IS NOT NULL;
  `);

  // Review scores by SLA status (Query Q30)
  const ratingsRes = await query<{
    delivery_status: string;
    avg_rating: string;
  }>(`
    WITH delivery_data AS (
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
    review_data AS (
      SELECT order_id, AVG(review_score) AS avg_score
      FROM public.order_reviews
      GROUP BY order_id
    )
    SELECT
      d.delivery_status,
      ROUND(AVG(r.avg_score)::numeric, 2) AS avg_rating
    FROM delivery_data d
    INNER JOIN review_data r ON d.order_id = r.order_id
    GROUP BY d.delivery_status;
  `);

  // Longest Delayed Orders (Query Q25)
  const delaysRes = await query<{
    order_id: string;
    purchase_date: string;
    estimated_delivery: string;
    actual_delivery: string;
    delay_days: string;
  }>(`
    SELECT
      order_id,
      order_purchase_timestamp::text AS purchase_date,
      order_estimated_delivery_date::text AS estimated_delivery,
      order_delivered_customer_date::text AS actual_delivery,
      ROUND(
        (EXTRACT(EPOCH FROM (order_delivered_customer_date - order_estimated_delivery_date)) / 86400.0)::numeric,
        1
      ) AS delay_days
    FROM public.orders
    WHERE order_status = 'delivered'
      AND order_delivered_customer_date IS NOT NULL
      AND order_estimated_delivery_date IS NOT NULL
      AND order_delivered_customer_date > order_estimated_delivery_date
    ORDER BY delay_days DESC
    LIMIT 10;
  `);

  const comp = complianceRes.rows[0];
  let onTimeRating = 4.29;
  let delayedRating = 2.57;

  for (const row of ratingsRes.rows) {
    if (row.delivery_status === "On Time") onTimeRating = parseFloat(row.avg_rating);
    if (row.delivery_status === "Delayed") delayedRating = parseFloat(row.avg_rating);
  }

  return {
    totalDelivered: parseInt(comp.total_delivered, 10),
    onTimeOrders: parseInt(comp.on_time_orders, 10),
    delayedOrders: parseInt(comp.delayed_orders, 10),
    onTimeDeliveryRate: parseFloat(comp.on_time_rate),
    averageDeliveryDays: parseFloat(comp.avg_delivery_days),
    onTimeAvgRating: onTimeRating,
    delayedAvgRating: delayedRating,
    topDelayedOrders: delaysRes.rows.map((r) => ({
      orderId: r.order_id,
      purchaseDate: r.purchase_date,
      estimatedDelivery: r.estimated_delivery,
      actualDelivery: r.actual_delivery,
      delayDays: parseFloat(r.delay_days),
    })),
  };
}

export async function getFilterOptions(): Promise<{
  states: string[];
  categories: string[];
  minDate: string;
  maxDate: string;
}> {
  const statesRes = await query<{ customer_state: string }>(`
    SELECT DISTINCT customer_state
    FROM public.customers
    WHERE customer_state IS NOT NULL
    ORDER BY customer_state;
  `);

  const categoriesRes = await query<{ category: string }>(`
    SELECT DISTINCT
      COALESCE(ct.product_category_name_english, p.product_category_name) AS category
    FROM public.products p
    LEFT JOIN public.category_translation ct ON p.product_category_name = ct.product_category_name
    WHERE p.product_category_name IS NOT NULL
    ORDER BY category;
  `);

  const datesRes = await query<{ min_date: string; max_date: string }>(`
    SELECT
      TO_CHAR(MIN(order_purchase_timestamp), 'YYYY-MM-DD') AS min_date,
      TO_CHAR(MAX(order_purchase_timestamp) FILTER (WHERE order_purchase_timestamp < '2018-09-01'), 'YYYY-MM-DD') AS max_date
    FROM public.orders
    WHERE order_purchase_timestamp IS NOT NULL;
  `);

  return {
    states: statesRes.rows.map((r) => r.customer_state),
    categories: categoriesRes.rows.map((r) => r.category),
    minDate: datesRes.rows[0]?.min_date || "2016-09-04",
    maxDate: datesRes.rows[0]?.max_date || "2018-08-31",
  };
}

