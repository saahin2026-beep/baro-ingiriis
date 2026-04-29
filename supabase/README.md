# Supabase — schema & migrations

Source of truth for the Hadaling database.

## What's in here

```
supabase/
├── migrations/                    # ordered SQL migrations (idempotent)
│   ├── 20260429000000_baseline.sql
│   ├── 20260429000001_seed_profile_setup.sql
│   └── 20260429000002_seed_practice_feature_descriptions.sql
└── README.md                      # this file
```

Each migration filename starts with `YYYYMMDDHHMMSS_` so they run in chronological order. Numbers are not gappy — they're just timestamps. The `baseline.sql` file represents the entire DB state on 2026-04-29; future migrations add deltas on top.

## Current workflow (manual — Level 2)

When you need to change the database:

1. Add a new file: `supabase/migrations/YYYYMMDDHHMMSS_short_description.sql`
2. Write idempotent SQL inside (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE … ADD COLUMN IF NOT EXISTS`, `DROP POLICY IF EXISTS … CREATE POLICY …`)
3. Open the Supabase dashboard → SQL Editor → paste the file's contents → Run
4. Commit the file to git

The repo and the live DB stay in sync because every change you make is captured here.

To recreate the database from scratch (e.g. brand-new Supabase project):
1. Run each migration file in order in the SQL Editor
2. Done

## Future workflow (Supabase CLI — Level 3, recommended)

Once you install the Supabase CLI you don't need to copy-paste anymore. The CLI applies migrations automatically.

```bash
brew install supabase/tap/supabase     # macOS
supabase init                          # creates supabase/config.toml
supabase link --project-ref vxrgjwmaxueqeledpvem
supabase db push                       # applies every pending migration
```

From then on:

```bash
supabase migration new <short_name>    # creates a new YYYYMMDDHHMMSS_<short_name>.sql
# … edit the file …
supabase db push                       # applies it to the linked project
```

For local development:

```bash
supabase start                         # spins up an identical Postgres locally
                                       # (Docker required)
supabase db reset                      # rebuilds local from migrations/
```

For CI/CD: the `supabase db push` command becomes a step in your deploy pipeline so prod DB stays in lockstep with the repo on every release.

The migrations in this folder are already in the format the CLI expects, so installing the CLI later is a drop-in upgrade.

## Conventions

- **Idempotent SQL.** Every migration must be safe to re-run. Use `IF NOT EXISTS`, `IF EXISTS`, `CREATE OR REPLACE`, `ON CONFLICT DO NOTHING`. Never `CREATE TABLE foo` (will error second time) — always `CREATE TABLE IF NOT EXISTS foo`.

- **Naming.** Filenames start with a 14-digit timestamp. After the underscore, lowercase snake_case describing the change. Examples:
  - `20260501120000_add_user_streaks_table.sql`
  - `20260601000000_drop_obsolete_admin_settings.sql`

- **One concern per migration.** A migration adds a column, adds a table, or seeds some rows — not all three. Easier to revert one piece if something breaks.

- **No DML (INSERT/UPDATE) in schema migrations.** Keep seed data in separate `*_seed_*.sql` files so structural changes are clearly distinguishable from content changes.

- **Don't edit committed migrations.** Once a migration has been applied (in your DB or anyone else's), treat the file as immutable. If you need to undo something, write a *new* migration that undoes it.

## Current admin email

The RLS policies hardcode `saahin2026@gmail.com` as the admin. If that email ever changes, write a new migration that does:

```sql
-- replace_admin_email.sql
do $$
declare new_email text := 'NEWEMAIL@example.com';
declare tbl text;
declare old_email text := 'saahin2026@gmail.com';
begin
  for tbl in select unnest(array['lessons','exercises','phrases','onboarding_content','practice_features','practice_exercises','profile_setup_content','word_of_day','client_errors']) loop
    execute format('drop policy if exists %I on public.%I', 'admin write ' || tbl, tbl);
    execute format('create policy %I on public.%I for all using ((auth.jwt() ->> ''email'') = %L) with check ((auth.jwt() ->> ''email'') = %L)', 'admin write ' || tbl, tbl, new_email, new_email);
  end loop;
  -- client_errors uses different policy name
  execute format('drop policy if exists "admin can read errors" on public.client_errors');
  execute format('create policy "admin can read errors" on public.client_errors for select using ((auth.jwt() ->> ''email'') = %L)', new_email);
end $$;
```

(Better long-term: store the admin email in an `app_config` table or env var read by a function. Out of scope for now.)

## What lives outside this folder

- **Auth users** are managed by Supabase, not by these migrations.
- **Storage buckets** (none currently) live under `supabase/storage/` if you ever add file uploads.
- **Email templates** (signup confirmation, password reset) are configured in the Supabase dashboard under Authentication → Email Templates. Not version-controlled here. Worth a screenshot if you redesign them.
- **Auth settings** (email confirmation toggle, redirect URLs, SMTP) — also dashboard-only.
- **Seed content** for tables already populated in the live DB (lessons, exercises, phrases, word_of_day, practice_exercises, etc.) is **not** in this folder. The current production data is the source of truth for those. If you ever need to recreate from scratch, you'd export the rows via `supabase db dump --data-only` (CLI) or pg_dump.
