-- Optional: performance indexes for applications and saved_jobs
-- Run in Supabase SQL Editor after 20260207000001_initial_schema.sql

-- Faster application list by user (ordered by added_at desc)
create index if not exists idx_applications_user_added
  on public.applications (user_id, added_at desc);

-- Faster saved-jobs list by user
create index if not exists idx_saved_jobs_user
  on public.saved_jobs (user_id);
