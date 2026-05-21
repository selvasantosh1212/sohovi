"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface Props {
  headers: string[];
  rows: (string | null)[][];
  excludedIndices: Set<number>;
  fileName?: string;
}

export function ExportCleanedFile({ headers, rows, excludedIndices, fileName }: Props) {
  const [format, setFormat] = useState<"csv" | "excel">("csv");
  const [exporting, setExporting] = useState(false);

  const cleanedRows = rows.filter((_, i) => !excludedIndices.has(i));
  const removedCount = rows.length - cleanedRows.length;

  async function handleExport() {
    setExporting(true);
    try {
      if (format === "csv") {
        exportCSV(headers, cleanedRows, fileName);
      } else {
        await exportExcel(headers, cleanedRows, fileName);
      }
      toast.success(`Exported ${cleanedRows.length.toLocaleString()} clean rows`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 space-y-4">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 text-[#1E3A5F]" />
        <h3 className="font-semibold text-slate-800 text-sm">Export Cleaned Data</h3>
      </div>

      <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-lg font-bold text-slate-800">{rows.length.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Original rows</p>
        </div>
        <div>
          <p className="text-lg font-bold text-red-600">{removedCount.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Excluded</p>
        </div>
        <div>
          <p className="text-lg font-bold text-emerald-600">{cleanedRows.length.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Clean rows</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          {(["csv", "excel"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                format === f
                  ? "bg-[#1E3A5F] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={handleExport}
          disabled={exporting || cleanedRows.length === 0}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
          style={{ background: "#00C9A7" }}
        >
          <Download className="w-3.5 h-3.5" />
          {exporting ? "Exporting…" : `Export ${format.toUpperCase()}`}
        </button>
      </div>

      <p className="text-xs text-slate-400">
        All processing happens in your browser. No data is sent to any server.
      </p>
    </div>
  );
}

// ---- CSV export (pure client) -------------------------------------------

function exportCSV(headers: string[], rows: (string | null)[][], originalName?: string) {
  const escape = (v: string | null) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines = [
    headers.map(escape).join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = cleanedFileName(originalName, "csv");
  a.click();
  URL.revokeObjectURL(url);
}

// ---- Excel export (using ExcelJS) ----------------------------------------

async function exportExcel(headers: string[], rows: (string | null)[][], originalName?: string) {
  // Dynamic import to keep initial bundle small
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Cleaned Data");

  ws.addRow(headers);
  for (const row of rows) {
    ws.addRow(row.map((v) => v ?? ""));
  }

  // Style header row
  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E3A5F" },
  };
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = cleanedFileName(originalName, "xlsx");
  a.click();
  URL.revokeObjectURL(url);
}

function cleanedFileName(original?: string, ext?: string): string {
  const base = original
    ? original.replace(/\.[^/.]+$/, "")
    : "cleaned_data";
  return `${base}_cleaned.${ext ?? "csv"}`;
}
