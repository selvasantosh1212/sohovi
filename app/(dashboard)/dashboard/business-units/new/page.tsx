import { createBusinessUnit } from "@/app/actions/business-units";
import { BUForm } from "@/components/business-units/BUForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "New Business Unit" };

export default function NewBusinessUnitPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/business-units"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Business Units
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">New Business Unit</h1>
        <p className="text-slate-500 mt-1">Create a top-level group to organise your data catalogs.</p>
      </div>
      <BUForm onSubmit={createBusinessUnit} />
    </div>
  );
}
