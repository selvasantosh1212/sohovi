export interface RuleExample {
  title: string;
  description: string;
  passingExamples: string[];
  failingExamples: string[];
  businessImpact: string;
  whenToUse: string;
  recommendedThreshold: number;
}

export const DQ_RULE_EXAMPLES: Record<string, Record<string, RuleExample>> = {
  completeness: {
    not_null: {
      title: "No Missing Values",
      description: "Every row must have a value in this column — nulls are not allowed.",
      passingExamples: ["john@example.com", "2024-01-15", "42"],
      failingExamples: ["(null)", "(empty cell)", "(missing)"],
      businessImpact: "Null values in required fields cause join failures, broken pipelines, and missing reports.",
      whenToUse: "Apply to any key identifier, required field, or column that drives downstream calculations.",
      recommendedThreshold: 95,
    },
    not_empty: {
      title: "No Empty Strings",
      description: "Values must not be blank strings — whitespace-only values count as empty.",
      passingExamples: ["Active", "John Smith", "USD"],
      failingExamples: ['""', '"   "', '" "'],
      businessImpact: "Empty strings cause silent failures in APIs and filter logic that doesn't check for whitespace.",
      whenToUse: "Use when source systems write empty strings instead of nulls.",
      recommendedThreshold: 95,
    },
    mandatory_column: {
      title: "Column Must Contain Data",
      description: "The column must be present in the dataset and contain at least one non-null value.",
      passingExamples: ["10,000 rows all populated", "Column exists with values"],
      failingExamples: ["Column exists but all rows are null", "Column entirely empty"],
      businessImpact: "Missing mandatory columns break scheduled jobs and violate data contracts.",
      whenToUse: "Use in automated pipeline validation to detect schema deletions or mapping failures.",
      recommendedThreshold: 100,
    },
    conditional_not_null: {
      title: "Required When Condition Met",
      description: "This column must have a value when another column equals a specified value.",
      passingExamples: ["country=India → pincode=560001", "status=shipped → tracking=1Z999AA"],
      failingExamples: ["country=India → pincode=null", "status=shipped → tracking=null"],
      businessImpact: "Missing context-dependent fields cause incorrect regional calculations and compliance gaps.",
      whenToUse: "Use when a field is mandatory only for a subset — e.g. VAT number required for EU customers.",
      recommendedThreshold: 95,
    },
  },

  validity: {
    regex_match: {
      title: "Pattern Match Validation",
      description: "Every value must match the specified regular expression pattern.",
      passingExamples: ["user@company.com", "INV-2024-001", "+1-800-555-0100"],
      failingExamples: ["not-an-email", "INV2024", "abc123"],
      businessImpact: "Invalid formats cascade into API errors, failed lookups, and undeliverable communications.",
      whenToUse: "Use for any field with a fixed format — emails, IDs, phone numbers, invoice codes.",
      recommendedThreshold: 95,
    },
    enum_validation: {
      title: "Allowed Values Only",
      description: "Values must belong to a predefined set — no unexpected categories.",
      passingExamples: ["Active", "Inactive", "Pending"],
      failingExamples: ["active", "ACTIVE", "Unknown"],
      businessImpact: "Out-of-range enum values break BI dashboards, segmentation logic, and reporting filters.",
      whenToUse: "Use for status, category, gender, region, or any controlled vocabulary column.",
      recommendedThreshold: 99,
    },
    datatype_check: {
      title: "Type Conformance",
      description: "Every value must be parseable as the specified data type.",
      passingExamples: ["42", "3.14", "2024-01-15"],
      failingExamples: ["N/A", "unknown", "TBD"],
      businessImpact: "Wrong data types cause type-cast errors and silently incorrect aggregations.",
      whenToUse: "Use when CSV source data has string values that should be numeric or date.",
      recommendedThreshold: 95,
    },
    sequence_validation: {
      title: "Column A Must Precede Column B",
      description: "Values in this column must be ≤ values in a second column (e.g. start_date ≤ end_date).",
      passingExamples: ["order_date=2024-01-10, ship_date=2024-01-15", "start=100, end=200"],
      failingExamples: ["order_date=2024-02-01, ship_date=2024-01-01", "start=500, end=100"],
      businessImpact: "Reversed date sequences expose data entry errors and invalid SLA calculations.",
      whenToUse: "Use whenever two columns have a natural ordering: created_at ≤ updated_at, start ≤ end.",
      recommendedThreshold: 99,
    },
  },

  accuracy: {
    range_check: {
      title: "Values Within Expected Range",
      description: "Numeric values must fall within a minimum and maximum bound.",
      passingExamples: ["35", "29.99", "87"],
      failingExamples: ["-5", "99999999", "150"],
      businessImpact: "Out-of-range values indicate data entry errors or unit mismatches that corrupt aggregate stats.",
      whenToUse: "Use for any numeric column with known domain bounds — ages, prices, scores, percentages.",
      recommendedThreshold: 95,
    },
    positive_check: {
      title: "Values Must Be Positive",
      description: "All numeric values must be greater than zero.",
      passingExamples: ["1", "0.50", "1000.00"],
      failingExamples: ["0", "-1", "-500.00"],
      businessImpact: "Negative amounts in financial columns cause reversed ledger entries and erroneous refunds.",
      whenToUse: "Use for revenue, quantity, price, and any metric that should never be zero or negative.",
      recommendedThreshold: 95,
    },
    cross_field_comparison: {
      title: "Cross-Column Comparison",
      description: "Values in this column must satisfy a relational condition against another column.",
      passingExamples: ["sale_price=80 ≤ list_price=100", "discount=10 < total=200"],
      failingExamples: ["sale_price=120 > list_price=100", "refund=500 > order_total=300"],
      businessImpact: "Violated cross-field constraints expose calculation errors that surface as pricing or reporting anomalies.",
      whenToUse: "Use when two columns have a logical constraint: discount ≤ price, end_date > start_date.",
      recommendedThreshold: 99,
    },
  },

  uniqueness: {
    unique_column: {
      title: "All Values Are Unique",
      description: "Every non-null value in this column must appear exactly once.",
      passingExamples: ["1001", "1002", "1003"],
      failingExamples: ["1001 (appears twice)", "1001 (appears 3×)", "ORD-2024 (duplicate)"],
      businessImpact: "Duplicate IDs break primary key constraints, cause double-counting in reports, and corrupt joins.",
      whenToUse: "Use on any column that acts as a primary or natural key: customer_id, order_id, email.",
      recommendedThreshold: 100,
    },
    duplicate_detection: {
      title: "Detect Duplicate Rows",
      description: "Identifies rows with repeated values — reports count of non-unique entries.",
      passingExamples: ["All values distinct in column"],
      failingExamples: ['"John Smith" appearing 47×', '"john@x.com" appearing 12×'],
      businessImpact: "Duplicate records inflate metrics, skew customer counts, and risk GDPR violations.",
      whenToUse: "Use on name or identifier columns where duplicates are possible but undesirable.",
      recommendedThreshold: 95,
    },
  },

  consistency: {
    format_standardization: {
      title: "Consistent Format Across Column",
      description: "All values should follow the same structural pattern — no mixed formats.",
      passingExamples: ["+1-555-123-4567", "+1-800-555-0100", "+1-212-555-9876"],
      failingExamples: ["555-1234", "(555) 1234", "+15551234"],
      businessImpact: "Mixed formats break regex filters, prevent accurate deduplication, and cause integration failures.",
      whenToUse: "Use on phone, date, or code columns where format is meant to be uniform.",
      recommendedThreshold: 90,
    },
    case_consistency: {
      title: "Consistent Letter Case",
      description: "All values must follow the specified case convention: UPPER, lower, or Title Case.",
      passingExamples: ["Active", "Inactive", "Pending"],
      failingExamples: ["active", "ACTIVE", "PENDING"],
      businessImpact: "Case inconsistencies cause GROUP BY counts to split identical categories and break string comparisons.",
      whenToUse: "Use for status, category, name, and any column that feeds into case-sensitive logic.",
      recommendedThreshold: 90,
    },
    cross_column_match: {
      title: "Two Columns Must Match",
      description: "Every value in this column must equal the corresponding value in a second column.",
      passingExamples: ["billing_email == shipping_email", "id_col_a == id_col_b"],
      failingExamples: ["billing_email=a@x.com ≠ shipping_email=b@y.com"],
      businessImpact: "Mismatches between linked columns indicate data sync failures or incorrect record merges.",
      whenToUse: "Use when two columns should always be in sync — same customer ID in two joined tables.",
      recommendedThreshold: 95,
    },
  },

  integrity: {
    no_orphan_values: {
      title: "No Orphan References",
      description: "Every value in this column must exist in a reference column elsewhere in the dataset.",
      passingExamples: ["order.customer_id=101 → customer.id=101 ✓"],
      failingExamples: ["order.customer_id=999 → not found in customer.id"],
      businessImpact: "Orphan references cause broken joins, missing records in reports, and BI tool errors.",
      whenToUse: "Use when this column is a foreign key pointing to another column in the same file.",
      recommendedThreshold: 99,
    },
    referential_integrity: {
      title: "Referential Integrity Check",
      description: "Validates that all foreign key values resolve to existing parent records.",
      passingExamples: ["All product_id values in orders exist in products"],
      failingExamples: ["product_id=XYZ-999 → not in products list"],
      businessImpact: "Broken referential integrity produces NULL-joined rows in queries and inflates error counts silently.",
      whenToUse: "Use for any column representing a relationship to another entity in the same dataset.",
      recommendedThreshold: 99,
    },
  },

  timeliness: {
    freshness_check: {
      title: "Data Is Recent Enough",
      description: "Dates in this column must be within the specified number of days from today.",
      passingExamples: ["last_updated=2026-04-17 (2 days ago)", "sync_date=2026-04-15 (4 days ago)"],
      failingExamples: ["last_updated=2025-01-01 (474 days ago)", "sync_date=2024-06-30 (stale)"],
      businessImpact: "Stale dates in transaction columns indicate data pipeline failures or missed syncs.",
      whenToUse: "Use on last_updated, transaction_date, or record_as_of columns that must reflect current data.",
      recommendedThreshold: 90,
    },
    not_future_date: {
      title: "No Future Dates",
      description: "All date values must be on or before today — future dates are invalid.",
      passingExamples: ["dob=1990-05-20", "created_at=2026-04-18", "hire_date=2023-09-01"],
      failingExamples: ["dob=2099-01-01", "order_date=2027-06-15", "hire_date=2030-01-01"],
      businessImpact: "Future dates in historical fields corrupt time-series analyses and cause financial period miscalculations.",
      whenToUse: "Use on birth dates, transaction dates, or any field representing a past event.",
      recommendedThreshold: 99,
    },
  },

  currency: {
    recent_update: {
      title: "Record Was Recently Updated",
      description: "Timestamps indicate the record was modified within the allowed window.",
      passingExamples: ["updated_at=2026-04-15 (4 days ago)", "modified=2026-04-10 (9 days ago)"],
      failingExamples: ["updated_at=2025-10-01 (200 days ago)", "modified=2024-01-01 (stale)"],
      businessImpact: "Records not updated recently may reflect stale status — inactive customers, outdated pricing.",
      whenToUse: "Use on updated_at, sync_date, or status_as_of columns to enforce data freshness SLAs.",
      recommendedThreshold: 80,
    },
    not_stale: {
      title: "Data Reflects Current State",
      description: "Each record's timestamp must be within the maximum allowed age.",
      passingExamples: ["price_updated=2026-04-01 (18 days ago)"],
      failingExamples: ["price_updated=2024-01-01 (839 days ago)", "inventory_as_of=2023-12-31"],
      businessImpact: "Stale records serving as current-state data cause incorrect pricing and customer-facing errors.",
      whenToUse: "Use on master data tables (products, customers, configs) where staleness has direct operational impact.",
      recommendedThreshold: 85,
    },
  },

  conformity: {
    format_check: {
      title: "Matches Standard Template",
      description: "Values must match a known format template such as email, phone, date_iso, or uuid.",
      passingExamples: ["2024-01-15 (date_iso)", "user@co.com (email)", "550e8400-e29b-41d4-a716 (uuid)"],
      failingExamples: ["15-01-2024 (wrong format)", "user@co (invalid email)", "not-a-uuid"],
      businessImpact: "Non-conforming formats cause integration failures, API rejections, and ETL parse errors.",
      whenToUse: "Use when the column must conform to a well-known standard format registered in the template library.",
      recommendedThreshold: 95,
    },
    datatype_enforcement: {
      title: "Column Must Contain Specific Type",
      description: "All non-null values must be parseable as the declared type (numeric, date, or boolean).",
      passingExamples: ["29.99", "0", "1000"],
      failingExamples: ["N/A", "pending", "#REF!"],
      businessImpact: "Type violations cause silent coercion errors in downstream systems — especially dangerous in numeric columns.",
      whenToUse: "Use for any column that should hold a single type but receives string contamination from source systems.",
      recommendedThreshold: 95,
    },
  },

  precision: {
    decimal_places: {
      title: "Correct Number of Decimal Places",
      description: "Numeric values must not exceed the specified number of decimal places.",
      passingExamples: ["29.99", "100.00", "0.50"],
      failingExamples: ["29.999", "100.12345", "0.501"],
      businessImpact: "Extra decimal places in financial data cause rounding discrepancies and mismatches with accounting systems.",
      whenToUse: "Use on currency, price, tax, or percentage columns where precision is contractually defined.",
      recommendedThreshold: 95,
    },
    rounding_check: {
      title: "Values Are Properly Rounded",
      description: "Each value must equal its own value rounded to the specified decimal places.",
      passingExamples: ["2.50", "100.00", "0.99"],
      failingExamples: ["2.501", "99.995", "0.9999"],
      businessImpact: "Unrounded values cause totals not to add up, break invoice generation, and fail regulatory reporting.",
      whenToUse: "Use on amount columns in finance where the source system exports raw floating-point precision.",
      recommendedThreshold: 99,
    },
  },
};

export function getRuleExample(dimension: string, ruleType: string): RuleExample | null {
  return DQ_RULE_EXAMPLES[dimension]?.[ruleType] ?? null;
}
