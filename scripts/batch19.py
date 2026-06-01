import os
import urllib.request, json, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE = 'https://bcginhamyaevilukcwsy.supabase.co/rest/v1/blog_posts'
KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
HEADERS = {'apikey': KEY, 'Authorization': 'Bearer ' + KEY}
PATCH_HEADERS = {**HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=minimal'}

SOFT_CTA = "[Sohovi](https://sohovi.com) lets you upload your CSV and get an instant data quality report — no setup, no code required."
HARD_CTA = "If you're ready to stop guessing about your data quality, [Sohovi](https://sohovi.com) is built for exactly this. Upload your first CSV free — no credit card, no IT team, no code needed."

def patch_post(pid, content):
    wc = len(content.split())
    rt = max(1, round(wc / 200))
    payload = json.dumps({'content': content, 'read_time_min': rt}).encode()
    req = urllib.request.Request(BASE + '?id=eq.' + pid, data=payload, headers=PATCH_HEADERS, method='PATCH')
    with urllib.request.urlopen(req, context=ctx) as r:
        return r.status, wc, rt

posts = {
    # append-vs-join-csv
    '9bc156b2-21cb-4e00-b6ba-01232000ea5b': """The two most common CSV combination operations — appending and joining — are frequently confused because people use the word "merge" to mean both. The confusion produces wrong results: you end up with one wide file when you wanted one long file, or vice versa. Here's a clear breakdown of what each operation does and when to use it.

## Appending: Making One Long File

Appending (also called stacking or concatenating) takes multiple files with the same columns and combines their rows into one file. The output is taller than any individual input but no wider.

**When to append:**
- Monthly report exports that should be one annual file
- Regional data files that should be combined for a national analysis
- Survey response batches from different collection periods
- Transaction records split across multiple export files

The requirement for appending is structural consistency: all files should have the same column headers in the same order. When that's true, appending is trivial. When columns are different across files (even slightly — an extra column in one file, a renamed column in another), you need to decide how to handle the mismatch.

**Output:** If you have three files with 1,000 rows each, you get one file with 3,000 rows and the same number of columns.

## Joining: Making One Wide File

Joining (also called merging on a key) takes two or more files that share a common identifier column and combines their other columns side by side. The output is wider than any individual input but not necessarily taller.

**When to join:**
- A customer list with IDs, names, and contact info joined to an orders file with IDs and purchase history
- A product catalog joined to a pricing file, where both share a product SKU column
- Employee records joined to performance data, both keyed on employee ID

The requirement for joining is a shared key column. Every row in one file must be matchable to a row in the other file via this shared key. Rows that don't match may be dropped (inner join) or kept with nulls (outer join).

**Output:** If file A has 1,000 rows and 5 columns, and file B has 1,000 rows and 4 columns (one of which is the shared key), you get one file with 1,000 rows and 8 columns (5 + 4 - 1 shared key column counted once).

## Common Mistake: Trying to Join When You Should Append

The most frequent error is uploading two monthly sales files and selecting "join" instead of "append." The result is either an error (if join mode can't find a common key) or a meaningless wide file where January and February data appears side by side per row.

If your files have the same structure and represent the same type of data over different time periods, you want to append.

""" + SOFT_CTA + """

## Handling Schema Differences When Appending

Real-world files rarely have perfectly identical schemas. One month's export might have an extra column that didn't exist in prior months. A file from one region might use a different column name for the same field.

Two approaches:

**Intersection (keep only shared columns):** Drop any column that doesn't appear in all files. This produces a clean, consistent schema — but you lose data from columns that only appear in some files.

**Union (keep all columns):** Include every column from every file. For rows where a column doesn't exist, fill with a null value. This preserves everything — but produces sparse columns that need downstream cleanup.

In most cases, union is safer. Losing data silently is worse than having some null values you can investigate.

## When Your Key Column Has Duplicates

Joins produce unexpected results when the key column has duplicates. If your customer ID appears twice in one file and once in the other, the join will create two rows in the output — one for each match. This is called a "fan-out" and quietly inflates your record count.

Before joining two files, verify that the key column is unique in at least one of them. A quick COUNTIF or `=ROWS()-SUMPRODUCT(1/COUNTIF(A2:A1000,A2:A1000))` formula reveals duplicates in under a minute.

""" + HARD_CTA,

    # what-is-data-profiling
    '920c8870-1a25-4ce8-9577-e9411fbe39f3': """You've been handed a spreadsheet. It's supposed to contain your customer list. But before you use it to run a campaign or build a report, you need to know: Is it complete? Are the emails valid? Are there duplicates? Are the formats consistent? Answering those questions is data profiling.

Data profiling is the process of examining a dataset to understand its structure, content, and quality. It's the first step in any data quality initiative — and it's what separates teams that confidently use their data from teams that perpetually "clean" it without knowing what they're cleaning.

## What Data Profiling Reveals

A profile of a dataset typically covers five areas:

**Completeness** — Which columns have missing values, and how many? A column that's 40% empty can't be relied on for filtering or analysis.

**Uniqueness** — How many duplicate values exist? An email column with 15% duplicates means you have a deduplication problem.

**Validity** — How many values fail format checks? Emails without @ symbols, dates in the wrong format, phone numbers with letters — all surface in a validity scan.

**Value distribution** — What are the most common values? How spread out are the values? An industry column with 400 distinct values when you expected 20 signals a data entry problem.

**Data type consistency** — Is the column storing what it's supposed to? A revenue column that contains text strings like "N/A" will break every calculation.

## Why Profiling Is the Right Starting Point

Most data quality problems are invisible until they cause a failure. A campaign built on a segment with a 35% null rate on the email field will silently underperform. An import that creates 2,000 duplicates won't announce itself — you'll just wonder why your database grew so fast.

Profiling makes the invisible visible. It surfaces problems before they cost you time, money, or trust.

## Who Uses Data Profiling

Profiling is used by anyone who works with data files:

- **Marketing teams** before sending a campaign to a new list
- **Operations managers** inheriting a spreadsheet from a departing employee
- **Analysts** before building a report on a new data source
- **Bookkeepers** receiving a client's financial data for a catch-up project
- **Freelancers** auditing a client's CSV before starting a data project

## How to Profile a Dataset Without Enterprise Software

Enterprise profiling tools are built for data engineering teams. They're expensive, require setup, and are overkill for a CSV file.

""" + SOFT_CTA + """ Upload a CSV or Excel file and get an instant profile of every column — completeness rate, uniqueness, format patterns, and potential PII — entirely in your browser. Your data never leaves your machine.

## What to Do With Profiling Results

A profile is only useful if it leads to action. After profiling, prioritize your findings:

1. **Critical issues** (blocks your immediate use case): Fix these first. An email column that's 40% empty can't support a campaign — this needs to be resolved before anything else.

2. **Significant issues** (degrades quality meaningfully): Address in the next cleanup cycle. A 15% duplicate rate is a problem, but a campaign can proceed while deduplication is scheduled.

3. **Informational findings** (worth noting but not urgent): Document and monitor. A field with 50 distinct values when you expected 20 might be intentional — check with the data owner before normalizing.

Not every profiling finding requires immediate action. The goal is informed decision-making, not paralysis.

## Making Profiling a Standard Practice

The teams that get the most value from data profiling aren't the ones who do it once as a cleanup project. They're the ones who profile every new dataset they receive — as part of a standard intake process — before using it in any downstream workflow.

Building this habit takes about a week. After that, it becomes automatic: new file arrives, profile it, then use it. The cost is 10 minutes. The benefit is months of avoided cleanup, debugging, and trust-eroding errors.

""" + HARD_CTA,

    # how-to-merge-csv-files
    '68149497-a24d-462e-8e39-609c2f6552a5': """Merging CSV files is one of the most routine operations in data work — and one of the most commonly done wrong. The confusion starts with the word "merge" itself, which means different things in different contexts: sometimes you want to stack rows from multiple files, sometimes you want to join files side by side on a shared column. The right tool and approach depends on which of these you actually need.

## The Two Types of CSV Merge

**Append (row stacking):** All files have the same columns. You want to combine the rows into one file. Example: January, February, and March sales exports become a single Q1 sales file. The column headers appear once, and all rows stack beneath them.

**Join (column merging):** Files share a common key column, and you want to combine their other columns into one wider table. Example: a customer list with IDs and names joined to a file with IDs and email addresses, producing one file with IDs, names, and emails.

Most CSV "merge" requests are actually appends. But if you say "merge" when you mean "join," you'll get the wrong result.

## Method 1: Browser-Based Tool

A browser-based CSV merger handles both operations without installation. For appending: upload multiple files, choose "Stack rows," download. For joining: upload two files, specify the shared column name, download.

The browser approach is best when:
- You're doing a one-off merge
- The files are a manageable size (under a few hundred MB each)
- The person doing the merge is non-technical
- Data privacy matters (browser-side processing means data doesn't leave your device)

## Method 2: Python with pandas

Python's pandas library is the most powerful option for merging. For appending, pd.concat() takes a list of DataFrames and stacks them. For joining, pd.merge() behaves like a SQL JOIN — specifying the key column and the join type (inner, left, outer).

Pandas handles schema mismatches gracefully: if different files have different columns, concat() by default fills missing values with NaN, giving you a complete column union across all files.

For large files (tens of millions of rows) or batch operations (merging 100 files at once), Python is the only practical option.

## Method 3: Excel

Excel can merge files manually: open each file, copy all rows except the header, paste into a master sheet. This is tedious, error-prone for more than 3-4 files, and will corrupt or truncate data in files exceeding 1 million rows. It also doesn't handle schema mismatches — you'll manually adjust column order.

Use Excel only if you have 2-3 small files and no other option is available.

## Schema Mismatch Warning

When appending files that have different columns, you need to decide: keep only the columns present in all files (intersection) or keep all columns from all files (union, with nulls for missing values). The union approach is safer — you don't lose data — but produces sparse columns.

""" + SOFT_CTA + """

## Common Merge Mistakes to Avoid

**Forgetting to remove duplicate headers**: When appending manually, people sometimes include the header row from the second and third files, creating rows in the data that look like column names. Always strip headers from all files except the first before appending.

**Using the wrong join type**: An inner join keeps only rows where the key matches in both files — if a customer appears in file A but not file B, they disappear. A left join keeps all rows from file A regardless. Know which you need before you proceed, or you'll silently lose records.

**Not verifying the row count after merging**: After any merge, check: (1) does the row count match expectations? For appends, it should equal the sum of all input files minus duplicate headers. For joins, unexpected count changes signal key duplicates or mismatches. Never trust a merged file without verifying the math.

**Assuming column names are consistent**: Even if two files look the same, one might have "Customer ID" and the other "CustomerID" (no space). String-sensitive tools will treat these as different columns. Always compare column names character by character before merging.

## When to Combine Append and Join

Complex data assembly often requires both operations in sequence. For example: append 12 monthly sales files into one annual file (append), then join that to the customer master to add demographics (join). Do the operations in separate steps, verify the result of each step before proceeding, and you'll catch errors at the right stage rather than debugging a combined result.

""" + HARD_CTA,

    # what-is-data-quality
    '76569da2-12c6-457a-8026-4be4e61d824f': """You've probably noticed it without naming it: a report that doesn't match reality, a customer list full of duplicates, an import that breaks half your filters. That's a data quality problem.

Data quality is a measure of how well your data serves the purpose it's meant for. Data that's accurate, complete, consistent, and timely is high quality. Data that's missing fields, full of duplicates, or formatted differently across systems is low quality — and it quietly undermines every decision, campaign, and report built on top of it.

## Why Data Quality Is a Business Problem, Not Just a Tech Problem

Poor data quality isn't just a nuisance for analysts. IBM estimated the annual cost of bad data in the US at $3.1 trillion (IBM, 2016). For individual businesses, that cost shows up as wasted marketing spend, wrong business decisions, customer churn from bad experiences, and hours of manual reconciliation that never should have been necessary.

If your team spends time every week "cleaning up" reports, cross-referencing lists, or fixing imports — you have a data quality problem. The question isn't whether to fix it, but where to start.

## The Core Dimensions of Data Quality

Data quality is measured across several dimensions. The most commonly used are:

**Completeness** — Are all required fields populated? A customer record with no email address isn't usable for outreach.

**Accuracy** — Does the data reflect reality? A phone number with 11 digits, a zip code in the wrong format, or a company name that was entered incorrectly all fail the accuracy test.

**Consistency** — Does the same data point mean the same thing across systems? If your CRM shows "California" and your analytics tool shows "CA", joins between systems will fail.

**Validity** — Does the data match the expected format or business rules? Dates that look like "2024/13/01" (no 13th month) are invalid.

**Uniqueness** — Are there duplicate records? Duplicates inflate counts, split engagement history, and cause double-sends.

**Timeliness** — Is the data current? A last-contacted date from 2 years ago tells you nothing about today's relationship.

## How to Assess Your Data Quality Right Now

The fastest way to see where your data quality stands is to profile your most important dataset. Export it as a CSV, then check each column for: how many rows are empty, how many have values in unexpected formats, and how many are duplicates.

""" + SOFT_CTA + """ Upload your CSV and get an instant breakdown of completeness, uniqueness, and format issues across every column, entirely in your browser. Your file never leaves your machine.

## The Most Common Root Causes of Data Quality Problems

Understanding where bad data comes from helps you fix it at the source, not just the symptom.

**Multiple entry points with no standards**: When several people or systems enter the same kind of data with no validation rules, inconsistency is inevitable. "New York", "NY", "N.Y.", and "new york" are the same thing stored four different ways.

**No verification at entry**: Forms that accept any value — including clearly wrong ones — are the leading source of inaccurate data. Email addresses without @ symbols, phone numbers with 15 digits, ZIP codes with letters all get in because nothing stopped them.

**System migrations done without data cleanup**: When businesses switch CRM systems, accounting tools, or databases, data is often migrated with its quality problems intact — and sometimes amplified by mapping issues.

**Growth outpacing process**: A small team with one person entering data maintains consistency informally. A larger team with five people entering data needs formal standards. The transition point is where quality most often degrades.

## Where to Start

Don't try to fix everything at once. Pick the dataset that matters most to your business right now — your customer list, your pipeline, your product catalog — and run a quality check on it. You'll find issues you didn't know existed, and you'll have a clear starting point for improvement.

Data quality isn't a one-time project. It's an ongoing practice. The businesses that compete on data aren't the ones with the biggest datasets — they're the ones with the cleanest.

""" + HARD_CTA,

    # common-csv-errors
    '6c28440e-e197-438e-bcde-6a48348c7d34': """CSV files are deceptively simple. They look like just text with commas. But they break imports, trigger system errors, and corrupt data in predictable ways — the same errors, over and over, in file after file. Here's the definitive list.

## Error 1: Delimiter Confusion

**What it is**: A CSV that uses semicolons, tabs, or pipes as delimiters instead of commas. Or a CSV where values contain commas that weren't properly quoted, causing fields to be split incorrectly.

**How to spot it**: Open the file in a text editor. Look for lines that appear to have the wrong number of columns.

**How to fix it**: In Excel, use Data > Text to Columns and specify the correct delimiter. Or open with a tool that lets you specify the delimiter before parsing.

## Error 2: Encoding Issues

**What it is**: Special characters (accented letters, currency symbols, quotes, em dashes) that display as garbled characters (Ã©, â€, â€™). Usually caused by a UTF-8 vs. Latin-1 encoding mismatch.

**How to spot it**: Open the file in a text editor and look for unexpected character sequences.

**How to fix it**: Save or convert the file explicitly to UTF-8 encoding. Most modern tools handle UTF-8 correctly.

## Error 3: Extra Rows at the Top or Bottom

**What it is**: Summary rows, report headers, or blank rows at the top or bottom of the file that aren't data — but get imported as if they are.

**How to spot it**: Open the file and check whether the first row is truly the column header and the last row is truly the last data row.

**How to fix it**: Delete non-data rows before importing.

## Error 4: Mixed Date Formats

**What it is**: A date column where some rows use MM/DD/YYYY, some use DD/MM/YYYY, some use YYYY-MM-DD, and some use written-out dates. Most systems require consistent formatting.

**How to spot it**: Profile the date column and look for multiple distinct patterns.

**How to fix it**: Standardize all dates to one format (ISO 8601: YYYY-MM-DD is most universally compatible) before importing.

## Error 5: Quoted Fields with Embedded Commas

**What it is**: A company name like "Smith, Jones & Associates" contains a comma. If it's not properly quoted in the CSV, the import treats it as two separate fields.

**How to spot it**: Rows with company names, descriptions, or free-text fields that contain commas will show an unexpected number of columns.

**How to fix it**: Ensure all fields containing commas are wrapped in double quotes. A properly formatted CSV handles this automatically.

## Error 6: Trailing Spaces and Invisible Characters

**What it is**: Extra spaces at the end of values, invisible characters (zero-width spaces, byte order marks), or line endings that differ across operating systems.

**How to spot it**: Values that look identical but don't match in lookups or joins are often affected by trailing spaces.

**How to fix it**: Use TRIM() in Excel to remove leading/trailing spaces. Use a text editor with visible whitespace to identify invisible characters.

""" + SOFT_CTA + """

## Error 7: Merged Cells From Excel Exports

When an Excel file with merged cells is saved as CSV, the merge is lost. Only the top-left cell of a merged range gets the value; all other cells in the range become empty. This produces blank rows or columns that look like missing data but are actually an artifact of the export.

Before exporting from Excel to CSV, unmerge all cells and ensure every row and column has a consistent, independent value. Merged cells are a presentation feature, not a data feature — they should never appear in data files.

## Error 8: Scientific Notation in Large Numbers

Excel automatically converts long numeric strings — order IDs, phone numbers, product SKUs — to scientific notation if they're long enough. "1234567890123" becomes "1.23457E+12" in the cell display, and if that's what gets exported to CSV, the original value is gone.

The fix is to format the column as Text before entering or importing the values, and to verify after export that long numeric IDs haven't been silently converted.

## A Quick Pre-Import Checklist

Before importing any CSV into a production system, spend 5 minutes on these checks:

1. Open in a text editor — verify encoding and check for obvious delimiter or quote issues
2. Count columns in the header vs. a data row — mismatch means a quoting or delimiter problem
3. Check the first and last 5 rows — verify no extra headers or summary rows
4. Scan date and number columns for format inconsistencies
5. Search for blank rows in the middle of the file

These five checks catch 80% of import errors before they reach your system.

""" + HARD_CTA,

    # building-culture-data-quality-organization
    'c84aa0c3-3c58-47d9-bf87-c1990f027415': """## Why Culture Is the Hardest Part

You can implement validation rules, automated tests, and quality monitoring — and still have a data quality problem. Because data quality ultimately depends on people making good decisions every time they interact with data: entering it carefully, flagging problems when they find them, and treating data as an organizational asset.

Technical controls reduce the cost of human error. Culture reduces the frequency of it.

## The Five Cultural Behaviors That Drive Data Quality

**1. Data is treated as a product, not a byproduct**
In organizations with a data quality culture, data isn't something that accumulates as a side effect of business operations. It's something deliberately designed and maintained. People ask "what data will this process produce and how will we keep it clean?" not just "how do we complete this process?"

**2. Errors are surfaced, not hidden**
People who find data quality problems raise them, even if they didn't cause them. The culture is blame-free for reporting issues — problems identified early are treated as contributions, not accusations. Problems hidden until they cause crises are treated as failures.

**3. Quality is measured and visible**
What gets measured gets managed. Organizations with data quality culture make quality metrics visible to the people who affect them. A team that can see their data quality score tends to care about it. A team that only hears about quality when it causes a problem tends not to.

**4. Data entry is taken seriously**
In low-quality data cultures, data entry is a chore to get through quickly. In high-quality cultures, people understand that the data they enter will be used for decisions that affect the business — and take it seriously accordingly.

**5. Data decisions are made with data**
Organizations that routinely make decisions without looking at data (or looking at data they know is unreliable and proceeding anyway) send a message: data quality doesn't really matter. Organizations where data quality problems are raised and resolved before major decisions send the opposite message.

## Building the Culture Incrementally

**Start with leadership**: If the leadership team doesn't care about data quality, the organization won't. Get a visible leader to sponsor the data quality program.

**Make quality wins visible**: When a data quality improvement produces a business result (email deliverability improved, reporting is now trusted, a project saved time), share it. Success stories build cultural buy-in.

**Celebrate quality contributors**: The person who flagged the duplicate records before the campaign. The analyst who noticed the numbers didn't add up. Recognizing these behaviors reinforces them.

**Build quality into incentives**: If salespeople are measured only on deal closes and not on CRM data quality, they'll prioritize closes. If data quality is part of the performance review for anyone who enters data, it becomes a priority.

## The Long Game

Culture change takes 12–18 months to take hold in most organizations. The technical work (quality measurement, monitoring, governance) sets the stage. But the cultural shift — where people intrinsically value data quality rather than treating it as someone else's job — takes sustained effort.

The organizations with the best data quality aren't the ones with the best tools. They're the ones where quality is everyone's responsibility.

## Practical First Steps for Culture Change

If you're starting from zero, trying to change culture organization-wide at once is overwhelming and usually fails. A more effective approach: start with one team and one dataset.

Pick the team that is most affected by data quality problems right now — marketing dealing with bounced emails, sales dealing with stale contacts, ops dealing with duplicate orders. Run a data quality audit on their primary dataset. Share the findings with the team in plain language. Let them see the problem in concrete terms.

Then involve them in fixing it. People who have participated in identifying and resolving data quality problems become natural advocates for quality practices. One team's success story becomes the proof point that gets the next team interested.

""" + SOFT_CTA + """

## Measuring Cultural Progress

Culture is hard to measure directly, but you can track leading indicators:

- **Issue reporting rate**: Are people flagging data quality problems before they cause impact? A rising report rate (up to a point) is a healthy sign — it means people are noticing and surfacing issues.
- **Mean time to resolution**: When quality issues are identified, how long do they take to fix? Faster resolution reflects clearer ownership and process.
- **Data entry error rate**: As culture improves, entry errors should decline — because people are more careful, not just because validation rules are catching them.

Tracking these alongside your quality metrics gives you a fuller picture of whether the cultural work is taking hold.

""" + HARD_CTA,

    # deliver-data-quality-audit-report-non-technical-client
    'a58738a0-e3a1-4fb7-8d85-4ca804fa436e': """## The Communication Gap

You can run the most thorough data quality audit of your career — and it means nothing if the client can't understand your findings or act on your recommendations.

Most clients who need data quality audits are not data professionals. They're business owners, marketing managers, or operations leads who know something is wrong but can't articulate what. Your job is to translate technical findings into business language.

## Structure Your Report for Non-Technical Readers

**Page 1: Executive Summary**
Three to five bullet points. What did you find? What's the business impact? What needs to happen next?

Write as if the reader will stop after this page. Many will. The executive summary must be complete enough to stand alone.

Example:
- Your customer database contains approximately 2,400 duplicate records (12% of total). This means any contact metric you report — email open rates, conversion rates — is understated by up to 12%.
- 18% of records are missing a phone number. Any outreach strategy that relies on phone calls can only reach 82% of your audience.
- Three different spellings of your top 5 product names make sales-by-product reports unreliable.

**Pages 2–4: Findings Detail**
One section per issue. For each issue:
1. What is it? (one sentence, plain English)
2. How many records are affected?
3. What's the business impact?
4. What would it take to fix it?

Avoid technical jargon entirely. "Mixed data types in the date column" becomes "Some dates are stored as text rather than real dates, which means date-based reports and filters don't work correctly."

**Page 5: Recommendations**
Three to seven recommendations, prioritized by impact. For each: what to do, estimated effort (hours or days, not technical tasks), and what it unlocks.

## Presenting Findings in Person (or on a Call)

Lead with business impact, not technical details.

Bad: "We found 340 rows where the email field contains non-email string values."
Good: "One in eight email addresses in your database won't actually deliver if you run a campaign — about 3,200 contacts."

Use analogies. "A database with 12% duplicates is like a sales team that calls 12% of their leads twice and never calls 12% of them at all."

Give them one clear action to take away. Even if you've identified seven issues, the client will act on one or two. Make sure they know which one is most important.

## Handling Defensive Reactions

Some clients feel implicated when you describe data quality problems. They built or maintained this database. They're worried about blame.

Defuse it early: "Data quality issues like these are extremely common. They accumulate over time and are usually the result of growth — more people using the system, data coming in from more sources. It doesn't mean anyone did anything wrong."

Then pivot immediately to what's fixable. People feel better when they see a path forward.

## Following Up

Two weeks after delivering your report, check in:
- "Have you had a chance to review the findings?"
- "Any questions I can answer?"
- "Do you want to talk through what remediation would look like?"

This follow-up often leads to a data cleaning engagement — the natural next step after an audit.

## How to Set Scope Expectations Before the Audit

Non-technical clients often misunderstand what a data quality audit covers. Before you start, clarify in writing:

- What datasets will be audited (specific files or systems, not "all your data")
- What dimensions will be assessed (completeness, duplicates, formats, etc.)
- What the deliverable looks like (a written report, not a fixed database)
- What's out of scope (the audit assesses quality; remediation is a separate engagement)

This prevents the common situation where a client reads your audit report and asks "so when will you have all these fixed?" The audit and the cleanup are separate projects. Clarity upfront protects both parties.

""" + SOFT_CTA + """ Running the client's data through a quick profile pass before your audit engagement gives you a baseline to reference in your report and shows the client exactly what the tool found before you interpreted it.

""" + HARD_CTA,

    # 10-most-common-data-quality-problems-fixes
    '4b14872d-6454-4c2b-ba75-b51f47eccc71': """## 1. Duplicate Records

**What**: The same entity appears multiple times in a dataset.
**Why**: Multiple data entry points, system migrations, bulk imports without deduplication.
**Fix**: Implement duplicate detection at entry (check for existing email before creating a new record). Run a deduplication project on existing data. Establish a single entry point for master data.

## 2. Missing Required Values

**What**: Critical fields are blank for a significant portion of records.
**Why**: Fields weren't required at entry, forms were redesigned without enforcing required fields, data imported from external sources.
**Fix**: Make required fields mandatory in your entry system. Use enrichment services to fill missing values for existing records. Migrate to required-field enforcement.

## 3. Inconsistent Formatting

**What**: The same type of value stored in multiple formats (phone numbers, dates, addresses).
**Why**: Multiple entry points with different standards, manual entry without format validation, data from multiple sources.
**Fix**: Adopt international standards (ISO 8601 for dates, E.164 for phones). Enforce format validation at entry. Normalize existing data with a cleanup script.

## 4. Stale or Outdated Data

**What**: Data that was once accurate has decayed — people changed roles, companies changed names, addresses changed.
**Why**: No re-verification process, data captured once and never refreshed.
**Fix**: Implement a re-verification cadence. Add created_at and updated_at timestamps. Use engagement signals (email bounces, returned mail) as passive freshness indicators.

## 5. Orphaned Records

**What**: Records that reference deleted parent records (broken foreign keys).
**Why**: Cascading deletes not configured, manual database edits, migration errors.
**Fix**: Enable foreign key constraints. Configure appropriate cascade behavior for each relationship. Run integrity checks after migrations.

## 6. Inaccurate Self-Reported Data

**What**: Values entered by users that are incorrect — fake emails, wrong job titles, rounded numbers.
**Why**: No verification at entry, users have incentive to provide inaccurate data.
**Fix**: Verify critical fields at entry (email verification via confirmation, address autocomplete). Cross-reference with authoritative sources for high-value records.

## 7. Mixed Data Types

**What**: A column intended for numbers contains both numbers and text ("N/A", "TBD", "$5,000").
**Why**: No type enforcement at entry, manual spreadsheet editing.
**Fix**: Enforce column types in database schemas. For spreadsheets, use data validation. During cleanup, categorize non-numeric values as either null (truly missing) or coded values.

## 8. Poorly Defined Categories

**What**: Status or category fields with too many values or redundant values ("Active", "active", "Active Customer", "Current").
**Why**: Free-text fields used where dropdowns should be, no canonical value list.
**Fix**: Define a canonical value list. Convert free-text to a dropdown. Map existing non-standard values to canonical values during a cleanup project.

## 9. Disconnected Data Across Systems

**What**: The same entity represented differently in different systems with no shared identifier.
**Why**: No master data management, different systems added organically without integration.
**Fix**: Establish a master identifier in the primary system of record. Sync that ID to all other systems. Define the authoritative system for each attribute.

## 10. No Data Timestamps

**What**: Records have no created_at or updated_at fields, making freshness and change tracking impossible.
**Why**: Timestamps weren't included in the original schema design.
**Fix**: Add timestamps to all tables going forward. For existing records, backfill created_at with a reasonable estimate where possible. This is foundational for any data quality monitoring.

## Where to Start When You Have Multiple Problems

Most organizations reading this list will recognize six or seven of these issues in their own data. Trying to fix all of them simultaneously is a recipe for a project that stalls after six weeks.

Prioritize by impact, not by size. The largest problem isn't always the most impactful one. Ask: which of these issues is causing the most visible business harm right now? Duplicate records causing double-sends and customer complaints? Missing contact fields blocking outreach? Start there — fix it, measure the improvement, and use the success as momentum for the next problem.

""" + SOFT_CTA + """

## Prevention Is Cheaper Than Remediation

Every item on this list is easier to prevent than to fix after the fact. A database with 50,000 duplicate records takes weeks to deduplicate reliably. A form with duplicate-detection at entry prevents the problem entirely going forward.

Once you've remediated a data quality problem, invest in the prevention: validation rules, required fields, controlled dropdowns, and regular profiling. The cleanup is the one-time project. Prevention is the ongoing practice that keeps you from doing it again.

""" + HARD_CTA,

    # data-quality-for-freelancers
    'b86ebbd5-e539-417e-ac93-0c1fa69a277a': """## Why Data Quality Is a Freelancer's Competitive Advantage

Most freelancers compete on price or speed. The ones who build long-term, high-value client relationships compete on reliability. Clean, accurate data deliverables are a form of reliability that clients notice immediately — and remember.

This guide walks through the mindset and practical habits that separate freelancers who get repeat work from those who don't.

## The Cost of Delivering Dirty Data

Imagine you build a client a beautiful dashboard — and three weeks later they email you because the revenue totals are wrong. The cause: a CSV you provided had 47 rows where the dollar amounts were stored as text, not numbers. Excel silently ignored them in the sum.

That's a trust-destroying moment that no amount of apologizing fixes. The client will always wonder: what else did you miss?

Delivering clean data protects your reputation more than any portfolio piece.

## The Four-Check Delivery Framework

Before sending any data deliverable, run these four checks:

**1. Type Check**
Confirm every column contains the expected data type. Numbers should be numbers (not text). Dates should be dates (not strings). Boolean flags should be true/false, not "yes"/"no" mixed with 1/0.

**2. Completeness Check**
Count non-blank cells in every column. Compare against expected row count. If 5% of rows are missing a value in a critical column, flag it before sending.

**3. Uniqueness Check**
If the file should have one row per customer / per order / per event, verify that. A quick COUNTIF or pivot table on the primary key catches duplicates in under a minute.

**4. Range Check**
Does anything look implausibly high or low? A salary of $1,200,000 where the average is $65,000 deserves a second look. A date of 2016 in a 2024 dataset might be valid — or it might be a data entry error. Flag anomalies; let the client decide.

## Build a Delivery Checklist

Create a simple text file or Notion template with your four checks. Before every delivery, tick each box. This takes 5 minutes and saves hours of follow-up.

Your checklist might look like:

- [ ] Checked all column types — no mixed types
- [ ] Confirmed row count matches expected source
- [ ] Verified no duplicate primary keys
- [ ] Scanned for obvious outliers and either resolved or flagged
- [ ] File saved as .csv (not .xlsx) unless client specified otherwise
- [ ] File named with date: `Deliverable_ClientName_2026-05-31.csv`

## Communicate Issues Before They Become Problems

If you find an issue during your checks, surface it before delivery:

> "I've completed the analysis. One thing to flag: 38 records are missing a phone number. I've included them in the file but marked them in a 'Data Issues' column so your team knows to follow up. Everything else checked out."

Clients respect this. It shows you're thorough and that you caught something they might have missed.

## Turning Data Quality Into a Rate-Raising Asset

Freelancers who consistently deliver clean data earn the right to charge more. When a client knows from experience that your deliverables are accurate — that they don't need to verify your work before using it — they are paying not just for the output but for the reliability of the output.

Frame this explicitly in client conversations when the opportunity arises. "Part of my process is a quality check on every deliverable before I send it — I verify completeness, flag anomalies, and confirm nothing looks off before it goes to you." Most clients have had the opposite experience. The contrast is compelling.

""" + SOFT_CTA + """

## The Long Game

Freelancers who consistently deliver clean data get:
- Fewer revision requests
- Faster client sign-offs
- Higher referral rates ("she always delivers exactly what I asked for, and it just works")
- The ability to raise rates, because they've built a track record

Data quality is not extra work. It's the work.

""" + HARD_CTA,

    # data-quality-for-revenue-operations
    '9693e240-c2cd-4920-bfe4-727f458dd550': """Revenue operations runs on data. Pipeline forecasts, quota attainment analysis, territory planning, win/loss reporting — every RevOps output is only as reliable as the underlying data it's built on.

The problem most RevOps teams have isn't lack of data. It's that their CRM, their marketing automation platform, and their product analytics tool each have a slightly different version of the truth — and reconciling them takes hours every week.

That's a data quality problem.

## What Data Quality Means for RevOps

Data quality for revenue operations has four critical dimensions:

**Completeness** — Are the fields your models depend on actually populated? A forecast model built on deal stage + close date + ARR breaks down if 25% of opportunities have no close date.

**Consistency** — Does "Closed Won" mean the same thing in Salesforce as it does in your BI tool? If your CRM admin and your data analyst have different definitions mapped to the same status values, your reports will never match.

**Accuracy** — Is the data reflecting reality? Stale contact roles, wrong company sizes, deal values that haven't been updated since the opportunity was created — these create forecast inflation that doesn't show up until the quarter closes.

**Uniqueness** — Duplicate accounts, duplicate contacts, and duplicate opportunities in your CRM create ghost pipeline. Every deduplication pass finds deals that were counted twice.

## The Most Expensive RevOps Data Problem: Stale Pipeline

Industry estimates suggest that 20–35% of open pipeline in a typical CRM is "zombie pipeline" — opportunities that should have been closed or disqualified months ago but are still showing as active.

Zombie pipeline inflates your forecast, skews your win rate calculation, and makes it impossible to accurately project close rates. It's a data quality problem masquerading as a forecasting problem.

The fix isn't a better forecasting model. It's a data quality audit of your open pipeline.

## A Practical RevOps Data Quality Audit

**Step 1:** Export your open pipeline as a CSV. Include deal name, amount, stage, close date, last activity date, and contact role.

**Step 2:** Profile the export. Look for:

- Close dates in the past (how much of your "open" pipeline has already missed its close date?)
- Missing contact roles (opportunities with no primary contact are almost always stale)
- Last activity dates older than 30 days in early pipeline stages
- Duplicate account names (fuzzy match — "Acme Corp" and "Acme Corporation" should be one account)

**Step 3:** Flag and remediate. Work with your sales team to close or disqualify stale deals before the next forecast call. This is uncomfortable the first time. It makes your pipeline number more accurate and your forecast far more reliable.

""" + SOFT_CTA + """ Upload your pipeline export, get an instant profile showing close date completeness, duplicate account names, and missing required fields — all in your browser.

## Building a RevOps Data Quality Scorecard

Ad hoc audits catch problems after they've accumulated. A recurring scorecard catches them as they form.

Track these metrics monthly for your CRM data:

- **Open opportunity completeness**: % of open deals with close date, amount, and primary contact populated
- **Contact data completeness**: % of contacts with email, phone, and company populated
- **Account deduplication rate**: Number of duplicate accounts identified in the last 30 days
- **Pipeline freshness**: % of open deals with an activity in the last 30 days

Review the scorecard at the start of each forecast cycle. When a metric degrades, investigate the root cause — a new rep's data entry habits, a bulk import without cleanup, a process change that removed a required field from the intake form.

## Why RevOps Owns Data Quality (Not Just Data Analysis)

In many organizations, data quality is treated as an IT or engineering problem. For RevOps, this is a mistake. The CRM is a RevOps system. The pipeline data is a RevOps asset. The people who feel the pain of bad pipeline data first — and who have the most to gain from clean data — are RevOps.

Owning data quality doesn't mean writing SQL queries or building monitoring infrastructure. It means defining the standards (what fields are required, what values are valid), holding the go-to-market teams accountable to those standards, and running the quarterly audits that catch decay before it reaches the forecast meeting.

The most effective RevOps teams don't just clean data when it becomes a problem. They profile their pipeline data on a regular cadence — and catch issues before they reach the forecast meeting.

""" + HARD_CTA,
}

for pid, content in posts.items():
    status, wc, rt = patch_post(pid, content)
    print(f"{pid[:8]} -> {wc}w, {rt}min, status {status}")
