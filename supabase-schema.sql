-- ============================================================
-- East Texas Official Tracker - Supabase Database Schema
-- ============================================================
-- Run this in your Supabase SQL Editor to set up the database.

-- Profiles table: stores verified Texas resident info
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  county text not null,
  district text,
  verified boolean default false not null,
  dl_hash text unique, -- SHA-256 hash of TX DL number (prevents duplicates)
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Citizen votes table: approve/disapprove votes on officials
create table if not exists public.citizen_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  official_id text not null,
  vote text check (vote in ('approve', 'disapprove')) not null,
  county text not null, -- denormalized from profile for fast aggregation
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  -- One vote per user per official
  unique(user_id, official_id)
);

-- Indexes for fast aggregation queries
create index if not exists idx_citizen_votes_official on public.citizen_votes(official_id);
create index if not exists idx_citizen_votes_official_county on public.citizen_votes(official_id, county);
create index if not exists idx_citizen_votes_user on public.citizen_votes(user_id);
create index if not exists idx_profiles_user_id on public.profiles(user_id);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.citizen_votes enable row level security;

-- Profiles: users can read and update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Citizen votes: users can manage their own votes
create policy "Users can view own votes"
  on public.citizen_votes for select
  using (auth.uid() = user_id);

create policy "Users can insert own votes"
  on public.citizen_votes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own votes"
  on public.citizen_votes for update
  using (auth.uid() = user_id);

create policy "Users can delete own votes"
  on public.citizen_votes for delete
  using (auth.uid() = user_id);

-- Public aggregate view: anyone can see approval ratings (no individual votes exposed)
create or replace view public.approval_ratings as
select
  official_id,
  count(*) as total_votes,
  count(*) filter (where vote = 'approve') as approve_count,
  count(*) filter (where vote = 'disapprove') as disapprove_count,
  round(
    (count(*) filter (where vote = 'approve'))::numeric / nullif(count(*), 0) * 100,
    1
  ) as approval_percentage
from public.citizen_votes
group by official_id;

-- Per-county aggregate view for in-district breakdowns
create or replace view public.approval_ratings_by_county as
select
  official_id,
  county,
  count(*) as total_votes,
  count(*) filter (where vote = 'approve') as approve_count,
  count(*) filter (where vote = 'disapprove') as disapprove_count,
  round(
    (count(*) filter (where vote = 'approve'))::numeric / nullif(count(*), 0) * 100,
    1
  ) as approval_percentage
from public.citizen_votes
group by official_id, county;

-- Grant public read access to aggregate views
grant select on public.approval_ratings to anon, authenticated;
grant select on public.approval_ratings_by_county to anon, authenticated;

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_citizen_votes_updated_at
  before update on public.citizen_votes
  for each row execute function public.handle_updated_at();
