---
title: "How to Write a Data Quality Policy in 5 Steps"
slug: "write-data-quality-policy"
category: "Practical How-To Guides"
primaryKeyword: "data quality policy"
supportingKeywords: ["data quality standards", "data policy template", "data governance policy", "data quality documentation"]
searchIntent: "informational"
wordCountTarget: 1600
audience: "ops managers, team leads, small business owners formalizing data processes"
status: "published"
seo_title: "How to Write a Data Quality Policy in 5 Steps"
seo_description: "A data quality policy sets the standard for what good data looks like at your company. Here's how to write one in 5 practical steps — no legal team required."
---

# How to Write a Data Quality Policy in 5 Steps

**You can write a data quality policy in 5 steps: define what datasets the policy covers, set measurable quality standards for each, assign clear ownership, specify how quality will be monitored and measured, and document what happens when standards aren't met.**

A data quality policy sounds like something only enterprise companies need — something written by lawyers and filed in a compliance folder. In practice, it's just a document that answers five questions your team should agree on before data problems start causing damage.

This guide gives you a practical, plain-English approach to writing a data quality policy that works for a team of any size.

## In this guide

- What a data quality policy actually is (and what it isn't)
- Step 1: Define the scope — which datasets does this policy cover?
- Step 2: Set measurable quality standards for each dataset
- Step 3: Assign ownership and accountability
- Step 4: Define how quality will be monitored
- Step 5: Specify what happens when standards aren't met
- A simple one-page policy template

## What a Data Quality Policy Is (and Isn't)

A data quality policy is a written agreement between your team about what "good enough" data looks like — and who is responsible for making sure it stays that way.

It doesn't need to be:
- A long legal document
- Reviewed by lawyers before it's useful
- Perfect before it's put into practice
- Unchanged after you learn from experience

It does need to be:
- Written down (not just understood informally)
- Specific enough that someone can tell whether the standards are being met
- Owned by a person, not just a department
- Updated when business needs change

A one-page policy that your team actually follows is infinitely more valuable than a 20-page policy that sits in a shared drive unread.

## Step 1: Define the Scope

A data quality policy that covers "all data at the company" covers nothing in practice. Start by identifying the 3–5 datasets that matter most to your business operations.

**Ask yourself:**
- Which datasets do we use to make the most important decisions? (pipeline data, customer list, financial records)
- Which datasets, if wrong, would cause the most visible damage? (campaign lists, product catalog, billing records)
- Which datasets are shared most frequently — internally or externally?

**Output:** A named list of datasets the policy applies to. For example:
- Customer contact database (CRM export)
- Email marketing list
- Product catalog
- Monthly financial close data
- Vendor/supplier master list

Don't try to cover every spreadsheet in the company. Cover the ones that matter.

## Step 2: Set Measurable Quality Standards

For each dataset in scope, define what "good quality" means using specific, measurable thresholds for each relevant quality dimension.

**The core dimensions to define standards for:**

**Completeness:** What percentage of required fields must be populated?
- *Example: Customer email field must be ≥ 98% complete*
- *Example: Customer name must be ≥ 99% complete*

**Uniqueness:** What is the maximum acceptable duplicate rate?
- *Example: Customer IDs must be 100% unique*
- *Example: Email addresses must have a duplicate rate of < 0.5%*

**Validity:** What format rules apply to key fields?
- *Example: All email addresses must pass basic syntax validation*
- *Example: All dates must use YYYY-MM-DD format*
- *Example: Phone numbers must contain 10–15 digits only*

**Timeliness:** How frequently must the data be updated?
- *Example: Contact records must be reviewed and updated at least quarterly*
- *Example: Product pricing must be verified within 30 days of a supplier price change*

Write one standard per field per dataset. Keep them simple enough that anyone can check whether the standard is being met.

[IMAGE: Table showing a sample data quality standards matrix — dataset, field, dimension, threshold, owner]

## Step 3: Assign Ownership

Data quality standards without owners are suggestions. Every dataset in scope should have a named owner — one person responsible for maintaining quality and accountable when it degrades.

**Ownership means:**
- Understanding what standards apply to this dataset
- Running or commissioning regular quality reviews
- Investigating and resolving problems when standards aren't met
- Escalating systemic issues to leadership

**Tips for assigning ownership:**
- Assign to the person who uses the data most — not the person who created it or the IT team
- For shared datasets, one owner is better than shared ownership (which means no one owns it)
- Make ownership explicit in the policy document — name the person and their title

For a small business, one person might own multiple datasets. That's fine. What matters is that ownership is named and acknowledged.

## Step 4: Define How Quality Will Be Monitored

A standard is only useful if you know whether it's being met. Define how and how often each dataset will be checked against its quality standards.

**Options for monitoring:**

**Pre-use checks:** Run a quality check every time the dataset is imported, updated, or used for a high-stakes purpose. This is the minimum viable approach for most small businesses.

**Scheduled reviews:** Run a quality check on a regular schedule — weekly for high-frequency data, monthly for slower-moving datasets.

**Automated monitoring:** Use a data quality tool to run checks automatically and alert the dataset owner when a standard falls below threshold.

**At a minimum, specify:**
- How often each dataset will be checked (per use vs. weekly vs. monthly)
- Who is responsible for running the check
- What tool or method will be used
- Where the results will be recorded

Sohovi makes the "how" easy for CSV-based datasets — upload the file and get an instant quality report showing completeness rates, duplicate counts, and format issues. This can serve as your pre-use check for any file-based dataset.

## Step 5: Define What Happens When Standards Aren't Met

The final step is specifying what actions are required when a dataset fails its quality standards. This is the part most policies skip — and it's why most data quality standards never actually improve anything.

**Define a response for each severity level:**

**Minor failure (e.g., 3% null rate on an optional field):**
- Document the failure and its cause
- Attempt to fill gaps from available sources
- Proceed with flagged limitation noted

**Moderate failure (e.g., email null rate at 8% — above 5% threshold):**
- Stop the process that depends on this data
- Investigate root cause
- Notify dataset owner
- Run cleanup before proceeding

**Critical failure (e.g., 20% duplicate rate in customer IDs, PII detected in unexpected field):**
- Halt all downstream use immediately
- Escalate to dataset owner and management
- Run full audit before any data is used
- Document remediation steps taken

**Escalation path:** Specify who gets notified at each severity level. For a small team, this might just be "notify the dataset owner and the team lead." For larger organizations, you might specify data steward → department head → compliance officer.

## A Simple One-Page Policy Template

Here's a condensed template you can adapt:

```
DATA QUALITY POLICY — [Company Name]

Effective Date: [Date]
Policy Owner: [Name / Title]

Scope: This policy applies to the following datasets:
[List datasets]

Standards:
[Dataset] | [Field] | [Quality Dimension] | [Threshold] | [Owner]

Monitoring:
[Dataset] will be reviewed [frequency] by [owner] using [method].

Response to Failures:
- Minor failure: document, attempt cleanup, proceed with noted limitation
- Moderate failure: halt, investigate, notify owner, remediate before proceeding
- Critical failure: halt, escalate, full audit required

Policy Review: This policy will be reviewed and updated [annually / when major system changes occur].
```

## Frequently Asked Questions

**Q: What is a data quality policy?**
A data quality policy is a written document that defines what "good enough" data looks like for your organization — specifying which datasets are covered, what quality standards apply, who is responsible for each dataset, how quality will be monitored, and what happens when standards aren't met.

**Q: Does a small business need a formal data quality policy?**
Yes — though "formal" doesn't need to mean "complicated." A one-page document that your team actually follows is far more valuable than a detailed policy no one reads. Even a two-paragraph summary of standards and ownership is better than relying on informal understanding.

**Q: What should a data quality policy include?**
At minimum: the scope (which datasets it covers), measurable quality standards for each dataset, named ownership for each dataset, a monitoring schedule or trigger, and a defined response process for when standards aren't met.

**Q: Who should write a data quality policy?**
The person responsible for the most important data assets — typically an ops manager, data manager, or team lead. IT can be involved in defining technical standards, but the business decision about what quality thresholds are acceptable should be made by the people who use the data.

**Q: How specific should quality standards be in a data quality policy?**
Specific enough that someone can check whether they're being met without making a judgment call. "Emails should be valid" is too vague. "Email address field must pass basic syntax validation and have a null rate below 2%" is specific enough to measure and enforce.

**Q: How often should a data quality policy be updated?**
Review it annually at a minimum, and whenever a major change happens — a new system is implemented, a new dataset is added to scope, or a quality failure reveals a gap in the current policy. A policy that doesn't evolve becomes irrelevant.

**Q: What's the difference between a data quality policy and a data governance framework?**
A data quality policy is a specific document defining standards for named datasets. A data governance framework is the broader organizational structure — including roles, decision rights, and processes — that ensures data is managed well across the entire organization. A data quality policy is often one component of a broader data governance framework.

**Q: What happens if no one is enforcing the data quality policy?**
Without enforcement, a policy is just a document. Enforcement doesn't have to be heavy-handed — the most effective mechanism is building quality checks into workflows as gates. Data doesn't move to the next step until the checklist is signed off. The policy specifies the standards; the checklist implements them.

**Q: Do we need a data quality policy if we only have a few employees?**
The simpler the business, the simpler the policy. For a 5-person company, a data quality policy might be one paragraph: which datasets matter, who owns each one, and what "good enough" looks like. The formalization isn't the point — the shared understanding is.

**Q: Can a data quality policy help with GDPR or CCPA compliance?**
Yes. Both regulations require that personal data be accurate, current, and limited to what's necessary. A data quality policy that sets accuracy and completeness standards for personal data fields, assigns ownership, and specifies regular review cycles directly supports GDPR and CCPA compliance obligations.

---

**A data quality policy doesn't need to be a legal document or a governance project. It needs to be a shared agreement about what good data looks like and who is responsible for it. Write the one-page version first — you can expand it later.**

If you want to start with a concrete quality baseline for your most important dataset, Sohovi is free to try. Upload your CSV and get an instant quality report — completeness, duplicates, format issues — that gives you real numbers to anchor your policy standards. No credit card, no IT team required.

[INTERNAL LINK: How to Build a Data Quality Checklist for Your Business]
[INTERNAL LINK: Data Quality vs. Data Governance: What's the Difference?]

---
**Meta description:** A data quality policy sets the standard for what good data looks like at your company. Here's how to write one in 5 practical steps — no legal team required.
