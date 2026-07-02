-- Daric OS — database schema (run in Supabase → SQL Editor).
-- Mirrors the Zod models in src/lib/models. Wire src/lib/db.ts to these tables.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company text not null,
  industry text not null,
  contact text not null,
  email text not null,
  phone text default '',
  website text default '',
  country text default '',
  status text not null default 'new',
  notes text default '',
  value numeric not null default 0
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client text not null,
  industry text not null,
  progress int not null default 0 check (progress between 0 and 100),
  deadline date,
  status text not null default 'planning',
  tasks jsonb not null default '[]'
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  number text not null,
  client text not null,
  title text not null,
  status text not null default 'draft',
  currency text not null default 'USD',
  items jsonb not null default '[]'
);

-- Unified inbox — every public Daric site posts here (source = agency|restaurant|hotel|medical).
create table if not exists public.inbox_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null,
  name text not null,
  email text not null,
  subject text default '',
  message text not null,
  read boolean not null default false
);

-- Internal tool: enable RLS and restrict to authenticated staff in production.
alter table public.leads enable row level security;
alter table public.projects enable row level security;
alter table public.proposals enable row level security;
alter table public.inbox_messages enable row level security;

-- Public sites may INSERT into the inbox (anon); staff read/manage via authenticated policies.
drop policy if exists "anon can submit enquiries" on public.inbox_messages;
create policy "anon can submit enquiries" on public.inbox_messages
  for insert to anon with check (true);
