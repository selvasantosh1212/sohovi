"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAlert } from "@/app/actions/alerts";
import type { DataAsset } from "@/types/app.types";

interface Props {
  assets: DataAsset[];
  onCreated?: () => void;
}

const CONDITIONS = [
  { value: "score_drop", label: "Score drop below threshold" },
  { value: "schema_change", label: "Schema change detected" },
  { value: "rule_failure", label: "Rule failure rate exceeds threshold" },
  { value: "anomaly", label: "Anomaly detected" },
] as const;

export function AlertRuleForm({ assets, onCreated }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [assetId, setAssetId] = useState(assets[0]?.id ?? "");
  const [name, setName] = useState("");
  const [condition, setCondition] = useState<typeof CONDITIONS[number]["value"]>("score_drop");
  const [threshold, setThreshold] = useState("80");

  const needsThreshold = condition === "score_drop" || condition === "rule_failure";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!assetId || !name.trim()) return;
    setLoading(true);
    try {
      await createAlert({
        asset_id: assetId,
        name: name.trim(),
        condition,
        threshold_value: needsThreshold ? Number(threshold) : null,
      });
      toast.success("Alert created");
      setName("");
      router.refresh();
      onCreated?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create alert");
    } finally {
      setLoading(false);
    }
  }

  if (assets.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        Create a data asset first before setting up alerts.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Alert name */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Alert name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Customer data score drop"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
        />
      </div>

      {/* Asset */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Data Asset</label>
        <select
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
        >
          {assets.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Condition</label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as typeof condition)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
        >
          {CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Threshold (conditional) */}
      {needsThreshold && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            {condition === "score_drop" ? "Score threshold (0–100)" : "Failure rate % threshold"}
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]"
          />
          <p className="text-xs text-slate-400">
            {condition === "score_drop"
              ? "Trigger if overall DQ score falls below this value"
              : "Trigger if rule failure rate exceeds this percentage"}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: "#1A1A2E" }}
      >
        {loading ? "Creating…" : "Create Alert Rule"}
      </button>
    </form>
  );
}
