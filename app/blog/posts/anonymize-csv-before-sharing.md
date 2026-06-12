---
title: "How to Anonymize a CSV Before Sharing It (So It Can't Be Re-Identified)"
slug: "anonymize-csv-before-sharing"
category: "Practical How-To Guides"
primaryKeyword: "anonymize csv before sharing"
supportingKeywords: ["anonymize data csv", "anonymize spreadsheet", "csv data anonymization", "remove pii from csv", "pseudonymize data excel"]
searchIntent: "informational"
wordCountTarget: 1600
audience: "someone who needs to share data with a vendor, analyst, or colleague and wants to ensure it can't be traced back to real individuals"
status: "published"
seo_title: "How to Anonymize a CSV Before Sharing It (So It Can't Be Re-Identified)"
seo_description: "Deleting the name column is not anonymization. Here's why, and here are the five techniques that actually work — with examples for each and guidance on which to use when."
---

# How to Anonymize a CSV Before Sharing It (So It Can't Be Re-Identified)

**The counterintuitive fact:** Deleting the name column is not anonymization. A dataset with ZIP code, age, and gender is enough to uniquely identify most individuals — researchers have shown that three quasi-identifiers can re-identify 87% of Americans. True anonymization requires systematically reducing the dataset's identifying power, not just removing the obvious name field.

---

## Why Simple Deletion Fails

Imagine sharing this "anonymized" dataset (name removed):

| ZIP | Age | Gender | Diagnosis |
|-----|-----|--------|-----------|
| 10001 | 34 | F | Hypertension |
| 10001 | 52 | M | Type 2 Diabetes |

Anyone who knows a 34-year-old woman with hypertension who lives in ZIP code 10001 can re-identify her row. The name column didn't protect her — the combination of remaining attributes did.

This combination-attack is the standard method used in de-anonymization research, and it works even on datasets that "removed all PII."

---

## The Five Anonymization Techniques

### 1. Redaction

Completely remove the column or replace values with a fixed token.

- `John Smith` → *(column deleted)*
- `john@email.com` → `[REDACTED]`

**When to use:** For fields that have no analytical value in the shared context (the name column when sharing a medical analysis dataset). Complete removal is the strongest anonymization.

**Limitation:** If the field's presence or absence is informative (e.g., "customer has a secondary email"), redaction may still reveal structure.

---

### 2. Masking

Replace part of a value with a fixed character, preserving the pattern.

- `john@gmail.com` → `jo***@gmail.com`
- `+14155552671` → `+1415***2671`
- `Apt 4B, 123 Main St` → `***, 123 Main St`

**When to use:** When the recipient needs to verify that a specific record exists (customer support verifying "is this the right email?") but doesn't need the full value.

**Limitation:** If you share masked emails with someone who already has the email addresses, they can confirm the masking pattern and verify matches.

---

### 3. Pseudonymization

Replace identifying values with a consistent fake identifier that preserves record relationships.

- Customer `John Smith` → `Customer_00847` (same fake ID everywhere this customer appears)
- Email `john@gmail.com` → `user_00847@pseudonym.local`

**Critical property:** The same input always produces the same pseudonym. This preserves join operations — a purchase table and a profile table linked by customer_id still work when both have the same pseudonymized IDs.

**When to use:** Sharing data with an analyst or BI vendor who needs to perform joins and aggregations but doesn't need real identities. The most useful technique for data analytics sharing.

**Limitation:** Pseudonymization is reversible if the mapping table is exposed. GDPR treats pseudonymized data as still personal data (unlike truly anonymized data). For GDPR purposes, keep the pseudonym mapping table separate and under access control.

---

### 4. Generalization

Replace specific values with broader ranges or categories.

- Age `34` → `30–39`
- Revenue `$147,293` → `$100K–$200K`
- ZIP `10001` → `New York, NY`
- Full address → City only

**When to use:** When the recipient needs the information for aggregate analysis but not at individual level. Generalizing ZIP to city removes the combination-attack vulnerability while preserving geographic analysis.

**Limitation:** The more you generalize, the less analytical value the data has. Find the right generalization level for your specific sharing purpose.

---

### 5. Synthetic Replacement

Replace real values with realistic-looking fake values generated from the same distribution.

- `John Smith` → `David Chen` (a different real-looking name)
- `john@gmail.com` → `dchen47@outlook.com`
- Revenue `$147,293` → `$152,840` (a different amount in the same range)

**When to use:** For demos, testing environments, vendor proof-of-concepts where the recipient needs realistic-looking data to work with (see [How to Generate Realistic Test Data](/tools/test-data-generator) for automated synthetic generation).

**Limitation:** Synthetic replacement for analysis is risky — the fake values may not preserve the statistical properties of the real data (correlations, outliers, distribution shapes). Use for demos, not for analytical purposes.

---

## Decision Guide: Which Technique to Use When

| Sharing for... | Recommended technique |
|----------------|----------------------|
| Analytical work (aggregations, joins) | Pseudonymization + generalization |
| Demo or proof of concept | Synthetic replacement |
| Support ticket or bug report | Masking |
| Regulatory audit of aggregate metrics | Generalization |
| Complete removal of sensitive context | Redaction |

---

## The Manual Process in Excel (And Why It's Risky)

For each sensitive column, you can apply anonymization manually in Excel:

- **Redact:** Delete the column
- **Mask:** `=LEFT(A2,2)&REPT("*",LEN(A2)-4)&RIGHT(A2,2)` for text fields
- **Pseudonymize:** Map each unique value to a unique ID using a lookup table, then apply VLOOKUP
- **Generalize:** `=IF(B2<30,"Under 30",IF(B2<40,"30-39",IF(B2<50,"40-49","50+")))` for age bucketing

**The risk:** One missed column. If you have 40 columns and manually review 39 of them, the 40th — maybe `secondary_contact_email` buried at the end — contains PII that reaches the recipient. Manual anonymization is error-prone at scale.

The safer approach: systematically scan all columns for PII before deciding what to do with each one, rather than trying to remember which ones need treatment.

---

## Anonymizing Without Uploading Your File

Sohovi's PII detection and anonymization runs entirely in your browser — your file never touches a server. This matters: the act of anonymizing data using an online tool that receives your file creates the very problem you're trying to solve (a third party receiving PII). Browser-local processing means the anonymization itself doesn't create a privacy exposure.

The workflow:
1. Upload your CSV — it stays in your browser's memory
2. Sohovi auto-detects columns likely to contain PII (email patterns, phone patterns, name-shaped values)
3. Choose a technique per column: redact, mask, pseudonymize, or generalize
4. Preview the result before applying
5. Download the anonymized file

For pseudonymization: the same input always produces the same output within a session — so joins work. The mapping table never leaves your device.

---

## Frequently Asked Questions

**Q: What's the difference between anonymization and pseudonymization under GDPR?**
Truly anonymized data is no longer personal data under GDPR — the data protection rules don't apply to it. Pseudonymized data is still personal data — the individual can be re-identified if the mapping table is accessed, so GDPR still applies. Anonymization provides more legal protection but is harder to achieve genuinely. Pseudonymization is the practical middle ground for data sharing where you need to preserve record relationships.

**Q: How many quasi-identifiers are needed to re-identify someone?**
Latanya Sweeney's widely cited research showed that 87% of Americans can be uniquely identified using just ZIP code, birthdate (including year), and gender. The exact number depends on the combination of attributes and the size of the population. As a practical rule: if three or more attributes in combination could narrow the population to a small group, the dataset is not anonymized.

**Q: Can I share aggregated statistics without anonymizing the underlying data?**
Aggregated statistics (averages, counts, percentages) can be shared without exposing individual records. But if the groups are small (e.g., "average salary for employees in department X: $92,000" where there's only one person in that department), even aggregates can identify individuals. Use minimum group-size rules (typically minimum group size of 5–10) to protect small groups in aggregate reporting.

**Q: Is there a free way to check which columns in my CSV contain PII?**
Yes — Sohovi's profiler auto-detects likely PII columns based on value patterns (email patterns, phone number patterns, name-shaped strings) and flags them for review. It runs in your browser — your file isn't uploaded. Try it on your export before deciding what to anonymize.

---

**Anonymize your file in the browser** — it never touches a server, which means the anonymization process itself doesn't create a privacy problem. Try it free on your own file.

[INTERNAL LINK: Why Pasting Customer Data into Free Online Tools Is a GDPR Risk]
