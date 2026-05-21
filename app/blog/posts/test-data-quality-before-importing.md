---
title: "How to Test Data Quality Before Importing Into Your System"
slug: "test-data-quality-before-importing"
category: "Practical How-To Guides"
primaryKeyword: "test data quality before importing"
supportingKeywords: ["validate data before import", "pre-import data quality check", "data import validation", "check CSV before importing"]
searchIntent: "informational"
wordCountTarget: 1400
audience: "ops managers, anyone importing data into a CRM, database, or business system"
status: "published"
seo_title: "How to Test Data Quality Before Importing Into Your System"
seo_description: "Importing bad data is far more expensive than catching it beforehand. Here's a practical pre-import data quality checklist that takes 15 minutes and prevents hours of cleanup."
---

# How to Test Data Quality Before Importing Into Your System

**You can test data quality before importing by running five checks on your file before the import begins: structural validation (correct columns and format), completeness (required fields populated), uniqueness (no duplicates on identifier fields), validity (values match expected formats), and consistency (no conflicting values).**

A bad import is one of the fastest ways to corrupt a previously clean database. When you import a file with duplicate records, misformatted dates, or inconsistent status values, those problems merge with your existing data — and are much harder to remove than they were to prevent.

Fifteen minutes of pre-import testing prevents hours of post-import cleanup.

## In this guide

- Why pre-import testing matters
- The 5-check pre-import quality framework
- How to run each check quickly
- What to do when checks fail
- How to make pre-import testing a standard part of your workflow

## Why Pre-Import Testing Matters

Once data is imported, it mixes with your existing records. A duplicate imported contact doesn't sit separately — it merges into your contact list, appears in reports, and may trigger campaigns or processes before anyone notices the problem.

Pre-import testing catches the problem in the file before it reaches the database — when it's still a CSV you can edit rather than a contamination problem spread across thousands of records.

## Check 1: Structural Validation

Before looking at a single value, confirm the file structure is what your import system expects.

**What to check:**
- [ ] Correct number of columns
- [ ] Column names exactly match what the import expects (case-sensitive in many systems)
- [ ] No extra header rows before the expected header row
- [ ] No completely empty rows or columns
- [ ] Correct file encoding (UTF-8, not Latin-1 — this matters if the file contains non-ASCII characters)
- [ ] Correct delimiter (comma, not semicolon — depends on regional Excel settings)

**Why it matters:** An import with the wrong column order silently maps data to the wrong fields. An import with the wrong encoding creates garbled characters in text fields. These problems affect every row and are invisible until someone notices a specific record looks wrong.

## Check 2: Completeness

For each field that your import requires (or that downstream processes depend on), verify the fill rate.

**What to check:**
- [ ] Calculate null/empty rate for each required field
- [ ] Flag any required field with more than 2% null rate
- [ ] Check whether null values are truly empty or contain placeholder text ("N/A", "0", "unknown")
- [ ] Confirm the row count is what you expected (file wasn't truncated during export)

**Why it matters:** A customer contact import where 15% of email fields are blank silently reduces your campaign reach. An order import where 8% of product IDs are null creates unfulfillable orders. Knowing the completeness rate before import lets you decide: clean now, or proceed with known limitations.

## Check 3: Uniqueness / Deduplication

Identify records in the import file that would create duplicates when loaded into your system.

**What to check:**
- [ ] Identify the unique identifier for the entity being imported (email for contacts, order ID for orders, SKU for products)
- [ ] Count how many records in the file have a duplicate value on that identifier
- [ ] Check for duplicates within the file itself (not just against existing data)
- [ ] For contacts: check whether any email addresses in this file already exist in your target system

**Why it matters:** An import of 5,000 contacts with 8% duplicates creates 400 duplicate records in your database. If your target system doesn't deduplicate on import, those records need to be found and merged manually — after the import.

[IMAGE: Screenshot showing a pre-import duplicate check — a highlighted column of email addresses with duplicates flagged in red]

Running your file through Sohovi before import shows you the completeness rate, duplicate rate, and format validity for every column in under a minute — exactly the information you need for Checks 2, 3, and 4.

## Check 4: Format Validity

Confirm that values match the format your target system expects.

**What to check by field type:**

**Email addresses:**
- [ ] Contains exactly one "@" symbol
- [ ] Has a domain with at least one period after the "@"
- [ ] No spaces inside the email address
- [ ] No trailing spaces or unusual characters

**Phone numbers:**
- [ ] Contains only digits and standard punctuation (parentheses, dashes, plus sign)
- [ ] Has an appropriate number of digits (7–15 for most formats)
- [ ] If your system expects E.164 format (+15551234567), confirm all numbers follow it

**Dates:**
- [ ] All dates parse as valid dates in the format your system expects
- [ ] No dates outside a plausible range (hire date in 1850, order date in 2098)
- [ ] Consistent format throughout the file (not a mix of MM/DD/YYYY and YYYY-MM-DD)

**Numeric fields (price, quantity, revenue):**
- [ ] Contains only numeric values (no currency symbols, no commas if the system expects plain numbers)
- [ ] All values are positive where required (price > 0, quantity ≥ 0)

## Check 5: Consistency

Confirm that categorical fields in the import file use values your system recognizes.

**What to check:**
- [ ] List all distinct values in each categorical field (status, type, category, country code)
- [ ] Compare each distinct value against your approved list
- [ ] Flag any value that doesn't match an approved option
- [ ] Check for case inconsistencies ("Active" vs. "active") that might cause your system to create new categories

**Why it matters:** An import that includes "Actv" instead of "Active" for a status field either fails on import (if the system validates) or creates a new "Actv" status option that pollutes your data going forward.

## What to Do When a Check Fails

**Minor failure (< 2% of records affected):** Document the failure, clean the affected records, and proceed. If the issue is in a non-critical field, proceed with a note.

**Moderate failure (2–10% of records affected):** Pause the import. Investigate the source of the failure. If you can clean the file, do so before proceeding. If you can't, consult with the data owner before importing.

**Critical failure (> 10% affected, or the failure is in a critical field):** Do not import. Return the file to the source (vendor, team, system) with a description of the failure and a request to resubmit a corrected file.

## Making Pre-Import Testing a Standard Workflow

Pre-import testing only helps if it's consistently applied. Build it into the import workflow:

1. **Add it to your import procedure document.** Every import has a pre-import check step before the actual import.
2. **Create a checklist.** A 5-item checklist attached to your import process takes 3 minutes to complete.
3. **Make it a gate.** The import doesn't proceed until the checklist is signed off.
4. **Keep a record.** Log each import check — date, file, findings, who signed off.

## Frequently Asked Questions

**Q: Why should I test data quality before importing?**
Importing bad data is far more expensive than catching it beforehand. Once imported, bad data mixes with your existing records and must be found, isolated, and cleaned in a live system — which is much harder than editing a file. Pre-import testing catches problems when they're still easy to fix.

**Q: What are the most important checks to run before any data import?**
Structural validation (correct columns and format), completeness (required fields populated), uniqueness (no duplicates on identifier fields), validity (values match expected formats), and consistency (categorical values match approved options). These five checks catch the vast majority of import-related data quality problems.

**Q: How long does a pre-import data quality check take?**
For most business-sized imports (under 50,000 rows), a thorough pre-import check takes 10–20 minutes manually, or under 2 minutes with an automated tool. The time investment consistently prevents hours of post-import cleanup.

**Q: What should I do if a vendor-supplied file fails pre-import checks?**
Return the file to the vendor with a clear description of each failure — which field, what the problem is, and how many records are affected. Request a corrected file before proceeding. Including the specific findings (not just "the file has quality issues") makes it easier for the vendor to fix the right things.

**Q: Can I automate pre-import data quality testing?**
Yes. Tools that provide instant quality reports on uploaded CSV files (showing completeness, duplicates, and format validity) make pre-import testing fast and consistent. Low-code automation tools can also trigger quality checks when new files arrive in a shared folder or email attachment.

**Q: What's the difference between testing data quality before import and data cleaning?**
Testing identifies problems in the file. Cleaning fixes them. Pre-import testing tells you: this file has 300 duplicate email addresses and 150 invalid phone numbers. Cleaning removes the duplicates and standardizes the phone numbers. Testing comes first; cleaning follows for files that fail.

**Q: Should I run pre-import checks on files from my own internal systems?**
Yes, especially for exports from systems you don't control day-to-day, data from legacy systems, or files that have been processed or modified before import. Even internally generated files can have format issues or unexpected nulls introduced by export settings or manual editing.

**Q: What file formats require extra attention during pre-import testing?**
CSV files from Excel sources require attention to: date format (Excel stores dates as serial numbers that can be exported inconsistently), encoding (Excel on Windows defaults to ANSI, not UTF-8), and delimiter (European Excel defaults to semicolon, not comma). These are the most common sources of import failures in business data.

**Q: How do I verify that an import went cleanly after it completes?**
Compare the record count after import to the record count in the source file minus any expected deduplication. Spot-check 5–10 records across the dataset to confirm field values mapped correctly. Check whether any error log was generated by the import process.

**Q: What's the most common import error that pre-import testing would have caught?**
Date format mismatch — a file with dates in MM/DD/YYYY being imported into a system that expects YYYY-MM-DD. The import either fails entirely, maps dates to wrong values, or creates null dates for every row. A 30-second check of the date column format before import prevents this entirely.

---

**A 15-minute pre-import check is worth hours of post-import cleanup. Make it a gate in your import workflow — not an optional step — and bad imports stop being a problem.**

If you want to run a fast pre-import quality check on your next file, Sohovi is free to try. Upload your CSV, get a complete quality report in under a minute, and only import what's clean. No credit card, no IT team, no code required.

[INTERNAL LINK: How to Validate a CSV File Before Importing It Into Any System]
[INTERNAL LINK: How to Build a Data Quality Checklist for Your Business]

---
**Meta description:** Importing bad data is far more expensive than catching it beforehand. Here's a practical pre-import data quality checklist that takes 15 minutes and prevents hours of cleanup.
