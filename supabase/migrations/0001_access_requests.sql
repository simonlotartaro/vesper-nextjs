-- Access requests submitted through the "Request Access" modal.
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).

create table if not exists public.access_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  city        text,
  role        text,
  referred    text,
  interested  text,
  note        text,
  lang        text
);

create index if not exists access_requests_created_at_idx
  on public.access_requests (created_at desc);

-- No policies are defined on purpose: the table stays locked to everyone
-- except the service role, which is what the API route uses. Nothing is
-- readable from the browser.
alter table public.access_requests enable row level security;
