export interface DataContract {
  id: string;
  asset_id: string;
  name: string;
  description: string | null;
  min_pass_threshold: number;
  require_no_schema_change: boolean;
  required_rule_ids: string[];
  is_active: boolean;
  created_at: string;
}

export interface ContractFailure {
  check: "score" | "schema" | "rule";
  passed: boolean;
  detail: string;
}

export interface ContractEvaluation {
  id: string;
  contract_id: string;
  run_id: string;
  evaluated_at: string;
  passed: boolean;
  overall_score: number | null;
  failures: ContractFailure[];
}

export interface DataContractInput {
  asset_id: string;
  name: string;
  description?: string | null;
  min_pass_threshold: number;
  require_no_schema_change: boolean;
  required_rule_ids?: string[];
}
