"use client";

import { PlanGate } from "@/components/shared/PlanGate";

interface ConnectorGateProps {
  children: React.ReactNode;
}

export function ConnectorGate({ children }: ConnectorGateProps) {
  return (
    <PlanGate
      minPlan="business"
      feature="Data source connectors"
      description="Data source connectors are available on the Business plan. Upgrade to connect Google Sheets, Airtable, S3, and REST APIs directly."
    >
      {children}
    </PlanGate>
  );
}
