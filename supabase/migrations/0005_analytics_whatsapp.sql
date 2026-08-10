-- Allow the WhatsApp outbound event on public.analytics_events.
-- REQUIRES 0004_analytics_events.sql to have run first — this file only
-- alters constraints, it creates no table.
-- Safe to run more than once.

begin;

-- The pair of independent checks from 0004 is replaced by one that constrains
-- the COMBINATION: a placement is only valid for its own event, so no future
-- typo can file a WhatsApp click under the Instagram placement.
alter table public.analytics_events
  drop constraint if exists analytics_events_event_name_check;
alter table public.analytics_events
  drop constraint if exists analytics_events_placement_check;
alter table public.analytics_events
  drop constraint if exists analytics_events_event_check;

alter table public.analytics_events
  add constraint analytics_events_event_check check (
       (event_name = 'instagram_outbound_click' and placement = 'menu_footer')
    or (event_name = 'whatsapp_outbound_click'  and placement = 'floating_whatsapp')
  );

-- Unchanged, restated so this file documents the whole contract.
alter table public.analytics_events
  drop constraint if exists analytics_events_page_path_check;
alter table public.analytics_events
  add constraint analytics_events_page_path_check check (page_path = '/');

commit;
