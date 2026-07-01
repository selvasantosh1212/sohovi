/**
 * dq-runner.worker.ts
 *
 * Runs all active DQ rules against in-memory rows.
 * Raw data never leaves this worker — only RuleResult[] is returned.
 *
 * Message protocol:
 *   IN  → DQRunCommand  (type: "RUN")
 *   OUT → DQRunResponse (type: "RUN_PROGRESS" | "RUN_COMPLETE" | "RUN_ERROR")
 */

import type { DQRunCommand, DQRunResponse, RuleResult, EvalResult, RuleConfig } from "@/types/dq.types";
import { buildRunResult, deriveSeverity } from "@/lib/dq-engine/scorer";
import { applyScopeFilter } from "@/lib/dq-engine/scope-filter";

// ---- Dimension evaluator imports ----------------------------------------

import { evaluate as evalCompleteness }  from "@/lib/dq-engine/dimensions/completeness";
import { evaluate as evalValidity }      from "@/lib/dq-engine/dimensions/validity";
import { evaluate as evalAccuracy }      from "@/lib/dq-engine/dimensions/accuracy";
import { evaluate as evalUniqueness }    from "@/lib/dq-engine/dimensions/uniqueness";
import { evaluate as evalConsistency }   from "@/lib/dq-engine/dimensions/consistency";
import { evaluate as evalIntegrity }     from "@/lib/dq-engine/dimensions/integrity";
import { evaluate as evalTimeliness }    from "@/lib/dq-engine/dimensions/timeliness";
import { evaluate as evalCurrency }      from "@/lib/dq-engine/dimensions/currency";
import { evaluate as evalConformity }    from "@/lib/dq-engine/dimensions/conformity";
import { evaluate as evalPrecision }     from "@/lib/dq-engine/dimensions/precision";

type EvalFn = (
  colValues: (string | null)[],
  rows: (string | null)[][],
  headers: string[],
  rule: RuleConfig
) => EvalResult;

const EVALUATORS: Record<string, EvalFn> = {
  completeness: evalCompleteness,
  validity:     evalValidity,
  accuracy:     evalAccuracy,
  uniqueness:   evalUniqueness,
  consistency:  evalConsistency,
  integrity:    evalIntegrity,
  timeliness:   evalTimeliness,
  currency:     evalCurrency,
  conformity:   evalConformity,
  precision:    evalPrecision,
};

// ---- Priority order for dimensions (completeness first) ------------------

const DIMENSION_ORDER = [
  "completeness", "validity", "accuracy", "uniqueness",
  "consistency", "integrity", "timeliness", "currency",
  "conformity", "precision",
];

// ---- Worker message handler ----------------------------------------------

self.onmessage = (e: MessageEvent<DQRunCommand>) => {
  const msg = e.data;
  if (msg.type !== "RUN") return;

  const { rows, headers, rules, asset_id, scope_conditions_global } = msg.payload;

  try {
    const activeRules = rules
      .filter((r) => r.is_active)
      .sort((a, b) => {
        const ai = DIMENSION_ORDER.indexOf(a.dimension);
        const bi = DIMENSION_ORDER.indexOf(b.dimension);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });

    // Global scope filter restricts the whole run to a row subset, applied
    // once up front — every rule (and its own per-rule scope, if any) then
    // operates on top of this subset instead of the full dataset.
    const isGloballyScoped = (scope_conditions_global?.length ?? 0) > 0;
    const globalScopeIndices = isGloballyScoped
      ? applyScopeFilter(rows, headers, scope_conditions_global!)
      : rows.map((_, i) => i);
    const globalRows = isGloballyScoped ? globalScopeIndices.map((i) => rows[i]) : rows;

    const ruleResults: RuleResult[] = [];

    for (let i = 0; i < activeRules.length; i++) {
      const rule = activeRules[i];

      // Post progress before each rule
      const progressMsg: DQRunResponse = {
        type: "RUN_PROGRESS",
        payload: {
          ruleIndex: i,
          totalRules: activeRules.length,
          label: `${rule.dimension} → ${rule.rule_type}${rule.column_name ? ` (${rule.column_name})` : ""}`,
        },
      };
      self.postMessage(progressMsg);

      try {
        const evalFn = EVALUATORS[rule.dimension];
        if (!evalFn) {
          ruleResults.push(makeSkipped(rule, globalRows.length, `Unknown dimension: ${rule.dimension}`));
          continue;
        }

        // Apply per-rule scope conditions (if any) on top of the globally-scoped
        // subset. inScopeIndices are indices into globalRows — failedIndices
        // returned by evalFn are relative to the scoped slice and must be
        // remapped back through inScopeIndices AND globalScopeIndices to reach
        // ORIGINAL dataset row numbers.
        const isScoped = rule.scope_conditions?.length > 0;
        const inScopeIndices = isScoped
          ? applyScopeFilter(globalRows, headers, rule.scope_conditions)
          : globalRows.map((_, i) => i);
        const scopedRows = isScoped ? inScopeIndices.map((i) => globalRows[i]) : globalRows;

        // Extract column values (null if dataset-level rule)
        const colIdx = rule.column_name ? headers.indexOf(rule.column_name) : -1;
        const colValues: (string | null)[] =
          colIdx >= 0 ? scopedRows.map((r) => r[colIdx] ?? null) : [];

        const result = evalFn(colValues, scopedRows, headers, rule);
        const remappedFailedIndices = result.failedIndices.map((i) => {
          const globalIdx = isScoped ? inScopeIndices[i] : i;
          return isGloballyScoped ? globalScopeIndices[globalIdx] : globalIdx;
        });

        ruleResults.push({
          rule_id: rule.id,
          column_name: rule.column_name,
          description: rule.description,
          dimension: rule.dimension,
          rule_type: rule.rule_type,
          score: Math.round(result.score * 10000) / 10000,
          status: result.score >= rule.threshold ? "pass" : "fail",
          severity: deriveSeverity(result.score),
          total_records: scopedRows.length,
          failed_records: remappedFailedIndices.length,
          failed_indices: remappedFailedIndices,
          message: result.message,
          threshold: rule.threshold,
        });
      } catch (ruleErr) {
        ruleResults.push(makeSkipped(rule, globalRows.length, String(ruleErr)));
      }
    }

    const runResult = buildRunResult(ruleResults, asset_id);

    const completeMsg: DQRunResponse = {
      type: "RUN_COMPLETE",
      payload: runResult,
    };
    self.postMessage(completeMsg);
  } catch (err) {
    const errMsg: DQRunResponse = {
      type: "RUN_ERROR",
      payload: { message: String(err) },
    };
    self.postMessage(errMsg);
  }
};

function makeSkipped(rule: RuleConfig, totalRows: number, message: string): RuleResult {
  return {
    rule_id: rule.id,
    column_name: rule.column_name,
    description: rule.description,
    dimension: rule.dimension,
    rule_type: rule.rule_type,
    score: 1,
    status: "pass",
    severity: "low",
    total_records: totalRows,
    failed_records: 0,
    failed_indices: [],
    message: `[Skipped] ${message}`,
    threshold: rule.threshold,
  };
}
