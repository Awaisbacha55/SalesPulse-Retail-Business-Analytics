
import csv
import os
from collections import Counter

BASE_DIR = os.path.join("data", "raw")

FILES_TO_CHECK = {
    "customers": (
        "olist_customers_dataset.csv",
        ["customer_id"]
    ),
    "orders": (
        "olist_orders_dataset.csv",
        ["order_id"]
    ),
    "products": (
        "olist_products_dataset.csv",
        ["product_id"]
    ),
    "sellers": (
        "olist_sellers_dataset.csv",
        ["seller_id"]
    ),
    "categories": (
        "product_category_name_translation.csv",
        ["product_category_name"]
    ),
    "reviews": (
        "olist_order_reviews_dataset.csv",
        ["review_id"]
    ),
    "order_items": (
        "olist_order_items_dataset.csv",
        ["order_id", "order_item_id"]
    ),
    "payments": (
        "olist_order_payments_dataset.csv",
        ["order_id", "payment_sequential"]
    )
}

print("=" * 70)
print("SALESPULSE - DATA QUALITY CHECK")
print("=" * 70)

for table, (filename, key_columns) in FILES_TO_CHECK.items():

    filepath = os.path.join(BASE_DIR, filename)

    with open(filepath, "r", encoding="utf-8-sig", newline="") as file:

        reader = csv.DictReader(file)
        keys = []

        for row in reader:
            key = tuple(row[column] for column in key_columns)
            keys.append(key)

    counts = Counter(keys)

    duplicates = sum(
        count - 1
        for count in counts.values()
        if count > 1
    )

    missing = sum(
        1 for key in keys
        if any(value == "" for value in key)
    )

    print(f"\nTable: {table}")
    print(f"Total records: {len(keys)}")
    print(f"Unique keys: {len(counts)}")
    print(f"Duplicate key rows: {duplicates}")
    print(f"Missing key rows: {missing}")

    if duplicates == 0 and missing == 0:
        print("Status: PASS")
    else:
        print("Status: REVIEW REQUIRED")

print("\n" + "=" * 70)
print("DATA QUALITY CHECK COMPLETED")
print("=" * 70)
