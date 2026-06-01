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
    # freelancer-guide-audit-client-data-before-project (775w -> need 25+)
    'c0d79633-a44d-4edb-a1ff-98ffc2c92e56': """
## When the Data Is Better Than Expected

Not every pre-project audit reveals problems. Occasionally a client delivers a clean, well-structured file — consistent formatting, no duplicates, complete required fields, clear column names. When that happens, say so explicitly.

A brief email — "Reviewed your data. It's in excellent shape — no issues found before we get started" — takes 20 seconds and makes a strong impression. Clients who have been through engagements where data issues surfaced late (and silently) genuinely appreciate hearing that their data passed a professional review. It also reinforces the value of the audit process itself: they now understand you always check, and they'll continue to invest in clean data handoffs.
""",
    # validate-email-list-before-campaign (659w -> need 141+)
    '0867352b-eca9-432d-a967-2f3799fd8f73': """
## Building a Pre-Send Checklist That Protects Your Sender Score

Deliverability problems compound over time. A single campaign with a 5% bounce rate won't destroy your sender reputation immediately — but three campaigns in a row at that rate will. The damage accumulates, and recovery is slow: restoring a degraded sender score typically takes 6–8 weeks of sending to small, highly engaged segments.

A simple pre-send checklist, run before every campaign, prevents this entirely:

1. **List exported and segmented** — only contacts intended for this send
2. **Deduplication run** — one address, one record
3. **Syntax validation passed** — no obvious format errors
4. **Suppression list checked** — prior unsubscribes and hard bounces excluded
5. **Role-based and disposable addresses removed** — info@, admin@, mailinator variants gone
6. **Last engagement date reviewed** — contacts inactive for 12+ months segmented out
7. **Verification results documented** — valid %, catch-all %, invalid % recorded

The checklist takes 10–15 minutes for most lists. Run it without exception, including for campaigns to "regular" lists you've sent to before. List decay doesn't announce itself — the checklist is what catches it.

## What to Tell Clients About List Quality

Many clients hand over their email list without thinking about its quality. They've had it for years. They "know" it's good. When you flag issues, they're often surprised.

Keep the conversation factual and forward-looking: "22% of these addresses are invalid or undeliverable. Sending to them would push our bounce rate above the threshold that triggers deliverability penalties. Here's what I recommend removing, and here's what we'd be sending to." Numbers are more persuasive than advice.

If the client asks why their list has so many bad addresses, the answer is almost always time and no ongoing hygiene: lists built over years without validation naturally accumulate dead addresses. The fix is simple — validate before every send and re-verify the full list quarterly.

""",
    # freelance-accountant-data-quality-tax-season (753w -> need 47+)
    '02af17d4-59f3-4cf4-bf0a-45b509621242': """
## Protecting Yourself When Issues Surface Late

Despite the best intake process, data problems sometimes surface mid-engagement. A date field that looked consistent in your initial check turns out to have exceptions buried in row 2,847. A summary total that appeared to match its detail rows had a hidden formula error.

When this happens, document the discovery immediately: what you found, when you found it, and what rows are affected. Notify the client in writing before you make any corrections. "I found a discrepancy in the Q3 totals while working on the reconciliation — here's what I'm seeing and here's how I propose to handle it" keeps the client informed and protects you if the issue later comes into question.

The freelancers who handle these situations professionally — transparently and quickly — are the ones who get rehired. Those who quietly patch the problem and hope no one asks are setting themselves up for awkward conversations during filing season.
""",
    # test-data-generator-use-cases (797w -> need 3+, minimal extension)
    '2742e4b9-5f2e-4524-81dd-cc832cdcce00': """
## Choosing the Right Generator for Your Use Case

Not all test data generators are equally suited for every task. Browser-based generators are fast for one-off exports; programmatic generators are better for CI integration. Key questions to ask: Does it support the column types your schema needs? Can you configure value ranges and distributions? Does it export in the format your import pipeline expects (CSV, JSON, SQL INSERT)? And critically — can you seed it for reproducible output?

For most QA teams starting out, a simple generator that handles name, email, phone, date, number, and status columns covers 80% of daily test data needs without configuration overhead.
""",
    # client-csv-wrong-before-opening (794w -> need 6+, minimal extension)
    '746f305e-3c6a-47dd-93ec-2e25795998cd': """
## The Simplest Prevention: A Client Data Template

For clients who send files regularly, the fastest way to reduce pre-opening problems is to standardize the format they deliver. Create a CSV template with defined column headers, specify UTF-8 encoding in a brief instruction note, and ask clients to use it for every delivery.

Most clients will comply — especially once they've seen you flag encoding or formatting issues on their first few files. The template shifts the quality work upstream, where it's cheap, rather than downstream, where it costs you time on every engagement.
""",
    # data-quality-independent-consultants (787w -> need 13+)
    'b67a3a0d-4ac4-448c-9b9a-d0ba34c15cff': """
## The Long-Term Payoff of Consistent Data Standards

Independent consultants who apply rigorous data practices consistently — not just when the project is high-stakes, but on every engagement — compound a reputation advantage over time. Each client becomes a reference for your accuracy and professionalism. Each referral comes with a story about how you caught the data problem that the previous person missed.

This doesn't require heroic effort. It requires the same 20-minute intake check, the same transformation log, the same delivery review on every project. Consistency is what turns a practice into a reputation.
""",
}

for pid, addition in extensions.items():
    content = get_content(pid)
    new_content = content.replace(HARD_CTA, addition.strip() + "\n\n" + HARD_CTA)
    if new_content == content:
        # HARD_CTA not found, just append
        new_content = content.rstrip() + "\n\n" + addition.strip() + "\n\n" + HARD_CTA
    status, wc, rt = patch_post(pid, new_content)
    print(f"{pid[:8]} -> {wc}w, {rt}min, status {status}")
