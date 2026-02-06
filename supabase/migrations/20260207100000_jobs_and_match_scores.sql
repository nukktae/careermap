-- Jobs table (job listings) + user_job_match_scores (match cache for dashboard)
-- Run in Supabase SQL Editor after 20260207000003_profiles_updated_at_trigger.sql

-- 1. Enum for match badge (apply / prep / stretch)
do $$ begin
  create type match_badge as enum ('apply', 'prep', 'stretch');
exception
  when duplicate_object then null;
end $$;

-- 2. Jobs table: canonical job listings (optional; same job_id space as applications/saved_jobs)
-- id is explicit so we can use 1,2,3... for static and 100000+ for Linkareer
create table if not exists public.jobs (
  id integer primary key,
  company text not null default '',
  title text not null default '',
  location text not null default '',
  location_filter text not null default 'seoul',
  type text not null default '',
  type_value text not null default 'fulltime',
  experience text not null default '',
  experience_level text not null default '신입',
  salary text default '',
  salary_min integer not null default 0,
  salary_max integer not null default 0,
  company_type text not null default '스타트업',
  industry text not null default 'IT',
  posted_at text default '',
  logo text default '',
  logo_url text,
  description text default '',
  responsibilities jsonb default '[]',
  requirements jsonb default '[]',
  preferred jsonb default '[]',
  benefits jsonb default '[]',
  deadline text default '',
  source text not null default 'static' check (source in ('static', 'linkareer')),
  external_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.jobs is 'Job listings (optional backfill). job_id in applications/saved_jobs/user_job_match_scores uses same id space.';

alter table public.jobs enable row level security;

create policy "Authenticated users can read jobs"
  on public.jobs for select
  using (auth.role() = 'authenticated');

-- 3. User job match scores: cache of (user, job) match for dashboard "내 매칭 현황" / "최근 매칭된 채용"
-- job_id is same logical id as applications/saved_jobs (static 1..n or Linkareer 100000+); no FK so it works before jobs table is backfilled
create table if not exists public.user_job_match_scores (
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id integer not null,
  match_percent integer not null default 0 check (match_percent >= 0 and match_percent <= 100),
  badge match_badge not null default 'stretch',
  matched_skills text[] default '{}',
  missing_skills text[] default '{}',
  computed_at timestamptz not null default now(),
  primary key (user_id, job_id)
);

comment on table public.user_job_match_scores is 'Cached match result per user/job for dashboard and recommendations';

alter table public.user_job_match_scores enable row level security;

create policy "Users can CRUD own match scores"
  on public.user_job_match_scores
  for all using (auth.uid() = user_id);

-- 4. Indexes for dashboard queries
create index if not exists idx_user_job_match_scores_user_computed
  on public.user_job_match_scores (user_id, computed_at desc);

create index if not exists idx_user_job_match_scores_user_badge
  on public.user_job_match_scores (user_id, badge);
