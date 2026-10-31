import csv
import os
import psycopg2
from psycopg2.extras import execute_values

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Project paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data", "raw")

# PostgreSQL connection
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 5432)),
    "database": os.getenv("DB_NAME", "salespulse"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "")
}

# Source CSV and destination table
IMPORTS = [
    ("olist_customers_dataset.csv", "customers"),
    ("olist_sellers_dataset.csv", "sellers"),
    ("product_category_name_translation.csv", "category_translation"),
    ("olist_products_dataset.csv", "products"),
    ("olist_orders_dataset.csv", "orders"),
    ("olist_order_items_dataset.csv", "order_items"),
    ("olist_order_payments_dataset.csv", "order_payments"),
    ("olist_order_reviews_dataset.csv", "order_reviews"),
    ("olist_geolocation_dataset.csv", "geolocation"),
]

# Correct source column spelling differences
COLUMN_MAP = {
    "product_name_lenght": "product_name_length",
    "product_description_lenght": "product_description_length",
}

BATCH_SIZE = 2000


def import_csv(cursor, connection, filename, table):
    filepath = os.path.join(DATA_DIR, filename)

    print(f"\nImporting {filename} -> {table}")

    with open(filepath, "r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)

        source_columns = reader.fieldnames
        target_columns = [
            COLUMN_MAP.get(column, column)
            for column in source_columns
        ]

        columns_sql = ", ".join(f'"{c}"' for c in target_columns)
        insert_sql = f'INSERT INTO "{table}" ({columns_sql}) VALUES %s'

        batch = []
        total = 0

        for row in reader:
            values = [
                row[column] if row[column] != "" else None
                for column in source_columns
            ]

            batch.append(tuple(values))

            if len(batch) >= BATCH_SIZE:
                execute_values(cursor, insert_sql, batch, page_size=BATCH_SIZE)
                connection.commit()
                total += len(batch)
                batch.clear()
                print(f"  Imported {total:,} rows")

        if batch:
            execute_values(cursor, insert_sql, batch, page_size=BATCH_SIZE)
            connection.commit()
            total += len(batch)

    print(f"Completed: {total:,} rows")
    return total


def main():
    connection = None

    try:
        connection = psycopg2.connect(**DB_CONFIG)
        connection.autocommit = False

        cursor = connection.cursor()
        print("Connected to PostgreSQL successfully!")

        for filename, table in IMPORTS:
            import_csv(cursor, connection, filename, table)

        print("\nAll CSV imports completed successfully!")

    except Exception as error:
        if connection:
            connection.rollback()
        print(f"\nIMPORT ERROR: {error}")
        print("Check the database schema and connection settings.")

    finally:
        if connection:
            connection.close()


if __name__ == "__main__":
    main()
