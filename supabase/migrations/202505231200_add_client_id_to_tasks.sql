-- Add client_id column to tasks table
alter table public.tasks
  add column if not exists client_id uuid references public.clients (id);

-- Refresh the PostgREST schema cache so the new column is recognized
notify pgrst, 'reload schema';
