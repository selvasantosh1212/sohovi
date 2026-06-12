---
title: "CSV Dates Are Wrong in Excel: Why 03/04 Becomes April 3rd and How to Fix It"
slug: "csv-dates-wrong-excel-fix"
category: "Practical How-To Guides"
primaryKeyword: "csv dates wrong excel"
supportingKeywords: ["excel date format wrong", "csv date importing wrong", "excel date mm/dd vs dd/mm", "excel date format fix", "dates corrupted excel"]
searchIntent: "informational"
wordCountTarget: 1500
audience: "someone confused or alarmed by dates that look wrong after opening a CSV in Excel — possibly about to make a reporting error"
status: "published"
seo_title: "CSV Dates Are Wrong in Excel: Why 03/04 Becomes April 3rd and How to Fix It"
seo_description: "Excel applies your computer's regional date setting to CSV dates. If the file used DD/MM and your machine is set to MM/DD, every date below the 13th silently swaps day and month. Here's how to fix it and detect silent corruption."
---

# CSV Dates Are Wrong in Excel: Why 03/04 Becomes April 3rd and How to Fix It

**The diagnosis:** Excel applies your computer's regional date format when interpreting CSV date strings. If your file was created on a system using DD/MM/YYYY but your computer is set to MM/DD/YYYY (common on US Windows machines), Excel reads "03/04/2026" as April 3rd — not March 4th. The same string, two different dates depending on the machine reading it.

For dates where the day is 13 or higher, Excel can't interpret the string as a valid MM/DD date and leaves it as text. For dates where the day is 12 or below, it silently converts — which is worse, because the data looks valid while being wrong.

---

## Why This Happens

[IMAGE: Diagram showing the string "03/04/2026" with two arrows pointing to two different calendar dates: one showing March 4 (DD/MM interpretation) and one showing April 3 (MM/DD interpretation), labeled with the regional settings that produce each]

CSV files are plain text. The string "03/04/2026" has no metadata saying whether it's DD/MM or MM/DD — it's just characters. When Excel opens a CSV, it uses your operating system's regional date format to decide how to interpret the string. If the file was created under different regional settings than your machine, dates get misread.

---

## Fix 1: Use the Import Wizard (Best — Before the File Is Open)

1. Open Excel (don't double-click the CSV)
2. **Data** → **From Text/CSV** → browse to your file
3. In the preview dialog, click on your date column
4. Change the Data Type to **Date** and set the format explicitly: **DMY**, **MDY**, or **YMD**
5. **Load**

Specifying the source format explicitly tells Excel exactly how to parse the dates — regional settings are bypassed.

[IMAGE: Excel import wizard date column selected with the Date type dropdown open showing DMY, MDY, and YMD options]

---

## Fix 2: Convert an Already-Open File

If you've already opened the file and dates look wrong:

**Step 1: Identify which format the source used.** Look for dates where the day is 13 or higher — if those appear as text (left-aligned in the cell) while dates with days ≤ 12 appear as Excel dates (right-aligned), your dates have mixed parsing. The ones that parsed are wrong; the ones that stayed as text are the lucky ones.

**Step 2: Re-import.** Close the file without saving. Use the import wizard (step above) and specify the correct date format.

If you've already saved or can't re-import: use a TEXT-to-columns approach:

1. Select the date column
2. **Data** → **Text to Columns** → **Delimited** → **Next** → **Next**
3. In step 3, select **Date** and choose **DMY** (or the correct source format)
4. **Finish**

---

## How to Detect Silent Corruption

The most dangerous version of this problem is when dates look fine but are silently wrong — because no day exceeds 12, Excel interprets everything as MM/DD and you never see an error.

**Detection method:** If you have a date column where no day value appears above 12, that's suspicious. For a legitimate date range spanning a full year, you'd expect roughly half the dates to have days above 12 (13th through 31st). A column where every date has a day ≤ 12 is a strong signal that days and months have been transposed.

In Excel: `=IF(DAY(A2)>12, "OK", "SUSPICIOUS")` and count the SUSPICIOUS values. If all dates are SUSPICIOUS, the column has probably been silently corrupted.

---

## The Permanent Fix: Use ISO 8601 Format

ISO 8601 (YYYY-MM-DD, e.g., "2026-03-04") is unambiguous — there is no regional interpretation. March 4th is always 2026-03-04 regardless of locale.

Ask your data source to export dates in ISO 8601 format. Excel recognizes YYYY-MM-DD correctly across all regional settings. It's the only date format that travels safely between systems, countries, and applications.

If you control the system exporting the data: set the date format in your export template to YYYY-MM-DD once, and you'll never have this problem again.

---

## Sohovi Date Profiling

When you're not sure whether dates in an existing file are already silently corrupted — upload the file to Sohovi's profiler. It surfaces:

- The distribution of detected date formats in the column
- Dates that couldn't be parsed at all (likely text, not dates)
- Mixed-format columns (some DD/MM, some MM/DD — common when data comes from multiple sources)
- Impossible dates (February 30th, month 13) that indicate a parse error

Profile the column before acting on the data — silent date corruption in a reporting dataset can make every date-dependent metric wrong.

---

## Frequently Asked Questions

**Q: How do I tell if Excel already silently converted my dates incorrectly?**
Check for the tell-tale sign: if your date column has no day values above 12, every date was "ambiguous" and Excel interpreted them all as MM/DD. If you were expecting DD/MM data, all those dates are wrong. Cross-reference a known date against the source system to confirm.

**Q: My dates look fine in the CSV but wrong in Excel — is the CSV corrupted?**
No. CSV files store dates as plain text strings. The file is fine. Excel is misinterpreting the strings. The fix is to specify the source format explicitly on import, not to modify the CSV.

**Q: Does this problem happen in Google Sheets?**
Yes, but Google Sheets uses your Google Account's locale, not your OS regional settings. The fix is similar: use File → Import, specify the column as "Date" and set the date format explicitly.

**Q: Can DATEVALUE() fix this?**
Only if you tell it the source format, which DATEVALUE() doesn't accept as a parameter. DATEVALUE() also uses your regional settings. It won't fix format-swapped dates automatically. Use Text to Columns with explicit date format instead.

**Q: Why does this only happen with dates where the day is 12 or below?**
Because Excel can only misinterpret an ambiguous date if both interpretations produce a valid date. "13/04" can't be interpreted as month 13 (there's no month 13), so Excel either recognizes it as April 13 (DD/MM) or leaves it as text. "03/04" can validly be either March 4 or April 3 — both interpretations are valid dates, so Excel guesses based on your regional settings, often silently wrong.

---

**Not sure if your dates are already silently corrupted?** Upload the file to Sohovi — mixed date formats and impossible values light up in the column profile instantly, before you build reports on wrong data.
