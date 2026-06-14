---
title: "Seed Data for Demos: Generating 100k Realistic Rows in Seconds"
slug: "seed-data-demos-100k-rows"
category: "Practical How-To Guides"
primaryKeyword: "generate seed data demos 100k rows"
supportingKeywords: ["demo data generator", "seed database fake data", "generate 100000 rows csv", "bulk fake data generator", "database seed data"]
searchIntent: "informational"
wordCountTarget: 1200
audience: "developer or sales engineer who needs realistic-looking data for a product demo, database seed, or load test — quickly, without writing much code"
status: "published"
seo_title: "Seed Data for Demos: Generate 100k Realistic Rows Fast"
seo_description: "How to generate 100,000+ rows of realistic seed data for demos, database seeding, and load testing. Browser-based tool for no-code, Python Faker for custom schemas."
---

# Seed Data for Demos: Generating 100k Realistic Rows in Seconds

**For demos without code:** Use Sohovi's [test data generator](/tools/test-data-generator) — choose your fields, enter 100,000 as the row count, click Generate. Your CSV is ready to download in seconds.

For custom schemas with relationships (orders linked to customers), use Python Faker (below).

---

## Why 100k Rows Matters for Demos

A demo with 10 rows looks like a toy. A demo with 100,000 rows looks like a real system. When prospective customers are evaluating your product's performance, search speed, or data handling capabilities, realistic data volume is part of the proof.

Similarly, database seed data for development should be large enough that queries, indexes, and pagination work the way they will in production — not just on a 50-row test dataset.

---

## Method 1: Browser Generator (No Code, Up to 100k Rows)

1. Go to [/tools/test-data-generator](/tools/test-data-generator)
2. Add the fields you need:
   - Customer ID (UUID or sequential integer)
   - First name, last name
   - Email
   - Company
   - Phone
   - City, country
   - Signup date (within a 3-year range)
   - Plan tier (from a list: Free, Pro, Enterprise)
3. Set row count: 100,000
4. Click Generate → Download CSV

**Performance:** 100k rows generates in 2–5 seconds in modern browsers.

---

## Method 2: Python Faker (For Custom Schemas and Relationships)

```python
from faker import Faker
import csv
import uuid
import random
from datetime import datetime, timedelta

fake = Faker()
Faker.seed(0)  # reproducible

PLAN_TIERS = ['Free', 'Pro', 'Enterprise']

def generate_customers(n):
    with open('customers.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'first_name', 'last_name', 'email', 'company', 'plan', 'signup_date'])
        for i in range(1, n + 1):
            signup = fake.date_between(start_date='-3y', end_date='today')
            writer.writerow([
                i,
                fake.first_name(),
                fake.last_name(),
                fake.company_email(),
                fake.company(),
                random.choice(PLAN_TIERS),
                signup.isoformat(),
            ])

generate_customers(100_000)
print("Generated customers.csv")
```

**To generate related tables (orders referencing customers):**

```python
def generate_orders(customer_count, orders_per_customer_avg=3):
    with open('orders.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['order_id', 'customer_id', 'amount', 'status', 'order_date'])
        order_id = 1
        for cust_id in range(1, customer_count + 1):
            n_orders = max(0, int(random.gauss(orders_per_customer_avg, 1)))
            for _ in range(n_orders):
                writer.writerow([
                    order_id,
                    cust_id,
                    round(random.uniform(10, 500), 2),
                    random.choice(['completed', 'pending', 'refunded']),
                    fake.date_between(start_date='-2y', end_date='today').isoformat(),
                ])
                order_id += 1
```

---

## Making Demo Data Look Real

For a convincing demo, the data should:

**1. Have realistic distributions, not uniform randomness:**
- 60% US customers, 20% Europe, 20% rest of world (not equal distribution)
- Most customers on Free tier (70%), fewer on Pro (25%), very few on Enterprise (5%)
- Order amounts skewed toward lower values with occasional large orders

**2. Have realistic quality issues:**
- 5% missing phone numbers (optional field, not always provided)
- 2% duplicate email addresses (real systems have this problem)
- Occasional format inconsistencies

**3. Have coherent relationships:**
- Orders reference valid customer IDs
- Signup dates are before first order dates
- Enterprise customers have more orders on average

---

## Frequently Asked Questions

**Q: How do I seed a database with CSV data generated this way?**
For PostgreSQL: `COPY customers FROM '/path/to/customers.csv' CSV HEADER;`
For MySQL: `LOAD DATA INFILE '/path/to/customers.csv' INTO TABLE customers FIELDS TERMINATED BY ',' ENCLOSED BY '"' IGNORE 1 ROWS;`
For SQLite: `.mode csv` then `.import customers.csv customers`
See [How to Bulk-Import a CSV into MySQL, PostgreSQL, and SQLite](/blog/bulk-import-csv-mysql-postgresql-sqlite) for full details.

**Q: Can I generate data in a different format (JSON, SQL)?**
Python Faker can write to any format. For CSV-to-SQL conversion after generation, use the [CSV to SQL generator](/tools/csv-to-sql).

**Q: Is the generated data safe to use in a public demo?**
Yes — it's completely synthetic. No real customer PII is involved. This is specifically the point of generating test data rather than using production data.

---

**Generate your demo dataset in the browser** — 100k rows in seconds, no code, no account. Pick your fields at the [free test data generator](/tools/test-data-generator) and download as CSV.
