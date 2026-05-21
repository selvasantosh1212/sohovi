"use client";

import { useState } from "react";
import { TableProperties, CheckCircle2 } from "lucide-react";

interface HeaderRowSelectorProps {
  previewRows: (string | null)[][];
  onConfirm: (rowIndex: number) => void;
}

export function HeaderRowSelector({ previewRows, onConfirm }: HeaderRowSelectorProps) {
  const [selectedRow, setSelectedRow] = useState(0);

  // Determine how many columns to show (up to 5)
  const maxCols = Math.min(5, Math.max(...previewRows.map((r) => r.length)));

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <TableProperties className="w-4 h-4 text-slate-500" />
        <p className="text-sm font-semibold text-slate-800">Select the header row</p>
        <p className="text-xs text-slate-400 ml-auto">Click a row number to select it as the header</p>
      </div>

      {/* Preview table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <tbody>
            {previewRows.map((row, rowIdx) => {
              const isSelected = selectedRow === rowIdx;
              return (
                <tr
                  key={rowIdx}
                  className={[
                    "border-b border-slate-100 last:border-0 cursor-pointer transition-colors",
                    isSelected ? "bg-[#1A1A2E]/5" : "hover:bg-slate-50",
                  ].join(" ")}
                  onClick={() => setSelectedRow(rowIdx)}
                >
                  {/* Row number cell */}
                  <td className="px-3 py-2.5 w-12 shrink-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold border transition-colors",
                          isSelected
                            ? "border-[#1A1A2E] bg-[#1A1A2E] text-white"
                            : "border-slate-200 text-slate-500",
                        ].join(" ")}
                      >
                        {rowIdx + 1}
                      </span>
                      {rowIdx === 0 && !isSelected && (
                        <span className="text-[9px] text-slate-400 uppercase tracking-wide">current</span>
                      )}
                    </div>
                  </td>

                  {/* Data cells */}
                  {Array.from({ length: maxCols }).map((_, colIdx) => {
                    const val = row[colIdx];
                    return (
                      <td
                        key={colIdx}
                        className={[
                          "px-3 py-2.5 max-w-[140px] truncate",
                          isSelected ? "font-semibold text-slate-800" : "text-slate-500",
                          val === null ? "text-slate-300 italic" : "",
                        ].join(" ")}
                        title={val ?? "(empty)"}
                      >
                        {val ?? <span className="text-[10px]">—</span>}
                      </td>
                    );
                  })}

                  {/* Header indicator */}
                  <td className="px-3 py-2.5 w-24">
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1A1A2E] bg-[#1A1A2E]/10 rounded-full px-2 py-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Header row
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirm button */}
      <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50">
        <p className="text-xs text-slate-500">
          {selectedRow === 0
            ? "Row 1 selected — this is the default."
            : `Row ${selectedRow + 1} will be used as column headers. Rows above it will be skipped.`}
        </p>
        <button
          type="button"
          onClick={() => onConfirm(selectedRow)}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90 shrink-0"
          style={{ background: "#1A1A2E" }}
        >
          Confirm & Profile →
        </button>
      </div>
    </div>
  );
}
