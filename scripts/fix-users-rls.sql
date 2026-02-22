-- Allow users to read their own profile row
create policy "Users can read own profile" on public.users
  for select using (id = auth.uid());
