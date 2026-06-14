---
title: "How to Put a CSV Table into GitHub README or Notion"
slug: "csv-to-markdown-github-notion"
category: "Practical How-To Guides"
primaryKeyword: "csv to markdown table github notion"
supportingKeywords: ["csv to markdown", "csv table github readme", "excel to markdown table", "spreadsheet to notion table", "csv to markdown converter"]
searchIntent: "informational"
wordCountTarget: 1200
audience: "developer or analyst who has a spreadsheet or CSV they want to embed in documentation — GitHub README, Notion page, or a wiki"
status: "published"
seo_title: "How to Convert a CSV to a Markdown Table for GitHub or Notion"
seo_description: "Copy a CSV into a Markdown table for GitHub READMEs or Notion pages — three methods: browser converter, Python one-liner, and Pandoc. Each with the exact command."
---

# How to Put a CSV Table into GitHub README or Notion

**Fastest method:** Use Sohovi's [CSV to Markdown converter](/tools/csv-to-markdown) — paste your CSV or upload the file, and get GitHub-compatible Markdown table syntax in seconds. Copy and paste into your README or Notion page.

---

## What Markdown Table Syntax Looks Like

This CSV:
```csv
Name,Role,Status
John Smith,Engineer,Active
Sarah Chen,Designer,Active
James Park,PM,On leave
```

Becomes this Markdown:
```markdown
| Name | Role | Status |
|------|------|--------|
| John Smith | Engineer | Active |
| Sarah Chen | Designer | Active |
| James Park | PM | On leave |
```

Which renders as:

| Name | Role | Status |
|------|------|--------|
| John Smith | Engineer | Active |
| Sarah Chen | Designer | Active |
| James Park | PM | On leave |

---

## Method 1: Browser Converter (Fastest)

1. Go to Sohovi's [CSV to Markdown tool](/tools/csv-to-markdown)
2. Paste your CSV text or upload the file
3. Copy the Markdown output
4. Paste into your GitHub README or Notion page

For Notion: paste the Markdown into any text block and Notion automatically renders it as a table. For GitHub: paste into the `.md` file — the table renders in the GitHub preview.

---

## Method 2: Python One-Liner

```python
import csv, sys

def csv_to_md(filename):
    with open(filename) as f:
        rows = list(csv.reader(f))
    if not rows: return
    header = rows[0]
    print('| ' + ' | '.join(header) + ' |')
    print('|' + '|'.join(['---'] * len(header)) + '|')
    for row in rows[1:]:
        print('| ' + ' | '.join(row) + ' |')

csv_to_md(sys.argv[1])
```

Save as `csv_to_md.py` and run: `python csv_to_md.py data.csv`

---

## Method 3: Pandoc (Command Line)

If you have Pandoc installed:
```bash
pandoc -f csv -t markdown data.csv
```

---

## Notion-Specific Notes

Notion supports Markdown paste but has some nuances:
- Paste into a text block, not a database or table block
- Notion renders standard Markdown table syntax automatically
- If the table isn't rendering, try pressing Escape after pasting and then Enter — sometimes Notion needs a nudge to switch modes

For large tables in Notion, consider using a Notion Database instead of a Markdown table — databases are searchable, filterable, and easier to update.

---

## GitHub README Notes

GitHub Flavored Markdown (GFM) supports tables with the standard `|` syntax. Tips:
- Alignment options: `|:---|` (left), `|:---:|` (center), `|---:|` (right) in the separator row
- Tables with many columns can be hard to read in raw markdown — that's OK, GitHub renders them nicely
- For large datasets in READMEs, consider linking to a CSV file rather than embedding the full table

---

## Frequently Asked Questions

**Q: Is there a maximum table size for GitHub Markdown?**
No hard limit, but very large tables (100+ rows) make the raw `.md` file unwieldy. For large datasets, link to the CSV file and show a truncated preview table in the README.

**Q: Can I paste an Excel table directly into Notion without converting?**
Yes — select cells in Excel, copy (Ctrl+C), click in a Notion page, and paste. Notion accepts tab-delimited clipboard data from Excel and creates a table. This is often faster than the CSV-to-Markdown route for Notion specifically.

**Q: Why does my Markdown table look wrong in GitHub?**
Common causes: missing blank line before the table, pipes at the start/end of rows are required, separator row must have at least 3 dashes (`---`), and empty cells need a space between pipes (`|  |`).

---

**Convert your CSV to a Markdown table in seconds** — paste it into your GitHub README or Notion page directly. Try the [free CSV to Markdown tool](/tools/csv-to-markdown).
