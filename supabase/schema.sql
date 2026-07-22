-- One IMCA — Supabase schema (Auth + private-by-default sharing)
-- Run this in Supabase SQL Editor after creating a project.

create extension if not exists "pgcrypto";

-- Roles
create type public.app_role as enum (
  'executive_director',
  'department_head',
  'unit_director',
  'member'
);

create type public.visibility as enum (
  'private',
  'unit',
  'department',
  'organization'
);

create type public.resource_kind as enum (
  'submission',
  'proposal',
  'managed_event',
  'calendar_event'
);

create table public.departments (
  id text primary key,
  name text not null,
  head_name text
);

create table public.units (
  id text primary key,
  department_id text not null references public.departments(id) on delete cascade,
  name text not null,
  director_name text
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role public.app_role not null default 'member',
  department_id text references public.departments(id),
  unit_id text references public.units(id),
  created_at timestamptz not null default now()
);

create table public.unit_invite_codes (
  code text primary key,
  unit_id text not null references public.units(id) on delete cascade,
  role public.app_role not null default 'member',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.work_items (
  id uuid primary key default gen_random_uuid(),
  kind public.resource_kind not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  department_id text references public.departments(id),
  unit_id text references public.units(id),
  visibility public.visibility not null default 'private',
  title text not null default '',
  payload jsonb not null default '{}'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.work_shares (
  id uuid primary key default gen_random_uuid(),
  work_item_id uuid not null references public.work_items(id) on delete cascade,
  shared_with_user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (work_item_id, shared_with_user_id)
);

create index work_items_owner_idx on public.work_items(owner_id);
create index work_items_kind_idx on public.work_items(kind);
create index work_items_unit_idx on public.work_items(unit_id);

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Access helper
create or replace function public.can_view_work(item public.work_items)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    item.deleted_at is null
    and (
      item.owner_id = auth.uid()
      or exists (
        select 1 from public.work_shares s
        where s.work_item_id = item.id and s.shared_with_user_id = auth.uid()
      )
      or (
        item.visibility in ('unit', 'department', 'organization')
        and exists (
          select 1 from public.profiles p
          where p.id = auth.uid()
            and p.unit_id is not null
            and p.unit_id = item.unit_id
        )
      )
      or (
        item.visibility in ('department', 'organization')
        and exists (
          select 1 from public.profiles p
          where p.id = auth.uid()
            and (
              (p.role = 'department_head' and p.department_id = item.department_id)
              or p.role = 'executive_director'
            )
        )
      )
      or (
        item.visibility = 'organization'
        and exists (
          select 1 from public.profiles p
          where p.id = auth.uid()
            and p.role in ('executive_director', 'department_head')
        )
      )
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'executive_director'
          and item.visibility = 'organization'
      )
    );
$$;

create or replace function public.can_edit_work(item public.work_items)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select item.deleted_at is null and item.owner_id = auth.uid();
$$;

alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.units enable row level security;
alter table public.unit_invite_codes enable row level security;
alter table public.work_items enable row level security;
alter table public.work_shares enable row level security;

create policy "profiles read authenticated"
  on public.profiles for select to authenticated
  using (true);

create policy "profiles update self"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "departments read"
  on public.departments for select to authenticated using (true);

create policy "units read"
  on public.units for select to authenticated using (true);

create policy "invite codes read active"
  on public.unit_invite_codes for select to authenticated
  using (active = true);

create policy "work select"
  on public.work_items for select to authenticated
  using (public.can_view_work(work_items));

create policy "work insert own"
  on public.work_items for insert to authenticated
  with check (owner_id = auth.uid());

create policy "work update own"
  on public.work_items for update to authenticated
  using (public.can_edit_work(work_items))
  with check (owner_id = auth.uid());

create policy "work delete soft own"
  on public.work_items for delete to authenticated
  using (owner_id = auth.uid());

create policy "shares read related"
  on public.work_shares for select to authenticated
  using (
    exists (
      select 1 from public.work_items w
      where w.id = work_item_id and public.can_view_work(w)
    )
  );

create policy "shares insert by owner"
  on public.work_shares for insert to authenticated
  with check (
    exists (
      select 1 from public.work_items w
      where w.id = work_item_id and w.owner_id = auth.uid()
    )
  );

create policy "shares delete by owner"
  on public.work_shares for delete to authenticated
  using (
    exists (
      select 1 from public.work_items w
      where w.id = work_item_id and w.owner_id = auth.uid()
    )
  );
