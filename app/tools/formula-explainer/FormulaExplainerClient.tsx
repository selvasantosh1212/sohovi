"use client";

import { useState } from "react";
import { HardCTA } from "@/components/tools/HardCTA";
import { SoftCTA } from "@/components/tools/SoftCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import { Lightbulb, AlertCircle, BookOpen } from "lucide-react";

interface FunctionDoc {
  name: string;
  signature: string;
  description: string;
  args: { name: string; desc: string }[];
  example: string;
  exampleResult: string;
  tips?: string[];
  category: string;
}

const FUNCTION_DOCS: Record<string, FunctionDoc> = {
  VLOOKUP: {
    name: "VLOOKUP", category: "Lookup",
    signature: "VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])",
    description: "Looks up a value in the leftmost column of a table and returns a value in the same row from a column you specify. The 'V' stands for Vertical.",
    args: [
      { name: "lookup_value", desc: "The value you want to find (e.g. a customer ID, product name)." },
      { name: "table_array", desc: "The range of cells that contains the data. The first column is searched." },
      { name: "col_index_num", desc: "The column number in the table to return a value from (1 = first column, 2 = second, etc.)." },
      { name: "range_lookup", desc: "FALSE or 0 = exact match (most common). TRUE or 1 = approximate match (requires sorted data)." },
    ],
    example: "=VLOOKUP(A2, B:D, 3, FALSE)",
    exampleResult: "Finds the value in A2 within column B, then returns the corresponding value from column D (3rd column of the range B:D).",
    tips: ["Always use FALSE as the last argument unless you specifically need approximate matching.", "VLOOKUP can only look to the right. For left-side lookups, use INDEX/MATCH instead.", "If you get #N/A errors, the value wasn't found. Wrap in IFERROR to handle gracefully."],
  },
  HLOOKUP: {
    name: "HLOOKUP", category: "Lookup",
    signature: "HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])",
    description: "Like VLOOKUP but searches horizontally — across the top row of a table and returns a value from the same column in a specified row.",
    args: [
      { name: "lookup_value", desc: "The value to find in the first row of the table." },
      { name: "table_array", desc: "The range of cells containing the data." },
      { name: "row_index_num", desc: "The row number in the table to return a value from." },
      { name: "range_lookup", desc: "FALSE = exact match (recommended). TRUE = approximate match." },
    ],
    example: "=HLOOKUP(\"Q1\", A1:E5, 3, FALSE)",
    exampleResult: "Finds 'Q1' in row 1, then returns the value from row 3 in the same column.",
    tips: ["Use for tables where categories are in the top row and values are in rows below.", "For most modern use cases, prefer INDEX/MATCH — more flexible."],
  },
  IF: {
    name: "IF", category: "Logical",
    signature: "IF(logical_test, value_if_true, [value_if_false])",
    description: "Tests a condition. Returns one value if the condition is true, and another value if it's false. The foundation of most conditional logic in spreadsheets.",
    args: [
      { name: "logical_test", desc: "A condition that evaluates to TRUE or FALSE (e.g. A1>100, B2=\"Yes\")." },
      { name: "value_if_true", desc: "What to return when the condition is true. Can be text, a number, another formula, or a cell reference." },
      { name: "value_if_false", desc: "What to return when the condition is false. Optional — defaults to FALSE if omitted." },
    ],
    example: '=IF(A2>100, "High", "Low")',
    exampleResult: 'Returns "High" if A2 is greater than 100, otherwise returns "Low".',
    tips: ["Nest IF statements to test multiple conditions: =IF(A1>90,\"A\",IF(A1>80,\"B\",\"C\")).", "For many conditions, consider IFS() or SWITCH() instead of nested IFs.", "Use AND() or OR() inside IF to test multiple conditions at once."],
  },
  IFS: {
    name: "IFS", category: "Logical",
    signature: "IFS(condition1, value1, [condition2, value2], ...)",
    description: "Tests multiple conditions in sequence and returns the value corresponding to the first TRUE condition. A cleaner alternative to nested IF statements.",
    args: [
      { name: "condition1", desc: "The first condition to test." },
      { name: "value1", desc: "The value to return if condition1 is TRUE." },
    ],
    example: '=IFS(A1>=90,"A", A1>=80,"B", A1>=70,"C", TRUE,"F")',
    exampleResult: 'Returns "A" for 90+, "B" for 80-89, "C" for 70-79, and "F" for anything below 70.',
    tips: ["Add TRUE as the last condition with a fallback value to handle unmatched cases.", "Available in Excel 2019+, Microsoft 365, and Google Sheets."],
  },
  SUMIF: {
    name: "SUMIF", category: "Math",
    signature: "SUMIF(range, criteria, [sum_range])",
    description: "Adds up cells in a range that meet a specified condition. Like a SUM but with a filter.",
    args: [
      { name: "range", desc: "The range of cells to evaluate against the criteria." },
      { name: "criteria", desc: "The condition to match. Can be a number, text, cell reference, or comparison like \">100\"." },
      { name: "sum_range", desc: "Optional. The actual cells to sum. If omitted, sums the cells in range." },
    ],
    example: '=SUMIF(B:B, "East", C:C)',
    exampleResult: 'Sums all values in column C where the corresponding cell in column B equals "East".',
    tips: ['Use wildcards in criteria: "*North*" matches any cell containing "North".', "For multiple conditions, use SUMIFS instead.", "Criteria text is not case-sensitive."],
  },
  SUMIFS: {
    name: "SUMIFS", category: "Math",
    signature: "SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
    description: "Adds cells that meet multiple criteria. The plural version of SUMIF — more powerful and flexible.",
    args: [
      { name: "sum_range", desc: "The range of cells to add up." },
      { name: "criteria_range1", desc: "The first range to evaluate." },
      { name: "criteria1", desc: "The condition for criteria_range1." },
    ],
    example: '=SUMIFS(D:D, B:B, "East", C:C, "Q1")',
    exampleResult: 'Sums values in column D where column B is "East" AND column C is "Q1".',
  },
  COUNTIF: {
    name: "COUNTIF", category: "Stats",
    signature: "COUNTIF(range, criteria)",
    description: "Counts the number of cells in a range that meet a condition.",
    args: [
      { name: "range", desc: "The range of cells to count." },
      { name: "criteria", desc: "The condition to match. Text criteria must be in quotes." },
    ],
    example: '=COUNTIF(A:A, ">100")',
    exampleResult: "Counts how many cells in column A contain a value greater than 100.",
    tips: ['Use "*" as a wildcard: =COUNTIF(A:A,"*Smith*") counts cells containing "Smith".'],
  },
  COUNTIFS: {
    name: "COUNTIFS", category: "Stats",
    signature: "COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
    description: "Counts cells that meet multiple criteria across multiple ranges.",
    args: [
      { name: "criteria_range1", desc: "The first range to evaluate." },
      { name: "criteria1", desc: "The condition for criteria_range1." },
    ],
    example: '=COUNTIFS(B:B, "East", C:C, ">1000")',
    exampleResult: 'Counts rows where column B is "East" AND column C is greater than 1000.',
  },
  INDEX: {
    name: "INDEX", category: "Lookup",
    signature: "INDEX(array, row_num, [col_num])",
    description: "Returns the value at a specific position within a range or array. Often combined with MATCH for powerful two-way lookups.",
    args: [
      { name: "array", desc: "The range or array of cells." },
      { name: "row_num", desc: "The row number within the range to return. 0 returns the entire column." },
      { name: "col_num", desc: "Optional. The column number within the range to return." },
    ],
    example: "=INDEX(A:C, 3, 2)",
    exampleResult: "Returns the value in row 3, column 2 of the range A:C (i.e., cell B3).",
    tips: ["INDEX/MATCH is more flexible than VLOOKUP — it can look left, handle column insertions, and is faster on large datasets."],
  },
  MATCH: {
    name: "MATCH", category: "Lookup",
    signature: "MATCH(lookup_value, lookup_array, [match_type])",
    description: "Returns the relative position of a value within a range. Used with INDEX for flexible lookups.",
    args: [
      { name: "lookup_value", desc: "The value to find." },
      { name: "lookup_array", desc: "The range to search in. Must be a single row or column." },
      { name: "match_type", desc: "0 = exact match (most common). 1 = less than or equal. -1 = greater than or equal." },
    ],
    example: '=MATCH("Alice", A:A, 0)',
    exampleResult: 'Returns the row number where "Alice" is found in column A.',
    tips: ["Classic combo: =INDEX(B:B, MATCH(D1, A:A, 0)) — finds D1 in column A, returns the corresponding value from column B."],
  },
  IFERROR: {
    name: "IFERROR", category: "Error handling",
    signature: "IFERROR(value, value_if_error)",
    description: "Returns a custom value if a formula results in an error, otherwise returns the formula result. Keeps your spreadsheet clean.",
    args: [
      { name: "value", desc: "The formula or value to evaluate." },
      { name: "value_if_error", desc: "What to return if the formula produces an error (#N/A, #VALUE!, #DIV/0!, etc.)." },
    ],
    example: '=IFERROR(VLOOKUP(A2, B:C, 2, FALSE), "Not found")',
    exampleResult: 'Runs the VLOOKUP. If it produces an error (e.g. value not in the list), returns "Not found" instead.',
    tips: ['Use "" to return a blank cell on error instead of showing an error message.'],
  },
  CONCATENATE: {
    name: "CONCATENATE", category: "Text",
    signature: "CONCATENATE(text1, [text2], ...)",
    description: "Joins two or more text strings into one. In modern Excel and Google Sheets, the & operator or CONCAT function is preferred.",
    args: [
      { name: "text1", desc: "The first string to join." },
      { name: "text2", desc: "Additional strings to append." },
    ],
    example: '=CONCATENATE(A2, " ", B2)',
    exampleResult: "Joins the values in A2 and B2 with a space between them (e.g. 'John Smith').",
    tips: ['Shorthand: =A2&" "&B2 does the same thing and is easier to read.'],
  },
  TEXTJOIN: {
    name: "TEXTJOIN", category: "Text",
    signature: "TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)",
    description: "Joins multiple text values with a delimiter, with an option to skip empty cells.",
    args: [
      { name: "delimiter", desc: "The separator between joined values (e.g. \", \" or \"-\")." },
      { name: "ignore_empty", desc: "TRUE to skip empty cells, FALSE to include them." },
      { name: "text1", desc: "The first value or range to join." },
    ],
    example: '=TEXTJOIN(", ", TRUE, A2:A10)',
    exampleResult: 'Joins all non-empty values in A2:A10, separated by ", ".',
  },
  LEFT: {
    name: "LEFT", category: "Text",
    signature: "LEFT(text, [num_chars])",
    description: "Extracts a specified number of characters from the left side of a text string.",
    args: [
      { name: "text", desc: "The text string to extract from." },
      { name: "num_chars", desc: "Number of characters to extract from the left. Default is 1." },
    ],
    example: "=LEFT(A2, 3)",
    exampleResult: 'Returns the first 3 characters of the value in A2 (e.g. "ABC" from "ABCDEF").',
  },
  RIGHT: {
    name: "RIGHT", category: "Text",
    signature: "RIGHT(text, [num_chars])",
    description: "Extracts a specified number of characters from the right side of a text string.",
    args: [
      { name: "text", desc: "The text string to extract from." },
      { name: "num_chars", desc: "Number of characters to extract from the right. Default is 1." },
    ],
    example: "=RIGHT(A2, 4)",
    exampleResult: 'Returns the last 4 characters of A2 (e.g. "WXYZ" from "ABWXYZ").',
  },
  MID: {
    name: "MID", category: "Text",
    signature: "MID(text, start_num, num_chars)",
    description: "Extracts a specific number of characters from the middle of a text string, starting at a position you specify.",
    args: [
      { name: "text", desc: "The text string to extract from." },
      { name: "start_num", desc: "The position of the first character to extract (1 = first character)." },
      { name: "num_chars", desc: "Number of characters to extract." },
    ],
    example: "=MID(A2, 3, 5)",
    exampleResult: "Returns 5 characters from A2 starting at the 3rd character.",
  },
  LEN: {
    name: "LEN", category: "Text",
    signature: "LEN(text)",
    description: "Returns the number of characters in a text string, including spaces.",
    args: [{ name: "text", desc: "The text string to measure." }],
    example: "=LEN(A2)",
    exampleResult: 'Returns the character count of A2. For "Hello World" returns 11.',
  },
  TRIM: {
    name: "TRIM", category: "Text",
    signature: "TRIM(text)",
    description: "Removes all leading, trailing, and extra spaces from a text string (leaves single spaces between words).",
    args: [{ name: "text", desc: "The text string to clean up." }],
    example: "=TRIM(A2)",
    exampleResult: '=TRIM("  Hello   World  ") returns "Hello World".',
    tips: ["TRIM only removes regular spaces (ASCII 32). For non-breaking spaces, use SUBSTITUTE with CHAR(160)."],
  },
  UPPER: { name: "UPPER", category: "Text", signature: "UPPER(text)", description: "Converts all characters in a text string to uppercase.", args: [{ name: "text", desc: "The text to convert." }], example: "=UPPER(A2)", exampleResult: '=UPPER("hello") returns "HELLO".' },
  LOWER: { name: "LOWER", category: "Text", signature: "LOWER(text)", description: "Converts all characters in a text string to lowercase.", args: [{ name: "text", desc: "The text to convert." }], example: "=LOWER(A2)", exampleResult: '=LOWER("HELLO") returns "hello".' },
  PROPER: { name: "PROPER", category: "Text", signature: "PROPER(text)", description: "Capitalizes the first letter of each word in a text string.", args: [{ name: "text", desc: "The text to convert." }], example: "=PROPER(A2)", exampleResult: '=PROPER("john smith") returns "John Smith".' },
  SUM: { name: "SUM", category: "Math", signature: "SUM(number1, [number2], ...)", description: "Adds all numbers in a range of cells.", args: [{ name: "number1", desc: "The first number or range to add." }], example: "=SUM(A1:A10)", exampleResult: "Adds all values in cells A1 through A10." },
  AVERAGE: { name: "AVERAGE", category: "Stats", signature: "AVERAGE(number1, [number2], ...)", description: "Returns the arithmetic mean (average) of a set of numbers.", args: [{ name: "number1", desc: "The first number or range." }], example: "=AVERAGE(B2:B50)", exampleResult: "Calculates the average of all values in B2:B50." },
  MAX: { name: "MAX", category: "Stats", signature: "MAX(number1, [number2], ...)", description: "Returns the largest value in a set of numbers.", args: [{ name: "number1", desc: "The first number or range." }], example: "=MAX(C:C)", exampleResult: "Returns the highest value in column C." },
  MIN: { name: "MIN", category: "Stats", signature: "MIN(number1, [number2], ...)", description: "Returns the smallest value in a set of numbers.", args: [{ name: "number1", desc: "The first number or range." }], example: "=MIN(C:C)", exampleResult: "Returns the lowest value in column C." },
  COUNT: { name: "COUNT", category: "Stats", signature: "COUNT(value1, [value2], ...)", description: "Counts the number of cells that contain numbers.", args: [{ name: "value1", desc: "The first range to count." }], example: "=COUNT(A:A)", exampleResult: "Counts how many cells in column A contain numbers (ignores text and blanks)." },
  COUNTA: { name: "COUNTA", category: "Stats", signature: "COUNTA(value1, [value2], ...)", description: "Counts the number of non-empty cells in a range. Unlike COUNT, it also counts text.", args: [{ name: "value1", desc: "The range to count." }], example: "=COUNTA(A:A)", exampleResult: "Counts all non-empty cells in column A (both numbers and text)." },
  TODAY: { name: "TODAY", category: "Date", signature: "TODAY()", description: "Returns today's date. Updates automatically every time the spreadsheet recalculates.", args: [], example: "=TODAY()", exampleResult: "Returns the current date (e.g. 5/31/2026). Refreshes on each open/recalculate." },
  NOW: { name: "NOW", category: "Date", signature: "NOW()", description: "Returns the current date and time.", args: [], example: "=NOW()", exampleResult: "Returns the current date and time (e.g. 5/31/2026 14:30)." },
  YEAR: { name: "YEAR", category: "Date", signature: "YEAR(serial_number)", description: "Extracts the year from a date.", args: [{ name: "serial_number", desc: "A date value or cell reference containing a date." }], example: "=YEAR(A2)", exampleResult: 'Returns 2024 if A2 contains a date in 2024.' },
  MONTH: { name: "MONTH", category: "Date", signature: "MONTH(serial_number)", description: "Extracts the month number (1–12) from a date.", args: [{ name: "serial_number", desc: "A date value." }], example: "=MONTH(A2)", exampleResult: "Returns 5 if A2 contains a date in May." },
  DAY: { name: "DAY", category: "Date", signature: "DAY(serial_number)", description: "Extracts the day of the month (1–31) from a date.", args: [{ name: "serial_number", desc: "A date value." }], example: "=DAY(A2)", exampleResult: "Returns 15 if A2 contains a date on the 15th." },
  DATEDIF: { name: "DATEDIF", category: "Date", signature: "DATEDIF(start_date, end_date, unit)", description: "Calculates the difference between two dates. Unit: 'Y' (years), 'M' (months), 'D' (days).", args: [{ name: "start_date", desc: "The start date." }, { name: "end_date", desc: "The end date." }, { name: "unit", desc: '"Y" for years, "M" for months, "D" for days.' }], example: '=DATEDIF(A2, TODAY(), "Y")', exampleResult: "Returns the number of complete years between A2 and today — useful for calculating age." },
  ROUND: { name: "ROUND", category: "Math", signature: "ROUND(number, num_digits)", description: "Rounds a number to a specified number of digits.", args: [{ name: "number", desc: "The number to round." }, { name: "num_digits", desc: "Digits to round to. 0 = whole number, 2 = 2 decimal places, -1 = round to tens." }], example: "=ROUND(A2, 2)", exampleResult: "Rounds A2 to 2 decimal places (e.g. 3.14159 → 3.14)." },
  SUBSTITUTE: { name: "SUBSTITUTE", category: "Text", signature: "SUBSTITUTE(text, old_text, new_text, [instance_num])", description: "Replaces occurrences of a substring within a text string.", args: [{ name: "text", desc: "The text to modify." }, { name: "old_text", desc: "The text to replace." }, { name: "new_text", desc: "The replacement text." }, { name: "instance_num", desc: "Optional. Which occurrence to replace (1, 2, etc.). Omit to replace all." }], example: '=SUBSTITUTE(A2, " ", "_")', exampleResult: 'Replaces all spaces in A2 with underscores ("Hello World" → "Hello_World").' },
  FIND: { name: "FIND", category: "Text", signature: "FIND(find_text, within_text, [start_num])", description: "Returns the position of a substring within a text string. Case-sensitive. Returns an error if not found.", args: [{ name: "find_text", desc: "The text to find." }, { name: "within_text", desc: "The text to search in." }, { name: "start_num", desc: "Optional. Position to start searching from." }], example: '=FIND("@", A2)', exampleResult: 'Returns the position of "@" in the email address in A2.' },
  UNIQUE: { name: "UNIQUE", category: "Array", signature: "UNIQUE(array, [by_col], [exactly_once])", description: "Returns a list of unique values from a range. Available in Excel 365 and Google Sheets.", args: [{ name: "array", desc: "The range or array to deduplicate." }, { name: "by_col", desc: "Optional. FALSE = unique rows (default), TRUE = unique columns." }, { name: "exactly_once", desc: "Optional. TRUE = return values that appear exactly once only." }], example: "=UNIQUE(A2:A100)", exampleResult: "Returns a deduplicated list of all values in A2:A100, spilling into the cells below.", tips: ["This is a dynamic array formula — it spills results automatically in Excel 365+."] },
  FILTER: { name: "FILTER", category: "Array", signature: "FILTER(array, include, [if_empty])", description: "Filters a range or array based on a condition. A dynamic array formula that spills results.", args: [{ name: "array", desc: "The range to filter." }, { name: "include", desc: "An array of TRUE/FALSE values of the same size, used to filter rows/columns." }, { name: "if_empty", desc: "Optional. Value to return if no rows match." }], example: '=FILTER(A2:C100, B2:B100="East")', exampleResult: 'Returns all rows from A2:C100 where column B equals "East".' },
  XLOOKUP: { name: "XLOOKUP", category: "Lookup", signature: "XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])", description: "The modern replacement for VLOOKUP. Searches any range (left or right), returns any range, and handles not-found cases natively. Available in Excel 365 and Google Sheets.", args: [{ name: "lookup_value", desc: "The value to search for." }, { name: "lookup_array", desc: "The column or row to search in." }, { name: "return_array", desc: "The column or row to return results from." }, { name: "if_not_found", desc: 'Optional. Value to return if not found (e.g. "Not found").' }], example: '=XLOOKUP(A2, B:B, C:C, "Not found")', exampleResult: "Finds the value in A2 within column B, returns the corresponding value from column C. Returns 'Not found' if missing.", tips: ["XLOOKUP can look left (unlike VLOOKUP), can return multiple columns, and supports wildcard matching."] },
};

function extractFunctionName(formula: string): string | null {
  const cleaned = formula.trim().replace(/^=/, "");
  const match = cleaned.match(/^([A-Z][A-Z0-9]*)\s*\(/i);
  return match ? match[1].toUpperCase() : null;
}

const EXAMPLES = [
  "=VLOOKUP(A2, B:D, 3, FALSE)",
  "=IF(A2>100, \"High\", \"Low\")",
  "=SUMIF(B:B, \"East\", C:C)",
  "=INDEX(A:C, MATCH(E2, A:A, 0), 3)",
  "=IFERROR(VLOOKUP(A2,B:C,2,FALSE),\"Not found\")",
  "=COUNTIFS(B:B,\"East\",C:C,\">1000\")",
  "=XLOOKUP(A2, B:B, C:C, \"Not found\")",
];

const faqs: FAQItem[] = [
  { q: "What Excel formulas does this tool explain?", a: "The tool covers 40+ common Excel and Google Sheets functions including VLOOKUP, XLOOKUP, INDEX/MATCH, IF, IFS, SUMIF, SUMIFS, COUNTIF, COUNTIFS, IFERROR, text functions (LEFT, RIGHT, MID, TRIM, SUBSTITUTE), date functions (TODAY, DATEDIF, YEAR, MONTH), and dynamic array functions (UNIQUE, FILTER)." },
  { q: "Does it work with Google Sheets formulas?", a: "Yes. Most Excel formulas are identical in Google Sheets. XLOOKUP, UNIQUE, and FILTER are available in both Excel 365 and Google Sheets. A few functions have different names (e.g. CONCATENATE vs CONCAT) but the behavior is the same." },
  { q: "Can it explain nested formulas?", a: "The tool identifies the outermost function and explains it in detail. For complex nested formulas like =IFERROR(INDEX(C:C, MATCH(A2, B:B, 0)), \"Not found\"), it explains IFERROR and notes the nesting pattern. Understanding the outer function is usually the key to understanding the whole formula." },
  { q: "What if my formula isn't recognized?", a: "The tool covers the most commonly used functions. If your formula isn't in the library, try pasting just the function name (e.g. ARRAYFORMULA or QUERY) and we'll add it to the list if there's demand." },
  { q: "Is VLOOKUP or XLOOKUP better?", a: "XLOOKUP is strictly better: it can look left (VLOOKUP can't), handles not-found natively, doesn't break when you insert columns, and can return multiple columns. If you're on Excel 365 or Google Sheets, use XLOOKUP. If you're on an older version of Excel, VLOOKUP is still the standard." },
];

const USE_CASES: UseCase[] = [
  {
    persona: "Bookkeeper",
    domain: "Accounting / Small Business",
    icon: "📒",
    scenario: "Inherited a spreadsheet with =IFERROR(INDEX(B:B,MATCH(F2,A:A,0)),\"Not found\"). No idea what it does but the formula breaks after adding new rows — and month-end close depends on it working.",
    outcome: "Pastes the formula, gets a plain-English breakdown in seconds. Understands it's a VLOOKUP alternative that won't break on column inserts. Fixes it confidently without calling the accountant.",
  },
  {
    persona: "Finance Manager",
    domain: "Corporate Finance",
    icon: "💹",
    scenario: "Auditor points at =SUMPRODUCT((C2:C100=\"North\")*(D2:D100>1000)*E2:E100) and asks 'what does this formula do?' The manager needs to explain it clearly in the meeting room without guessing.",
    outcome: "Gets a clear explanation: 'Sum all values in column E where C equals North AND D is greater than 1000.' Explains it confidently. Audit proceeds without delay.",
  },
  {
    persona: "Operations Analyst",
    domain: "Supply Chain / Ops",
    icon: "⚙️",
    scenario: "Learning Excel to build a demand forecast model. Googles 'OFFSET function explanation' but the Microsoft documentation is dense, abstract, and filled with jargon that doesn't connect to their actual data.",
    outcome: "Types their real OFFSET formula into the tool. Gets a contextual explanation with their actual cell references and ranges explained. Learns the function in context, not in isolation.",
  },
  {
    persona: "HR Administrator",
    domain: "Human Resources",
    icon: "👥",
    scenario: "Payroll sheet has a complex nested IF formula calculating overtime eligibility. A new HR admin needs to verify the logic is correct before running the month's payroll — an error could affect 200 employees.",
    outcome: "Pastes the formula. Step-by-step breakdown reveals a condition error in the nested logic. The error is caught and corrected before payroll runs.",
  },
];

const relatedTools = [
  { name: "CSV to JSON Converter", href: "/tools/csv-to-json", description: "Convert spreadsheet data to JSON" },
  { name: "Duplicate Row Remover", href: "/tools/remove-duplicates", description: "Remove duplicate rows from CSV" },
  { name: "CSV Column Picker", href: "/tools/csv-columns", description: "Select and reorder CSV columns" },
];

export function FormulaExplainerClient() {
  const [formula, setFormula] = useState("");
  const [doc, setDoc] = useState<FunctionDoc | null>(null);
  const [notFound, setNotFound] = useState(false);

  function handleExplain() {
    const fnName = extractFunctionName(formula);
    if (!fnName) { setNotFound(true); setDoc(null); return; }
    const found = FUNCTION_DOCS[fnName];
    if (found) { setDoc(found); setNotFound(false); }
    else { setDoc(null); setNotFound(true); }
  }

  function useExample(ex: string) {
    setFormula(ex);
    const fnName = extractFunctionName(ex);
    if (fnName && FUNCTION_DOCS[fnName]) { setDoc(FUNCTION_DOCS[fnName]); setNotFound(false); }
  }

  return (
    <article className="mx-auto max-w-[780px] px-6 py-12">
      <header className="mb-10">
        <div className="inline-block text-[12px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(0,201,167,0.08)", color: "#007A65", border: "1px solid rgba(0,201,167,0.2)" }}>
          Free tool — no signup
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight mb-3" style={{ color: "var(--ink)" }}>
          Free Excel Formula Explainer
        </h1>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Paste any Excel or Google Sheets formula and get a plain-English explanation — what it does, what each argument means, and tips to use it correctly.
          <strong style={{ color: "var(--ink)" }}> No signup. Works offline.</strong>
        </p>
      </header>

      {/* Input */}
      <div className="space-y-3 mb-6">
        <label className="block text-[14px] font-semibold" style={{ color: "var(--ink)" }}>Paste your formula</label>
        <input
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleExplain()}
          placeholder="=VLOOKUP(A2, B:D, 3, FALSE)"
          className="w-full rounded-xl border px-4 py-3 text-[14px] font-mono focus:outline-none transition-all"
          style={{ borderColor: "var(--hair-strong)", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-geist-mono)" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--mint)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--hair-strong)"; }}
        />
        <button
          onClick={handleExplain}
          disabled={!formula.trim()}
          className="w-full py-3 rounded-xl font-semibold text-[15px] transition-all disabled:opacity-40"
          style={{ background: "var(--ink)", color: "white" }}
        >
          Explain this formula
        </button>
      </div>

      {/* Examples */}
      <div className="mb-8">
        <p className="text-[12px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--ink-mute)" }}>Try an example</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => useExample(ex)} className="text-[12px] font-mono px-3 py-1.5 rounded-lg border transition-all" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)", color: "var(--ink-soft)", fontFamily: "var(--font-geist-mono)" }}>
              {ex.length > 35 ? ex.slice(0, 35) + "…" : ex}
            </button>
          ))}
        </div>
      </div>

      {notFound && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-6" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
          <p className="text-[14px] text-amber-700">
            Formula not recognized yet. Make sure you start with <code>=</code> and use a known function name. Try one of the examples above.
          </p>
        </div>
      )}

      {doc && (
        <div className="space-y-6">
          {/* Function name + category */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,201,167,0.1)" }}>
              <BookOpen className="w-5 h-5" style={{ color: "#00C9A7" }} />
            </div>
            <div>
              <h2 className="text-[22px] font-bold" style={{ color: "var(--ink)" }}>{doc.name}</h2>
              <span className="text-[12px] font-medium px-2.5 py-0.5 rounded-full" style={{ background: "var(--cream-deep)", color: "var(--ink-mute)" }}>{doc.category}</span>
            </div>
          </div>

          {/* What it does */}
          <div className="rounded-xl p-5" style={{ background: "var(--paper)", border: "1px solid var(--hair-strong)" }}>
            <p className="text-[12px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ink-mute)" }}>What it does</p>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--ink)" }}>{doc.description}</p>
          </div>

          {/* Signature */}
          <div className="rounded-xl p-4" style={{ background: "var(--cream-deep)", border: "1px solid var(--hair)" }}>
            <p className="text-[12px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ink-mute)" }}>Syntax</p>
            <code className="text-[13px] font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-geist-mono)" }}>{doc.signature}</code>
          </div>

          {/* Arguments */}
          {doc.args.length > 0 && (
            <div>
              <p className="text-[14px] font-semibold mb-3" style={{ color: "var(--ink)" }}>Arguments explained</p>
              <div className="space-y-2">
                {doc.args.map((arg) => (
                  <div key={arg.name} className="flex gap-3 p-4 rounded-xl border" style={{ borderColor: "var(--hair)", background: "var(--paper)" }}>
                    <code className="text-[12px] font-bold shrink-0 mt-0.5" style={{ color: "#007A65", fontFamily: "var(--font-geist-mono)" }}>{arg.name}</code>
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>{arg.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Example */}
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--hair-strong)" }}>
            <div className="px-4 py-2.5" style={{ background: "var(--cream-deep)", borderBottom: "1px solid var(--hair)" }}>
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--ink-mute)" }}>Example</span>
            </div>
            <div className="p-4 space-y-2">
              <code className="block text-[13px] font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-geist-mono)" }}>{doc.example}</code>
              <p className="text-[13px]" style={{ color: "var(--ink-soft)" }}>{doc.exampleResult}</p>
            </div>
          </div>

          {/* Tips */}
          {doc.tips && doc.tips.length > 0 && (
            <div className="rounded-xl p-5" style={{ background: "rgba(247,214,122,0.08)", border: "1px solid rgba(247,214,122,0.3)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4" style={{ color: "#8A6A00" }} />
                <p className="text-[13px] font-semibold" style={{ color: "#8A6A00" }}>Pro tips</p>
              </div>
              <ul className="space-y-2">
                {doc.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-[13px]" style={{ color: "var(--ink-soft)" }}>
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#F7D67A" }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <SoftCTA text="Still auditing data quality with formulas? Sohovi automates DQ scoring across all your data assets →" />

          <HardCTA
            headline="Still wrangling data in spreadsheets? There's a better way."
            body="Sohovi profiles your CSV and Excel data automatically — tracking null rates, type consistency, uniqueness, and quality scores across all your data assets. No more manual formula audits."
            bullets={[
              "Upload any CSV or Excel file — profiled in seconds",
              "DQ scoring across 10 dimensions with threshold alerts",
              "Track quality trends over time without spreadsheet formulas",
            ]}
          />
        </div>
      )}

      <UseCases cases={USE_CASES} toolName="Excel Formula Explainer" />

      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--ink)" }}>How to use the Excel formula explainer</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Paste your formula", body: "Copy any Excel or Google Sheets formula from your spreadsheet and paste it into the text box above. Include the leading = sign." },
            { step: "2", title: "Click Explain", body: "The tool identifies the function name, retrieves its full documentation, and shows you what it does, what each argument means, a worked example, and pro tips." },
            { step: "3", title: "Understand and apply", body: "Read the plain-English explanation, check the argument breakdown, and use the example to understand how to adapt the formula to your own data." },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 p-5 rounded-xl border" style={{ borderColor: "var(--hair)", background: "var(--paper)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold" style={{ background: "var(--cream-deep)", color: "var(--ink)" }}>{s.step}</div>
              <div>
                <p className="font-semibold text-[14px]" style={{ color: "var(--ink)" }}>{s.title}</p>
                <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ToolFAQ items={faqs} toolUrl="/tools/formula-explainer" />
      <RelatedTools tools={relatedTools} />
    </article>
  );
}
