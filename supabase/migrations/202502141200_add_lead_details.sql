-- Add birth_date, district, and group_id columns to leads table
alter table public.leads
  add column if not exists birth_date date,
  add column if not exists district text,
  add column if not exists group_id uuid references public.groups (id) on delete set null;

-- Rebuild the PostgREST schema cache so new columns are recognized
notify pgrst, 'reload schema';
