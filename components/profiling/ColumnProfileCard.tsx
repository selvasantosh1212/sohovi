"use client";

import { useState } from "react";
import { ShieldAlert, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ColumnProfile } from "@/types/profiling.types";

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  integer:  { bg: "bg-blue-50",    text: "text-blue-700" },
  float:    { bg: "bg-indigo-50",  text: "text-indigo-700" },
  boolean:  { bg: "bg-violet-50",  text: "text-violet-700" },
  date:     { bg: "bg-sky-50",     text: "text-sky-700" },
  datetime: { bg: "bg-cyan-50",    text: "text-cyan-700" },
  email:    { bg: "bg-teal-50",    text: "text-teal-700" },
  phone:    { bg: "bg-emerald-50", text: "text-emerald-700" },
  url:      { bg: "bg-lime-50",    text: "text-lime-700" },
  uuid:     { bg: "bg-amber-50",   text: "text-amber-700" },
  json:     { bg: "bg-orange-50",  text: "text-orange-700" },
  string:   { bg: "bg-slate-100",  text: "text-slate-600" },
  mixed:    { bg: "bg-rose-50",    text: "text-rose-700" },
};

function StatBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-slate-500 w-10 text-right">{value}%</span>
    </div>
  );
}

function OutlierDialog({
  open,
  onClose,
  profile,
}: {
  open: boolean;
  onClose: () => void;
  profile: ColumnProfile;
}) {
  const values = profile.outlier_values ?? [];
  const mean = profile.avg_value ?? 0;
  const std = profile.std_dev ?? 0;
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const avg = values.length > 0
    ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 1000) / 1000
    : 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Outliers in &ldquo;{profile.column_name}&rdquo;
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-slate-500">
          {profile.outlier_count} value{profile.outlier_count !== 1 ? "s" : ""} fall outside ±3 standard deviations from the mean ({mean} ± {std}).
        </p>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Min outlier", value: min },
            { label: "Avg outlier", value: avg },
            { label: "Max outlier", value: max },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-amber-50 py-2 px-1">
              <p className="text-xs text-amber-600">{label}</p>
              <p className="text-sm font-semibold text-amber-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Value list */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Outlier values {values.length < profile.outlier_count && `(showing ${values.length} of ${profile.outlier_count})`}
          </p>
          <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-3 py-1.5 text-left text-slate-500 font-medium">#</th>
                  <th className="px-3 py-1.5 text-left text-slate-500 font-medium">Value</th>
                  <th className="px-3 py-1.5 text-right text-slate-500 font-medium">Deviation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((v, i) => {
                  const deviation = std > 0 ? Math.round(Math.abs(v - mean) / std * 10) / 10 : 0;
                  return (
                    <tr key={i} className="hover:bg-amber-50/40">
                      <td className="px-3 py-1.5 text-slate-400 font-mono">{i + 1}</td>
                      <td className="px-3 py-1.5 font-mono font-medium text-amber-700">{v}</td>
                      <td className="px-3 py-1.5 text-right text-slate-500">{deviation}σ</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ColumnProfileCardProps {
  profile: ColumnProfile;
}

export function ColumnProfileCard({ profile }: ColumnProfileCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [outlierOpen, setOutlierOpen] = useState(false);
  const typeStyle = TYPE_COLORS[profile.inferred_type] ?? TYPE_COLORS.string;

  const totalRows = profile.row_count;

  return (
    <Card className="p-5 border border-slate-100 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-800 font-mono text-sm truncate">
              {profile.column_name}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeStyle.bg} ${typeStyle.text}`}
            >
              {profile.inferred_type}
            </span>
            {profile.pii_detected && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-700">
                <ShieldAlert className="w-3 h-3" />
                PII: {profile.pii_type}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {profile.row_count.toLocaleString()} rows · {profile.unique_count.toLocaleString()} unique
          </p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Null</span>
          <span>Unique</span>
        </div>
        <StatBar value={profile.null_pct} color={profile.null_pct > 20 ? "#EF4444" : "#94a3b8"} />
        <StatBar value={profile.unique_pct} color="#00C9A7" />
      </div>

      {/* Numeric stats */}
      {(profile.inferred_type === "integer" || profile.inferred_type === "float") &&
        profile.avg_value !== null && (
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Min", value: profile.min_value },
              { label: "Avg", value: String(profile.avg_value) },
              { label: "Max", value: profile.max_value },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-slate-50 py-2 px-1">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-semibold text-slate-700 truncate">{value ?? "—"}</p>
              </div>
            ))}
          </div>
        )}

      {/* Outliers */}
      {profile.outlier_count > 0 && (
        profile.outlier_values.length > 0 ? (
          <button
            type="button"
            onClick={() => setOutlierOpen(true)}
            className="flex items-center gap-1.5 text-xs text-amber-600 font-medium hover:text-amber-700 hover:underline text-left w-fit"
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {profile.outlier_count.toLocaleString()} outlier{profile.outlier_count !== 1 ? "s" : ""} detected (±3σ) — click to view
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {profile.outlier_count.toLocaleString()} outlier{profile.outlier_count !== 1 ? "s" : ""} detected (±3σ)
          </span>
        )
      )}

      {/* Value distribution — always visible for categorical columns */}
      {profile.top_values.length > 0 &&
        profile.inferred_type === "string" && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Value Breakdown
            </p>
            <div className="space-y-1.5">
              {profile.top_values.slice(0, 8).map((v, i) => (
                <div key={`${v.value ?? ""}-${i}`} className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-slate-700 truncate w-28 shrink-0" title={v.value}>
                    {v.value}
                  </span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${v.pct}%`, backgroundColor: "#00C9A7" }}
                    />
                  </div>
                  <span className="text-slate-500 w-20 text-right shrink-0">
                    {v.count.toLocaleString()}/{totalRows.toLocaleString()} ({v.pct}%)
                  </span>
                </div>
              ))}
              {profile.top_values.length > 8 && (
                <p className="text-xs text-slate-400">
                  +{profile.top_values.length - 8} more values — expand for full chart
                </p>
              )}
            </div>
          </div>
        )}

      {/* Expanded section */}
      {expanded && (
        <div className="space-y-4 pt-2 border-t border-slate-100">
          {/* All top value frequencies (chart view) */}
          {profile.top_values.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Top Values (Chart)
              </p>
              <div className="space-y-1.5">
                {profile.top_values.map((v) => (
                  <div key={v.value} className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-slate-700 truncate w-32 shrink-0" title={v.value}>
                      {v.value}
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${v.pct}%`, backgroundColor: "#1E3A5F" }}
                      />
                    </div>
                    <span className="text-slate-500 w-20 text-right shrink-0">
                      {v.count.toLocaleString()}/{totalRows.toLocaleString()} ({v.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patterns */}
          {profile.pattern_summary.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Patterns
              </p>
              <div className="space-y-1">
                {profile.pattern_summary.slice(0, 5).map((p) => (
                  <div key={p.pattern} className="flex items-center gap-2">
                    <code className="text-xs font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded truncate max-w-32">
                      {p.pattern}
                    </code>
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-slate-400"
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-10 text-right">{p.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample values */}
          {profile.sample_values.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Sample Values {profile.pii_detected && "(masked)"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.sample_values.slice(0, 8).map((v, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100 truncate max-w-40"
                  >
                    {String(v)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* String lengths */}
          {profile.avg_length !== null && (
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Min Len", value: profile.min_length },
                { label: "Avg Len", value: profile.avg_length },
                { label: "Max Len", value: profile.max_length },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-slate-50 py-2 px-1">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-slate-700">{value ?? "—"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Outlier popup */}
      {profile.outlier_count > 0 && profile.outlier_values.length > 0 && (
        <OutlierDialog
          open={outlierOpen}
          onClose={() => setOutlierOpen(false)}
          profile={profile}
        />
      )}
    </Card>
  );
}
