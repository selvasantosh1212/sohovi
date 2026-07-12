-- Run this once in your Supabase SQL editor.
-- Adds redirect + noindex support for consolidating duplicate/thin blog posts.
-- Both columns are nullable/defaulted so existing posts are unaffected.

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS redirect_to text,
  ADD COLUMN IF NOT EXISTS noindex     boolean DEFAULT false;
