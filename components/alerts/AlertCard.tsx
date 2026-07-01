"use client";

import { useState, useTransition } from "react";
import { Bell, BellOff, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { deleteAlert, updateAlert, markAlertEventsRead } from "@/app/actions/alerts";
import { useRouter } from "next/navigation";
import type { Alert, AlertEvent } from "@/types/app.types";

interface Props {
  alert: Alert;
  events: AlertEvent[];
  assetName?: string;
}

const conditionLabel: Record<Alert["condition"], string> = {
  score_drop: "Score Drop",
  schema_change: "Schema Change",
  rule_failure: "Rule Failure",
  anomaly: "Anomaly",
};

export function AlertCard({ alert, events, assetName }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const unread = events.filter((e) => !e.is_read).length;

  function handleToggleActive() {
    startTransition(async () => {
      try {
        await updateAlert(alert.id, { is_active: !alert.is_active });
        router.refresh();
      } catch {
        toast.error("Failed to update alert");
      }
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete alert "${alert.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteAlert(alert.id);
        router.refresh();
      } catch {
        toast.error("Failed to delete alert");
      }
    });
  }

  function handleMarkRead() {
    startTransition(async () => {
      try {
        await markAlertEventsRead(alert.id);
        router.refresh();
      } catch {
        toast.error("Failed to mark read");
      }
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              alert.is_active ? "bg-[#1E3A5F]/10" : "bg-slate-100"
            }`}
          >
            <Bell className={`w-4 h-4 ${alert.is_active ? "text-[#1E3A5F]" : "text-slate-400"}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-slate-800 text-sm truncate">{alert.name}</p>
              {!alert.is_active && (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  Paused
                </span>
              )}
              {unread > 0 && (
                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                  {unread} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
              <span>{conditionLabel[alert.condition]}</span>
              {alert.threshold_value !== null && (
                <><span>·</span><span>threshold: {alert.threshold_value}</span></>
              )}
              {assetName && <><span>·</span><span className="truncate">{assetName}</span></>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {unread > 0 && (
            <button
              onClick={handleMarkRead}
              disabled={isPending}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-xs"
              title="Mark all read"
            >
              ✓
            </button>
          )}
          <button
            onClick={handleToggleActive}
            disabled={isPending}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={alert.is_active ? "Pause" : "Enable"}
          >
            {alert.is_active ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {events.length > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {expanded && events.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-3 space-y-2 bg-slate-50/50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recent Events</p>
          {events.slice(0, 5).map((ev) => (
            <div key={ev.id} className={`text-xs rounded-lg px-3 py-2 ${ev.is_read ? "bg-white text-slate-500" : "bg-amber-50 text-amber-700 font-medium"}`}>
              <span>{ev.message ?? "Alert triggered"}</span>
              <span className="ml-2 text-[10px] text-slate-400">
                {new Date(ev.triggered_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
