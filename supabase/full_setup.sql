-- ========================================================
-- NFCS Federation Week 2026 — Complete Database Setup
-- Copy and run this ENTIRE file in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ========================================================

-- Enable pgcrypto for UUID generation
create extension if not exists "pgcrypto";

-- 1. EVENT SETTINGS TABLE
create table if not exists event_settings (
  id int primary key default 1,
  event_name text not null default 'NFCS Federation Week 2026',
  theme text not null default 'Christ Our Foundation, Love Our Mission',
  start_date date not null default '2026-09-21',
  end_date date not null default '2026-09-27',
  picnic_date date not null default '2026-09-26',
  contribution_amount int not null default 2000,
  bank_name text not null default 'First Bank of Nigeria',
  account_name text not null default 'Ogochukwu Stella Chimuanya',
  account_number text not null default '3225195083',
  registration_open boolean not null default true,
  team_assignment_enabled boolean not null default true,
  constraint single_row check (id = 1)
);

insert into event_settings (id) values (1) on conflict (id) do nothing;

-- 2. TEAMS TABLE (with UNIQUE name constraint)
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  colour text not null,
  hex text not null,
  active boolean not null default true,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

-- Delete duplicate teams if re-running on existing database
delete from teams
where id not in (
  select distinct on (name) id
  from teams
  order by name, created_at asc
);

-- Seed default 4 picnic teams
insert into teams (name, colour, hex, "order") values
  ('Team Green', 'green', '#3E6B4F', 1),
  ('Team Blue',  'blue',  '#2E4E7E', 2),
  ('Team Black', 'black', '#1A1A1A', 3),
  ('Team Red',   'red',   '#8C3A32', 4)
on conflict (name) do nothing;

-- 3. REGISTRATIONS TABLE
create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  department text,
  level text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  team_id uuid references teams(id),
  created_at timestamptz not null default now()
);

-- 4. PAYMENTS TABLE
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references registrations(id) on delete cascade,
  amount int not null,
  bank_used text not null,
  sender_name text not null,
  transaction_reference text not null,
  transfer_time timestamptz not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- 5. TICKETS TABLE
create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null unique references registrations(id) on delete cascade,
  ticket_code text not null unique,
  qr_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- 6. EXECUTIVES TABLE
create table if not exists executives (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo_url text,
  bio text,
  display_order int not null default 0,
  active boolean not null default true
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

alter table event_settings enable row level security;
alter table teams enable row level security;
alter table registrations enable row level security;
alter table payments enable row level security;
alter table tickets enable row level security;
alter table executives enable row level security;

-- Drop existing policies if re-running script to avoid duplicate policy errors
drop policy if exists "public read event settings" on event_settings;
drop policy if exists "public read teams" on teams;
drop policy if exists "public read active executives" on executives;
drop policy if exists "public insert registration" on registrations;
drop policy if exists "public insert payment" on payments;

create policy "public read event settings" on event_settings for select using (true);
create policy "public read teams" on teams for select using (true);
create policy "public read active executives" on executives for select using (active = true);
create policy "public insert registration" on registrations for insert with check (true);
create policy "public insert payment" on payments for insert with check (true);

-- Helper function for public registration lookup
create or replace function get_registration_public(reg_id uuid)
returns table (id uuid, full_name text, status text, team_id uuid)
language sql security definer as $$
  select id, full_name, status, team_id from registrations where id = reg_id;
$$;
