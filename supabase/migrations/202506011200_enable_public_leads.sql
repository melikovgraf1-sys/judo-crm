-- Enable RLS and allow public CRUD access on leads table
alter table public.leads enable row level security;

create policy "Public read leads" on public.leads
for select
using (true);

create policy "Public insert leads" on public.leads
for insert
with check (true);

create policy "Public update leads" on public.leads
for update
using (true)
with check (true);

create policy "Public delete leads" on public.leads
for delete
using (true);
