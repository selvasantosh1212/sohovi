---
title: "How to Split One Huge CSV into Smaller Files (Without Excel)"
slug: "split-large-csv-into-smaller-files"
category: "Practical How-To Guides"
primaryKeyword: "split large csv into smaller files"
supportingKeywords: ["split csv file", "break large csv", "divide csv into parts", "csv file too large split", "split csv by rows"]
searchIntent: "informational"
wordCountTarget: 1300
audience: "someone with a CSV that's too large to open in Excel or too large to upload to a service — needs to break it into chunks"
status: "published"
seo_title: "How to Split a Large CSV Into Smaller Files (Command Line + Python)"
seo_description: "When a CSV is too large for Excel or a service upload limit, split it into smaller chunks. Three methods: command-line split, Python, and browser-based column picker."
---

# How to Split One Huge CSV into Smaller Files (Without Excel)

**The fastest method for Mac/Linux:** `split -l 10000 data.csv chunk_ && for f in chunk_*; do (head -1 data.csv && cat $f) > $f.csv; done`

This splits the file into 10,000-row chunks and adds the header row to each chunk. On Windows, use Python (below).

---

## Why You'd Need to Split a CSV

- **Excel's row limit:** Excel can't open files with more than 1,048,576 rows
- **Upload limits:** Many tools (SaaS apps, email marketing platforms) have file size or row limits
- **Performance:** Processing one 5-million-row file is slower than processing five 1-million-row files in parallel
- **Segmentation:** Split a customer list by geographic region, date range, or value tier

---

## Method 1: Linux / Mac Command Line

```bash
# Split into files of 10,000 rows each (no header in chunks)
split -l 10000 data.csv chunk_

# Add the header to each chunk file
header=$(head -1 data.csv)
for f in chunk_*; do
    { echo "$header"; cat "$f"; } > "${f}.csv"
    rm "$f"
done
```

**Result:** Files named `chunk_aa.csv`, `chunk_ab.csv`, etc., each with 10,000 data rows plus the header.

**Adjust chunk size:** Change `10000` to whatever row count fits your use case.

---

## Method 2: Python (Best for Windows and Customization)

```python
import csv
import os

def split_csv(input_file, rows_per_file=10000):
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        
        file_count = 1
        current_rows = 0
        output = None
        writer = None
        
        for row in reader:
            if current_rows == 0:
                if output:
                    output.close()
                filename = f'chunk_{file_count:04d}.csv'
                output = open(filename, 'w', newline='', encoding='utf-8')
                writer = csv.writer(output)
                writer.writerow(header)  # write header to each chunk
                file_count += 1
            
            writer.writerow(row)
            current_rows += 1
            
            if current_rows >= rows_per_file:
                current_rows = 0
        
        if output:
            output.close()

split_csv('data.csv', rows_per_file=50000)
```

**Output:** `chunk_0001.csv`, `chunk_0002.csv`, etc., each with 50,000 rows plus the header.

---

## Method 3: Split by Column Value (Segmentation, Not Just Size)

Sometimes you want to split by a column value — separate files per country, per product category, per sales region:

```python
import csv
from collections import defaultdict

with open('customers.csv') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    files = {}
    writers = {}
    
    for row in reader:
        segment = row['country'].replace(' ', '_')  # use country column as segment
        if segment not in files:
            files[segment] = open(f'{segment}.csv', 'w', newline='')
            writers[segment] = csv.DictWriter(files[segment], fieldnames=fieldnames)
            writers[segment].writeheader()
        writers[segment].writerow(row)

for f in files.values():
    f.close()
```

**Output:** One CSV per unique country value — `US.csv`, `UK.csv`, `IN.csv`, etc.

---

## Handling the Header Row (The Most Common Mistake)

The most common problem when splitting CSVs: the header row appears only in the first chunk, so subsequent chunks start with data rows but no column names. This breaks any tool that expects a header.

Always add the header explicitly to each chunk. The Python script above handles this correctly. The command-line approach above also handles it with the `echo "$header"` step.

---

## Frequently Asked Questions

**Q: What's the best chunk size?**
It depends on your use case: for Excel (1M row limit), keep chunks under 900,000 rows. For upload tools with file size limits, calculate: max_MB / average_row_size_KB. For parallel processing, match chunk count to available CPU cores.

**Q: Does splitting affect the data inside the chunks?**
No — splitting is purely positional. Data values are untouched. The only "data quality" consideration is making sure the header row appears in every chunk.

**Q: How do I reassemble the chunks after processing?**
On Mac/Linux: `cat chunk_*.csv | awk 'FNR==1 && NR!=1 {next} 1' > reassembled.csv` (skips header on all but the first file). In Python: reverse the split script, reading each chunk and writing to a combined output, skipping headers after the first.

---

**For CSV files that are too large to work with in your browser** — split them first using the methods above, then process each chunk individually in Sohovi's [free CSV column picker](/tools/csv-columns) to select, reorder, or rename columns before further processing.
