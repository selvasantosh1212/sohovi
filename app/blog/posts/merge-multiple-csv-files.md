---
title: "How to Merge Multiple CSV Files into One (Without Excel Crashing)"
slug: "merge-multiple-csv-files"
category: "Practical How-To Guides"
primaryKeyword: "merge multiple csv files"
supportingKeywords: ["combine csv files", "merge csv excel", "stack csv files", "combine multiple csvs", "merge csv without coding"]
searchIntent: "informational"
wordCountTarget: 1600
audience: "someone with 5-50 monthly export files and a deadline — needs to combine them into one without losing data or dealing with header rows"
status: "published"
seo_title: "How to Merge Multiple CSV Files into One (Without Excel Crashing)"
seo_description: "Three ways to merge multiple CSV files: a command-line one-liner, Power Query, and a browser tool for mismatched columns. Each method explained with the gotchas that trip people up."
---

# How to Merge Multiple CSV Files into One (Without Excel Crashing)

**Fastest method on Windows:** Open Command Prompt in the folder containing your CSVs and run `copy *.csv merged.csv`. On Mac/Linux: `cat *.csv > merged.csv`. This takes under 10 seconds. Warning: it concatenates headers too — fix that in the next section.

---

## Method 1: Command Line (Fastest, Some Gotchas)

### Windows Command Prompt

```
copy *.csv merged.csv
```

Run this inside the folder containing your CSV files. It concatenates all CSVs alphabetically.

**Gotcha — repeated header rows:** Each CSV has its own header line. The merged file will have the header from the first file, then data rows, then the header from the second file, then more data rows, etc. Fix this by deleting rows containing your header text after merging, or use Method 2 to handle it cleanly.

**Gotcha — encoding mismatches:** If some files were saved as UTF-8 and others as Windows-1252 (Latin-1), the merged file will have encoding corruption on accented characters. Open suspicious files in a text editor (not Excel) to check.

### Mac / Linux Terminal

```bash
# Merge all CSVs in current directory:
cat *.csv > merged.csv

# Merge only headers from first file:
head -1 file1.csv > merged.csv && tail -n +2 -q *.csv >> merged.csv
```

The second command is cleaner: takes only the header from the first file, then appends data (skipping headers) from all files.

---

## Method 2: Power Query in Excel (Proper Approach for Repeated Tasks)

Power Query can combine all CSVs in a folder automatically — and repeat the process with one click when new files arrive.

1. In Excel: **Data** → **Get Data** → **From File** → **From Folder**
2. Browse to your folder of CSVs → **OK**
3. In the preview dialog, click **Combine** → **Combine & Transform Data**
4. Power Query opens showing a merged preview — headers from the first file are used
5. **Close & Load** to send the result to a worksheet

**To refresh when new files arrive:** Right-click the resulting table → **Refresh**.

**Gotcha — different column orders:** If your CSVs have the same columns but in different orders, Power Query handles this correctly — it matches by column name, not position.

**Gotcha — different column names:** If "Customer Name" in one file is "client_name" in another, Power Query treats them as separate columns (both will appear, half the rows will be null in each). You need to rename columns to match before combining, or handle the mapping in the query.

---

## Method 3: Browser-Based Merger (For Mismatched Schemas)

When your CSVs have genuinely different structures — some files have columns others don't, or column names differ across sources — the command line and Power Query approaches produce messy results.

Sohovi's [CSV merger](/tools/csv-merger) handles schema mismatches:

1. Upload all your CSV files (no file size limits that cause crashes)
2. The tool shows you a column mapping preview — columns from all files side by side
3. Match misnamed columns by dragging them to align ("Customer Name" → "client_name")
4. Columns that exist in some files but not others get flagged so you can decide how to handle nulls
5. Download the merged, column-aligned result

Everything runs in your browser — no upload to a server, no file size concern beyond what your device can handle.

---

## The Breaking Points

Here's where each method fails and what to do:

| Symptom | Cause | Fix |
|---------|-------|-----|
| Headers repeated in merged file | Command-line concatenation includes all headers | Use the `tail -n +2` command or Power Query |
| Garbled characters (Ã©, â) | Encoding mismatch (UTF-8 vs Latin-1) | Open files in Notepad/TextEdit and re-save all as UTF-8 before merging |
| Some columns are null for half the rows | Column names don't match across files | Map columns before merging (Method 3) |
| Excel crashes on open | Combined file exceeds 1,048,576 rows | Don't open in Excel — process in Power Query directly, or use a tool that handles large files |
| Merged file has extra blank rows | Some CSVs had a trailing newline | Strip trailing newlines before merge, or filter them out in Power Query |

---

## When Your Files Have Different Column Structures

This is the most common real-world problem. You have 12 monthly exports from your CRM, but the team added two new custom fields in month 4 — so months 1–3 have different columns than months 4–12.

The cleanest approach:
1. Open one of each "version" of the file (one old format, one new format)
2. Identify the differences — which columns were added/removed/renamed
3. Add empty columns to the old-format files to match the new structure, or decide which columns to drop
4. Then merge

If this is a recurring problem from a system that keeps changing its export format, the durable fix is standardizing the export at the source (define a fixed column set in your CRM/database export template and lock it down).

---

## Frequently Asked Questions

**Q: Why do I get repeated header rows in my merged file?**
Because the command-line merge (copy or cat) treats every line the same — it doesn't know which lines are headers. Use the `tail -n +2` approach on Mac/Linux to skip the header on every file except the first, or use Power Query which handles headers properly.

**Q: How do I merge CSVs that have different columns?**
You need to decide what to do with the extra columns: include them (with nulls for files that don't have them), or drop them (merge only on the intersection of columns). Power Query and browser-based mergers give you a UI to make that decision. Command-line merging just stacks everything, leaving the mismatched columns unaligned.

**Q: What's the maximum row limit for merged CSVs?**
There's no limit for CSV files themselves — they're plain text. The limit is what your tool can handle. Excel can open up to 1,048,576 rows. Power Query can process larger files than Excel can display. Browser-based tools depend on your device's available memory. For truly large merges (millions of rows), use a SQL database or a command-line tool like `csvkit`.

**Q: Can I merge CSVs with different encodings?**
Not directly — mismatched encodings cause garbled characters. Open each file, check its encoding (most text editors show this), re-save as UTF-8, then merge. On Mac: `iconv -f WINDOWS-1252 -t UTF-8 input.csv > output.csv`.

---

**Merging CSVs with mismatched columns?** Drop them all into the [free CSV merger](/tools/csv-merger) — it aligns columns for you and shows you exactly what doesn't match before you commit to the merge.
