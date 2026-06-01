import os
import urllib.request, json, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE = 'https://bcginhamyaevilukcwsy.supabase.co/rest/v1/blog_posts'
KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
HEADERS = {'apikey': KEY, 'Authorization': 'Bearer ' + KEY}
PATCH_HEADERS = {**HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=minimal'}

HARD_CTA = "If you're ready to stop guessing about your data quality, [Sohovi](https://sohovi.com) is built for exactly this. Upload your first CSV free — no credit card, no IT team, no code needed."

def get_content(pid):
    url = BASE + '?select=content&id=eq.' + pid
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=ctx) as r:
        return json.loads(r.read())[0]['content']

def patch_post(pid, content):
    wc = len(content.split())
    rt = max(1, round(wc / 200))
    payload = json.dumps({'content': content, 'read_time_min': rt}).encode()
    req = urllib.request.Request(BASE + '?id=eq.' + pid, data=payload, headers=PATCH_HEADERS, method='PATCH')
    with urllib.request.urlopen(req, context=ctx) as r:
        return r.status, wc, rt

# Extensions to append before the hard CTA (or at end of content)
# Format: pid -> addition text
extensions = {
    # excel-formulas-data-analysts (562w, has soft Sohovi mention at very end)
    'c465af8f-7c2f-468c-b972-796ca06ba90d': """
## Using These Formulas for Data Quality Checks

These ten formulas aren't just for analysis — they're also the fastest way to audit a spreadsheet before you use it downstream. A few specific patterns:

**Checking completeness**: `=COUNTA(A2:A10000)` gives you non-blank count in a column. Compare it to `=ROWS(A2:A10000)` to see how many rows are missing a value. Any gap is an issue to investigate.

**Finding duplicates**: `=COUNTIF(B:B,B2)>1` flags every row where the value in column B appears more than once. Combined with FILTER, you can extract all duplicate rows in a single formula.

**Validating date ranges**: `=COUNTIFS(C:C,"<"&DATE(2020,1,1),C:C,">"&TODAY())` catches dates outside a plausible range — useful for spotting future dates in a "transaction date" column or suspiciously old records.

**Cross-checking totals**: Nest SUMIFS inside an IF: `=IF(SUMIFS(Detail!D:D,Detail!A:A,A2)=B2,"OK","MISMATCH")` compares a summary row's total against the underlying detail. Run this on every row in a summary sheet to instantly flag discrepancies.

Building these checks into a dedicated "Audit" tab at the start of every project takes about 20 minutes — and prevents hours of debugging downstream when numbers don't add up.

## When to Move Beyond Excel

Excel is the right tool for most ad hoc data analysis and quality checks at small scale. It starts to show its limits when:

- Your files exceed 100,000 rows (Excel's performance degrades significantly)
- You need to run the same checks on new files regularly (manual steps don't scale)
- You need to combine data from more than 3–4 sources (formula complexity compounds)
- Multiple people need to collaborate on the same dataset simultaneously

For these scenarios, Python with pandas, SQL, or a dedicated data tool handles the workload more reliably. Excel is excellent for exploration; use a more robust tool for production data pipelines.

""",
    # audit-client-messy-spreadsheet-30-minutes (564w, no CTA)
    'f735b293-faa0-4945-b7a5-c07f5fadcb6e': """
## Using a Data Quality Tool to Speed Up the Audit

The 30-minute framework above works with nothing but Excel. But for files over a few thousand rows, a data quality tool accelerates the column-by-column checks dramatically. Instead of manually scanning each column, you get a full profile — completeness rates, type consistency, value distribution — for every column at once.

[Sohovi](https://sohovi.com) lets you upload your CSV and get an instant data quality report — no setup, no code required. The profile covers blank rates, duplicate counts, and format patterns across every column. Running this at the start of your audit (before your manual inspection) gives you a complete picture of where the issues are concentrated — so you can focus your 30 minutes on the columns that actually need attention.

For recurring clients who send files regularly, a quick profile on every delivery catches issues before they propagate into your work. It's a five-minute step that prevents hours of downstream cleanup.

## Building a Client Data Intake Policy

If you work with the same clients repeatedly, a formal data intake policy saves time and reduces friction. Create a one-page document that specifies:

- Preferred file format (CSV rather than Excel, unless you specifically need Excel features)
- Required column names and formats
- Date format (ISO 8601: YYYY-MM-DD)
- What to do if data is missing or uncertain (flag in a separate column, not left blank)

Share this document before the first engagement. Clients who follow it deliver files that require minimal cleanup. Clients who don't give you a documented baseline for scope conversations when their files don't meet standard. Either way, you're protected.

""",
    # how-bad-data-costs-your-business-money (565w, has hard CTA-like ending)
    '5b36104b-f5f4-445d-b909-21c76890487d': """
## The Compounding Effect of Ongoing Bad Data

The costs above are often treated as one-time problems. In reality, they compound. A business that doesn't address its data quality problems this quarter pays those costs again next quarter — plus the cost of the additional bad data that accumulated in the meantime.

Consider email deliverability: a company whose marketing database decays by 25% per year and doesn't run regular list hygiene loses its sender reputation slowly, then suddenly. The first year, bounce rates are slightly elevated. The second year, inbox placement drops noticeably. By year three, campaigns are reaching 40% of their intended audience — and the team doesn't know why because they've never run a quality check.

The fix, had they caught it in year one, was a 30-minute list validation. The fix in year three is a multi-month sender reputation rebuild, with real revenue impact throughout.

## Data Quality Is a Competitive Moat

Businesses that invest in data quality compound an advantage over those that don't. Clean customer lists deliver better campaign ROI. Accurate pipeline data produces better forecasts and resource allocation. Reliable product data reduces returns and customer service contacts.

These aren't marginal improvements. Over 2–3 years, the difference between a business operating on trusted data and one operating on dirty data shows up in conversion rates, retention, and operational efficiency — and the gap widens every year.

""",
    # email-bounce-rate-fix (582w, has soft Sohovi mention near end)
    '84ae5a33-441c-4ec7-92c8-87bb4b8cff66': """
## Building a Long-Term List Health System

One-time bounce remediation is valuable. What's more valuable is preventing bounce accumulation in the first place. Here's a simple three-part system:

**1. Validate at entry.** Any form, import workflow, or manual addition to your list should include real-time email validation. This catches syntax errors, disposable emails, and known invalid domains before they enter your database.

**2. Monthly engagement segmentation.** Every month, identify contacts who haven't opened or clicked in 90 days. Move them to a separate re-engagement segment. Treat them differently from your main list — lower send frequency, higher relevance content.

**3. Quarterly full-list re-verification.** Even with entry validation, list decay happens. Run a full verification of your active list every 90 days. The cost (typically under $50 for most small business list sizes) is trivial compared to deliverability repair costs.

These three steps, applied consistently, keep bounce rates below the 2% threshold permanently — not just in the month after a cleanup.

""",
    # what-is-data-observability-vs-data-quality (664w, no CTA)
    '9535cc4b-10df-456c-9a10-c6737abefa6a': """
## Practical Observability for Small Data Teams

For teams without dedicated data engineering resources, the principles of observability are still actionable — even without enterprise tooling. The key habit: profile your most important datasets on a regular cadence rather than waiting for a failure to surface problems.

A weekly or monthly review of completeness rates, record counts, and null rates on your critical tables gives you 80% of the early-warning value that enterprise monitoring platforms provide. The difference is that enterprise platforms do this automatically at scale. Your version is a scheduled task that takes 20 minutes.

[Sohovi](https://sohovi.com) lets you upload your CSV and get an instant data quality report — no setup, no code required. Running it on your most important dataset once a month is a practical implementation of the observability principle at small-team scale.

""",
    # what-is-data-warehouse (668w, no CTA)
    '329eb32f-c4d1-4908-92bc-d125ecbe821e': """
## Data Quality Is More Important Than Warehouse Choice

Organizations considering a data warehouse often spend most of their evaluation effort comparing platforms: Snowflake vs. BigQuery vs. Redshift, cloud vs. on-premise, row-based vs. columnar storage. These are real decisions, but they're less important than the question of data quality.

The most sophisticated data warehouse running on the cleanest modern platform will produce misleading reports if the underlying data has quality problems. Two thousand duplicate customer records in your CRM, migrated faithfully into your warehouse, are still two thousand duplicate records — now with better query performance and worse analytical reliability.

Before evaluating warehouse platforms, audit the data you'd put in them. You'll often find that the quality problems are significant enough that fixing them first — with simpler tools — produces most of the analytical improvement you were hoping to get from the warehouse.

[Sohovi](https://sohovi.com) lets you upload your CSV and get an instant data quality report — no setup, no code required. A quick profile of your key data sources before a warehouse migration reveals exactly what cleanup is needed before you move data into a production system.

""",
    # what-is-data-lakehouse (672w, has soft Sohovi mention near end)
    '2ed5be2d-bc80-49db-9f2d-258b61f7b7df': """
## The Data Quality Lesson That Applies at Every Scale

Whether you're working with a data lakehouse, a traditional warehouse, a simple database, or a shared Google Drive of CSV files — the fundamental data quality challenge is the same: data gets created by many people and processes, and without deliberate quality standards, it accumulates inconsistencies over time.

The lakehouse architecture makes this challenge more visible by removing the gates that a traditional warehouse ETL process enforces at load time. But the lesson it teaches is relevant at any scale: quality needs to be checked at the point of ingestion, not fixed after the fact in the consumption layer.

For teams not yet at lakehouse scale, the practical takeaway is to build one quality checkpoint into every data workflow. Before a dataset enters your CRM, your reporting tool, or your decision-making process — run a basic check. It doesn't require a lakehouse governance layer. It requires 10 minutes and the habit of asking: is this data good enough to trust?

""",
    # csv-to-json-python-vs-online (684w, already has hard CTA at end)
    'fc8d1ce2-8314-4306-8de0-69c6933f977d': """
## Handling Data Quality During Conversion

CSV-to-JSON conversion is often used as a step in moving data between systems. This handoff is a good time to verify data quality before the data enters the target system — especially if you're converting for an API import, a database load, or a format your downstream system will parse programmatically.

Common issues to check before conversion:

- **Mixed types in a column**: A column that looks like numbers but contains "N/A" or "" — in JSON, these will be strings, not numbers, and may break downstream parsing
- **Inconsistent date formats**: JSON doesn't have a native date type; dates become strings. If your date column has mixed formats (MM/DD/YYYY and YYYY-MM-DD), standardize them before conversion or you'll have mixed-format strings in your JSON output
- **Null vs. empty string**: CSV doesn't distinguish between null and empty string. When converting to JSON, decide explicitly: should blank cells become null, "", or be omitted from the object entirely? This matters if your downstream system treats null differently from empty string.

For Python conversions, handle these during the transformation step before calling `to_dict()` — that's far cleaner than trying to fix the JSON after the fact. For browser tools, check the output for the first 5–10 rows to verify types and nulls look correct before using the full output.

""",
    # what-is-data-mesh (692w, has soft Sohovi mention near end)
    'a0a95470-523c-466b-a9d6-c25891112ae8': """
## Data Mesh and Data Quality: The Ownership Principle

The most transferable insight from data mesh for small teams isn't the architecture — it's the ownership principle. When a specific person is accountable for a specific dataset's quality, quality reliably improves. When quality is "everyone's job" in theory, it becomes no one's job in practice.

For a five-person team, this might mean: the ops manager owns the customer contact list, the finance lead owns the transaction data, and the sales lead owns the CRM. Each person knows that if those datasets produce wrong reports, it's their responsibility to investigate and fix. That clarity — applied consistently — creates reliable data at any scale.

The lakehouse and warehouse platforms built around data mesh are enterprise investments. The ownership principle is free.

""",
    # what-is-data-governance (702w, has soft Sohovi mention, ends without hard CTA)
    'c9e0b62f-5283-4dd4-ab9c-be28d9918423': """
## Common Data Governance Failures (and How to Avoid Them)

Even organizations that invest in governance often struggle with execution. The most common failure modes:

**Standards exist but no one enforces them.** A written policy that says "phone numbers should be stored in E.164 format" means nothing if there's no validation at entry and no regular audit. Standards need to be enforced programmatically or through regular review — not just documented and forgotten.

**Ownership is too broad.** Assigning the "data team" as the owner of customer data means no one is personally accountable. Ownership must be assigned to a named individual who can be reached when something goes wrong.

**Governance is built for compliance, not usability.** Some governance programs are designed to satisfy auditors rather than serve the people who use the data. If your governance framework makes it harder for your team to do their jobs, they'll work around it — and quality will suffer as a result. Good governance should make it easier to trust and use data, not harder.

""",
}

for pid, addition in extensions.items():
    content = get_content(pid)
    # Try to insert before hard CTA, otherwise append
    if HARD_CTA in content:
        new_content = content.replace(HARD_CTA, addition.strip() + "\n\n" + HARD_CTA)
    else:
        new_content = content.rstrip() + "\n\n" + addition.strip() + "\n\n" + HARD_CTA
    status, wc, rt = patch_post(pid, new_content)
    print(f"{pid[:8]} -> {wc}w, {rt}min, status {status}")
