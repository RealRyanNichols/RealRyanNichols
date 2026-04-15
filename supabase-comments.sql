-- ============================================================
-- East Texas Official Tracker - Comments Schema
-- ============================================================
-- Run this in your Supabase SQL Editor to add the comments system.

-- Comments table: public discussion on officials
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  official_id text not null,
  content text not null check (char_length(content) between 1 and 2000),
  display_name text not null check (char_length(display_name) between 1 and 50),
  county text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_comments_official on public.comments(official_id, created_at desc);
create index if not exists idx_comments_user on public.comments(user_id);

-- Row Level Security
alter table public.comments enable row level security;

-- Anyone can read comments (they're public discussion)
create policy "Anyone can view comments"
  on public.comments for select
  using (true);

-- Only verified users can post comments
create policy "Verified users can insert comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

-- Users can update their own comments
create policy "Users can update own comments"
  on public.comments for update
  using (auth.uid() = user_id);

-- Users can delete their own comments
create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- Auto-update timestamps
create trigger set_comments_updated_at
  before update on public.comments
  for each row execute function public.handle_updated_at();
