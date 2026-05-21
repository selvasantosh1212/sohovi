---
title: "What Is Data Validity? How Business Rules Define Good Data"
slug: "what-is-data-validity"
category: "Data Quality Dimensions"
primaryKeyword: "what is data validity"
supportingKeywords: ["data validity definition", "data validity examples", "valid data meaning", "data validity vs accuracy"]
searchIntent: "informational"
wordCountTarget: 1000
audience: "ops managers, analysts, business owners setting up data validation rules"
status: "draft"
seo_title: "What Is Data Validity in Data Quality? Definition and Examples"
seo_description: "Data validity measures whether data values conform to defined business rules and format requirements. Here's what it means, how it differs from accuracy, and how to measure it."
---

# What Is Data Validity? How Business Rules Define Good Data

An email address entered as "johnatcompanydotcom" has a completeness score of 100% — the field isn't blank. But it fails validity — it doesn't conform to the required email format. Validity is the dimension that catches values that are present but structurally wrong.

Data validity measures the degree to which data values conform to the business rules, format requirements, and constraints defined for that field. A valid value is one that meets all the technical and logical rules that apply to it, regardless of whether it's accurate.

## What "Valid" Means for Different Field Types

Validity rules vary by field type:

**Email fields**: Must contain "@" followed by a domain with a valid extension. "john@company.com" is valid. "johncompany.com" is invalid. "john@" is invalid.

**Date fields**: Must match the expected format and represent a real date. "2024-01-15" (ISO format) is valid. "01/32/2024" (32nd of January) is invalid. "January 15 2024" (wrong format for an ISO date field) fails validity even if it's a real date.

**Phone number fields**: Must contain the correct number of digits for the expected country format. May need to match a pattern for format consistency.

**Categorical/enum fields**: Must contain a value from the approved list. A status field that allows only "Active," "Inactive," and "Pending" is invalid for any record containing "yes," "active," or "enrolled."

**Numeric range fields**: Must fall within an acceptable range. An age field should be between 0 and 120. A negative order quantity is invalid. A percentage field should be between 0 and 100.

**Referential fields**: Must contain a value that exists in a related table. An order record's customer_id must match a real customer in the customers table.

## Validity vs. Accuracy: An Important Distinction

This is one of the most common points of confusion in data quality:

**Validity**: Does the value conform to the defined rules? Machine-checkable against the rule definition.

**Accuracy**: Does the value correctly represent reality? Requires comparison to a trusted external source or the real world.

An email address of "john.smith@company.com" may be:
- Valid and accurate: format is correct AND the person uses this email
- Valid but inaccurate: format is correct BUT the person has a different email or left the company
- Invalid and inaccurate: format is wrong AND the value isn't real

Validity is necessary but not sufficient for accuracy. You can check validity automatically; accuracy requires more.

[IMAGE: Decision tree showing valid-accurate, valid-inaccurate, and invalid-inaccurate combinations with examples]

## How to Measure Data Validity

The formula:

`Validity Rate = (Records passing all defined rules / Total records) × 100`

Applied to a specific field: count the records where the value passes all the validity rules for that field, divide by total records, multiply by 100.

You need to define the rules before you can measure validity. "Email must be valid" is not a measurable rule. "Email must match the pattern `^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$`" is.

## Common Validity Rules by Field Type

| Field | Rule |
|---|---|
| Email | Contains "@" and a domain; doesn't contain spaces |
| Phone | 10 or 11 digits (US), no letters |
| Date | Matches expected format; represents a real calendar date |
| Status | Must be one of: Active, Inactive, Pending |
| Order quantity | Integer, greater than 0 |
| Age | Integer, between 0 and 120 |
| ZIP code | 5 digits (US) or 5+4 format |
| URL | Starts with http:// or https:// |
| Currency amount | Non-negative decimal, up to 2 decimal places |

## What Causes Validity Failures

**No input validation at entry**: Free-text fields with no format enforcement produce values in any format users invent.

**Data migration without transformation**: Migrating data from a system that used different formats produces validity failures in the destination system.

**Third-party data without standardization**: External data files follow the source system's conventions.

**Manual bulk edits without validation**: Batch updates or manual fixes that bypass form validation.

**Evolving business rules**: Rules that were redefined after existing data was entered — old records no longer conform to new standards.

## How to Improve Data Validity

**Enforce rules at entry**: Use dropdowns for categorical fields. Require formats with field masks (phone input that only accepts digits). Validate email format on the form before submission.

**Validate at import**: Every data import should include a validation step that checks incoming records against defined rules and rejects or quarantines failures.

**Fix historic failures**: For fields with high historic invalidity rates, define a remediation campaign to clean up existing records.

**Document your rules**: Write down the validity rules for every critical field. This documentation prevents different teams from applying different rules to the same field.

Sohovi runs validity checks on common field types automatically when you profile a CSV — email format validation, phone format validation, date format consistency, and categorical value frequency analysis. This tells you which fields have validity problems before you import.

## Frequently Asked Questions

**Q: Is data validity the same as data quality?**
Data validity is one dimension of data quality. Quality is the broader concept encompassing completeness, accuracy, consistency, uniqueness, timeliness, and validity among others. Validity alone is not sufficient for high-quality data.

**Q: What is the difference between validity and conformity?**
Validity checks whether values meet defined rules (correct email format, allowed status values). Conformity (also called standardization) checks whether values follow a specific format standard (ISO date format, E.164 phone format). They overlap, but conformity typically refers to format standards while validity includes business logic rules.

**Q: Can a valid value be wrong?**
Yes. Validity is about rule conformance, not truth. An email address of the correct format but belonging to someone else is valid but inaccurate. This is why validity and accuracy are treated as separate dimensions.

**Q: How many validity rules should a dataset have?**
As many as reflect real business requirements. A rule that doesn't correspond to a real constraint adds overhead without value. Start with rules for fields where invalidity has caused downstream problems.

**Q: What is cross-field validation?**
Cross-field validation checks relationships between multiple fields in the same record. "If contract_end_date is populated, it must be after contract_start_date." Single-field validity checks one field in isolation; cross-field validation checks logical relationships.

---

**Data validity is the dimension that separates "technically present" from "actually correct format." Validity rules are the mechanism for enforcing that distinction automatically. Define your rules for the fields that matter most, apply them at entry and at import, and review validity failures as a regular part of your data quality process.**

[INTERNAL LINK: What Is Data Accuracy in Data Quality? A Plain-English Business Guide]
[INTERNAL LINK: How to Create Custom Data Validation Rules for Your Business]

---
**Meta description:** Data validity measures whether data values conform to defined business rules and format requirements. Here's what it means, how it differs from accuracy, and how to measure it.
