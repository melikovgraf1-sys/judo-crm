-- Add is_recurring and recurring_interval columns to tasks table
alter table public.tasks
  add column if not exists is_recurring boolean not null default false,
  add column if not exists recurring_interval text;

-- Refresh the PostgREST schema cache so the new columns are recognized
notify pgrst, 'reload schema';
