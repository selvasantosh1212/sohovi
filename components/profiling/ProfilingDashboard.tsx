"use client";

import { useState, useMemo } from "react";
import { Download, Search, ShieldAlert, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ColumnProfileCard } from "./ColumnProfileCard";
import type { ColumnProfile } from "@/types/profiling.types";
import type { DQGlossaryEntry } from "@/types/dq.types";
import { buildColumnNarrative } from "@/lib/profiling/narrative";
import { buildDQGlossary } from "@/lib/profiling/dq-glossary";
import { explainOutlier } from "@/lib/profiling/value-report-export";

type SortKey = "file_order" | "name" | "null_pct" | "unique_pct";
type SortDir = "asc" | "desc";

interface ProfilingDashboardProps {
  profiles: ColumnProfile[];
  fileName: string;
  totalRows: number;
  sampleMode: boolean;
}

// One row per distinct value/pattern per column, with the "Column Name" cell
// merged + shaded per group so column boundaries read clearly in Excel.
function addFrequencySheet(
  wb: import("exceljs").Workbook,
  name: string,
  headerArgb: string,
  headers: [string, string, string, string],
  profiles: ColumnProfile[],
  getItems: (p: ColumnProfile) => { label: string; count: number; pct: number }[],
  emptyLabel: string,
) {
  const white = { argb: "FFFFFFFF" };
  const altFillArgb = "FFF1F5F9"; // slate-100
  const borderArgb = "FFE2E8F0"; // slate-200

  const ws = wb.addWorksheet(name);
  ws.addRow(headers);
  const hdr = ws.getRow(1);
  hdr.font = { bold: true, color: white };
  hdr.fill = { type: "pattern", pattern: "solid", fgColor: { argb: headerArgb } };
  hdr.alignment = { vertical: "middle" };
  ws.views = [{ state: "frozen", ySplit: 1 }];

  profiles.forEach((p, groupIdx) => {
    const items = getItems(p);
    const startRow = ws.rowCount + 1;
    if (items.length === 0) {
      ws.addRow([p.column_name, emptyLabel, 0, 0]);
    } else {
      for (const item of items) {
        ws.addRow([p.column_name, item.label, item.count, item.pct]);
      }
    }
    const endRow = ws.rowCount;

    if (groupIdx % 2 === 1) {
      for (let r = startRow; r <= endRow; r++) {
        ws.getRow(r).fill = { type: "pattern", pattern: "solid", fgColor: { argb: altFillArgb } };
      }
    }
    if (endRow > startRow) {
      ws.mergeCells(startRow, 1, endRow, 1);
    }
    const nameCell = ws.getCell(startRow, 1);
    nameCell.font = { bold: true };
    nameCell.alignment = { vertical: "middle", horizontal: "left" };

    ws.getRow(endRow).eachCell((cell) => {
      cell.border = { bottom: { style: "thin", color: { argb: borderArgb } } };
    });
  });

  ws.getColumn(1).width = 28;
  ws.getColumn(2).width = 32;
  ws.getColumn(3).width = 12;
  ws.getColumn(4).width = 16;
  return ws;
}

async function exportProfilingXLSX(
  profiles: ColumnProfile[],
  fileName: string,
  glossary: DQGlossaryEntry[]
) {
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
    "Outlier Count", "Duplicate Groups", "Duplicate Rows", "Top Patterns", "PII Detected", "PII Type",
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
      p.duplicate_value_count ?? 0,
      p.duplicate_row_count ?? 0,
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
  addFrequencySheet(
    wb,
    "Values",
    tealArgb,
    ["Column Name", "Value", "Count", "Percentage (%)"],
    profiles,
    (p) => p.value_frequency.map((f) => ({ label: f.value, count: f.count, pct: f.pct })),
    "(no values)",
  );

  // ── Sheet 3: Patterns ─────────────────────────────────────────────────────
  addFrequencySheet(
    wb,
    "Patterns",
    navyArgb,
    ["Column Name", "Pattern", "Count", "Percentage (%)"],
    profiles,
    (p) => p.pattern_summary.map((pt) => ({ label: pt.pattern, count: pt.count, pct: pt.pct })),
    "(no patterns)",
  );

  // ── Sheet 4: Column Descriptions ────────────────────────────────────────
  const narrativeWs = wb.addWorksheet("Column Descriptions");
  narrativeWs.addRow(["Column Name", "Description"]);
  const narrHdr = narrativeWs.getRow(1);
  narrHdr.font = { bold: true, color: white };
  narrHdr.fill = { type: "pattern", pattern: "solid", fgColor: { argb: tealArgb } };
  narrHdr.alignment = { vertical: "middle" };
  narrativeWs.views = [{ state: "frozen", ySplit: 1 }];

  for (const p of profiles) {
    const row = narrativeWs.addRow([p.column_name, buildColumnNarrative(p, p.column_name)]);
    row.getCell(2).alignment = { wrapText: true, vertical: "top" };
  }
  narrativeWs.getColumn(1).width = 28;
  narrativeWs.getColumn(2).width = 90;

  // ── Sheet 5: DQ Glossary ────────────────────────────────────────────────
  const glossaryWs = wb.addWorksheet("DQ Glossary");
  const glossaryHeaders = [
    "Column Name", "Dimension", "Definition", "Why It Applies Here",
    "Confidence (%)", "Suggested Checks",
  ];
  glossaryWs.addRow(glossaryHeaders);
  const glossHdr = glossaryWs.getRow(1);
  glossHdr.font = { bold: true, color: white };
  glossHdr.fill = { type: "pattern", pattern: "solid", fgColor: { argb: navyArgb } };
  glossHdr.alignment = { vertical: "middle" };
  glossaryWs.views = [{ state: "frozen", ySplit: 1 }];

  for (const g of glossary) {
    const row = glossaryWs.addRow([
      g.column_name,
      g.dimension,
      g.definition,
      g.rationale,
      Math.round(g.confidence * 100),
      g.rule_types.join(", ").replace(/_/g, " "),
    ]);
    row.getCell(3).alignment = { wrapText: true, vertical: "top" };
    row.getCell(4).alignment = { wrapText: true, vertical: "top" };
  }
  glossaryWs.getColumn(1).width = 24;
  glossaryWs.getColumn(2).width = 14;
  glossaryWs.getColumn(3).width = 50;
  glossaryWs.getColumn(4).width = 50;
  glossaryWs.getColumn(5).width = 14;
  glossaryWs.getColumn(6).width = 36;

  // ── Sheet 6: Outliers ──────────────────────────────────────────────────────
  // One row per flagged outlier value — includes a Reason column explaining why
  // the value was flagged so the report is self-explanatory.
  const outlierArgb = "FFFBBF24"; // amber-400
  const outlierWs = wb.addWorksheet("Outliers");
  outlierWs.addRow(["Column Name", "Value", "Deviation (σ)", "Method", "Reason"]);
  const outHdr = outlierWs.getRow(1);
  outHdr.font = { bold: true, color: white };
  outHdr.fill = { type: "pattern", pattern: "solid", fgColor: { argb: outlierArgb } };
  outHdr.alignment = { vertical: "middle" };
  outlierWs.views = [{ state: "frozen", ySplit: 1 }];

  const altFillArgb = "FFF1F5F9";
  const borderArgb = "FFE2E8F0";
  profiles.forEach((p, groupIdx) => {
    if (!p.outlier_values || p.outlier_values.length === 0) return;
    const mean = p.avg_value ?? 0;
    const std = p.std_dev ?? 0;
    const sorted = [...p.outlier_values].sort((a, b) => a - b);
    const startRow = outlierWs.rowCount + 1;
    for (const v of sorted) {
      const deviation = std > 0 ? Math.round(Math.abs(v - mean) / std * 10) / 10 : 0;
      outlierWs.addRow([p.column_name, v, deviation, p.outlier_method ?? "zscore", explainOutlier(v, p)]);
    }
    const endRow = outlierWs.rowCount;
    if (groupIdx % 2 === 1) {
      for (let r = startRow; r <= endRow; r++) {
        outlierWs.getRow(r).fill = { type: "pattern", pattern: "solid", fgColor: { argb: altFillArgb } };
      }
    }
    if (endRow > startRow) outlierWs.mergeCells(startRow, 1, endRow, 1);
    const nc = outlierWs.getCell(startRow, 1);
    nc.font = { bold: true };
    nc.alignment = { vertical: "middle", horizontal: "left" };
    outlierWs.getRow(endRow).eachCell((cell) => {
      cell.border = { bottom: { style: "thin", color: { argb: borderArgb } } };
    });
  });
  outlierWs.getColumn(1).width = 28;
  outlierWs.getColumn(2).width = 14;
  outlierWs.getColumn(3).width = 14;
  outlierWs.getColumn(4).width = 10;
  outlierWs.getColumn(5).width = 80;
  outlierWs.getColumn(5).alignment = { wrapText: true };

  // ── Sheet 7: Duplicates ───────────────────────────────────────────────────
  // One row per distinct value that appears more than once, sorted by occurrence count desc.
  addFrequencySheet(
    wb,
    "Duplicates",
    navyArgb,
    ["Column Name", "Value", "Occurrences", "% of Rows"],
    profiles,
    (p) => (p.duplicate_values ?? []).map((d) => ({ label: d.value, count: d.count, pct: d.pct })),
    "(no duplicates)",
  );

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

  const glossary = useMemo(() => buildDQGlossary(profiles), [profiles]);
  const glossaryByColumn = useMemo(() => {
    const map = new Map<string, DQGlossaryEntry[]>();
    for (const g of glossary) {
      const arr = map.get(g.column_name) ?? [];
      arr.push(g);
      map.set(g.column_name, arr);
    }
    return map;
  }, [glossary]);

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
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
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
        </div>

        {/* Download button */}
        <button
          onClick={() => exportProfilingXLSX(profiles, fileName, glossary)}
          className="inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          Download Excel
        </button>
      </div>

      {/* Column cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filtered.map((profile, idx) => (
          <ColumnProfileCard
            key={profile.column_name || idx}
            profile={profile}
            glossaryEntries={glossaryByColumn.get(profile.column_name) ?? []}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-slate-400 py-8">No columns match your filter.</p>
      )}
    </div>
  );
}
