"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DataAsset, Catalog } from "@/types/app.types";

const schema = z.object({
  catalog_id: z.string().min(1, "Catalog is required"),
  name: z.string().min(1, "Name is required").max(100),
  source_system: z.string().optional(),
  purpose: z.string().optional(),
  business_meaning: z.string().optional(),
  owner_name: z.string().optional(),
  owner_email: z.string().email("Invalid email").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface AssetFormProps {
  existing?: DataAsset;
  catalogs: Catalog[];
  defaultCatalogId?: string;
  onSubmit: (values: FormValues) => Promise<unknown>;
}

export function AssetForm({ existing, catalogs, defaultCatalogId, onSubmit }: AssetFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      catalog_id: existing?.catalog_id ?? defaultCatalogId ?? "",
      name: existing?.name ?? "",
      source_system: existing?.source_system ?? "",
      purpose: existing?.purpose ?? "",
      business_meaning: existing?.business_meaning ?? "",
      owner_name: existing?.owner_name ?? "",
      owner_email: existing?.owner_email ?? "",
    },
  });

  const catalogId = watch("catalog_id");

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      toast.success(existing ? "Asset updated" : "Asset created");
      router.push(existing ? `/dashboard/assets/${existing.id}` : "/dashboard/assets");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  });

  return (
    <form onSubmit={submit} className="space-y-5 max-w-xl">
      <div className="space-y-1.5">
        <Label>Catalog <span className="text-red-500">*</span></Label>
        <Select value={catalogId ?? ""} onValueChange={(v) => setValue("catalog_id", v ?? "")}>
          <SelectTrigger>
            <SelectValue>
              {catalogId
                ? (catalogs.find((c) => c.id === catalogId)?.name ?? catalogId)
                : <span className="text-muted-foreground">Select a catalog</span>}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {catalogs.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
                {c.business_unit && (
                  <span className="text-slate-400 ml-1">· {c.business_unit.name}</span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.catalog_id && (
          <p className="text-xs text-red-500">{errors.catalog_id.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
        <Input id="name" placeholder="e.g. Customer Orders 2024" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="source_system">Source System</Label>
        <Input
          id="source_system"
          placeholder="e.g. Salesforce, PostgreSQL, Snowflake"
          {...register("source_system")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="purpose">Purpose</Label>
        <Textarea
          id="purpose"
          placeholder="What is this data used for?"
          rows={2}
          {...register("purpose")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="business_meaning">Business Meaning</Label>
        <Textarea
          id="business_meaning"
          placeholder="What does this data represent to the business?"
          rows={2}
          {...register("business_meaning")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="owner_name">Owner Name</Label>
          <Input id="owner_name" placeholder="e.g. Analytics Team" {...register("owner_name")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="owner_email">Owner Email</Label>
          <Input
            id="owner_email"
            type="email"
            placeholder="team@company.com"
            {...register("owner_email")}
          />
          {errors.owner_email && (
            <p className="text-xs text-red-500">{errors.owner_email.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#1A1A2E" }}
        >
          {isSubmitting ? "Saving…" : existing ? "Update Asset" : "Create Asset"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
