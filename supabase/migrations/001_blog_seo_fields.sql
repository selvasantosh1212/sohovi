-- Run this once in your Supabase SQL editor to add SEO-rich content fields to blog_posts.
-- All columns are nullable/defaulted so existing posts are unaffected.

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS key_takeaways  text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS faqs           jsonb   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS post_type      text    DEFAULT 'explainer',
  ADD COLUMN IF NOT EXISTS pull_quote     text,
  ADD COLUMN IF NOT EXISTS internal_links jsonb   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS author_name    text,
  ADD COLUMN IF NOT EXISTS author_role    text,
  ADD COLUMN IF NOT EXISTS author_bio     text;
