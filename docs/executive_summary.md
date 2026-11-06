# SalesPulse — Executive Summary

## 1. Business Overview

**SalesPulse** is a retail data engineering and commercial analytics platform built on the real-world Brazilian e-commerce transaction dataset provided by Olist. The platform models the operational flow of over 100,000 retail orders across a normalized **PostgreSQL 17** relational warehouse containing **1,550,922 validated records** across nine entities, evaluated through **56 commercial SQL analyses and views**, and published to an interactive **Metabase Business Intelligence Dashboard**.

The primary objective is to evaluate commercial scale, diagnose customer behavioral funnels, evaluate logistics delivery SLAs, and provide data-driven strategic interventions for e-commerce executive leadership.

### Master KPI Definitions & Ground Truth Scope
To eliminate ambiguity across commercial, financial, and logistics reporting, SalesPulse enforces strict definitional and population boundaries:

1. **Total Placed Orders (`99,441` orders)**: Represents all customer transactions registered in `orders` across all 8 lifecycle statuses: `delivered` (96,478, 97.02%), `shipped` (1,107, 1.11%), `canceled` (625, 0.63%), `unavailable` (609, 0.61%), `invoiced` (314, 0.32%), `processing` (301, 0.30%), `created` (5, 0.01%), and `approved` (2, 0.00%).
2. **Total Delivered Orders (`96,478` orders)**: Represents successfully fulfilled shipments arriving at customer doorsteps (`order_status = 'delivered'`), accounting for 97.02% of all placed orders.
3. **Merchandise GMV (`R$ 13,591,643.70`)**: Calculated strictly as `SUM(order_items.price)`, representing pure item merchandise sales revenue excluding logistics freight. It encompasses all 112,650 line items across 98,666 item-containing orders, including delivered items (R$ 13.22M, 97.28%), shipped items (R$ 150.7k), canceled items (R$ 95.2k), invoiced items (R$ 61.5k), and processing items (R$ 60.4k). *(Note: when filtered to complete operating months `< '2018-09-01'`, GMV is R$ 13,591,498.70, reflecting 1 shipped order of R$ 145.00 in September 2018).*
4. **Delivered Payment Revenue (`R$ 15,422,461.77`)**: Calculated as `SUM(order_payments.payment_value)` where `orders.order_status = 'delivered'`. Represents realized customer cash collections (item price + freight fees) on fulfilled orders. Distinct from total platform payment volume across all statuses (`R$ 16,008,872.12`).
5. **Average Order Value (AOV)**:
   - **Merchandise AOV (Pure Item Basket)**:
\[
\text{Merchandise AOV} = \frac{13,591,643.70}{98,666} = 137.75
\]
   - **Delivered Merchandise AOV**:
\[
\text{Delivered Merchandise AOV} = \frac{13,221,498.11}{96,478} = 137.04
\]
   - **Delivered Payment AOV**:
\[
\text{Delivered Payment AOV} = \frac{15,422,461.77}{96,477} = 159.86
\]
   - **Gross Payment AOV (Q1)**:
\[
\text{Gross Payment AOV} = \frac{16,008,872.12}{99,440} = 160.99
\]
6. **Total Unique Customers (`96,096` individuals)**: Distinct human consumers (`COUNT(DISTINCT customer_unique_id)`). Distinct from order-level purchase session tokens (`customer_id`, 99,441 records).

### Executive KPI Summary Table

| Strategic Metric | Value | Business Definition & Scope | Primary SQL Source |
| :--- | :---: | :--- | :--- |
| **Gross Payment Volume** | **R\$ 16,008,872.12** | Total tender processed (items + freight + installments) across all 99,440 paid orders | `order_payments` (Q1) |
| **Delivered Payment Revenue** | **R\$ 15,422,461.77** | Realized customer cash collections on fulfilled orders (`order_status = 'delivered'`) | `order_payments` / `orders` |
| **Merchandise GMV** | **R\$ 13,591,643.70** | Pure product sales value across all 112,650 line items (excl. freight) | `order_items` |
| **Total Placed Orders** | **99,441** | Commercial orders placed across all 8 lifecycle statuses (96,478 delivered, 97.02%) | `orders` |
| **Delivered Orders** | **96,478** | Completed orders delivered to customer doorsteps | `orders` (`delivered`) |
| **Merchandise Basket AOV** | **R\$ 137.75** | Average product spend per item-containing order (R\$ 13,591,643.70 / 98,666 orders) | `order_items` |
| **Delivered Payment AOV** | **R\$ 159.86** | Average cash collected per delivered order (R\$ 15,422,461.77 / 96,477 orders) | `order_payments` / `orders` |
| **Unique Customer Buyers** | **96,096** | Distinct human individuals (`customer_unique_id`) across 99,441 order sessions | `customers` |
| **Customer Retention Rate** | **3.12%** | Proportion of unique buyers making 2 or more orders (2,997 / 96,096) | `customers` / `orders` (Q21) |
| **On-Time Delivery SLA Rate** | **91.89%** | Deliveries fulfilled on or before estimated date (88,649 / 96,470 evaluated deliveries) | `v_delivery_sla_performance` |
| **Average On-Time Review Score** | **4.29 / 5.0** | Satisfaction rating when shipments arrive on schedule (88,163 reviews) | `order_reviews` / `orders` (Q26) |
| **Average Delayed Review Score** | **2.57 / 5.0** | Severe -1.72 star penalty (-40.1%) observed on delayed orders (7,661 reviews) | `order_reviews` / `orders` (Q26) |
| **Top 3 States Revenue Share** | **63.36%** | Regional GMV concentration across Southeast corridor (`SP`, `RJ`, and `MG`) | `customers` / `order_items` (Q34) |
| **Product Pareto Concentration** | **25.91%** | Proportion of active product catalog (8,536 / 32,951 SKUs) generating 80.00% of GMV | `sql/04` (Q41 Pareto) |
| **Credit Card Transaction Share** | **73.92%** | Dominant payment tender method across marketplace checkouts (76,795 / 103,886 payments) | `order_payments` (Q7 / Q20) |

---

## 2. Five Key Business Insights

### Insight 1: Delivery Latency Strongly Correlates with Customer Review Score Reductions
- **Numerical Finding**: Across 95,824 delivered orders with customer review submissions, on-time orders (88,163 orders, 92.01%) achieved a high average rating of **4.29 / 5.0 stars**. In sharp contrast, delayed orders (7,661 orders, 7.99%) dropped to an average rating of **2.57 / 5.0 stars**, representing a measurable decline of **-1.72 stars (-40.1%)**. Across all 96,470 evaluated deliveries, the overall on-time delivery SLA rate was **91.89%** (88,649 orders), leaving an **8.11% delay rate** (7,821 orders).
- **Business Interpretation**: Fulfillment punctuality is the primary empirical driver of buyer satisfaction. Carrier transit slippage incurs an immediate 40.1% satisfaction penalty, highlighting that delivery performance directly drives public brand sentiment and platform trust.
- **Source Query / View**: `sql/02_joins_and_cte_analysis.sql` (Analysis Q26 & Q30) and `public.v_delivery_sla_performance`.

### Insight 2: High Customer Acquisition Scale Accompanied by Low Retention (96.88% One-Time Buyers)
- **Numerical Finding**: Out of **96,096 unique customer profiles** (`customer_unique_id`), **93,099 customers (96.88%) purchased only once**. Only **2,997 customers (3.12%)** placed a second order. Customers making three or more purchases accounted for just **263 individuals (0.27%)**. For the repeat buyer cohort, the average interval between consecutive orders was **86.4 days**.
- **Business Interpretation**: The platform has functioned predominantly as an acquisition funnel rather than a retention engine. With nearly 97% of buyers churning after a single order, customer acquisition costs (CAC) are amortized over only one transaction, leaving substantial customer lifetime value (LTV) unrealized.
- **Source Query / View**: `sql/02_joins_and_cte_analysis.sql` (Analysis Q21, Q22, Q23 & Q24) and `public.v_customer_lifetime_metrics`.

### Insight 3: Geographic Revenue Concentration in Southeast Brazil (63.36% across Top 3 States)
- **Numerical Finding**: Commercial revenue is geographically concentrated in Brazil's Southeast economic corridor. The state of São Paulo (`SP`) alone generated **R\$ 5,202,955.05** in merchandise sales (**38.28%** of total item revenue across 41,375 orders). Combined with Rio de Janeiro (`RJ`, R\$ 1,824,092.67, **13.42%**) and Minas Gerais (`MG`, R\$ 1,585,308.03, **11.66%**), the top three states account for **63.36%** of all merchandise sales. Average delivery times in São Paulo are **8.8 days**, compared to **24 to 29 days** in distant northern states (such as Roraima at 29.4 days, Amapá at 27.2 days, and Amazonas at 26.4 days).
- **Business Interpretation**: Sales volume aligns with logistical infrastructure and seller proximity. The massive transit gap between the Southeast (8.8 days) and the North/Northeast (24–29 days) creates regional demand friction, depressing conversion in underserved regions.
- **Source Query / View**: `sql/03_window_functions.sql` (Analysis Q34) and `sql/01_basic_aggregate_analysis.sql` (Analysis Q10).

### Insight 4: Product Catalog Pareto Distribution (25.91% of SKUs Generate 80.00% of Revenue)
- **Numerical Finding**: Applying the Pareto (80/20) principle across the active product catalog demonstrates that out of **32,951 distinct products sold**, the top **8,536 products (25.91%)** generate **80.00% of total cumulative merchandise revenue (R\$ 10,873,463.56)**. The remaining 24,415 products (74.09% of the catalog) account for the remaining 20.00% of sales.
- **Business Interpretation**: Revenue generation follows a pronounced power-law distribution. Merchandising capital, supplier relationship management, inventory safety stocks, and fulfillment optimization will produce the highest ROI when concentrated on these top ~8,500 core SKUs.
- **Source Query / View**: `sql/04_bonus_views_and_pareto.sql` (Bonus Analysis Q41) and `public.v_category_performance`.

### Insight 5: Credit Card Dominance and Multi-Month Installment Financing (73.92% of Payments)
- **Numerical Finding**: Analysis across 103,886 payment transactions reveals that **credit cards represent 76,795 transactions (73.92%)** and account for **R\$ 12,542,084.19 (78.34% of total monetary value)**. Boleto Bancário is the second-largest payment channel with **19,784 transactions (19.04%)** and **R\$ 2,869,361.27 (17.92%)**, followed by vouchers (5.56%) and debit cards (1.47%). Furthermore, **over 52% of credit card transactions are financed across multi-month installments** (ranging from 2 to 24 months).
- **Business Interpretation**: Installment financing is a foundational consumer purchasing requirement in the Brazilian e-commerce market. Offering flexible, interest-free installment tiers at checkout is essential for preserving conversion rates on high-ticket items.
- **Source Query / View**: `sql/01_basic_aggregate_analysis.sql` (Analysis Q7, Q17 & Q20) and `public.v_monthly_revenue_kpis`.

---

## 3. Three Strategic Recommendations

### Recommendation 1: Deploy Proactive Logistics Delay Triggers and Regional Carrier Reallocation
- **Supported by Insights**: **Insight 1** (Delivery SLA Review Penalty) and **Insight 3** (Regional Transit Disparity).
- **Actionable Steps**:
  1. **Automated Carrier Delay Webhooks**: Integrate carrier tracking API webhooks to detect shipment bottlenecks 48 hours prior to the promised delivery date. When a delay is projected, automatically trigger an SMS/email notification with a proactive apology and a courtesy voucher (e.g., R\$ 15) *before* the package is officially late.
  2. **Regional 3PL Diversification**: Contract specialized regional 3PL logistics providers for shipping routes into the North and Northeast to compress transit times from 24–29 days toward a target of 15 days.
  3. **Empirical Dynamic SLAs**: Update checkout delivery estimations to incorporate state-specific transit historical averages, aligning customer expectations with empirical transit times in distant geographies.

### Recommendation 2: Implement an Automated Post-Purchase Lifecycle Retention Engine
- **Supported by Insights**: **Insight 2** (96.88% One-Time Buyers), **Insight 4** (Product Pareto Concentration), and **Insight 5** (Installment Financing).
- **Actionable Steps**:
  1. **Timed Replenishment Flows**: Launch automated WhatsApp and email re-engagement flows scheduled between Day 45 and Day 70 post-purchase for consumable categories (`health_beauty`, `perfumery`), engaging customers prior to the observed 86.4-day average repurchase window.
  2. **Pareto-Driven Cross-Selling**: Embed high-converting items from the top 25.91% Pareto catalog into order confirmation receipts and post-delivery follow-ups, pairing complementary items (e.g., bedding accessories with furniture).
  3. **High-Value Loyalty Program**: Create a dedicated VIP tier for customers who spend over R\$ 500 in lifetime value (the High Value customer tier identified in SQL Analysis Q29), providing free shipping vouchers and flexible installment incentives to lift repeat rates from 3.12% toward 6.0%.

### Recommendation 3: Establish Localized Micro-Fulfillment Hubs for Top-Velocity Pareto SKUs
- **Supported by Insights**: **Insight 3** (Southeast generates 63.36% of sales), **Insight 4** (25.91% of SKUs generate 80% of revenue), and **Insight 1** (Delivery SLA compliance).
- **Actionable Steps**:
  1. **Consignment Micro-Warehouses**: Partner with top marketplace merchants to pre-position inventory for the top 8,536 Pareto SKUs in centralized micro-fulfillment centers located in Greater São Paulo and Rio de Janeiro.
  2. **Fast-Shipping Listing Badges**: Offer a guaranteed 24-to-48-hour delivery badge for listings fulfilled from these hubs, driving higher search visibility and increasing checkout conversion.
  3. **Transit and SLA Optimization**: Forward-stocking top products in the primary consumer region will compress fulfillment lead times, lower transit expenses, and help sustain high customer review ratings above 4.3 stars.

---

## 4. Business Implications

### Operational Risks of Inaction
1. **Compounding Review Score Erosion**: With 8.11% of shipments experiencing delays and delayed orders suffering a -1.72 star penalty (dropping to 2.57 stars), failure to address carrier transit delays risks depressing platform-wide review scores below 4.0, which directly degrades organic search visibility and conversion rates.
2. **Customer Acquisition Cost (CAC) Inefficiency**: Relying exclusively on top-of-funnel customer acquisition while 96.88% of buyers purchase only once leaves the business vulnerable to rising digital advertising costs. Without a repeat-purchase mechanism, lifetime value (LTV) cannot scale.
3. **Regional Market Share Stagnation**: Disproportionate transit delays in Northern states (24–29 days vs. 8.8 days in SP) effectively forfeit 36.64% of Brazil's geographic purchasing potential to localized brick-and-mortar competitors.

### Strategic and Financial ROI
1. **LTV Growth**: Increasing customer retention from 3.12% to 6.00% across the 96,096 unique customer base would generate an estimated **R\$ 400,000+ in incremental merchandise revenue** without incurring incremental customer acquisition advertising costs.
2. **SLA Protection**: Improving on-time delivery from 91.89% to 96.00% would safeguard approximately 4,000 orders annually from the 40.1% rating penalty, lifting overall customer satisfaction scores to 4.35+ stars.
3. **Working Capital Efficiency**: Concentrating inventory management on the top 25.91% of Pareto SKUs enables procurement teams to reduce safety stock holding costs on the 24,415 slow-moving SKUs by up to 35% while maintaining an 80% revenue capture rate.

---

## 5. Conclusion

The SalesPulse analytical audit reveals an e-commerce platform with substantial commercial scale (R\$ 13.59M in merchandise GMV across 99,441 orders) but constrained by two critical operational bottlenecks: **logistical transit latency that directly erodes customer review ratings** and **a 96.88% single-order customer churn rate**.

By transitioning from uncoordinated shipping to proactive SLA management, concentrating inventory on the top 25.91% Pareto SKUs within the Southeast corridor, and deploying targeted post-purchase retention flows around the empirical 86.4-day repurchase window, the marketplace can simultaneously enhance customer satisfaction, expand customer lifetime value, and protect operating margins.

---

**Analytical Artifacts & Live References:**
- **Live Published Metabase BI Dashboard**: [SalesPulse Public Dashboard](http://51.21.250.3:3000/public/dashboard/a9d2ce25-d3b7-4958-8aeb-a9096cb2770f)
- **Video Walkthrough Demonstration**: [YouTube Project Demo (2:45)](https://youtu.be/JfchSQo9VEQ)
- **Data Dictionary**: [`DATA_DICTIONARY.md`](../DATA_DICTIONARY.md)
- **SQL Analytics Documentation**: [`docs/sql_analysis_documentation.md`](sql_analysis_documentation.md)
- **Cloud Deployment Guide**: [`DEPLOYMENT.md`](../DEPLOYMENT.md)
