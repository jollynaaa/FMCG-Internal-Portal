-- ============================================================
-- FMCG Internal Portal — Full Database Schema
-- Paste this entire file into the Supabase Dashboard SQL Editor
-- (Dashboard → SQL Editor → New Query → Run All)
-- ============================================================

-- ── 0. Helpers ─────────────────────────────────────────────

-- Enum for user roles — constrains the role column at the DB level,
-- which is stronger than a CHECK constraint and integrates with RLS policies.
create type public.user_role as enum ('admin', 'sales_rep', 'viewer');

-- ── 1. users ───────────────────────────────────────────────
-- Mirrors auth.users but stores the application-level role.
-- The id foreign key cascades deletes: removing a user from Auth
-- automatically removes their profile row.

create table public.users (
  id        uuid primary key references auth.users (id) on delete cascade,
  email     text not null,
  role      public.user_role not null default 'viewer'
);

comment on table public.users is
  'Application profile row for every Supabase Auth user.';

alter table public.users enable row level security;

-- Users can read their own profile.
create policy "users: select own row"
  on public.users for select
  using (auth.uid() = id);

-- Admins can read all profiles (needed for user management UI).
create policy "users: admins select all"
  on public.users for select
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

-- Only admins can update roles.
create policy "users: admins update role"
  on public.users for update
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

-- Auto-create a profile row when a new user signs up via Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (new.id, new.email, 'viewer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── 2. decks ───────────────────────────────────────────────
-- Stores metadata for company presentation decks uploaded to
-- Supabase Storage.  file_url is the storage *path* (not a public URL);
-- signed URLs must be generated server-side per download request.

create table public.decks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text not null,
  file_url    text not null,        -- e.g. 'decks/q2-review.pdf'
  created_at  timestamptz not null default now()
);

comment on column public.decks.file_url is
  'Supabase Storage path. Generate a signed URL server-side before serving to clients.';

alter table public.decks enable row level security;

-- All authenticated users can read the deck list.
create policy "decks: authenticated users select"
  on public.decks for select
  using (auth.role() = 'authenticated');

-- Only admins can upload new decks.
create policy "decks: admins insert"
  on public.decks for insert
  with check (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

-- Only admins can delete decks.
create policy "decks: admins delete"
  on public.decks for delete
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );


-- ── 3. weekly_updates ──────────────────────────────────────
-- Chronological sync log entries written in Markdown.

create table public.weekly_updates (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text not null,          -- Markdown string
  author_id   uuid not null references public.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

alter table public.weekly_updates enable row level security;

-- All authenticated users can read updates.
create policy "weekly_updates: authenticated users select"
  on public.weekly_updates for select
  using (auth.role() = 'authenticated');

-- Admins and sales reps can write updates.
create policy "weekly_updates: writers insert"
  on public.weekly_updates for insert
  with check (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
        and u.role in ('admin', 'sales_rep')
    )
  );

-- Authors can update their own updates; admins can update any.
create policy "weekly_updates: authors or admins update"
  on public.weekly_updates for update
  using (
    auth.uid() = author_id
    or exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );


-- ── 4. outreach_metrics ────────────────────────────────────
-- One row per user per week (enforced by unique constraint).
-- The application upserts on (user_id, week_starting) so re-submitting
-- the form for the same week overwrites rather than duplicates.

create table public.outreach_metrics (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users (id) on delete cascade,
  week_starting    date not null,      -- Always a Monday (ISO 8601 week anchor)
  email_count      integer not null default 0 check (email_count >= 0),
  linkedin_count   integer not null default 0 check (linkedin_count >= 0),
  cold_call_count  integer not null default 0 check (cold_call_count >= 0),

  -- Prevents duplicate rows for the same user + week.
  constraint outreach_metrics_user_week_unique unique (user_id, week_starting)
);

comment on column public.outreach_metrics.week_starting is
  'ISO date (YYYY-MM-DD) of the Monday that starts this reporting week.';

alter table public.outreach_metrics enable row level security;

-- Users can read only their own metrics; admins can read all.
create policy "outreach_metrics: select own or admin"
  on public.outreach_metrics for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

-- Users can insert their own metrics.
create policy "outreach_metrics: insert own"
  on public.outreach_metrics for insert
  with check (auth.uid() = user_id);

-- Users can update their own metrics (supports the upsert flow).
create policy "outreach_metrics: update own"
  on public.outreach_metrics for update
  using (auth.uid() = user_id);


-- ── 5. deals_closed ────────────────────────────────────────
-- GP data is sensitive: the select policy restricts viewers from
-- reading rows directly.  The application layer (RoleGate) enforces
-- the same restriction, but DB-level RLS is the authoritative guard.

create table public.deals_closed (
  id            uuid primary key default gen_random_uuid(),
  client_name   text not null,
  close_date    date not null,
  estimated_gp  numeric(14, 2) not null check (estimated_gp >= 0),
  owner_id      uuid not null references public.users (id) on delete cascade
);

alter table public.deals_closed enable row level security;

-- Owners can read their own deals.
create policy "deals_closed: select own"
  on public.deals_closed for select
  using (auth.uid() = owner_id);

-- Admins can read all deals (required for aggregate GP KPI).
create policy "deals_closed: admins select all"
  on public.deals_closed for select
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );

-- Owners can log their own deals.
create policy "deals_closed: insert own"
  on public.deals_closed for insert
  with check (auth.uid() = owner_id);

-- Owners can correct their own deals; admins can correct any.
create policy "deals_closed: update own or admin"
  on public.deals_closed for update
  using (
    auth.uid() = owner_id
    or exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );


-- ── 6. Storage bucket ──────────────────────────────────────
-- Creates the 'decks' storage bucket (private — no public URLs).
-- Signed URLs are generated per-request in the server-side data layer.

insert into storage.buckets (id, name, public)
values ('decks', 'decks', false)
on conflict (id) do nothing;

-- Authenticated users can read objects (to generate signed URLs).
create policy "storage decks: authenticated read"
  on storage.objects for select
  using (
    bucket_id = 'decks'
    and auth.role() = 'authenticated'
  );

-- Only admins can upload to the decks bucket.
create policy "storage decks: admins insert"
  on storage.objects for insert
  with check (
    bucket_id = 'decks'
    and exists (
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'admin'
    )
  );
