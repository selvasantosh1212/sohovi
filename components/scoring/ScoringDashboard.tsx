"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDQStore } from "@/store/dqStore";
import { useFileStore } from "@/store/fileStore";
import { ScoreGauge } from "./ScoreGauge";
import { ColumnScoreGrid } from "./ColumnScoreGrid";
import { ScoreTransparencyPanel } from "./ScoreTransparencyPanel";
import { FailedRecordsTable } from "./FailedRecordsTable";
import { saveRunResult } from "@/app/actions/runs";
import type { DQRunResult } from "@/types/dq.types";
import { useProfilingStore } from "@/store/profilingStore";
import Link from "next/link";

interface Props {
  assetId: string;
  fileName: string;
}

export function ScoringDashboard({ assetId, fileName }: Props) {
  const router = useRouter();
  const result = useDQStore((s) => s.result);
  const fileData = useFileStore((s) => s.data);
  const schemaDiff = useFileStore((s) => s.schemaDiff);
  const columnProfiles = useProfilingStore((s) => s.profiles);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-3">
        <p className="text-lg font-semibold text-slate-600">No DQ run in memory</p>
        <p className="text-sm text-slate-400">
          Go to the Rules page to run a DQ check first.
        </p>
        <Link
          href={`/dashboard/assets/${assetId}/rules`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1E3A5F] hover:underline"
        >
          ← Back to Rules
        </Link>
      </div>
    );
  }

  const { overall_score, column_scores, rule_results } = result;

  function handleSave() {
    if (!fileData || !result) return;
    setSaveStatus("saving");
    setSaveError(null);

    startTransition(async () => {
      try {
        await saveRunResult(
          {
            asset_id: assetId,
            file_name: fileData.fileName,
            file_size_bytes: fileData.fileSize ?? 0,
            row_count: fileData.rows.length,
            column_count: fileData.headers.length,
            schema_changed: schemaDiff !== null,
            schema_diff: schemaDiff ?? null,
            column_profiles: columnProfiles ?? [],
          },
          result
        );
        setSaveStatus("saved");
        router.refresh();
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Save failed");
        setSaveStatus("error");
      }
    });
  }

  const displayedColumn = selectedColumn ?? null;
  const passCount = rule_results.filter((r) => r.status === "pass").length;
  const failCount = rule_results.filter((r) => r.status === "fail").length;

  return (
    <div className="space-y-6">
      {/* Top summary bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <ScoreGauge score={overall_score} size="md" label="Overall DQ Score" />
          <div className="space-y-2">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-slate-400">Rules</p>
                <p className="text-2xl font-bold text-slate-800">{rule_results.length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Passed Rules</p>
                <p className="text-2xl font-bold text-emerald-600">{passCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Failed Rules</p>
                <p className="text-2xl font-bold text-red-500">{failCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Columns</p>
                <p className="text-2xl font-bold text-slate-800">{column_scores.length}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Run at {new Date(result.run_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === "saving" || saveStatus === "saved"}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#00C9A7", color: "#0d1e33" }}
          >
            {saveStatus === "saving"
              ? "Saving…"
              : saveStatus === "saved"
              ? "Saved ✓"
              : "Save Run to History"}
          </button>
          {saveError && (
            <p className="text-xs text-red-500">{saveError}</p>
          )}
        </div>
      </div>

      {/* Three-column layout */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Column scores */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Column Scores</h2>
          <p className="text-xs text-slate-400">Click a column to filter results.</p>
          <ColumnScoreGrid
            columnScores={column_scores}
            onSelectColumn={(name) =>
              setSelectedColumn((prev) => (prev === name ? null : name))
            }
            selectedColumn={selectedColumn}
          />
        </div>

        {/* Transparency panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Rule Breakdown</h2>
            {displayedColumn && (
              <button
                type="button"
                onClick={() => setSelectedColumn(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear filter ×
              </button>
            )}
          </div>
          {displayedColumn && (
            <p className="text-xs font-medium text-[#1E3A5F] font-mono">{displayedColumn}</p>
          )}
          <ScoreTransparencyPanel
            ruleResults={rule_results}
            columnName={displayedColumn}
          />
        </div>

        {/* Failed records */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Failed Records</h2>
          {fileData ? (
            <FailedRecordsTable
              ruleResults={rule_results}
              headers={fileData.headers}
              rows={fileData.rows}
              columnFilter={displayedColumn}
            />
          ) : (
            <p className="text-xs text-slate-400">
              File data cleared from memory — reload the file to see individual records.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
