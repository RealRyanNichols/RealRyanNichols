-- ============================================================
-- RepWatchr Comment Ranking + Public Q&A Policy
-- ============================================================
-- Optional migration for richer public questions and answers.
-- The app currently works before this migration is applied; this adds the
-- durable fields needed to grade/rank comments without suppressing lawful
-- viewpoint disagreement.

alter table public.comments
  add column if not exists parent_comment_id uuid references public.comments(id) on delete cascade,
  add column if not exists comment_kind text not null default 'comment'
    check (comment_kind in ('comment', 'question', 'official_answer', 'source_note')),
  add column if not exists author_type text not null default 'signed_in'
    check (author_type in ('claimed_official', 'verified_parent', 'verified_resident', 'journalist', 'signed_in', 'anonymous')),
  add column if not exists rank_score integer not null default 30
    check (rank_score between 0 and 100),
  add column if not exists contains_source boolean not null default false,
  add column if not exists source_url text,
  add column if not exists question_status text not null default 'open'
    check (question_status in ('open', 'answered', 'needs_source', 'closed')),
  add column if not exists visibility_status text not null default 'visible'
    check (visibility_status in ('visible', 'flagged_for_review', 'removed_illegal')),
  add column if not exists moderation_reason text;

create index if not exists idx_comments_public_rank
  on public.comments(official_id, visibility_status, rank_score desc, created_at desc);

create index if not exists idx_comments_parent
  on public.comments(parent_comment_id, created_at asc);

create or replace function public.comment_rank_for_author(author_type text, contains_source boolean)
returns integer
language sql
immutable
as $$
  select least(
    100,
    case author_type
      when 'claimed_official' then 95
      when 'verified_parent' then 85
      when 'verified_resident' then 80
      when 'journalist' then 75
      when 'signed_in' then 45
      else 25
    end + case when contains_source then 10 else 0 end
  );
$$;

create or replace function public.set_comment_rank_score()
returns trigger
language plpgsql
as $$
begin
  new.rank_score = public.comment_rank_for_author(new.author_type, new.contains_source);
  return new;
end;
$$;

drop trigger if exists set_comments_rank_score on public.comments;
create trigger set_comments_rank_score
  before insert or update of author_type, contains_source on public.comments
  for each row execute function public.set_comment_rank_score();

comment on column public.comments.visibility_status is
  'RepWatchr policy: lawful constitutionally protected viewpoint disagreement remains visible. Ranking can change, but lawful comments are not shadow banned or hidden for being unpopular. Illegal threats, doxxing, spam, private student data, and unlawful harassment are handled as moderation issues.';
