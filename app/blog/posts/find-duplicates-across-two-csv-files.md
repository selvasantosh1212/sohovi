---
title: "How to Find Duplicates Across Two CSV Files (4 Methods)"
slug: "find-duplicates-across-two-csv-files"
category: "Practical How-To Guides"
primaryKeyword: "find duplicates across two csv files"
supportingKeywords: ["compare two csv files duplicates", "match records across csv files", "cross-file duplicate detection", "vlookup duplicates two files", "find records in both csv files"]
searchIntent: "informational"
wordCountTarget: 1400
audience: "someone with two contact lists or data exports who needs to find records that appear in both — before a campaign, before a merge, before a migration"
status: "published"
seo_title: "How to Find Duplicates Across Two CSV Files (4 Methods)"
seo_description: "Four ways to find matching records across two CSV files: VLOOKUP, Power Query merge, command-line, and browser-based fuzzy matching. Each method with exact steps and limitations."
---

# How to Find Duplicates Across Two CSV Files (4 Methods)

**The fastest approach for non-technical users:** Open both CSVs in Excel or Google Sheets, combine them into one sheet, then run VLOOKUP (or COUNTIF) to find records that appear in both files. For fuzzy matches across files — "Jon Smith" in file 1 matching "John Smith" in file 2 — you need a fuzzy matching tool.

---

## Method 1: VLOOKUP in Excel / Google Sheets (Exact Match)

This finds rows where a key column (like email) appears in both files.

**Steps:**
1. Open both CSVs in Excel
2. In File 1, add a new column: `=IFERROR(VLOOKUP(A2, [File2.csv]Sheet1!$A:$A, 1, FALSE), "Not Found")`
3. Fill down for all rows
4. Filter for rows that returned a value (not "Not Found") — those are your duplicates across files

**Google Sheets version (if files are in different sheets):**
`=IFERROR(VLOOKUP(A2, Sheet2!A:A, 1, FALSE), "Not Found")`

**What it finds:** Records where the key column value is identical in both files.

**What it misses:** Casing differences, trailing spaces, name variants. "john@gmail.com" and "JOHN@GMAIL.COM" won't match.

---

## Method 2: COUNTIF (Simpler Approach)

`=COUNTIF(Sheet2!$B:$B, B2)>0`

Returns TRUE if the value in B2 exists anywhere in Sheet2's column B. Use conditional formatting with this formula to highlight cross-file matches visually.

---

## Method 3: Power Query Merge (For Recurring Cross-File Comparison)

Power Query's merge creates a relationship between two tables on a matching column:

1. Load File 1: **Data** → **From Text/CSV**
2. Load File 2: repeat
3. In Power Query Editor: **Home** → **Merge Queries** → select both tables and the matching column
4. Choose **Inner Join** (only rows that exist in both files)

**Advantages:** Reproducible — when files update, refresh the query. Handles large files better than VLOOKUP.

**Limitation:** Still exact matching. More setup than VLOOKUP but more sustainable for recurring comparison.

---

## Method 4: Command Line (Linux/Mac — For Large Files)

For very large files where Excel would crash:

```bash
# Sort both files, then compare
sort file1.csv > file1_sorted.csv
sort file2.csv > file2_sorted.csv
comm -12 file1_sorted.csv file2_sorted.csv > matches.csv
```

`comm -12` outputs only lines that appear in both files. Works on any file size.

**Limitation:** Exact match only. Requires the two files to have identical structure.

---

## Finding Fuzzy Matches Across Two Files

The hard case: two contact lists where the same person appears with slightly different data in each. "John Smith, john@acme.com" in File 1 and "Jon Smith, j.smith@acme.com" in File 2. VLOOKUP can't find this match. You need fuzzy matching across files.

The Sohovi [CSV merger](/tools/csv-merger) handles this: combine both files, then run fuzzy deduplication across the combined result. The fuzzy matching flags near-duplicates with a similarity score — you review each one and decide whether it's a real match.

[IMAGE: Two CSV files being combined and fuzzy-matched, showing a pair of near-duplicate records flagged with similarity score 87%]

---

## Frequently Asked Questions

**Q: How do I find records in File 1 that DON'T exist in File 2?**
Change the VLOOKUP formula to flag "Not Found" results:
`=IF(IFERROR(VLOOKUP(A2, Sheet2!$A:$A, 1, FALSE), "NOT FOUND")="NOT FOUND", "Unique to File 1", "In Both")`

**Q: What if the key column I'm matching on isn't perfectly consistent between files?**
Apply LOWER(TRIM()) to both columns before matching to normalize casing and whitespace. For more fundamental differences (phone number formatting, address abbreviations), standardize both files to the same format first, then compare.

**Q: Can I compare files with different column names?**
Yes — you match on the content of specific columns, not column names. Just make sure you're referencing the right column in each file, regardless of its header.

**Q: What about comparing files with millions of rows?**
The command-line `comm` approach scales to any file size. VLOOKUP in Excel gets slow above 100k rows. For very large files, consider Python (pandas merge) or SQL (JOIN operation).

---

**Comparing two contact lists with fuzzy matching?** Combine them in our [free CSV merger](/tools/csv-merger), then run dedup with fuzzy matching enabled — catches the near-matches that exact comparison misses.
