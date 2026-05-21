import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/clerk/utils";
import { BlogAdminForm } from "@/components/blog/BlogAdminForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "New Blog Post" };

export default async function NewBlogPostPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <div className="mx-auto max-w-3xl px-6 py-10 space-y-8">
        <Link
          href="/blog/admin"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1E3A5F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Blog Admin
        </Link>
        <h1 className="text-2xl font-bold text-[#1E3A5F]">New Post</h1>
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <BlogAdminForm />
        </div>
      </div>
    </div>
  );
}
