import Link from "next/link";
import { Bell, Plus } from "lucide-react";
import { getAlerts, getAlertEvents } from "@/app/actions/alerts";
import { getAssets } from "@/app/actions/assets";
import { AlertCard } from "@/components/alerts/AlertCard";
import { AlertRuleForm } from "@/components/alerts/AlertRuleForm";
import { PlanGate } from "@/components/shared/PlanGate";
import type { AlertEvent } from "@/types/app.types";

export const metadata = { title: "Alerts — Sohovi" };

export default async function AlertsPage() {
  const [alerts, allAssets, allEvents] = await Promise.all([
    getAlerts(),
    getAssets(),
    getAlertEvents(),
  ]);

  // Map events by alert_id
  const eventsByAlert = allEvents.reduce<Record<string, AlertEvent[]>>((acc, ev) => {
    if (!acc[ev.alert_id]) acc[ev.alert_id] = [];
    acc[ev.alert_id].push(ev);
    return acc;
  }, {});

  // Map asset name by id
  const assetNameById = Object.fromEntries(allAssets.map((a) => [a.id, a.name]));

  const totalUnread = allEvents.filter((e) => !e.is_read).length;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[28px] font-bold tracking-[-0.025em]" style={{ color: "#0A0A0F" }}>Alerts</h1>
            {totalUnread > 0 && (
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" style={{ background: "#E07150" }}>
                {totalUnread} unread
              </span>
            )}
          </div>
          <p className="text-[14px] text-slate-500 mt-1.5">
            Monitor your data assets and get notified when quality thresholds are breached.
          </p>
        </div>
      </div>

      <PlanGate
        minPlan="pro"
        feature="Alerts & Anomaly Detection"
        description="Alerts and anomaly detection are available on the Pro plan. Upgrade to get notified when quality thresholds are breached."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alert list */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
              Active Rules ({alerts.length})
            </h2>

            {alerts.length === 0 ? (
              <div className="rounded-[16px] border border-dashed border-[#EEF0F3] bg-[#F8FAFC] p-10 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-medium text-[13px]">No alert rules yet</p>
                <p className="text-[12px] text-slate-400">
                  Create a rule to monitor your data quality automatically.
                </p>
              </div>
            ) : (
              alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  events={eventsByAlert[alert.id] ?? []}
                  assetName={assetNameById[alert.asset_id]}
                />
              ))
            )}
          </div>

          {/* Create form */}
          <div className="lg:col-span-1">
            <div className="rounded-[16px] border border-[#EEF0F3] bg-white px-5 py-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(26,26,46,0.06)" }}>
                  <Plus className="w-4 h-4" style={{ color: "#1A1A2E" }} />
                </div>
                <h2 className="font-semibold text-slate-800 text-[13px]">New Alert Rule</h2>
              </div>
              <AlertRuleForm assets={allAssets} />
            </div>

            {/* Tip */}
            <div className="mt-4 rounded-[16px] border px-4 py-3 text-[12px] space-y-1" style={{ background: "#FFF4EB", borderColor: "#FDDFC9", color: "#92400E" }}>
              <p className="font-semibold text-[#7C2D12]">How alerts work</p>
              <p>After each DQ run, Sohovi evaluates your rules and logs an event here if a condition is met.</p>
              <p>
                <Link href="/dashboard/assets" className="underline">Run a DQ check</Link> on an asset to see alerts fire.
              </p>
            </div>
          </div>
        </div>
      </PlanGate>
    </div>
  );
}
