import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBusinessUnit, updateBusinessUnit } from "@/app/actions/business-units";
import { BUForm } from "@/components/business-units/BUForm";

export const metadata = { title: "Edit Business Unit" };

export default async function EditBUPage({ params }: { params: Promise<{ buId: string }> }) {
  const { buId } = await params;
  const bu = await getBusinessUnit(buId);
  if (!bu) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href={`/dashboard/business-units/${buId}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Business Unit</h1>
      </div>
      <BUForm
        existing={bu}
        onSubmit={(values) => updateBusinessUnit(buId, values)}
      />
    </div>
  );
}
