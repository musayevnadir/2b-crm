drop policy profiles_select on public.profiles;

create policy profiles_select on public.profiles
  for select to authenticated
  using (
    id = auth.uid()
    or role = 'manager'
    or public.is_manager()
  );

revoke execute on function public.is_executor(uuid) from authenticated;
