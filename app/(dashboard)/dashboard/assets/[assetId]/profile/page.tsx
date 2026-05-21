"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ListChecks, UploadCloud } from "lucide-react";
import { ProfilingDashboard } from "@/components/profiling/ProfilingDashboard";
import { SchemaDriftBanner } from "@/components/profiling/SchemaDriftBanner";
import { useProfilingStore } from "@/store/profilingStore";
import { useFileStore } from "@/store/fileStore";
import { saveProfilingSnapshot } from "@/app/actions/runs";
import type { SchemaDiff } from "@/store/fileStore";

export default function AssetProfilePage() {
  const router = useRouter();
  const params = useParams<{ assetId: string }>();
  const assetId = params.assetId;

  const profiles = useProfilingStore((s) => s.profiles);
  const profiledAssetId = useProfilingStore((s) => s.assetId);
  const fileData = useFileStore((s) => s.data);
  const setSchemaDiff = useFileStore((s) => s.setSchemaDiff);

  const [schemaDiff, setSchemaDiffLocal] = useState<SchemaDiff | null>(null);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (
      profiles &&
      fileData &&
      profiledAssetId === assetId &&
      !hasSaved.current
    ) {
      hasSaved.current = true;
      saveProfilingSnapshot({
        asset_id: assetId,
        file_name: fileData.fileName,
        file_size_bytes: fileData.fileSize ?? 0,
        row_count: fileData.totalRows,
        column_schema: fileData.headers,
      })
        .then(({ schemaDiff: diff }) => {
          setSchemaDiffLocal(diff);
          setSchemaDiff(diff);
        })
        .catch(() => {
          // non-critical — history will just be missing this entry
        });
    }
  }, [profiles, fileData, profiledAssetId, assetId, setSchemaDiff]);

  // If no profiling data for this asset, redirect to upload
  useEffect(() => {
    if (!profiles || profiledAssetId !== assetId) {
      router.replace(`/dashboard/assets/${assetId}/upload`);
    }
  }, [profiles, profiledAssetId, assetId, router]);

  if (!profiles || !fileData || profiledAssetId !== assetId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <p className="text-slate-500 text-sm">Loading profiling results…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <Link
          href={`/dashboard/assets/${assetId}/upload`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />Upload
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Profiling Results</h1>
            <p className="text-slate-500 mt-1">
              Column-level statistics computed entirely in your browser.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/dashboard/assets/${assetId}/upload`}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />Re-upload
            </Link>
            <Link
              href={`/dashboard/assets/${assetId}/rules`}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
              style={{ background: "#1E3A5F", color: "#fff" }}
            >
              <ListChecks className="w-4 h-4" />Run DQ Check
            </Link>
          </div>
        </div>
      </div>

      {schemaDiff && schemaDiff.removed.length > 0 && (
        <SchemaDriftBanner
          removedColumns={schemaDiff.removed}
          assetId={assetId}
        />
      )}

      <ProfilingDashboard
        profiles={profiles}
        fileName={fileData.fileName}
        totalRows={fileData.totalRows}
        sampleMode={fileData.sampleMode}
      />
    </div>
  );
}
