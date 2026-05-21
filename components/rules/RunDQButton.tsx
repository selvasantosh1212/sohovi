"use client";

import { useRouter } from "next/navigation";
import { useDQRunner } from "@/hooks/useDQRunner";
import { useFileStore } from "@/store/fileStore";
import type { DQRule } from "@/types/app.types";
import type { RuleConfig } from "@/types/dq.types";

interface Props {
  assetId: string;
  rules: DQRule[];
}

export function RunDQButton({ assetId, rules }: Props) {
  const router = useRouter();
  const { status, progress, error, startRun } = useDQRunner();
  const fileData = useFileStore((s) => s.data);

  const activeRules: RuleConfig[] = rules
    .filter((r) => r.is_active)
    .map((r) => ({
      id: r.id,
      column_name: r.column_name,
      dimension: r.dimension,
      rule_type: r.rule_type,
      parameters: r.parameters,
      threshold: r.threshold,
      weight: r.weight,
      is_active: r.is_active,
    }));

  async function handleRun() {
    await startRun(activeRules, assetId);
    // Navigate to scoring page after run
    router.push(`/dashboard/assets/${assetId}/scoring`);
  }

  if (!fileData) {
    return (
      <span className="text-xs text-slate-400 italic">
        Upload a file to enable DQ run
      </span>
    );
  }

  if (status === "running") {
    const pct =
      progress
        ? Math.round(((progress.ruleIndex + 1) / progress.totalRules) * 100)
        : 0;
    return (
      <div className="flex items-center gap-3">
        <div className="text-xs text-slate-500 max-w-[200px] truncate">
          {progress?.label ?? "Running…"}
        </div>
        <div className="h-1.5 w-32 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#00C9A7] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={activeRules.length === 0}
        onClick={handleRun}
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "#1E3A5F", color: "#fff" }}
      >
        Run DQ Check
        {activeRules.length > 0 && (
          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
            {activeRules.length}
          </span>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
