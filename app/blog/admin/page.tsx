import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/clerk/utils";
import { getAdminPosts, deletePost } from "@/app/actions/blog";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog Admin",
  robots: { index: false, follow: false },
};

export default async function BlogAdminPage() {
  await requireAdmin();
  const posts = await getAdminPosts();

  return (
    <div
      className="min-h-screen"
      style={{ background: "#F8FAFC" }}
    >
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A5F]">Blog Admin</h1>
            <p className="text-sm text-gray-500 mt-1">
              {posts.length} post{posts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/blog/admin/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#1E3A5F" }}
            aria-label="Create new blog post"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            New Post
          </Link>
        </div>

        {/* Posts table */}
        {posts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-medium mb-2">No posts yet</p>
            <Link href="/blog/admin/new" className="text-sm text-[#00836e] hover:underline">
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
            <table className="w-full text-sm" role="table" aria-label="Blog posts">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-5 py-3 font-semibold text-gray-600 w-full">Title</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">Status</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">Date</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 whitespace-nowrap">Views</th>
                  <th className="px-5 py-3" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="font-medium text-[#1E3A5F] hover:underline"
                      >
                        {post.title}
                      </Link>
                      {post.category && (
                        <span className="ml-2 text-xs text-gray-400">· {post.category}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "#e0faf5", color: "#00836e" }}>
                          <Eye className="w-3 h-3" aria-hidden="true" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                          <EyeOff className="w-3 h-3" aria-hidden="true" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-400">{post.view_count}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/blog/admin/${post.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#1E3A5F] hover:bg-gray-100 transition-colors"
                          aria-label={`Edit ${post.title}`}
                        >
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deletePost(post.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            aria-label={`Delete ${post.title}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center">
          <Link href="/blog" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← Back to public blog
          </Link>
        </div>
      </div>
    </div>
  );
}
