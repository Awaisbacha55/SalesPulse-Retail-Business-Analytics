# SalesPulse — Database Schema Documentation

## 1. Database Overview

- **Database Name**: `salespulse`
- **Engine**: PostgreSQL 17
- **Schema**: `public`
- **Total Tables**: 9
- **Total Ingested Records**: 1,547,842 rows
- **Entity-Relationship Diagram**: Located at [`images/salespulse_erd.png`](../images/salespulse_erd.png)

The `salespulse` database represents an enterprise relational model built from the Brazilian E-Commerce Public Dataset by Olist. It is organized into a customer-order-product star/snowflake hybrid structure optimized for analytical queries, customer retention modeling, and logistics performance measurement.

---

## 2. Entity-Relationship Overview

```
                      ┌──────────────────────┐
                      │ category_translation │
                      └──────────┬───────────┘
                                 │
                                 │ (1:N)
                                 ▼
┌──────────────────┐       ┌──────────┐       ┌─────────────────┐
│    customers     │       │ products │       │     sellers     │
└────────┬─────────┘       └────┬─────┘       └────────┬────────┘
         │ (1:N)                │                      │
         │                      │ (1:N)                │ (1:N)
         ▼                      ▼                      ▼
    ┌────────┐ (1:N)     ┌─────────────┐               │
    │ orders ├──────────►│ order_items ◄───────────────┘
    └───┬────┘           └─────────────┘
        │
        ├──────────────────────┬──────────────────────┐
        │ (1:N)                │ (1:N)                │ (1:N)
        ▼                      ▼                      ▼
┌────────────────┐     ┌───────────────┐     ┌─────────────────┐
│ order_payments │     │ order_reviews │     │   geolocation   │
└────────────────┘     └───────────────┘     │ (Geographic Ref)│
                                             └─────────────────┘
```

---

## 3. Comprehensive Table Specifications

### 3.1. `customers`
Stores customer unique identifiers, order-level transaction IDs, and geographic locations.
- **Row Count**: 99,441 records

| Column Name | Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `customer_id` | VARCHAR(50) | NO | **PRIMARY KEY** | Unique order-level customer identifier (each order has a distinct `customer_id`) |
| `customer_unique_id` | VARCHAR(50) | NO | INDEXED | Persistent identifier representing the unique real-world person across multiple orders |
| `customer_zip_code_prefix` | VARCHAR(10) | YES | - | First 5 digits of the customer ZIP code |
| `customer_city` | VARCHAR(100) | YES | - | Customer city name |
| `customer_state` | CHAR(2) | YES | - | Two-letter Brazilian state code (e.g., SP, RJ, MG) |

---

### 3.2. `category_translation`
Reference lookup table translating Portuguese product category names into English.
- **Row Count**: 71 records

| Column Name | Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `product_category_name` | VARCHAR(150) | NO | **PRIMARY KEY** | Category name in Portuguese (matches `products.product_category_name`) |
| `product_category_name_english` | VARCHAR(150) | YES | - | Category name translated to English |

---

### 3.3. `products`
Catalog containing physical item specifications, category references, and dimensions.
- **Row Count**: 32,951 records

| Column Name | Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `product_id` | VARCHAR(50) | NO | **PRIMARY KEY** | Unique product identifier |
| `product_category_name` | VARCHAR(150) | YES | INDEXED | Category name in Portuguese |
| `product_name_length` | INTEGER | YES | - | Character count of the product name |
| `product_description_length` | INTEGER | YES | - | Character count of the product description |
| `product_photos_qty` | INTEGER | YES | - | Number of published product photos |
| `product_weight_g` | INTEGER | YES | - | Item weight in grams |
| `product_length_cm` | INTEGER | YES | - | Item package length in centimeters |
| `product_height_cm` | INTEGER | YES | - | Item package height in centimeters |
| `product_width_cm` | INTEGER | YES | - | Item package width in centimeters |

---

### 3.4. `sellers`
Directory of merchants and sellers operating on the Olist marketplace.
- **Row Count**: 3,095 records

| Column Name | Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `seller_id` | VARCHAR(50) | NO | **PRIMARY KEY** | Unique seller / merchant identifier |
| `seller_zip_code_prefix` | VARCHAR(10) | YES | - | First 5 digits of seller ZIP code |
| `seller_city` | VARCHAR(100) | YES | - | Seller registered city |
| `seller_state` | CHAR(2) | YES | - | Two-letter Brazilian state code |

---

### 3.5. `orders`
Core operational table tracking the order lifecycle from placement to customer delivery.
- **Row Count**: 99,441 records

| Column Name | Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `order_id` | VARCHAR(50) | NO | **PRIMARY KEY** | Unique order identifier |
| `customer_id` | VARCHAR(50) | NO | **FOREIGN KEY** (`customers.customer_id`), INDEXED | Reference to customer order instance |
| `order_status` | VARCHAR(30) | YES | - | Status (`delivered`, `shipped`, `canceled`, `invoiced`, `processing`, etc.) |
| `order_purchase_timestamp` | TIMESTAMP | YES | INDEXED | Date and time when the purchase was made |
| `order_approved_at` | TIMESTAMP | YES | - | Payment approval timestamp |
| `order_delivered_carrier_date` | TIMESTAMP | YES | - | Timestamp when order was handed over to the logistics carrier |
| `order_delivered_customer_date` | TIMESTAMP | YES | - | Actual delivery timestamp to the customer |
| `order_estimated_delivery_date` | TIMESTAMP | YES | - | Promised delivery date communicated at checkout |

---

### 3.6. `order_items`
Granular line-item table recording products, assigned sellers, prices, and shipping fees for every order.
- **Row Count**: 112,650 records

| Column Name | Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `order_id` | VARCHAR(50) | NO | **COMPOSITE PK** (1/2), **FK** (`orders.order_id`), INDEXED | Order identifier |
| `order_item_id` | INTEGER | NO | **COMPOSITE PK** (2/2) | Sequential line number within the order (1, 2, 3...) |
| `product_id` | VARCHAR(50) | YES | **FOREIGN KEY** (`products.product_id`), INDEXED | Reference to the product purchased |
| `seller_id` | VARCHAR(50) | YES | **FOREIGN KEY** (`sellers.seller_id`), INDEXED | Reference to the seller fulfilling the item |
| `shipping_limit_date` | TIMESTAMP | YES | - | Seller shipping deadline to transfer item to carrier |
| `price` | NUMERIC(12,2) | YES | - | Item price in Brazilian Reais (BRL) |
| `freight_value` | NUMERIC(12,2) | YES | - | Freight / shipping fee per item in BRL |

---

### 3.7. `order_payments`
Financial transaction details detailing payment methods, installments, and monetary settlement.
- **Row Count**: 103,886 records

| Column Name | Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `order_id` | VARCHAR(50) | NO | **COMPOSITE PK** (1/2), **FK** (`orders.order_id`), INDEXED | Order identifier |
| `payment_sequential` | INTEGER | NO | **COMPOSITE PK** (2/2) | Sequential sequence index for split payments (1, 2...) |
| `payment_type` | VARCHAR(50) | YES | - | Method: `credit_card`, `boleto`, `voucher`, `debit_card` |
| `payment_installments` | INTEGER | YES | - | Number of installments chosen by customer |
| `payment_value` | NUMERIC(12,2) | YES | - | Transaction amount in BRL |

---

### 3.8. `order_reviews`
Customer satisfaction feedback, review ratings (1 to 5), and review timestamps.
- **Row Count**: 99,224 records

| Column Name | Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `review_record_id` | BIGINT | NO | **PRIMARY KEY** (Surrogate Identity / Serial) | System-generated unique identifier resolving duplicate review IDs |
| `review_id` | VARCHAR(50) | YES | - | Original review identifier provided in source dataset |
| `order_id` | VARCHAR(50) | NO | **FOREIGN KEY** (`orders.order_id`), INDEXED | Reference to the evaluated order |
| `review_score` | INTEGER | YES | CHECK (`review_score BETWEEN 1 AND 5`) | Customer rating from 1 (poor) to 5 (excellent) |
| `review_comment_title` | TEXT | YES | - | Title text of the review (optional) |
| `review_comment_message` | TEXT | YES | - | Detailed review feedback body (optional) |
| `review_creation_date` | TIMESTAMP | YES | - | Date survey was generated and sent to customer |
| `review_answer_timestamp` | TIMESTAMP | YES | - | Timestamp when customer completed the survey |

> [!IMPORTANT]
> **Key Architectural Decision**: In the raw dataset, 789 `review_id` values appear multiple times across separate orders (814 excess rows). Enforcing `review_id` as the primary key causes relational violations. To preserve 100% of review records without dropping legitimate customer evaluations, `review_record_id` was introduced as the surrogate primary key in PostgreSQL.

---

### 3.9. `geolocation`
Brazilian geographic mapping coordinate reference containing latitudes and longitudes by ZIP code prefix.
- **Row Count**: 1,000,163 records

| Column Name | Data Type | Nullable | Key / Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| `geolocation_id` | BIGINT | NO | **PRIMARY KEY** (Identity) | Auto-incrementing surrogate row identifier |
| `geolocation_zip_code_prefix` | VARCHAR(10) | YES | INDEXED | 5-digit ZIP code prefix |
| `geolocation_lat` | NUMERIC(12,8) | YES | - | Geographic latitude coordinate |
| `geolocation_lng` | NUMERIC(12,8) | YES | - | Geographic longitude coordinate |
| `geolocation_city` | VARCHAR(100) | YES | - | City name |
| `geolocation_state` | CHAR(2) | YES | - | Two-letter Brazilian state code |

---

## 4. Analytical Indexing Strategy

To guarantee sub-second execution speeds during subsequent exploratory queries, cohort modeling, and BI dashboard filtering, high-cardinality foreign keys and date timestamp columns are indexed:

```sql
-- Customer & Order indexing
CREATE INDEX IF NOT EXISTS idx_customers_unique_id ON customers(customer_unique_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_purchase_date ON orders(order_purchase_timestamp);

-- Order Items indexing
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_seller ON order_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Payments, Reviews & Catalog indexing
CREATE INDEX IF NOT EXISTS idx_payments_order ON order_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order ON order_reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(product_category_name);
CREATE INDEX IF NOT EXISTS idx_geolocation_zip ON geolocation(geolocation_zip_code_prefix);
```

---

## 5. Relational Verification Query

Run this query in DBeaver or psql to verify all 9 tables exist in the `public` schema:

```sql
SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

