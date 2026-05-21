"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Database, MoreHorizontal, Pencil, Trash2, UploadCloud } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScoreBadge, ScoreBar } from "@/components/shared/ScoreBadge";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteAsset } from "@/app/actions/assets";
import { toast } from "sonner";
import type { DataAsset } from "@/types/app.types";

interface AssetCardProps {
  asset: DataAsset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card className="p-5 border border-[#EEF0F3] hover:shadow-md transition-all duration-150 flex flex-col gap-4 rounded-2xl">
      <div className="flex items-start justify-between">
        <Link
          href={`/dashboard/assets/${asset.id}`}
          className="flex items-start gap-3 flex-1 min-w-0"
        >
          <div
            className="p-2.5 rounded-xl shrink-0 mt-0.5"
            style={{ background: "rgba(30,58,95,0.08)" }}
          >
            <Database className="w-4 h-4" style={{ color: "#1E3A5F" }} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 truncate hover:text-slate-900">
              {asset.name}
            </h3>
            {asset.catalog && (
              <p className="text-xs text-slate-400 mt-0.5">{asset.catalog.name}</p>
            )}
            {asset.source_system && (
              <p className="text-xs text-slate-500 mt-0.5 truncate">{asset.source_system}</p>
            )}
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link
                href={`/dashboard/assets/${asset.id}/upload`}
                className="flex items-center gap-2 w-full"
              >
                <UploadCloud className="w-3.5 h-3.5" />Upload File
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/dashboard/assets/${asset.id}/edit`}
                className="flex items-center gap-2 w-full"
              >
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

      {asset.latest_dq_score !== null && asset.latest_dq_score !== undefined ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">DQ Score</span>
            <ScoreBadge score={asset.latest_dq_score} size="sm" />
          </div>
          <ScoreBar score={asset.latest_dq_score} />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/assets/${asset.id}/upload`}
            className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
          >
            <UploadCloud className="w-3 h-3" />Upload a file to run DQ checks
          </Link>
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Asset"
        description={`Delete "${asset.name}"? All runs, rules, and profiling data will also be deleted.`}
        onConfirm={async () => {
          await deleteAsset(asset.id);
          toast.success("Asset deleted");
          router.refresh();
        }}
      />
    </Card>
  );
}
