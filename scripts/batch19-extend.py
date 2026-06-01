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

extensions = {
    # append-vs-join-csv 741w -> need 59+
    '9bc156b2-21cb-4e00-b6ba-01232000ea5b': """
## Verifying Your Merge Result

After any CSV combination operation, spend two minutes verifying the output before using it downstream. Three checks cover the most common failure modes:

**Row count check**: For an append, does the total row count equal the sum of all input files? If you appended three files of 500, 600, and 400 rows, you should have exactly 1,500 rows. Any discrepancy signals a dropped row or a duplicate header that got included as data.

**Column check**: Does the output have exactly the columns you expected? In a join, a missing column usually means the column name didn't match between files. In an append with union mode, unexpected columns mean one file had an extra field worth investigating.

**Sample row check**: Open 5–10 rows from the middle of the file and verify the values look correct and belong to the right columns. Values that don't match their column headers indicate a delimiter or quoting issue that corrupted the parse.
""",
    # what-is-data-profiling 705w -> need 95+
    '920c8870-1a25-4ce8-9577-e9411fbe39f3': """
## Profiling Before a System Migration

One of the highest-stakes uses of data profiling is before a system migration — moving data from one CRM, database, or platform to another. Migrations that skip profiling frequently fail or produce corrupted data in the new system, because problems in the source data get amplified by mapping errors during the move.

A pre-migration profile should cover every field that will be mapped to the new system. For each field: completeness rate, value distribution, and data type consistency. Any field with significant quality issues should be cleaned before migration, not after — cleanup in the new system is always harder and more disruptive than cleanup in the source.

The profile also serves as a baseline: after migration, you can compare the new system's data against the profile to verify that all records were migrated accurately and that no data was lost or corrupted in transit. This comparison catches subtle migration failures that manual spot-checking misses.

## The Difference Between Profiling and Data Cleaning

Profiling and cleaning are different activities, but they're often confused. Profiling is diagnostic — it tells you what's wrong. Cleaning is corrective — it fixes what's wrong.

You profile first, then clean based on what you found. Cleaning without profiling means you don't know the scope of what you're fixing, you might miss issues you didn't think to look for, and you have no baseline to measure progress against.

Always profile before you clean. The 10 minutes you spend profiling saves you from cleaning the wrong things.
""",
    # how-to-merge-csv-files 796w -> need 4+
    '68149497-a24d-462e-8e39-609c2f6552a5': """
## A Quick Merge Verification Checklist

After every merge, run these checks before using the output: row count matches expectations, column count matches expectations, no duplicate header rows in the middle of the file, and 5 sample rows look correct. This takes under three minutes and catches the most common merge errors before they propagate downstream.
""",
    # what-is-data-quality 732w -> need 68+
    '76569da2-12c6-457a-8026-4be4e61d824f': """
## The Hidden Cost of Low Data Quality

Most organizations dramatically underestimate how much low-quality data costs them. The direct costs are visible: campaigns that underperform, reports that need to be rebuilt, orders that ship to wrong addresses. The indirect costs are less visible but often larger.

Consider how much time your team spends each week on work that exists because of data quality problems: reconciling numbers that don't match, hunting down the "real" version of a customer record, manually cross-checking reports before presenting them. Industry estimates suggest knowledge workers spend 20–40% of their time managing data quality issues rather than using data to make decisions (IBM, 2016).

That time compounds. The team that spends its energy on decision-making compounds knowledge and competitive advantage. The team that spends the same energy on data reconciliation falls behind — not because they're less capable, but because they're fighting a preventable problem every week.
""",
    # deliver-data-quality-audit-report-non-technical-client 729w -> need 71+
    'a58738a0-e3a1-4fb7-8d85-4ca804fa436e': """
## Documenting Your Audit Methodology

Non-technical clients sometimes ask how you found what you found. Having a brief methodology section in your report — or a ready verbal explanation — builds confidence in your findings and positions you as rigorous rather than just opinionated.

You don't need to explain the technical details. A plain-language summary is enough: "I exported the full customer database and ran a completeness check on every column, counted duplicate email addresses, and checked date field formats for consistency." That sentence tells the client you had a systematic approach, not just a hunch.

If the client is skeptical of a specific finding, the methodology section also gives them a path to verify it themselves — or to bring in a second opinion if they choose. Transparency about how you reached your conclusions is the mark of a professional who's confident in their work.
""",
    # 10-most-common-data-quality-problems-fixes 770w -> need 30+
    '4b14872d-6454-4c2b-ba75-b51f47eccc71': """
## How to Track Your Progress on Data Quality Fixes

For each problem you remediate, capture three numbers before and after: the count of affected records, the percentage of total records affected, and the estimated business impact. This creates a before-and-after record that documents the value of the cleanup work — useful for justifying continued investment and for showing stakeholders that improvement is measurable and real.
""",
    # data-quality-for-freelancers 702w -> need 98+
    'b86ebbd5-e539-417e-ac93-0c1fa69a277a': """
## Getting Paid for Data Quality Work

Many freelancers do data quality checks as a hidden, unpaid part of their process. That's a mistake — not just financially, but strategically. When clients don't see the quality check, they don't value it. When the deliverable just "works," they don't understand why.

Make it visible. Include a brief "Data Quality Review" line in your invoice or deliverable summary: what you checked and what you found. Even when everything passes, that line communicates that a professional process was followed. When issues are found and flagged, the line documents the value of the catch.

Over time, clients who see consistent data quality review line items come to expect and value it. Some will specifically request it as a scope item — and pay for it accordingly. What starts as invisible professionalism becomes a named, billable service that differentiates your practice.
""",
    # data-quality-for-revenue-operations 797w -> need 3+
    '9693e240-c2cd-4920-bfe4-727f458dd550': """
## Start With One Metric

If you're building your first RevOps data quality practice, don't track everything at once. Pick one metric — close date completeness on open opportunities is the highest-leverage starting point — and own it for one quarter. Improve it, report on it, and show its impact on forecast accuracy. That proof point is what earns budget and attention for the broader data quality program.
""",
}

for pid, addition in extensions.items():
    content = get_content(pid)
    new_content = content.replace(HARD_CTA, addition.strip() + "\n\n" + HARD_CTA)
    if new_content == content:
        new_content = content.rstrip() + "\n\n" + addition.strip() + "\n\n" + HARD_CTA
    status, wc, rt = patch_post(pid, new_content)
    print(f"{pid[:8]} -> {wc}w, {rt}min, status {status}")
