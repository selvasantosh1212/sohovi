---
title: "What Does This Excel Formula Do? Decoding Nested IFs, VLOOKUP, and INDEX/MATCH"
slug: "what-does-excel-formula-do"
category: "Practical How-To Guides"
primaryKeyword: "what does excel formula do"
supportingKeywords: ["decode excel formula", "understand excel formula", "excel formula explainer", "nested if excel explained", "vlookup formula explained"]
searchIntent: "informational"
wordCountTarget: 1500
audience: "someone who inherited a spreadsheet with complex formulas they didn't write and need to understand what they do before changing anything"
status: "published"
seo_title: "What Does This Excel Formula Do? Decoding Nested IFs and VLOOKUPs"
seo_description: "How to read and understand complex Excel formulas — nested IFs, VLOOKUPs, INDEX/MATCH, and IFERROR wrappers. A step-by-step approach for decoding formulas you didn't write."
---

# What Does This Excel Formula Do? Decoding Nested IFs, VLOOKUP, and INDEX/MATCH

**The fastest approach for any formula you don't understand:** Paste it into Sohovi's [Excel Formula Explainer](/tools/formula-explainer) — it gives you a plain-English breakdown of what each part does.

For learning to read formulas yourself, here's how to decode the most common patterns.

---

## The General Approach to Reading Any Formula

1. **Work from the inside out.** Excel evaluates the innermost parentheses first. Find the deepest nesting level and understand that function first, then move outward.

2. **Identify the outermost function.** The first function name after `=` is what the formula ultimately returns. Everything else is an argument to it.

3. **Break it into pieces.** Copy the formula into a blank cell and delete from the end backward, pressing F9 to evaluate each piece.

---

## Decoding VLOOKUP

```
=VLOOKUP(E2, $A$2:$C$100, 3, FALSE)
```

Reading left to right:
- `E2` — look up the value in cell E2
- `$A$2:$C$100` — search in this range, looking in the first column (column A)
- `3` — return the value from the 3rd column of the range (column C)
- `FALSE` — exact match only (if TRUE, it uses approximate matching, which requires sorted data)

**Plain English:** "Find the value of E2 in column A of the range A2:C100, and return whatever is in column C of the same row."

---

## Decoding IFERROR Wrappers

```
=IFERROR(VLOOKUP(E2, $A$2:$C$100, 3, FALSE), "Not Found")
```

**Plain English:** "Do the VLOOKUP. If it produces any error (like #N/A when the value isn't found), return 'Not Found' instead of showing an error."

IFERROR is almost always a wrapper — the real logic is inside it.

---

## Decoding Nested IFs

```
=IF(A2>90, "A", IF(A2>80, "B", IF(A2>70, "C", "F")))
```

Read each IF as "if condition, then value, else..." and unwrap from the outside:
- If A2 > 90 → return "A"
- Else, if A2 > 80 → return "B"
- Else, if A2 > 70 → return "C"
- Else → return "F"

**Tip for long nested IFs:** Use Find & Replace to add line breaks after each comma (only works in the formula bar), making the structure visible.

---

## Decoding INDEX/MATCH

```
=INDEX($C$2:$C$100, MATCH(E2, $A$2:$A$100, 0))
```

This is a two-function combination that does what VLOOKUP does but without the column-number limitation:

- `MATCH(E2, $A$2:$A$100, 0)` — finds the position (row number) of E2 in column A. The `0` means exact match.
- `INDEX($C$2:$C$100, [position])` — returns the value at that position in column C.

**Plain English:** "Find where E2 is in column A, then return the corresponding value from column C."

**Why use INDEX/MATCH instead of VLOOKUP?** VLOOKUP can only look right (return values to the right of the lookup column). INDEX/MATCH works in any direction.

---

## Decoding SUMIF / COUNTIF / AVERAGEIF

```
=SUMIF($A$2:$A$100, "Active", $B$2:$B$100)
```

- `$A$2:$A$100` — look in this range for the condition
- `"Active"` — the condition to match
- `$B$2:$B$100` — sum the values in this range where the condition is met

**Plain English:** "Add up all the values in column B where column A says 'Active'."

---

## Using F9 to Evaluate Formula Parts

In the formula bar:
1. Select part of the formula (e.g., just the MATCH function portion)
2. Press **F9**
3. Excel evaluates and shows the result of that portion
4. Press **Escape** (not Enter!) to restore the original formula

This lets you see what any sub-expression evaluates to in context.

---

## The Paste-as-Values Trick for Complex Formulas

If you need to see what the formula produces without tracing it mentally:
1. Copy the cell
2. Paste Special (Ctrl+Alt+V) → Values Only
3. The result is now a static value you can examine

Then compare the formula logic to the result to understand the relationship.

---

## Frequently Asked Questions

**Q: What's the difference between MATCH and VLOOKUP?**
MATCH returns a *position* (a row or column number). VLOOKUP returns a *value*. INDEX uses MATCH's position to look up a value — that's why INDEX/MATCH together replaces VLOOKUP with more flexibility.

**Q: Why do some formulas use $ signs (like $A$2)?**
The $ signs make a reference "absolute" — it doesn't change when you copy the formula to another cell. `$A$2` always refers to cell A2. `A2` (no $) is "relative" and shifts as you copy the formula down or across.

**Q: What does the `:` colon mean in a formula like `A2:C100`?**
The colon defines a range — A2 through C100 (all cells from A2 to C100, inclusive). `A2:A100` is a single column; `A2:C2` is a single row; `A2:C100` is a rectangle.

---

**Paste any Excel formula into Sohovi's [formula explainer](/tools/formula-explainer)** and get a plain-English breakdown — no need to decode it manually.
