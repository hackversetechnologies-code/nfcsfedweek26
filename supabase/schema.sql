-- NFCS Federation Week 2026 — schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) once.

create extension if not exists "pgcrypto";

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

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  colour text not null,
  hex text not null,
  active boolean not null default true,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

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

create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null unique references registrations(id) on delete cascade,
  ticket_code text not null unique,
  qr_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists executives (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo_url text,
  bio text,
  display_order int not null default 0,
  active boolean not null default true
);

-- seed the four suggested teams (admin can add/rename/deactivate later)
insert into teams (name, colour, hex, "order") values
  ('Team Green', 'green', '#3E6B4F', 1),
  ('Team Blue',  'blue',  '#2E4E7E', 2),
  ('Team Black', 'black', '#1A1A1A', 3),
  ('Team Red',   'red',   '#8C3A32', 4)
on conflict do nothing;
