-- Enable RLS and allow public CRUD operations on schedule table
alter table public.schedule enable row level security;

do $$
begin
  create policy "Public read schedule" on public.schedule
    for select
    using (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Public insert schedule" on public.schedule
    for insert
    with check (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Public update schedule" on public.schedule
    for update
    using (true)
    with check (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Public delete schedule" on public.schedule
    for delete
    using (true);
exception
  when duplicate_object then null;
end $$;

-- Refresh PostgREST schema cache
notify pgrst, 'reload schema';
