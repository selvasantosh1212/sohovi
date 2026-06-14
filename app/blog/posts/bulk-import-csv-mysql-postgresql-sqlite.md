---
title: "How to Bulk-Import a CSV into MySQL, PostgreSQL, and SQLite"
slug: "bulk-import-csv-mysql-postgresql-sqlite"
category: "Practical How-To Guides"
primaryKeyword: "bulk import csv mysql postgresql sqlite"
supportingKeywords: ["import csv mysql", "load csv postgresql", "sqlite import csv", "csv to database", "load data infile csv"]
searchIntent: "informational"
wordCountTarget: 1500
audience: "developer or analyst who needs to get CSV data into a SQL database quickly — knows the basics of SQL but isn't a DBA"
status: "published"
seo_title: "How to Bulk-Import a CSV into MySQL, PostgreSQL, and SQLite"
seo_description: "Step-by-step commands for bulk-loading CSV files into MySQL (LOAD DATA INFILE), PostgreSQL (COPY), and SQLite (.import). Each method with the common gotchas that cause failures."
---

# How to Bulk-Import a CSV into MySQL, PostgreSQL, and SQLite

**The fast path by database:**
- **MySQL:** `LOAD DATA INFILE 'file.csv' INTO TABLE tablename FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;`
- **PostgreSQL:** `COPY tablename FROM '/path/to/file.csv' CSV HEADER;`
- **SQLite:** Open sqlite3, run `.mode csv` then `.import file.csv tablename`

Each has specific gotchas that cause silent failures. Read the section for your database.

---

## Before You Import: Clean the CSV

Every database has strict expectations. Problems that cause partial imports or silent errors:

- **Encoding:** Your CSV must be UTF-8 (or match the database's encoding)
- **Line endings:** Windows CSVs use `\r\n`; Unix/Mac use `\n`. Mismatches cause issues.
- **Dates:** Databases expect a specific date format (usually YYYY-MM-DD). Mixed formats cause type errors.
- **NULL values:** Empty cells in CSV may become empty strings rather than NULL — problematic for required columns with NOT NULL constraints.
- **Quotes:** Fields containing commas must be enclosed in double quotes. Fields containing double quotes must escape them by doubling (`""` becomes one quote).

Profile your CSV before importing to catch these issues. See [Data Cleaning: The Complete 8-Step Process](/blog/data-cleaning-complete-process).

---

## MySQL: LOAD DATA INFILE

**Full command:**
```sql
LOAD DATA INFILE '/path/to/file.csv'
INTO TABLE customers
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, name, email, signup_date);
```

**Breaking down the options:**
- `FIELDS TERMINATED BY ','` — comma-delimited (change to `\t` for tab-delimited)
- `ENCLOSED BY '"'` — fields surrounded by double quotes
- `LINES TERMINATED BY '\n'` — use `'\r\n'` for Windows-formatted files
- `IGNORE 1 ROWS` — skip the header row
- Column list at the end — lets you skip CSV columns or reorder them

**Common errors:**
- `ERROR 1290: LOAD DATA INFILE disabled` → your MySQL has `--secure-file-priv` enabled. Either use `LOAD DATA LOCAL INFILE` (client-side load) or move the file to the allowed directory.
- `ERROR 1292: Incorrect date value` → your CSV date format doesn't match MySQL's expected format. Standardize dates to YYYY-MM-DD before import.
- Silent row drops → check `SHOW WARNINGS;` after the import to see which rows were skipped and why.

---

## PostgreSQL: COPY Command

**From psql:**
```sql
COPY customers (id, name, email, signup_date)
FROM '/path/to/file.csv'
CSV HEADER
DELIMITER ','
NULL '';
```

**Options:**
- `CSV HEADER` — tells PostgreSQL to skip the first row and use it as column names
- `DELIMITER ','` — the separator (default for CSV is comma)
- `NULL ''` — treat empty strings as NULL (adjust if empty string is meaningful in your data)

**If you don't have direct file system access (e.g., a remote database):**
```sql
\COPY customers FROM '/local/path/file.csv' CSV HEADER;
```
`\COPY` reads from the client machine rather than the server. Note the backslash — it's a psql meta-command, not SQL.

**Common errors:**
- `ERROR: extra data after last expected column` → your CSV has more columns than your table, or a field contains an unescaped comma.
- `ERROR: invalid input syntax for type integer` → a numeric column has a non-numeric value (check for headers in data rows, "N/A" in numeric fields).
- `ERROR: value too long for type character varying(n)` → a string value exceeds the column's max length. Check your longest values before import.

---

## SQLite: .import Command

**In the sqlite3 CLI:**
```bash
sqlite3 mydb.db
```
```sql
.mode csv
.headers on
.import /path/to/file.csv customers
```

**Or as a one-liner:**
```bash
sqlite3 mydb.db -cmd ".mode csv" -cmd ".import file.csv customers" ".quit"
```

**Notes:**
- `.mode csv` sets the import mode to CSV
- If the table doesn't exist, SQLite creates it automatically based on the CSV headers (all columns as TEXT type)
- If the table exists, the CSV must match its schema exactly (column count and order)

**Common issues:**
- All imported data is TEXT type if SQLite creates the table automatically. Cast as needed in queries: `CAST(age AS INTEGER)`.
- The first row is treated as data, not headers, unless you handle it — SQLite doesn't have an `IGNORE HEADER` option. Either delete the header row first or use Python for smarter import.

**Python alternative for SQLite (handles types):**
```python
import csv, sqlite3

conn = sqlite3.connect('mydb.db')
with open('data.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        conn.execute("INSERT INTO customers VALUES (?, ?, ?)",
                     (row['id'], row['name'], row['email']))
conn.commit()
```

---

## After Import: Validate Your Row Count

Always verify the import completed correctly:

```sql
-- Check row count
SELECT COUNT(*) FROM customers;

-- Compare with the CSV line count (subtract 1 for the header)
-- If counts don't match, check SHOW WARNINGS; (MySQL) or review error output
```

---

## Frequently Asked Questions

**Q: My CSV is 5GB — will LOAD DATA INFILE handle it?**
Yes — database bulk loaders are designed for large files. LOAD DATA INFILE and COPY stream the file rather than loading it all into memory. Performance depends on disk speed and table indexes (disable indexes before bulk load, rebuild after, for best performance).

**Q: Should I disable foreign key checks before bulk import?**
If you're importing tables with foreign key relationships, yes — disable foreign key checks to allow importing in any order, then re-enable and verify referential integrity:
- MySQL: `SET FOREIGN_KEY_CHECKS=0;` before, `SET FOREIGN_KEY_CHECKS=1;` after
- PostgreSQL: `SET session_replication_role = replica;` before import

**Q: What's the fastest import method for PostgreSQL?**
`COPY` is the fastest native method. For extremely large imports, consider using `pg_bulkload` (a separate tool) which bypasses WAL logging and achieves even faster throughput.

---

**Clean your CSV before importing** — profile it free in Sohovi to catch encoding issues, date format mismatches, and NULL problems before they cause silent import failures.
