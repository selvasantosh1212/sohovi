---
title: "CSV to JSON: Arrays, Objects, and Which Format APIs Actually Expect"
slug: "csv-to-json-api-formats"
category: "Practical How-To Guides"
primaryKeyword: "csv to json api format"
supportingKeywords: ["convert csv to json", "csv to json array", "csv to json objects", "csv to json format", "which json format for api"]
searchIntent: "informational"
wordCountTarget: 1400
audience: "developer or analyst who needs to send CSV data to an API and isn't sure which JSON structure the API expects — or which conversion tool produces the right format"
status: "published"
seo_title: "CSV to JSON: Arrays, Objects, and Which Format APIs Expect"
seo_description: "APIs expect JSON in specific formats — array of objects, array of arrays, or wrapped object. Here's how to convert CSV to each format, and which to use for common API patterns."
---

# CSV to JSON: Arrays, Objects, and Which Format APIs Actually Expect

**The core confusion:** Converting CSV to JSON seems simple, but JSON has multiple valid structures for tabular data. Most APIs expect one specific format, and sending the wrong one causes a 400 error even though your data is correct. Here's exactly which format to use and how to produce it.

---

## The Three Common JSON Structures for CSV Data

Given this CSV:

```csv
name,email,company
John Smith,john@acme.com,Acme Corp
Sarah Chen,sarah@tech.io,Tech Inc
```

### Structure 1: Array of Objects (Most Common)

```json
[
  {"name": "John Smith", "email": "john@acme.com", "company": "Acme Corp"},
  {"name": "Sarah Chen", "email": "sarah@tech.io", "company": "Tech Inc"}
]
```

**When APIs expect this:** REST APIs that accept a list of records. Mailchimp, HubSpot, Stripe, most modern APIs. The headers become JSON keys, each row becomes an object.

**How to produce it:** Most CSV-to-JSON converters default to this format. Use Sohovi's [CSV to JSON converter](/tools/csv-to-json) — this is the default output.

---

### Structure 2: Object with Data Array (Common in API Responses)

```json
{
  "data": [
    {"name": "John Smith", "email": "john@acme.com", "company": "Acme Corp"},
    {"name": "Sarah Chen", "email": "sarah@tech.io", "company": "Tech Inc"}
  ]
}
```

**When APIs expect this:** Many APIs wrap their payload in an envelope object. Check the API documentation — if the example request body shows `{"data": [...]}` or `{"records": [...]}`, this is the format.

**How to produce it:** Take the Array of Objects output and wrap it manually: `{"data": <your array>}`.

---

### Structure 3: Array of Arrays (Compact, Less Common)

```json
[
  ["name", "email", "company"],
  ["John Smith", "john@acme.com", "Acme Corp"],
  ["Sarah Chen", "sarah@tech.io", "Tech Inc"]
]
```

**When APIs expect this:** Older APIs, Google Sheets API, some data pipeline formats. The first array is the headers; subsequent arrays are data rows.

**How to produce it:** Less common as a default. Some converters offer this as an option.

---

## How to Convert CSV to JSON (3 Methods)

### Method 1: Browser Tool (Fastest, No Code)

Use Sohovi's [CSV to JSON converter](/tools/csv-to-json):
1. Paste your CSV or upload the file
2. Choose output format (Array of Objects by default)
3. Copy the JSON output

All processing is in your browser — no upload.

### Method 2: Python (For Automation)

```python
import csv, json

with open('data.csv', 'r') as f:
    reader = csv.DictReader(f)
    data = list(reader)

with open('data.json', 'w') as f:
    json.dump(data, f, indent=2)
```

`csv.DictReader` produces an Array of Objects automatically.

### Method 3: JavaScript / Node.js

```javascript
const csv = require('csvtojson');
csv().fromFile('data.csv').then(jsonArray => {
    console.log(JSON.stringify(jsonArray, null, 2));
});
```

---

## Type Handling: Numbers and Booleans

CSV stores everything as text. JSON has native types. When you convert "42" (a CSV string) to JSON, it can become:
- `"42"` (string) — the default for most converters
- `42` (number) — better for APIs that expect numeric types

Most APIs that accept numeric fields will reject `"42"` and require `42`. Check your converter's type inference settings — good converters detect numeric columns and convert them.

Similarly, "true"/"false" in CSV should become `true`/`false` (boolean) in JSON, not `"true"`/`"false"` (string).

---

## Common API Problems from Wrong JSON Format

| Problem | Likely cause |
|---------|-------------|
| API returns 400 Bad Request | Wrong top-level structure (array vs object) |
| Numbers treated as strings | No type inference in converter |
| Field names wrong | Header row had extra spaces or different casing |
| Missing fields | Converter dropped columns with empty values |
| Special characters garbled | Encoding issue — CSV was not UTF-8 |

---

## Frequently Asked Questions

**Q: My API expects JSON but the docs show a different structure than array of objects. How do I figure it out?**
Look at the API's example request body in the documentation. If the example shows `[{"key": "value"}]`, use array of objects. If it shows `{"items": [...]}`, wrap your array in that envelope key.

**Q: Should I use JSON or CSV for API data submission?**
Most modern REST APIs prefer JSON. CSV is still used for bulk file uploads (Salesforce Data Loader, Mailchimp list import, etc.). If the API offers both, JSON is generally more reliable for type handling.

**Q: How do I handle null / empty values in the CSV to JSON conversion?**
Empty CSV cells typically become either `""` (empty string) or `null` in JSON. Which is correct depends on the API. Many APIs treat `""` and `null` differently for required fields. Most quality converters let you choose how to represent empty values.

---

**Convert CSV to JSON in your browser** — array of objects format, type inference for numbers and booleans, nothing uploaded. Try the [free CSV to JSON converter](/tools/csv-to-json).
