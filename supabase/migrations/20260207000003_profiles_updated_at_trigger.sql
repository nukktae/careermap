-- Optional: auto-set profiles.updated_at on UPDATE
-- Run in Supabase SQL Editor after 20260207000002_indexes.sql

create or replace function public.set_profiles_updated_at()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_profiles_updated_at();
