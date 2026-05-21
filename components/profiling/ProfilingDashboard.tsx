"use client";

import { useState, useMemo } from "react";
import { Download, Search, ShieldAlert, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ColumnProfileCard } from "./ColumnProfileCard";
import type { ColumnProfile } from "@/types/profiling.types";

type SortKey = "file_order" | "name" | "null_pct" | "unique_pct";
type SortDir = "asc" | "desc";

interface ProfilingDashboardProps {
  profiles: ColumnProfile[];
  fileName: string;
  totalRows: number;
  sampleMode: boolean;
}

async function exportProfilingXLSX(profiles: ColumnProfile[], fileName: string) {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Sohovi";
  wb.created = new Date();

  const baseName = fileName.replace(/\.[^/.]+$/, "");
  const navyArgb = "FF1A1A2E";
  const tealArgb = "FF00C9A7";
  const white = { argb: "FFFFFFFF" };

  // ── Sheet 1: Summary ──────────────────────────────────────────────────────
  const summaryWs = wb.addWorksheet("Summary");
  const summaryHeaders = [
    "Column Name", "Type", "Row Count", "Null Count", "Null %",
    "Unique Count", "Unique %", "Min Value", "Max Value",
    "Avg Value", "Std Dev", "Min Length", "Max Length", "Avg Length",
    "Outlier Count", "Top Patterns", "PII Detected", "PII Type",
  ];
  summaryWs.addRow(summaryHeaders);
  const sumHdr = summaryWs.getRow(1);
  sumHdr.font = { bold: true, color: white };
  sumHdr.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navyArgb } };
  sumHdr.alignment = { vertical: "middle" };
  summaryWs.views = [{ state: "frozen", ySplit: 1 }];

  for (const p of profiles) {
    const topPatterns = (p.pattern_summary ?? [])
      .slice(0, 3)
      .map((pt) => `${pt.pattern} (${pt.count})`)
      .join("; ");
    summaryWs.addRow([
      p.column_name,
      p.inferred_type,
      p.row_count,
      p.null_count,
      p.null_pct,
      p.unique_count,
      p.unique_pct,
      p.min_value ?? "",
      p.max_value ?? "",
      p.avg_value ?? "",
      p.std_dev ?? "",
      p.min_length ?? "",
      p.max_length ?? "",
      p.avg_length ?? "",
      p.outlier_count ?? 0,
      topPatterns,
      p.pii_detected ? "Yes" : "No",
      p.pii_type ?? "",
    ]);
  }
  summaryWs.columns.forEach((col, i) => {
    col.width = i === 0 ? 28 : i <= 2 ? 12 : 14;
  });

  // ── Sheet 2: Values ───────────────────────────────────────────────────────
  // One row per distinct value per column: Column | Value | Count | Percentage
  const valuesWs = wb.addWorksheet("Values");
  valuesWs.addRow(["Column Name", "Value", "Count", "Percentage (%)"]);
  const valHdr = valuesWs.getRow(1);
  valHdr.font = { bold: true, color: white };
  valHdr.fill = { type: "pattern", pattern: "solid", fgColor: { argb: tealArgb } };
  valHdr.alignment = { vertical: "middle" };
  valuesWs.views = [{ state: "frozen", ySplit: 1 }];

  for (const p of profiles) {
    const freqs = p.value_frequency ?? p.top_values ?? [];
    if (freqs.length === 0) {
      valuesWs.addRow([p.column_name, "(no values)", 0, 0]);
    } else {
      for (const f of freqs) {
        valuesWs.addRow([
          p.column_name,
          f.value ?? "(null)",
          f.count,
          f.pct,
        ]);
      }
    }
  }
  valuesWs.getColumn(1).width = 28;
  valuesWs.getColumn(2).width = 32;
  valuesWs.getColumn(3).width = 12;
  valuesWs.getColumn(4).width = 16;

  // ── Sheet 3: Patterns ─────────────────────────────────────────────────────
  const patternsWs = wb.addWorksheet("Patterns");
  patternsWs.addRow(["Column Name", "Pattern", "Count", "Percentage (%)"]);
  const patHdr = patternsWs.getRow(1);
  patHdr.font = { bold: true, color: white };
  patHdr.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navyArgb } };
  patHdr.alignment = { vertical: "middle" };
  patternsWs.views = [{ state: "frozen", ySplit: 1 }];

  for (const p of profiles) {
    const patterns = p.pattern_summary ?? [];
    if (patterns.length === 0) {
      patternsWs.addRow([p.column_name, "(no patterns)", 0, 0]);
    } else {
      for (const pt of patterns) {
        patternsWs.addRow([p.column_name, pt.pattern, pt.count, pt.pct]);
      }
    }
  }
  patternsWs.getColumn(1).width = 28;
  patternsWs.getColumn(2).width = 32;
  patternsWs.getColumn(3).width = 12;
  patternsWs.getColumn(4).width = 16;

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${baseName}_profiling.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ProfilingDashboard({
  profiles,
  fileName,
  totalRows,
  sampleMode,
}: ProfilingDashboardProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("file_order");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [piiOnly, setPiiOnly] = useState(false);

  const piiCount = profiles.filter((p) => p.pii_detected).length;
  const avgNull = profiles.length
    ? Math.round(profiles.reduce((s, p) => s + p.null_pct, 0) / profiles.length)
    : 0;

  // Attach original file index before any filtering/sorting
  const profilesWithIdx = useMemo(
    () => profiles.map((p, i) => ({ ...p, _fileIdx: i })),
    [profiles]
  );

  const filtered = useMemo(() => {
    let result = profilesWithIdx;
    if (piiOnly) result = result.filter((p) => p.pii_detected);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.column_name.toLowerCase().includes(q));
    }
    if (sortKey === "file_order") {
      return [...result].sort((a, b) => {
        const mul = sortDir === "asc" ? 1 : -1;
        return mul * (a._fileIdx - b._fileIdx);
      });
    }
    return [...result].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return mul * a.column_name.localeCompare(b.column_name);
      if (sortKey === "null_pct") return mul * (a.null_pct - b.null_pct);
      return mul * (a.unique_pct - b.unique_pct);
    });
  }, [profilesWithIdx, search, sortKey, sortDir, piiOnly]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className="grid sm:grid-cols-4 gap-3">
        {[
          { label: "File", value: fileName, mono: true },
          { label: "Rows", value: totalRows.toLocaleString() + (sampleMode ? " (sampled)" : "") },
          { label: "Columns", value: String(profiles.length) },
          { label: "Avg Null %", value: `${avgNull}%`, warn: avgNull > 20 },
        ].map(({ label, value, mono, warn }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-100 bg-white p-4 flex flex-col gap-1"
          >
            <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
            <p
              className={[
                "text-sm font-semibold truncate",
                warn ? "text-amber-600" : "text-slate-800",
                mono ? "font-mono" : "",
              ].join(" ")}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* PII warning */}
      {piiCount > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              PII detected in {piiCount} column{piiCount !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-red-700 mt-0.5">
              Sample values for these columns are masked. Only masked values are shown below and stored.
            </p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="Filter columns…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(["file_order", "name", "null_pct", "unique_pct"] as SortKey[]).map((key) => {
            const labels: Record<SortKey, string> = {
              file_order: "File Order",
              name: "Name",
              null_pct: "Null %",
              unique_pct: "Unique %",
            };
            return (
              <button
                key={key}
                onClick={() => toggleSort(key)}
                className={[
                  "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors",
                  sortKey === key
                    ? "border-slate-300 bg-slate-100 text-slate-700 font-medium"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50",
                ].join(" ")}
              >
                {labels[key]}
                {sortKey === key ? (
                  sortDir === "asc" ? (
                    <SortAsc className="w-3 h-3" />
                  ) : (
                    <SortDesc className="w-3 h-3" />
                  )
                ) : null}
              </button>
            );
          })}

          {piiCount > 0 && (
            <button
              onClick={() => setPiiOnly((v) => !v)}
              className={[
                "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors",
                piiOnly
                  ? "border-red-300 bg-red-50 text-red-700 font-medium"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50",
              ].join(" ")}
            >
              <ShieldAlert className="w-3 h-3" />
              PII only
            </button>
          )}
        </div>

        {/* Download button */}
        <button
          onClick={() => exportProfilingXLSX(profiles, fileName)}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90 ml-auto"
          style={{ background: "#1A1A2E" }}
        >
          <Download className="w-3.5 h-3.5" />
          Download Excel
        </button>
      </div>

      {/* Column cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((profile, idx) => (
          <ColumnProfileCard key={profile.column_name || idx} profile={profile} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-slate-400 py-8">No columns match your filter.</p>
      )}
    </div>
  );
}
