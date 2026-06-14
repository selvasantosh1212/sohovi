---
title: "Excel Turned My Gene Names / Product Codes into Dates: How to Fix It"
slug: "excel-auto-date-product-codes-fix"
category: "Practical How-To Guides"
primaryKeyword: "excel converts product codes to dates"
supportingKeywords: ["excel gene name to date", "excel auto date conversion", "excel DEC1 to date", "stop excel converting text to date", "excel product code becomes date"]
searchIntent: "informational"
wordCountTarget: 1300
audience: "researcher or analyst whose identifiers like DEC1, SEPT7, or product codes like '1-3' have been silently converted to calendar dates by Excel"
status: "published"
seo_title: "Excel Turned My Gene Names into Dates: How to Fix It"
seo_description: "Excel auto-converts identifiers like DEC1, SEPT7, and 1-3 to dates silently. Here's why it happens, how to fix existing files, and how to prevent it on import."
---

# Excel Turned My Gene Names / Product Codes into Dates: How to Fix It

**What happened:** Excel's auto-detection treats text that looks like a date as a date. "DEC1" becomes December 1st. "SEPT7" becomes September 7th. "1-3" becomes January 3rd. The original text is replaced and cannot be recovered — Excel stored a serial date number, not your original text.

**Prevention (must be done before opening):** Import the file via **Data → From Text/CSV** and set the affected columns to **Text** type. Never double-click the CSV to open it.

---

## The Problem Explained

Excel's type inference runs on every cell when you open a file. Any value that could be interpreted as a date in your regional locale gets converted. This is a known issue that has caused serious problems in genomics research — gene names like MARCH1 (March 1), SEPT2 (September 2), DEC1 (December 1) are routinely corrupted when researchers share CSV files.

In 2020, the HUGO Gene Nomenclature Committee began renaming genes like SEPT7 to SEPTIN7 specifically because Excel was damaging the data — a real-world consequence of this bug.

For product codes: "1-3", "5/12", "MAR-001" — any code containing month names or date-like patterns is at risk.

---

## Recovering Existing Corrupted Files

**Bad news:** If Excel has already converted your codes to dates, the original text values are gone. Excel stores dates as serial numbers (the number of days since January 1, 1900). "DEC1" is now the number 43070 (or similar), and Excel displays it as "01-Dec." The original string "DEC1" is not recoverable from the file.

**Your options:**
1. Go back to the source file and re-import it correctly (see Prevention below)
2. If you remember what the values should be: manually correct them
3. If the corrupted values were originally dates and you just want to see them differently: that's reformatting, not recovery

---

## Prevention: Import as Text

**The only reliable prevention** is telling Excel to treat columns as text before it applies type inference.

**Method 1 — Import Wizard:**
1. Open Excel, don't open the CSV by double-clicking
2. **Data** → **Get Data** → **From File** → **From Text/CSV**
3. In the preview: click on the column(s) with codes or identifiers
4. Change the data type dropdown from "General" to **Text**
5. Click **Load**

**Method 2 — Format Before Pasting:**
1. Select the destination column in Excel
2. **Format Cells** → Number tab → **Text**
3. Now paste your data

The column being pre-formatted as Text tells Excel not to interpret values — they're stored as the characters you typed.

---

## For Genomics Researchers Specifically

The community workaround before renaming genes:
- Add a leading apostrophe before pasting: `'DEC1` → stored as text "DEC1" (apostrophe not displayed)
- Use `.tsv` (tab-separated) with a quoted header indicating text columns
- Share `.xlsx` files with pre-formatted Text columns rather than `.csv`
- Use R or Python for analysis where this isn't an issue

The permanent solution: use tools other than Excel for genomics data, or at minimum always import CSV files via the Text/CSV import wizard, never by double-clicking.

---

## Product Codes With Date-Like Patterns

For product catalogs with codes like "MAR-001", "DEC-2024-SKU3":

1. Before sharing the catalog as CSV, test by opening it fresh in Excel
2. Any codes that show up as dates need to be prefixed or restructured
3. Options: prefix with a letter ("P-MAR-001"), quote them in the CSV file, or import with the Text type

---

## Frequently Asked Questions

**Q: Why doesn't Excel warn me that it's converting values?**
Excel's auto-conversion runs silently. There's no dialog, no warning, and no undo (since the conversion happens on file open, before you've made any edits). This is widely criticized behavior that Excel has not changed.

**Q: If I change the cell format to Text after the conversion, does it recover the original value?**
No — changing the format doesn't change the underlying value. A date stored as the serial number 43070 displayed as "DEC1" text format still stores 43070; it just displays it differently. The original text "DEC1" is gone.

**Q: Does Google Sheets have this problem?**
Yes. Google Sheets applies the same auto-conversion. The same prevention applies: pre-format columns as Plain Text, or use the CSV import wizard (File → Import) with column types specified.

---

**After fixing your import**, validate your file with Sohovi — it profiles your identifier columns and flags values that look like they may have been incorrectly converted, before you act on bad data.
