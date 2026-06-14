---
title: "How to Audit a Client's Contact Database Before a Campaign Launch"
slug: "audit-client-contact-database-before-campaign"
category: "Marketing Agencies & Email Marketers"
primaryKeyword: "audit client contact database before campaign"
supportingKeywords: ["pre-campaign database audit", "client contact list audit", "verify contact data before campaign", "marketing agency pre-campaign checklist"]
searchIntent: "informational"
wordCountTarget: 1200
audience: "marketing agencies and email specialists who need to assess client contact data before running a campaign"
status: "draft"
seo_title: "How to Audit a Client's Contact Database Before a Campaign Launch"
seo_description: "Running a campaign on an unaudited client database is a risk you can prevent. Here's the pre-launch audit process that protects deliverability and campaign performance."
---

# How to Audit a Client's Contact Database Before a Campaign Launch

The client is ready to launch. The creative is approved. The calendar is set. They hand you the contact database — 18,000 records accumulated over three years with no systematic maintenance.

What you do in the next two hours determines whether this campaign helps your reputation or hurts it.

A pre-launch database audit isn't optional for agencies managing client campaigns — it's the professional standard that separates disciplined campaign execution from hoping for the best.

## Why Pre-Launch Audits Are Non-Negotiable

**Deliverability protection**: A campaign run against a poorly maintained database will have elevated bounce rates. Those bounces damage the client's sender domain reputation — a repair project that can take months and affect every subsequent campaign.

**Performance accuracy**: A campaign where 20% of the emails bounced or went to spam will show artificially low engagement rates. You won't know whether the creative performed well or poorly because the delivery problem corrupted the data.

**Client relationship protection**: If a campaign produces a bounce warning or platform suspension, the client's reaction is rarely "this was because of our bad data." It's "this happened on your watch." Auditing prevents the situation from arising.

**Legal exposure**: A database with EU contacts may require consent documentation under GDPR. A database with Canadian contacts may require CASL compliance. Sending without verifying these requirements is legal risk for both the agency and the client.

## The Pre-Launch Audit Framework

### Phase 1: Understand What You Have (30 minutes)

Before running any checks:

**Ask the client:**
- How was this database built? (Opt-in forms, events, purchases, imports, purchased lists, partner data?)
- When was the most recent import? What was the source?
- Has this database been emailed before? What were the last campaign metrics?
- Are there any contacts that should never receive email? (Former employees, complainers, unsubscribed customers who re-entered through a different channel)

The answers tell you what quality to expect and which specific risks to investigate.

**Review the file structure:**
- How many records?
- What fields are present?
- Is there a "consent date" or "source" field?
- Is there an existing suppression/unsubscribe list?

### Phase 2: Data Quality Assessment (60 minutes)

Run these checks systematically, in this order:

**Check 1: Email Format Validity**
Flag and remove addresses that fail basic format validation: missing "@," spaces in the address, invalid characters, obvious placeholder values (test@test.com, noemail@noemail.com).

**Check 2: Completeness on Required Fields**
For the campaign's intended use: which fields must be populated?
- If the campaign uses first name personalization: what percentage of records have a first name?
- If it's segmented by city or industry: what percentage have that field?
- If you need a consent date for GDPR compliance: what percentage have one?

Fields used for targeting or personalization should be at least 90% complete — below that, the campaign segmentation is unreliable.

**Check 3: Duplicate Email Addresses**
Count the number of email addresses that appear more than once. Above 5% duplicate rate indicates systematic data quality problems. Duplicates mean some people receive the campaign twice — which creates unsubscribes and complaints.

**Check 4: Database Age Assessment**
If there's a "date added" or "last activity" field, check the distribution:
- What percentage of records were added in the last 12 months?
- What percentage haven't had any activity in 24+ months?

Records older than 24 months without any activity are at risk of being stale. Segment them out of the main campaign list or send a re-engagement campaign before including in the full send.

**Check 5: Domain Analysis**
Run a frequency count on email domains. Look for:
- Domains with very few addresses that look suspicious
- Domains that no longer exist (check a sample manually)
- Role address domains (addresses that are clearly generic catch-alls)

### Phase 3: Suppression and Compliance Check (30 minutes)

**Verify the suppression list is applied**: All previous unsubscribers must be excluded. Check that the client's unsubscribe list is current and will be applied to the send.

**Check consent basis for relevant geographies**: For EU or Canadian contacts, verify that consent documentation exists or that there's a documented legitimate interest basis.

**Remove any explicitly excluded contacts**: Known complainers, former employees, journalists (unless specifically targeted), competitor contacts.

[IMAGE: Pre-launch audit report template showing sections for each check category, with pass/fail/needs-attention status and specific findings]

## Documenting and Communicating Findings

Write up your findings before the campaign launches:

**Summary**: Overall assessment (ready to send / needs cleanup / do not send without significant work)

**Critical findings** (must resolve before launch):
- "847 invalid email addresses — remove before send"
- "No suppression list applied — required before any send"
- "340 EU contacts with no documented consent basis — legal review required"

**Important findings** (address before launch if possible):
- "First name field missing for 1,200 contacts — disable personalization or handle gracefully (Dear [First Name] → Dear Customer)"
- "2,400 contacts last active 3+ years ago — consider a separate re-engagement campaign"

**Lower priority**:
- "Phone field format inconsistent — not affecting this campaign but note for future SMS work"

Share this document with the client before launch. Get explicit approval to proceed with the plan to handle each finding.

## What "Audit Complete" Means

"Audit complete" means:
- All critical findings are resolved
- Important findings are either resolved or formally waived by the client with documentation
- The final send list has been built from the audited data
- A final record count is confirmed and matches expectations

Only then does the campaign launch.

## Frequently Asked Questions

**Q: How long does a pre-launch database audit take?**
For a database of 5,000–25,000 records with standard quality issues, 2–4 hours for the full process. For larger or more complex databases, a half-day.

**Q: Should the client pay for the audit separately?**
For new client engagements where the database hasn't been assessed before, yes — include it as a discovery phase. For ongoing campaigns with a database you maintain, include audit time in the retainer.

**Q: What if the client wants to skip the audit to hit a launch deadline?**
Document that the audit was recommended and waived by the client. Scale down what you can do and at minimum run the critical checks (email validity, suppression list). A partial audit is better than none. Don't absorb the risk of skipping the audit without the client making an explicit, documented decision to do so.

**Q: What tools help with the audit process?**
Sohovi for a quick baseline profile (completeness, duplicates, email format validity in under a minute). An email verification service (ZeroBounce, NeverBounce) for deliverability checks. Spreadsheet tools for the manual analysis and documentation.

---

**The pre-launch audit is the professional checkpoint that separates campaigns that execute confidently from ones that require damage control. An hour of prevention here is worth days of deliverability repair on the other side.**

[INTERNAL LINK: Email Bounce Rate Over 2%? Here's Exactly What to Do Next]
[INTERNAL LINK: How to Validate Email Addresses in Bulk Without Coding]
