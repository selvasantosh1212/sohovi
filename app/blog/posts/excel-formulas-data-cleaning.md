---
title: "The 15 Excel Formulas Every Data Cleaner Needs (Explained in Plain English)"
slug: "excel-formulas-data-cleaning"
category: "Practical How-To Guides"
primaryKeyword: "excel formulas data cleaning"
supportingKeywords: ["data cleaning excel formulas", "excel formula clean data", "excel text functions data quality", "excel data validation formulas", "best excel formulas clean data"]
searchIntent: "informational"
wordCountTarget: 2000
audience: "non-technical analyst who knows basic Excel but wants a reference for the specific formulas that matter for data quality work"
status: "published"
seo_title: "15 Excel Formulas for Data Cleaning (Explained in Plain English)"
seo_description: "The 15 Excel formulas that actually matter for data cleaning — TRIM, CLEAN, PROPER, LOWER, SUBSTITUTE, TEXTJOIN, and more. Each with a real example and the problem it solves."
---

# The 15 Excel Formulas Every Data Cleaner Needs (Explained in Plain English)

Every data quality problem in Excel has a formula solution. These 15 cover the situations you'll encounter most often — whitespace, casing, concatenation, lookup, duplication, and extraction. Each one is explained with a real example.

---

## Whitespace and Invisible Characters

### 1. TRIM — Remove Leading and Trailing Spaces

**What it does:** Removes spaces from the beginning and end of a text value, and collapses multiple spaces between words to a single space.

```
=TRIM(A2)
```

**Example:** `"  Acme Corp  "` → `"Acme Corp"`

**When to use:** Any time you import data from another system — virtually all exports contain trailing spaces on at least some records. TRIM before deduplication and lookups.

---

### 2. CLEAN — Remove Non-Printing Characters

**What it does:** Removes characters that don't print — line breaks (Char 10/13), tab characters (Char 9), and other control characters that often sneak in from copy-paste or data exports.

```
=CLEAN(A2)
```

**Combined with TRIM:**
```
=TRIM(CLEAN(A2))
```

**When to use:** When VLOOKUP returns #N/A on values that look identical, invisible characters are often the cause.

---

## Casing

### 3. PROPER — Title Case

**What it does:** Capitalizes the first letter of each word, lowercases the rest.

```
=PROPER(A2)
```

**Example:** `"JOHN SMITH"` or `"john smith"` → `"John Smith"`

**Caveat:** PROPER capitalizes the letter after every space and apostrophe — `"O'Brien"` becomes `"O'Brien"` (correct), but `"AT&T"` becomes `"At&T"` (wrong). Handle abbreviations and proper nouns manually.

---

### 4. LOWER — All Lowercase

```
=LOWER(A2)
```

**When to use:** Normalize email addresses before deduplication (`"JOHN@GMAIL.COM"` and `"john@gmail.com"` should be treated as the same).

---

### 5. UPPER — All Uppercase

```
=UPPER(A2)
```

**When to use:** State codes, country codes, product codes that should always be uppercase.

---

## Text Manipulation

### 6. SUBSTITUTE — Find and Replace in a Formula

**What it does:** Replaces every occurrence of a text string with another string. Unlike Find & Replace, it's non-destructive (creates a new value rather than modifying in place).

```
=SUBSTITUTE(A2, "(", "")           ' Remove left parentheses
=SUBSTITUTE(A2, "-", "")           ' Remove dashes
=SUBSTITUTE(SUBSTITUTE(A2,"(",""),")", "") ' Remove both
```

**When to use:** Stripping formatting characters from phone numbers, removing dollar signs from number fields.

---

### 7. TEXT — Format a Number as a Specific Text Pattern

```
=TEXT(A2, "00000")           ' 5-digit ZIP code with leading zeros
=TEXT(A2, "MM/DD/YYYY")      ' Format date
=TEXT(A2, "$#,##0.00")       ' Currency format
```

**When to use:** Reconstructing leading zeros lost by Excel's type conversion, standardizing date display.

---

### 8. LEFT, MID, RIGHT — Extract Part of a Text String

```
=LEFT(A2, 3)           ' First 3 characters
=RIGHT(A2, 4)          ' Last 4 characters
=MID(A2, 5, 3)         ' 3 characters starting at position 5
```

**When to use:** Extracting area codes from phone numbers, country codes from identifiers, or pulling specific parts of structured codes.

---

### 9. LEN — Count Characters (Including Hidden Ones)

```
=LEN(A2)
```

**When to use:** Diagnosing invisible character problems. If two cells look identical but `LEN()` returns different values, there's a hidden character in one of them. Also useful for validating field lengths before database import.

---

## Lookup and Matching

### 10. VLOOKUP — Find a Value in Another Table

```
=VLOOKUP(A2, reference_table, 2, FALSE)
```

**Parameters:**
- A2 = the value to look up
- reference_table = the range to search (first column must be the lookup key)
- 2 = return the value from the 2nd column of the table
- FALSE = exact match only

**The most common cause of #N/A:** trailing spaces in either the lookup value or the table. Apply TRIM() to both before using VLOOKUP.

---

### 11. IFERROR — Handle Lookup Failures Gracefully

```
=IFERROR(VLOOKUP(A2, reference_table, 2, FALSE), "Not Found")
```

**When to use:** Wrap around any formula that might return an error. Returns the fallback value ("Not Found", 0, blank) instead of an ugly #N/A or #REF! error.

---

### 12. COUNTIF — Count Occurrences (Spot Duplicates)

```
=COUNTIF(B:B, B2)
```

Returns how many times the value in B2 appears in column B. If the result is > 1, it's a duplicate.

**For duplicate highlighting:** Home → Conditional Formatting → New Rule → Use formula: `=COUNTIF($B:$B,B2)>1`

---

## Validation Helpers

### 13. ISNUMBER / ISTEXT / ISBLANK — Check Data Types

```
=ISNUMBER(A2)      ' Returns TRUE if the cell contains a number
=ISTEXT(A2)        ' Returns TRUE if the cell contains text
=ISBLANK(A2)       ' Returns TRUE if the cell is empty
```

**When to use:** Flag cells where you expect numbers but got text (or vice versa). Combined with IF: `=IF(ISBLANK(A2), "MISSING", "OK")`

---

### 14. IF — Conditional Logic

```
=IF(ISBLANK(B2), "Missing email", B2)
=IF(LEN(A2)>50, "TOO LONG", "OK")
=IF(COUNTIF(B:B,B2)>1, "DUPLICATE", "UNIQUE")
```

The workhorse of data quality checks. Wrap around almost any test to produce a flag column.

---

### 15. TEXTJOIN — Combine Multiple Fields

```
=TEXTJOIN(" ", TRUE, A2, B2)      ' Join first and last name with space
=TEXTJOIN(", ", TRUE, A2, B2, C2) ' Join address fields with comma-space
```

**Parameters:** delimiter, ignore_empty (TRUE skips blanks), then the values to join.

**When to use:** Constructing a combined key for deduplication (joining first + last + company into one comparable string), or assembling a full address from parts.

---

## Bonus: The Combination Formula for Data Cleaning

For a single-formula cleanup of any text column:

```
=TRIM(CLEAN(PROPER(A2)))
```

This removes invisible characters, strips whitespace, and normalizes casing in one step. Not perfect (the PROPER caveat applies), but a solid starting point for most text columns.

---

## Frequently Asked Questions

**Q: What's the difference between CLEAN and TRIM?**
TRIM removes spaces (leading, trailing, double spaces between words). CLEAN removes non-printing control characters (line breaks, tabs, etc.). TRIM(CLEAN()) handles both.

**Q: Why does VLOOKUP return #N/A when the value clearly exists?**
Almost always: (1) trailing space in the lookup value or the table, (2) casing difference if the lookup type is something other than FALSE, or (3) number-stored-as-text mismatch (the table has the number 42; your lookup value is the text "42"). Apply TRIM() and VALUE() to normalize before the lookup.

**Q: Are there Excel versions where TEXTJOIN isn't available?**
TEXTJOIN requires Excel 2019 or Excel 365. In older versions, use `=A2&" "&B2` with the & concatenation operator.

---

**When Excel formulas aren't enough** — upload the file to Sohovi for automatic profiling, deduplication, and validation without writing a formula for each problem. Free to try.
