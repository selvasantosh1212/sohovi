"use client";

import { useState, useTransition } from "react";
import { Mail, Hash, Trash2, Send, Loader2, AlertTriangle, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  saveNotificationChannel,
  deleteNotificationChannel,
  setChannelEnabled,
  sendTestNotification,
  type NotificationChannel,
  type ChannelType,
} from "@/app/actions/notifications";
import { can, minPlanFor, PLAN_LABELS } from "@/lib/plans/features";
import type { Plan } from "@/lib/plans/limits";

const CHANNEL_META: Record<
  ChannelType,
  { icon: typeof Mail; title: string; placeholder: string; feature: "alertEmail" | "alertSlack" }
> = {
  email: {
    icon: Mail,
    title: "Email",
    placeholder: "alerts@yourcompany.com",
    feature: "alertEmail",
  },
  slack: {
    icon: Hash,
    title: "Slack",
    placeholder: "https://hooks.slack.com/services/…",
    feature: "alertSlack",
  },
};

function formatDate(value: string | null): string {
  if (!value) return "never";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function NotificationChannels({
  channels,
  plan,
}: {
  channels: NotificationChannel[];
  plan: Plan;
}) {
  const [adding, setAdding] = useState<ChannelType | null>(null);
  const [destination, setDestination] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  function add(type: ChannelType) {
    setError(null);
    startTransition(async () => {
      try {
        await saveNotificationChannel({ type, destination });
        setDestination("");
        setAdding(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save that channel.");
      }
    });
  }

  function test(id: string) {
    setTestResult((r) => ({ ...r, [id]: "sending" }));
    startTransition(async () => {
      const result = await sendTestNotification(id);
      setTestResult((r) => ({
        ...r,
        [id]: result.ok ? "Sent." : result.error ?? "Failed.",
      }));
    });
  }

  return (
    <Card className="p-5 border border-[#EEF0F3] rounded-2xl space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-800">Notification channels</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Where triggered alerts get delivered. Sohovi sends the asset name, the alert and the
          score — never your rows or column values.
        </p>
      </div>

      {channels.length > 0 && (
        <div className="space-y-2">
          {channels.map((c) => {
            const Icon = CHANNEL_META[c.type].icon;
            return (
              <div
                key={c.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#EEF0F3] bg-white"
              >
                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-slate-700 truncate">{c.hint}</p>
                  <p className="text-[11px] text-slate-400">
                    Last sent {formatDate(c.last_sent_at)}
                    {testResult[c.id] && testResult[c.id] !== "sending" && (
                      <span className="ml-2 text-slate-600">{testResult[c.id]}</span>
                    )}
                  </p>
                  {c.last_error && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="w-3 h-3" />
                      {c.last_error}
                    </p>
                  )}
                </div>

                <button
                  onClick={() =>
                    startTransition(() => setChannelEnabled(c.id, !c.is_enabled).then(() => {}))
                  }
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
                    c.is_enabled
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                >
                  {c.is_enabled ? "Enabled" : "Paused"}
                </button>

                <button
                  onClick={() => test(c.id)}
                  disabled={pending}
                  title="Send a test notification"
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  {testResult[c.id] === "sending" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() =>
                    startTransition(() => deleteNotificationChannel(c.id).then(() => {}))
                  }
                  title="Remove this channel"
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {adding ? (
        <div className="space-y-2">
          <input
            autoFocus
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={CHANNEL_META[adding].placeholder}
            className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => add(adding)}
              disabled={pending || !destination.trim()}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#1A1A2E" }}
            >
              {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Add {CHANNEL_META[adding].title}
            </button>
            <button
              onClick={() => {
                setAdding(null);
                setError(null);
              }}
              className="text-[13px] font-medium px-4 py-2 rounded-full border border-[#EEF0F3] text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(CHANNEL_META) as ChannelType[]).map((type) => {
            const { icon: Icon, title, feature } = CHANNEL_META[type];
            const allowed = can(plan, feature);
            return (
              <button
                key={type}
                onClick={() => allowed && setAdding(type)}
                disabled={!allowed}
                title={
                  allowed
                    ? undefined
                    : `${title} delivery is available on the ${PLAN_LABELS[minPlanFor(feature)]} plan.`
                }
                className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-full border border-[#EEF0F3] bg-white hover:bg-slate-50 transition-colors text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {allowed ? <Plus className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                {title}
                {!allowed && (
                  <span className="text-[11px] text-slate-400">
                    {PLAN_LABELS[minPlanFor(feature)]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
