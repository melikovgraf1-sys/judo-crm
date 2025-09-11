-- Enable RLS and allow public CRUD access on leads table
alter table public.leads enable row level security;

drop policy if exists "Public read leads" on public.leads;
create policy "Public read leads" on public.leads
for select
using (true);

drop policy if exists "Public insert leads" on public.leads;
create policy "Public insert leads" on public.leads
for insert
with check (true);

drop policy if exists "Public update leads" on public.leads;
create policy "Public update leads" on public.leads
for update
using (true)
with check (true);

drop policy if exists "Public delete leads" on public.leads;
create policy "Public delete leads" on public.leads
for delete
using (true);
