-- migration: change assignment.task_id from varchar to uuid
-- Safe migration:
-- 1. add a temporary uuid column
-- 2. copy valid UUID values from old varchar column into the temp column
-- 3. drop old column and rename temp column to `task_id`

BEGIN;

ALTER TABLE public.assignment
  ADD COLUMN IF NOT EXISTS task_id_uuid uuid;

-- Copy values that are valid UUID strings (RFC 4122 hyphenated form)
UPDATE public.assignment
SET task_id_uuid = task_id::uuid
WHERE task_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- NOTE: rows with non-UUID task_id will keep NULL in task_id_uuid.
-- If you need to preserve those values, handle mapping/lookup before running this migration.

ALTER TABLE public.assignment
  DROP COLUMN IF EXISTS task_id;

ALTER TABLE public.assignment
  RENAME COLUMN task_id_uuid TO task_id;

COMMIT;

-- down (manual):
-- BEGIN;
-- ALTER TABLE public.assignment ADD COLUMN IF NOT EXISTS task_id varchar(200);
-- UPDATE public.assignment SET task_id = task_id::text WHERE task_id IS NOT NULL;
-- ALTER TABLE public.assignment DROP COLUMN IF EXISTS task_id_uuid; -- if present
-- COMMIT;
