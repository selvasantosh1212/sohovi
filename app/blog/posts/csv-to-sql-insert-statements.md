---
title: "CSV to SQL: Generating INSERT Statements Safely (Escaping, Types, NULLs)"
slug: "csv-to-sql-insert-statements"
category: "Practical How-To Guides"
primaryKeyword: "csv to sql insert statements"
supportingKeywords: ["csv to sql", "generate sql from csv", "csv to insert statement", "convert csv to sql", "import csv to database sql"]
searchIntent: "informational"
wordCountTarget: 1400
audience: "developer or analyst who has CSV data and needs to generate SQL INSERT statements to load it into a database — may not be a DBA"
status: "published"
seo_title: "CSV to SQL: Generate Safe INSERT Statements From a CSV File"
seo_description: "How to convert CSV data into SQL INSERT statements safely — handling string escaping, NULL values, data types, and large files. Includes a browser tool and Python method."
---

# CSV to SQL: Generating INSERT Statements Safely (Escaping, Types, NULLs)

**The quick method:** Use Sohovi's [CSV to SQL generator](/tools/csv-to-sql) — upload your CSV, select your database (MySQL, PostgreSQL, or SQLite), and download ready-to-run INSERT statements. All processing is in your browser.

For manual generation or scripting, read on — there are several escaping and type-handling problems that trip people up.

---

## What a CSV-to-SQL Conversion Produces

Given this CSV:
```csv
id,name,email,signup_date
1,John Smith,john@acme.com,2026-01-15
2,Sarah Chen,sarah@tech.io,2026-01-16
```

It should produce:
```sql
INSERT INTO customers (id, name, email, signup_date) VALUES
(1, 'John Smith', 'john@acme.com', '2026-01-15'),
(2, 'Sarah Chen', 'sarah@tech.io', '2026-01-16');
```

Simple in theory. Here's where it goes wrong in practice.

---

## The Three Escaping Problems

### Problem 1: Single Quotes in String Values

If a name contains an apostrophe — "O'Brien" — the naive output is:
```sql
INSERT INTO ... VALUES (3, 'O'Brien', ...)
```

This is a SQL syntax error (and a security vulnerability if the data comes from user input). The correct output escapes the single quote:
```sql
INSERT INTO ... VALUES (3, 'O''Brien', ...)  -- SQL standard (double the apostrophe)
-- or
INSERT INTO ... VALUES (3, 'O\'Brien', ...)  -- MySQL escape
```

**What to do:** Any converter you use must handle apostrophe escaping. Test by running a conversion on a record that contains a single quote.

### Problem 2: Special Characters and Encoding

Accented characters (é, ü, ñ), emoji, and other non-ASCII content must be properly encoded. SQL files should be saved as UTF-8. The `INSERT INTO` script should include a `SET NAMES UTF8;` preamble for MySQL.

**Check:** After importing, verify that records with special characters display correctly — encoding problems are silent during import and only visible when you query the data.

### Problem 3: SQL Injection Risk

If you're generating SQL from user-provided CSV data that will be executed without review, you're creating a SQL injection vector. Apostrophes, comments (`--`), and semicolons in data can terminate and extend the SQL statement.

**Mitigation:** Always review generated SQL before executing, or use parameterized queries instead of string-based INSERT statements.

---

## Handling Data Types

CSV stores everything as text. SQL tables have typed columns. A good converter infers types:

| CSV value | Should become SQL | Not |
|-----------|------------------|-----|
| `42` | `42` (integer) | `'42'` (string) |
| `3.14` | `3.14` (decimal) | `'3.14'` |
| `2026-01-15` | `'2026-01-15'` (date string) | `20260115` |
| `true` | `TRUE` (boolean) | `'true'` |
| *(empty)* | `NULL` | `''` (empty string) |

The empty → NULL handling is particularly important. A required column set to empty string rather than NULL may pass insertion but fail business logic checks downstream.

---

## NULL vs Empty String

Decide before conversion how to handle empty CSV cells:
- `NULL` — the value is unknown/not provided (usually correct for optional fields)
- `''` — the value was provided and is empty (meaningful for some fields, e.g., a notes column)
- A default value — for required fields, fill before import or set a DEFAULT in the schema

Most converters let you choose. Default to NULL unless you have a specific reason for empty string.

---

## For Large Files: Bulk Loading Is Better Than INSERT

For files with more than ~10,000 rows, individual INSERT statements are slow. Use database-native bulk loading instead:

- **MySQL:** `LOAD DATA INFILE 'file.csv' INTO TABLE customers FIELDS TERMINATED BY ','`
- **PostgreSQL:** `COPY customers FROM 'file.csv' CSV HEADER`
- **SQLite:** `.import file.csv customers` (in sqlite3 CLI)

These are 10–100× faster than executing INSERT statements row by row.

---

## Quick Method: Python

```python
import csv, sqlite3

conn = sqlite3.connect('mydb.db')
with open('data.csv') as f:
    reader = csv.DictReader(f)
    for row in reader:
        conn.execute(
            "INSERT INTO customers (name, email) VALUES (?, ?)",
            (row['name'], row['email'])
        )
conn.commit()
```

Using `?` placeholders handles escaping automatically and prevents SQL injection.

---

## Frequently Asked Questions

**Q: What SQL dialect should I choose (MySQL vs PostgreSQL vs SQLite)?**
They differ in: boolean representation (MySQL uses TINYINT, PostgreSQL has native BOOL), date/time handling, and string quoting rules. Choose the dialect that matches your database. Most differences in simple INSERT statements are minor.

**Q: My CSV has 500,000 rows — should I use INSERT statements or bulk load?**
Bulk load. 500k INSERT statements will take minutes to hours to execute sequentially. LOAD DATA INFILE (MySQL) or COPY (PostgreSQL) will complete in seconds.

**Q: Do I need to create the table before importing?**
Yes. CSV-to-SQL tools generate INSERT statements but not CREATE TABLE statements (unless they have a schema inference option). Create the table with appropriate column types first.

---

**Generate SQL INSERT statements from your CSV in your browser** — handles escaping, type inference, and NULL values. Try the [free CSV to SQL generator](/tools/csv-to-sql).
