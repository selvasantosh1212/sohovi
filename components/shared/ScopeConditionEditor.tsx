"use client";

import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ScopeCondition, ScopeOperator } from "@/types/dq.types";

export const SCOPE_OPERATORS: { value: ScopeOperator; label: string }[] = [
  { value: "==", label: "equals" },
  { value: "!=", label: "not equals" },
  { value: ">", label: "greater than" },
  { value: ">=", label: "greater or equal" },
  { value: "<", label: "less than" },
  { value: "<=", label: "less or equal" },
  { value: "in", label: "in (comma-separated)" },
  { value: "contains", label: "contains" },
];

interface Props {
  conditions: ScopeCondition[];
  onChange: (conditions: ScopeCondition[]) => void;
  availableColumns: string[];
  helperText?: string;
}

export function ScopeConditionEditor({ conditions, onChange, availableColumns, helperText }: Props) {
  return (
    <div className="space-y-2">
      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
      {conditions.map((cond, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Select
            value={cond.column}
            onValueChange={(v) =>
              onChange(conditions.map((c, idx) => (idx === i ? { ...c, column: v ?? "" } : c)))
            }
          >
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="Column…" />
            </SelectTrigger>
            <SelectContent>
              {availableColumns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={cond.operator}
            onValueChange={(v) =>
              onChange(
                conditions.map((c, idx) =>
                  idx === i ? { ...c, operator: (v ?? "==") as ScopeOperator } : c
                )
              )
            }
          >
            <SelectTrigger className="h-8 text-xs w-[88px] shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCOPE_OPERATORS.map((op) => (
                <SelectItem key={op.value} value={op.value}>
                  {op.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="text"
            className="flex h-8 w-24 rounded-lg border border-input bg-transparent px-2 py-1 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="Value"
            value={cond.value}
            onChange={(e) =>
              onChange(conditions.map((c, idx) => (idx === i ? { ...c, value: e.target.value } : c)))
            }
          />
          <button
            type="button"
            onClick={() => onChange(conditions.filter((_, idx) => idx !== i))}
            className="shrink-0 text-slate-400 hover:text-red-500"
            aria-label="Remove condition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...conditions, { column: availableColumns[0] ?? "", operator: "==", value: "" }])}
        className="text-[11px] font-medium text-[#1E3A5F] hover:underline"
      >
        + Add condition
      </button>
    </div>
  );
}
