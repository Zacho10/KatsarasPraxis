create extension if not exists "pgcrypto";

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  age integer,
  phone text,
  risk text not null default 'Stable',
  diagnosis text,
  allergies text,
  medication text,
  notes text,
  photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  date date not null,
  time time,
  type text,
  reason text,
  plan text,
  created_at timestamptz not null default now()
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  name text not null,
  date date not null,
  status text not null default 'Pending',
  result text,
  file_path text,
  file_name text,
  file_type text,
  file_size integer,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  title text not null,
  due text,
  priority text not null default 'Moderate',
  notes text,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.patients enable row level security;
alter table public.visits enable row level security;
alter table public.exams enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "patients own rows" on public.patients;
create policy "patients own rows"
  on public.patients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "visits own rows" on public.visits;
create policy "visits own rows"
  on public.visits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "exams own rows" on public.exams;
create policy "exams own rows"
  on public.exams for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "tasks own rows" on public.tasks;
create policy "tasks own rows"
  on public.tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
