-- Run this in the Supabase SQL Editor (or `supabase db push` if you use the CLI)
-- for the project referenced by VITE_SUPABASE_URL.
--
-- Stores each Story as a single JSONB document, mirroring the shape the
-- frontend already uses for localStorage (see src/shared/types/story.ts).
-- This keeps src/shared/utils/storage.ts simple: one row per story, no
-- separate chapters/characters tables to keep in sync.

create table if not exists public.stories (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists stories_updated_at_idx on public.stories (updated_at desc);

alter table public.stories enable row level security;

-- IMPORTANT: there is no authentication wired up yet (see README), so these
-- policies allow full read/write access to anyone using the app's publishable
-- key — every story in this table is effectively public. Replace these with
-- policies scoped to auth.uid() once you add Supabase Auth; until then, do
-- not store anything in here you wouldn't want any visitor to read or delete.
drop policy if exists "public read" on public.stories;
drop policy if exists "public insert" on public.stories;
drop policy if exists "public update" on public.stories;
drop policy if exists "public delete" on public.stories;

create policy "public read" on public.stories for select using (true);
create policy "public insert" on public.stories for insert with check (true);
create policy "public update" on public.stories for update using (true);
create policy "public delete" on public.stories for delete using (true);
