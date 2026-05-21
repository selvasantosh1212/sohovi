---
title: "What Is Data Cleansing?"
slug: "what-is-data-cleansing"
category: "Data Quality Glossary"
primaryKeyword: "what is data cleansing"
supportingKeywords: ["data cleansing definition", "data cleansing vs data cleaning", "data scrubbing", "how to cleanse data"]
searchIntent: "informational"
wordCountTarget: 1000
audience: "business owners, ops managers, anyone dealing with messy data"
status: "draft"
seo_title: "What Is Data Cleansing? Definition, Process, and Examples"
seo_description: "Data cleansing is the process of detecting and correcting inaccurate, incomplete, or inconsistent data in a dataset. Here's what it means, how it works, and when to do it."
---

# What Is Data Cleansing?

Every dataset accumulates errors over time — missing values, typos, duplicate records, outdated information, wrong formats. Data cleansing is the systematic process of finding and fixing those errors so the data is accurate, consistent, and fit for use.

Data cleansing (also called data cleaning or data scrubbing) is the process of identifying and correcting inaccurate, incomplete, duplicate, or otherwise problematic records in a dataset.

## What Data Cleansing Fixes

Data cleansing addresses problems across several dimensions:

**Missing values**: Fields that are blank when they should have data. A customer record with no email address. An order with no shipping address. Cleansing either fills missing values (by lookup, imputation, or manual entry) or flags incomplete records for review.

**Duplicate records**: The same entity (customer, product, vendor) appearing multiple times in the dataset. Cleansing identifies duplicates and either removes redundant copies or merges them into a single authoritative record.

**Format inconsistencies**: Dates in different formats (01/15/2024 vs. January 15, 2024 vs. 2024-01-15). Phone numbers with and without dashes. Addresses with and without ZIP+4. Cleansing standardizes formats across all records.

**Invalid values**: Values that don't conform to expected rules. An email address without "@". A date of birth in the future. A negative order quantity. Cleansing flags or removes records that fail validation rules.

**Outdated information**: Phone numbers that no longer work. Email addresses that bounce. Addresses for locations that no longer exist. Cleansing removes or updates stale records.

**Structural errors**: Extra spaces, inconsistent capitalization, special characters in unexpected fields, merged cells (if the source is a spreadsheet).

### Example

Raw customer dataset problems found during cleansing:
- 847 records with no email address (completeness failure)
- 312 duplicate customer entries (uniqueness failure)
- 1,240 phone numbers formatted inconsistently (format failure)
- 94 email addresses that fail syntax validation (validity failure)
- 180 records with a future date in the "Date Created" field (logic failure)

A cleansing process addresses each category in turn, producing a dataset that's ready for use.

## How Data Cleansing Works

The cleansing process typically follows these steps:

**1. Audit (profile the data)**: Identify what problems exist and how many records are affected. This is the assessment step — you can't fix what you haven't found.

**2. Define standards**: Before cleaning, establish what "correct" looks like. Which date format is standard? What are the valid values for the status field? What's the required format for phone numbers?

**3. Fix format and structural issues**: Standardize date formats, phone formats, capitalization, and encoding. These are typically low-risk and can be automated.

**4. Handle missing values**: Decide what to do with each type of missing value — impute, flag, remove, or leave blank with a note.

**5. Deduplicate**: Identify and resolve duplicate records. This is often the most time-intensive step because it requires judgment about which record to keep or how to merge information.

**6. Validate**: Run the data against your defined standards to confirm the cleansed dataset meets the expected quality levels.

**7. Document**: Record what was changed, removed, or merged, and why. This audit trail is important for compliance and for understanding the dataset's history.

[IMAGE: Before/after table showing a row with format errors and missing values on the left, and the same row cleansed and standardized on the right]

## Data Cleansing vs. Data Quality

Data cleansing is a remediation activity — it fixes problems that already exist. Data quality management is the broader ongoing practice of measuring, monitoring, and preventing data quality problems.

Cleansing without ongoing quality management is like bailing water out of a leaking boat. You improve the immediate situation, but without fixing the source of the problem (the data entry process, the integration, the form design), the errors return.

After cleansing a dataset, profile it with a tool like Sohovi to document the baseline quality metrics. Then set up regular quality checks so you can detect when quality starts to degrade again before it requires another major cleansing effort.

## When to Cleanse Your Data

- **Before a major campaign**: An email list should be cleansed before a large send to protect sender reputation
- **Before a system migration**: Migrating bad data to a new system doesn't improve it
- **Before a business decision**: If you're making a significant decision based on data, verify the data quality first
- **Before data sharing**: Data shared with partners or customers reflects on your organization
- **On a regular schedule**: High-value datasets benefit from routine cleansing and quality checks

## Frequently Asked Questions

**Q: Is data cleansing the same as data cleaning?**
Yes, the terms are interchangeable. "Data cleansing," "data cleaning," and "data scrubbing" all refer to the same process of identifying and correcting errors in a dataset.

**Q: What is the difference between data cleansing and data quality?**
Data cleansing is a one-time (or periodic) remediation activity — finding and fixing problems in a specific dataset. Data quality management is the ongoing practice of measuring, monitoring, and controlling data quality across your organization. Cleansing is a tactic; data quality management is a strategy.

**Q: How long does data cleansing take?**
For a moderately messy dataset of a few thousand records, a thorough cleanse typically takes several hours to a few days depending on the complexity. The profiling step (finding the problems) often takes longer than the fixing step. Using an automated profiling tool significantly reduces the discovery time.

**Q: Can you automate data cleansing?**
Partially. Format standardization, duplicate detection, and validity checks can be highly automated. Resolving complex duplicates (where it's not obvious which record is correct) and filling in missing values with accurate information often require human judgment.

**Q: What are the risks of poor data cleansing?**
Cleaning too aggressively can remove valid records. Merging duplicates incorrectly can lose information. Imputing missing values incorrectly can introduce false data. Good cleansing is methodical, documents every change, and applies rules consistently rather than making ad hoc decisions.

**Q: What's the first step in cleansing a dataset?**
Profile it first — understand the full scope of the problems before changing anything. Running a data quality audit before cleansing gives you a baseline against which you can measure improvement and ensures you're fixing the right things.

---

**Data cleansing is not glamorous, but it's foundational. Clean data produces accurate reports, reliable campaigns, and decisions you can trust. The key is treating it as a repeatable process with documented standards — not a one-time heroic effort that silently decays until the next crisis.**

[INTERNAL LINK: How to Run Your First Data Quality Audit (Step-by-Step)]
[INTERNAL LINK: Data Quality vs. Data Cleansing: What's the Difference?]

---
**Meta description:** Data cleansing is the process of detecting and correcting inaccurate, incomplete, or inconsistent data in a dataset. Here's what it means, how it works, and when to do it.
