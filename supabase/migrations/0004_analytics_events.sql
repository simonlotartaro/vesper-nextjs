-- Outbound click analytics.
-- No personal data by construction: there is no column that could hold a
-- name, an email or an IP, so none can be stored even by mistake.
-- Run once in the Supabase SQL editor. Safe to run more than once.

begin;

create table if not exists public.analytics_events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  event_name  text not null,
  placement   text,
  page_path   text,

  -- The server fixes these two values; the database refuses anything else,
  -- so a bug in the route cannot widen what gets recorded.
  constraint analytics_events_event_name_check
    check (event_name = 'instagram_outbound_click'),
  constraint analytics_events_placement_check
    check (placement = 'menu_footer'),
  constraint analytics_events_page_path_len_check
    check (char_length(page_path) <= 300)
);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);
create index if not exists analytics_events_name_idx
  on public.analytics_events (event_name, created_at desc);

-- RLS on, no policies: unreachable for anon and authenticated. Only the
-- service role, which the API route uses, can read or write.
alter table public.analytics_events enable row level security;

revoke all on table public.analytics_events from public;
revoke all on table public.analytics_events from anon;
revoke all on table public.analytics_events from authenticated;
grant select, insert on table public.analytics_events to service_role;

commit;
