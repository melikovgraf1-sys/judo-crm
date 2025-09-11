-- Add completed column to tasks table
alter table public.tasks
  add column if not exists completed boolean not null default false;

-- Rebuild the PostgREST schema cache so new column is recognized
notify pgrst, 'reload schema';
