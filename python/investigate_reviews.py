
import csv
import os
from collections import defaultdict, Counter

FILE_PATH = os.path.join(
    "data", "raw", "olist_order_reviews_dataset.csv"
)

reviews = []

with open(FILE_PATH, "r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)
    reviews = list(reader)

print("=" * 75)
print("SALESPULSE - REVIEW DUPLICATE INVESTIGATION")
print("=" * 75)

# 1. Count duplicate review IDs
id_counts = Counter(row["review_id"] for row in reviews)

duplicate_ids = {
    review_id: count
    for review_id, count in id_counts.items()
    if count > 1
}

print(f"\nTotal review rows: {len(reviews)}")
print(f"Unique review IDs: {len(id_counts)}")
print(f"Review IDs occurring more than once: {len(duplicate_ids)}")
print(f"Excess duplicate rows: {sum(c - 1 for c in id_counts.values())}")

# 2. Examine duplicate review IDs
print("\nDUPLICATE REVIEW ID EXAMPLES:")

shown = 0

for review_id in duplicate_ids:
    matching = [
        row for row in reviews
        if row["review_id"] == review_id
    ]

    print(f"\nReview ID: {review_id}")
    print(f"Occurrences: {len(matching)}")

    for row in matching:
        print({
            "order_id": row["order_id"],
            "review_score": row["review_score"],
            "review_creation_date": row["review_creation_date"],
            "review_answer_timestamp": row["review_answer_timestamp"]
        })

    shown += 1
    if shown == 5:
        break

# 3. Check exact duplicate records
row_counts = Counter(
    tuple(row.values()) for row in reviews
)

exact_duplicate_excess = sum(
    count - 1 for count in row_counts.values()
)

# 4. Check whether duplicate review IDs refer to different orders
review_orders = defaultdict(set)

for row in reviews:
    review_orders[row["review_id"]].add(row["order_id"])

same_order_duplicates = sum(
    1 for review_id in duplicate_ids
    if len(review_orders[review_id]) == 1
)

multiple_order_duplicates = sum(
    1 for review_id in duplicate_ids
    if len(review_orders[review_id]) > 1
)

print("\n" + "=" * 75)
print("INVESTIGATION SUMMARY")
print("=" * 75)

print(f"Duplicate review IDs: {len(duplicate_ids)}")
print(f"Exact duplicate excess rows: {exact_duplicate_excess}")
print(f"Duplicate IDs associated with one order: {same_order_duplicates}")
print(f"Duplicate IDs associated with multiple orders: {multiple_order_duplicates}")

print("\nInvestigation completed.")
