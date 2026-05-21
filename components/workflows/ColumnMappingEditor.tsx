"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  sourceColumns: string[];   // columns from last uploaded file
  targetColumns?: string[];  // optional canonical schema to map to
  value: Record<string, string>;
  onChange: (mappings: Record<string, string>) => void;
}

export function ColumnMappingEditor({
  sourceColumns,
  targetColumns,
  value,
  onChange,
}: Props) {
  const [newSource, setNewSource] = useState(sourceColumns[0] ?? "");
  const [newTarget, setNewTarget] = useState("");

  function addMapping() {
    if (!newSource || !newTarget.trim()) return;
    onChange({ ...value, [newSource]: newTarget.trim() });
    setNewTarget("");
  }

  function removeMapping(key: string) {
    const next = { ...value };
    delete next[key];
    onChange(next);
  }

  const entries = Object.entries(value);

  return (
    <div className="space-y-3">
      {/* Existing mappings */}
      {entries.length > 0 ? (
        <div className="space-y-1.5">
          {entries.map(([src, tgt]) => (
            <div
              key={src}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <span className="flex-1 font-mono text-slate-700 truncate">{src}</span>
              <span className="text-slate-300">→</span>
              <span className="flex-1 font-mono text-[#00C9A7] truncate">{tgt}</span>
              <button
                type="button"
                onClick={() => removeMapping(src)}
                className="p-1 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">No column mappings defined.</p>
      )}

      {/* Add new mapping */}
      <div className="flex items-center gap-2">
        {sourceColumns.length > 0 ? (
          <select
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            className="flex-1 h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring"
          >
            {sourceColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="Source column"
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            className="flex-1 h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring"
          />
        )}
        <span className="text-slate-400 text-sm">→</span>
        {targetColumns && targetColumns.length > 0 ? (
          <select
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            className="flex-1 h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring"
          >
            <option value="">Select target…</option>
            {targetColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="Target column name"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            className="flex-1 h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring"
          />
        )}
        <button
          type="button"
          onClick={addMapping}
          disabled={!newSource || !newTarget.trim()}
          className="flex items-center gap-1 rounded-lg bg-[#1E3A5F] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
        >
          <Plus className="w-3 h-3" />Add
        </button>
      </div>
    </div>
  );
}
