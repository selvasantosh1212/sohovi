---
title: "UTF-8 Characters Look Broken in Excel (Ã©, â€™): The Encoding Fix"
slug: "utf8-characters-broken-excel-encoding"
category: "Practical How-To Guides"
primaryKeyword: "utf8 characters broken excel"
supportingKeywords: ["excel encoding fix", "garbled characters excel", "excel utf-8 csv", "excel special characters broken", "excel csv encoding problem"]
searchIntent: "informational"
wordCountTarget: 1400
audience: "analyst whose CSV data shows Ã©, â€™, or other garbled characters instead of é, ' or other accented/special characters"
status: "published"
seo_title: "UTF-8 Characters Broken in Excel (Ã©, â€™): Encoding Fix Guide"
seo_description: "When Excel shows Ã© instead of é, it's reading a UTF-8 file as Windows-1252 (or vice versa). Here's how to fix it and open CSV files with correct character encoding."
---

# UTF-8 Characters Look Broken in Excel (Ã©, â€™): The Encoding Fix

**The diagnosis:** When you see `Ã©` instead of `é`, or `â€™` instead of `'`, Excel is reading a UTF-8 encoded file as if it were Windows-1252 (Latin-1) encoded. Each multi-byte UTF-8 character is being interpreted as separate Latin-1 characters — producing garbled output.

**The fix:** Re-open the file using the Text/CSV import wizard and specify UTF-8 encoding explicitly.

---

## What's Actually Happening

Text files encode characters using a scheme (charset). Two common schemes:

- **UTF-8:** Encodes all Unicode characters. Non-ASCII characters use 2–4 bytes. The `é` character is `0xC3 0xA9` (two bytes).
- **Windows-1252 (Latin-1):** An older Western European encoding where each character is one byte. Byte `0xC3` is the character `Ã`; byte `0xA9` is `©`.

When Excel reads a UTF-8 file assuming Windows-1252, it reads `0xC3 0xA9` as two separate characters: `Ã` and `©`, producing `Ã©` instead of `é`.

**Why does Excel do this?** When you double-click a CSV, Excel uses your Windows system's default encoding (typically Windows-1252 on US and European Windows installs). There's no automatic detection.

---

## Fix 1: Re-Open Using the Import Wizard (UTF-8 Specified)

1. Open Excel (don't open the CSV by double-clicking)
2. **Data** → **Get Data** → **From File** → **From Text/CSV**
3. Browse to the file and click **Import**
4. In the preview dialog, find the **File Origin** dropdown
5. Change it to **65001: Unicode (UTF-8)**
6. The preview will immediately show correct characters
7. Click **Load**

---

## Fix 2: Save as UTF-8 in Notepad / TextEdit (Resave the File)

If your file is Windows-1252 and you want it to be UTF-8:

**Windows:**
1. Open the file in Notepad
2. File → Save As
3. In the Save As dialog: change Encoding dropdown to **UTF-8 with BOM** or **UTF-8**
4. Save

**Mac:**
1. Open in TextEdit
2. Format → Make Plain Text
3. File → Save
4. In the dialog: set "Plain Text Encoding" to **Unicode (UTF-8)**

Then open the re-saved file in Excel using the import wizard.

---

## Fix 3: Python Conversion (For Bulk or Automated Processing)

```python
# Re-encode a file from Latin-1 to UTF-8
with open('input.csv', encoding='latin-1') as f:
    content = f.read()

with open('output.csv', 'w', encoding='utf-8') as f:
    f.write(content)
```

Or detect encoding automatically:
```python
import chardet

with open('input.csv', 'rb') as f:
    raw = f.read()
    detected = chardet.detect(raw)
    encoding = detected['encoding']

print(f"Detected encoding: {encoding}")

with open('input.csv', encoding=encoding) as f:
    content = f.read()
```

---

## Recognizing Which Encoding Problem You Have

| What you see | What it means |
|-------------|--------------|
| `Ã©` instead of `é` | UTF-8 read as Latin-1 |
| `?` or `?` boxes instead of characters | Character unsupported by current encoding |
| `Â` appearing before characters | UTF-8 BOM (Byte Order Mark) being shown |
| `Ä€` instead of `Ā` | Encoding detection failed entirely |

The pattern `Ã` + one character almost always means UTF-8 being read as Latin-1 — this is by far the most common case.

---

## The UTF-8 BOM Issue

Some UTF-8 files include a "Byte Order Mark" (BOM) — three bytes at the start (`0xEF 0xBB 0xBF`) that identify the encoding. Excel handles UTF-8 BOM correctly when you double-click (it detects the BOM). But many tools and systems produce UTF-8 without BOM — and that's where Excel's wrong-default-encoding problem occurs.

If your file has a BOM and still shows garbled characters, the file may actually be in a non-UTF-8 encoding despite the BOM (this is rare but occurs with some export tools).

---

## Frequently Asked Questions

**Q: How can I tell what encoding my CSV file uses before opening it?**
Open the file in a text editor that shows encoding: VS Code (bottom-right status bar), Notepad++ (Encoding menu), or BBEdit (Format menu). Alternatively, run Python's `chardet` library for detection.

**Q: My file is correct when I open it in Notepad but broken in Excel. Why?**
Notepad auto-detects encoding; Excel doesn't (for CSV). The file's encoding is correct — Excel is reading it with the wrong assumption.

**Q: Does this issue affect Google Sheets?**
Google Sheets auto-detects encoding fairly well and rarely shows this problem. When importing via File → Import, you can specify UTF-8 explicitly if needed.

---

**Profile your CSV for encoding issues** — Sohovi detects non-UTF-8 characters and garbled content in the profiler, flagging the columns and rows affected before you import the data downstream.
