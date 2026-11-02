# SalesPulse — Data Dictionary

This document serves as the technical catalog and relational data dictionary for the **SalesPulse** data warehouse hosted in **PostgreSQL 17** (Neon Serverless & local).

---

## 1. Database Overview

- **Database Name**: `salespulse`
- **Schema**: `public`
- **Dataset**: Brazilian E-Commerce Public Dataset by Olist
- **Total Tables**: 9
- **Total Relational Views**: 4
- **Total Verified Records**: **1,547,842 rows**

---

## 2. Relational Entity Tables

### Table 1: `customers`
Contains customer identity mappings and demographic location data for every order.
- **Row Count**: 99,441
- **Primary Key**: `customer_id`

| Column Name | Data Type | Constraint | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `customer_id` | `VARCHAR(50)` | `PRIMARY KEY` | Unique transaction-level identifier created per order. | `06b8999e2fba1a1fbc88172c00ba8bc7` |
| `customer_unique_id` | `VARCHAR(50)` | `NOT NULL` | Persistent buyer identity linking repeat purchases across orders. | `861eff4711a542e4b93843c6dd7febb0` |
| `customer_zip_code_prefix` | `VARCHAR(10)` | — | First 5 digits of Brazilian CEP postal code. | `14409` |
| `customer_city` | `VARCHAR(100)` | — | City name where customer resides. | `franca` |
| `customer_state` | `VARCHAR(2)` | — | Two-letter Brazilian state code (Federative Unit). | `SP` |

---

### Table 2: `sellers`
Contains merchant partner registration and geographical data.
- **Row Count**: 3,095
- **Primary Key**: `seller_id`

| Column Name | Data Type | Constraint | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `seller_id` | `VARCHAR(50)` | `PRIMARY KEY` | Unique merchant identification hash. | `3442f8959a84dea7ee197c632cb2df15` |
| `seller_zip_code_prefix` | `VARCHAR(10)` | — | First 5 digits of merchant postal code. | `13056` |
| `seller_city` | `VARCHAR(100)` | — | City of merchant fulfillment location. | `campinas` |
| `seller_state` | `VARCHAR(2)` | — | Two-letter state code of merchant location. | `SP` |

---

### Table 3: `category_translation`
Maps Portuguese product category nomenclature to standardized English taxonomy.
- **Row Count**: 71
- **Primary Key**: `product_category_name`

| Column Name | Data Type | Constraint | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `product_category_name` | `VARCHAR(100)` | `PRIMARY KEY` | Category name in Portuguese. | `cama_mesa_banho` |
| `product_category_name_english`| `VARCHAR(100)` | `NOT NULL` | Standard English translated category name. | `bed_bath_table` |

---

### Table 4: `products`
Catalog metadata for all items sold across the marketplace.
- **Row Count**: 32,951
- **Primary Key**: `product_id`

| Column Name | Data Type | Constraint | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `product_id` | `VARCHAR(50)` | `PRIMARY KEY` | Unique product identifier hash. | `1e9e8ef32dac43880bb31a87e011a5ee` |
| `product_category_name` | `VARCHAR(100)` | — | Portuguese category name (FK to category_translation).| `perfumaria` |
| `product_name_length` | `INTEGER` | — | Character length of the product title. | `40` |
| `product_description_length` | `INTEGER` | — | Character length of the product description. | `287` |
| `product_photos_qty` | `INTEGER` | — | Number of published product photos. | `1` |
| `product_weight_g` | `NUMERIC(10,2)` | — | Weight of item in grams. | `225.00` |
| `product_length_cm` | `NUMERIC(10,2)` | — | Product packaging length in centimeters. | `20.00` |
| `product_height_cm` | `NUMERIC(10,2)` | — | Product packaging height in centimeters. | `10.00` |
| `product_width_cm` | `NUMERIC(10,2)` | — | Product packaging width in centimeters. | `14.00` |

---

### Table 5: `orders`
Core transaction table tracking order fulfillment stages and lifecycle timestamps.
- **Row Count**: 99,441
- **Primary Key**: `order_id`

| Column Name | Data Type | Constraint | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `order_id` | `VARCHAR(50)` | `PRIMARY KEY` | Unique transaction order hash. | `e481f51cbdc54678b7cc49136f2d6af7` |
| `customer_id` | `VARCHAR(50)` | `FK` $\rightarrow$ `customers` | Customer order identity link. | `9ef432eb6251297304e76186b10a928d` |
| `order_status` | `VARCHAR(20)` | `NOT NULL` | Order status (`delivered`, `shipped`, `canceled`, etc.). | `delivered` |
| `order_purchase_timestamp` | `TIMESTAMP` | `NOT NULL` | Order placement timestamp. | `2017-10-02 10:56:33` |
| `order_approved_at` | `TIMESTAMP` | — | Payment approval timestamp. | `2017-10-02 11:07:15` |
| `order_delivered_carrier_date` | `TIMESTAMP` | — | Package handoff timestamp to logistics carrier. | `2017-10-04 19:55:00` |
| `order_delivered_customer_date`| `TIMESTAMP` | — | Actual delivery timestamp to customer doorstep. | `2017-10-10 21:25:13` |
| `order_estimated_delivery_date`| `TIMESTAMP` | `NOT NULL` | Carrier estimated delivery SLA date. | `2017-10-18 00:00:00` |

---

### Table 6: `order_items`
Individual line items purchased within each order, specifying merchant and pricing.
- **Row Count**: 112,650
- **Primary Key**: `(order_id, order_item_id)`

| Column Name | Data Type | Constraint | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `order_id` | `VARCHAR(50)` | `FK` $\rightarrow$ `orders` | Transaction reference identifier. | `00010242fe8c596d1c288480208a244d` |
| `order_item_id` | `INTEGER` | `NOT NULL` | Sequential line item number within the order (1, 2, ...). | `1` |
| `product_id` | `VARCHAR(50)` | `FK` $\rightarrow$ `products` | Product item SKU. | `4244733e06e7ecb4970a6e2683c13e61` |
| `seller_id` | `VARCHAR(50)` | `FK` $\rightarrow$ `sellers` | Merchant fulfilling this line item. | `48436dade18ac8b2bce089ec2a041202` |
| `shipping_limit_date` | `TIMESTAMP` | — | Merchant SLA deadline to ship package. | `2017-09-19 09:45:35` |
| `price` | `NUMERIC(10,2)` | `NOT NULL` | Merchandise selling price in Brazilian Reais (BRL). | `58.90` |
| `freight_value` | `NUMERIC(10,2)` | `NOT NULL` | Shipping and handling fee charged for this item. | `13.29` |

---

### Table 7: `order_payments`
Customer tender records and installment financing breakdowns.
- **Row Count**: 103,886
- **Primary Key**: `(order_id, payment_sequential)`

| Column Name | Data Type | Constraint | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `order_id` | `VARCHAR(50)` | `FK` $\rightarrow$ `orders` | Transaction reference identifier. | `b81ef226f3fe1789b1e8b2acac839d17` |
| `payment_sequential` | `INTEGER` | `NOT NULL` | Payment sequence number (for split-tender checkouts). | `1` |
| `payment_type` | `VARCHAR(20)` | `NOT NULL` | Tender type (`credit_card`, `boleto`, `voucher`, `debit_card`).| `credit_card` |
| `payment_installments` | `INTEGER` | `NOT NULL` | Selected installment count (1 to 24). | `8` |
| `payment_value` | `NUMERIC(10,2)` | `NOT NULL` | Monetary amount charged on this payment tender. | `99.33` |

---

### Table 8: `order_reviews`
Customer post-purchase review submissions, satisfaction scores, and feedback text.
- **Row Count**: 99,224
- **Primary Key**: `review_record_id` *(Surrogate PK introduced to handle 789 duplicate natural `review_id`s)*

| Column Name | Data Type | Constraint | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `review_record_id` | `BIGINT` | `GENERATED ALWAYS AS IDENTITY PK` | Synthetic surrogate primary key. | `1` |
| `review_id` | `VARCHAR(50)` | — | Natural review hash provided by Olist. | `7bc249e44d6eb1e3ea6194274ac4c026` |
| `order_id` | `VARCHAR(50)` | `FK` $\rightarrow$ `orders` | Order evaluated by customer. | `73fc7af87114b39712e6da79b0a377eb` |
| `review_score` | `SMALLINT` | `NOT NULL` | Customer satisfaction rating on 1 to 5 scale. | `4` |
| `review_comment_title` | `TEXT` | — | Review submission heading. | `Recomendo` |
| `review_comment_message`| `TEXT` | — | Verbatim customer written review feedback. | `Aparelho muito bom...` |
| `review_creation_date` | `TIMESTAMP` | — | Date evaluation survey was sent to customer. | `2018-01-18 00:00:00` |
| `review_answer_timestamp`| `TIMESTAMP` | — | Timestamp customer submitted review survey. | `2018-01-18 21:46:59` |

---

### Table 9: `geolocation`
Spatial reference data associating Brazilian 5-digit postal code prefixes with coordinates.
- **Row Count**: 1,000,163
- **Primary Key**: `geolocation_id`

| Column Name | Data Type | Constraint | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `geolocation_id` | `BIGINT` | `GENERATED ALWAYS AS IDENTITY PK` | Synthetic surrogate primary key. | `1` |
| `geolocation_zip_code_prefix`| `VARCHAR(10)` | — | First 5 digits of Brazilian CEP. | `01037` |
| `geolocation_lat` | `DOUBLE PRECISION`| — | Latitude coordinate in decimal degrees. | `-23.545621` |
| `geolocation_lng` | `DOUBLE PRECISION`| — | Longitude coordinate in decimal degrees. | `-46.639292` |
| `geolocation_city` | `VARCHAR(100)` | — | Normalized municipality name. | `sao paulo` |
| `geolocation_state` | `VARCHAR(2)` | — | Two-letter state code. | `SP` |

---

## 3. Reusable Analytical Views

### View 1: `v_monthly_revenue_kpis`
Pre-aggregated monthly financial KPIs, order counts, Average Order Value (AOV), and Month-over-Month (MoM) growth rates.
```sql
SELECT * FROM public.v_monthly_revenue_kpis ORDER BY sales_month;
```
- **Columns**: `sales_month`, `monthly_revenue`, `total_orders`, `total_units_sold`, `average_order_value`, `mom_revenue_growth_pct`

### View 2: `v_category_performance`
Catalog commercial performance aggregated by English product category name, calculating sales velocity, total GMV, and Average Selling Price (ASP).
```sql
SELECT * FROM public.v_category_performance ORDER BY total_revenue DESC;
```
- **Columns**: `category`, `total_orders`, `units_sold`, `total_revenue`, `average_item_price`, `revenue_share_pct`

### View 3: `v_delivery_sla_performance`
Carrier logistics performance comparing transit duration and customer review score differentials between on-time and delayed shipments.
```sql
SELECT * FROM public.v_delivery_sla_performance;
```
- **Columns**: `delivery_status`, `order_count`, `order_pct`, `avg_transit_days`, `avg_review_score`

### View 4: `v_customer_lifetime_metrics`
Customer segmentation and repeat purchase behavior tracking RFM fundamentals and lifetime revenue.
```sql
SELECT * FROM public.v_customer_lifetime_metrics LIMIT 20;
```
- **Columns**: `customer_unique_id`, `lifetime_orders`, `lifetime_spend`, `first_purchase_date`, `last_purchase_date`, `customer_tier`

