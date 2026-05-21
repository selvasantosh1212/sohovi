---
title: "Why Your Reports Are Wrong: Tracing Problems Back to Data Quality"
slug: "why-your-reports-are-wrong-data-quality"
category: "Analytics, BI & Downstream Effects"
primaryKeyword: "why reports are wrong data quality"
supportingKeywords: ["wrong reports data quality", "inaccurate reports", "report discrepancies data quality", "fixing wrong reports"]
searchIntent: "informational"
wordCountTarget: 1500
audience: "analysts, BI users"
status: "published"
seo_title: "Why Your Reports Are Wrong: Tracing Problems Back to Data Quality"
seo_description: "When a report shows the wrong number, the cause is almost always in the data — not the query. Here's how to trace report errors back to their source and fix them permanently."
---

# Why Your Reports Are Wrong: Tracing Problems Back to Data Quality

You've been asked why the sales dashboard doesn't match the spreadsheet finance sent. Or why the customer count in your CRM doesn't match the number your CEO read in a board report. Or why the same metric looks different in two dashboards that both claim to show the same thing.

These discrepancies aren't random. They follow predictable patterns — and almost all of them trace back to data quality problems in the source, not mistakes in the query.

## In this guide
- The most common reasons reports show wrong numbers
- How to systematically trace a report error to its data source
- The difference between a query bug and a data quality bug
- Permanent fixes vs. workarounds
- How to prevent report discrepancies before they happen

## Why Two Reports That Should Match Don't

Before diving into data quality, it's worth understanding why report discrepancies are so common. The answer is usually one of these:

**Different source tables:** Two reports that claim to measure the same thing might pull from different tables. The CRM "customer count" might come from the contacts table; the finance "customer count" might come from the billing system. If the two systems don't stay in sync, they'll always diverge.

**Different filters applied:** One report counts all accounts; another counts only active accounts. If the definition of "active" isn't shared, the numbers won't match even if the underlying data is identical.

**Different date logic:** One report uses created_date; another uses purchased_date. Or one uses UTC timestamps while the other uses local time. A single timezone difference can shift a day's worth of records between reporting periods.

**Different deduplication:** One report deduplicates customer records; another counts raw rows. If the source has duplicates, only one report will show an inflated number.

All of these are fundamentally data quality and data definition problems — not query bugs.

## The Most Common Data Quality Root Causes of Wrong Reports

### Duplicates inflating counts and totals

Every duplicate record in your source data becomes an inflated metric in any report that counts or sums it. If your CRM has 200 duplicate customer records out of 2,000, every customer count report is overstated by 10%.

The challenge: duplicates are invisible until you look for them. A COUNT(*) query on a table with duplicates returns a number — it just doesn't tell you it's wrong.

### Nulls understating sums and averages

NULL values are excluded from SUM, AVG, MIN, and MAX calculations. A revenue field that's null for 15% of records will produce a SUM that's understated by those missing values. The number looks real — there's no error message, no indication that records were skipped.

### Inconsistent categorical values creating phantom segments

Report filters and GROUP BY clauses work on exact string matches. When the same category is stored differently across records — "SaaS", "saas", "Software as a Service", "SAAS" — a filter for one value misses the others. A report grouped by that field shows four separate categories instead of one.

### Date format inconsistencies breaking time series

DATE() functions and comparison operators expect consistent date formats. When date fields contain mixed formats ("2024-01-15" and "01/15/2024" in the same column), most databases either fail silently or treat the inconsistent values as NULL. Period comparisons return wrong counts because some records aren't included.

### Cross-system join mismatches

When a report joins two tables — say, customer attributes from a CRM and transaction data from a billing system — the join succeeds only when the key fields match exactly. If one system uses "US" and another uses "United States", customer-level reports built on that join will undercount records or produce NULLs for unmatched rows.

[IMAGE: Flowchart tracing a revenue discrepancy from a BI dashboard back through the data warehouse join to a duplicate in the source CRM]

## How to Trace a Report Error to Its Data Source

When a report shows an unexpected number, follow this diagnostic sequence:

**Step 1: Reproduce the discrepancy.** Can you consistently reproduce the wrong number? Is it always wrong or intermittently wrong? Intermittent discrepancies often point to timing issues (different snapshots); consistent discrepancies point to structural data problems.

**Step 2: Identify the source tables.** What tables does the report query? What filters and joins does it use? If you don't have access to the underlying query, ask the person who built the report.

**Step 3: Profile the source tables on the key fields.** Run a null count, a duplicate check, and a distinct value count on every field that the report filters, groups, or aggregates by. This surfaces most quality issues immediately.

**Step 4: Check the date logic.** Are dates being compared across the same timezone? Do different tables use different date fields for the same concept (created_date vs. activated_date vs. purchase_date)?

**Step 5: Check for fan-out from joins.** Run the joins in isolation and check whether they're producing unexpected row multiplication. A join that should return 1,000 rows returning 1,400 is a fan-out — it means one table has multiple matches per key in the other.

**Step 6: Compare with the source system.** Pull the same calculation directly from the source system (not through the warehouse or BI tool) and compare. If the numbers match, the problem is in the pipeline or transformation. If they don't, the problem is in the source.

## Query Bug vs. Data Quality Bug

These require different fixes:

**Query bug:** The SQL logic is wrong — wrong join, wrong filter, wrong aggregation. Fix is in the query. Doesn't recur after the fix.

**Data quality bug:** The data is wrong. Even if you fix the query, the data is still wrong — and will produce wrong results for any other query that touches the same fields. Fix requires changing the source data or the process that produces it.

Most report discrepancies are data quality bugs that get diagnosed as query bugs. The analyst "fixes" the query by adding a DISTINCT or a COALESCE — which masks the symptom without addressing the cause. The same problem surfaces in the next report built on the same table.

Tools like Sohovi can help profile your source tables before you build reports on them — instantly surfacing null rates, format inconsistencies, and duplicate counts that will cause report errors downstream.

[INTERNAL LINK: How Data Quality Affects Your Analytics and Business Intelligence]

## Permanent Fixes vs. Workarounds

**Workaround (avoid):** Adding DISTINCT to COUNT to remove duplicates in the query. Using COALESCE to fill in nulls. Manually excluding specific records in a WHERE clause. These hide the problem in the report but don't fix the data — and require every new report touching that data to apply the same workaround.

**Permanent fix:** Fix the data at the source. Deduplicate the source table. Fill in missing required values. Standardize categorical values. Fix the process that's producing invalid dates. Then the fix applies to every report that touches that data, automatically.

If fixing the source isn't possible (legacy system, read-only data), fix it in the data pipeline. Apply transformations that clean and standardize the data before it reaches the warehouse. Document what was cleaned and why, so future analysts know the lineage.

## Preventing Report Discrepancies Before They Happen

**Profile source tables before building reports.** Before you write your first query, check null rates, duplicate rates, and categorical value distributions on the key fields.

**Define shared metrics.** Create a single, documented definition for each key metric — what it counts, what filters it applies, what source it uses. When everyone reports from the same definition, discrepancies become easier to diagnose.

**Validate pipelines when source systems change.** Report errors most commonly spike after a system upgrade, a data migration, or an integration change. Validate your source tables after any such change.

**Add data quality checks to your BI layer.** Most modern BI tools support calculated fields and alerts. Add a check that flags when a key metric is outside its expected range — before users see it.

## Frequently Asked Questions

**Q: Is it possible to have two reports that query the same table but show different numbers?**
Yes, easily. Different date ranges, different filters, different aggregation logic, or even different timezone handling can produce different results from the same underlying table. When reports disagree, always verify that they're using identical definitions before assuming the data is wrong.

**Q: How do I convince my team that a report discrepancy is a data quality problem and not a query bug?**
Show the source data. Pull the raw records that the report should be counting and show the problem directly: these 200 rows are duplicates, these 150 rows have null values that are excluded from the SUM. Making the data quality problem visible is far more convincing than explaining it abstractly.

**Q: Should I fix data quality issues in the BI tool or at the source?**
At the source whenever possible. Fixing in the BI tool creates workarounds that every future analyst must replicate. Fixing at the source makes the data correct for every downstream consumer.

**Q: What's the fastest way to find duplicates in a source table?**
Run: SELECT [key field], COUNT(*) FROM [table] GROUP BY [key field] HAVING COUNT(*) > 1. This returns every value that appears more than once. If you don't have SQL access, export the table to CSV and run a duplicate check in a profiling tool.

**Q: Why do reports sometimes show different numbers on different days for the same time period?**
This usually means the underlying data is changing retroactively — records are being updated, deleted, or backdated after the fact. It can also mean the snapshot timing differs (one report was cached yesterday; another was refreshed today). Check whether your source data has late-arriving updates or retroactive changes.

**Q: How do you handle a report that's been wrong for months and stakeholders have been making decisions based on it?**
Disclose immediately. Continuing to circulate a known-wrong report is worse than the disruption of correcting it. Report the corrected number, explain the root cause, and describe the fix. Trust is rebuilt faster with transparency than with attempts to quietly correct without acknowledgment.

**Q: What's the most common reason two dashboards built by different people show different numbers for the same metric?**
Different filter logic — specifically, different definitions of the entity being counted. "Customer" might mean "has ever made a purchase" in one dashboard and "currently has an active subscription" in another. Standardize metric definitions in a shared data dictionary so everyone uses the same logic.

**Q: How do time zones cause report discrepancies?**
When event timestamps are stored in UTC and one report converts to local time while another uses UTC directly, events that happen near midnight can shift to different days. In a business that does significant volume after 8pm EST (1am UTC), this can shift a meaningful portion of daily transactions between reporting periods.

**Q: Should I document data quality issues I find during report investigations?**
Yes. When you find a data quality problem while debugging a report, document it: which table, which field, what the problem is, how many records are affected, and whether it's been fixed or is still present. This prevents the same investigation from happening again and builds institutional knowledge about known quality issues.

**Q: How long should it take to trace a report discrepancy to its root cause?**
For an analyst with SQL access and a clear view of the data pipeline, most simple discrepancies (wrong filter, duplicate records, null exclusion) can be traced in 30–90 minutes. Complex cross-system discrepancies involving multiple tables and transformations can take half a day. If it takes longer than that repeatedly, the pipeline lacks sufficient documentation or visibility.

---

If you want to profile source tables before building reports on them — and catch quality issues before they corrupt your analytics — Sohovi can profile any CSV export in minutes. Try it free at sohovi.com — no code, no engineering required.

**Meta description:** When a report shows the wrong number, the cause is almost always in the data — not the query. Here's how to trace report errors back to their source and fix them permanently.
