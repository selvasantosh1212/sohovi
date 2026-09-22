"use client";

import { useState, useTransition } from "react";
import { NotebookPen, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { upsertColumnNote, type ColumnNote } from "@/app/actions/column-notes";

interface ColumnNoteDrawerProps {
  assetId: string;
  columnName: string;
  note: ColumnNote | null;
}

const FIELDS = [
  {
    key: "source_description" as const,
    label: "Where it comes from",
    placeholder: "e.g. Salesforce Account.BillingCountry, synced nightly",
    rows: 2,
  },
  {
    key: "transformation_notes" as const,
    label: "What happens to it",
    placeholder: "e.g. uppercased and mapped to ISO-2 by the ETL job",
    rows: 2,
  },
];

/**
 * Per-column context notes — the "Lineage & context metadata" Team feature.
 *
 * Deliberately three free-text fields rather than a derived lineage graph:
 * this records what a person knows about a column, which is the part no
 * amount of profiling can infer.
 */
export function ColumnNoteDrawer({ assetId, columnName, note }: ColumnNoteDrawerProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    source_description: note?.source_description ?? "",
    transformation_notes: note?.transformation_notes ?? "",
    owner: note?.owner ?? "",
  });

  const hasNote =
    Boolean(note?.source_description) ||
    Boolean(note?.transformation_notes) ||
    Boolean(note?.owner);

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await upsertColumnNote({ asset_id: assetId, column_name: columnName, ...draft });
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save the note.");
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
          hasNote
            ? "bg-slate-800 text-white hover:bg-slate-700"
            : "bg-slate-50 text-slate-500 hover:bg-slate-100"
        }`}
        title={hasNote ? "Edit column context" : "Add column context"}
      >
        <NotebookPen className="w-3 h-3" />
        {hasNote ? "Context" : "Add context"}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">{columnName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {FIELDS.map(({ key, label, placeholder, rows }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">{label}</label>
              <textarea
                rows={rows}
                value={draft[key]}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                placeholder={placeholder}
                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Who to ask</label>
            <input
              value={draft.owner}
              onChange={(e) => setDraft((d) => ({ ...d, owner: e.target.value }))}
              placeholder="e.g. Priya, RevOps"
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-slate-400">
              Clearing every field removes the note.
            </p>
            <button
              onClick={save}
              disabled={pending}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#1A1A2E" }}
            >
              {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save
            </button>
          </div>
        </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
