create table public.task_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  from_status public.task_status,
  to_status public.task_status not null,
  changed_by uuid not null references public.profiles (id) on delete restrict,
  comment text,
  created_at timestamptz not null default now(),
  check (to_status <> 'rework' or length(trim(coalesce(comment, ''))) > 0)
);

create index task_history_task_id_idx on public.task_history (task_id);

alter table public.task_history enable row level security;
