-- Durable rate limiting shared by every serverless instance.
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to run more than once. Creates one new table and one function.
-- Touches no existing table.

create table if not exists public.rate_limits (
  key       text primary key,
  count     integer     not null default 0,
  reset_at  timestamptz not null
);

alter table public.rate_limits enable row level security;
-- No policies: only the service role (the API routes) can touch it.

-- Atomically count one hit and report whether it is still under the limit.
-- Doing it in a single statement means two concurrent requests cannot both
-- read a stale count — which is the whole point of moving this out of memory.
create or replace function public.hit_rate_limit(
  p_key            text,
  p_limit          integer,
  p_window_seconds integer
)
returns table (allowed boolean, retry_after integer)
language plpgsql
security definer
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

-- Housekeeping: expired rows are harmless but there is no reason to keep them.
create index if not exists rate_limits_reset_at_idx on public.rate_limits (reset_at);
