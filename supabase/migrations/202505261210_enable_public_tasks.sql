-- Enable RLS and allow public CRUD access on tasks table
alter table public.tasks enable row level security;

create policy "Public read tasks" on public.tasks
for select
using (true);

create policy "Public insert tasks" on public.tasks
for insert
with check (true);

create policy "Public update tasks" on public.tasks
for update
using (true)
with check (true);

create policy "Public delete tasks" on public.tasks
for delete
using (true);
