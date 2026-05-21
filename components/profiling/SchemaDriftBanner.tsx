"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";

interface Props {
  removedColumns: string[];
  assetId: string;
}

export function SchemaDriftBanner({ removedColumns, assetId }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || removedColumns.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800">
          Schema changed —{" "}
          {removedColumns.length === 1
            ? "1 column removed"
            : `${removedColumns.length} columns removed`}
        </p>
        <p className="text-xs text-amber-700 mt-0.5">
          <span className="font-mono">
            {removedColumns.join(", ")}
          </span>
          {" "}— rules targeting {removedColumns.length === 1 ? "this column" : "these columns"} won&apos;t run.
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href={`/dashboard/assets/${assetId}/rules`}
          className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2"
        >
          Review Rules →
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-0.5 rounded text-amber-400 hover:text-amber-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
