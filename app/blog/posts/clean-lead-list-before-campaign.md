---
title: "How to Clean a Lead List Before Your Next Campaign (7-Point Checklist)"
slug: "clean-lead-list-before-campaign"
category: "Marketing Agencies & Email Marketers"
primaryKeyword: "clean lead list before campaign"
supportingKeywords: ["email list cleaning", "lead list quality", "pre-send email validation", "clean email list", "email campaign data quality"]
searchIntent: "informational"
wordCountTarget: 1500
audience: "marketer with a list and a send date — understanding that bounces tank sender reputation and that one dirty send can hurt all future sends"
status: "published"
seo_title: "How to Clean a Lead List Before Your Next Campaign (7-Point Checklist)"
seo_description: "A dirty lead list before an email campaign means bounces, spam flags, and damaged sender reputation — hurting every future send. Here's the 7-point checklist to run before you hit send."
---

# How to Clean a Lead List Before Your Next Campaign (7-Point Checklist)

**The stakes:** Email bounce rates above 2% damage your sender reputation with ISPs (Gmail, Outlook, Yahoo). A damaged reputation means future emails to your legitimate subscribers land in spam — making every future send less effective, not just the current one. A clean list before you send protects the deliverability of every campaign that follows.

---

## Why List Cleaning Is Urgent

The most common bad pattern: a team collects leads for weeks, exports the list the day before a campaign send, and hits send without any quality check. The result: a 4–6% bounce rate, an inbox placement drop that persists for 3–4 weeks, and a frantic investigation into "why our open rates suddenly crashed."

The fix isn't complicated. It's a pre-send checklist. Here it is:

---

## The 7-Point Pre-Send Checklist

### 1. Deduplicate

Find and remove duplicate email addresses. A subscriber who receives the same email twice will mark it as spam at a higher rate than someone who receives it once, and you waste send credits on every duplicate.

**Manual method:** In Excel, Data → Remove Duplicates on the email column. Add LOWER() and TRIM() helper columns first to catch casing and whitespace variants ("john@gmail.com" vs "JOHN@GMAIL.COM" are both counted as duplicates).

**What it misses:** The same person with two different email addresses (their work and personal email, both opted-in) — those are legitimate and shouldn't be deduped. De-duplication should be on email address, not on person.

See the dedicated guide: [How to Remove Duplicate Rows in Excel](/blog/remove-duplicate-rows-excel).

### 2. Syntax-Validate Email Addresses

Remove email addresses that are structurally invalid — missing @ symbol, invalid TLD, obvious typos.

**Common invalid patterns:**
- `john@` (no domain)
- `@gmail.com` (no local part)
- `john.gmail.com` (missing @)
- `john@gmail` (missing TLD)
- `john@gmai.com` (typo in domain — should be gmail.com)

**In Excel:** `=ISNUMBER(FIND("@",A2)) * ISNUMBER(FIND(".",A2,FIND("@",A2)))` — returns 1 for structurally valid emails, 0 for invalid. This catches obvious problems but not subtle ones (domain doesn't exist, mailbox doesn't exist).

**What it misses:** Valid-looking emails that don't actually exist (`definitelynotreal@gmail.com`). Syntax validation is free; deliverability validation (testing if the mailbox exists) requires a paid tool or your ESP's list validation feature.

### 3. Remove Role-Based Accounts

Role-based addresses (info@, sales@, support@, admin@, noreply@, contact@) are monitored by multiple people or by automated systems. They have disproportionately high unsubscribe and spam complaint rates, and they're often not people who opted in to your specific list.

**In Excel:** `=OR(LEFT(A2, 5)="info@", LEFT(A2, 6)="sales@", LEFT(A2, 8)="support@", LEFT(A2, 7)="contact@")` — flags role accounts. Adjust for your common patterns.

**Judgment call:** If someone at `info@acme.com` explicitly opted into your list through a form, they chose to use their info@ address — that's different from a scraped role account. Use judgment based on how the address was collected.

### 4. Standardize Names for Personalization

If your campaign includes personalization ("Hi {{first_name}}"), dirty name data causes embarrassing sends: "Hi JOHN", "Hi undefined", "Hi null", "Hi [[FNAME]]".

**Check for:**
- ALL CAPS names (`SARAH CHEN` → `Sarah Chen`) — use Excel's PROPER() function
- Lowercase names (`james park` → `James Park`)
- Placeholder values in name fields (`null`, `N/A`, `Test User`, `undefined`)
- Missing first names (rows where first_name is blank but last_name is present)

**Decision:** For rows with missing first names, either default personalization to "Hi there" or "Hi [Company Name]" (not "Hi ,") — set the fallback before you send.

### 5. Check Segment-Critical Fields Are Complete

Whatever segmentation your campaign uses (industry, location, company size, plan tier) — verify that those fields are populated for the contacts you're sending to. A segment filter on `industry = "Healthcare"` will silently skip rows where industry is null.

**Quick check in Excel:** Filter your send list on the segmentation column → count blanks. If 15% of your "Healthcare" list has no industry value, those contacts will miss the campaign or receive it untargeted.

### 6. Apply Your Suppression List

Your suppression list contains: previous unsubscribes, hard bounces from past campaigns, known spam complainers, and regulatory opt-outs (GDPR/CAN-SPAM). Sending to any of these is illegal (for opt-outs), reputationally damaging (hard bounces re-bounce), or a compliance violation.

**In Excel:** VLOOKUP your send list against your suppression list: `=IFERROR(VLOOKUP(A2, suppression_list, 1, FALSE), "SEND")` — returns "SEND" if not suppressed, the matched address if suppressed. Filter on "SEND" to get your clean send list.

This step is not optional. It's legally required for opted-out contacts in most jurisdictions.

### 7. Spot-Check 20 Random Rows

Before hitting send, manually review 20 randomly selected rows from your final list. Look at the names (do they look like real people?), the emails (do the domains look right?), and any personalization fields. You'll catch pattern problems — like a batch of contacts where first_name is the company name — that formula checks miss.

This takes 3 minutes and has saved many campaigns from embarrassing personalization errors.

---

## Case: Cleaning a 5,000-Contact List

Here's a realistic example — a 5,000-contact list built from three sources over 6 months:

| Check | Before | After |
|-------|--------|-------|
| Remove duplicates | 5,000 | 4,720 (280 dupes removed) |
| Remove invalid emails | 4,720 | 4,601 (119 invalid) |
| Remove role accounts | 4,601 | 4,488 (113 role accounts) |
| Apply suppression list | 4,488 | 4,391 (97 suppressed) |
| **Final send list** | **4,391** | ↓ from 5,000 |

You lose ~12% of the raw list to cleaning. That's normal and healthy. The 4,391 contacts who remain are real, deliverable, opted-in addresses — your campaign will perform far better sent to them than to the raw 5,000.

---

## Frequently Asked Questions

**Q: What bounce rate is dangerous for sender reputation?**
Email providers typically penalize sender reputation when hard bounce rate exceeds 2% and when spam complaint rate exceeds 0.1%. Some ESPs will suspend accounts above these thresholds. Under 0.5% bounce rate and under 0.05% complaint rate are the targets to aim for.

**Q: Should I delete or suppress contacts who unsubscribe?**
Suppress, don't delete. Suppressed contacts stay in your system as a record that they opted out — this prevents them from accidentally being re-added to a future send if you import a list that includes their address. Deleting them removes the opt-out record.

**Q: How often should I clean my email list?**
At minimum: before every campaign and after every list import (purchased list, trade show badge scan, scraped contacts). For active lists used in regular campaigns: run a full clean quarterly and remove contacts who haven't opened in 6+ months (those are delivery-risk addresses that suppress your open rate without converting).

**Q: Can I use my ESP's list validation feature instead of doing this manually?**
Yes — most major ESPs (Mailchimp, Klaviyo, ActiveCampaign) offer list validation that checks email syntax and existence. Use it in addition to, not instead of, the dedup and suppression checks above. ESP validation doesn't check for duplicates across your lists or apply your own suppression list.

---

**Run the 7-point check on your list before you hit send.** Upload it to Sohovi — dedup, invalid email flagging, and completeness checks on your name and segmentation fields in one pass. First file is free.
