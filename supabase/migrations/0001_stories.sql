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
