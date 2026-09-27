import Link from "next/link";
import {
  Pencil,
  ListChecks,
  BarChart3,
  FlaskConical,
  Wrench,
  GitCompareArrows,
  ShieldOff,
  FileCheck2,
  type LucideIcon,
} from "lucide-react";

interface AssetTab {
  /** Path segment under /dashboard/assets/[assetId]/. */
  segment: string;
  label: string;
  icon: LucideIcon;
}

/**
 * The asset detail sub-navigation.
 *
 * Every tab renders for every plan — the pages themselves gate their contents
 * with `PlanGate` and their server actions with `requireFeature`. Hiding the
 * tab outright would hide the upgrade path too, and gating navigation is not
 * access control: the route is reachable regardless.
 */
export const ASSET_TABS: readonly AssetTab[] = [
  { segment: "edit", label: "Edit", icon: Pencil },
  { segment: "rules", label: "Rules", icon: ListChecks },
  { segment: "scoring", label: "Scoring", icon: BarChart3 },
  { segment: "sandbox", label: "Sandbox", icon: FlaskConical },
  { segment: "remediation", label: "Remediate", icon: Wrench },
  { segment: "reconcile", label: "Reconcile", icon: GitCompareArrows },
  { segment: "privacy", label: "Privacy", icon: ShieldOff },
  { segment: "contracts", label: "Contracts", icon: FileCheck2 },
] as const;

export function AssetTabs({ assetId }: { assetId: string }) {
  return (
    <>
      {ASSET_TABS.map(({ segment, label, icon: Icon }) => (
        <Link
          key={segment}
          href={`/dashboard/assets/${assetId}/${segment}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-full border border-[#EEF0F3] bg-white hover:bg-slate-50 transition-colors duration-150 text-slate-700"
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </Link>
      ))}
    </>
  );
}
