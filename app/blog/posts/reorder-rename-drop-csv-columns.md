---
title: "How to Reorder, Rename, and Drop CSV Columns in Bulk"
slug: "reorder-rename-drop-csv-columns"
category: "Practical How-To Guides"
primaryKeyword: "reorder rename drop csv columns"
supportingKeywords: ["reorder csv columns", "rename csv headers", "remove columns csv", "csv column picker", "rearrange columns csv"]
searchIntent: "informational"
wordCountTarget: 1200
audience: "analyst or ops person who has a CSV with too many columns, wrong column names, or wrong column order for their import target"
status: "published"
seo_title: "How to Reorder, Rename, and Drop CSV Columns in Bulk"
seo_description: "Reorder, rename, and drop columns in a CSV — without opening it in Excel. Three methods: browser tool, Python, and command-line cut/awk."
---

# How to Reorder, Rename, and Drop CSV Columns in Bulk

**Fastest method:** Use Sohovi's [CSV column picker](/tools/csv-columns) — upload your file, drag columns to reorder, rename headers, check or uncheck to include/exclude columns, and download the modified CSV. No Excel, no code.

---

## Why You'd Need to Reorder or Drop Columns

**For imports:** Your CRM expects columns in a specific order ("first_name, last_name, email") but your export has them as "email, name, phone, company, address."

**For privacy:** Your export contains personal fields (SSN, salary, manager) that shouldn't go to a vendor — you need to drop them before sharing.

**For size:** A 50-column database export has 40 columns you don't need. Dropping them before analysis or upload saves processing time and storage.

**For naming:** Your source system uses snake_case ("customer_id") but the target expects PascalCase ("CustomerId").

---

## Method 1: Sohovi Column Picker (Browser, No Code)

1. Upload your CSV to [/tools/csv-columns](/tools/csv-columns)
2. All columns shown as draggable cards
3. Drag to reorder, click to toggle on/off, click a name to rename
4. Preview the modified CSV
5. Download

Nothing is uploaded — all processing is browser-local.

---

## Method 2: Python (Best for Automation)

```python
import pandas as pd

df = pd.read_csv('input.csv')

# Select and reorder columns
df = df[['first_name', 'last_name', 'email', 'company']]

# Rename columns
df = df.rename(columns={
    'first_name': 'FirstName',
    'last_name': 'LastName',
    'email': 'EmailAddress',
    'company': 'Company',
})

df.to_csv('output.csv', index=False)
```

---

## Method 3: Command Line (Fast for Large Files)

**Reorder/select columns by position using cut (Linux/Mac):**
```bash
# Keep columns 1, 3, and 5 (1-indexed)
cut -d',' -f1,3,5 input.csv > output.csv
```

**Reorder/select by name using awk:**
```bash
# Reorder to: email, name (from name,email original)
awk -F',' 'NR==1{print $2","$1} NR>1{print $2","$1}' input.csv > output.csv
```

**Rename headers only:**
```bash
sed '1s/.*/new_col1,new_col2,new_col3/' input.csv > output.csv
```

**Limitation of command-line:** These use positional column references, which are fragile — if the source file's column order changes, the script produces wrong output. Python's name-based selection is safer for production use.

---

## Handling Columns with Special Characters in Names

CSV column names with spaces, commas, or special characters:
- In Python: `df['column with spaces']` — pandas handles it
- In SQL: wrap in backticks (MySQL) or double quotes (PostgreSQL)
- For command-line tools: these typically break on names with commas — Python is safer

---

## Frequently Asked Questions

**Q: Can I rename multiple columns at once without Python?**
In Excel: double-click header cells one by one. In the Sohovi column picker: click each column name to rename directly. For bulk renaming (mapping 20 columns to new names), Python's `rename()` dictionary is the most efficient approach.

**Q: Is there a way to do this in Excel without code?**
Yes — select the columns you want in the order you want them, copy, and paste into a new sheet. For dropping columns: select a column, right-click → Delete. For renaming: double-click the header cell. This works for occasional one-off changes but becomes tedious for repeating the same transformation on multiple files.

**Q: How do I reorder columns in Google Sheets?**
Select the column letter → hold the column header and drag to the new position. Rename by double-clicking the header cell. Drop by right-clicking → Delete column.

---

**Reorder, rename, and drop columns in your browser** — drag-and-drop interface, nothing uploaded, download the modified CSV instantly. Try the [free CSV column picker](/tools/csv-columns).
