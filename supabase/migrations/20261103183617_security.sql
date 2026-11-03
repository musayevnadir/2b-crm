revoke all on public.profiles, public.objects, public.tasks, public.task_history from anon, authenticated;

grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.objects to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
grant select on public.task_history to authenticated;

create function public.is_manager()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'manager'
  );
$$;

create function public.is_executor(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = p_profile_id and role = 'executor'
  );
$$;

create policy profiles_select on public.profiles
  for select to authenticated
  using (true);

create policy objects_select on public.objects
  for select to authenticated
  using (
    public.is_manager()
    or exists (
      select 1 from public.tasks t
      where t.object_id = objects.id and t.assignee_id = auth.uid()
    )
  );

create policy objects_insert on public.objects
  for insert to authenticated
  with check (public.is_manager());

create policy objects_update on public.objects
  for update to authenticated
  using (public.is_manager())
  with check (public.is_manager());

create policy objects_delete on public.objects
  for delete to authenticated
  using (public.is_manager());

create policy tasks_select on public.tasks
  for select to authenticated
  using (public.is_manager() or assignee_id = auth.uid());

create policy tasks_insert on public.tasks
  for insert to authenticated
  with check (public.is_manager());

create policy tasks_update on public.tasks
  for update to authenticated
  using (public.is_manager())
  with check (public.is_manager());

create policy tasks_delete on public.tasks
  for delete to authenticated
  using (public.is_manager());

create policy task_history_select on public.task_history
  for select to authenticated
  using (
    public.is_manager()
    or exists (
      select 1 from public.tasks t
      where t.id = task_history.task_id and t.assignee_id = auth.uid()
    )
  );

create function public.tasks_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.status := 'new';
  new.created_at := now();
  if auth.uid() is not null then
    new.author_id := auth.uid();
  end if;
  if not public.is_executor(new.assignee_id) then
    raise exception 'assignee_must_be_executor';
  end if;
  return new;
end;
$$;

create trigger tasks_before_insert
  before insert on public.tasks
  for each row execute function public.tasks_before_insert();

create function public.tasks_after_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.task_history (task_id, from_status, to_status, changed_by)
  values (new.id, null, new.status, new.author_id);
  return new;
end;
$$;

create trigger tasks_after_insert
  after insert on public.tasks
  for each row execute function public.tasks_after_insert();

create function public.tasks_before_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status is distinct from old.status
     and coalesce(current_setting('app.status_change', true), '') <> 'on' then
    raise exception 'status_change_only_via_function';
  end if;
  new.author_id := old.author_id;
  new.created_at := old.created_at;
  if new.assignee_id is distinct from old.assignee_id
     and not public.is_executor(new.assignee_id) then
    raise exception 'assignee_must_be_executor';
  end if;
  return new;
end;
$$;

create trigger tasks_before_update
  before update on public.tasks
  for each row execute function public.tasks_before_update();

create function public.change_task_status(
  p_task_id uuid,
  p_status public.task_status,
  p_comment text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_task public.tasks;
  v_uid uuid := auth.uid();
  v_is_manager boolean := public.is_manager();
  v_is_assignee boolean;
  v_allowed boolean;
  v_comment text := nullif(trim(coalesce(p_comment, '')), '');
begin
  if v_uid is null then
    raise exception 'not_authenticated';
  end if;

  select * into v_task from public.tasks where id = p_task_id for update;
  if not found then
    raise exception 'task_not_found';
  end if;

  v_is_assignee := v_task.assignee_id = v_uid;

  if not v_is_manager and not v_is_assignee then
    raise exception 'task_not_found';
  end if;

  v_allowed := case
    when v_task.status = 'new' and p_status = 'in_progress' then v_is_assignee
    when v_task.status = 'in_progress' and p_status = 'review' then v_is_assignee
    when v_task.status = 'review' and p_status = 'accepted' then v_is_manager
    when v_task.status = 'review' and p_status = 'rework' then v_is_manager
    when v_task.status = 'rework' and p_status = 'in_progress' then v_is_assignee
    else false
  end;

  if not v_allowed then
    raise exception 'transition_not_allowed';
  end if;

  if p_status = 'rework' and v_comment is null then
    raise exception 'comment_required';
  end if;

  perform set_config('app.status_change', 'on', true);
  update public.tasks set status = p_status where id = p_task_id;
  perform set_config('app.status_change', 'off', true);

  insert into public.task_history (task_id, from_status, to_status, changed_by, comment)
  values (p_task_id, v_task.status, p_status, v_uid, v_comment);
end;
$$;

revoke execute on function public.is_manager() from public, anon;
revoke execute on function public.is_executor(uuid) from public, anon;
revoke execute on function public.change_task_status(uuid, public.task_status, text) from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.tasks_before_insert() from public, anon, authenticated;
revoke execute on function public.tasks_after_insert() from public, anon, authenticated;
revoke execute on function public.tasks_before_update() from public, anon, authenticated;

grant execute on function public.is_manager() to authenticated;
grant execute on function public.is_executor(uuid) to authenticated;
grant execute on function public.change_task_status(uuid, public.task_status, text) to authenticated;
