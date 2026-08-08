alter table public.profiles
  add column if not exists receipts_enabled boolean not null default false;

create table if not exists public.learning_receipts (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idempotency_key text not null check (char_length(idempotency_key) between 8 and 160),
  schema_version text not null default '1',
  milestone_scope text not null default 'course' check (milestone_scope in ('lesson', 'unit', 'course')),
  payload_hash text not null check (payload_hash ~ '^[0-9a-f]{64}$'),
  pseudonymous_learner_id text not null check (char_length(pseudonymous_learner_id) = 24),
  content_identifier text not null check (char_length(content_identifier) between 1 and 240),
  achievement_type text not null check (char_length(achievement_type) between 1 and 80),
  completed_at timestamptz not null,
  issuer_public_key text not null,
  content_version text not null,
  network text not null check (network in ('testnet', 'public')),
  transaction_hash text,
  verification_url text,
  status text not null default 'pending' check (status in ('pending', 'issued', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, idempotency_key),
  unique (user_id, payload_hash)
);

alter table public.learning_receipts
  add column if not exists milestone_scope text;

update public.learning_receipts
set milestone_scope = case
  when achievement_type like 'lesson%' then 'lesson'
  when achievement_type like 'unit%' then 'unit'
  else 'course'
end
where milestone_scope is null;

alter table public.learning_receipts
  alter column milestone_scope set default 'course',
  alter column milestone_scope set not null;

alter table public.learning_receipts
  drop constraint if exists learning_receipts_milestone_scope_check;

alter table public.learning_receipts
  add constraint learning_receipts_milestone_scope_check
  check (milestone_scope in ('lesson', 'unit', 'course'));

create index if not exists learning_receipts_user_created_idx
  on public.learning_receipts(user_id, created_at desc);

create index if not exists learning_receipts_user_scope_created_idx
  on public.learning_receipts(user_id, milestone_scope, created_at desc);

drop trigger if exists learning_receipts_set_updated_at on public.learning_receipts;
create trigger learning_receipts_set_updated_at
  before update on public.learning_receipts
  for each row execute function private.set_updated_at();

alter table public.learning_receipts enable row level security;

drop policy if exists learning_receipts_owner_select on public.learning_receipts;
create policy learning_receipts_owner_select on public.learning_receipts
  for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.learning_receipts from anon;
revoke all on table public.learning_receipts from authenticated;
grant select on table public.learning_receipts to authenticated;
grant all on table public.learning_receipts to service_role;
