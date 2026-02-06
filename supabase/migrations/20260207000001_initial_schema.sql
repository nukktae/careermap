-- Careermap initial schema: profiles, applications, application_details, saved_jobs
-- Run in Supabase SQL Editor (Dashboard > SQL Editor) for project nvvnyhbmcetedpxxehzx

-- 1. Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  phone text,
  photo_url text,
  education jsonb default '{}',
  skills text[] default '{}',
  experience jsonb default '[]',
  projects jsonb default '[]',
  resume_sections jsonb default '{}',
  cover_letter_text text,
  preferences jsonb default '{}',
  account_settings jsonb default '{}',
  billing_info jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- 2. Applications and application_details
do $$ begin
  create type application_status as enum (
    'interested', 'applied', 'resume_passed', 'interview', 'final'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type application_outcome as enum ('offer', 'rejected');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id integer not null,
  status application_status not null default 'interested',
  added_at timestamptz not null default now(),
  applied_at timestamptz,
  updated_at timestamptz,
  has_notes boolean not null default false,
  outcome application_outcome,
  constraint uq_user_job unique (user_id, job_id)
);

create table if not exists public.application_details (
  application_id uuid primary key references public.applications(id) on delete cascade,
  notes text default '',
  documents jsonb default '[]',
  contacts jsonb default '[]',
  reminders jsonb default '[]',
  timeline jsonb default '[]'
);

alter table public.applications enable row level security;
drop policy if exists "Users can CRUD own applications" on public.applications;
create policy "Users can CRUD own applications" on public.applications
  for all using (auth.uid() = user_id);

alter table public.application_details enable row level security;
drop policy if exists "Users can CRUD details of own applications" on public.application_details;
create policy "Users can CRUD details of own applications" on public.application_details
  for all using (
    exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid())
  );

-- 3. Saved jobs
create table if not exists public.saved_jobs (
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id integer not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, job_id)
);

alter table public.saved_jobs enable row level security;
drop policy if exists "Users can CRUD own saved_jobs" on public.saved_jobs;
create policy "Users can CRUD own saved_jobs" on public.saved_jobs
  for all using (auth.uid() = user_id);
