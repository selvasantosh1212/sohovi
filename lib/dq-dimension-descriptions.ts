/** One-line explanations for each DQ dimension, used in tooltips. */
export const DQ_DIMENSION_DESCRIPTIONS: Record<string, string> = {
  completeness: "Are all required values present? Measures null and missing data.",
  accuracy:     "Does data correctly represent reality? Checks ranges and reference values.",
  consistency:  "Is data consistent across fields and formats?",
  validity:     "Does data conform to expected formats, types, and business rules?",
  uniqueness:   "Are records free of duplicates? Checks for duplicate IDs or rows.",
  integrity:    "Are relationships between records valid? Checks referential constraints.",
  timeliness:   "Is data up-to-date within the required time window?",
  currency:     "Does data reflect the current real-world state?",
  conformity:   "Does data follow standard formats and data types?",
  precision:    "Is data granular enough? Checks decimal places and exactness.",
};
