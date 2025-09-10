-- Enable RLS and allow public CRUD access on clients table
alter table public.clients enable row level security;

create policy "Public read clients" on public.clients
for select
using (true);

create policy "Public insert clients" on public.clients
for insert
with check (true);

create policy "Public update clients" on public.clients
for update
using (true)
with check (true);

create policy "Public delete clients" on public.clients
for delete
using (true);
