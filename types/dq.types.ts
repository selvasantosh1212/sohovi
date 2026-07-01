import type { DQDimension } from "./app.types";

// ============================================================
// Scope/filter conditions — restrict a rule to a row subset
// ============================================================

export type ScopeOperator = "==" | "!=" | ">" | ">=" | "<" | "<=" | "in" | "contains";

export interface ScopeCondition {
  column: string;
  operator: ScopeOperator;
  value: string;
}

// ============================================================
// Rule config — stored in Supabase, loaded for DQ runs
// ============================================================

export interface RuleConfig {
  id: string;
  column_name: string | null; // null = dataset-level rule
  description: string | null; // user-authored — carried through to RuleResult for display
  dimension: DQDimension;
  rule_type: string;
  parameters: Record<string, unknown>;
  scope_conditions: ScopeCondition[];
  threshold: number; // 0–1: pass if score >= threshold
  weight: number; // for weighted column score (default 1)
  is_active: boolean;
}

// ============================================================
// Rule evaluation result — computed in dq-runner.worker.ts
// ============================================================

export interface RuleResult {
  rule_id: string;
  column_name: string | null;
  description: string | null;
  dimension: DQDimension;
  rule_type: string;
  score: number; // 0–1
  status: "pass" | "fail";
  severity: "low" | "medium" | "high";
  total_records: number;
  failed_records: number;
  failed_indices: number[]; // row indices that failed (used for remediation)
  message: string;
  threshold: number;
}

export interface ColumnScore {
  column_name: string;
  score: number;
  weighted_score: number;
  rule_count: number;
  fail_count: number;
}

export interface DQRunResult {
  asset_id: string;
  overall_score: number; // 0–100
  column_scores: ColumnScore[];
  rule_results: RuleResult[];
  run_at: string;
}

// ============================================================
// AI DQ Rule suggestions
// ============================================================

export interface SuggestedRule {
  column_name: string;
  dimension: DQDimension;
  rule_type: string;
  parameters: Record<string, unknown>;
  threshold: number;
  reason: string;
  confidence: number; // 0–1
}

// ============================================================
// DQ Glossary — which dimensions apply to a column, and why
// ============================================================

export interface DQGlossaryEntry {
  column_name: string;
  dimension: DQDimension;
  definition: string; // generic — what this dimension means
  rationale: string; // column-specific — why it applies here, grounded in profiling stats
  confidence: number; // 0–1
  rule_types: string[]; // suggested checks that back this dimension for this column
}

// ============================================================
// DQ Runner Worker messages
// ============================================================

export type DQRunCommand = {
  type: "RUN";
  payload: {
    rows: (string | null)[][];
    headers: string[];
    rules: RuleConfig[];
    asset_id: string;
    /** Restricts the entire run to a row subset, applied once before any rule runs. */
    scope_conditions_global?: ScopeCondition[];
  };
};

export type DQRunResponse =
  | {
      type: "RUN_PROGRESS";
      payload: { ruleIndex: number; totalRules: number; label: string };
    }
  | { type: "RUN_COMPLETE"; payload: DQRunResult }
  | { type: "RUN_ERROR"; payload: { message: string } };

// ============================================================
// Adaptive Behavioral Scoring (cross-run statistical comparison)
// ============================================================

export type BehaviorMetric =
  | "null_pct"
  | "unique_pct"
  | "avg_value"
  | "min_value"
  | "max_value"
  | "std_dev"
  | "row_count"
  | "type_shift"
  | "distribution";

export interface BehaviorFlag {
  column_name: string;
  metric: BehaviorMetric;
  observed: number;
  expected_mean: number;
  expected_std: number;
  z_score: number;
  severity: "low" | "medium" | "high";
  message: string;
}

export interface BehaviorResult {
  behavior_score: number; // 0–100
  flags: BehaviorFlag[];
  runs_compared: number;
}

// ============================================================
// Eval primitive returned by each dimension evaluator
// ============================================================

export interface EvalResult {
  score: number;
  failedIndices: number[];
  message: string;
}
