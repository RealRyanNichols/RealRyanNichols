-- East Texas Predator Watch
-- Official-source profiles, private community reports, private evidence review,
-- and redacted public notes. Run after the base Supabase auth/profile schema.

create extension if not exists pgcrypto;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_repw_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role in ('admin', 'reviewer', 'researcher')
  );
$$;

create table if not exists public.predator_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  aliases text[] not null default '{}',
  city text not null,
  county text not null,
  state text not null default 'TX',
  registry_address text,
  registry_status text not null default 'under_review' check (
    registry_status in ('registered', 'wanted', 'failure_to_register', 'address_change', 'under_review', 'inactive')
  ),
  risk_level text not null default 'not_reported' check (
    risk_level in ('low', 'moderate', 'high', 'civil_commitment', 'not_reported')
  ),
  registration_type text,
  offense text not null,
  offense_category text not null default 'Registry offense',
  conviction_date date,
  punishment text,
  victim_age text,
  registering_agency text,
  official_profile_url text not null,
  photo_url text,
  photo_source_url text,
  photo_storage_path text,
  last_verified_at date not null default current_date,
  source_freshness text not null default 'needs_recheck' check (
    source_freshness in ('checked_30_days', 'checked_90_days', 'stale', 'needs_recheck')
  ),
  watch_priority integer not null default 0 check (watch_priority >= 0 and watch_priority <= 100),
  priority_reason text not null default 'Official registry record requires review.',
  is_wanted boolean not null default false,
  warrant_source_url text,
  failure_to_register boolean not null default false,
  civil_commitment boolean not null default false,
  recent_address_change boolean not null default false,
  records_show text[] not null default '{}',
  safety_notes text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.predator_profile_sources (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.predator_profiles(id) on delete cascade not null,
  title text not null,
  url text not null,
  source_type text not null check (
    source_type in ('txdps-registry', 'nsopw', 'court-record', 'sheriff-record', 'police-record', 'official-notice', 'public-record')
  ),
  last_checked_at date not null default current_date,
  detail text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.predator_reports (
  id uuid primary key default gen_random_uuid(),
  tracking_id text not null unique default ('PW-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  profile_id uuid references public.predator_profiles(id) on delete set null,
  person_name text not null,
  report_kind text not null check (
    report_kind in ('behavior_concern', 'registry_update', 'failure_to_register', 'possible_unregistered', 'victim_statement', 'source_correction')
  ),
  county text not null,
  city text not null,
  incident_at timestamptz,
  police_contacted text not null default 'unknown' check (police_contacted in ('yes', 'no', 'unknown')),
  summary text not null,
  submitter_name text,
  submitter_email text,
  submitter_phone text,
  submitter_ip_hash text,
  user_agent_hash text,
  emergency_acknowledged boolean not null default false,
  consent_acknowledged boolean not null default false,
  review_status text not null default 'new' check (review_status in ('new', 'triage', 'needs_followup', 'verified', 'rejected', 'closed')),
  publication_status text not null default 'private' check (publication_status in ('private', 'redaction_ready', 'approved_public_summary', 'do_not_publish')),
  reviewer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.predator_report_evidence (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.predator_reports(id) on delete cascade not null,
  evidence_type text not null check (evidence_type in ('link', 'upload', 'upload_failed')),
  external_url text,
  storage_bucket text,
  storage_path text,
  file_name text,
  file_size bigint,
  content_type text,
  review_status text not null default 'new' check (review_status in ('new', 'reviewed', 'verified', 'rejected', 'error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.predator_public_notes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.predator_profiles(id) on delete cascade not null,
  report_id uuid references public.predator_reports(id) on delete set null,
  label text not null,
  body text not null,
  source_label text,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  published_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_predator_profiles_public
  on public.predator_profiles(status, county, city, watch_priority desc);
create index if not exists idx_predator_profiles_flags
  on public.predator_profiles(status, is_wanted, failure_to_register, civil_commitment, recent_address_change);
create index if not exists idx_predator_profile_sources_profile
  on public.predator_profile_sources(profile_id, last_checked_at desc);
create index if not exists idx_predator_reports_review
  on public.predator_reports(review_status, created_at desc);
create index if not exists idx_predator_reports_county
  on public.predator_reports(county, city, created_at desc);
create index if not exists idx_predator_report_evidence_report
  on public.predator_report_evidence(report_id, review_status);
create index if not exists idx_predator_public_notes_profile
  on public.predator_public_notes(profile_id, status, published_at desc);

alter table public.predator_profiles enable row level security;
alter table public.predator_profile_sources enable row level security;
alter table public.predator_reports enable row level security;
alter table public.predator_report_evidence enable row level security;
alter table public.predator_public_notes enable row level security;

drop policy if exists "Public reads published predator profiles" on public.predator_profiles;
drop policy if exists "Operators manage predator profiles" on public.predator_profiles;
drop policy if exists "Public reads published predator profile sources" on public.predator_profile_sources;
drop policy if exists "Operators manage predator profile sources" on public.predator_profile_sources;
drop policy if exists "Operators manage predator reports" on public.predator_reports;
drop policy if exists "Operators manage predator report evidence" on public.predator_report_evidence;
drop policy if exists "Public reads published predator public notes" on public.predator_public_notes;
drop policy if exists "Operators manage predator public notes" on public.predator_public_notes;

create policy "Public reads published predator profiles"
  on public.predator_profiles for select
  using (status = 'published');

create policy "Operators manage predator profiles"
  on public.predator_profiles for all
  using (public.is_repw_admin())
  with check (public.is_repw_admin());

create policy "Public reads published predator profile sources"
  on public.predator_profile_sources for select
  using (
    exists (
      select 1 from public.predator_profiles pp
      where pp.id = profile_id and pp.status = 'published'
    )
  );

create policy "Operators manage predator profile sources"
  on public.predator_profile_sources for all
  using (public.is_repw_admin())
  with check (public.is_repw_admin());

create policy "Operators manage predator reports"
  on public.predator_reports for all
  using (public.is_repw_admin())
  with check (public.is_repw_admin());

create policy "Operators manage predator report evidence"
  on public.predator_report_evidence for all
  using (public.is_repw_admin())
  with check (public.is_repw_admin());

create policy "Public reads published predator public notes"
  on public.predator_public_notes for select
  using (
    status = 'published'
    and exists (
      select 1 from public.predator_profiles pp
      where pp.id = profile_id and pp.status = 'published'
    )
  );

create policy "Operators manage predator public notes"
  on public.predator_public_notes for all
  using (public.is_repw_admin())
  with check (public.is_repw_admin());

drop trigger if exists set_predator_profiles_updated_at on public.predator_profiles;
create trigger set_predator_profiles_updated_at
  before update on public.predator_profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists set_predator_profile_sources_updated_at on public.predator_profile_sources;
create trigger set_predator_profile_sources_updated_at
  before update on public.predator_profile_sources
  for each row execute function public.handle_updated_at();

drop trigger if exists set_predator_reports_updated_at on public.predator_reports;
create trigger set_predator_reports_updated_at
  before update on public.predator_reports
  for each row execute function public.handle_updated_at();

drop trigger if exists set_predator_report_evidence_updated_at on public.predator_report_evidence;
create trigger set_predator_report_evidence_updated_at
  before update on public.predator_report_evidence
  for each row execute function public.handle_updated_at();

drop trigger if exists set_predator_public_notes_updated_at on public.predator_public_notes;
create trigger set_predator_public_notes_updated_at
  before update on public.predator_public_notes
  for each row execute function public.handle_updated_at();

insert into storage.buckets (id, name, public)
values
  ('predator-report-evidence', 'predator-report-evidence', false),
  ('predator-profile-media-approved', 'predator-profile-media-approved', true)
on conflict (id) do nothing;

drop policy if exists "Operators manage predator report evidence bucket" on storage.objects;
drop policy if exists "Public reads approved predator profile media" on storage.objects;
drop policy if exists "Operators manage approved predator profile media" on storage.objects;

create policy "Operators manage predator report evidence bucket"
  on storage.objects for all
  using (bucket_id = 'predator-report-evidence' and public.is_repw_admin())
  with check (bucket_id = 'predator-report-evidence' and public.is_repw_admin());

create policy "Public reads approved predator profile media"
  on storage.objects for select
  using (bucket_id = 'predator-profile-media-approved');

create policy "Operators manage approved predator profile media"
  on storage.objects for all
  using (bucket_id = 'predator-profile-media-approved' and public.is_repw_admin())
  with check (bucket_id = 'predator-profile-media-approved' and public.is_repw_admin());

grant select on public.predator_profiles to anon, authenticated;
grant select on public.predator_profile_sources to anon, authenticated;
grant select on public.predator_public_notes to anon, authenticated;
grant all on public.predator_profiles to authenticated;
grant all on public.predator_profile_sources to authenticated;
grant all on public.predator_reports to authenticated;
grant all on public.predator_report_evidence to authenticated;
grant all on public.predator_public_notes to authenticated;
