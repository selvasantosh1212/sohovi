---
title: "Fuzzy Matching Explained: How to Find 'John Smith' vs 'Jon Smyth' in Your Customer Data"
slug: "fuzzy-matching-customer-data"
category: "Practical How-To Guides"
primaryKeyword: "fuzzy matching customer data"
supportingKeywords: ["fuzzy matching excel", "fuzzy duplicate detection", "near-duplicate records", "approximate string matching", "fuzzy dedupe"]
searchIntent: "informational"
wordCountTarget: 1600
audience: "business user who just discovered exact-match dedup isn't enough — has typos and variants in their contact data and wants to understand the approach"
status: "published"
seo_title: "Fuzzy Matching Explained: How to Find 'John Smith' vs 'Jon Smyth' in Your Customer Data"
seo_description: "Exact-match deduplication misses typos, name variants, and casing differences. Fuzzy matching finds records that are similar but not identical. Here's how it works and how to use it without coding."
---

# Fuzzy Matching Explained: How to Find "John Smith" vs "Jon Smyth" in Your Customer Data

**The short answer:** Fuzzy matching compares records by similarity rather than exact equality. Instead of requiring "John Smith" and "John Smith" to be identical, it scores how similar they are — "John Smith" and "Jon Smyth" might score 85% similar and get flagged as a likely duplicate. You set the threshold; the tool does the comparison.

---

## Why Exact Matching Isn't Enough

Run Excel's Remove Duplicates on this list:

| ID | Name | Email |
|----|------|-------|
| 1 | John Smith | john.smith@acme.com |
| 2 | Jon Smyth | j.smith@acme.com |
| 3 | JOHN SMITH | john.smith@acme.com |
| 4 | Smith, John | jsmith@acme.com |

Excel will find exactly one duplicate: rows 1 and 3 are identical after casing is normalized — but only if you first add a LOWER() helper column. Rows 2 and 4 are the same person with a typo and a name-format variant. Excel has no mechanism to catch those.

These near-duplicates are the most costly ones: they cause duplicate outreach, split customer histories, and miscount your real customer base.

---

## The Three Main Fuzzy Matching Techniques

### 1. Edit Distance (Levenshtein)

Edit distance counts the minimum number of single-character operations (insert, delete, replace) needed to transform one string into another.

- "Jon" → "John" requires 1 insertion → edit distance of 1 → highly similar
- "Smyth" → "Smith" requires 1 substitution → edit distance of 1 → highly similar
- "Jon Smyth" → "John Smith" requires 2 operations → still very high similarity

**Best for:** Catching typos and minor spelling errors in names, company names, and addresses.

[IMAGE: Side-by-side showing two name cards with the character differences highlighted in red: "Jon Smyth" vs "John Smith", with an edit distance score of 2]

### 2. Phonetic Matching (Soundex / Metaphone)

Phonetic algorithms convert names to a code that represents how they sound, then compare codes.

- "Smith" and "Smyth" produce the same Soundex code (S530) → match
- "Catherine" and "Katherine" → same phonetic code → match
- "Garcia" and "Garsia" → same code → match

**Best for:** Name matching, especially when data comes from phone intake or is transcribed from speech.

### 3. Token Matching (Word Order Variations)

Splits strings into individual words (tokens) and compares sets of words regardless of order.

- "Smith, John" and "John Smith" → same tokens ("Smith", "John") → high similarity
- "Acme Corporation Ltd" and "Acme Corp" → overlapping tokens → match with appropriate threshold

**Best for:** Company names with legal suffixes (Inc, Ltd, LLC), addresses where street order varies, names in different cultures (surname first vs given name first).

---

## The Threshold Question: Strict vs. Loose

Every fuzzy matching system uses a similarity threshold — the minimum score a pair of records must reach to be flagged as a potential duplicate.

**Strict threshold (90–100%):** Only catches very close matches — typos, trivial casing differences. Produces few false positives but misses genuine duplicates with bigger differences.

**Loose threshold (60–75%):** Catches broader variants — name transcription errors, partial matches. More likely to flag non-duplicates (false positives) that need human review.

**The key insight:** Fuzzy matching surfaces candidates for review — it doesn't make the decision. You look at the flagged pairs and decide whether they're actually the same record. A strict threshold means fewer pairs to review but more missed duplicates in your live data. A loose threshold means more review work but a cleaner final result.

---

## Can You Do Fuzzy Matching in Excel?

Yes — but only painfully. The most common approach uses a user-defined VBA function or a helper column with a SIMILARITY formula from a third-party add-in. Native Excel has no built-in fuzzy matching function. The practical approaches are:

1. **Power Query's "Fuzzy Merge"** — available in recent Excel versions. Go to Data → Get Data → Combine Queries → Merge, and tick "Use fuzzy matching." Works but is limited to simple two-column joins with basic threshold control.

2. **VBA implementation** — requires writing or pasting custom VBA code to calculate Levenshtein distance. Functional but not suitable for non-technical users.

3. **Third-party add-ins** — some Excel add-ins provide fuzzy matching. Quality varies, and they often require installation and may upload data to a server.

For most business users, Excel's fuzzy merge in Power Query is the most accessible option — but it's designed for merging two tables, not for deduplicating a single list.

---

## Running Fuzzy Dedupe Without Code

Sohovi's [duplicate row remover](/tools/remove-duplicates) includes fuzzy matching that runs entirely in your browser:

1. Upload your CSV or paste your data
2. Select the columns to match on (name, email, company — or a combination)
3. Choose technique: exact, fuzzy (edit distance), phonetic, or all three
4. Set your similarity threshold with a slider
5. Review the flagged pairs — approve or reject each merge
6. Download the deduplicated result

The review step is important. No automated system should merge records without a human confirming — a 78% match might be two different people with similar names. You stay in control.

---

## False Positives: The Real Risk of Fuzzy Matching

Fuzzy matching produces false positives — pairs that score high enough to be flagged but are actually different people or companies. Classic examples:

- "Karen Smith" and "Kevin Smith" — same last name, first names start with K → phonetic match
- "ACE Hardware" and "ACE Consulting" → token overlap on "ACE"
- "123 Main Street" and "321 Main Street" — transposed digits, similar characters

This is why every good fuzzy matching tool includes a review step rather than auto-merging. Don't use any tool that merges automatically without letting you inspect the matches.

---

## Frequently Asked Questions

**Q: What similarity score should I use as a threshold for customer name matching?**
For names where typos and transcription errors are the main issue, 80–85% is a reasonable starting point. Review the flagged pairs at that threshold and adjust — if you're seeing too many obvious non-matches, tighten to 88–90%. If you're seeing obvious duplicates not being caught, loosen to 75–78%.

**Q: Can fuzzy matching work on email addresses?**
Yes, but email is a special case. Many duplicates are the same person with different email providers (john@gmail vs john@outlook), which fuzzy matching on the email column won't catch — local part matching will. Other duplicates have near-identical emails (john.smith@ vs johnsmith@), which fuzzy matching will catch. Most dedup workflows should match on name + company as the primary columns and use email as a secondary signal.

**Q: Does fuzzy matching work for addresses?**
Yes — address fuzzy matching uses a combination of edit distance and token matching. "123 Main St" and "123 Main Street" match well. Apartment number variants and US postal abbreviations (Ave vs Avenue) are standard cases most implementations handle. Full address standardization and geocoding is a separate step from dedup.

**Q: Is fuzzy matching only for English names?**
No — edit distance works on any Unicode string. Phonetic algorithms are primarily designed for English but alternatives exist for other languages (Beider-Morse for surnames across cultures, for example). For multilingual datasets, edit distance combined with human review is the most reliable approach.

---

**Fuzzy matching is how real-world deduplication works.** Run it on your contact list — free, in your browser, with a review step before anything is merged, at [/tools/remove-duplicates](/tools/remove-duplicates).
