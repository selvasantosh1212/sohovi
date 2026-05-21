import type { EvalResult, RuleConfig } from "@/types/dq.types";
import { norm, getTemplate } from "../templates/index";

const NUMERIC_RE = /^-?\d+(\.\d+)?$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$|^\d{2}\.\d{2}\.\d{4}$/;
const BOOL_SET = new Set(["true", "false", "yes", "no", "1", "0", "y", "n"]);

export function evaluate(
  colValues: (string | null)[],
  _rows: (string | null)[][],
  _headers: string[],
  rule: RuleConfig
): EvalResult {
  switch (rule.rule_type) {
    case "format_check":
      return formatCheck(colValues, rule);
    case "datatype_enforcement":
      return datatypeEnforcement(colValues, rule);
    default:
      return formatCheck(colValues, rule);
  }
}

function formatCheck(values: (string | null)[], rule: RuleConfig): EvalResult {
  const template = String(rule.parameters.template ?? "");
  const re = getTemplate(template);
  if (!re) {
    return { score: 0, failedIndices: [], message: `Unknown template: '${template}'` };
  }
  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    nonNull++;
    if (!re.test(v)) failedIndices.push(i);
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} values do not conform to '${template}' format`,
  };
}

function datatypeEnforcement(values: (string | null)[], rule: RuleConfig): EvalResult {
  const expected = String(rule.parameters.expected_type ?? "numeric");
  let checker: (v: string) => boolean;
  if (expected === "numeric") checker = (v) => NUMERIC_RE.test(v.replace(/,/g, ""));
  else if (expected === "date") checker = (v) => DATE_RE.test(v) && !isNaN(Date.parse(v));
  else if (expected === "boolean") checker = (v) => BOOL_SET.has(v.toLowerCase());
  else checker = () => true;

  const failedIndices: number[] = [];
  let nonNull = 0;
  for (let i = 0; i < values.length; i++) {
    const v = norm(values[i]);
    if (v === null) continue;
    nonNull++;
    if (!checker(v)) failedIndices.push(i);
  }
  const score = nonNull > 0 ? (nonNull - failedIndices.length) / nonNull : 1;
  return {
    score,
    failedIndices,
    message: `${failedIndices.length} values cannot be enforced as ${expected}`,
  };
}
