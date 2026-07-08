-- Run this in the Supabase SQL Editor (or `supabase db push` if you use the CLI)
-- for the project referenced by VITE_SUPABASE_URL. Safe to re-run.
--
-- Stores each Story as a single JSONB document, mirroring the shape the
-- frontend already uses for localStorage (see src/shared/types/story.ts).
-- This keeps src/shared/utils/storage.ts simple: one row per story, no
-- separate chapters/characters tables to keep in sync.
--
-- Scoped to the signed-in user (see src/features/auth/) via auth.uid(), so
-- each account only ever sees its own stories. Rows saved before this column
-- existed (user_id null) become unreadable under these policies — that's
-- intentional, not a bug: there was no auth at all before, so those rows had
-- no owner to scope them to.

create table if not exists public.stories (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.stories add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists stories_updated_at_idx on public.stories (updated_at desc);
create index if not exists stories_user_id_idx on public.stories (user_id);

alter table public.stories enable row level security;

drop policy if exists "public read" on public.stories;
drop policy if exists "public insert" on public.stories;
drop policy if exists "public update" on public.stories;
drop policy if exists "public delete" on public.stories;
drop policy if exists "owner read" on public.stories;
drop policy if exists "owner insert" on public.stories;
drop policy if exists "owner update" on public.stories;
drop policy if exists "owner delete" on public.stories;

create policy "owner read" on public.stories for select using (auth.uid() = user_id);
create policy "owner insert" on public.stories for insert with check (auth.uid() = user_id);
create policy "owner update" on public.stories for update using (auth.uid() = user_id);
create policy "owner delete" on public.stories for delete using (auth.uid() = user_id);

--
-- User Profiles (Roles and Privileges)
-- Matches the UI plan tiers ('free', 'premium', 'pro') and statuses
--
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  avatar_url text,
  plan_type text not null default 'free' check (plan_type in ('free', 'premium', 'pro', 'owner')),
  status text not null default 'online' check (status in ('online', 'idle', 'dnd', 'invisible')),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Policies for profiles
drop policy if exists "public read profiles" on public.profiles;
drop policy if exists "owner insert profiles" on public.profiles;
drop policy if exists "owner update profiles" on public.profiles;

create policy "public read profiles" on public.profiles for select using (true);
create policy "owner insert profiles" on public.profiles for insert with check (auth.uid() = id);
create policy "owner update profiles" on public.profiles for update using (auth.uid() = id);

-- Trigger to automatically create a profile for new users on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, plan_type, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    case when lower(new.email) = 'mgamed2002@gmail.com' then 'owner' else 'free' end,
    'online'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

--
-- Enforce Story Limits (Privileges) on Database Level
-- Free users are restricted to 3 stories max; Pro/Premium are unlimited.
--
create or replace function public.check_story_limit()
returns trigger as $$
declare
  user_plan text;
  story_count integer;
begin
  -- Retrieve user plan from profiles table (default to 'free')
  select plan_type into user_plan from public.profiles where id = new.user_id;
  user_plan := coalesce(user_plan, 'free');

  -- Count existing stories for this user
  select count(*) into story_count from public.stories where user_id = new.user_id;

  -- Limit free tier users to 3 stories
  if user_plan = 'free' and story_count >= 3 then
    raise exception 'Story limit reached. The free tier is limited to 3 stories. Please upgrade to Pro or Premium to write unlimited stories!';
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists before_story_insert on public.stories;
create trigger before_story_insert
  before insert on public.stories
  for each row execute procedure public.check_story_limit();

