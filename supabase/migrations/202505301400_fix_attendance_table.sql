-- Ensure attendance table schema has required columns and primary key
alter table public.attendance
  add column if not exists date date,
  add column if not exists present boolean not null default false;

-- Drop legacy id column if present
alter table public.attendance drop column if exists id;

-- Reset primary key to client_id + date
alter table public.attendance drop constraint if exists attendance_pkey;
alter table public.attendance add primary key (client_id, date);

-- Make date mandatory
alter table public.attendance alter column date set not null;

-- Recreate policies defensively
alter table public.attendance enable row level security;

do $$
begin
  create policy "Public read attendance" on public.attendance
    for select using (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Public upsert attendance" on public.attendance
    for insert with check (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Public update attendance" on public.attendance
    for update using (true) with check (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Public delete attendance" on public.attendance
    for delete using (true);
exception
  when duplicate_object then null;
end $$;

-- Refresh PostgREST schema cache
notify pgrst, 'reload schema';
