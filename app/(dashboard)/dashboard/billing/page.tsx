import { getUserPlan } from "@/lib/plans/limits";
import { BillingClient } from "./BillingClient";

export const metadata = { title: "Billing — Sohovi" };

export default async function BillingPage() {
  const plan = await getUserPlan();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.025em]" style={{ color: "#0A0A0F" }}>Billing</h1>
        <p className="text-[14px] text-slate-500 mt-1.5">
          Manage your subscription, payment method, and invoices.
        </p>
      </div>

      <BillingClient plan={plan} />
    </div>
  );
}
