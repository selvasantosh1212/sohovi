---
title: "How to Create a Data Quality Checklist for Any Data Migration Project"
slug: "data-quality-checklist-data-migration"
category: "Data Quality in Workflows & Migrations"
primaryKeyword: "data quality checklist data migration"
supportingKeywords: ["migration data quality", "pre-migration checklist", "data migration best practices", "data quality before migration"]
searchIntent: "informational"
wordCountTarget: 1800
audience: "teams doing data migration, integration, or pipeline work"
status: "published"
seo_title: "Data Quality Checklist for Data Migration Projects (Step-by-Step)"
seo_description: "Build a complete data quality checklist for any migration project. Covers profiling, deduplication, validation, and post-migration checks — with templates."
---

# How to Create a Data Quality Checklist for Any Data Migration Project

Every data migration failure shares a common theme: someone assumed the data was good enough to move. It wasn't. A data quality checklist forces you to verify before you migrate — and it's the difference between a smooth cutover and a three-month cleanup project.

## In this guide
- Why data migrations fail (and what a checklist prevents)
- The five phases of a migration quality checklist
- What to validate pre-migration, mid-migration, and post-migration
- Common mistakes teams skip and why they matter
- A reusable template to adapt for your project

## Why Most Migration Projects Skip Quality Checks

Time pressure is the main culprit. When a migration has a hard deadline — a system sunset, a contract end date, a product launch — quality checks get pushed to "after we're live." That's exactly when they cost the most to fix.

The second reason is assumption drift: teams assume the source system maintained data quality, when in reality most operational systems accumulate noise over years of use. Duplicate records, inconsistent formats, stale values, and broken references are common in any system that's more than two years old.

A checklist doesn't slow down a migration. It prevents the rework that would slow you down far more.

## Phase 1: Pre-Migration Profiling

Before touching any data, profile it. You need to know what you're working with.

**What to check:**
- Total record counts per entity (contacts, orders, products, accounts)
- Null rates per field — how often are required fields missing?
- Distinct value counts — how many unique values exist in categorical fields?
- Format consistency — do date fields all follow the same pattern? Are phone numbers normalized?
- Data age distribution — what percentage of records haven't been updated in 12+ months?

**Why it matters:** Profiling surfaces surprises before they become migration blockers. If 40% of your customer email addresses are missing or malformed, you need to know that before the new system rejects 40% of your imports.

Tools like Sohovi let you upload a CSV export from your source system and get an instant data quality report — flagging nulls, format issues, and duplicates before you write a single migration script.

## Phase 2: Pre-Migration Cleaning

Once you know what's wrong, fix what you can before migrating. This is easier in the source system than in the destination.

**Checklist items:**
- Deduplicate records (especially contacts and accounts — CRMs accumulate duplicates fast)
- Standardize formats: dates, phone numbers, addresses, country codes, currency
- Fill required fields that are currently null — or define a migration default value
- Remove clearly stale records that have no value in the new system (inactive records from 5+ years ago)
- Resolve orphaned records — child records whose parent no longer exists

**The rule:** Don't migrate garbage. Clean at the source if you can. If you can't, document what you're knowingly migrating so downstream teams aren't surprised.

## Phase 3: Mapping Validation

Data migration always involves transforming fields from a source schema to a destination schema. This is where silent corruption happens.

**Checklist items:**
- Does every source field have a mapped destination field?
- Are data types compatible? (String to integer conversions silently truncate data)
- Are required fields in the destination covered by source fields — or populated by a default?
- Are picklist/enum values in the destination compatible with source values? (Source has "United States", destination expects "US")
- Are relationships (foreign keys, references) preserved correctly?

**The trap:** Mapping looks right in a spreadsheet but breaks during execution. Always run a sample migration of 100–500 records and validate the output manually before running the full batch.

## Phase 4: Post-Migration Validation

After migration, reconcile. Don't just assume it worked.

**Checklist items:**
- Record counts: Source count vs. destination count per entity. If they don't match, find the gap.
- Sample spot-check: Pull 20–30 records from the destination and compare against source records manually.
- Referential integrity: Do all foreign keys resolve? Run queries to find broken relationships.
- Required field population: Are all required destination fields populated? Run null-count queries.
- Duplicate check: Did deduplication hold, or did any duplicates sneak through?
- Date and number range checks: Are there any values clearly outside expected ranges? (Negative prices, birthdates in 1900, future timestamps on historical records)

[IMAGE: Screenshot of a post-migration validation report showing source/destination record count reconciliation and field-level null rates]

## Phase 5: Business Validation

Technical validation passes, but does the data make sense to the people who use it?

**Checklist items:**
- Have department leads spot-checked their records in the new system?
- Do key reports and dashboards show expected values?
- Are calculated fields (deal values, totals, scores) producing correct outputs?
- Have you confirmed that no records were dropped that business users consider active?

Business validation catches errors that technical checks miss. A record count can match while individual records are silently corrupted. Get human eyes on the data before declaring the migration complete.

[INTERNAL LINK: How to Validate Data Quality After a System Migration]

## The Reusable Checklist Template

**Pre-Migration**
- Profile source data (nulls, formats, duplicates, counts)
- Deduplicate key entities
- Standardize formats
- Remove or document stale records
- Review field mapping for type compatibility and coverage

**During Migration**
- Run sample migration (100–500 records) and manually validate
- Check for transformation errors in logs
- Validate referential integrity on sample

**Post-Migration**
- Reconcile record counts per entity
- Spot-check 20–30 records manually
- Check null rates on required destination fields
- Check for duplicates in destination
- Run range/sanity checks on numeric and date fields

**Business Validation**
- Department lead spot-checks
- Report and dashboard review
- Confirm active records are present

---

## Frequently Asked Questions

**Q: How long should a data quality checklist review take before a migration?**
It depends on data volume and system complexity, but plan for at least one full sprint (two weeks) for the pre-migration profiling and cleaning phase alone. Rushing this phase is the most common cause of migration failures.

**Q: What's the most important item on a migration quality checklist?**
Record count reconciliation post-migration. If the numbers don't match between source and destination, something went wrong — and finding it immediately is far cheaper than discovering it six months later.

**Q: Should I clean data before or after migrating?**
Before, whenever possible. Cleaning in the source system is simpler because the tools, permissions, and business context are already in place. Post-migration cleaning in an unfamiliar destination system takes significantly longer.

**Q: What causes the most data quality failures during migration?**
Field mapping errors and undetected duplicates are the top two causes. Mapping looks correct in documentation but breaks on edge cases — and duplicates that existed in the source system often propagate to the destination unchanged.

**Q: Do I need a data quality tool, or can I use SQL queries?**
SQL queries work for technical validation, but they require someone who can write them. A data quality tool is faster for initial profiling and accessible to non-technical stakeholders who need to review results. Use both.

**Q: What's a "migration default value" and when should I use one?**
A migration default is a placeholder value used to satisfy a required field in the destination when the source has no data. For example, if the destination requires a country field and the source is missing it, you might default to "Unknown" or your primary market. Always document defaults so business users know which records used them.

**Q: How do I validate referential integrity after migration?**
Run queries that count orphaned records — child records whose parent ID doesn't exist in the parent table. For example: SELECT COUNT(*) FROM orders WHERE customer_id NOT IN (SELECT id FROM customers). If this returns anything, you have broken relationships.

**Q: What percentage of records should I spot-check manually?**
For migrations under 10,000 records, spot-check 50–100. For larger migrations, 20–30 representative records across different record types and ages is typically sufficient. Focus on edge cases: the oldest records, recently modified records, and records with the most complex data.

**Q: Is a data migration checklist different for cloud-to-cloud vs. on-premise migrations?**
The categories are the same, but cloud-to-cloud migrations often have API rate limits and data format constraints that require additional checklist items around throttling, field length limits, and authentication token handling. On-premise migrations may also involve file format and encoding checks that cloud APIs handle automatically.

**Q: What should I do if post-migration validation fails?**
Don't go live. Roll back if you can, or put a hold on cutover. Identify the cause: was it a mapping error, a transformation bug, or a data quality issue in the source? Fix the root cause, rerun the affected records, and revalidate before proceeding.

---

If you're approaching a migration and want to know exactly what's wrong with your source data before you start, Sohovi can profile your CSV exports in minutes — showing you null rates, format inconsistencies, and duplicates before they become migration blockers. Upload your first file free at sohovi.com — no code, no setup required.

**Meta description:** Build a reusable data quality checklist for any data migration. Covers pre-migration profiling, field mapping validation, post-migration reconciliation, and business sign-off.
