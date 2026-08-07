create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, service_role;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text not null default 'Learner',
  term text not null default 'August–December 2026',
  primary_subject text not null default 'Research Methods',
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.planner_tasks (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 240),
  subject text not null default 'Research Methods',
  minutes integer not null default 20 check (minutes between 1 and 1440),
  due text not null default 'Today',
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.focus_sessions (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  duration_seconds integer not null check (duration_seconds between 1 and 86400),
  started_at timestamptz,
  accumulated_seconds integer not null default 0 check (accumulated_seconds between 0 and 86400),
  state text not null check (state in ('active', 'paused', 'completed', 'ended')),
  completed_at timestamptz,
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists planner_tasks_user_id_idx on public.planner_tasks(user_id);
create index if not exists planner_tasks_user_due_idx on public.planner_tasks(user_id, due);
create index if not exists focus_sessions_user_id_idx on public.focus_sessions(user_id);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
begin
  insert into public.profiles (id, email, display_name, verified)
  values (
    new.id,
    new.email,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'Learner'),
    new.email_confirmed_at is not null
  )
  on conflict (id) do update
    set email = excluded.email,
        verified = excluded.verified;
  return new;
end;
$$;

revoke execute on function private.set_updated_at() from public, anon, authenticated;
revoke execute on function private.handle_new_user() from public, anon, authenticated;

drop trigger if exists profiles_on_auth_user_created on auth.users;
create trigger profiles_on_auth_user_created
  after insert or update of email, email_confirmed_at, raw_user_meta_data on auth.users
  for each row execute function private.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();

drop trigger if exists planner_tasks_set_updated_at on public.planner_tasks;
create trigger planner_tasks_set_updated_at before update on public.planner_tasks
  for each row execute function private.set_updated_at();

drop trigger if exists focus_sessions_set_updated_at on public.focus_sessions;
create trigger focus_sessions_set_updated_at before update on public.focus_sessions
  for each row execute function private.set_updated_at();

alter table public.profiles enable row level security;
alter table public.planner_tasks enable row level security;
alter table public.focus_sessions enable row level security;

drop policy if exists profiles_owner_all on public.profiles;
create policy profiles_owner_all on public.profiles
  for all to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists planner_tasks_owner_all on public.planner_tasks;
create policy planner_tasks_owner_all on public.planner_tasks
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists focus_sessions_owner_all on public.focus_sessions;
create policy focus_sessions_owner_all on public.focus_sessions
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table public.profiles, public.planner_tasks, public.focus_sessions from anon;
grant select, insert, update, delete on table public.profiles, public.planner_tasks, public.focus_sessions to authenticated;
grant all on table public.profiles, public.planner_tasks, public.focus_sessions to service_role;
grant usage on schema public to authenticated;
