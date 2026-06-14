---
title: "How to Run a Data Quality Check on a Purchased Email List Before Using It"
slug: "data-quality-check-purchased-email-list"
category: "Marketing Agencies & Email Marketers"
primaryKeyword: "data quality check purchased email list"
supportingKeywords: ["purchased email list quality", "validate bought email list", "cold email list data quality", "check email list before sending"]
searchIntent: "informational"
wordCountTarget: 1200
audience: "marketers and agencies who've purchased or received a cold outreach email list and need to assess it before use"
status: "draft"
seo_title: "How to Run a Data Quality Check on a Purchased Email List"
seo_description: "Purchased email lists have notoriously bad quality. Before using one, run these checks to avoid deliverability damage, legal exposure, and wasted spend."
---

# How to Run a Data Quality Check on a Purchased Email List Before Using It

You've acquired a list of 10,000 contacts from a data vendor. Or maybe you bought a list at a trade show. Or you got it from a partner. The intended use: outreach, a campaign, or building a prospecting database.

Before you send a single email, run a quality check. Purchased and acquired lists have some of the worst data quality in email marketing — and using them without assessment is one of the fastest ways to damage your sender reputation.

## Why Purchased Lists Are High-Risk

Purchased lists are assembled from data scraped from public sources, third-party databases, and other vendors. They typically aren't collected with permission for your specific use. The quality problems are predictable:

- **High percentage of stale addresses**: The list may have been assembled months or years ago. Addresses change faster than data vendors update their records.
- **Spam traps**: ISPs and anti-spam organizations seed abandoned email addresses into databases specifically to catch bulk senders. These addresses look valid but produce immediate deliverability damage when emailed.
- **Role addresses**: info@, admin@, sales@, noreply@ — generic addresses that route to groups, not individuals, and often produce complaints when emailed.
- **Invalid and fake addresses**: Some addresses in purchased lists are simply wrong — typos, made-up domains, or test entries.
- **Low engagement baseline**: Even the valid, deliverable addresses on a purchased list are cold contacts who never opted in to hear from you. Open and engagement rates will be very low.

None of this means purchased lists can never be used. It means they must be assessed and cleaned before use — and that expectations about performance need to be calibrated.

## The Purchased List Quality Assessment Process

### Step 1: Basic File Check

Before analyzing the data, understand what you have:
- Total record count
- Column structure: which fields are present?
- Is there a "valid email" or "confidence score" field from the vendor?
- What date was this list assembled or last updated?

A list assembled in 2022 has had 3 years of natural decay. Expect significant quality issues.

### Step 2: Format Validity Check

Check every email address for basic format validity:
- Contains "@" and a domain
- No spaces or illegal characters
- Not a clearly placeholder value ("test@test.com", "noemail@nodomain.com")
- Domain ends in a recognizable TLD

In Excel: filter for addresses that don't contain "@", or use a formula to flag addresses that fail a simple pattern match.

In Google Sheets: `=IFERROR(IF(REGEXMATCH(A2,"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"),"Valid","Invalid"),"Invalid")`

Remove all invalid-format addresses immediately.

### Step 3: Role Address Identification

Filter for addresses where the local part (before @) is a common role address:
- info, contact, admin, sales, support, hello, service, billing, noreply, no-reply, webmaster, marketing, pr, media

These aren't personal contacts. For cold B2B outreach, role addresses typically perform poorly and should be separated from personal contacts.

### Step 4: Domain-Level Analysis

Run a frequency count on the domains in the list. High concentration of:
- Free email providers (gmail.com, yahoo.com, hotmail.com) for a supposed B2B list: signals lower quality
- Unusual or obscure domains: worth reviewing a sample to assess legitimacy
- Non-existent domains (you can spot-check with a domain lookup): immediate removal

### Step 5: Full Email Verification

For a purchased list, a full email verification service isn't optional — it's mandatory before any send. Services like ZeroBounce, NeverBounce, or Kickbox check:
- Whether the domain exists and accepts email
- Whether the specific mailbox exists (SMTP verification)
- Whether the address is a known spam trap
- Whether the address is a catch-all domain (accepts all addresses, good or not)
- Whether it's a disposable email address

This step typically removes 20–50% of a typical purchased list as undeliverable or risky. That's not a surprise — it's the expected quality of purchased data. Sending to the unverified portion would damage your deliverability; verification identifies what you can actually use.

[IMAGE: Funnel chart showing a purchased list of 10,000 contacts narrowing to: invalid format removed (9,200), role addresses separated (8,800), verification applied (5,100 deliverable, 3,700 removed), final usable list (5,100)]

### Step 6: Compliance Assessment

Before using any purchased list:

**Can you document the lawful basis for contact?**
- Under GDPR, marketing to EU persons requires consent OR a legitimate interest that outweighs privacy expectations. Purchased lists rarely come with consent documentation.
- Under CAN-SPAM, you must have a business relationship or a clear opt-in. Cold commercial email is legal under CAN-SPAM but must comply with opt-out rules.
- Under CASL (Canada), commercial electronic messages require express or implied consent. Cold email to Canadians without consent is generally illegal.

**Does the vendor provide sourcing documentation?**
Reputable vendors can tell you how each address was collected and whether consent was obtained. If they can't, assume the addresses have no consent basis.

Never use a purchased list for email marketing to EU or Canadian residents without a legitimate legal basis. The fines for GDPR violations start at €20 million.

## After Verification: Setting Realistic Expectations

Even after full verification, a purchased list will underperform an organic opt-in list:
- Open rates will be lower (cold contacts who don't know you)
- Click rates will be lower
- Unsubscribe rates will be higher
- Complaint rates may be elevated

This affects your domain reputation even if the addresses are technically deliverable. If you're sending from your primary sending domain, consider using a subdomain for cold outreach — reputation damage to the cold outreach subdomain doesn't affect the reputation of your main domain.

## Frequently Asked Questions

**Q: Should I ever use a purchased list for email marketing?**
Only if you've verified the addresses, have a legal basis for contact, and accept the performance expectations of cold outreach. For warm marketing to opted-in subscribers, purchased lists are the wrong tool entirely.

**Q: What's a typical deliverable rate for a purchased list?**
After full verification, expect 40–70% of a typical purchased list to be deliverable. The rest is undeliverable, risky, or spam traps. This is normal — it's why you verify before using.

**Q: Does using a purchased list violate my email platform's terms of service?**
Depends on the platform and how the list was acquired. Most major platforms (Mailchimp, Klaviyo, HubSpot) prohibit purchased lists or require that all contacts have consented. Read your platform's acceptable use policy before importing.

**Q: What if the vendor says the list was "permission-based"?**
Ask for documentation. "Permission-based" can mean many things, including permission to be contacted by the vendor — not permission to be contacted by you. Verify what "permission" actually means in context.

---

**A purchased list is input data that must be validated before use. The validation process removes the addresses that will damage your deliverability, identifies the segment that might actually perform, and protects your sender reputation from the high-risk portion. Never send to a purchased list cold.**

Sohovi can do the format validation and basic analysis step quickly — upload the CSV and get email format validity, completeness, and duplicate rates per column in under a minute before you run through a paid verification service.

[INTERNAL LINK: Email Bounce Rate Over 2%? Here's Exactly What to Do Next]
[INTERNAL LINK: How to Validate Email Addresses in Bulk Without Coding]
