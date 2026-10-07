-- CASECALL upgrade: target roles, recommendations and AI-built custom cases.
-- Run ONCE in Supabase if you already ran schema.sql before: SQL Editor > New query > paste > Run.
-- Safe to run more than once.

-- AI-built cases are stored on the attempt itself.
alter table public.cc_attempts add column if not exists custom_case jsonb;

-- Rename the old target-role labels to the new ones.
update public.cc_users set track = 'Product management' where track = 'Product';
update public.cc_users set track = 'General management' where track = 'Strategy and general management';

-- Faster lookups for the daily custom-case limit.
create index if not exists cc_attempts_user_case_idx on public.cc_attempts (user_id, case_id, started_at desc);
