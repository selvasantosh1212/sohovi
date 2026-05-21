"use client";

import { useState } from "react";
import { Download, FileText, Table } from "lucide-react";
import { toast } from "sonner";
import { ScoreBar, ScoreBadge } from "@/components/shared/ScoreBadge";
import type { DataAsset, AssetRun } from "@/types/app.types";

interface AssetWithRuns {
  asset: DataAsset;
  runs: AssetRun[];
}

interface Props {
  assetRuns: AssetWithRuns[];
}

export function ReportsClient({ assetRuns }: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(assetRuns.map((ar) => ar.asset.id))
  );
  const [exporting, setExporting] = useState(false);

  function toggleAsset(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === assetRuns.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(assetRuns.map((ar) => ar.asset.id)));
    }
  }

  const selectedAssets = assetRuns.filter((ar) => selected.has(ar.asset.id));

  async function handleExportPDF() {
    setExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(30, 58, 95);
      doc.text("Sohovi DQ Report", 40, 50);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 68);

      // Summary table
      const summaryRows = selectedAssets.map((ar) => {
        const latest = ar.runs[0];
        return [
          ar.asset.name,
          ar.asset.catalog?.name ?? "—",
          ar.runs.length.toString(),
          latest?.overall_dq_score !== null && latest?.overall_dq_score !== undefined
            ? `${latest.overall_dq_score}`
            : "—",
          latest ? new Date(latest.run_at).toLocaleDateString() : "Never",
        ];
      });

      autoTable(doc, {
        startY: 85,
        head: [["Asset", "Catalog", "Runs", "Latest Score", "Last Run"]],
        body: summaryRows,
        headStyles: { fillColor: [30, 58, 95] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { fontSize: 9, cellPadding: 5 },
        margin: { left: 40, right: 40 },
      });

      // Per-asset run history
      for (const ar of selectedAssets) {
        if (ar.runs.length === 0) continue;

        // @ts-expect-error autoTable adds lastAutoTable to doc
        const finalY = (doc.lastAutoTable?.finalY ?? 85) + 20;

        // Check if we need a new page
        if (finalY > doc.internal.pageSize.getHeight() - 100) {
          doc.addPage();
        }

        const yPos = finalY > doc.internal.pageSize.getHeight() - 100 ? 40 : finalY;

        doc.setFontSize(11);
        doc.setTextColor(30, 58, 95);
        // @ts-expect-error autoTable adds lastAutoTable to doc
        doc.text(ar.asset.name, 40, (doc.lastAutoTable?.finalY ?? 85) + 30);

        const runRows = ar.runs.slice(0, 10).map((r) => [
          new Date(r.run_at).toLocaleDateString(),
          r.file_name,
          r.row_count?.toLocaleString() ?? "—",
          r.overall_dq_score !== null ? `${r.overall_dq_score}` : "—",
          r.schema_changed ? "Yes" : "No",
          r.status,
        ]);

        autoTable(doc, {
          // @ts-expect-error autoTable adds lastAutoTable to doc
          startY: (doc.lastAutoTable?.finalY ?? 85) + 35,
          head: [["Date", "File", "Rows", "Score", "Schema Δ", "Status"]],
          body: runRows,
          headStyles: { fillColor: [0, 201, 167] },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          styles: { fontSize: 8, cellPadding: 4 },
          margin: { left: 40, right: 40 },
        });
        void yPos; // suppress unused var
      }

      doc.save(`sohovi_dq_report_${Date.now()}.pdf`);
      toast.success("PDF exported");
    } catch (err) {
      console.error(err);
      toast.error("PDF export failed");
    } finally {
      setExporting(false);
    }
  }

  async function handleExportExcel() {
    setExporting(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const wb = new ExcelJS.Workbook();
      wb.creator = "Sohovi";
      wb.created = new Date();

      // Summary sheet
      const summaryWs = wb.addWorksheet("Summary");
      summaryWs.addRow(["Asset", "Catalog", "Total Runs", "Latest Score", "Last Run Date", "Status"]);
      summaryWs.getRow(1).font = { bold: true };
      summaryWs.getRow(1).fill = {
        type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A5F" },
      };
      summaryWs.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

      for (const ar of selectedAssets) {
        const latest = ar.runs[0];
        const score = latest?.overall_dq_score;
        summaryWs.addRow([
          ar.asset.name,
          ar.asset.catalog?.name ?? "",
          ar.runs.length,
          score ?? "",
          latest ? new Date(latest.run_at).toLocaleDateString() : "Never",
          score === null || score === undefined ? "No data" :
            score >= 95 ? "Excellent" : score >= 80 ? "Good" : score >= 60 ? "Warning" : "Critical",
        ]);
      }
      summaryWs.columns.forEach((col) => { col.width = 20; });

      // Per-asset run detail sheets
      for (const ar of selectedAssets) {
        if (ar.runs.length === 0) continue;
        const ws = wb.addWorksheet(ar.asset.name.slice(0, 31));
        ws.addRow(["Run Date", "File Name", "Row Count", "Column Count", "Overall Score", "Schema Changed", "Status", "Notes"]);
        ws.getRow(1).font = { bold: true };
        ws.getRow(1).fill = {
          type: "pattern", pattern: "solid", fgColor: { argb: "FF00C9A7" },
        };
        ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

        for (const run of ar.runs) {
          ws.addRow([
            new Date(run.run_at).toLocaleString(),
            run.file_name,
            run.row_count ?? "",
            run.column_count ?? "",
            run.overall_dq_score ?? "",
            run.schema_changed ? "Yes" : "No",
            run.status,
            run.notes ?? "",
          ]);
        }
        ws.columns.forEach((col) => { col.width = 18; });
      }

      const buf = await wb.xlsx.writeBuffer();
      const blob = new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sohovi_dq_report_${Date.now()}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Excel exported");
    } catch (err) {
      console.error(err);
      toast.error("Excel export failed");
    } finally {
      setExporting(false);
    }
  }

  if (assetRuns.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-2">
        <FileText className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-slate-600 font-medium">No assets yet</p>
        <p className="text-sm text-slate-400">Create data assets and run DQ checks to generate reports.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleExportPDF}
          disabled={exporting || selected.size === 0}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#1A1A2E" }}
        >
          <FileText className="w-4 h-4" />
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
        <button
          onClick={handleExportExcel}
          disabled={exporting || selected.size === 0}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <Table className="w-4 h-4" />
          {exporting ? "Exporting…" : "Export Excel"}
        </button>
        <span className="text-sm text-slate-500">
          {selected.size} / {assetRuns.length} asset{assetRuns.length !== 1 ? "s" : ""} selected
        </span>
      </div>

      {/* Asset table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selected.size === assetRuns.length}
                  onChange={toggleAll}
                  className="rounded"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Asset</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Catalog</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Runs</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Latest Score</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Trend (last 5)</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Last Run</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assetRuns.map((ar) => {
              const latest = ar.runs[0];
              const last5 = ar.runs.slice(0, 5).reverse();
              return (
                <tr key={ar.asset.id} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selected.has(ar.asset.id)}
                      onChange={() => toggleAsset(ar.asset.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{ar.asset.name}</p>
                    {ar.asset.source_system && (
                      <p className="text-xs text-slate-400">{ar.asset.source_system}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {ar.asset.catalog?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {ar.runs.length}
                  </td>
                  <td className="px-4 py-3">
                    {latest?.overall_dq_score !== null && latest?.overall_dq_score !== undefined ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{latest.overall_dq_score}</span>
                        <ScoreBadge score={latest.overall_dq_score} size="sm" />
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-end gap-0.5 h-8">
                      {last5.map((r, i) => {
                        const s = r.overall_dq_score ?? 0;
                        const color =
                          s >= 95 ? "#10B981" : s >= 80 ? "#00C9A7" : s >= 60 ? "#F59E0B" : "#EF4444";
                        return (
                          <div
                            key={i}
                            className="w-3 rounded-t"
                            style={{ height: `${Math.max(4, s * 0.32)}px`, background: color }}
                            title={`${s}`}
                          />
                        );
                      })}
                      {last5.length === 0 && (
                        <span className="text-xs text-slate-400">No runs</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {latest ? new Date(latest.run_at).toLocaleDateString() : "Never"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        Reports include run history for the selected assets. All exports happen in your browser.
      </p>
    </div>
  );
}
