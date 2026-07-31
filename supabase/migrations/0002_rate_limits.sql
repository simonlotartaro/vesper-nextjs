-- Durable rate limiting shared by every serverless instance.
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to run more than once. Creates one new table and one function.
-- Touches no existing table.

create table if not exists public.rate_limits (
  key       text primary key,
  count     integer     not null default 0,
  reset_at  timestamptz not null
);

create index if not exists rate_limits_reset_at_idx on public.rate_limits (reset_at);

-- RLS on, no policies: the table is unreachable for everyone except the
-- service role, which bypasses RLS by design.
alter table public.rate_limits enable row level security;

-- Belt and braces: even the grant layer says no.
revoke all on table public.rate_limits from anon;
revoke all on table public.rate_limits from authenticated;

-- Atomically count one hit and report whether it is still under the limit.
-- Doing it in a single statement means two concurrent requests cannot both
-- read a stale count — which is the whole point of moving this out of memory.
--
-- SECURITY INVOKER (the default, stated explicitly): the function runs with
-- the caller's privileges. The API routes call it with the service role, which
-- already has everything it needs, so there is nothing to elevate. Were anon
-- ever able to reach it, RLS would still block the write.
create or replace function public.hit_rate_limit(
  p_key            text,
  p_limit          integer,
  p_window_seconds integer
)
returns table (allowed boolean, retry_after integer)
language plpgsql
security invoker
set search_path = public
as $$
declare
  r public.rate_limits%rowtype;
begin
  insert into public.rate_limits as rl (key, count, reset_at)
  values (p_key, 1, now() + make_interval(secs => p_window_seconds))
  on conflict (key) do update
    set count = case when rl.reset_at <= now() then 1 else rl.count + 1 end,
        reset_at = case when rl.reset_at <= now()
                        then now() + make_interval(secs => p_window_seconds)
                        else rl.reset_at end
  returning * into r;

  return query
    select r.count <= p_limit,
           greatest(0, ceil(extract(epoch from (r.reset_at - now()))))::integer;
end;
$$;

-- Postgres grants EXECUTE to PUBLIC on new functions by default. Take it back
-- and hand it only to the service role, so the RPC is not callable from the
-- browser with the anon key.
revoke all on function public.hit_rate_limit(text, integer, integer) from public;
revoke all on function public.hit_rate_limit(text, integer, integer) from anon;
revoke all on function public.hit_rate_limit(text, integer, integer) from authenticated;
grant execute on function public.hit_rate_limit(text, integer, integer) to service_role;
