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

# additions: each is a new section + optional CTA to append
additions = {
    # what-is-data-fabric (704w, no CTA)
    '367b9184-6b1d-4016-929e-f64d7d8a09f6': ("""
## What Data Fabric Means for Your Data Quality Practice

Even if you're years away from implementing a data fabric architecture, the problem it solves is relevant today: data spread across multiple systems, managed inconsistently, with no single view of quality or lineage. The practical solution at small scale is the same set of habits — data catalog (document what you have and what it means), data ownership (assign one person per dataset), and quality checks before data crosses system boundaries.

""" + SOFT_CTA, True),

    # excel-formula-reference-guide (710w, no hard CTA — ends with soft Sohovi mention)
    '268a9d06-8b61-4329-be9d-61684f942d55': ("""
## Building a Formula-Driven Quality Dashboard

Once you're comfortable with the core formulas above, combine them into a dedicated quality audit tab on any spreadsheet you're working with. A column-by-column completeness check using COUNTA and ROWS, a duplicate flag using COUNTIF, and an outlier check using IF with logical thresholds takes about 20 minutes to build the first time — and saves hours of manual checking on every new dataset.

Keep the audit tab hidden or separate from the working data so it's easy to replicate across projects without cluttering the main analysis.

""", True),

    # order-data-quality-ecommerce (717w, HAS hard CTA)
    '106a9ee8-3dd4-4521-8046-19047405d2d3': ("""
## Running a Monthly Order Data Audit

A one-time order data cleanup is valuable. A recurring monthly audit is what prevents the problem from accumulating again. Set a recurring task for the last week of each month: export your open and recently closed orders, run completeness checks on address, email, and order value columns, and review duplicate order rates. Most issues that surface in this monthly review are quick to fix if caught early — and expensive to untangle if they accumulate for a quarter.

""", False),  # already has hard CTA, just add before it

    # cross-field-validation-guide (720w, no CTA)
    'e3a3b289-c041-4979-9307-5212c6eaafa4': ("""
## Getting Started With Cross-Field Validation

If you're implementing cross-field validation for the first time, start with your two most important conditional relationships — typically the status-to-field dependencies in your core workflow. Write the rule in plain English first ("If status is 'Closed Won', deal amount must be non-empty"), test it against your current data to see how many existing records fail, and fix the backlog before enforcing the rule going forward.

""" + SOFT_CTA + "\n\n" + HARD_CTA, True),

    # pattern-matching-data-quality (722w, no CTA)
    'f331adf1-f35e-48dd-8fe4-9bbda607cf21': ("""
## Implementing Pattern Matching in Practice

Start with your highest-value structured fields — order IDs, SKUs, postal codes, phone numbers. For each, document the expected pattern as a regex. Test the pattern against your current data to establish a baseline of how many existing records are valid. Then implement the check in your entry system going forward and schedule a quarterly review to catch any new variations that emerge.

""" + SOFT_CTA + "\n\n" + HARD_CTA, True),

    # solopreneur-year-end-business-data-audit (724w, HAS hard CTA)
    'f8c98c3a-501e-4991-ad09-3a65d7aa9b25': ("""
## Building the Habit for Next Year

The value of a year-end audit compounds only if you make it a recurring practice. Block two hours in your calendar for the same time next year before you close this one. The audit is faster the second time — you know what to look for, you have last year's numbers to compare against, and the data is cleaner because you acted on last year's findings.

""", False),  # already has hard CTA

    # audit-shopify-woocommerce-product-data (735w, HAS hard CTA)
    '8aa076bd-147b-4137-bc62-d25f4152fb00': ("""
## Preventing Product Data Degradation Between Audits

A quarterly audit catches issues that accumulated over three months. Preventing accumulation requires a few lightweight ongoing practices: a checklist for new product additions (title format, description, image, weight), a review step before any bulk catalog changes, and a weekly spot-check of 10 random products to catch format drift early.

""", False),  # already has hard CTA

    # what-is-dbt-data-build-tool (736w, no CTA)
    '0a48724c-4551-4a90-bfe7-fbd0075fde23': ("""
## dbt and Data Quality: The Core Contribution

The most important data quality contribution dbt makes to modern data teams is the test layer — the ability to define, version-control, and automatically run quality assertions on every transformation output. Before dbt, these checks were done manually, inconsistently, or not at all. dbt made testing a standard part of the data transformation workflow rather than an afterthought.

""" + SOFT_CTA + "\n\n" + HARD_CTA, True),

    # solopreneur-project-data-scope-creep (739w, HAS hard CTA)
    'fc44f326-d8fe-42a2-a1d4-17d15fd86cf8': ("""
## Using Data to Recognize Scope Creep Early

The clearest early warning sign of scope creep is a deliverable list that grows without a corresponding adjustment to timeline or budget. Track the original deliverables you committed to versus what's now expected. When that list expands by more than 15–20%, it's time for a scope conversation — not when you're two weeks past deadline.

""", False),  # already has hard CTA

    # what-is-metadata-data-quality (739w, no CTA)
    'a2457080-469a-446d-9acf-89d4255ddabb9': ("""
## A Practical Metadata Starting Point

If you have no formal metadata practice today, start with a single page: list your five most important datasets, one sentence describing what each is and who owns it, and the key fields that must be populated for the dataset to be usable. That document — even if it's a shared Google Doc — is the beginning of a metadata practice. Add to it each time you discover a new dependency, standard, or data quality rule. The value of metadata compounds as it grows.

""" + SOFT_CTA + "\n\n" + HARD_CTA, True),
}

for pid, (addition, needs_appending) in additions.items():
    content = get_content(pid)
    if needs_appending or HARD_CTA not in content:
        new_content = content.rstrip() + "\n\n" + addition.strip()
    else:
        # Insert before existing hard CTA
        new_content = content.replace(HARD_CTA, addition.strip() + "\n\n" + HARD_CTA)
    status, wc, rt = patch_post(pid, new_content)
    print(f"{pid[:8]} -> {wc}w, {rt}min, status {status}")
