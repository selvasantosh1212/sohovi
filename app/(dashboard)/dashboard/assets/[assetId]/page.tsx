import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UploadCloud,
  Pencil,
  ShieldCheck,
  Clock,
  Database,
  ListChecks,
  FlaskConical,
  Wrench,
  BarChart3,
} from "lucide-react";
import { getAsset } from "@/app/actions/assets";
import { getRuns } from "@/app/actions/runs";
import { ScoreBadge, ScoreBar } from "@/components/shared/ScoreBadge";
import { Card } from "@/components/ui/card";
import { ScoreTrendChart } from "@/components/trends/ScoreTrendChart";
import { AnomalyFlagCard } from "@/components/trends/AnomalyFlagCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  return { title: asset?.name ?? "Data Asset" };
}

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const [asset, runs] = await Promise.all([getAsset(assetId), getRuns(assetId)]);
  if (!asset) notFound();

  const hasScore = asset.latest_dq_score !== null && asset.latest_dq_score !== undefined;

  return (
    <div className="space-y-6 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
      {/* Breadcrumb + header */}
      <div>
        <Link
          href="/dashboard/assets"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />Assets
        </Link>
        <div className="flex items-start justify-between">
          <div>
            {asset.catalog && (
              <div className="flex items-center gap-1.5 mb-2 text-[12px] text-slate-400">
                <Link href="/dashboard/assets" className="hover:text-slate-600">Data Assets</Link>
                <span>›</span>
                <Link href={`/dashboard/catalogs/${asset.catalog.id}`} className="hover:text-slate-600">
                  {asset.catalog.name}
                </Link>
              </div>
            )}
            <h1 className="font-mono text-[28px] font-bold tracking-[-0.025em]" style={{ color: "#0A0A0F" }}>
              {asset.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {asset.catalog && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "#FFF4EB", color: "#C96040" }}>
                  {asset.catalog.name}
                </span>
              )}
              {asset.source_system && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full font-mono" style={{ background: "#F1F5F9", color: "#475569" }}>
                  {asset.source_system}
                </span>
              )}
              {asset.owner_name && (
                <span className="text-[11px] text-slate-400">Owner: {asset.owner_name}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { href: `/dashboard/assets/${assetId}/edit`, icon: Pencil, label: "Edit" },
              { href: `/dashboard/assets/${assetId}/rules`, icon: ListChecks, label: "Rules" },
              { href: `/dashboard/assets/${assetId}/scoring`, icon: BarChart3, label: "Scoring" },
              { href: `/dashboard/assets/${assetId}/sandbox`, icon: FlaskConical, label: "Sandbox" },
              { href: `/dashboard/assets/${assetId}/remediation`, icon: Wrench, label: "Remediate" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-full border border-[#EEF0F3] bg-white hover:bg-slate-50 transition-colors duration-150 text-slate-700"
              >
                <Icon className="w-3.5 h-3.5" />{label}
              </Link>
            ))}
            <Link
              href={`/dashboard/assets/${assetId}/upload`}
              className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-90"
              style={{ background: "#1A1A2E" }}
            >
              <UploadCloud className="w-3.5 h-3.5" />Upload File
            </Link>
          </div>
        </div>
      </div>

      {/* Score + metadata cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5 border border-[#EEF0F3] flex flex-col gap-3 rounded-2xl">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4" />DQ Score
          </div>
          {hasScore ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-slate-800">
                  {asset.latest_dq_score}
                </span>
                <ScoreBadge score={asset.latest_dq_score} size="sm" />
              </div>
              <ScoreBar score={asset.latest_dq_score} />
            </>
          ) : (
            <p className="text-sm text-slate-400">No runs yet</p>
          )}
        </Card>

        <Card className="p-5 border border-[#EEF0F3] flex flex-col gap-2 rounded-2xl">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Database className="w-4 h-4" />Last File
          </div>
          <p className="text-sm font-medium text-slate-700 truncate">
            {asset.upstream_file_name ?? "—"}
          </p>
          {asset.column_schema && (
            <p className="text-xs text-slate-400">
              {asset.column_schema.length} column{asset.column_schema.length !== 1 ? "s" : ""}
            </p>
          )}
        </Card>

        <Card className="p-5 border border-[#EEF0F3] flex flex-col gap-2 rounded-2xl">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />Updated
          </div>
          <p className="text-sm font-medium text-slate-700">
            {new Date(asset.updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-slate-400">
            Created{" "}
            {new Date(asset.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </Card>
      </div>

      {/* Description fields */}
      {(asset.purpose || asset.business_meaning) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {asset.purpose && (
            <Card className="p-5 border border-[#EEF0F3] rounded-2xl">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Purpose
              </h3>
              <p className="text-sm text-slate-600">{asset.purpose}</p>
            </Card>
          )}
          {asset.business_meaning && (
            <Card className="p-5 border border-[#EEF0F3] rounded-2xl">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Business Meaning
              </h3>
              <p className="text-sm text-slate-600">{asset.business_meaning}</p>
            </Card>
          )}
        </div>
      )}

      {/* Upload CTA when no runs yet */}
      {!hasScore && (
        <div
          className="rounded-[16px] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between border"
          style={{
            background: "radial-gradient(ellipse 80% 120% at 0% 0%, #FFEAD9, #FFF4EB 50%, #fff 100%)",
            borderColor: "#FDDFC9",
          }}
        >
          <div>
            <p className="font-semibold text-slate-800">Upload a file to get started</p>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Upload a CSV or Excel file to profile your data and run DQ checks. Nothing leaves your browser.
            </p>
          </div>
          <Link
            href={`/dashboard/assets/${assetId}/upload`}
            className="shrink-0 inline-flex items-center gap-2 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90"
            style={{ background: "#1A1A2E" }}
          >
            <UploadCloud className="w-4 h-4" />Upload File
          </Link>
        </div>
      )}

      {/* Score Trend + Anomalies */}
      {runs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold tracking-[-0.015em]" style={{ color: "#0A0A0F" }}>Score Trend</h2>
            <Link
              href={`/dashboard/assets/${assetId}/runs`}
              className="text-[12px] font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              View all {runs.length} runs →
            </Link>
          </div>
          <div className="rounded-[16px] border border-[#EEF0F3] bg-white px-5 py-4">
            <ScoreTrendChart runs={runs} />
          </div>
          <AnomalyFlagCard runs={runs} />
        </div>
      )}
    </div>
  );
}
