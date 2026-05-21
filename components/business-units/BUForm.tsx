"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BusinessUnit } from "@/types/app.types";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  owner_name: z.string().optional(),
  owner_email: z.string().email("Invalid email").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

interface BUFormProps {
  existing?: BusinessUnit;
  onSubmit: (values: FormValues) => Promise<unknown>;
}

export function BUForm({ existing, onSubmit }: BUFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: existing?.name ?? "",
      description: existing?.description ?? "",
      owner_name: existing?.owner_name ?? "",
      owner_email: existing?.owner_email ?? "",
    },
  });

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      toast.success(existing ? "Business unit updated" : "Business unit created");
      router.push("/dashboard/business-units");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  });

  return (
    <form onSubmit={submit} className="space-y-5 max-w-xl">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
        <Input id="name" placeholder="e.g. Finance Team" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="What does this business unit do?" rows={3} {...register("description")} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="owner_name">Owner Name</Label>
          <Input id="owner_name" placeholder="e.g. Priya Sharma" {...register("owner_name")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="owner_email">Owner Email</Label>
          <Input id="owner_email" type="email" placeholder="priya@company.com" {...register("owner_email")} />
          {errors.owner_email && <p className="text-xs text-red-500">{errors.owner_email.message}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "#1A1A2E" }}
        >
          {isSubmitting ? "Saving…" : existing ? "Update" : "Create Business Unit"}
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
