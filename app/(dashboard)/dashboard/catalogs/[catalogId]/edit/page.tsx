import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCatalog, updateCatalog } from "@/app/actions/catalogs";
import { getBusinessUnits } from "@/app/actions/business-units";
import { CatalogForm } from "@/components/catalogs/CatalogForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ catalogId: string }>;
}) {
  const { catalogId } = await params;
  const catalog = await getCatalog(catalogId);
  return { title: catalog ? `Edit ${catalog.name}` : "Edit Catalog" };
}

export default async function EditCatalogPage({
  params,
}: {
  params: Promise<{ catalogId: string }>;
}) {
  const { catalogId } = await params;
  const [catalog, businessUnits] = await Promise.all([
    getCatalog(catalogId),
    getBusinessUnits(),
  ]);
  if (!catalog) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href={`/dashboard/catalogs/${catalogId}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />Back to {catalog.name}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Catalog</h1>
        <p className="text-slate-500 mt-1">Update the details for this catalog.</p>
      </div>
      <CatalogForm
        existing={catalog}
        businessUnits={businessUnits}
        onSubmit={async (values) => {
          "use server";
          await updateCatalog(catalogId, values);
        }}
      />
    </div>
  );
}
