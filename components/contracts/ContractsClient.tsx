"use client";

import { useState, useTransition } from "react";
import { FileCheck2, FileX2, Plus, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  createContract,
  deleteContract,
  setContractActive,
} from "@/app/actions/contracts";
import type { DataContract, ContractEvaluation } from "@/types/contracts.types";

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ContractsClient({
  assetId,
  contracts,
  evaluations,
}: {
  assetId: string;
  contracts: DataContract[];
  evaluations: Record<string, ContractEvaluation[]>;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [threshold, setThreshold] = useState(95);
  const [noSchemaChange, setNoSchemaChange] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function add() {
    setError(null);
    startTransition(async () => {
      try {
        await createContract({
          asset_id: assetId,
          name,
          min_pass_threshold: threshold,
          require_no_schema_change: noSchemaChange,
        });
        setName("");
        setAdding(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not create that contract.");
      }
    });
  }

  return (
    <div className="space-y-4">
      {contracts.map((c) => {
        const runs = evaluations[c.id] ?? [];
        const latest = runs[0];
        return (
          <Card key={c.id} className="p-5 border border-[#EEF0F3] rounded-2xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-800">{c.name}</h3>
                  {latest && (
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        latest.passed
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {latest.passed ? (
                        <FileCheck2 className="w-3 h-3" />
                      ) : (
                        <FileX2 className="w-3 h-3" />
                      )}
                      {latest.passed ? "Accepted" : "Rejected"}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-slate-500 mt-1">
                  Requires a score of at least {c.min_pass_threshold}
                  {c.require_no_schema_change && ", and no schema change"}
                  {c.required_rule_ids.length === 0
                    ? ", with every rule passing."
                    : `, with ${c.required_rule_ids.length} named rule(s) passing.`}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    startTransition(() => setContractActive(c.id, !c.is_active).then(() => {}))
                  }
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
                    c.is_active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                >
                  {c.is_active ? "Active" : "Paused"}
                </button>
                <button
                  onClick={() => startTransition(() => deleteContract(c.id).then(() => {}))}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Delete this contract"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {latest && !latest.passed && latest.failures.length > 0 && (
              <div className="rounded-xl bg-red-50/60 p-3 space-y-1">
                <p className="text-[12px] font-semibold text-red-800">
                  Why this file was rejected
                </p>
                {latest.failures.slice(0, 8).map((f, i) => (
                  <p key={i} className="text-[12px] text-red-700">
                    · {f.detail}
                  </p>
                ))}
                {latest.failures.length > 8 && (
                  <p className="text-[11px] text-red-600">
                    …and {latest.failures.length - 8} more.
                  </p>
                )}
              </div>
            )}

            {runs.length > 0 ? (
              <div className="flex gap-1.5 flex-wrap pt-1">
                {runs.slice(0, 20).map((r) => (
                  <span
                    key={r.id}
                    title={`${formatDate(r.evaluated_at)} — ${r.passed ? "accepted" : "rejected"}${
                      r.overall_score != null ? ` (score ${r.overall_score})` : ""
                    }`}
                    className={`w-5 h-5 rounded ${r.passed ? "bg-emerald-400" : "bg-red-400"}`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-slate-400">
                No files judged yet. The next run of this asset will be evaluated.
              </p>
            )}
          </Card>
        );
      })}

      {adding ? (
        <Card className="p-5 border border-[#EEF0F3] rounded-2xl space-y-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Monthly vendor invoice file"
            className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-[13px] text-slate-600">Minimum DQ score</label>
            <input
              type="number"
              min={0}
              max={100}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-20 rounded-lg border border-input bg-transparent px-2 py-1 text-[13px] outline-none focus-visible:border-ring"
            />
            <label className="inline-flex items-center gap-2 text-[13px] text-slate-600">
              <input
                type="checkbox"
                checked={noSchemaChange}
                onChange={(e) => setNoSchemaChange(e.target.checked)}
              />
              Reject on any schema change
            </label>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={add}
              disabled={pending || !name.trim()}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#1A1A2E" }}
            >
              {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Create contract
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setError(null);
              }}
              className="text-[13px] font-medium px-4 py-2 rounded-full border border-[#EEF0F3] text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-full border border-[#EEF0F3] bg-white hover:bg-slate-50 transition-colors text-slate-700"
        >
          <Plus className="w-3.5 h-3.5" />
          New contract
        </button>
      )}
    </div>
  );
}
