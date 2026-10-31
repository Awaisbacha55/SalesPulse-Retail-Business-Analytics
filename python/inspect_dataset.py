
import csv
import os

DATA_DIR = os.path.join("data", "raw")

print("=" * 75)
print("SALESPULSE - OLIST DATASET INSPECTION")
print("=" * 75)

for filename in sorted(os.listdir(DATA_DIR)):
    if not filename.lower().endswith(".csv"):
        continue

    filepath = os.path.join(DATA_DIR, filename)

    print(f"\nFILE: {filename}")
    print("-" * 75)

    try:
        with open(filepath, "r", encoding="utf-8-sig", newline="") as file:
            reader = csv.DictReader(file)

            print("COLUMNS:")
            print(reader.fieldnames)

            row_count = 0
            samples = []

            for row in reader:
                row_count += 1
                if len(samples) < 3:
                    samples.append(row)

            print(f"\nTOTAL DATA ROWS: {row_count}")
            print("\nSAMPLE RECORDS:")

            for sample in samples:
                print(sample)

    except Exception as error:
        print(f"ERROR: {error}")

print("\n" + "=" * 75)
print("DATASET INSPECTION COMPLETED")
print("=" * 75)
