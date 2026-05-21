---
title: "What Is Data Integrity in Data Quality? (And How It Differs from Database Integrity)"
slug: "what-is-data-integrity"
category: "Data Quality Dimensions"
primaryKeyword: "what is data integrity"
supportingKeywords: ["data integrity definition", "data integrity examples", "data integrity vs data quality", "referential integrity"]
searchIntent: "informational"
wordCountTarget: 1000
audience: "business owners, analysts, ops teams who need to understand data integrity vs data quality"
status: "draft"
seo_title: "What Is Data Integrity? Data Quality vs. Database Integrity"
seo_description: "Data integrity in data quality means relationships between data are correct and consistent. Here's the definition, examples, and how it differs from database integrity."
---

# What Is Data Integrity in Data Quality? (And How It Differs from Database Integrity)

"Data integrity" is used in two distinct contexts that can cause significant confusion. A database engineer using the phrase means something different from a data quality practitioner using the same phrase. Here's a clear explanation of both — and why the distinction matters.

## Two Meanings of Data Integrity

### Data Integrity in Database Design

In database design, data integrity refers to the accuracy and consistency of data as enforced by the database itself through technical constraints:

**Entity integrity**: Every row in a table has a unique, non-null primary key. No two records are identical.

**Referential integrity**: Foreign key values in one table must match valid primary key values in the referenced table. An order record's `customer_id` must reference a real customer in the customers table — not a phantom ID.

**Domain integrity**: Column values must conform to defined data types, formats, and constraints. A date column only accepts valid dates. A price column only accepts positive numbers.

These are structural constraints enforced by the database engine. Violations are prevented at the technical level — the database rejects the insert or update.

### Data Integrity in Data Quality

In data quality, integrity is a broader concept: the degree to which data correctly and consistently represents the relationships between entities and the rules governing those relationships, even across systems that don't share a database-level constraint mechanism.

This includes:
- **Referential integrity across systems**: Does a customer ID in the billing system match a real customer in the CRM? The database can't enforce this cross-system constraint, so it must be checked at the data quality level.
- **Business rule integrity**: Does the data conform to logical relationships? Is `contract_end_date` always after `contract_start_date`? Does the sum of line item totals equal the order total?
- **Temporal integrity**: Does the sequence of dated events make sense? Is an order shipped date always after the order placed date?
- **Cross-field integrity**: If a field indicates "enterprise plan," do the related feature-usage fields reflect enterprise usage?

[IMAGE: Diagram showing an order record with a customer_id that doesn't exist in the customer table — a referential integrity violation]

## Why Data Integrity Matters for Data Quality

Integrity failures produce a specific class of problem: data that looks complete and valid in isolation but is actually wrong when examined in context.

An order record with a customer_id that doesn't reference a real customer will pass completeness checks (the field is populated) and validity checks (the format is correct). But the record is corrupt — it references a customer who doesn't exist. Any report that joins orders to customers will either drop this order or produce a null result. The data quality failure is invisible until the join fails.

Cross-system integrity failures are especially expensive because they're difficult to detect without comparing across systems. If your CRM has 5,200 customer records and your billing system has 4,900, the 300 customers in the CRM but not in billing represent an integrity failure — but neither system shows an error on its own.

## Common Data Integrity Failures

**Orphaned records**: Records that reference entities that no longer exist. An order referencing a deleted customer. A line item referencing a discontinued product.

**Cascade failures**: When a parent record is deleted or updated without updating child records. A customer's email changes in the CRM but not in the email marketing system — now the link between the two is broken.

**Logic violations**: A contract end date that's before the start date. A line item total that doesn't match the sum of its components.

**Cross-system divergence**: The same customer exists in two systems with different field values, and there's no clear rule for which system is authoritative.

## How to Check Data Integrity

**Cross-system record count comparisons**: Compare the number of records that should be in sync across two systems. Significant divergence indicates integrity failures.

**Foreign key validation**: For each foreign key field, check whether every value in that field exists as a primary key in the referenced table.

**Business rule validation**: Define and test cross-field rules. "contract_end_date must be >= contract_start_date." "order_total must equal sum of line item amounts."

**Date sequence validation**: Check that temporal sequences are logically ordered. "ship_date must be >= order_date."

Sohovi's consistency checks in your CSV profile catch cross-field logical inconsistencies and value anomalies — a starting point for integrity assessment even without database-level access.

## Frequently Asked Questions

**Q: Is data integrity the same as data quality?**
Data integrity is one dimension within data quality. Data quality is the broader concept covering completeness, accuracy, consistency, validity, uniqueness, timeliness, and integrity among others. Integrity focuses specifically on the correctness of relationships between data elements.

**Q: What is referential integrity?**
Referential integrity means that foreign key values in one table always reference valid primary key values in another table. An order's customer_id must point to a real customer; an invoice's product_id must point to a real product. When enforced by the database, referential integrity is a constraint. In data quality, it's a check that can be run across datasets.

**Q: Can you have good data quality without data integrity?**
No. A dataset where individual values are complete, accurate, and valid but relationships between records are broken is not high-quality data. Integrity is a necessary component of trustworthy data.

**Q: What is the difference between data integrity and data consistency?**
Consistency refers to values being represented the same way across records (same format, same vocabulary). Integrity refers to relationships between data elements being correct — foreign keys pointing to valid records, cross-field logic being satisfied. Both are quality dimensions; they describe different types of problems.

**Q: What's the most common data integrity failure?**
Cross-system divergence — where the same entity exists in multiple systems with different values and no clear reconciliation process. As businesses grow and add systems, this type of integrity failure compounds until reports from different systems begin producing contradictory results.

---

**Data integrity is the quality dimension that catches problems that don't exist in any single record — they emerge from the relationships between records, between fields, and between systems. Build integrity checks into any process that joins or compares data across sources, and your reports will stop producing inexplicable mismatches.**

[INTERNAL LINK: What Is Data Consistency? Why It's the Dimension That Breaks Reports]
[INTERNAL LINK: Data Quality vs. Data Governance: What's the Difference?]

---
**Meta description:** Data integrity in data quality means relationships between data are correct and consistent. Here's the definition, examples, and how it differs from database integrity.
