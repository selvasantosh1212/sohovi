"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface Props {
  plan?: string;
}

export function PaymentSuccessToast({ plan }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("payment") !== "success") return;

    const planLabel = plan === "pro" ? "Pro" : plan === "business" ? "Business" : "paid";
    toast.success(`Welcome to the ${planLabel} plan!`, {
      description: "Your subscription is now active. Enjoy all the features.",
      duration: 6000,
    });

    // Remove query param from URL without full navigation
    const params = new URLSearchParams(searchParams.toString());
    params.delete("payment");
    const newUrl = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchParams, plan, router, pathname]);

  return null;
}
