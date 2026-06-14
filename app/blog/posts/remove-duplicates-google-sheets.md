---
title: "How to Remove Duplicates in Google Sheets (3 Methods, No Formulas)"
slug: "remove-duplicates-google-sheets"
category: "Practical How-To Guides"
primaryKeyword: "remove duplicates google sheets"
supportingKeywords: ["google sheets remove duplicates", "dedup google sheets", "find duplicates sheets", "google sheets duplicate remover", "remove duplicate rows sheets"]
searchIntent: "informational"
wordCountTarget: 1400
audience: "someone with a duplicate problem in Google Sheets right now — needs the fix immediately"
status: "published"
seo_title: "How to Remove Duplicates in Google Sheets: 3 Methods"
seo_description: "Remove duplicates in Google Sheets: built-in tool (Data → Data cleanup), UNIQUE formula, or Apps Script for automation. Each method explained with what it misses."
---

# How to Remove Duplicates in Google Sheets (3 Methods, No Formulas Required)

**Fastest method:** Select your data → **Data** → **Data cleanup** → **Remove duplicates** → choose columns → **Remove duplicates**. Done in under 30 seconds. This works for exact duplicates on clean, consistent data.

For fuzzy matches (typos, name variants, casing differences), read on — the built-in tool misses those entirely.

---

## Method 1: Data → Data Cleanup → Remove Duplicates (Built-In)

1. Select the range containing your data (include headers)
2. Click **Data** in the menu bar
3. Click **Data cleanup**
4. Click **Remove duplicates**
5. In the dialog: check "Data has header row" if applicable, select which columns to compare
6. Click **Remove duplicates**

Google Sheets shows a summary: "X duplicate rows found and removed."

**What it catches:** Rows where all selected column values are identical.

**What it misses:**
- Trailing spaces ("Acme " ≠ "Acme")
- Casing differences ("ACME" ≠ "Acme")
- Name variants ("Jon Smith" ≠ "John Smith")
- Same email with different casing ("JOHN@GMAIL.COM" ≠ "john@gmail.com")

---

## Method 2: UNIQUE() Formula (Non-Destructive)

To extract unique rows to a new location without modifying the original:

```
=UNIQUE(A2:D100)
```

This returns all unique rows from the range. The original data is untouched, and the result updates automatically if source data changes.

For a single column (unique emails only):
```
=UNIQUE(B2:B100)
```

**When to use:** When you want to preserve the original data and work from a deduplicated copy.

**Limitation:** Exact matching only. Same whitespace and casing issues as Method 1.

---

## Method 3: COUNTIF to Highlight Before Removing

To see duplicates before deleting them:

1. In an empty column next to your data, add: `=COUNTIF(B:B, B2)` (where B is the column with potential duplicates)
2. Fill down for all rows
3. Any row with a count > 1 is a duplicate
4. Sort by this helper column to group duplicates together for review
5. Manually delete the rows you want to remove

**When to use:** When you need to review duplicates before committing to deletion — lets you see which version to keep.

---

## Finding Duplicates Without Deleting (Highlight Them)

Format → Conditional formatting → Custom formula: `=COUNTIF($B:$B,B2)>1`

This highlights any cell in column B that appears more than once. Useful for visual inspection before any deletion.

---

## The Cases Google Sheets Misses

[IMAGE: Before-after showing a contact list in Google Sheets with "0 duplicates found" on data that visibly has trailing-space and casing duplicates]

When Remove Duplicates reports "0 duplicate rows found" on data that you can visually see has duplicates, it's almost always one of:

- **Trailing spaces:** Use `=TRIM(B2)` on the column first, paste as values, then dedup
- **Mixed casing:** Use `=LOWER(B2)` as a helper column, dedup on the helper
- **Combined fix:** `=LOWER(TRIM(B2))` normalizes both

For fuzzy duplicates (name variants, typos) — "Jon Smith" vs "John Smith" — no Google Sheets formula solves this cleanly. You need a tool with fuzzy matching.

---

## Frequently Asked Questions

**Q: Does Google Sheets' Remove Duplicates keep the first or last occurrence?**
It keeps the first occurrence and removes subsequent ones (same behavior as Excel).

**Q: Can I remove duplicates across multiple sheets?**
Not directly with the built-in tool. You'd need to combine the sheets first (using IMPORTRANGE or copy-paste), then dedup, then split back.

**Q: Is there a Google Sheets add-on for better deduplication?**
Yes — several add-ons in the Google Workspace Marketplace offer enhanced dedup, including "Remove Duplicates" by Ablebits. These handle some casing/whitespace issues but still don't do fuzzy matching.

**Q: What's the equivalent of Google Sheets' Remove Duplicates in Excel?**
Data → Remove Duplicates in Excel. Both tools have the same limitations (exact matching only). See [How to Remove Duplicate Rows in Excel](/blog/remove-duplicate-rows-excel) for the Excel-specific guide.

---

**For fuzzy duplicates — the "Jon Smith" vs "John Smith" cases Google Sheets can't see** — paste your data into our [free duplicate remover](/tools/remove-duplicates). It runs in your browser, processes locally (nothing uploaded to any server), and catches the near-matches that exact dedup misses.
