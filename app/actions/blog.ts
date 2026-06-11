"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { requireAdmin, isAdmin } from "@/lib/clerk/utils";
import type { BlogPost } from "@/types/app.types";

// ---- Internal helpers ----------------------------------------------------

/** Estimate read time (200 wpm) */
function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ---- Public reads (anon key, published only) ------------------------------

export async function getPublishedPosts(limit = 20, offset = 0): Promise<BlogPost[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) return [];
    return (data ?? []) as BlogPost[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (error) return null;
  return data as BlogPost;
}

export async function getPublishedPostCount(): Promise<number> {
  try {
    const supabase = createServiceClient();
    const { count } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("published", true);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getAllCategories(): Promise<string[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("category")
      .eq("published", true)
      .not("category", "is", null);
    const cats = (data ?? []).map((r: { category: string }) => r.category).filter(Boolean);
    return Array.from(new Set(cats)).sort();
  } catch {
    return [];
  }
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .eq("category", category)
      .order("published_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as BlogPost[];
  } catch {
    return [];
  }
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  // Use service client — called from generateStaticParams where cookies() is unavailable
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published", true);
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export async function incrementViewCount(postId: string): Promise<void> {
  try {
    const supabase = createServiceClient();
    await supabase.rpc("increment_view_count", { post_id: postId });
  } catch {
    // Best-effort — ignore if RPC not yet deployed
  }
}

// ---- Admin check (client-callable, returns boolean) -----------------------

export async function checkIsAdminAction(): Promise<boolean> {
  const { userId } = await auth();
  return isAdmin(userId);
}

// ---- Admin reads (service role, all posts) --------------------------------

export async function getAdminPosts(): Promise<BlogPost[]> {
  await requireAdmin();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as BlogPost[];
}

export async function getAdminPostById(postId: string): Promise<BlogPost | null> {
  await requireAdmin();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", postId)
    .single();
  if (error) return null;
  return data as BlogPost;
}

// ---- Admin writes ---------------------------------------------------------

export interface BlogPostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  tags: string[];
  category?: string;
  seo_title?: string;
  seo_description?: string;
  og_image_url?: string;
  key_takeaways?: string[];
  faqs?: { q: string; a: string }[];
  post_type?: string;
  pull_quote?: string;
  internal_links?: { href: string; title: string }[];
  author_name?: string;
  author_role?: string;
  author_bio?: string;
  published: boolean;
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const userId = await requireAdmin();
  const supabase = createServiceClient();
  const read_time_min = estimateReadTime(input.content);
  const published_at = input.published ? new Date().toISOString() : null;
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      ...input,
      clerk_user_id: userId,
      read_time_min,
      published_at,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  revalidatePath(`/blog/${input.slug}`);
  return data as BlogPost;
}

export async function updatePost(
  postId: string,
  input: Partial<BlogPostInput>
): Promise<void> {
  await requireAdmin();
  const supabase = createServiceClient();
  const patch: Record<string, unknown> = { ...input, updated_at: new Date().toISOString() };
  if (input.content) patch.read_time_min = estimateReadTime(input.content);
  if (input.published !== undefined) {
    patch.published_at = input.published ? new Date().toISOString() : null;
  }
  const { error } = await supabase
    .from("blog_posts")
    .update(patch)
    .eq("id", postId);
  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  if (input.slug) revalidatePath(`/blog/${input.slug}`);
  revalidatePath("/blog/admin");
}

export async function deletePost(postId: string): Promise<void> {
  await requireAdmin();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", postId);
  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  revalidatePath("/blog/admin");
}

export async function getRelatedPosts(
  currentId: string,
  category: string | null,
  limit = 3
): Promise<BlogPost[]> {
  const supabase = createServiceClient();
  if (category) {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .eq("category", category)
      .neq("id", currentId)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (data && data.length > 0) return data as BlogPost[];
  }
  // Fallback: most recent posts
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .neq("id", currentId)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as BlogPost[];
}
