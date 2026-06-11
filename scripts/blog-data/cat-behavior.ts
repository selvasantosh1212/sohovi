export const catBehavior: Array<{
  title: string; slug: string; excerpt: string; content: string;
  category: string; tags: string[]; seo_title: string; seo_description: string; published: boolean;
}> = [
  {
    title: "What Is Adaptive Data Quality? (And Why Static Rules Aren't Enough)",
    slug: "adaptive-data-quality-explained",
    excerpt: "Static data quality rules catch known problems. Adaptive data quality catches problems you never anticipated — by learning what 'normal' looks like for your data.",
    category: "Data Quality Fundamentals",
    tags: ["adaptive data quality", "data quality rules", "behavioral scoring", "data anomaly detection", "data monitoring"],
    seo_title: "What Is Adaptive Data Quality? | Sohovi",
    seo_description: "Learn what adaptive data quality means, how it differs from static rule-based approaches, and why it matters for modern data teams.",
    published: true,
    content: `**Adaptive data quality is a monitoring approach that learns what "normal" looks like for your data and automatically flags deviations — without you having to write a rule for every possible failure mode.**

Traditional data quality tools work by checking whether data satisfies a set of hand-crafted rules: is the email formatted correctly? Is the value within a specified range? Is the required field populated? These rules work well for problems you know about in advance. But data breaks in ways you never anticipate — and static rules are silent when that happens.

Adaptive data quality solves this by building a statistical baseline from your historical data and raising alerts whenever a new batch deviates significantly from that baseline.

## Why Static Rules Fail in Practice

Static rules have three fundamental limitations.

**They only catch what you predicted.** If your data engineer wrote a rule that checks whether null rate is below 10%, a jump from 0.5% to 8% slips through with no warning. A jump from 0.5% to 80% fails the rule — but by then, the damage may already be done downstream.

**They don't account for context.** A 5% null rate might be completely normal for your "notes" column but catastrophic for your "customer_id" column. Static thresholds treat all columns equally unless you manually tune each one — which takes hours and goes stale as data evolves.

**They can't detect unknown unknowns.** A new upstream system integration might start sending data in a slightly different format. A pipeline bug might start duplicating a subset of rows. A new value might appear in a categorical field that downstream code doesn't handle. None of these have a pre-written rule.

## How Adaptive Data Quality Works

The core mechanism is statistical: after each run, the system stores summary statistics for each column (null rate, cardinality, mean, standard deviation, min, max, dominant values). Over time, this builds a baseline of what "normal" looks like.

When a new batch arrives, each column's statistics are compared against the baseline. The comparison uses z-scores: how many standard deviations away is the new observation from the historical mean? If the deviation exceeds a threshold (commonly 3 sigma), the system flags it as a behavioral anomaly.

This means the system automatically learns:
- Your "customer_email" column normally has 0.5% nulls — a run with 15% nulls is a 6-sigma event
- Your "order_value" column averages $127 with a std dev of $40 — a run averaging $890 is suspicious
- Your "status" column has always been one of four values — a new value "SUSPENDED_FRAUD" appearing at 22% is a distribution shift

None of these require a hand-crafted rule. The system catches them automatically.

Sohovi's Behavioral Scoring implements exactly this approach — after two completed runs on an asset, every subsequent run generates a Behavior Score (0–100) alongside the traditional DQ Score, with per-column flags showing exactly which metrics shifted and by how much.

## Adaptive Quality vs Static Rules — Which to Use?

You need both. Static rules encode known business requirements: an email field must match the email regex, an age must be positive, a required field must be populated. These are non-negotiable constraints that adaptive learning can't replace.

Adaptive scoring catches everything else — the unexpected, the gradual drift, the pipeline bug you didn't know happened. Think of static rules as your contract with the data and adaptive scoring as your canary in the coal mine.

## The Metrics That Matter Most

The most valuable metrics to monitor adaptively are:

- **Null rate per column** — the most common signal of upstream data issues
- **Cardinality** — if a supposedly-unique column starts having duplicates, or a low-cardinality enum suddenly has hundreds of values
- **Mean and standard deviation** — for numeric columns, sudden shifts in average value indicate a data problem
- **Row count** — a pipeline that normally produces 50k rows and suddenly produces 500 rows has probably broken
- **Dominant values** — for categorical columns, new values that weren't in the historical distribution

## When Behavioral Scoring Beats Static Rules

Consider a monthly customer file that normally contains 45,000–52,000 rows. One month, the pipeline produces 12,000 rows because a filter condition was accidentally changed. Your static rules might all pass — the nulls are fine, the formats are fine — but the row count is 75% below normal. Only adaptive scoring catches this.

Or consider a status column that historically contains "active", "inactive", "pending". A new upstream system starts sending "ACTV", "INACTV", "PEND" — your enum validation rule fails, but it's unclear why. Adaptive distribution shift detection tells you immediately: three new values appeared that weren't in the previous run's distribution.

## Key Takeaways

- Static rules catch known problems; adaptive scoring catches unknown deviations
- Behavioral baselines are built automatically from run history — no manual configuration needed
- Z-score comparison flags statistically unusual changes even when static rules pass
- The combination of static rules + adaptive scoring gives you full coverage

---

**FAQ**

**Q: How many historical runs do I need before adaptive scoring works?**
A: Most implementations (including Sohovi) require at least 2 historical completed runs to establish a baseline. The more runs you have, the more accurate the baseline.

**Q: Can adaptive scoring replace static rules entirely?**
A: No. Static rules encode business requirements that adaptive learning can't infer. Use both together.

**Q: What is a z-score in this context?**
A: A z-score measures how many standard deviations an observation is from the historical mean. A z-score of 3 means the value is 3 standard deviations away — which is statistically unusual enough to flag.

**Q: What is a "normal" z-score threshold for flagging?**
A: Most implementations use 3 as the minimum threshold. Values with z-scores of 4–6 are medium severity; above 6 is high severity.

**Q: Does adaptive scoring work for small datasets?**
A: It works, but it's more meaningful with larger datasets and more run history. For small datasets, the baseline is more volatile.

**Q: What's the difference between adaptive scoring and anomaly detection?**
A: They're closely related. Adaptive scoring is a form of time-series anomaly detection applied to data quality metrics.

**Q: How does distribution shift detection work?**
A: It compares the most frequent values in a column between the current run and the previous run. New dominant values that weren't present before are flagged.

**Q: Can I configure the z-score threshold?**
A: In most systems, yes. Sohovi's behavioral scorer uses a threshold of 3 by default (flagging at 3+ sigma deviations).

**Q: Is my data sent to a server for behavioral scoring?**
A: Sohovi computes behavioral scoring from aggregated statistics (null rates, averages, value counts) — never from raw row data. Your data stays in your browser.

**Q: How is the Behavior Score calculated?**
A: Each behavioral flag subtracts points based on severity: high severity flags subtract 10 points, medium subtract 5, low subtract 2. The score starts at 100 and cannot go below 0.

[IMAGE: Side-by-side comparison of a DQ run detail page showing a static DQ Score of 97 passing alongside a Behavior Score of 30 with a red null-rate anomaly flag]
[INTERNAL LINK: What Is Data Quality? A Complete Beginner's Guide]`,
  },
  {
    title: "How to Write Data Quality Rules in Plain English Using AI",
    slug: "ai-data-quality-rules-plain-english",
    excerpt: "You shouldn't need to know SQL or memorize 27 rule types to validate your data. AI-powered rule generation lets you describe what you want in plain English.",
    category: "AI & Data Quality",
    tags: ["AI data quality", "natural language rules", "data quality automation", "AI rule builder", "no-code data quality"],
    seo_title: "Write Data Quality Rules in Plain English with AI | Sohovi",
    seo_description: "Learn how AI-powered rule builders let you describe what your data must satisfy in plain English and generate the right DQ rules automatically.",
    published: true,
    content: `**AI-powered data quality rule builders let you describe what your column must satisfy in plain English — "email must not be blank and must be a valid format" — and automatically generate the correct technical rule configuration.**

Writing data quality rules has always required technical expertise. You needed to know which dimension applied (completeness? validity? conformity?), which specific rule type to choose (not_null? format_check?), what parameters were required (which template? which regex?), and what threshold made sense. For a non-technical analyst, this is a significant barrier.

AI rule generation removes that barrier entirely.

## The Problem with Traditional Rule Builders

Traditional DQ rule builders present a cascade of choices:
1. Select a dimension (completeness, validity, accuracy, uniqueness…)
2. Select a rule type within that dimension
3. Fill in required parameters (regex pattern, allowed values, min/max, etc.)
4. Set a threshold percentage

This works well for engineers who know what they want and understand the terminology. But for most users — data analysts, marketing operations teams, finance staff managing their own datasets — the mental overhead is significant.

The result is that DQ rules are either written by the few technical people who understand the taxonomy, or they're skipped entirely. Neither outcome is good.

## How AI Rule Generation Works

Modern AI rule builders use language models to translate plain-English descriptions into structured rule configurations. You describe what you want; the AI translates that into the correct dimension, rule type, and parameter values.

For example, you select the 'phone_number' column and type:

> "Phone must not be blank and must be a valid US phone format"

The rule builder understands that:
- "not blank" → Completeness → 'not_null' rule (threshold: 0.99)
- "valid US phone format" → Conformity → 'format_check' rule with template "phone" (threshold: 0.95)

Both rules are generated in under 3 seconds, with a confidence score and plain-English reason for each.

Sohovi's AI Builder (available in the Rules tab → "AI Builder" tab) uses local keyword pattern matching to translate your description into rules. It runs entirely in your browser — no external service, no API key, no data transmitted anywhere.

## What Makes a Good Rule Description

The AI interprets your intent, but clearer descriptions produce better results. The most effective descriptions follow a pattern:

**Field-level constraints:** "Must not be blank," "Must be unique," "Must be a valid email"

**Value constraints:** "Must be positive," "Must be between 0 and 10000," "Must be one of: active, inactive, pending"

**Format constraints:** "Must match date format YYYY-MM-DD," "Must be a US zip code," "Must be a UUID"

**Cross-field constraints:** "Must be greater than the start_date column"

Vague descriptions like "should be good" or "needs to be correct" are harder to parse. The more specific you are about the constraint, the better the rule.

## Reviewing AI-Generated Rules

AI-generated rules come with a confidence score. High-confidence rules (85%+) are well-matched to the description and column type. Lower-confidence rules are more interpretive and should be reviewed carefully.

Always check:
- **Threshold:** The AI suggests a default (usually 95%). Adjust it based on your data — a required field might need 99%, a best-effort field might use 80%.
- **Parameters:** For regex patterns and enum lists, verify the values are correct.
- **Dimension:** Confirm the rule is in the right quality dimension — this affects how it contributes to dimension-level scores.

The AI is a starting point, not the final word. Review and adjust before accepting.

## Privacy and Security

A common concern with AI rule builders is privacy: does my data get sent to the AI? In a well-designed system, no. Only the column name, inferred data type, and your plain-English description are sent. The actual row values in your CSV stay entirely in your browser.

Sohovi's AI Builder enforces this by design: rules are generated locally in your browser using pattern matching — no server call, no external service, and no data transmitted at all.

## Use Cases Where AI Rule Building Shines

**Non-technical analysts owning their own data quality.** A marketing analyst managing a contact list can now add DQ rules without needing a data engineer.

**Rapid onboarding of new datasets.** When a new CSV arrives from a vendor, describe the expected column constraints in plain English and generate a baseline ruleset in minutes.

**Documenting institutional knowledge.** Subject matter experts know what valid data looks like in their domain. AI rule builders let them express that knowledge without learning DQ tool syntax.

**Iterative rule refinement.** Describe the constraint, accept the rule, run DQ, see which rows fail, refine the description, regenerate.

## Key Takeaways

- AI rule builders translate plain-English constraint descriptions into technical DQ rule configurations
- Rules are generated locally — no data leaves your browser, no external service is called
- Generated rules come with confidence scores and reasons — review before accepting
- AI rules complement manual rules; they don't replace the need for expert review
- The quality of output depends on the specificity of your description

---

**FAQ**

**Q: Which AI model powers the rule builder?**
A: None — Sohovi's rule builder uses local keyword pattern matching that runs in your browser. No AI model or external API is involved.

**Q: Is my data sent to the AI?**
A: No. Only your column name, inferred type, and description text are sent. Your actual data values stay in your browser.

**Q: What if the AI generates the wrong rule?**
A: Don't accept it. Each generated rule has an "Accept" button — you review before any rule is saved.

**Q: Can I generate rules for multiple columns at once?**
A: Currently one column at a time. Select the column, describe the constraint, generate, accept. Repeat for each column.

**Q: What rule types can the AI generate?**
A: All 27 rule types across all 10 quality dimensions. The AI picks the best match based on your description.

**Q: How confident should I be in the generated rules?**
A: High-confidence rules (85%+) are generally reliable. Below 70%, review carefully and consider adjusting the description to be more specific.

**Q: Do I still need manual rules?**
A: Yes. Complex cross-column logic, business-specific constraints, and nuanced thresholds often require manual configuration.

**Q: How long does rule generation take?**
A: Typically 2–4 seconds depending on description complexity.

**Q: Can the AI suggest rules I didn't think of?**
A: Yes. If you describe a general constraint ("must be a valid phone number"), the AI may suggest both a format check and a completeness rule — catching constraints you didn't explicitly request.

**Q: Is the AI builder available on all plans?**
A: Yes — the AI Rule Builder runs entirely in your browser using local pattern matching. It requires no API key, no external service, and no additional configuration. It is available on all Sohovi plans.

[IMAGE: Screenshot of the AI Rule Builder tab showing a column selected, a plain-English description typed, and two generated rule cards: not_null and format_check with confidence scores]
[INTERNAL LINK: How to Add Data Quality Rules in Sohovi]`,
  },
  {
    title: "Data Drift vs Schema Drift: What's the Difference?",
    slug: "data-drift-vs-schema-drift",
    excerpt: "Data drift and schema drift are two distinct ways your data can change unexpectedly. Understanding the difference helps you monitor the right signals.",
    category: "Data Quality Dimensions",
    tags: ["data drift", "schema drift", "data quality monitoring", "data changes", "pipeline monitoring"],
    seo_title: "Data Drift vs Schema Drift: Key Differences Explained | Sohovi",
    seo_description: "Understand the difference between data drift and schema drift, how each affects your data quality, and how to detect both automatically.",
    published: true,
    content: `**Schema drift is a structural change — columns added, removed, or renamed. Data drift is a statistical change — values shifting in distribution, null rates changing, or new categories appearing. Both can silently break downstream systems.**

When data pipelines break, they usually break in one of two ways: either the structure of the data changes (schema drift) or the content of the data shifts (data drift). These are fundamentally different problems that require different detection strategies.

## What Is Schema Drift?

Schema drift occurs when the structure of a dataset changes:
- A column is added
- A column is removed
- A column is renamed
- A column's data type changes (string → integer)
- Column order changes (in systems that depend on position)

Schema drift is usually the result of a change in an upstream system — a new field added to a CRM export, a column removed from a vendor API response, or a pipeline modification by another team.

The danger of undetected schema drift is that downstream code, rules, and dashboards silently break. A report that was summing the 'revenue' column now fails because the column was renamed to 'total_revenue'. A quality rule on the 'email' column produces no results because the column is now called 'email_address'.

Sohovi detects schema drift automatically: every time you upload a new file for an asset, the column list is compared against the previous upload. Added and removed columns are shown in an amber banner on the run detail page.

## What Is Data Drift?

Data drift occurs when the structure stays the same but the content changes:
- The null rate in a column doubles
- The average value of a numeric column shifts by 3x
- A categorical column gains new values it never had before
- The cardinality of a supposedly-unique column increases dramatically
- The dominant pattern in a column changes (e.g., date format changes from MM/DD/YYYY to YYYY-MM-DD)

Data drift is harder to catch than schema drift because the data still looks structurally valid. The CSV loads, the columns are all there, your static rules might pass — but something has changed that affects data quality downstream.

## Why Data Drift Is Harder to Catch

Schema drift is binary: either a column exists or it doesn't. You can check it with a simple set comparison.

Data drift is statistical: you're asking whether the distribution of values in this run is meaningfully different from the historical distribution. That requires a baseline, a comparison, and a judgment about what counts as "meaningfully different."

This is why data drift detection requires adaptive, statistical approaches — like z-score comparison across historical runs — rather than simple rule checks.

## The Three Types of Data Drift

**Statistical drift** — numeric column averages, std deviations, null rates, or uniqueness percentages shift outside of their historical range. Example: order value column average shifts from $120 to $890 in a single run.

**Distribution drift** — the frequency distribution of values in a categorical column changes. New values appear, old values disappear, or the relative frequencies shift dramatically. Example: "status" column historically had 60% "active", now shows 10% "active" and 50% "churned".

**Type drift** — the inferred data type of a column changes. A column that was being parsed as "date" now contains strings that look like dates but don't parse correctly. This overlaps with schema drift in some systems.

## How to Monitor Both

**For schema drift:** Compare column lists between runs. Flag any column that appears or disappears. Most DQ tools (including Sohovi) do this automatically on upload.

**For data drift:** Store per-column statistics from each run (null rate, cardinality, mean, std dev, top values). Compare each new run's statistics against the historical distribution using z-scores. Flag when the deviation exceeds a threshold.

The challenge is that schema drift monitoring is table-stakes and widely implemented. Data drift monitoring is less common in lightweight tools — it's usually an enterprise-tier feature in platforms like Collibra, Monte Carlo, and Anomalo.

Sohovi's Behavioral Scoring brings this capability to small businesses: every run automatically computes and stores column statistics, and the behavioral scorer compares them across runs using z-scores. You get drift detection without needing an enterprise data observability platform.

## Which One Is More Dangerous?

Both can cause serious problems, but they manifest differently:

Schema drift tends to cause **immediate, visible failures** — reports break, queries fail, ETL pipelines error out. You notice it quickly.

Data drift tends to cause **slow, invisible degradation** — reports still run, but the numbers are wrong. You might not notice for days or weeks. By then, decisions have been made on bad data.

This makes data drift arguably more dangerous: the failure is silent and the consequences compound over time.

## Key Takeaways

- Schema drift = structural change (columns added, removed, renamed, retyped)
- Data drift = content change (distributions shifting, new values, null rate changes)
- Schema drift is detected by comparing column lists — binary check
- Data drift requires statistical comparison against historical baselines
- Both need to be monitored; both can silently damage downstream systems
- Adaptive behavioral scoring is the most effective approach for data drift detection

---

**FAQ**

**Q: Can schema drift cause data drift?**
A: Yes. A renamed column might force a pipeline to use a fallback that produces different data distributions.

**Q: Is data drift always a problem?**
A: Not always. Some drift is expected — seasonality, business growth, new customer segments. The question is whether the drift was anticipated and planned for.

**Q: How do I distinguish expected drift from unexpected drift?**
A: Expected drift should be documented and threshold-adjusted. Unexpected drift — especially sudden, large deviations — is the signal to investigate.

**Q: What tools detect data drift?**
A: Enterprise tools include Monte Carlo, Anomalo, and Collibra DQ. Lightweight alternatives like Sohovi offer behavioral scoring as a built-in feature.

**Q: How many historical runs do I need for drift detection?**
A: At minimum 2, but 5–10 provides a more reliable baseline.

**Q: Does schema drift detection work for database sources, not just CSV?**
A: Yes, for any source where column schemas can be compared across ingestion runs.

**Q: What's the difference between data drift and concept drift?**
A: Concept drift is a machine learning term — it refers to changes in the statistical relationship between input features and a target variable. Data drift in the DQ context refers to changes in the distribution of values in a dataset, regardless of ML.

**Q: Can I get alerted about both types of drift automatically?**
A: Sohovi detects schema drift on every upload and computes behavioral drift after each DQ run — both are surfaced on the run detail page without any additional configuration.

**Q: Does data drift detection work for categorical columns?**
A: Yes — distribution shift detection specifically targets categorical columns, flagging when new dominant values appear or existing values disappear.

**Q: What's the difference between data drift and data degradation?**
A: Data degradation is a general term for quality worsening over time. Data drift is a specific, measurable change in statistical distribution — it's one cause of data degradation.

[IMAGE: Two-column diagram: left column shows schema drift with columns being added and removed; right column shows statistical drift with a bar chart of null rates rising over time]
[INTERNAL LINK: What Is Data Profiling?]`,
  },
  {
    title: "How to Detect Data Distribution Shift Without Writing SQL",
    slug: "detect-data-distribution-shift",
    excerpt: "Distribution shift — when a categorical column gains new values or changes its frequency profile — is one of the hardest data quality issues to catch with static rules.",
    category: "Data Quality Fundamentals",
    tags: ["distribution shift", "data quality", "categorical data", "data monitoring", "behavioral scoring"],
    seo_title: "How to Detect Data Distribution Shift Without SQL | Sohovi",
    seo_description: "Learn what data distribution shift is, why it's hard to catch, and how to detect it automatically without writing SQL or custom monitoring scripts.",
    published: true,
    content: `**Data distribution shift happens when the frequency profile of values in a column changes between data loads — and it's nearly invisible to static rule-based quality checks.**

Your static rules check that values are valid, non-null, and correctly formatted. But they don't check whether the *mix* of values has changed. If your "payment_method" column used to be 70% credit card and 30% bank transfer, and now it's 5% credit card and 95% bank transfer — all your rules pass, but something has clearly changed upstream.

That's a distribution shift. And it's one of the sneakiest data quality problems in existence.

## Why Distribution Shift Is Hard to Catch

Static rules are well-suited for absolute constraints: a field must not be null, a value must be within a range, a format must match a pattern. These checks don't depend on history — they evaluate each value in isolation.

Distribution shift requires historical context. To know that the proportion of "credit card" payments is anomalously low, you need to know what "normal" looks like. That means storing historical value frequency data and comparing the current run against it.

Most lightweight DQ tools don't do this. Enum validation rules can check that a value is *one of* the allowed set, but they don't check whether the *proportion* of each value has shifted.

## Types of Distribution Shift

**New value emergence** — A value appears in the current run that was never present in historical data. Example: "CANCELLED_FRAUD" appearing as a payment status when only "COMPLETED", "REFUNDED", and "FAILED" existed before.

**Dominant value shift** — The top value changes between runs. Example: "active" was 65% of the "status" column; now it's 8%. "churned" went from 5% to 72%.

**Frequency collapse** — A value that was previously common effectively disappears. Example: "manual" order type drops from 40% to 0.1%.

**Frequency explosion** — A value that was previously rare becomes dominant. Example: a product category "other" goes from 2% to 89%.

## How Automatic Detection Works

The most common approach is to store the top N values and their frequencies after each run, then compare the current run's distribution against the previous run (or against a rolling average of recent runs).

Specific detection patterns:

**New value detection:** If value V appears in the current run's top values but was absent from the previous run's top values, flag it — especially if V represents a significant percentage (e.g., >5% of rows).

**Top value change detection:** If the most frequent value changes from run to run, flag it. This is a strong signal of a significant distributional shift.

**Shannon entropy comparison:** Compute the entropy of the value distribution for each run. A large change in entropy indicates a significant shift in how values are distributed, even if no individual value is new.

Sohovi's behavioral scoring uses the first two approaches: it flags new values in the current run that were absent from the previous run, and it specifically flags when a new value becomes the dominant entry (>10% frequency) where one wasn't before.

## Real-World Examples

**E-commerce returns:** Your "return_reason" column historically shows "damaged", "wrong_item", "changed_mind". A new run shows "qa_defect" at 34% frequency — a product quality issue that no static rule would catch.

**CRM sync issues:** Your "lead_source" column was 50% "organic", 30% "paid", 20% "referral". A pipeline bug starts marking everything as "import" — distribution shifts to 95% "import" — real lead source data is lost.

**Status code changes:** An upstream API updates its status codes from numeric (1, 2, 3) to string ("active", "inactive", "pending"). Distribution shift detection flags that the numeric values disappeared and new string values appeared.

**Data refresh failures:** A partial pipeline run produces a batch where only a subset of regions is included. The "region" column's distribution shifts dramatically — "Northeast" drops from 25% to 2% because only that region's data was refreshed.

## Implementing Detection Without SQL

You don't need SQL to implement distribution shift detection. The algorithm is straightforward:

1. After each run, store the top 10–20 values and their frequencies for each column.
2. When a new run completes, compare its top values against the previous run's top values.
3. Flag any value in the new run's top values that was absent from the previous run's top values.
4. Flag if the top-1 value changed.

Sohovi implements this automatically — the profiler stores top values for every column, and the behavioral scorer compares them between runs. Distribution shift flags appear in the Behavior Score card on every run detail page, with no configuration required.

## How to Respond to a Distribution Shift Alert

When you see a distribution shift flag:

1. **Confirm it's real** — check the raw data or upstream source to verify the distribution actually changed.
2. **Classify it** — is this an expected change (new product line, new customer segment) or a data quality issue?
3. **Trace the source** — if unexpected, trace backward through your pipeline to find where the change was introduced.
4. **Update baselines if legitimate** — if the shift is real and expected, the baseline will naturally update over subsequent runs.

## Key Takeaways

- Distribution shift is a change in the frequency profile of categorical column values
- Static rules cannot detect it because they don't compare against historical distributions
- Automatic detection requires storing historical value frequencies and comparing across runs
- Common signals: new values appearing, dominant value changing, frequency collapse or explosion
- Sohovi's behavioral scoring flags distribution shifts automatically with no configuration

---

**FAQ**

**Q: Do I need to configure which columns to monitor for distribution shift?**
A: No. Sohovi monitors all columns automatically.

**Q: What percentage threshold triggers a distribution shift flag?**
A: A new value is flagged if it appears in the current run's top values but was absent from the previous run. A "dominant value shift" is flagged if a new value reaches >10% frequency.

**Q: Does distribution shift detection work for numeric columns?**
A: For numeric columns, behavioral scoring uses statistical checks (mean, std dev, min/max) rather than value-frequency comparison. Distribution shift detection specifically targets categorical/string columns.

**Q: How do I know if a distribution shift is a bug or a legitimate business change?**
A: Check the upstream source. If the shift is reflected in the source system intentionally, it's likely legitimate. If the source hasn't changed but the extracted data has, it's likely a pipeline bug.

**Q: Can I suppress distribution shift alerts for expected changes?**
A: This is a roadmap feature. Currently, you can acknowledge the flag on the run detail page.

**Q: How many historical runs does distribution shift detection need?**
A: It compares against the immediately previous run — so you need at least 2 runs for any detection to fire.

**Q: What if a column legitimately gains new values over time?**
A: Over subsequent runs, the new value will appear in the historical distribution and will no longer be flagged.

**Q: Is this the same as concept drift?**
A: Related but different. Concept drift is an ML term about model performance. Distribution shift in DQ refers to changes in the data being processed, not a model's predictions.

**Q: Does this work for high-cardinality columns?**
A: For high-cardinality columns (e.g., customer IDs), value-frequency detection is less meaningful. Sohovi uses statistical checks (null rate, unique rate) for those instead.

**Q: Can I export a report showing distribution shifts over time?**
A: This is a roadmap feature. Currently, distribution shift flags are visible per-run on the run detail page.

[IMAGE: Bar chart showing order_status value distribution across two runs: run 1 has pending/shipped/delivered; run 2 shows a new dominant value cancelled_fraud at 22%]
[INTERNAL LINK: What Is a Behavioral Anomaly in Data Quality?]`,
  },
  {
    title: "Collibra Adaptive Rules vs Sohovi Behavioral Scoring: A Comparison",
    slug: "collibra-adaptive-rules-vs-sohovi",
    excerpt: "Collibra's Adaptive Rules are a powerful enterprise feature. Sohovi's Behavioral Scoring brings the same statistical approach to small businesses — at a fraction of the cost.",
    category: "Data Quality Tools",
    tags: ["Collibra alternative", "adaptive rules", "behavioral scoring", "data quality comparison", "small business data quality"],
    seo_title: "Collibra Adaptive Rules vs Sohovi Behavioral Scoring | Sohovi",
    seo_description: "Compare Collibra's Adaptive Rule system with Sohovi's Behavioral Scoring — same statistical approach, different price points and deployment models.",
    published: true,
    content: `**Collibra's Adaptive Rules and Sohovi's Behavioral Scoring both use statistical baselines and z-scores to detect data anomalies automatically. The difference is scale, cost, and who they're designed for.**

Collibra is the market-leading enterprise data governance and quality platform. Its Adaptive Rule feature (part of Collibra DQ & Observability) has become one of its most distinctive capabilities. But Collibra's pricing starts in the tens of thousands of dollars annually, making it inaccessible for small businesses, freelancers, and early-stage teams.

Sohovi is built as a lightweight alternative — privacy-first, browser-based, and designed for small businesses who need professional-grade data quality without enterprise pricing.

## How Collibra Adaptive Rules Work

Collibra's Adaptive Rules (called the "Behavior" system internally) work as follows:

1. When a dataset is first connected, Collibra profiles it and builds a model of what "normal" looks like.
2. Over time, Collibra monitors nine key data characteristics: null values, empty values, cardinality, data type shifts, row counts, load time, minimum values, maximum values, and mean values.
3. After each new run, Collibra compares the current statistics against the learned baseline using z-scores.
4. Deviations beyond the threshold generate adaptive rule violations — automatically, with no manual SQL writing.
5. Collibra produces a separate "Behavior Score" alongside the traditional DQ score.

The model continuously refines itself as data changes, so it adapts to legitimate long-term trends while still flagging sudden anomalies.

## How Sohovi Behavioral Scoring Works

Sohovi's Behavioral Scoring implements the same core algorithm:

1. After each DQ run, column-level statistics are stored: null rate, unique rate, avg value, std deviation, min/max, inferred type, and top values.
2. When a new run completes, the scorer fetches the last 10 runs' statistics and computes z-scores for each metric per column.
3. Deviations beyond 3 sigma are flagged as behavioral anomalies with per-column messages showing the observed value, expected range, and z-score.
4. A Behavior Score (0–100) is shown on the run detail page alongside the DQ Score.

Sohovi also includes distribution shift detection: comparing the top value frequencies between the current and previous run to catch new categorical values.

## Feature Comparison

| Feature | Collibra Adaptive Rules | Sohovi Behavioral Scoring |
|---|---|---|
| Statistical baseline learning | ✅ Yes | ✅ Yes |
| Z-score anomaly detection | ✅ Yes | ✅ Yes |
| Null rate monitoring | ✅ Yes | ✅ Yes |
| Cardinality monitoring | ✅ Yes | ✅ Yes |
| Mean/min/max monitoring | ✅ Yes | ✅ Yes |
| Row count monitoring | ✅ Yes | ✅ Yes |
| Data type shift detection | ✅ Yes | ✅ Yes |
| Distribution shift detection | ✅ Yes | ✅ Yes |
| Load time monitoring | ✅ Yes | ❌ Not applicable (client-side) |
| Auto-generated SQL rules | ✅ Yes | ❌ Not SQL-based |
| Separate Behavior Score | ✅ Yes | ✅ Yes |
| Works with cloud databases | ✅ Yes | ❌ File-based (CSV/Excel/Sheets) |
| Raw data stays local | ❌ Data sent to Collibra | ✅ Raw data never leaves browser |
| Pricing | Enterprise ($$$$) | Small business ($ or free) |
| Setup time | Days–weeks | Minutes |
| Required infrastructure | Significant | None |

## Where Collibra Has the Advantage

**Enterprise data sources.** Collibra connects directly to Snowflake, BigQuery, Redshift, SQL Server, and dozens of other enterprise data warehouses. It monitors data in-place. Sohovi processes CSV/Excel files and a handful of connectors — it's not a data warehouse monitoring tool.

**Scale.** Collibra is designed for petabyte-scale data quality monitoring across hundreds of data assets simultaneously. Sohovi is designed for individual datasets and small teams.

**Governance features.** Collibra bundles data quality with data catalog, data lineage, business glossary, and stewardship workflows. Sohovi is focused on data quality specifically.

**Load time monitoring.** Collibra monitors how long data pipelines take to run and flags unusual load times. This isn't applicable to Sohovi's browser-based architecture.

## Where Sohovi Has the Advantage

**Privacy.** Sohovi processes data entirely in your browser using Web Workers. Raw data never touches a server. Collibra necessarily requires your data to be accessible to their infrastructure.

**Price.** Collibra's enterprise pricing starts in the tens of thousands annually. Sohovi is designed for small businesses.

**Setup.** Sohovi requires zero infrastructure. Upload a CSV and you're profiling in seconds. Collibra requires connecting to data sources, configuring connectors, and a significant onboarding process.

**Simplicity.** The behavioral scoring in Sohovi is automatic — no configuration required. After 2+ completed runs, it just works.

## Who Should Use Which

**Use Collibra if:** You're a large enterprise with data warehouse infrastructure, a dedicated data engineering team, and a budget for enterprise tooling. You need governance features beyond data quality.

**Use Sohovi if:** You're a small business, startup, or freelancer working with CSV/Excel data from CRMs, ERPs, or other exports. You want professional-grade data quality without enterprise complexity or pricing.

## Key Takeaways

- Both systems use z-score-based statistical comparison against historical baselines
- The core algorithm is the same; the target audience and infrastructure are very different
- Collibra wins on scale, enterprise integrations, and governance breadth
- Sohovi wins on privacy, simplicity, speed of setup, and price
- For small businesses working with exported files, Sohovi provides Collibra-grade behavioral scoring for a fraction of the cost

---

**FAQ**

**Q: Is Sohovi a direct Collibra replacement?**
A: For small businesses and individual analysts working with file-based data, yes. For enterprise data warehouse monitoring and governance, no.

**Q: Does Sohovi connect to databases like Collibra does?**
A: Sohovi connects to Google Sheets, Airtable, REST APIs, and Cloud Storage in addition to CSV/Excel. It doesn't connect directly to SQL databases.

**Q: How does Sohovi's privacy model compare to Collibra's?**
A: Sohovi processes data in your browser — raw row data never leaves your machine. Collibra requires your data to be accessible to their platform.

**Q: Are the z-score thresholds the same?**
A: Collibra's thresholds are configurable within their platform. Sohovi uses a default threshold of 3 sigma, flagging at 3+ standard deviations from the historical mean.

**Q: Does Sohovi store historical run data?**
A: Yes — Sohovi stores aggregated statistics (null rates, cardinality, averages) per column per run in Supabase. Raw data is never stored.

**Q: What's the minimum number of runs needed for behavioral scoring?**
A: Both systems require a minimum of 2–3 historical runs to establish a meaningful baseline.

**Q: Can Sohovi's behavioral scoring be turned off?**
A: It runs automatically after each run with no opt-in required. Individual flags can be acknowledged but the scoring itself is always on.

**Q: Does Sohovi have a business glossary like Collibra?**
A: No. Sohovi is focused on data quality. It doesn't include data catalog, lineage, or business glossary features.

**Q: Is Sohovi's AI rule builder comparable to Collibra's GenAI features?**
A: Both allow plain-English rule creation. Collibra uses GenAI to generate SQL; Sohovi uses local pattern matching to generate structured rule configurations — no API key or external service required.

**Q: How does Sohovi handle schema drift compared to Collibra?**
A: Both detect column additions and removals. Sohovi surfaces schema drift in an amber banner on the run detail page automatically on every upload.

[IMAGE: Feature comparison table showing Collibra Adaptive Rules vs Sohovi Behavioral Scoring side by side across key capabilities]
[INTERNAL LINK: What Is Adaptive Data Quality? And Why Static Rules Are Not Enough]`,
  },
  {
    title: "What Is a Behavioral Anomaly in Data Quality?",
    slug: "behavioral-anomaly-data-quality",
    excerpt: "A behavioral anomaly is a data quality issue that only becomes visible when you compare today's data against historical patterns — not against a fixed rule.",
    category: "Data Quality Fundamentals",
    tags: ["behavioral anomaly", "data anomaly detection", "data quality monitoring", "statistical anomaly", "data observability"],
    seo_title: "What Is a Behavioral Anomaly in Data Quality? | Sohovi",
    seo_description: "Learn what behavioral anomalies are in data quality, how they differ from rule violations, and how to detect them using statistical baseline comparison.",
    published: true,
    content: `**A behavioral anomaly is a data quality issue that can only be detected by comparing current data statistics against historical baselines — it's a deviation from normal behavior, not a violation of a fixed rule.**

Most data quality tools focus on rule violations: a field is null when it shouldn't be, a value is outside a range, a format doesn't match a pattern. These are absolute constraints that hold regardless of context.

Behavioral anomalies are different. They're relative: something that looks fine in isolation but is statistically unusual given the history of this particular dataset.

## The Classic Example

Imagine a customer database that normally has 0.3% null email addresses. This week's export has 14% null emails. Your null check rule has a threshold of 50% — so it passes. The DQ score is fine. But something has clearly gone wrong: the null rate jumped by 46x.

A behavioral anomaly detector would catch this because it knows the historical baseline: 0.3% is normal; 14% is a 40-sigma event. That's not a coincidence — it's a signal.

## How Behavioral Anomaly Detection Works

The algorithm has three steps:

**1. Build a baseline.** After each run, store the per-column summary statistics: null rate, unique rate, mean, standard deviation, min, max, dominant values. Over multiple runs, this forms a historical distribution for each metric.

**2. Compare new runs against the baseline.** When a new run completes, compute how far each column's statistics deviate from the historical mean. The most common measure is the z-score: (current_value - historical_mean) / historical_std_dev.

**3. Flag significant deviations.** If the z-score exceeds a threshold (typically 3), the metric is flagged as a behavioral anomaly. The severity depends on how extreme the deviation is: 3–4 sigma = low, 4–6 sigma = medium, 6+ sigma = high.

This is exactly how Sohovi's Behavioral Scoring works. After each completed run, the scorer compares the current run's column statistics against the last 10 runs and generates a Behavior Score (0–100) with per-column flags.

## Types of Behavioral Anomalies

**Null rate spike.** A column that normally has near-zero nulls suddenly has a high null percentage. Almost always indicates an upstream data issue: a pipeline field not being populated, a join producing NULLs, or a source field being dropped.

**Cardinality shift.** A column that should be highly unique (like customer IDs) suddenly shows many duplicates. Or a low-cardinality categorical column suddenly has hundreds of unique values — suggesting a free-text field was accidentally substituted.

**Mean drift.** For numeric columns, the average value shifts dramatically. A revenue column averaging $200 that suddenly averages $20,000 is suspicious. Could indicate currency unit changes, data entry errors, or a filtering mistake.

**Row count anomaly.** The dataset normally has 50,000–55,000 rows but today has 8,000. A pipeline is broken, a filter is misconfigured, or the source data export was truncated.

**Distribution shift.** A categorical column that has always had a stable distribution of values suddenly has new values or a dramatically different frequency profile. Common when upstream systems add new codes or when a join goes wrong.

**Type shift.** A column that was consistently inferred as "date" now contains strings that don't parse as dates. The format may have changed upstream.

## Why Behavioral Anomalies Are More Dangerous Than Rule Violations

Rule violations are visible. Your DQ score drops, flags appear, and you know something is wrong. You built the rule because you anticipated this failure mode.

Behavioral anomalies are often invisible — until the consequences appear downstream. A report shows the wrong numbers for two weeks before someone notices. A machine learning model starts making worse predictions. A customer receives communications based on stale or incorrect data.

The insidious nature of behavioral anomalies is that they look fine on the surface. The data loads. The columns are there. The formats are correct. Your static rules pass. But the statistical behavior has changed, and something downstream will eventually break.

## When to Investigate a Behavioral Anomaly

Not every anomaly requires action. Some guidelines:

**High-severity anomalies (6+ sigma) always warrant immediate investigation.** A 6-sigma event has a probability of about 1 in a billion under normal distribution assumptions. If you're seeing one, something unusual happened.

**Medium-severity anomalies (4–6 sigma) should be reviewed.** These could be legitimate data events (a big sale day spiking revenue) or genuine problems. Check the upstream source.

**Low-severity anomalies (3–4 sigma) are worth noting but may be noise.** With enough metrics being monitored, some will fall in the 3-sigma range by chance.

When investigating, trace backward: check the source system, the extraction process, the transformation logic. The anomaly in your DQ run is a symptom — the root cause is upstream.

## Key Takeaways

- Behavioral anomalies are deviations from historical patterns, not violations of fixed rules
- They're detected by comparing current statistics against a historical baseline using z-scores
- Common types: null rate spike, cardinality shift, mean drift, row count anomaly, distribution shift, type shift
- Behavioral anomalies are often silent — they pass static rules but indicate upstream problems
- High-severity anomalies always warrant investigation; low-severity ones may be noise

---

**FAQ**

**Q: What's the difference between a behavioral anomaly and a rule violation?**
A: A rule violation is checked against a fixed threshold you defined. A behavioral anomaly is detected by comparing against historical patterns — no manual threshold required.

**Q: How many historical runs are needed before anomaly detection is meaningful?**
A: At minimum 2, but 5–10 provides a more reliable baseline with lower false positive rates.

**Q: Can behavioral anomaly detection generate false positives?**
A: Yes. Some metrics will fall in the 3-sigma range by chance. Review anomalies rather than automatically treating them as confirmed issues.

**Q: How are z-scores interpreted?**
A: A z-score of 3 means the current value is 3 standard deviations from the historical mean. Higher z-scores indicate more unusual deviations.

**Q: Do behavioral anomalies replace static rules?**
A: No — they complement them. Static rules enforce known constraints; behavioral anomalies catch unexpected deviations.

**Q: What causes null rate spikes?**
A: Pipeline changes that stop populating a field, join conditions producing NULLs, source API changes removing a field, or ETL filter errors.

**Q: What causes cardinality shifts?**
A: Duplicate introduction (joins gone wrong), free-text fields being mapped to what should be categorical columns, or IDs being re-used across different entities.

**Q: What causes mean drift in numeric columns?**
A: Currency unit changes, data entry errors, filtering mistakes including or excluding different data segments, or legitimate business changes (e.g., price increases).

**Q: How is Behavior Score calculated?**
A: Starting from 100, each high-severity flag subtracts 10 points, medium subtracts 5, low subtracts 2. Score cannot go below 0.

**Q: Can I configure which columns are monitored for behavioral anomalies?**
A: Sohovi monitors all columns automatically. Enterprise tools like Collibra allow per-column configuration.

[IMAGE: Heatmap showing column-level null rates across 5 consecutive runs, with a spike highlighted in red on the most recent run for the customer_email column]
[INTERNAL LINK: How Z-Scores Are Used in Data Quality Monitoring]`,
  },
  {
    title: "How Z-Scores Are Used in Data Quality Monitoring",
    slug: "z-score-data-quality-monitoring",
    excerpt: "The z-score is the statistical engine behind adaptive data quality monitoring. Here's what it is, how it works, and why it's the right tool for detecting data anomalies.",
    category: "Data Quality Dimensions",
    tags: ["z-score", "statistical data quality", "anomaly detection", "data monitoring", "data quality statistics"],
    seo_title: "How Z-Scores Are Used in Data Quality Monitoring | Sohovi",
    seo_description: "Learn what z-scores are, how they're applied to data quality monitoring, and how they enable automatic detection of statistical anomalies in your data.",
    published: true,
    content: `**A z-score measures how many standard deviations a data point is from the mean of a distribution. In data quality monitoring, z-scores compare a new run's column statistics against the historical baseline — flagging values that are statistically unusual.**

Statistical anomaly detection in data quality is built on one foundational concept: the z-score. If you understand z-scores, you understand how systems like Collibra's Adaptive Rules, Monte Carlo's anomaly detection, and Sohovi's Behavioral Scoring actually work under the hood.

## What Is a Z-Score?

The z-score formula is:

z = (x - μ) / σ

Where:
- x = the observed value (e.g., this run's null rate)
- μ (mu) = the mean of historical values
- σ (sigma) = the standard deviation of historical values

A z-score of 0 means the observation is exactly at the historical mean. A z-score of 3 means the observation is 3 standard deviations above the mean. A z-score of -2 means it's 2 standard deviations below.

The sign tells you direction; the magnitude tells you how unusual the observation is.

## Interpreting Z-Scores

Under a normal distribution, approximately:
- 68% of observations fall within 1 standard deviation (z between -1 and 1)
- 95% fall within 2 standard deviations (z between -2 and 2)
- 99.7% fall within 3 standard deviations (z between -3 and 3)

A z-score of 3 means there's only a 0.3% chance of seeing this value under normal conditions — it's statistically unusual. A z-score of 6 means a probability of about 1 in a billion.

This is why z ≥ 3 is the standard threshold for flagging anomalies in most systems. Values within ±3 sigma are considered "normal"; values outside that range warrant investigation.

## Applying Z-Scores to Data Quality Metrics

In data quality monitoring, you apply z-score analysis to column-level statistics across runs, not to individual data values. Specifically:

**Null rate per column.** If a column normally has 0.5% nulls (μ = 0.5, σ = 0.2), and a new run shows 8% nulls, the z-score is (8 - 0.5) / 0.2 = 37.5. That's a 37-sigma event — flagged as a critical anomaly.

**Unique rate per column.** If a column that should be unique normally has 99.8% unique values, and a run shows 85% unique values, the z-score is (85 - 99.8) / 0.1 = -148. Extreme duplication introduced.

**Mean value for numeric columns.** If revenue normally averages $180 with a std dev of $30, and a run shows an average of $890, the z-score is (890 - 180) / 30 = 23.7. Something unusual is happening with the revenue data.

**Row count.** If a weekly export normally produces 50,000 ± 2,000 rows, and a run produces 8,000 rows, the z-score is (8000 - 50000) / 2000 = -21. The pipeline is probably broken.

## Why Z-Scores Work Well for This Problem

Z-scores are particularly well-suited for data quality monitoring for several reasons:

**They're parameter-free for the user.** You don't need to specify a range or threshold for each column individually. The threshold is automatically derived from the column's own historical behavior.

**They're scale-invariant.** A z-score of 3 means the same thing whether the column is measuring dollar amounts in millions or percentages between 0 and 1.

**They adapt automatically.** As more runs are recorded, the historical mean and std dev are updated. If the data legitimately shifts (new business conditions, seasonal patterns), the baseline adapts over time.

**They quantify the degree of anomaly.** Unlike a binary pass/fail, a z-score tells you how anomalous something is — a z-score of 3 is very different from a z-score of 30.

## Limitations of Z-Score Detection

No method is perfect. Z-scores have specific limitations in the data quality context:

**Requires sufficient history.** With only 2–3 historical runs, the mean and std dev are noisy estimates. The baseline becomes more reliable with 10+ runs.

**Assumes approximately normal distribution.** Most time-series of data quality metrics do approximately follow normal distributions, but not always. For heavily skewed metrics, a z-score may over- or under-flag.

**Doesn't detect slow drift.** If a null rate increases by 0.1% per run over many months, no single run will have a high z-score — but the cumulative drift can be significant. Detecting gradual drift requires additional methods.

**Generates false positives.** With enough metrics being monitored, some will fall beyond 3 sigma by chance. In practice, high-severity anomalies (6+ sigma) are almost always genuine issues, while low-severity flags (3–4 sigma) sometimes represent legitimate variation.

## Severity Levels in Practice

Most implementations use the z-score magnitude to set severity:

| Z-score range | Severity | Interpretation |
|---|---|---|
| 3.0 – 4.0 | Low | Unusual but possible by chance |
| 4.0 – 6.0 | Medium | Statistically unlikely — warrants review |
| 6.0+ | High | Extremely unusual — investigate immediately |

Sohovi uses the same banding: low = 3–4 sigma, medium = 4–6 sigma, high = 6+ sigma. Each severity level deducts a different number of points from the Behavior Score.

## Key Takeaways

- Z-scores measure how many standard deviations an observation is from the historical mean
- In data quality, z-scores are applied to column-level statistics (null rate, mean, cardinality) across runs
- Values with |z| ≥ 3 are flagged as behavioral anomalies
- Z-scores require historical baseline data — more history = more reliable detection
- High z-scores (6+) almost always indicate genuine data quality issues

---

**FAQ**

**Q: Do I need to calculate z-scores manually?**
A: No. Tools like Sohovi compute them automatically after each run and surface the results in the Behavior Score card.

**Q: What's the difference between a z-score and a standard deviation?**
A: Standard deviation is a measure of spread in a distribution. Z-score measures a specific observation's distance from the mean in units of standard deviation.

**Q: Can z-scores be negative?**
A: Yes. A negative z-score means the observed value is below the historical mean. For example, a run with fewer rows than usual has a negative z-score for row count.

**Q: What happens when the standard deviation is zero?**
A: If every historical run had exactly the same value (σ = 0), any deviation from that value would technically be infinite. Systems typically treat this as an undefined z-score and handle it separately.

**Q: How many historical runs are needed for reliable z-scores?**
A: Statistical convention suggests at least 30 observations for reliable estimates. In practice, 10 runs provide a reasonable baseline; 2 runs are the minimum for any detection.

**Q: Is the 3-sigma threshold configurable?**
A: In Sohovi, it's set to 3 by default. Some enterprise tools allow users to configure per-column thresholds.

**Q: What's the probability of a false positive at 3 sigma?**
A: Under a normal distribution, approximately 0.3% (about 1 in 370 observations). With many metrics monitored across many columns, false positives become more common.

**Q: Can z-scores detect gradual drift?**
A: Not directly — z-scores detect sudden deviations. Gradual drift over many runs requires separate trend-detection methods.

**Q: Why use z-scores rather than percentage change?**
A: Percentage change doesn't account for how variable a metric normally is. A 10% change is insignificant for a highly variable column but alarming for a stable one. Z-scores normalize for this.

**Q: What if my data is highly seasonal?**
A: Seasonal patterns create legitimate high-z-score events at predictable intervals. For seasonal data, ideally compare against the same period in prior cycles rather than an undifferentiated rolling average.

[IMAGE: Bell curve diagram showing a normal distribution with the z-score threshold of 3 marked on each side and a flagged data point far into the tail]
[INTERNAL LINK: What Is a Behavioral Anomaly in Data Quality?]`,
  },
  {
    title: "5 Data Quality Issues That Static Rules Miss (But Behavioral Scoring Catches)",
    slug: "static-rules-vs-behavioral-scoring",
    excerpt: "Static DQ rules are essential — but they have blind spots. Here are five data quality problems that slip through even well-configured rule sets and how behavioral scoring catches them.",
    category: "Data Quality Fundamentals",
    tags: ["static rules", "behavioral scoring", "data quality issues", "data anomaly", "data quality monitoring"],
    seo_title: "5 Data Quality Issues Static Rules Miss — But Behavioral Scoring Catches | Sohovi",
    seo_description: "Discover the five most common data quality issues that static rules fail to detect, and how behavioral scoring with z-score analysis catches them automatically.",
    published: true,
    content: `**Static data quality rules check whether your data meets fixed criteria. But they're blind to anything that changes gradually, anything that looks correct in isolation, and anything you didn't anticipate when you wrote the rule.**

If your data quality program relies entirely on static rules, you're seeing only part of the picture. Here are five real-world data quality problems that routinely slip through even well-maintained rule sets — and how behavioral scoring catches each one.

## 1. The Gradual Null Rate Creep

**The problem:** Your customer table normally has 0.2% null phone numbers. Over three months, the null rate climbs: 0.4%, 0.8%, 1.6%, 3.2%, 6.4%. At each step, the change is small enough that no static rule fires. After three months, 6.4% of your customers have no phone number — a significant data quality issue.

**Why static rules miss it:** Your not_null rule has a threshold of, say, 90%. A 6.4% null rate passes easily. Even a threshold of 95% passes at 6.4%.

**How behavioral scoring catches it:** Each individual run's null rate is checked against the historical baseline. A jump from 3.2% to 6.4% (doubling in one run) would show a z-score of 4+ — flagged as a medium-severity anomaly. The creep is caught step by step rather than only when it crosses an arbitrary threshold.

## 2. The Silent Pipeline Truncation

**The problem:** Your weekly sales export normally contains 48,000–52,000 rows. This week, a pipeline bug introduces a filter that wasn't there before. The export contains 11,000 rows. Every single row is correct — nulls are fine, formats are fine, values are valid. But 77% of the data is missing.

**Why static rules miss it:** Row count validation is rarely included in static DQ rule sets because it doesn't map neatly to a column-level rule. Even if you have a minimum row count rule, it's set based on the minimum you anticipated — not the statistical expected value.

**How behavioral scoring catches it:** The behavioral scorer monitors row count as a tracked metric. A drop from ~50,000 rows to 11,000 is a 20-sigma event. This is flagged as a critical behavioral anomaly immediately on the first run with the truncated data.

## 3. The Upstream Status Code Change

**The problem:** Your CRM export includes an "opportunity_stage" column that has historically contained: "Prospecting", "Qualification", "Proposal", "Closed Won", "Closed Lost". Your CRM vendor releases an update that renames the stages: "Discover", "Develop", "Present", "Won", "Lost". Every value is now different.

**Why static rules miss it:** Your enum validation rule checks that values are in the allowed set — but the new values are different from the allowed set, so the rule fails. You know something is wrong, but not what.

Actually, let's make this harder: maybe you have no enum validation rule because you didn't know what values to expect. In that case, nothing fires.

**How behavioral scoring catches it:** The distribution shift detector compares the current run's top values against the previous run's top values. Five new values appear; five old values disappear. This is flagged as a high-severity distribution shift with a message listing the new values.

## 4. The Wrong Currency Unit

**The problem:** Your international sales feed has always reported amounts in USD. A third-party integration is updated and starts reporting amounts in the local currency (GBP, EUR, JPY) without converting. For US orders, nothing changes. For international orders — which represent 35% of your data — amounts are now in the wrong unit.

**Why static rules miss it:** Your range check rule says amounts must be between $0 and $1,000,000. The values are still in that range (GBP and EUR are close to USD; JPY amounts might be 100x–150x larger but still within the max). Null checks pass. Format checks pass.

**How behavioral scoring catches it:** The mean value of the amount column shifts. If international orders average ~$500 in USD but ~£380 in GBP (still close) and ~¥55,000 in JPY (~$350 after conversion), the overall average value changes — sometimes subtly, sometimes dramatically (if JPY is dominant). For JPY, a run mean that jumps from $420 to $42,000 is a 100-sigma event.

## 5. The Join-Induced Duplication

**The problem:** Your data pipeline joins a customer table against a transactions table to produce a customer summary. A bug is introduced in the join key: instead of joining on customer_id, the join is now on customer_segment (which has 8 distinct values). Every customer is now joined to every transaction in their segment rather than just their own transactions. The output has 400x the expected rows — but all the data looks valid at the row level.

**Why static rules miss it:** If you don't have a row count rule, nothing fires. Even if you do, the valid-looking rows mean null checks, format checks, and range checks all pass. The uniqueness rule might catch it (customer_id now appears thousands of times instead of once) — but only if you have that rule and it's tuned to the right threshold.

**How behavioral scoring catches it:** The row count z-score would be off the charts (400x normal). The unique rate for customer_id would drop to near zero — also a massive anomaly. Both would be flagged as critical behavioral anomalies on the first run with the bug.

## Why You Need Both

Static rules and behavioral scoring are complementary, not competitive:

| | Static Rules | Behavioral Scoring |
|---|---|---|
| What it checks | Fixed constraints you defined | Deviations from historical patterns |
| Catches known problems | ✅ Yes | Sometimes |
| Catches unknown problems | ❌ No | ✅ Yes |
| Requires manual configuration | Yes | No |
| Gets better over time | No | Yes (more history = better baseline) |
| Threshold | Fixed | Adaptive |

The combination gives you full coverage: static rules enforce your known requirements; behavioral scoring catches everything else.

Sohovi runs both simultaneously: your DQ rules produce a DQ Score, and the behavioral scorer produces a Behavior Score. Both are shown on the run detail page, and both contribute to a complete picture of your data's health.

## Key Takeaways

- Static rules are blind to gradual drift, row count anomalies, upstream changes you didn't anticipate, and anything that looks valid in isolation
- Behavioral scoring catches these by comparing current statistics against historical baselines
- The five most common behavioral anomaly patterns: gradual creep, pipeline truncation, upstream code changes, unit mismatches, join duplications
- Both static rules and behavioral scoring are necessary — neither alone is sufficient

---

**FAQ**

**Q: Can behavioral scoring completely replace static rules?**
A: No. Static rules encode business requirements. Behavioral scoring detects unexpected deviations. You need both.

**Q: What's the most common behavioral anomaly in practice?**
A: Null rate spikes are the most common. They're the most frequent signal of upstream pipeline issues.

**Q: How quickly does behavioral scoring catch issues?**
A: On the very next run after the anomaly is introduced. There's no delay — it compares the current run against history immediately.

**Q: Does behavioral scoring produce false positives?**
A: Low-severity flags (3–4 sigma) may occasionally be false positives. High-severity flags (6+ sigma) are almost always genuine issues.

**Q: What should I do when a behavioral anomaly is flagged?**
A: Check the upstream data source first. Verify the anomaly is real. Then trace backward through your pipeline to identify the root cause.

**Q: Can I set different z-score thresholds for different columns?**
A: Sohovi uses a uniform threshold of 3 sigma. Enterprise tools like Collibra offer per-column configuration.

**Q: Does behavioral scoring work for the first run?**
A: No. It requires at least 2 historical runs to establish a baseline. The first few runs build the baseline; detection starts after that.

**Q: What happens when data legitimately changes (e.g., seasonal patterns)?**
A: Legitimate changes produce behavioral flags initially. Over subsequent runs, the baseline adapts to include the new pattern. Seasonal patterns ideally require comparing against the same period in prior cycles.

**Q: How is the Behavior Score calculated?**
A: Starting at 100, each high-severity flag subtracts 10 points, medium flags subtract 5, and low flags subtract 2. Score cannot go below 0.

**Q: Where do I see behavioral anomalies in Sohovi?**
A: On the run detail page: Dashboard → Asset → Runs → click a run → Behavior Score card below the DQ Score gauge.

[IMAGE: Checklist comparing what static rules catch vs what behavioral scoring catches, showing 5 blind spots that only behavioral scoring detects]
[INTERNAL LINK: What Is Adaptive Data Quality? And Why Static Rules Are Not Enough]`,
  },
];
