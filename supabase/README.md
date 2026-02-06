# Supabase migrations

Run migrations in the Supabase Dashboard **in order**:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and select your project (e.g. `nvvnyhbmcetedpxxehzx`).
2. Go to **SQL Editor**.
3. Run each migration file once, in order:
   - `migrations/20260207000001_initial_schema.sql` — tables, enums, trigger, RLS (required).
   - `migrations/20260207000002_indexes.sql` — optional indexes for applications and saved_jobs.
   - `migrations/20260207000003_profiles_updated_at_trigger.sql` — optional auto-update of `profiles.updated_at`.

Or use the Supabase CLI from this directory: `supabase db push` (after linking the project).
