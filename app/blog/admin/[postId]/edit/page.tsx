import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/clerk/utils";
import { getAdminPostById } from "@/app/actions/blog";
import { BlogAdminForm } from "@/components/blog/BlogAdminForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Edit Blog Post" };

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  await requireAdmin();
  const { postId } = await params;
  const post = await getAdminPostById(postId);
  if (!post) notFound();

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1E3A5F]">Edit Post</h1>
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="text-sm text-gray-400 hover:text-[#1E3A5F] transition-colors"
          >
            View live →
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <BlogAdminForm post={post} />
        </div>
      </div>
    </div>
  );
}
