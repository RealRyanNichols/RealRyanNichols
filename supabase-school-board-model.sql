-- ============================================================
-- RepWatchr School Board Evidence + Scoring Model
-- ============================================================
-- Run this in Supabase SQL Editor after the base schema.
-- Purpose: store scored public-source evidence for East Texas school board dossiers.

create table if not exists public.school_board_evidence (
  id uuid primary key default gen_random_uuid(),
  candidate_id text not null,
  district_slug text not null,
  category text not null check (
    category in (
      'child_safety',
      'parental_rights',
      'student_privacy',
      'curriculum_and_books',
      'transparency',
      'fiscal_stewardship',
      'public_service',
      'political_lean'
    )
  ),
  direction text not null check (direction in ('positive', 'negative', 'neutral')),
  fact_label text not null check (fact_label in ('FACT', 'DOCUMENTED_INFERENCE', 'REQUIRES_FURTHER_EVIDENCE')),
  summary text not null,
  source_url text not null,
  source_title text,
  event_date date,
  severity text check (severity in ('low', 'medium', 'high', 'critical')),
  tags text[] default '{}',
  reviewer_status text not null default 'needs_review' check (
    reviewer_status in ('needs_review', 'approved', 'rejected', 'archived')
  ),
  reviewer_notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_school_board_evidence_candidate
  on public.school_board_evidence(candidate_id);

create index if not exists idx_school_board_evidence_district
  on public.school_board_evidence(district_slug);

create index if not exists idx_school_board_evidence_category
  on public.school_board_evidence(category);

create index if not exists idx_school_board_evidence_tags
  on public.school_board_evidence using gin(tags);

alter table public.school_board_evidence enable row level security;

create policy "Public can read approved school board evidence"
  on public.school_board_evidence for select
  using (reviewer_status = 'approved');

create policy "Authenticated users can submit school board evidence"
  on public.school_board_evidence for insert
  to authenticated
  with check (auth.uid() = created_by);

create trigger set_school_board_evidence_updated_at
  before update on public.school_board_evidence
  for each row execute function public.handle_updated_at();

create or replace view public.school_board_evidence_approved as
select
  id,
  candidate_id,
  district_slug,
  category,
  direction,
  fact_label,
  summary,
  source_url,
  source_title,
  event_date,
  severity,
  tags,
  created_at,
  updated_at
from public.school_board_evidence
where reviewer_status = 'approved'
  and fact_label in ('FACT', 'DOCUMENTED_INFERENCE');

grant select on public.school_board_evidence_approved to anon, authenticated;
