-- Create attendance table for tracking daily presence per client
create table if not exists public.attendance (
  client_id uuid references public.clients (id) on delete cascade,
  date date not null,
  present boolean not null default false,
  primary key (client_id, date)
);

-- Enable RLS and allow public CRUD operations
alter table public.attendance enable row level security;

create policy "Public read attendance" on public.attendance
for select
using (true);

create policy "Public upsert attendance" on public.attendance
for insert
with check (true);

create policy "Public update attendance" on public.attendance
for update
using (true)
with check (true);

create policy "Public delete attendance" on public.attendance
for delete
using (true);

-- Refresh PostgREST schema cache so new table/columns are recognized
notify pgrst, 'reload schema';
