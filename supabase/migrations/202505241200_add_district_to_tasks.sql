-- Add district column to tasks table
alter table public.tasks
  add column if not exists district text;

-- Refresh the PostgREST schema cache so the new column is recognized
notify pgrst, 'reload schema';
