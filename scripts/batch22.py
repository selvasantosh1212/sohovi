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

def get_content(slug):
    url = BASE + '?select=id,content&slug=eq.' + slug
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=ctx) as r:
        data = json.loads(r.read())
    return data[0]['id'], data[0]['content']

def patch_post(pid, content):
    wc = len(content.split())
    rt = max(1, round(wc / 200))
    payload = json.dumps({'content': content, 'read_time_min': rt}).encode()
    req = urllib.request.Request(BASE + '?id=eq.' + pid, data=payload, headers=PATCH_HEADERS, method='PATCH')
    with urllib.request.urlopen(req, context=ctx) as r:
        return r.status, wc, rt

# Posts WITH existing hard CTA — insert addition before CTA
cta_additions = {
    'solopreneur-pricing-historical-data-raise-rates': "Revisit this data audit annually, not just when you're considering a rate increase. Regular review builds your historical record over time and makes the next rate conversation easier — you can show not just what you charge now, but how your rates, scope, and client value have evolved over two or three years.",
    'csv-deduplication-guide': "After deduplication, document the method you used and how many records were removed. That record serves as a quality baseline: if you run deduplication again in 6 months and find twice as many duplicates, it's a signal that your intake process is creating new duplicates and needs attention upstream.",
    'marketing-agency-client-trust-data-quality': "Agencies that make data quality a visible part of their onboarding process — showing clients the quality check results before campaign setup, not after — differentiate themselves from agencies that discover data problems mid-campaign. The proactive approach builds trust before it's needed.",
    'accounts-receivable-data-quality-phantom-invoices': "Build a monthly AR data review into your close process. A 30-minute check on invoice completeness, customer contact accuracy, and aging bucket consistency prevents the kind of data drift that makes quarterly reconciliations take an entire day instead of a few hours.",
    'data-lineage-where-data-comes-from': "When presenting reports to stakeholders, summarize the lineage briefly: where the data came from, when it was last refreshed, and what transformations were applied. This context turns a number into a reliable finding — and it answers the most common stakeholder question before they ask it.",
    'solopreneur-client-communication-notes': "Make notes part of your close process for every client interaction. A two-sentence summary written immediately after a call takes 60 seconds. The same summary written three days later from memory takes 10 minutes and is 30% less accurate. The notes habit is most valuable when it's most consistent.",
    'data-quality-excel-spreadsheets': "Add a dedicated 'Data Quality' tab to any shared Excel workbook used for ongoing tracking. Put your COUNTA completeness checks and COUNTIF duplicate checks there. Colleagues who maintain the workbook can run the audit themselves — creating shared accountability for data quality without adding manual overhead.",
    'csv-column-management-guide': "The most common column management mistake is renaming columns after they've been referenced in downstream formulas, scripts, or reports. Before renaming, search for all uses of the old name across your workflow. A column rename that breaks three downstream automations costs far more time than the cleaner name saves.",
    'grant-reporting-data-quality-nonprofits': "Build your grant data audit into the grant close-out timeline. Most grants have a final reporting window of 30-60 days after the period ends. Scheduling the data audit in the first week of that window gives you time to resolve discrepancies before the report is due — not the night before.",
    'import-csv-postgresql-mysql-sqlite': "Always test your import on a non-production database first. Run the full import, verify row counts and sample records, then run your quality checks before switching to production. This pattern catches import issues — wrong delimiter, encoding problems, truncated fields — before they affect your live data.",
    'local-service-business-bad-customer-data-revenue': "Create a 5-minute end-of-day habit for whoever takes bookings or customer calls: verify that every new contact record has a valid phone number, correct address, and accurate service notes before closing the day. Caught-at-entry errors take seconds to fix. Same errors found weeks later take hours.",
    'detect-pii-spreadsheet-no-cloud': "After completing a PII scan and applying appropriate protections, document what was found and what action was taken in a brief record. If you handle client data professionally, this documentation demonstrates due diligence. If you're ever asked to show what PII practices you follow, this record is your evidence.",
    'data-quality-dimensions-interactions-dependencies': "Understanding how dimensions interact helps you prioritize remediation. When you find a completeness problem, ask: which other dimensions does this affect? A missing email address (completeness) makes every email-dependent validity and uniqueness check irrelevant for that record. Fix completeness first — it unblocks everything downstream.",
    'data-quality-testing-catch-problems-before-production': "Integrate data quality tests into your deployment checklist the same way you include unit tests and integration tests. A deployment that passes all functional tests but introduces a quality regression — a field that starts accepting nulls, a type that changed silently — is still a broken deployment.",
    'bank-reconciliation-guide-bookkeeping': "After every reconciliation, note the date and any unresolved items. This running record transforms reconciliation from a monthly chore into a historical audit trail — one that quickly surfaces recurring issues like a vendor who regularly submits invoices with the wrong date format.",
    'clean-nonprofit-donor-database-campaign': "After the campaign cleanup, implement a quarterly data review cadence. Donor databases decay at roughly the same rate as email lists — about 20-25% annually from address changes, name changes, and lapsed donors. A quarterly 30-minute review keeps the database usable year-round, not just before major campaigns.",
}

# Posts WITHOUT existing hard CTA — just append CTAs (or CTAs + small addition for 746w post)
no_cta_additions = {
    'validate-date-formats-automatically': "Automated date validation is most valuable at the point of entry — catching format errors before they propagate into your database or downstream tools. " + SOFT_CTA,
    'regex-data-validation-non-developer': SOFT_CTA,
    'what-is-data-pipeline': SOFT_CTA,
    'what-is-schema-validation': SOFT_CTA,
    'enum-validation-allowed-values': SOFT_CTA,
    'what-is-schema-validation-glossary': SOFT_CTA,
    'validate-email-addresses-scale': SOFT_CTA,
    'what-is-change-data-capture-cdc': SOFT_CTA,
    'set-acceptable-error-rates-data-quality': SOFT_CTA,
    'what-is-data-lineage': SOFT_CTA,
    'data-quality-framework-practical-introduction': SOFT_CTA,
    'what-is-data-integration': SOFT_CTA,
    'what-is-data-cleansing': SOFT_CTA,
    'threshold-based-data-quality': SOFT_CTA,
    'why-small-businesses-need-data-quality': SOFT_CTA,
}

# Process CTA posts (insert before hard CTA)
for slug, addition in cta_additions.items():
    pid, content = get_content(slug)
    new_content = content.replace(HARD_CTA, addition.strip() + "\n\n" + HARD_CTA)
    status, wc, rt = patch_post(pid, new_content)
    print(f"{pid[:8]} -> {wc}w, status {status}  [{slug}]")

# Process no-CTA posts (append soft CTA + hard CTA)
for slug, soft_text in no_cta_additions.items():
    pid, content = get_content(slug)
    new_content = content.rstrip() + "\n\n" + soft_text.strip() + "\n\n" + HARD_CTA
    status, wc, rt = patch_post(pid, new_content)
    print(f"{pid[:8]} -> {wc}w, status {status}  [{slug}]")
