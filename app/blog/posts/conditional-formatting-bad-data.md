---
title: "Conditional Formatting Recipes for Spotting Bad Data Instantly"
slug: "conditional-formatting-bad-data"
category: "Practical How-To Guides"
primaryKeyword: "conditional formatting bad data"
supportingKeywords: ["excel conditional formatting data quality", "highlight bad data excel", "conditional format data validation excel", "excel highlight errors", "google sheets conditional formatting bad data"]
searchIntent: "informational"
wordCountTarget: 1300
audience: "analyst who wants to quickly visually audit a spreadsheet for quality issues without writing formulas or using a separate tool"
status: "published"
seo_title: "Conditional Formatting Recipes for Spotting Bad Data in Excel"
seo_description: "6 conditional formatting formulas that highlight data quality problems instantly — blanks, duplicates, invalid emails, dates out of range, wrong formats, and outliers."
---

# Conditional Formatting Recipes for Spotting Bad Data Instantly

Conditional formatting turns a spreadsheet into a live quality audit. Instead of writing formulas column by column, you define a rule once and every problem glows red. Here are the 6 most useful recipes for data quality work.

---

## How to Apply These Recipes

In Excel:
1. Select the range to check (e.g., `B2:B1000`)
2. **Home** → **Conditional Formatting** → **New Rule**
3. Select "Use a formula to determine which cells to format"
4. Enter the formula below
5. Set the format (red fill for errors, yellow for warnings)
6. Click OK

In Google Sheets:
1. Select the range
2. **Format** → **Conditional formatting**
3. Under "Format cells if": choose **Custom formula is**
4. Enter the formula below

---

## Recipe 1: Highlight Blank (Required) Fields

```
=ISBLANK(A2)
```

Apply to the column, use red fill. Every empty cell in a required field lights up.

**Variation — blank or empty string:**
```
=OR(ISBLANK(A2), A2="")
```

---

## Recipe 2: Highlight Duplicates

```
=COUNTIF($B:$B, B2)>1
```

Apply to the key column (e.g., email address). Highlights every row where the email appears more than once. Works in both Excel and Google Sheets.

**Highlight only the second+ occurrence (keep the first unhighlighted):**
```
=COUNTIF($B$2:B2, B2)>1
```

This uses a partially-locked reference that expands downward, so it only counts occurrences *above* the current row.

---

## Recipe 3: Highlight Invalid Email Addresses

**Simple pattern check:**
```
=AND(NOT(ISBLANK(B2)), NOT(ISNUMBER(MATCH("*@*.*", B2, 0))))
```

Highlights cells that are non-blank but don't contain both `@` and `.` after the `@`.

**Google Sheets with REGEXMATCH:**
```
=AND(B2<>"", NOT(REGEXMATCH(B2, "^[^@\s]+@[^@\s]+\.[^@\s]+$")))
```

---

## Recipe 4: Highlight Dates Outside an Expected Range

```
=OR(A2 < DATE(2020,1,1), A2 > TODAY())
```

Highlights dates before 2020 or in the future — useful for "transaction date" or "signup date" columns where future dates are impossible.

**Adjust the bounds** to your data's expected range.

---

## Recipe 5: Highlight Values Not in an Allowed List

```
=COUNTIF(allowed_list_range, A2)=0
```

Where `allowed_list_range` is the range containing your valid values (e.g., `$F$2:$F$20` on a reference sheet). Highlights any value in column A that doesn't appear in the allowed list.

**Example:** For a "Status" column that should only be "Active", "Inactive", or "Pending":
```
=COUNTIF({"Active","Inactive","Pending"}, A2)=0
```

---

## Recipe 6: Highlight Statistical Outliers

```
=ABS(B2 - AVERAGE($B$2:$B$1000)) > 3 * STDEV($B$2:$B$1000)
```

Highlights values more than 3 standard deviations from the mean — the standard statistical outlier definition. Adjust the multiplier (3) for more or less sensitivity.

**Note:** This is a statistical flagging rule, not a correctness rule. Some legitimate values will appear as outliers (your biggest customer's order). Use it to find candidates for review, not as automatic deletion.

---

## Applying Multiple Rules

Stack rules with priority:
- Red: blank required fields (highest priority)
- Orange: duplicates
- Yellow: invalid email format
- Amber: out-of-range values

In Excel, rules are evaluated top-to-bottom; the first matching rule wins unless you uncheck "Stop if true." Stack your most critical rules at the top.

In Google Sheets, all matching rules are applied unless they conflict on the same property (e.g., two fill colors — the last rule wins).

---

## Frequently Asked Questions

**Q: Conditional formatting slowed my spreadsheet down significantly. What can I do?**
Conditional formatting with column-wide ranges (`$A:$A`) evaluates every cell, which is expensive for large sheets. Limit ranges to the actual data (e.g., `$A$2:$A$10000`) rather than entire columns. Also, minimize the number of rules — each rule adds overhead.

**Q: Can I export a list of all cells that fail the conditional format rule?**
Not directly from conditional formatting, but you can use the same formula in a helper column: `=IF(COUNTIF($B:$B,B2)>1, "DUPLICATE", "OK")`. Filter on "DUPLICATE" to get your list.

**Q: Does conditional formatting work after sorting the data?**
Yes — conditional formatting is evaluated based on cell values, not position. Sorting doesn't break or reset the formatting.

---

**For deeper quality analysis beyond what conditional formatting can show** — upload your sheet to Sohovi for null rates, duplicate statistics, type analysis, and outlier detection across every column automatically.
