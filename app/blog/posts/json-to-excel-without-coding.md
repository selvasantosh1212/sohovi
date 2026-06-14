---
title: "How to Convert JSON to Excel Without Coding (3 Methods)"
slug: "json-to-excel-without-coding"
category: "Practical How-To Guides"
primaryKeyword: "json to excel without coding"
supportingKeywords: ["convert json to excel", "json to xlsx no code", "open json in excel", "json to spreadsheet", "import json excel"]
searchIntent: "informational"
wordCountTarget: 1300
audience: "non-technical person who received a JSON file or API response and needs to open it in Excel to analyze it"
status: "published"
seo_title: "How to Convert JSON to Excel Without Coding (3 Methods)"
seo_description: "Three ways to open JSON in Excel without writing code: Power Query (built into Excel), a browser converter tool, and online converters. Each method with step-by-step instructions."
---

# How to Convert JSON to Excel Without Coding (3 Methods)

**The fastest method for a simple JSON array:** Use Power Query in Excel — Data → Get Data → From File → From JSON → select your file → Load to worksheet. This works natively in Excel 365 and Excel 2016+ without any add-ins.

For nested JSON (objects inside objects), a browser-based flattener is simpler.

---

## Method 1: Power Query in Excel (No Code, Built-In)

1. In Excel, click **Data** → **Get Data** → **From File** → **From JSON**
2. Browse to your JSON file → **Import**
3. Power Query Editor opens showing your JSON structure
4. Click **Convert to Table** (top left) if it shows a "List" type
5. Click the column expand icon (double arrows) to expand object fields into columns
6. Click **Close & Load**

Your JSON data is now a worksheet table.

**Best for:** Simple JSON arrays of flat objects. Works cleanly on:
```json
[{"name": "John", "email": "john@acme.com"}, ...]
```

**Struggle points:** Nested objects and arrays (JSON arrays within JSON objects) require additional Power Query steps to expand each nested layer manually.

[IMAGE: Power Query editor showing JSON data being expanded from a list type to columns]

---

## Method 2: Browser Converter Tool (Best for Nested JSON)

For JSON that has nested structures — objects inside arrays inside objects — a dedicated converter handles the flattening automatically:

1. Go to Sohovi's [JSON to CSV converter](/tools/json-to-csv)
2. Paste your JSON or upload the file
3. The tool flattens nested objects into dotted column names (`address.city`, `address.zip`)
4. Download the CSV
5. Open the CSV in Excel

**Best for:** Nested JSON that would require multiple Power Query expansion steps.

---

## Method 3: Paste + Text to Columns (For Small, Simple JSON)

For a small JSON array with flat objects:

1. Copy the JSON text
2. Paste into a text editor, remove the `[` and `]` brackets
3. Each JSON object `{...}` becomes one row
4. Paste into Excel
5. Use Data → Text to Columns to split on `,` (or adjust as needed)

**Best for:** Very small datasets where you want to avoid any tooling. Not practical for more than 20–30 rows.

---

## Handling Common JSON Structures

**Flat array of objects** (most common):
```json
[{"id": 1, "name": "John"}, {"id": 2, "name": "Sarah"}]
```
→ Use Power Query or any converter. Each key becomes a column.

**Nested objects**:
```json
[{"name": "John", "address": {"city": "NYC", "zip": "10001"}}]
```
→ Use the browser tool (flattens to `address.city`, `address.zip` columns).

**Array wrapped in a key**:
```json
{"data": [{"name": "John"}, ...]}
```
→ In Power Query: expand the "data" key first, then expand the array.

---

## Frequently Asked Questions

**Q: Can Excel open a JSON file directly by double-clicking?**
No — Excel doesn't open JSON files by default. You need to use the Get Data import process (Power Query) or convert to CSV first.

**Q: My JSON has arrays inside objects (e.g., a "tags" field that's an array). How do I handle that?**
Arrays inside objects are the hardest case to flatten into a spreadsheet. Options: (1) expand each array into multiple columns (tag1, tag2, tag3) if the array is short and fixed-length; (2) concatenate the array values into a single cell as a comma-separated string; or (3) use a Python script for full control. The browser converter tool handles simple cases automatically.

**Q: Does this work with API responses?**
Yes. Copy the API response JSON body (e.g., from Postman or a browser), paste it into a text file, save as `.json`, then import into Excel using Power Query.

---

**Convert JSON to Excel in your browser** — Sohovi's [JSON to CSV converter](/tools/json-to-csv) handles nested JSON and flattens it automatically. Download as CSV and open in Excel.
