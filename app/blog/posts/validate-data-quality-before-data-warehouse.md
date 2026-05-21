---
title: "How to Validate Data Quality Before Loading Into a Data Warehouse"
slug: "validate-data-quality-before-data-warehouse"
category: "Data Quality in Workflows & Migrations"
primaryKeyword: "validate data quality before data warehouse"
supportingKeywords: ["data warehouse data quality", "pre-load validation", "ETL data quality", "data warehouse loading"]
searchIntent: "informational"
wordCountTarget: 1700
audience: "teams doing data migration, integration, or pipeline work"
status: "published"
seo_title: "How to Validate Data Quality Before Loading Into a Data Warehouse"
seo_description: "Pre-load data validation prevents bad data from polluting your warehouse. This guide covers the checks to run before every load — and how to automate them."
---

# How to Validate Data Quality Before Loading Into a Data Warehouse

**Validating data quality before loading into a data warehouse means running a set of automated checks on incoming data to catch problems before they reach your analytical tables — not after.**

Once bad data lands in a warehouse, it spreads. Analysts build reports on it, dashboards surface it to executives, and business decisions get made on numbers that were wrong before they ever arrived. Pre-load validation is the gate that stops that from happening.

## In this guide
- Why data warehouses amplify data quality problems
- The seven categories of pre-load validation checks
- How to structure validation in your ETL pipeline
- What to do when validation fails
- Automation options for continuous validation

## Why Warehouses Make Bad Data Worse

Operational systems contain bad data all the time — it's often isolated to individual records or departments. When that data flows into a warehouse, it aggregates. A bad date format in one CRM record becomes a broken fiscal quarter calculation. A duplicate customer ID becomes inflated revenue totals. An unexpected null in a sales table becomes a blank in every dashboard that references it.

Warehouses are built for analysis. That means bad data in the warehouse gets analyzed, not just stored. Pre-load validation is the only reliable way to stop quality problems from becoming analytical problems.

## The Seven Categories of Pre-Load Validation

### 1. Completeness Checks
Verify that required fields are populated.

- Define which fields are NOT NULL in the warehouse schema
- Check source data for nulls in those fields before load
- Set thresholds: if more than X% of rows are missing a required field, reject the batch

Completeness checks catch the most common issue: source systems that send incomplete records because of upstream form errors, API changes, or extraction bugs.

### 2. Format and Type Checks
Verify that values match the expected format or data type.

- Dates should follow a consistent format (ISO 8601 is standard for warehouses)
- Phone numbers, postal codes, and identifiers should match expected patterns
- Numeric fields should not contain strings or special characters
- Boolean fields should not contain arbitrary text like "yes" or "Y" when the schema expects 0/1

### 3. Range and Sanity Checks
Verify that numeric and date values fall within expected ranges.

- Prices should not be negative (unless returns are expected)
- Dates should not be in the future for historical event fields
- Quantities should not exceed physical maximums (nobody buys 10 million units of a product)
- Ages should be within human ranges if demographic data is involved

Sanity checks catch transformation errors and encoding problems that pass format validation but produce values that make no business sense.

### 4. Referential Integrity Checks
Verify that foreign keys resolve to valid parent records.

- Every order must have a valid customer_id
- Every line item must have a valid order_id
- Every event must reference a valid user or session

Broken references are common when source tables are extracted in isolation and relationships aren't maintained during the ETL process.

### 5. Uniqueness Checks
Verify that records that should be unique are actually unique.

- Primary keys in dimension tables (customers, products, locations) should not duplicate
- Transaction IDs should be unique
- Slowly Changing Dimension (SCD) logic should not create unintended duplicates

Duplicate records in dimension tables cause double-counting in aggregations — one of the hardest data quality bugs to detect after the fact.

### 6. Consistency Checks
Verify that values are consistent with each other and with historical data.

- If total_price = unit_price * quantity, verify that relationship holds
- If a record's status is "shipped," the ship_date should be populated
- Row counts for a given date range should be within expected variance of prior periods

Statistical consistency checks — comparing today's load row counts against a rolling average — catch extraction failures and upstream system outages that send partial data.

### 7. Freshness Checks
Verify that the data is current enough to be useful.

- Check the max timestamp in the incoming batch — is it recent?
- If the warehouse expects daily loads, the incoming batch should contain records from the last 24 hours
- Stale data that looks current is worse than missing data, because it silently misleads

Freshness checks catch ETL pipeline failures where a job appeared to succeed but was pulling from a cached or stale extract.

[IMAGE: Diagram showing the validation layer between source systems and the data warehouse, with pass/fail routing and quarantine path for failed records]

## Where to Run These Checks in Your Pipeline

**Option 1: Pre-load validation layer**
Run all checks before writing any records to the warehouse. If any check fails above the threshold, reject the entire batch or the failing records. Log the failure and alert.

This approach is cleanest but requires a staging area where incoming data sits before promotion to warehouse tables.

**Option 2: Staging table approach**
Load all records into a staging table first, run validation queries against staging, then promote passing records to production tables and quarantine failing records.

This is the most common approach for warehouses because it separates extraction from validation and allows partial loads (promote passing records, hold failing ones).

**Option 3: dbt tests**
If you're using dbt to transform data inside the warehouse, add dbt tests (not_null, unique, relationships, accepted_values) to validate after load. This is post-load validation — still valuable, but doesn't prevent bad data from entering the warehouse temporarily.

For critical dimensions and fact tables, combine the staging approach with dbt tests for defense in depth.

## What to Do When Validation Fails

Failure handling matters as much as detection. Common options:

**Reject and alert:** Reject the failing batch entirely, send an alert to the pipeline owner, do not load. Best for high-stakes tables where any bad data causes downstream damage.

**Partial load:** Quarantine failing records to a separate table, load passing records. Best for high-volume pipelines where a few bad records shouldn't block the entire load.

**Load with flag:** Load all records but add a data_quality_flag field that marks failing records. Downstream queries can then exclude flagged records. Best for exploratory datasets where completeness matters more than perfection.

**Threshold-based decisions:** Load if fewer than 1% of records fail. Reject if more than 5% fail. Alert but load if between 1% and 5%. Set thresholds based on the criticality of the table.

Document your failure handling rules in the pipeline. Undocumented failure handling leads to inconsistent behavior as pipelines are modified over time.

Tools like Sohovi can help you profile source data before it enters your pipeline — identifying null rates, format inconsistencies, and anomalies in CSV exports or upstream data samples before you run the load.

[INTERNAL LINK: Data Quality During an ETL Process: Where Quality Problems Start]

## Automating Pre-Load Validation

Manual validation is not sustainable at scale. Automate with:

- **Great Expectations:** Open-source Python library for defining and running data validation expectations against dataframes, databases, and files
- **dbt tests:** Built into dbt projects, runs validation as part of transformation
- **SQL assertion scripts:** Simple, maintainable, and version-controllable custom checks
- **Data observability platforms:** Monte Carlo, Anomalo, Bigeye — automated anomaly detection and freshness monitoring at the warehouse level

Whatever tooling you choose, version-control your validation rules alongside your pipeline code. When a rule changes (a field becomes optional, a range shifts), that change should be tracked like any other code change.

## Frequently Asked Questions

**Q: How is pre-load validation different from data profiling?**
Data profiling is exploratory — you run it to understand the shape of data you haven't seen before. Pre-load validation is operational — you run it repeatedly on incoming data to enforce known quality rules. Profiling informs what validation rules to write; validation enforces them.

**Q: Should I validate every field in every table?**
No. Start with the fields that are most critical to downstream analysis: primary keys, foreign keys, required business fields, and any field used in key reports. Over-validating slows pipelines and creates alert fatigue. Focus on fields where failure has real business impact.

**Q: What's a reasonable threshold for rejecting a batch?**
It depends on the table. For dimension tables (customers, products), even a 1% duplicate or null rate in key fields can cause significant downstream errors. For event or log tables, you might tolerate up to 5% failures in non-critical fields. Set thresholds based on downstream impact, not arbitrary percentages.

**Q: Can I validate in real-time pipelines or only batch?**
Both. Streaming pipelines (Kafka, Kinesis, Pub/Sub) can validate records inline as they arrive, routing failing records to a dead letter queue. The validation logic is the same — completeness, format, range, referential integrity — but it's applied per-event instead of per-batch.

**Q: How do I handle fields that are legitimately null sometimes but required other times?**
Use conditional validation: the field is required when condition X is met. For example, ship_date is required only when status = 'shipped'. Most validation frameworks support conditional rules. Document the business logic explicitly so future developers understand the intent.

**Q: What's the biggest risk of skipping pre-load validation?**
Analysts building reports and dashboards on silently corrupted data. The problem is that bad data in a warehouse is hard to find retroactively — it gets baked into reports, cached in BI tools, and embedded in business decisions before anyone notices the upstream source was wrong.

**Q: How often should I update my validation rules?**
Review them whenever the source system changes, when a new column is added, when a business definition changes, or when a new type of failure is detected. Treat validation rules as living documentation of what "good data" means for each table.

**Q: What's a staging table and why is it useful for validation?**
A staging table is a temporary table that holds incoming data before it's promoted to production warehouse tables. Validation runs against staging — if records pass, they're inserted into production; if they fail, they're quarantined or rejected. Staging allows partial loads and prevents failed batches from corrupting production tables.

**Q: How do I alert the right people when validation fails?**
Route alerts to the pipeline owner for technical failures (schema mismatch, format error, extraction failure) and to the business data owner for business rule failures (unexpected nulls, values outside expected range). Undifferentiated alerts that go to everyone get ignored — targeted alerts get acted on.

**Q: Does validation slow down my pipeline significantly?**
Simple validation (null checks, type checks, row counts) adds negligible latency. Statistical checks and referential integrity queries on large tables can add a few minutes. For time-sensitive pipelines, run lightweight checks inline and schedule heavier checks separately. The cost of validation is far lower than the cost of reprocessing bad data.

---

If you want to understand what's in your source data before it enters your warehouse, Sohovi can profile CSV exports instantly — surfacing null rates, format issues, and outliers without any pipeline setup. Try it free at sohovi.com — no code required.

**Meta description:** Pre-load data validation prevents bad data from polluting your warehouse. This guide covers the checks to run before every load — and how to automate them.
