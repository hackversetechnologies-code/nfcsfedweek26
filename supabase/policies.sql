-- Row Level Security. Run after schema.sql.
-- Public (anon) users may: read event_settings, read active teams + counts,
-- read active executives, insert their own registration + payment.
-- Everything else (approve/reject, editing settings/teams/executives,
-- reading payment/contact details) is admin-only via the service-role key,
-- which is only ever used server-side in app/api/admin/*.

alter table event_settings enable row level security;
alter table teams enable row level security;
alter table registrations enable row level security;
alter table payments enable row level security;
alter table tickets enable row level security;
alter table executives enable row level security;

-- event_settings: public read only
create policy "public read event settings" on event_settings
  for select using (true);

-- teams: public read only (names/colours — no member PII lives here)
create policy "public read teams" on teams
  for select using (true);

-- executives: public can read active ones
create policy "public read active executives" on executives
  for select using (active = true);

-- registrations: public can INSERT their own registration (registration_open
-- is enforced in the app layer), but cannot read/list registrations back —
-- the register/payment flow keeps the id client-side after insert.
create policy "public insert registration" on registrations
  for insert with check (true);

-- registrations: allow reading a single row back by id (needed for the
-- payment + ticket pages) — do this via a Postgres function instead of a
-- blanket select policy so the full table is never listable publicly.
create or replace function get_registration_public(reg_id uuid)
returns table (id uuid, full_name text, status text, team_id uuid)
language sql security definer as $$
  select id, full_name, status, team_id from registrations where id = reg_id;
$$;

-- payments: public can INSERT their own payment record, not read the queue
create policy "public insert payment" on payments
  for insert with check (true);

-- tickets: no public select policy — tickets are only ever looked up by
-- QR token through the /api/verify-ticket route using the service-role key.
