"use client";

import { useUser } from "@clerk/nextjs";
import { Lock } from "lucide-react";

interface ConnectorGateProps {
  children: React.ReactNode;
}

export function ConnectorGate({ children }: ConnectorGateProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const plan = (user?.publicMetadata?.plan as string | undefined) ?? "free";
  const hasAccess = plan === "business";

  if (!hasAccess) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-slate-400" />
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-800">Business Plan Required</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Data source connectors are available on the Business plan. Upgrade to connect Google
            Sheets, Airtable, S3, and REST APIs directly.
          </p>
        </div>
        <div className="pt-1">
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full border border-slate-300 text-slate-500">
            Current plan: {plan}
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
