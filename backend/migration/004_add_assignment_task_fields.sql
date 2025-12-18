-- migration: add task fields to assignment
ALTER TABLE public.assignment
  ADD COLUMN IF NOT EXISTS task_id varchar(200),
  ADD COLUMN IF NOT EXISTS task_name varchar(255);

-- down (manual):
-- ALTER TABLE public.assignment DROP COLUMN IF EXISTS task_id; ALTER TABLE public.assignment DROP COLUMN IF EXISTS task_name;
