-- CASECALL product tables. Run once in Supabase: SQL Editor > New query > paste > Run.
-- Row Level Security is ON with no policies: only the server key in Vercel can read or write.
create extension if not exists pgcrypto;

create table if not exists public.cc_users (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text unique not null,
  name        text,
  track       text,
  pw_hash     text not null              -- scrypt hash, never the password
);

create table if not exists public.cc_attempts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.cc_users(id) on delete cascade,
  case_id       text not null,
  started_at    timestamptz not null default now(),
  completed_at  timestamptz,
  overall       integer,                 -- 0-100
  skills        jsonb,                   -- score per skill for this case, 0-100
  summary       jsonb
);

create table if not exists public.cc_turns (
  id             bigint generated always as identity primary key,
  created_at     timestamptz not null default now(),
  attempt_id     uuid not null references public.cc_attempts(id) on delete cascade,
  user_id        uuid not null references public.cc_users(id) on delete cascade,
  stage          integer not null,
  skill          text,
  input          text not null,          -- the student's answer
  output         jsonb,                  -- what the app showed back
  is_valid       boolean,
  verdict        text,
  score          integer,                -- 1-5
  model          text,
  input_tokens   integer,
  output_tokens  integer,
  latency_ms     integer,
  error          text
);

create index if not exists cc_attempts_user_idx on public.cc_attempts (user_id, started_at desc);
create index if not exists cc_turns_attempt_idx on public.cc_turns (attempt_id, created_at);
create index if not exists cc_turns_user_idx on public.cc_turns (user_id, created_at);

alter table public.cc_users    enable row level security;
alter table public.cc_attempts enable row level security;
alter table public.cc_turns    enable row level security;
