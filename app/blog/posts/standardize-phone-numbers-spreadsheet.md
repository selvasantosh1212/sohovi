---
title: "How to Standardize Phone Numbers in a Spreadsheet (Without Breaking Them)"
slug: "standardize-phone-numbers-spreadsheet"
category: "Practical How-To Guides"
primaryKeyword: "standardize phone numbers spreadsheet"
supportingKeywords: ["phone number format excel", "clean phone numbers csv", "e164 phone number format", "normalize phone numbers", "phone number standardization"]
searchIntent: "informational"
wordCountTarget: 1600
audience: "someone with a CRM export containing 9 different phone formats, pre-SMS-campaign or pre-migration — money is on the line"
status: "published"
seo_title: "How to Standardize Phone Numbers in a Spreadsheet (Without Breaking Them)"
seo_description: "A CRM export with (044) 2498-XXXX, +91 44..., 9840-XX-XX all mixed is a common problem. Here's how to standardize to E.164 in Excel and what to do with the numbers that don't fit neatly."
---

# How to Standardize Phone Numbers in a Spreadsheet (Without Breaking Them)

**The target format:** E.164 — `+[country code][number]` with no spaces, dashes, or parentheses. `+14155552671`, `+447911123456`, `+919840123456`. This is the international standard accepted by all telecoms, SMS APIs, and CRMs without ambiguity.

The challenge is getting there from a real export that looks like this:

| Raw value | What it probably means |
|-----------|----------------------|
| (044) 2498-XXXX | India landline, Chennai STD code |
| +91 44 2498 XXXX | Same number, different format |
| 9840-XX-XXXX | Indian mobile, no country code |
| 04424XXXXXXXX | Landline with STD code, no country code |
| 447700900XXX | UK mobile — missing the + |

---

## Step 1: Strip All Non-Digit Characters

The first step is getting the raw digits only — remove spaces, dashes, parentheses, plus signs, dots. In Excel:

```
=SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(A2," ",""),"-",""),"(",""),")",""),"+","")
```

This strips spaces, dashes, parentheses, and plus signs. For dots and slashes: extend the SUBSTITUTE chain.

**The result:** Raw digit strings — "914424XXXXXXXX", "9840XXXXXXXX", "04424XXXXXXXX". Messy, but workable.

---

## Step 2: Identify the Country Code Problem

The hard part is not the formatting — it's the missing country codes. A column of mobile numbers from India without a country code is ambiguous: `9840123456` — is that India (+91 9840123456) or elsewhere?

Your approach depends on your dataset:

**Single-country dataset (safest):** If you know all numbers are from one country (e.g., all Indian customers), prepend the country code to all numbers that don't already have it.

**Multi-country dataset:** You need a country column to determine which code to prepend. If you don't have one, derive it from IP address, billing address, or ask the business owner.

**Never guess:** Prepending the wrong country code produces a valid-looking but wrong number. A US number `2125551234` with `+91` prepended looks like an Indian number — it'll connect somewhere, just not to your customer.

---

## Step 3: Handle Country Code Logic in Excel

Once you've stripped characters and identified the country, a formula approach:

```
=IF(LEFT(clean_number,2)="91", "+"&clean_number,
  IF(LEFT(clean_number,1)="0", "+"&country_code&MID(clean_number,2,LEN(clean_number)-1),
    "+"&country_code&clean_number))
```

This handles three cases:
- Number already starts with country code (91...) → add + prefix
- Number starts with 0 (trunk prefix) → drop the 0, add + and country code
- Number has no prefix → add + and country code

**Breaking points:**
- Extensions (x123, ext. 456) — strip first, store in a separate column
- Two numbers in one cell ("9840XXXX / 9841XXXX") — requires splitting first
- Numbers already in international format but missing the + sign
- UK numbers starting with 07 (local) vs +447 (international) — the 0 handling is different

---

## The Exceptions Report: What to Do With Numbers That Don't Fit

The honest reality: formula-based standardization works on the easy cases. The hard cases — ambiguous formats, numbers with extensions, cells with two numbers, numbers with wrong digit counts — need a human to look at them.

This is why the Sohovi standardization workflow produces an **exceptions report**: numbers it could confidently standardize are processed automatically; numbers that don't match expected patterns are flagged for human review rather than silently mangled.

The workflow:
1. Upload your phone column
2. Sohovi detects country code patterns and normalizes the clean cases to E.164
3. The exceptions report lists every number it couldn't confidently fix, with the reason — wrong digit count, ambiguous country, multiple numbers in cell
4. You review and correct the exceptions manually
5. Download the standardized column

This catches about 80–90% of numbers automatically and gives you a targeted, manageable list for the remaining 10–20%.

[IMAGE: Before/after showing a mixed phone column on the left and a clean E.164 column on the right, with an exceptions sidebar listing the 3 numbers that needed manual review]

---

## Why Format Consistency Matters

Inconsistent phone number formats cause real problems:

**SMS campaigns fail or misdeliver.** Most SMS API providers require E.164. A campaign to 5,000 contacts where 40% have local format numbers will have ~40% delivery failures.

**Dialers misroute.** Auto-dialers and CRM dialers parse phone numbers before dialing — non-standard formats may be dropped or dialed incorrectly.

**Deduplication misses matches.** `+14155551234` and `4155551234` and `(415) 555-1234` are three different strings — exact dedup treats them as three different contacts. Standardize first, then dedup.

**Reports undercount.** If you're aggregating by phone number to find customers with multiple accounts, format inconsistency means you count the same person twice.

---

## Frequently Asked Questions

**Q: What is E.164 format?**
E.164 is the international standard for telephone numbers defined by the ITU. The format is + followed by country code followed by the subscriber number, with no spaces, dashes, or other separators. Maximum 15 digits including country code. Example: +14155552671 (US), +447911123456 (UK), +919840123456 (India).

**Q: How do I handle phone numbers with extensions?**
Strip the extension into a separate column before standardizing. Look for patterns like "x123", "ext 456", "#789" and extract them with a regex formula (in Excel, use SUBSTITUTE to remove the extension and store it in a helper column).

**Q: My dataset has Indian phone numbers — some are 10 digits, some are 11 digits starting with 0. How do I handle both?**
10-digit numbers (9840XXXXXX) are mobile numbers without country code — prepend +91. 11-digit numbers starting with 0 (09840XXXXXX) are mobile numbers with a leading trunk prefix — drop the 0, prepend +91. 11-digit numbers starting with 044 are landlines with STD code — prepend +91 and you get a valid 13-digit E.164 number.

**Q: Should I store phone numbers as numbers or text in Excel/my database?**
Always text. Phone numbers are identifiers, not quantities. Storing as numbers strips leading zeros, drops the + sign, and may trigger scientific notation for long international numbers. The [leading zeros guide](/blog/excel-leading-zeros-fix) covers this in detail.

---

**Standardize a thousand phone numbers in one click** — and get an exceptions report for the ones that need a human look. Upload your export to Sohovi free and try it on your own data.
