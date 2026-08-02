-- Email tracking for both public forms.
-- Run once in the Supabase SQL editor.
-- NOTE: this migration ALTERS public.access_requests (adds six nullable
-- columns). It removes nothing and rewrites no existing data.

begin;

-- ── contact messages ──────────────────────────────────────────────────
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  tel         text,
  message     text not null
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

revoke all on table public.contact_messages from public;
revoke all on table public.contact_messages from anon;
revoke all on table public.contact_messages from authenticated;
grant select, insert, update on table public.contact_messages to service_role;

-- ── tracking columns on both request tables ───────────────────────────
alter table public.access_requests
  add column if not exists resend_email_id         text,
  add column if not exists email_status            text,
  add column if not exists email_sent_at           timestamptz,
  add column if not exists email_delivered_at      timestamptz,
  add column if not exists email_error             text,
  add column if not exists email_status_updated_at timestamptz;

alter table public.contact_messages
  add column if not exists resend_email_id         text,
  add column if not exists email_status            text,
  add column if not exists email_sent_at           timestamptz,
  add column if not exists email_delivered_at      timestamptz,
  add column if not exists email_error             text,
  add column if not exists email_status_updated_at timestamptz;

-- The webhook falls back to this lookup when the record_id tag is absent.
create index if not exists access_requests_resend_email_id_idx
  on public.access_requests (resend_email_id);
create index if not exists contact_messages_resend_email_id_idx
  on public.contact_messages (resend_email_id);

-- ── append-only webhook log ───────────────────────────────────────────
-- Every verified event lands here, whatever recipient it belongs to and
-- whether or not a matching request row is found. svix_id is the delivery
-- id: unique and not null, so Resend's retries collide at the database
-- level (SQLSTATE 23505) rather than relying on application logic.
create table if not exists public.email_events (
  id                uuid primary key default gen_random_uuid(),
  received_at       timestamptz not null default now(),
  svix_id           text        not null unique,
  event_created_at  timestamptz not null,
  recipient         text        not null,
  resend_email_id   text,
  form_type         text,
  record_id         uuid,
  event_type        text        not null,
  payload           jsonb
);

create index if not exists email_events_resend_email_id_idx
  on public.email_events (resend_email_id);
create index if not exists email_events_record_idx
  on public.email_events (form_type, record_id);
create index if not exists email_events_recipient_idx
  on public.email_events (recipient);

alter table public.email_events enable row level security;

revoke all on table public.email_events from public;
revoke all on table public.email_events from anon;
revoke all on table public.email_events from authenticated;
grant select, insert on table public.email_events to service_role;

-- ── retention policy ──────────────────────────────────────────────────
-- Declarative only. Nothing is deleted: every policy ships disabled and the
-- routine defaults to a dry run that just reports what it *would* remove.
create table if not exists public.retention_policies (
  table_name   text primary key,
  retain_days  integer not null check (retain_days > 0),
  enabled      boolean not null default false,
  updated_at   timestamptz not null default now()
);

insert into public.retention_policies (table_name, retain_days, enabled)
values ('contact_messages', 730, false),
       ('email_events',     180, false)
on conflict (table_name) do nothing;

alter table public.retention_policies enable row level security;
revoke all on table public.retention_policies from public;
revoke all on table public.retention_policies from anon;
revoke all on table public.retention_policies from authenticated;
grant select, update on table public.retention_policies to service_role;

-- Reports candidates. Deletes only when a policy is enabled AND the caller
-- explicitly passes p_dry_run => false. Both are false today. On top of
-- that, service_role holds no DELETE grant on either table, so an enabled
-- policy would still fail — activating retention takes a deliberate grant.
create or replace function public.apply_retention(p_dry_run boolean default true)
returns table (table_name text, candidates bigint, deleted bigint)
language plpgsql
security invoker
set search_path = public
as $$
declare
  pol public.retention_policies%rowtype;
  n   bigint;
  d   bigint;
begin
  for pol in select * from public.retention_policies loop
    d := 0;
    if pol.table_name = 'contact_messages' then
      select count(*) into n from public.contact_messages
        where created_at < now() - make_interval(days => pol.retain_days);
      if pol.enabled and not p_dry_run then
        delete from public.contact_messages
          where created_at < now() - make_interval(days => pol.retain_days);
        get diagnostics d = row_count;
      end if;
    elsif pol.table_name = 'email_events' then
      select count(*) into n from public.email_events
        where received_at < now() - make_interval(days => pol.retain_days);
      if pol.enabled and not p_dry_run then
        delete from public.email_events
          where received_at < now() - make_interval(days => pol.retain_days);
        get diagnostics d = row_count;
      end if;
    else
      continue;
    end if;
    table_name := pol.table_name; candidates := n; deleted := d;
    return next;
  end loop;
end;
$$;

revoke all on function public.apply_retention(boolean) from public;
revoke all on function public.apply_retention(boolean) from anon;
revoke all on function public.apply_retention(boolean) from authenticated;
grant execute on function public.apply_retention(boolean) to service_role;

commit;
