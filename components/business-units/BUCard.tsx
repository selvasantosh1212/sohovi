"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, BookOpen, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScoreBadge, ScoreBar } from "@/components/shared/ScoreBadge";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteBusinessUnit } from "@/app/actions/business-units";
import { toast } from "sonner";
import type { BusinessUnit } from "@/types/app.types";

interface BUCardProps {
  bu: BusinessUnit & { catalog_count?: number };
}

export function BUCard({ bu }: BUCardProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card className="p-5 border border-[#EEF0F3] hover:shadow-md transition-all duration-150 flex flex-col gap-4 rounded-2xl">
      <div className="flex items-start justify-between">
        <Link href={`/dashboard/business-units/${bu.id}`} className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="p-2.5 rounded-xl shrink-0 mt-0.5"
            style={{ background: "rgba(30,58,95,0.08)" }}
          >
            <Building2 className="w-4.5 h-4.5" style={{ width: "1.125rem", height: "1.125rem", color: "#1E3A5F" }} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 truncate hover:text-slate-900">{bu.name}</h3>
            {bu.description && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{bu.description}</p>
            )}
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/dashboard/business-units/${bu.id}/edit`} className="flex items-center gap-2 w-full">
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-600 focus:text-red-600"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{bu.catalog_count ?? 0} catalog{(bu.catalog_count ?? 0) !== 1 ? "s" : ""}</span>
        </div>
        {bu.owner_name && (
          <div className="text-xs text-slate-400 truncate">
            Owner: {bu.owner_name}
          </div>
        )}
      </div>

      {/* DQ Score */}
      {bu.latest_dq_score !== undefined && bu.latest_dq_score !== null && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Avg DQ Score</span>
            <ScoreBadge score={bu.latest_dq_score} size="sm" />
          </div>
          <ScoreBar score={bu.latest_dq_score} />
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Business Unit"
        description={`Delete "${bu.name}"? This will also delete all catalogs and data assets inside it. This action cannot be undone.`}
        onConfirm={async () => {
          await deleteBusinessUnit(bu.id);
          toast.success("Business unit deleted");
          router.refresh();
        }}
      />
    </Card>
  );
}
