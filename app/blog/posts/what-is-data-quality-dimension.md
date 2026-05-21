---
title: "What Is a Data Quality Dimension?"
slug: "what-is-data-quality-dimension"
category: "Data Quality Glossary"
primaryKeyword: "what is a data quality dimension"
supportingKeywords: ["data quality dimensions definition", "data quality dimensions list", "dimensions of data quality", "how many data quality dimensions"]
searchIntent: "informational"
wordCountTarget: 1000
audience: "anyone new to data quality who needs to understand how it's measured"
status: "draft"
seo_title: "What Is a Data Quality Dimension? Definition + Full List"
seo_description: "A data quality dimension is a specific measurable aspect of data quality. Learn what the most important dimensions are, how they're measured, and which ones your business needs."
---

# What Is a Data Quality Dimension?

"Data quality" sounds like a single thing — but it isn't. Data can be complete but inaccurate. It can be accurate but inconsistently formatted. It can be consistent but outdated. Each of these is a different aspect of quality — a different dimension.

A data quality dimension is a specific, measurable aspect of data quality. Each dimension describes one way in which data can be "good" or "bad," independent of the other dimensions. Together, a set of dimensions gives you a complete picture of your data's quality.

## The Most Common Data Quality Dimensions

Different frameworks list different numbers of dimensions (some as few as 6, others as many as 15), but the following are the most universally recognized:

### Completeness
Are all required values present? A record is complete when every mandatory field has a non-null, non-empty value.

**How it's measured**: `(Count of populated fields / Total expected fields) × 100`

**Example failure**: A customer record with no email address is incomplete. An order record with no shipping address is incomplete.

### Accuracy
Do values correctly represent the real-world entity they describe? An accurate record reflects the current, true state of the thing it documents.

**How it's measured**: Accuracy is difficult to measure automatically — it requires comparison to a trusted reference or real-world verification. Common proxy: percentage of records that pass a known-correct reference check.

**Example failure**: A phone number that's no longer in service. A company address that moved two years ago.

### Consistency
Is the same information represented the same way across records and systems? Consistent data uses the same formats, values, and conventions throughout.

**How it's measured**: Agreement rate between related fields; percentage of values conforming to the expected format; variance in representations of the same entity.

**Example failure**: "United States" in one system and "USA" in another. "January 5, 2024" in one field and "01/05/2024" in another.

### Validity
Do values conform to the defined business rules and format requirements? Valid data is technically correct, even if it isn't necessarily accurate.

**How it's measured**: Percentage of values that pass defined validation rules (regex patterns, allowed value lists, range checks).

**Example failure**: An email address without "@". A status field containing "Maybe" when only "Active," "Inactive," and "Pending" are allowed.

### Uniqueness
Are records that should be distinct actually distinct? Unique data has no unintended duplicates.

**How it's measured**: Percentage of values in a unique field that appear exactly once; overall record-level duplicate rate.

**Example failure**: The same customer appearing twice in the CRM with slightly different name spellings.

### Timeliness
Is the data current enough for its intended use? Timely data reflects the state of the world as it exists when the data is needed.

**How it's measured**: Age of records (days since last update); percentage of records updated within a defined recency window.

**Example failure**: A contact list where 40% of phone numbers haven't been verified in three years.

### Conformity (or Standardization)
Does the data follow agreed-upon formats, naming conventions, and coding standards? Conformant data uses the expected representation consistently.

**How it's measured**: Percentage of values in a field that match the expected format or pattern.

**Example failure**: Date formats varying between ISO, US, and European conventions in the same column.

### Integrity
Are relationships between data elements correctly maintained? Integrity means that related records correctly reference each other and no orphaned records exist.

**How it's measured**: Percentage of foreign key values that match valid primary key values in related tables.

**Example failure**: An order record referencing a customer ID that doesn't exist in the customer table.

[IMAGE: A grid showing 8 data quality dimensions as tiles, each with a one-line definition and a single example failure]

## How Many Dimensions Do You Need?

DAMA's framework defines 6 core dimensions. Some organizations use 10 or more. The right number for your business is: as many as you can actually measure and act on.

For most small businesses, **5 dimensions** cover the most important quality concerns:

1. Completeness
2. Validity
3. Uniqueness
4. Consistency
5. Timeliness

Adding more dimensions only makes sense when you have the measurement infrastructure to track them and the capacity to act on failures.

## How Dimensions Are Used in Data Quality Scoring

A data quality score is typically an aggregate of dimension scores. Each dimension is measured for each key field, producing a per-dimension score. The scores are then weighted and aggregated into an overall quality score for the dataset.

Sohovi measures completeness, uniqueness, validity, and consistency for every column in your CSV and produces a single overall quality score — giving you a starting point for understanding which dimensions need the most attention.

## Frequently Asked Questions

**Q: What are the 6 dimensions of data quality according to DAMA?**
DAMA defines: completeness, accuracy, consistency, timeliness, uniqueness, and validity. These are the most widely referenced dimensions in data management literature.

**Q: Is data quality a single number or multiple scores?**
Both, depending on how you use it. You can track per-dimension scores for detailed diagnostics and aggregate them into a single overall quality score for reporting.

**Q: What's the difference between validity and accuracy?**
Validity asks: does this value conform to the defined format or rules? Accuracy asks: does this value correctly reflect reality? A phone number can be valid (correct format) but inaccurate (the person moved and the number is now out of service). Validity is machine-checkable; accuracy often requires human verification or comparison to a reference source.

**Q: Which dimension causes the most business problems?**
Uniqueness (duplicates) is frequently the highest-impact quality failure because it affects every downstream process — marketing, sales, billing, analytics — and often represents a larger share of records than expected. Completeness failures for high-value fields (email, phone) are a close second.

**Q: Do all data quality frameworks use the same dimensions?**
No. DAMA, ISO 8000, and various proprietary frameworks define slightly different sets. The specific labels matter less than having consistent, measurable definitions within your organization.

---

**Data quality dimensions are the vocabulary you need to talk about data quality precisely. Instead of "the data is bad," you can say "completeness is 87% on the email field and uniqueness is 94% on the customer ID field." That specificity is what makes quality problems actionable.**

[INTERNAL LINK: The 10 Dimensions of Data Quality Explained]
[INTERNAL LINK: What Is a Data Quality Score and How Is It Calculated?]

---
**Meta description:** A data quality dimension is a specific measurable aspect of data quality. Learn what the most important dimensions are, how they're measured, and which ones your business needs.
