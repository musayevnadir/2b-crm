create table public.objects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  address text not null check (length(trim(address)) > 0),
  created_at timestamptz not null default now()
);

alter table public.objects enable row level security;
