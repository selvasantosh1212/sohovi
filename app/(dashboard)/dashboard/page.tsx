import Link from "next/link";
import {
  Plus,
  Building2,
  Database,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  UploadCloud,
  BookOpen,
} from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { getDashboardCounts, getAssets } from "@/app/actions/assets";
import { getBusinessUnits } from "@/app/actions/business-units";
import { getCatalogs } from "@/app/actions/catalogs";
import { getAlertEvents } from "@/app/actions/alerts";
import { ScoreBadge, ScoreBar } from "@/components/shared/ScoreBadge";
import { ScoreGauge } from "@/components/scoring/ScoreGauge";
import { OnboardingChecklist } from "@/components/shared/OnboardingChecklist";
import { PaymentSuccessToast } from "@/components/shared/PaymentSuccessToast";
import type { DataAsset, BusinessUnit, Catalog } from "@/types/app.types";

export const metadata = { title: "Dashboard" };

function scoreColor(s: number) {
  if (s >= 95) return "#10B981";
  if (s >= 80) return "#00C9A7";
  if (s >= 60) return "#F59E0B";
  return "#EF4444";
}

function healthLabel(s: number | null) {
  if (s === null) return "No data yet";
  if (s >= 95) return "Excellent";
  if (s >= 80) return "Good";
  if (s >= 60) return "Warning";
  return "Critical";
}

function healthColor(s: number | null) {
  if (s === null) return "#64748B";
  if (s >= 95) return "#047857";
  if (s >= 80) return "#0F766E";
  if (s >= 60) return "#B45309";
  return "#B91C1C";
}

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  const userPlan = (clerkUser?.publicMetadata?.plan as string | undefined) ?? "free";

  let counts: Awaited<ReturnType<typeof getDashboardCounts>>;
  let allAssets: DataAsset[];
  let alertEvents: Awaited<ReturnType<typeof getAlertEvents>>;
  let bus: BusinessUnit[];
  let catalogs: Catalog[];

  try {
    [counts, allAssets, alertEvents, bus, catalogs] = await Promise.all([
      getDashboardCounts(),
      getAssets(),
      getAlertEvents(),
      getBusinessUnits(),
      getCatalogs(),
    ]);
  } catch {
    counts = { business_units: 0, catalogs: 0, assets: 0, avg_dq_score: null, has_run: false, active_rules: 0, open_alerts: 0 };
    allAssets = [];
    alertEvents = [];
    bus = [];
    catalogs = [];
  }

  const recentAssets = allAssets.slice(0, 5);
  const recentEvents = alertEvents.filter((e) => !e.is_read).slice(0, 3);
  const setupDone = counts.business_units > 0 && counts.assets > 0 && counts.has_run;

  // Compute per-BU and per-catalog DQ scores (same logic as list pages)
  const busWithScores = bus.map((bu) => {
    const buCatalogIds = catalogs.filter((c) => c.business_unit_id === bu.id).map((c) => c.id);
    const buAssets = allAssets.filter((a) => buCatalogIds.includes(a.catalog_id!));
    const scores = buAssets.map((a) => a.latest_dq_score).filter((s): s is number => s != null);
    return {
      ...bu,
      catalog_count: buCatalogIds.length,
      latest_dq_score: scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : undefined,
    };
  });

  const catalogsWithScores = catalogs.map((c) => {
    const catAssets = allAssets.filter((a) => a.catalog_id === c.id);
    const scores = catAssets.map((a) => a.latest_dq_score).filter((s): s is number => s != null);
    return {
      ...c,
      latest_dq_score: scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : undefined,
    };
  });

  // Risk counts (score < 60)
  const busAtRisk = busWithScores.filter(
    (bu) => bu.latest_dq_score != null && bu.latest_dq_score < 60
  ).length;
  const catalogsAtRisk = catalogsWithScores.filter(
    (c) => c.latest_dq_score != null && c.latest_dq_score < 60
  ).length;

  const kpis = [
    {
      label: "Org DQ Score",
      value: counts.avg_dq_score !== null ? String(counts.avg_dq_score) : "—",
      icon: ShieldCheck,
      color: counts.avg_dq_score !== null ? scoreColor(counts.avg_dq_score) : "#64748B",
      score: counts.avg_dq_score,
    },
    {
      label: "BUs at Risk",
      value: String(busAtRisk),
      icon: Building2,
      color: busAtRisk > 0 ? "#EF4444" : "#94A3B8",
      hint: "Business units with DQ score < 60",
    },
    {
      label: "Catalogs at Risk",
      value: String(catalogsAtRisk),
      icon: BookOpen,
      color: catalogsAtRisk > 0 ? "#F59E0B" : "#94A3B8",
      hint: "Catalogs with DQ score < 60",
    },
    {
      label: "Open Alerts",
      value: String(counts.open_alerts),
      icon: AlertTriangle,
      color: counts.open_alerts > 0 ? "#E07150" : "#94A3B8",
    },
  ];

  const displayBUs = busWithScores.slice(0, 6);

  return (
    <div className="space-y-5 max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px]">
      <PaymentSuccessToast plan={userPlan} />
      {/* Onboarding checklist — shown until setup is complete */}
      {!setupDone && (
        <OnboardingChecklist
          hasBusinessUnit={counts.business_units > 0}
          hasAsset={counts.assets > 0}
          hasRun={counts.has_run}
        />
      )}

      {/* Welcome banner */}
      <div
        className="relative rounded-[18px] p-7 overflow-hidden border border-[#EEF0F3]"
        style={{
          background:
            "radial-gradient(ellipse 80% 120% at 0% 0%, #FFEAD9, #FFF4EB 50%, #fff 100%)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.12em] mb-1.5"
              style={{ color: "#C96040" }}
            >
              Data Quality Overview
            </p>
            <h2
              className="text-3xl font-bold leading-[1.1] m-0"
              style={{ letterSpacing: "-0.03em", color: "#0A0A0F" }}
            >
              Welcome back.
            </h2>
            <p className="text-[14px] text-slate-500 mt-2">
              Your data health is{" "}
              <strong style={{ color: healthColor(counts.avg_dq_score) }}>
                {healthLabel(counts.avg_dq_score)}
              </strong>
              {recentEvents.length > 0 && (
                <> — {recentEvents.length} new anomal{recentEvents.length === 1 ? "y" : "ies"} detected.</>
              )}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href="/dashboard/assets"
              className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors duration-150"
            >
              View Assets
            </Link>
            <Link
              href="/dashboard/assets/new"
              className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-90"
              style={{ background: "#1A1A2E" }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Data Asset
            </Link>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="p-[22px] rounded-[16px] border border-[#EEF0F3] bg-white"
              title={"hint" in kpi ? kpi.hint : undefined}
            >
              <div
                className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-2.5"
                style={{ color: "#64748B" }}
              >
                {kpi.label}
              </div>
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[34px] font-bold leading-none"
                  style={{ letterSpacing: "-0.03em", color: "#0A0A0F" }}
                >
                  {kpi.value}
                </span>
                {"score" in kpi && kpi.score !== null && (
                  <ScoreBadge score={kpi.score} size="sm" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Business Unit Health — hierarchy overview */}
      {displayBUs.length > 0 && (
        <div className="rounded-[16px] border border-[#EEF0F3] bg-white p-[22px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3
                className="text-base font-bold m-0"
                style={{ letterSpacing: "-0.015em", color: "#0A0A0F" }}
              >
                Business Unit Health
              </h3>
              <p className="text-[12px] text-slate-400 mt-0.5">
                DQ score averaged across all assets in each unit
              </p>
            </div>
            <Link
              href="/dashboard/business-units"
              className="text-[13px] font-semibold text-slate-700 inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayBUs.map((bu) => (
              <Link
                key={bu.id}
                href={`/dashboard/business-units/${bu.id}`}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 hover:border-[#00C9A7] hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="p-2 rounded-lg shrink-0"
                      style={{ background: "rgba(30,58,95,0.08)" }}
                    >
                      <Building2 className="w-4 h-4" style={{ color: "#1E3A5F" }} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{bu.name}</p>
                      <p className="text-xs text-slate-400">
                        {bu.catalog_count} catalog{bu.catalog_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  {bu.latest_dq_score != null && (
                    <ScoreBadge score={bu.latest_dq_score} size="sm" />
                  )}
                </div>
                {bu.latest_dq_score != null ? (
                  <ScoreBar score={bu.latest_dq_score} />
                ) : (
                  <p className="text-xs text-slate-400 italic">No scored assets yet</p>
                )}
              </Link>
            ))}
          </div>
          {busWithScores.length > 6 && (
            <Link
              href="/dashboard/business-units"
              className="mt-3 inline-flex items-center gap-1 text-xs text-[#00C9A7] hover:underline"
            >
              +{busWithScores.length - 6} more business units <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}

      {/* Main two-column layout */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
        {/* Left — recent assets table */}
        <div className="rounded-[16px] border border-[#EEF0F3] bg-white p-[22px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3
                className="text-base font-bold m-0"
                style={{ letterSpacing: "-0.015em", color: "#0A0A0F" }}
              >
                Recent data assets
              </h3>
              <p className="text-[12px] text-slate-400 mt-0.5">
                {counts.assets} asset{counts.assets !== 1 ? "s" : ""} total
              </p>
            </div>
            <Link
              href="/dashboard/assets"
              className="text-[13px] font-semibold text-slate-700 inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAssets.length === 0 ? (
            <div className="py-10 text-center">
              <Database className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-3">No data assets yet</p>
              <Link
                href="/dashboard/assets/new"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#E07150] hover:opacity-80 transition-opacity"
              >
                Add your first asset <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Asset", "Catalog", "Score", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left pb-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentAssets.map((asset) => {
                  const assetCatalog = catalogs.find((c) => c.id === asset.catalog_id);
                  const buName = assetCatalog
                    ? bus.find((b) => b.id === assetCatalog.business_unit_id)?.name
                    : undefined;
                  return (
                    <tr
                      key={asset.id}
                      className="border-b border-[#F8FAFC] hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[13px] font-bold shrink-0"
                            style={{ background: "#FFF4EB", color: "#C96040" }}
                          >
                            {asset.name[0].toUpperCase()}
                          </div>
                          <span className="font-mono text-[13px] font-semibold text-slate-800 truncate max-w-[160px]">
                            {asset.name}
                          </span>
                        </div>
                      </td>
                      {/* Catalog + BU */}
                      <td className="py-3.5 pr-4">
                        <p className="text-[13px] text-slate-600 truncate max-w-[120px]">
                          {asset.catalog?.name ?? "—"}
                        </p>
                        {buName && (
                          <p className="text-[11px] text-slate-400 truncate max-w-[120px]">{buName}</p>
                        )}
                      </td>
                      {/* Score */}
                      <td className="py-3.5 pr-4">
                        {asset.latest_dq_score !== null ? (
                          <div className="flex items-center gap-2.5">
                            <span
                              className="font-mono text-[12px] font-bold px-2.5 py-0.5 rounded-full"
                              style={{
                                background:
                                  asset.latest_dq_score >= 95
                                    ? "#ECFDF5"
                                    : asset.latest_dq_score >= 80
                                    ? "#E3F6F1"
                                    : asset.latest_dq_score >= 60
                                    ? "#FFFBEB"
                                    : "#FEF2F2",
                                color:
                                  asset.latest_dq_score >= 95
                                    ? "#047857"
                                    : asset.latest_dq_score >= 80
                                    ? "#0F766E"
                                    : asset.latest_dq_score >= 60
                                    ? "#B45309"
                                    : "#B91C1C",
                              }}
                            >
                              {asset.latest_dq_score}
                            </span>
                            <div className="w-[70px] h-[5px] rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${asset.latest_dq_score}%`,
                                  background: scoreColor(asset.latest_dq_score),
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[12px] text-slate-400">Not scored</span>
                        )}
                      </td>
                      {/* Link */}
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/dashboard/assets/${asset.id}`}
                          className="text-[12px] font-medium text-slate-400 hover:text-slate-700 transition-colors inline-flex items-center gap-1"
                        >
                          View <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Org health gauge */}
          <div className="rounded-[16px] border border-[#EEF0F3] bg-white p-[22px]">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3
                  className="text-[14px] font-bold m-0"
                  style={{ letterSpacing: "-0.01em", color: "#0A0A0F" }}
                >
                  Org health
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Across all {counts.assets} asset{counts.assets !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex justify-center py-3">
              {counts.avg_dq_score !== null ? (
                <ScoreGauge score={counts.avg_dq_score} size="md" />
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-slate-400">No scored assets yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Anomalies */}
          <div
            className="rounded-[16px] border p-[22px]"
            style={{
              background:
                "radial-gradient(ellipse 80% 100% at 0% 0%, #FFEAD9, #FFF4EB 60%, #fff)",
              borderColor: "#FDDFC9",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#E07150" }}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-white" />
              </div>
              <h3
                className="text-[13px] font-bold m-0"
                style={{ letterSpacing: "-0.01em", color: "#0A0A0F" }}
              >
                {recentEvents.length > 0
                  ? `${recentEvents.length} anomal${recentEvents.length === 1 ? "y" : "ies"} detected`
                  : "No open anomalies"}
              </h3>
            </div>
            {recentEvents.length > 0 ? (
              <ul className="space-y-2.5 mb-3">
                {recentEvents.map((ev) => (
                  <li
                    key={ev.id}
                    className="text-[13px] text-slate-600 leading-[1.45]"
                  >
                    {ev.message ?? "Alert triggered"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-slate-500 mb-3">
                All alerts are clear. Nice work keeping your data healthy.
              </p>
            )}
            <Link
              href="/dashboard/alerts"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View all alerts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Getting started — only shown when no assets exist */}
      {counts.assets === 0 && (
        <div>
          <h2 className="text-base font-semibold text-slate-800 mb-3">Get started</h2>
          <div className="grid md:grid-cols-3 gap-3.5">
            {[
              {
                step: "1",
                title: "Create a Business Unit",
                description: "Organise your data assets by team, department, or project.",
                href: "/dashboard/business-units/new",
                cta: "Create Business Unit",
                icon: Building2,
              },
              {
                step: "2",
                title: "Add a Data Asset",
                description: "Upload a CSV or Excel file. All processing stays in your browser.",
                href: "/dashboard/assets/new",
                cta: "Add Asset",
                icon: UploadCloud,
              },
              {
                step: "3",
                title: "Run DQ Checks",
                description: "Apply rules, get a score, and see which rows fail.",
                href: "/dashboard/assets",
                cta: "View Assets",
                icon: TrendingUp,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-5 rounded-[14px] border border-[#EEF0F3] bg-white flex flex-col gap-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: "#1A1A2E" }}
                    >
                      {item.step}
                    </div>
                    <Icon className="w-4.5 h-4.5 text-slate-400" style={{ width: "1.125rem", height: "1.125rem" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1 text-[14px]">{item.title}</h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                  <Link
                    href={item.href}
                    className="mt-auto self-start inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {item.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Privacy reminder */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{
          background: "rgba(0,201,167,0.08)",
          border: "1px solid rgba(0,201,167,0.2)",
        }}
      >
        <ShieldCheck className="w-4.5 h-4.5 mt-0.5 shrink-0" style={{ color: "#00C9A7", width: "1.125rem", height: "1.125rem" }} />
        <div>
          <p className="text-sm font-medium text-slate-700">Your data never leaves your browser</p>
          <p className="text-xs text-slate-500 mt-0.5">
            All file parsing, profiling, and DQ evaluation runs locally using Web Workers. Only scores and metadata are stored.
          </p>
        </div>
      </div>
    </div>
  );
}
