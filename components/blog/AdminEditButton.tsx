"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { checkIsAdminAction } from "@/app/actions/blog";

interface Props {
  postId: string;
}

export function AdminEditButton({ postId }: Props) {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    checkIsAdminAction().then(setAdmin).catch(() => setAdmin(false));
  }, []);

  if (!admin) return null;

  return (
    <Link
      href={`/blog/admin/${postId}/edit`}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white transition-colors"
    >
      <Pencil className="w-3 h-3" aria-hidden="true" />
      Edit post
    </Link>
  );
}
