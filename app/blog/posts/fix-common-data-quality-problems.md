---
title: "How to Fix the Most Common Data Quality Problems"
slug: "fix-common-data-quality-problems"
category: "Practical How-To Guides"
primaryKeyword: "fix data quality problems"
supportingKeywords: ["common data quality issues", "data quality problems solutions", "how to fix bad data", "data cleaning steps"]
searchIntent: "informational"
wordCountTarget: 1600
audience: "ops managers, small business owners, anyone dealing with bad data"
status: "published"
seo_title: "How to Fix the Most Common Data Quality Problems"
seo_description: "Duplicate records, missing values, wrong formats, inconsistent fields — here's exactly how to fix the most common data quality problems your business faces."
---

# How to Fix the Most Common Data Quality Problems

**You can fix the most common data quality problems — duplicate records, missing values, wrong formats, and inconsistent fields — by following a structured cleanup process that addresses both the existing errors and the upstream processes that created them.**

Bad data doesn't fix itself. But it also doesn't stay broken forever if you take the right approach. The key is to fix the root cause, not just the symptoms — otherwise the same problems come back within weeks of your cleanup.

This guide covers the six most common data quality problems and exactly how to fix each one.

## In this guide

- Problem 1: Duplicate records
- Problem 2: Missing values in critical fields
- Problem 3: Invalid formats (emails, phones, dates)
- Problem 4: Inconsistent values in categorical fields
- Problem 5: Stale / outdated contact data
- Problem 6: Mixed data types in a single field

---

## Problem 1: Duplicate Records

**What it looks like:** The same customer, product, or transaction appears more than once in your dataset — sometimes with slightly different details across the duplicate entries.

**Why it happens:** Manual re-entry, imports from multiple sources, CRM syncs that create new records instead of updating existing ones, or missing deduplication checks at data entry points.

**How to fix it:**

1. **Identify duplicates** — run a count of records sharing the same unique identifier (email, phone, customer ID). In a spreadsheet: `=COUNTIF($B:$B, B2)>1` on every row.

2. **Decide which record to keep** — for each duplicate set, determine the "master" record. Usually this is the most complete, most recently updated record.

3. **Merge the records** — copy any unique data from the duplicate into the master record (a phone number that only appeared on one, a note that only appeared on the other).

4. **Delete the duplicate** — once data is merged, remove the secondary record.

5. **Fix the source** — add deduplication checks to the import process or data entry form that created the duplicates. A fix without a source fix is temporary.

---

## Problem 2: Missing Values in Critical Fields

**What it looks like:** Key fields like email, phone, company name, or customer ID are blank for a significant percentage of records.

**Why it happens:** Optional form fields that people skip, imports that don't map all fields, or system changes that didn't backfill data for existing records.

**How to fix it:**

1. **Identify the scope** — calculate the null rate for each critical field. `=COUNTBLANK(column)/COUNTA(column)` in a spreadsheet.

2. **Categorize the missing values** — are they truly missing, or placeholder text ("N/A", "Unknown", "0")? If placeholder, standardize them to proper null values first.

3. **Fill from available sources** — for missing emails: check your email platform for this contact. For missing phones: check recent correspondence. For missing company names: check linked opportunities.

4. **Prioritize high-value records** — if you can't fill all missing values, prioritize the records you actively use (current customers, active leads, active products).

5. **Fix the source** — make the field required at the entry point. If it can't be required (some records genuinely don't have a phone number), add a default "Not provided" value to distinguish intentionally empty from accidentally empty.

---

## Problem 3: Invalid Formats (Emails, Phones, Dates)

**What it looks like:** Email addresses without "@", phone numbers with letters, dates formatted as "Jan 5 2024" in a field that expects "2024-01-05", ZIP codes with fewer than 5 digits.

**Why it happens:** Manual entry without validation, data imports from external sources, or multiple source systems using different format conventions.

**How to fix it:**

1. **Flag all invalid values** — run a format check on each field. For emails: look for missing "@" or domain. For phones: look for non-numeric characters. For dates: look for values that don't parse as a valid date.

2. **Standardize fixable values** — phone number "5551234567" and "(555) 123-4567" both represent the same number. Standardize to one format: +15551234567 (E.164 international) or 5551234567 (domestic).

3. **Correct obvious errors** — email "user@gmial.com" is clearly "gmail.com" with a typo. Some errors are correctable with pattern matching.

4. **Flag or delete unfixable values** — an email like "asdfgh@@@" can't be corrected. Flag it as invalid so it's excluded from campaign sends and can be cleaned manually over time.

5. **Set up validation rules going forward** — apply format validation at entry points so new values are validated before they enter the system.

[IMAGE: Screenshot showing a column of phone numbers with inconsistent formats being standardized to a single format]

---

## Problem 4: Inconsistent Values in Categorical Fields

**What it looks like:** A "Status" field containing "Active", "active", "ACTIVE", and "Actv" — all meaning the same thing. A "Country" field containing "US", "USA", "United States", and "U.S.A." simultaneously.

**Why it happens:** No enforced controlled vocabulary, multiple people entering the same field differently, imports from external sources with different naming conventions, or evolving field values without back-migration.

**How to fix it:**

1. **List all distinct values in the field** — use a pivot table or `=UNIQUE()` formula to see every distinct value currently in use.

2. **Map each value to the correct canonical version** — create a mapping table: "Actv" → "Active", "ACTIVE" → "Active", "USA" → "US", etc.

3. **Apply the mapping** — use a formula or find-and-replace to standardize all values to the canonical version.

4. **Enforce the controlled vocabulary going forward** — use a dropdown list (in a form or CRM) to restrict entries to approved values only. This is the most important step — without it, the inconsistencies will return.

---

## Problem 5: Stale / Outdated Contact Data

**What it looks like:** Customer email addresses that bounce, phone numbers that no longer work, company names for businesses that have changed or closed, contacts still showing their old employer.

**Why it happens:** Data was collected and then never updated. People change jobs, update emails, and move — but your database doesn't know unless someone tells it.

**How to fix it:**

1. **Identify stale records** — flag records not updated in the past 12–18 months. Check "last modified" or "last contacted" dates.

2. **Validate email addresses** — run your email list through a validation tool to identify hard bounces and high-risk addresses. Remove or flag records with invalid emails.

3. **Re-engagement attempt** — for records you want to keep, send a re-verification email asking contacts to confirm or update their information. Those who don't respond after two attempts can be moved to a "dormant" segment.

4. **Mark stale records explicitly** — rather than deleting records you're unsure about, add a "Data Confidence" field: "Verified," "Needs Review," "Stale." Use this flag to exclude low-confidence records from active campaigns.

5. **Set up ongoing refresh** — for B2B data, verify contact records annually. For B2C, verify through engagement: any contact who opens an email is implicitly confirming their address is active.

---

## Problem 6: Mixed Data Types in a Single Field

**What it looks like:** A "Revenue" column containing numbers, dollar signs, commas, and text like "N/A" or "pending". A "Date" column with some rows formatted as actual dates and others as plain text strings.

**Why it happens:** Multiple people entering data manually without a consistent format, imports from different source systems, or formula outputs that return text in some cases and numbers in others.

**How to fix it:**

1. **Identify the mixed type** — scan the column for non-numeric values in a numeric field, or non-date values in a date field.

2. **Strip formatting characters** — remove "$", ",", "%" from numeric fields. Use find-and-replace or a formula like `=SUBSTITUTE(SUBSTITUTE(A2,"$",""),",","")`.

3. **Handle text placeholders** — replace "N/A", "pending", "TBD" with true null values so they don't corrupt calculations.

4. **Standardize date representations** — convert all text-format dates to a consistent date format your downstream system understands.

5. **Enforce type at entry** — configure input fields to accept only the correct data type. A currency field should only accept numbers.

## Frequently Asked Questions

**Q: What are the most common data quality problems?**
The most common data quality problems are duplicate records, missing values in critical fields, invalid formats (email, phone, date), inconsistent values in categorical fields, stale contact data, and mixed data types in a single field. These five issues account for the majority of data quality failures in small to mid-size businesses.

**Q: What's the difference between fixing data quality problems and preventing them?**
Fixing addresses existing bad data: deduplicating records, filling missing values, standardizing formats. Preventing addresses the source: adding validation rules at entry points, making critical fields required, enforcing controlled vocabularies. Both are necessary — fixing without prevention means the same problems recur; prevention without fixing leaves existing problems in place.

**Q: How long does it take to fix data quality problems?**
It depends on the size and scope of the problem. A targeted cleanup of duplicate records in a 5,000-row dataset can take 2–4 hours. A comprehensive data quality overhaul of a 100,000-row CRM with multiple problem types can take weeks. Start with the highest-impact problems first rather than trying to fix everything at once.

**Q: Can I fix data quality problems without deleting records?**
Yes. Many approaches involve flagging, marking as low-confidence, or moving to a separate segment rather than deleting. Deletion is appropriate for confirmed duplicates where you've merged the unique data. For stale records, marking as "dormant" or "needs verification" preserves the data while removing it from active use.

**Q: What's the best tool for fixing data quality problems in a spreadsheet?**
Google Sheets and Excel both support find-and-replace, data validation, COUNTIF-based duplicate detection, and conditional formatting. For large datasets or complex cleanup, uploading to a data quality tool is faster and more reliable than manual formula-based cleanup.

**Q: How do I fix duplicate records without losing unique data from the duplicates?**
Before deleting a duplicate, compare it to the master record field by field. Copy any unique data from the duplicate — a phone number that only appears there, a note, a different address — into the master record. Only then delete the duplicate.

**Q: How do I prevent data quality problems from coming back after I clean them?**
Fix the source, not just the dataset. Add validation rules at data entry points. Make critical fields required. Set up a controlled vocabulary for categorical fields. Create a data quality checklist for imports. Run a scheduled quality check to catch problems before they accumulate again.

**Q: What should I prioritize if I can't fix all data quality problems at once?**
Prioritize by impact: fix the problems affecting data currently in active use first. Then fix problems that create compliance risk (unexpected PII, inaccurate personal data). Then fix systemic problems that will keep recurring even if you clean the current dataset.

**Q: Can bad data be fully recovered?**
In most cases, yes — but not always back to 100%. Duplicate records can be merged. Invalid formats can be standardized. Missing values can sometimes be filled from other sources. Truly lost data (a field that was never collected and has no source to recover from) can't be recreated. This is why prevention is always more valuable than cure.

**Q: Is it worth cleaning old records that are no longer actively used?**
It depends. If old records will be used in a migration, reporting analysis, or historical comparison, cleaning them has clear value. If they're purely archival with no downstream use, cleaning them may not be worth the effort. Prioritize cleaning based on whether the data will be used, not based on how long it's been there.

---

**Most data quality problems are fixable — but only if you fix the source as well as the symptom. Clean the data, then build the guard rails that prevent it from getting dirty again.**

If you want to see the full picture of what's wrong with your most important dataset, Sohovi is free to try. Upload your CSV and get a complete quality breakdown — duplicates, missing values, format errors — in under a minute. No credit card, no IT team required.

[INTERNAL LINK: How to Run Your First Data Quality Audit (Step-by-Step)]
[INTERNAL LINK: How to Build a Data Quality Checklist for Your Business]

---
**Meta description:** Duplicate records, missing values, wrong formats, inconsistent fields — here's exactly how to fix the most common data quality problems your business faces.
