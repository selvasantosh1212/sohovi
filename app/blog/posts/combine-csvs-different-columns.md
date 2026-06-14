---
title: "How to Combine CSVs with Different Columns (Schema Mismatch Fixes)"
slug: "combine-csvs-different-columns"
category: "Practical How-To Guides"
primaryKeyword: "combine csvs different columns"
supportingKeywords: ["merge csv different schema", "combine csv mismatched columns", "stack csvs different headers", "merge csv files different columns", "union csv different structure"]
searchIntent: "informational"
wordCountTarget: 1400
audience: "someone trying to combine CSV files that don't have identical column structures — maybe different exports from the same system, or files from different time periods"
status: "published"
seo_title: "How to Combine CSVs with Different Columns (Schema Mismatch Fixes)"
seo_description: "Merging CSVs with different column names or structures requires mapping mismatches before combining. Here are 3 methods — Power Query, Python, and a browser tool — with the exact steps."
---

# How to Combine CSVs with Different Columns (Schema Mismatch Fixes)

**The core problem:** When two CSVs have different column names, structure, or order, a simple `copy *.csv merged.csv` or `cat` command produces a broken file — headers from multiple files appear mid-data, mismatched columns create null-filled rows, and different column names for the same data produce duplicate columns.

You need to align the schemas before combining. Here's how.

---

## Step 1: Identify the Differences

Before writing any code or using any tool, understand exactly what's different between your files:

- **Same columns, different order:** "name,email,company" vs "email,company,name"
- **Different column names for the same data:** "customer_name" vs "full_name"
- **One file has extra columns:** File 1 has "phone"; File 2 doesn't
- **Both have unique columns:** File 1 has "industry"; File 2 has "region"; neither file has both

Open both files in a text editor and compare the first row (headers) of each.

---

## Method 1: Power Query in Excel (Best for Non-Technical Users)

Power Query's "Combine Files from Folder" handles schema mismatches:

1. Put all your CSV files in one folder
2. **Data** → **Get Data** → **From File** → **From Folder**
3. Select the folder
4. Click **Combine** → **Combine & Transform Data**
5. Power Query opens with a sample file — make any column mapping changes needed
6. If column names differ between files:
   - In Power Query Editor: **Add Column** → **Custom Column** → map the old column name to a new standard name
   - Remove the old column
7. **Close & Load**

Power Query includes rows from all files, using the column names from your mapping. Columns that don't exist in a given file get `null` values for that file's rows.

[IMAGE: Power Query editor showing two CSV files with different schemas being combined, with null values for columns missing from one file]

---

## Method 2: Python (Best for Repeatable or Large-File Combining)

Pandas handles schema mismatches with the `outer` join option:

```python
import pandas as pd
import glob

# Read all CSVs in a folder
files = glob.glob('data/*.csv')
dfs = [pd.read_csv(f) for f in files]

# Combine — outer join includes all columns from all files, fills missing with NaN
combined = pd.concat(dfs, axis=0, ignore_index=True, join='outer')

# Rename mismatched columns before concatenating if needed:
# dfs[0] = dfs[0].rename(columns={'customer_name': 'name'})

combined.to_csv('combined.csv', index=False)
```

**Handling different names for the same column:**
```python
# Standardize column names before combining
column_map = {
    'customer_name': 'name',
    'full_name': 'name',
    'client_name': 'name',
}
dfs = [df.rename(columns=column_map) for df in dfs]
```

---

## Method 3: Browser-Based Merger (Easiest, No Code)

Sohovi's [CSV merger](/tools/csv-merger) handles mismatched schemas visually:

1. Upload all your CSV files
2. The tool shows a column mapping preview — all columns from all files side by side
3. Drag columns to align mismatched names (map "customer_name" to "full_name")
4. Columns that only exist in some files are flagged — you choose how to handle nulls
5. Download the combined, schema-aligned result

This is the most accessible option for non-technical users dealing with one-off file merges.

---

## Deciding How to Handle Columns That Don't Exist in All Files

For each column that only appears in some files, you have three options:

**Option A — Include with null for missing files:** The combined file has the column; rows from files that didn't have it get blank/null values. Best when the column is optional data that some files simply don't collect.

**Option B — Exclude entirely:** Drop the column from the combined file. Best when the data is irrelevant to the combined use case.

**Option C — Investigate why it's missing:** Sometimes a column is missing because a system changed its export format between versions. If columns 1–3 match but version 2 files added "phone" — the old files genuinely don't have that data, and including null is correct.

---

## Frequently Asked Questions

**Q: What if my files have the same column names but different column order?**
This is simpler — Power Query and pandas both align by column name, not position. The simple `cat` command is the only approach that breaks on different column order.

**Q: What if different files have completely different schemas (e.g., two completely different types of data)?**
If the files represent fundamentally different data (one is customers, one is orders), you're not combining them — you're joining them, which is a different operation. Use a JOIN in SQL or pandas merge.

**Q: How do I know which column order to use for the combined file?**
Use the column order from your first (or most representative) file as the standard, then add any extra columns from other files at the end.

---

**Merging files with mismatched columns?** Drop them all into the [free CSV merger](/tools/csv-merger) — it shows you a column alignment preview and lets you map mismatched names before combining.
