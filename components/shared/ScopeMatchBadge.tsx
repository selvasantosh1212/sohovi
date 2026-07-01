import { Filter, AlertTriangle } from "lucide-react";

interface Props {
  matchedRows: number;
  totalRows: number;
  hasConditions: boolean;
}

export function ScopeMatchBadge({ matchedRows, totalRows, hasConditions }: Props) {
  if (!hasConditions) return null;

  if (matchedRows === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        <AlertTriangle className="w-3 h-3" />
        0 of {totalRows.toLocaleString()} rows match — check column names and values
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
      <Filter className="w-3 h-3" />
      {matchedRows.toLocaleString()} of {totalRows.toLocaleString()} rows match this filter
    </span>
  );
}
