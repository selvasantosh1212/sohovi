---
title: "Data Validation in Google Sheets: Dropdowns, Rules, and Protected Ranges"
slug: "data-validation-google-sheets"
category: "Practical How-To Guides"
primaryKeyword: "data validation google sheets"
supportingKeywords: ["google sheets data validation", "google sheets dropdown validation", "google sheets validate input", "prevent bad data google sheets", "google sheets validation rules"]
searchIntent: "informational"
wordCountTarget: 1400
audience: "ops person or analyst who manages a shared Google Sheet and wants to prevent bad data being entered by the team"
status: "published"
seo_title: "Data Validation in Google Sheets: Dropdowns, Rules, and Protected Ranges"
seo_description: "Set up data validation in Google Sheets to prevent bad data entry — dropdown lists, number ranges, date constraints, email validation, and protected ranges."
---

# Data Validation in Google Sheets: Dropdowns, Rules, and Protected Ranges

**The fastest way to prevent bad data in a shared sheet:** Add a dropdown list to any column by selecting the column → Data → Data validation → Criteria: List of items → enter your valid values. Collaborators can only enter values from the list.

---

## Setting Up Data Validation

1. Select the cell, column, or range to validate
2. **Data** → **Data validation**
3. In the dialog: choose your Criteria (see below)
4. Set behavior for invalid input: **Show warning** (yellow flag, data still allowed) or **Reject input** (prevents saving invalid data)
5. Optionally add a help text that appears when the cell is selected
6. Click **Save**

---

## The Validation Criteria Options

### Dropdown Lists (Most Common)

**List of items:** Enter values directly, comma-separated:
- Criteria: List of items → "Active, Inactive, Pending, Archived"
- Good for: small, fixed lists that don't change

**List from a range:** Reference another sheet or range:
- Criteria: List from a range → `Lists!$A:$A` (a column of valid values)
- Good for: lists that grow over time — add to the list column and validation updates automatically

---

### Number Validation

| Criteria | Example use |
|----------|-------------|
| Number is greater than | Quantity must be > 0 |
| Number is between | Age must be between 18 and 120 |
| Number is a whole number | Quantity must be an integer |

---

### Date Validation

| Criteria | Example use |
|----------|-------------|
| Date is after | Date must be after 2020-01-01 |
| Date is before | Event date must be before 2030-01-01 |
| Date is between | Report date must be in the current fiscal year |

---

### Text Validation

| Criteria | Example use |
|----------|-------------|
| Text contains | Status must contain "Open" or "Closed" |
| Text is exactly | Country code must be exactly "US" |
| Text starts with | Product code must start with "SKU-" |

---

### Custom Formula Validation

For complex rules, use a custom formula:

**Email format validation:**
```
=ISNUMBER(MATCH("*@*.*", D2, 0))
```

**Or using REGEXMATCH:**
```
=REGEXMATCH(D2, "^[^@\s]+@[^@\s]+\.[^@\s]+$")
```

**Number with condition:**
```
=AND(ISNUMBER(B2), B2 > 0, B2 < 10000)
```

**Date in the future:**
```
=A2 > TODAY()
```

---

## Protected Ranges (Prevent Editing Entirely)

For columns that should never be edited once set (like IDs, audit timestamps, calculated fields):

1. Select the range to protect
2. **Data** → **Protect sheets and ranges**
3. Click **Add a sheet or range**
4. Select **Range** (not Sheet)
5. Set permissions: who can edit this range
6. Click **Done**

Protected ranges show a lock icon and display a warning (or block editing entirely) if someone tries to modify them.

---

## What Data Validation Prevents vs What It Doesn't

**Data validation prevents:**
- Free-text entry in a dropdown column (users must pick from the list)
- Numbers outside a specified range
- Invalid dates

**Data validation does NOT prevent:**
- Existing bad data already in the sheet — validation only applies to new entries
- Data pasted in bulk (Google Sheets may bypass validation on paste-all)
- Formulas that produce invalid values

**Critical gap with paste:** If a collaborator copies 500 rows from another sheet and pastes them, validation may not fire on each row. After bulk pastes, run a manual check or use a COUNTIF formula to detect values outside the allowed list.

---

## Combining Validation with Conditional Formatting

To visually flag cells that currently contain invalid values (including existing data):

1. **Format** → **Conditional formatting**
2. Apply to the range
3. Custom formula: `=NOT(ISNUMBER(MATCH(A2, valid_list, 0)))` — highlights cells not in the valid list
4. Set fill to red

This creates a visual audit trail — red cells show where someone bypassed validation or where data existed before validation was added.

---

## Frequently Asked Questions

**Q: Can I add data validation to an entire column, including future rows?**
Yes — select the entire column (click the column letter) before adding validation. This applies validation to all current and future rows in that column.

**Q: My dropdown list is getting very long (100+ items). Is there a better approach?**
Use "List from a range" and put the list on a separate sheet. For very long lists, consider using a combo of VLOOKUP-based validation or a more structured input form.

**Q: Does data validation work on mobile Google Sheets?**
Partially — dropdowns show on mobile, and warnings appear, but reject-input validation may behave differently. Test your sheet on mobile if collaborators will use it on phones.

---

**For data that's already been entered** with quality problems — past the point where validation helps — upload your sheet to Sohovi to profile what's already in there and find the issues you need to fix.
