-- Open Chair prototype schema. Run in Supabase SQL Editor as the project owner.
-- These are deliberately public-to-signed-in community profiles, not public internet records.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
 id uuid primary key default gen_random_uuid(),
 owner_user_id uuid unique references auth.users(id) on delete cascade,
 name text not null check (char_length(name) between 1 and 90),
 email text,
 type text not null check (type in ('student','alumni')),
 program text not null,
 class_year integer not null check (class_year between 1950 and 2100),
 industry text not null,
 role text not null default '',
 interests text[] not null default '{}',
 chat_goal text not null default '',
 open_to_chats boolean not null default false,
 is_sample boolean not null default false,
 avatar_tone text default 'peach',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint profile_sample_owner check (
  (is_sample = true and owner_user_id is null and email is null)
  or (is_sample = false and owner_user_id is not null)
 )
);

create index if not exists profiles_open_industry_idx on public.profiles (open_to_chats, industry);
create index if not exists profiles_program_year_idx on public.profiles (program, class_year);

-- University domain is checked at the server and also in RLS.
create or replace function public.has_uoft_email() returns boolean
language sql stable as $$
 select split_part(lower(coalesce(auth.jwt()->>'email','')),'@',2) ~ '(^|[.])utoronto[.]ca$';
$$;

alter table public.profiles enable row level security;
drop policy if exists "uoft members read open profiles or own" on public.profiles;
create policy "uoft members read open profiles or own" on public.profiles
 for select to authenticated using (public.has_uoft_email() and (open_to_chats or owner_user_id=auth.uid()));
drop policy if exists "uoft members create only own" on public.profiles;
create policy "uoft members create only own" on public.profiles
 for insert to authenticated with check (
  public.has_uoft_email() and owner_user_id=auth.uid() and id=auth.uid()
  and not is_sample and lower(email)=lower(auth.jwt()->>'email')
 );
drop policy if exists "uoft members edit only own" on public.profiles;
create policy "uoft members edit only own" on public.profiles
 for update to authenticated using (public.has_uoft_email() and owner_user_id=auth.uid() and not is_sample)
 with check (public.has_uoft_email() and owner_user_id=auth.uid() and id=auth.uid() and not is_sample and lower(email)=lower(auth.jwt()->>'email'));
-- No delete policy: editing and toggling visibility are all this prototype needs.

-- Note: sample data is inserted via the SQL editor with privileged project-owner access.
-- The public anon key must never be given insert/update privileges beyond the above policies.
