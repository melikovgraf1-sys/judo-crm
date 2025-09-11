-- Add payment_id column to tasks table
alter table public.tasks
  add column if not exists payment_id uuid references public.payments (id);

-- Refresh the PostgREST schema cache so the new column is recognized
notify pgrst, 'reload schema';
