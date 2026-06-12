---
title: "Free Data Quality Audit Template (Run a Self-Audit in One Afternoon)"
slug: "data-quality-audit-template-free"
category: "Practical How-To Guides"
primaryKeyword: "data quality audit template"
supportingKeywords: ["data quality self-audit", "data quality assessment template", "free data quality template", "data quality scorecard", "how to audit data quality"]
searchIntent: "informational"
wordCountTarget: 2000
audience: "manager or team lead — buyer persona — who wants to understand where their data quality stands and needs a structured approach to find out"
status: "published"
seo_title: "Free Data Quality Audit Template (Run a Self-Audit in One Afternoon)"
seo_description: "A complete data quality audit template you can run in one afternoon. Includes: dataset inventory, per-dimension scoring rubric, issues log, and remediation priority matrix — free to use."
---

# Free Data Quality Audit Template (Run a Self-Audit in One Afternoon)

**This template gives you a structured, one-afternoon process to audit the data quality of any dataset** — a CRM export, a product catalog, a customer list, or an operational database. You'll end up with: a quality score per dimension, a prioritized issues list, and a clear picture of what to fix first.

It's designed for people who are responsible for data but don't have a data engineering background. No code, no SQL.

---

## The Template Structure

The audit has four components:

1. **Dataset Inventory** — what you're auditing and who owns it
2. **Per-Dimension Quality Scoring** — score each dataset across the 6 quality dimensions (1–5 scale)
3. **Issues Log** — document every problem found with severity and owner
4. **Remediation Priority Matrix** — rank fixes by impact vs. effort

Download the spreadsheet version or copy the structure below.

---

## Component 1: Dataset Inventory

Fill out one row per dataset you're auditing:

| Dataset Name | System / Source | Row Count | Owner | Last Cleaned | How Often Used |
|--------------|----------------|-----------|-------|-------------|----------------|
| Customer contacts | CRM (Salesforce) | 12,400 | Sales Ops | Never | Daily |
| Product catalog | Shopify export | 3,200 | E-comm team | 6 months ago | Weekly |
| Email list | Mailchimp export | 8,100 | Marketing | 2 months ago | Monthly |

**Why this matters:** You can't prioritize what to fix without knowing what exists and who uses it. Datasets used daily with no recent clean are your highest-priority audits.

---

## Component 2: Per-Dimension Quality Scoring

Score each dataset on a 1–5 scale across the six quality dimensions. Use the rubric below.

### The 6 Dimensions

**1. Completeness** — what percentage of required fields are populated?

| Score | What it looks like |
|-------|-------------------|
| 1 | More than 30% of required fields are empty across the dataset |
| 2 | 15–30% of required fields have missing values |
| 3 | 5–15% of required fields have missing values |
| 4 | 1–5% of required fields have missing values |
| 5 | Under 1% missing on all required fields |

**How to measure:** In Excel, `=1 - COUNTBLANK(column)/COUNTA(column)` per column, then average across required columns.

---

**2. Accuracy** — do values reflect the true state of the world?

| Score | What it looks like |
|-------|-------------------|
| 1 | Known factual errors in more than 20% of records |
| 2 | Errors in 10–20% of records |
| 3 | Errors in 3–10% of records |
| 4 | Errors in under 3% of records |
| 5 | No known factual errors; validation confirms accuracy |

**How to measure:** Spot-check 50 random records against the source of truth (the actual customer, the actual product spec). Extrapolate the error rate.

---

**3. Consistency** — do the same entities look the same across records and systems?

| Score | What it looks like |
|-------|-------------------|
| 1 | Same entity has 5+ different representations in the data |
| 2 | 3–5 representations (major naming, format inconsistencies) |
| 3 | 2–3 representations (e.g., "NY" and "New York" both appear) |
| 4 | Minor variations (trailing spaces, case) |
| 5 | Fully consistent — same entity has one representation |

**How to measure:** Pivot table on key categorical columns. Count unique values and identify variants.

---

**4. Validity** — do values conform to the expected format and rules?

| Score | What it looks like |
|-------|-------------------|
| 1 | More than 20% of records fail at least one format/rule check |
| 2 | 10–20% fail validation checks |
| 3 | 3–10% fail |
| 4 | Under 3% fail |
| 5 | 100% of records pass all validation rules |

**How to measure:** Write validation checks for key columns (email format, date range, phone number pattern) using Excel formulas or Sohovi validation rules. Count failures.

---

**5. Uniqueness** — are entities represented only once?

| Score | What it looks like |
|-------|-------------------|
| 1 | Duplicate rate above 15% |
| 2 | Duplicate rate 8–15% |
| 3 | Duplicate rate 3–8% |
| 4 | Duplicate rate 1–3% |
| 5 | Duplicate rate under 1% |

**How to measure:** Run deduplication check on key identifier columns (email, customer ID, account name + website). See: [How to Remove Duplicate Rows in Excel](/blog/remove-duplicate-rows-excel).

---

**6. Timeliness** — is the data current enough for its use case?

| Score | What it looks like |
|-------|-------------------|
| 1 | Data is more than 2 years old with no updates |
| 2 | 1–2 years old; significant decay expected |
| 3 | 6–12 months old |
| 4 | 1–6 months old |
| 5 | Under 1 month old, updated regularly |

**How to measure:** Look at the `last_updated` or `created_at` timestamps in your data. If no timestamp exists, that's itself a data quality issue.

---

### Scoring Sheet Example

| Dataset | Completeness | Accuracy | Consistency | Validity | Uniqueness | Timeliness | **Avg Score** |
|---------|-------------|----------|-------------|----------|------------|------------|--------------|
| Customer contacts | 3 | 2 | 2 | 3 | 2 | 2 | **2.3** |
| Product catalog | 4 | 4 | 3 | 3 | 4 | 3 | **3.5** |
| Email list | 4 | 3 | 4 | 4 | 3 | 3 | **3.5** |

A score below 3.0 warrants immediate action. A score of 3.0–3.5 needs planned remediation. Above 4.0 is well-maintained.

---

## Component 3: Issues Log

For each problem you find during scoring, log it:

| Dataset | Dimension | Issue Description | Rows Affected | Severity (H/M/L) | Owner | Resolution |
|---------|-----------|-------------------|---------------|-----------------|-------|------------|
| Customer contacts | Uniqueness | Duplicate email addresses — same contact in CRM twice | ~350 | High | Sales Ops | Dedup with fuzzy matching |
| Customer contacts | Accuracy | Phone numbers with wrong country code (US numbers with +91 prefix) | ~120 | High | Sales Ops | Re-import from original source |
| Product catalog | Consistency | Product category uses 3 different names for same category | ~200 | Medium | E-comm | Standardize to canonical list |

**Severity guide:**
- **High:** Affects revenue, causes customer-facing errors, violates compliance
- **Medium:** Degrades analysis quality, causes operational friction
- **Low:** Cosmetic inconsistency, no operational impact

---

## Component 4: Remediation Priority Matrix

Plot your issues on this 2×2:

|  | **Easy to fix** | **Hard to fix** |
|--|----------------|----------------|
| **High impact** | Fix immediately (quick wins) | Plan carefully, fix next sprint |
| **Low impact** | Fix in batch | Defer or accept |

**Quick wins** (high impact, easy): standardizing date formats, removing exact duplicates, trimming whitespace, validating email formats.

**Plan carefully** (high impact, hard): sourcing correct data from an upstream system, deduplcating across multiple systems, re-ingesting from source.

**Batch fixes** (low impact, easy): casing standardization, categorical cleanup, leading zero fixes.

**Defer**: cosmetic inconsistencies that don't affect analysis or operations.

---

## How to Fill in the Scores Faster

The per-dimension scoring requires actually measuring each metric. Manual measurement in Excel takes 2–4 hours for a typical dataset. Sohovi's profile report gives you the numbers for Completeness, Uniqueness, and Validity automatically — upload your dataset and paste the metrics directly into the scoring sheet. Accuracy and Timeliness still require judgment calls that only you can make.

---

## Frequently Asked Questions

**Q: How often should I run this audit?**
For datasets used in business decisions, marketing, or customer communication: quarterly at minimum. For critical operational data (billing, inventory, CRM pipeline): monthly. For reference data that changes infrequently: annually.

**Q: Should I score every dataset in the company?**
Start with your highest-use, highest-stakes datasets — the ones used in regular reports, customer-facing workflows, or compliance processes. A 10-dataset audit is manageable in one afternoon. A 100-dataset audit requires a dedicated project.

**Q: What's a good target overall score?**
3.5 or above is a reasonable target for a business dataset that's regularly used. 4.0 and above for datasets used in compliance or customer-facing workflows. Below 3.0 in any dimension means that dimension needs immediate attention.

**Q: Can I share this template with my team?**
Yes — the structure above is free to use and adapt. The goal is to have a shared language and scoring methodology so different team members audit consistently.

---

**Skip the manual scoring.** Upload each dataset to Sohovi and paste the profile scores — completeness rates, duplicate rates, format validity — straight into the template. Free, in your browser, nothing uploaded.

[INTERNAL LINK: The 6 Dimensions of Data Quality — Hub Page]
[INTERNAL LINK: How to Convince Your Boss to Invest in Data Quality]
