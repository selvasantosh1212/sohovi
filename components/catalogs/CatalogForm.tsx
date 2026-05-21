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
import type { Catalog, BusinessUnit } from "@/types/app.types";

const schema = z.object({
  business_unit_id: z.string().min(1, "Business unit is required"),
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  owner_name: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CatalogFormProps {
  existing?: Catalog;
  businessUnits: BusinessUnit[];
  defaultBuId?: string;
  onSubmit: (values: FormValues) => Promise<unknown>;
}

export function CatalogForm({ existing, businessUnits, defaultBuId, onSubmit }: CatalogFormProps) {
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
      business_unit_id: existing?.business_unit_id ?? defaultBuId ?? "",
      name: existing?.name ?? "",
      description: existing?.description ?? "",
      owner_name: existing?.owner_name ?? "",
    },
  });

  const buId = watch("business_unit_id");

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      toast.success(existing ? "Catalog updated" : "Catalog created");
      router.push("/dashboard/catalogs");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  });

  return (
    <form onSubmit={submit} className="space-y-5 max-w-xl">
      <div className="space-y-1.5">
        <Label>Business Unit <span className="text-red-500">*</span></Label>
        <Select value={buId ?? ""} onValueChange={(v) => setValue("business_unit_id", v ?? "")}>
          <SelectTrigger>
            <SelectValue>
              {buId
                ? (businessUnits.find((bu) => bu.id === buId)?.name ?? buId)
                : <span className="text-muted-foreground">Select a business unit</span>}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {businessUnits.map((bu) => (
              <SelectItem key={bu.id} value={bu.id}>{bu.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.business_unit_id && <p className="text-xs text-red-500">{errors.business_unit_id.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
        <Input id="name" placeholder="e.g. Customer Data" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="What data does this catalog contain?" rows={3} {...register("description")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="owner_name">Owner / Steward</Label>
        <Input id="owner_name" placeholder="e.g. Data Team" {...register("owner_name")} />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#1A1A2E" }}
        >
          {isSubmitting ? "Saving…" : existing ? "Update" : "Create Catalog"}
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
