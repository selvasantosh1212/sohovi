---
title: "What Is a Data Quality Rule?"
slug: "what-is-data-quality-rule"
category: "Data Quality Glossary"
primaryKeyword: "what is a data quality rule"
supportingKeywords: ["data quality rules examples", "data validation rules", "data quality check", "define data quality rules"]
searchIntent: "informational"
wordCountTarget: 1000
audience: "ops managers, analysts, business owners setting up data validation"
status: "draft"
seo_title: "What Is a Data Quality Rule? Definition + Examples"
seo_description: "A data quality rule is a condition your data must meet to be considered acceptable. Here's what they are, how they work, and examples for common data fields."
---

# What Is a Data Quality Rule?

If you've ever set up a dropdown in a form to prevent users from entering free text, you've written a data quality rule. The dropdown enforces that only allowed values get entered — that's the rule.

A data quality rule is a condition that a data field must satisfy for the data to be considered acceptable. Rules define what "good data" looks like for your specific business context.

## How Data Quality Rules Work

A data quality rule has three components:

1. **The field being tested**: Which column or attribute the rule applies to (e.g., "email address")
2. **The condition**: What the data must satisfy (e.g., "must contain @ followed by a domain")
3. **The action on failure**: What happens when a record doesn't meet the condition (e.g., flagged for review, rejected from import, assigned a failing quality score)

Rules are evaluated against each record in a dataset. Records that pass all applicable rules are considered "valid." Records that fail one or more rules are flagged as quality issues.

### A Simple Example

**Field**: `customer_email`
**Rule**: Value must contain "@" and end with a recognized domain format (e.g., `.com`, `.org`, `.net`)
**On failure**: Flag record as invalid, exclude from email campaign

When this rule runs against your customer list, it finds every email address that doesn't match the expected format — missing the "@", ending with an unrecognized extension, or blank entirely. Those records are your quality failures for this dimension.

## Types of Data Quality Rules

Rules can test different dimensions of data quality:

**Completeness rules**: Check whether required fields are populated.
- Example: "The `phone_number` field must not be empty for records in the `active_customers` table."

**Validity rules**: Check whether values match an expected format or set of allowed values.
- Example: "The `status` field must contain only: Active, Inactive, Pending, Closed."
- Example: "The `date_of_birth` field must match the format YYYY-MM-DD."

**Uniqueness rules**: Check whether values that should be unique are actually unique.
- Example: "The `customer_id` field must not contain duplicate values."

**Range rules**: Check whether numeric or date values fall within an acceptable range.
- Example: "The `order_amount` field must be greater than 0."
- Example: "The `contract_start_date` must not be in the future."

**Consistency rules**: Check whether related fields are internally consistent.
- Example: "If `contract_end_date` is populated, it must be later than `contract_start_date`."

**Referential integrity rules**: Check whether values in one field match valid values in a related field or table.
- Example: "The `territory_code` field must contain a value that exists in the `territories` reference table."

[IMAGE: Table showing different rule types with example fields, conditions, and failure descriptions]

## Writing Effective Data Quality Rules

Good rules are:

**Specific**: Vague rules produce inconsistent results. "Email should be valid" is less useful than "email must match the pattern `^[^@]+@[^@]+\.[^@]+$`."

**Measurable**: The pass/fail result must be deterministic — the same input always produces the same outcome.

**Business-relevant**: Rules should reflect actual business requirements, not theoretical standards. If your business accepts phone numbers in multiple formats, your validity rule should reflect that.

**Prioritized**: Not all rules matter equally. A missing email on a customer record is more critical than a missing middle name. Classify rules by severity (critical, high, medium, low) so your team knows which failures to fix first.

A tool like Sohovi comes with pre-built rules for common data types — email, phone, dates, uniqueness checks — so you can start validating immediately without writing rules from scratch.

## Rules vs. Constraints vs. Checks

These terms overlap but have slightly different meanings in practice:

- **Data quality rule**: A business-defined condition for what makes data acceptable in your context
- **Database constraint**: A technical enforcement mechanism at the database level (NOT NULL, UNIQUE, FOREIGN KEY) — prevents bad data from being entered
- **Data quality check**: The act of running rules against a dataset to evaluate whether records pass or fail

Database constraints prevent bad data at entry. Data quality rules catch bad data that's already in your system or arriving from external sources. Both are valuable; neither replaces the other.

## Frequently Asked Questions

**Q: How many data quality rules does a dataset need?**
Only as many as reflect real business requirements. Start with rules for your most important fields — the ones that, if wrong, would cause operational problems. Covering 5–10 fields with well-designed rules is more valuable than 50 rules on fields that don't matter.

**Q: Do data quality rules need to be written in code?**
Not necessarily. Conceptually, a rule can be documented in plain English ("email must not be blank") and then implemented in whatever tool your team uses — a spreadsheet formula, a data quality platform, a database constraint. Understanding the rule comes before implementing it.

**Q: What's the difference between a hard rule and a soft rule?**
A hard rule is absolute — a failure means the record is invalid and cannot be used (e.g., duplicate customer IDs). A soft rule is a warning — a failure suggests a potential issue worth reviewing but doesn't necessarily block the record (e.g., a phone number with fewer digits than expected).

**Q: What happens when data fails a quality rule?**
Depends on the business decision. Options include: reject the record from import, flag it for manual review, auto-correct where possible (e.g., standardize date format), log it for reporting, or assign a lower quality score. The response should be defined when the rule is designed, not improvised after a failure.

**Q: Who is responsible for defining data quality rules?**
The person who understands both the business requirement and the data. That's usually a combination of the data owner (who knows what the data should represent) and the ops or analyst team (who understands how it's used downstream). Rules shouldn't be written solely by IT without business input, or by business without technical review.

**Q: Can data quality rules change over time?**
Yes, and they should be reviewed regularly. Business requirements change, new data sources are added, and rules that once made sense may become outdated or overly restrictive. Treat your rule library as a living document.

---

**A data quality rule is how you translate "what good data looks like" into something your system can test automatically. Start with rules for your most critical fields, classify failures by severity, and act on the failures that matter most. Even five well-designed rules on your most important dataset will surface more actionable findings than an unfocused manual review.**

[INTERNAL LINK: How to Create Custom Data Validation Rules for Your Business]
[INTERNAL LINK: What Is Data Validation? A Complete Guide]
