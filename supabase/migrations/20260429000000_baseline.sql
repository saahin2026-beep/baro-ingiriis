-- ============================================================================
-- Baseline schema for Hadaling
-- ============================================================================
-- Captures the full state of public.* in the live database as of 2026-04-29.
-- Idempotent: running this against an existing DB is safe; running against a
-- fresh project creates everything end-to-end.
--
-- Sections:
--   1. Extensions
--   2. Functions (must come before triggers that reference them)
--   3. Tables (in dependency order)
--   4. Indexes
--   5. Triggers
--   6. RLS policies
--
-- Seed content (lessons, exercises, phrases, etc.) is in ../seed.sql.
-- ============================================================================


-- 1. EXTENSIONS ---------------------------------------------------------------

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";


-- 2. FUNCTIONS ----------------------------------------------------------------

-- Sets updated_at = now() on UPDATE. Used by triggers below.
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Auto-create a profiles row when a new auth.users row is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$;

-- Username availability check (case-insensitive). RPC called from the client
-- to validate username availability before submission. SECURITY DEFINER bypasses
-- RLS, but only returns boolean — no profile data leaks.
create or replace function public.check_username_available(check_username text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (
    select 1 from public.profiles
    where lower(username) = lower(check_username)
  );
$$;

grant execute on function public.check_username_available(text) to anon, authenticated;


-- 3. TABLES -------------------------------------------------------------------

-- Profiles: extends auth.users with app-specific identity fields.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  username text,
  email text,
  phone text,
  birthday date,
  city text,
  profile_complete boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Lessons: the 10 main lessons.
create table if not exists public.lessons (
  id serial primary key,
  sort_order integer not null default 0,
  title_so text not null,
  title_en text not null,
  ability text not null,
  explanation text[] not null default '{}',
  chunks jsonb not null default '[]',
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Exercises: the 10 exercises per lesson.
create table if not exists public.exercises (
  id serial primary key,
  lesson_id integer not null references public.lessons(id) on delete cascade,
  sort_order integer not null default 0,
  type text not null check (type in ('choose', 'fillgap', 'order', 'listen', 'scenario')),
  instruction text not null,
  prompt text,
  scenario text,
  correct_index integer,
  options text[] default '{}',
  sentence text[] default '{}',
  blank_index integer,
  words text[] default '{}',
  correct_sentence text,
  chunk_id text,
  direction text,
  hint text,
  audio_text text,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Phrases: feedback / encouragement / celebration phrases shown across the app.
create table if not exists public.phrases (
  id serial primary key,
  category text not null check (category in ('feedback', 'encouragement', 'celebration')),
  text_so text not null,
  emoji text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Onboarding screens: editable copy for each of the 6 onboarding screens.
create table if not exists public.onboarding_content (
  id serial primary key,
  screen_key text not null unique,
  content jsonb not null default '{}',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Practice features: the 6 cards on the Practice tab (vocabulary, plurals, etc.)
create table if not exists public.practice_features (
  id serial primary key,
  key text not null unique,
  title text not null,
  title_en text,
  description text default '',
  description_en text default '',
  color text default '#4CAF50',
  bg text default '#E8F5E9',
  icon text default 'Book',
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Practice exercises: per-feature exercises (60 per feature).
create table if not exists public.practice_exercises (
  id serial primary key,
  feature_key text not null references public.practice_features(key) on delete cascade,
  type text not null check (type in ('choose', 'fillgap', 'scenario', 'scramble', 'sentenceBuilder')),
  instruction text,
  prompt text,
  scenario text,
  options jsonb,
  correct_index integer,
  correct_answer text,
  correct_sentence text,
  sentence jsonb,
  blank_index integer,
  pieces jsonb,
  words jsonb,
  somali_full text,
  distractors jsonb default '[]',
  hint text,
  mode text,
  is_active boolean not null default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Profile setup screen content (4 steps: username, phone, birthday, city).
create table if not exists public.profile_setup_content (
  id serial primary key,
  step integer not null unique check (step in (0, 1, 2, 3)),
  field_key text not null unique check (field_key in ('username', 'phone', 'birthday', 'city')),
  title_so text not null default '',
  title_en text not null default '',
  subtitle_so text not null default '',
  subtitle_en text not null default '',
  placeholder_so text not null default '',
  placeholder_en text not null default '',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Word of the Day: daily vocab.
create table if not exists public.word_of_day (
  id serial primary key,
  english text not null,
  somali text not null,
  category text default 'general',
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Client errors: app-side errors reported via observability.reportError().
create table if not exists public.client_errors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  message text not null,
  stack text,
  url text,
  user_agent text,
  user_id uuid,
  context jsonb,
  environment text
);


-- 4. INDEXES ------------------------------------------------------------------

-- Case-insensitive uniqueness on username (prevents 'Ahmed' colliding with 'ahmed')
create unique index if not exists profiles_username_unique
  on public.profiles (lower(username));

-- Lesson exercise lookups
create index if not exists idx_exercises_lesson_id on public.exercises (lesson_id);
create index if not exists idx_exercises_sort_order on public.exercises (lesson_id, sort_order);
create index if not exists idx_lessons_sort_order on public.lessons (sort_order);

-- Phrase filtering
create index if not exists idx_phrases_category on public.phrases (category);

-- Practice exercises by feature_key (the most common filter)
create index if not exists practice_exercises_feature_key_idx
  on public.practice_exercises (feature_key);

-- Error log browsing
create index if not exists client_errors_created_at_idx
  on public.client_errors (created_at desc);


-- 5. TRIGGERS -----------------------------------------------------------------

-- updated_at auto-update across content tables
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();

drop trigger if exists lessons_updated_at on public.lessons;
create trigger lessons_updated_at before update on public.lessons
  for each row execute function public.update_updated_at();

drop trigger if exists exercises_updated_at on public.exercises;
create trigger exercises_updated_at before update on public.exercises
  for each row execute function public.update_updated_at();

drop trigger if exists phrases_updated_at on public.phrases;
create trigger phrases_updated_at before update on public.phrases
  for each row execute function public.update_updated_at();

drop trigger if exists onboarding_content_updated_at on public.onboarding_content;
create trigger onboarding_content_updated_at before update on public.onboarding_content
  for each row execute function public.update_updated_at();

drop trigger if exists word_of_day_updated_at on public.word_of_day;
create trigger word_of_day_updated_at before update on public.word_of_day
  for each row execute function public.update_updated_at();

drop trigger if exists profile_setup_content_updated_at on public.profile_setup_content;
create trigger profile_setup_content_updated_at before update on public.profile_setup_content
  for each row execute function public.update_updated_at();

-- Auto-create profile row on signup (fires on auth.users insert)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();


-- 6. RLS POLICIES -------------------------------------------------------------

-- Enable RLS on every table
alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.exercises enable row level security;
alter table public.phrases enable row level security;
alter table public.onboarding_content enable row level security;
alter table public.practice_features enable row level security;
alter table public.practice_exercises enable row level security;
alter table public.profile_setup_content enable row level security;
alter table public.word_of_day enable row level security;
alter table public.client_errors enable row level security;

-- ----- profiles: own row only -----
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert" on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "own profile write" on public.profiles;
create policy "own profile write" on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own profile delete" on public.profiles;
create policy "own profile delete" on public.profiles for delete
  using (auth.uid() = id);

-- ----- Content tables: public read, admin write -----
-- (admin email is hardcoded below — change if the admin email changes)

-- lessons
drop policy if exists "public read lessons" on public.lessons;
create policy "public read lessons" on public.lessons for select using (true);
drop policy if exists "admin write lessons" on public.lessons;
create policy "admin write lessons" on public.lessons for all
  using ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com');

-- exercises
drop policy if exists "public read exercises" on public.exercises;
create policy "public read exercises" on public.exercises for select using (true);
drop policy if exists "admin write exercises" on public.exercises;
create policy "admin write exercises" on public.exercises for all
  using ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com');

-- phrases
drop policy if exists "public read phrases" on public.phrases;
create policy "public read phrases" on public.phrases for select using (true);
drop policy if exists "admin write phrases" on public.phrases;
create policy "admin write phrases" on public.phrases for all
  using ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com');

-- onboarding_content
drop policy if exists "public read onboarding_content" on public.onboarding_content;
create policy "public read onboarding_content" on public.onboarding_content for select using (true);
drop policy if exists "admin write onboarding_content" on public.onboarding_content;
create policy "admin write onboarding_content" on public.onboarding_content for all
  using ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com');

-- practice_features
drop policy if exists "public read practice_features" on public.practice_features;
create policy "public read practice_features" on public.practice_features for select using (true);
drop policy if exists "admin write practice_features" on public.practice_features;
create policy "admin write practice_features" on public.practice_features for all
  using ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com');

-- practice_exercises
drop policy if exists "public read practice_exercises" on public.practice_exercises;
create policy "public read practice_exercises" on public.practice_exercises for select using (true);
drop policy if exists "admin write practice_exercises" on public.practice_exercises;
create policy "admin write practice_exercises" on public.practice_exercises for all
  using ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com');

-- profile_setup_content
drop policy if exists "public read profile_setup_content" on public.profile_setup_content;
create policy "public read profile_setup_content" on public.profile_setup_content for select using (true);
drop policy if exists "admin write profile_setup_content" on public.profile_setup_content;
create policy "admin write profile_setup_content" on public.profile_setup_content for all
  using ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com');

-- word_of_day
drop policy if exists "public read word_of_day" on public.word_of_day;
create policy "public read word_of_day" on public.word_of_day for select using (true);
drop policy if exists "admin write word_of_day" on public.word_of_day;
create policy "admin write word_of_day" on public.word_of_day for all
  using ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com');

-- ----- client_errors: anyone can write, admin reads -----
drop policy if exists "anyone can report errors" on public.client_errors;
create policy "anyone can report errors" on public.client_errors for insert
  with check (true);

drop policy if exists "admin can read errors" on public.client_errors;
create policy "admin can read errors" on public.client_errors for select
  using ((auth.jwt() ->> 'email') = 'saahin2026@gmail.com');
