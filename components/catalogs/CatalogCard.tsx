"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Database, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScoreBadge, ScoreBar } from "@/components/shared/ScoreBadge";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { deleteCatalog } from "@/app/actions/catalogs";
import { toast } from "sonner";
import type { Catalog } from "@/types/app.types";

interface CatalogCardProps {
  catalog: Catalog & { asset_count?: number };
}

export function CatalogCard({ catalog }: CatalogCardProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card className="p-5 border border-[#EEF0F3] hover:shadow-md transition-all duration-150 flex flex-col gap-4 rounded-2xl">
      <div className="flex items-start justify-between">
        <Link href={`/dashboard/catalogs/${catalog.id}`} className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2.5 rounded-xl shrink-0 mt-0.5" style={{ background: "rgba(0,201,167,0.1)" }}>
            <BookOpen className="w-4 h-4" style={{ color: "#00C9A7" }} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 truncate hover:text-slate-900">{catalog.name}</h3>
            {catalog.business_unit && (
              <p className="text-xs text-slate-400 mt-0.5">{catalog.business_unit.name}</p>
            )}
            {catalog.description && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{catalog.description}</p>
            )}
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/dashboard/catalogs/${catalog.id}/edit`} className="flex items-center gap-2 w-full">
                <Pencil className="w-3.5 h-3.5" />Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-600 focus:text-red-600"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <Database className="w-3.5 h-3.5" />
        <span>{catalog.asset_count ?? 0} asset{(catalog.asset_count ?? 0) !== 1 ? "s" : ""}</span>
        {catalog.owner_name && <span className="text-slate-400">· {catalog.owner_name}</span>}
      </div>

      {catalog.latest_dq_score !== undefined && catalog.latest_dq_score !== null && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Avg DQ Score</span>
            <ScoreBadge score={catalog.latest_dq_score} size="sm" />
          </div>
          <ScoreBar score={catalog.latest_dq_score} />
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Catalog"
        description={`Delete "${catalog.name}"? All data assets inside will also be deleted.`}
        onConfirm={async () => {
          await deleteCatalog(catalog.id);
          toast.success("Catalog deleted");
          router.refresh();
        }}
      />
    </Card>
  );
}
