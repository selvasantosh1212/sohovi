# Data Quality Dimensions & Rule Definitions

This document defines standard Data Quality (DQ) dimensions and their associated rules for implementation in a rule engine.

Each rule should return:
- `score` (0 to 1 or %)
- `failed_records`
- `total_records`

---

## 1. COMPLETENESS

### Definition
Measures whether required data is present.

### Rule Types
- not_null
- not_empty
- mandatory_column
- conditional_not_null

### Additional Cases
- Missing entire records
- Missing reference values
- Truncated data (cut-off values)

### Examples
- email IS NOT NULL
- phone != ""
- IF country = 'India' THEN pincode IS NOT NULL

### Logic
completeness_score = non_null_count / total_rows

---

## 2. ACCURACY

### Definition
Measures whether data correctly represents real-world values.

### Rule Types
- range_check
- reference_lookup
- cross_field_validation
- external_api_validation

### Examples
- age BETWEEN 0 AND 100
- salary > 0
- customer_id EXISTS in master table

### Logic
accuracy_score = valid_records / total_records

---

## 3. CONSISTENCY

### Definition
Measures whether data is consistent across datasets or formats.

### Rule Types
- cross_table_match
- format_standardization
- case_consistency
- historical_consistency

### Examples
- dob_crm = dob_billing
- phone format is standardized
- no sudden change in values over time

### Logic
consistency_score = matched_records / total_compared_records

---

## 4. VALIDITY

### Definition
Measures whether data conforms to defined formats and domains.

### Rule Types
- regex_match
- datatype_check
- enum_validation
- business_rule
- sequence_validation

### Examples
- email matches regex
- date format = YYYY-MM-DD
- gender IN (Male, Female, Other)
- loan_amount <= income * 10
- order_date <= shipping_date

### Logic
validity_score = valid_format_records / total_records

---

## 5. UNIQUENESS

### Definition
Measures whether records are duplicate-free.

### Rule Types
- unique_column
- composite_unique
- duplicate_detection
- fuzzy_matching

### Examples
- customer_id is unique
- (email, phone) combination is unique

### Logic
uniqueness_score = unique_records / total_records

---

## 6. INTEGRITY

### Definition
Measures whether relationships between data are valid.

### Rule Types
- foreign_key_check
- referential_integrity
- parent_child_validation
- cardinality_check

### Examples
- order.customer_id EXISTS in customer table
- no orphan records
- one customer → many orders

### Logic
integrity_score = valid_relationships / total_relationships

---

## 7. TIMELINESS

### Definition
Measures whether data is available within required time.

### Rule Types
- freshness_check
- last_updated_threshold

### Examples
- last_updated < 24 hours
- data updated within SLA window

### Logic
timeliness_score = fresh_records / total_records

---

## 8. CURRENCY

### Definition
Measures whether data reflects the current real-world state.

### Rule Types
- state_freshness_check
- update_frequency_check

### Examples
- customer status updated within last 30 days
- address matches latest known value

### Logic
currency_score = current_records / total_records

---

## 9. CONFORMITY

### Definition
Measures whether data follows standard formats and data types.

### Rule Types
- format_check
- datatype_enforcement
- standardization_check

### Examples
- date format is YYYY-MM-DD
- phone numbers follow same pattern
- numeric column contains only numbers

### Logic
conformity_score = conforming_records / total_records

---

## 10. PRECISION (Optional)

### Definition
Measures the level of exactness or granularity of data.

### Rule Types
- decimal_precision_check
- rounding_validation

### Examples
- currency values have 2 decimal places
- timestamps include seconds

### Logic
precision_score = precise_records / total_records

---

## STANDARD RULE CONFIG FORMAT

{
  "dataset": "string",
  "column": "string",
  "dimension": "completeness | accuracy | consistency | validity | uniqueness | integrity | timeliness | currency | conformity | precision",
  "rule_type": "string",
  "parameters": {},
  "threshold": 0.0
}

---

## SAMPLE RULES

[
  {
    "dataset": "customer.csv",
    "column": "email",
    "dimension": "completeness",
    "rule_type": "not_null",
    "threshold": 0.95
  },
  {
    "dataset": "customer.csv",
    "column": "email",
    "dimension": "validity",
    "rule_type": "regex_match",
    "parameters": {
      "pattern": "^[^@]+@[^@]+\\.[^@]+$"
    }
  },
  {
    "dataset": "customer.csv",
    "column": "customer_id",
    "dimension": "uniqueness",
    "rule_type": "unique_column"
  }
]

---

## RULE EXECUTION GUIDELINES

### Null Handling
- NULL, NaN → treated as null
- Empty string "" → treated as null
- Strings with only whitespace → treated as null

---

### Data Type Inference

Each column should be auto-classified into:
- integer
- float
- string
- boolean
- date
- email
- phone

### Example Logic
- If 95% values match numeric → numeric
- If values match email regex → email
- If date parsing success > 90% → date

---

### RULE EVALUATION

Each rule should return:
- score (0 to 1)
- status (pass / fail)
- threshold_applied (true/false)

### Pass Condition

if score >= threshold:
    status = "pass"
else:
    status = "fail"

---

### OUTPUT EXTENDED FORMAT

{
  "dimension": "validity",
  "column": "email",
  "rule_type": "regex_match",
  "score": 0.87,
  "threshold": 0.9,
  "status": "fail",
  "severity": "high",
  "total_records": 1000,
  "failed_records": 130,
  "failed_indices": [1, 5, 23],
  "message": "Invalid email format detected"
}

---

### SEVERITY LOGIC

- score >= 0.95 → low
- 0.80 <= score < 0.95 → medium
- score < 0.80 → high

---

### AUTO RULE GENERATION

Rules should be auto-suggested based on column name and datatype:

- column contains "email" → not_null, regex_match
- column contains "id" → uniqueness
- numeric column → range_check
- date column → validity, timeliness

---

### RULE PRIORITY

Execution order:
1. completeness
2. validity
3. accuracy
4. uniqueness
5. consistency
6. integrity

---

### EDGE CASES

- Mixed datatype columns → low validity
- Columns with >50% nulls → critical
- Duplicate column names → auto-rename

---

## EXTENSIONS (FOR FUTURE)

- AI-based anomaly detection
- Auto rule suggestion
- Natural language to rule conversion
- Data fixing recommendations

---

## NOTES

- Scores normalized between 0 and 1
- Rules modular and composable
- Support column-level and dataset-level rules
- Ensure scalability
