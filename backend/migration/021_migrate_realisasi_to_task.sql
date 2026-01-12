-- Migration 021: Change realisasi and pending_realisasi to reference task_id instead of assignment_id
-- This migration attempts to preserve existing data by mapping assignment.task_id to the new task_id FK

BEGIN;

-- Step 1: Add new task_id column to realisasi table
ALTER TABLE realisasi ADD COLUMN task_id uuid;

-- Step 2: Populate task_id from assignment.task_id for existing realisasi rows
-- For rows where assignment.task_id is a valid UUID in the task table, copy it
UPDATE realisasi r
SET task_id = a.task_id::uuid
FROM assignment a
WHERE r.assignment_id = a.id
  AND a.task_id IS NOT NULL
  AND a.task_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND EXISTS (SELECT 1 FROM task t WHERE t.id = a.task_id::uuid);

-- Step 3: For any realisasi rows still without task_id, attempt to match by assignment.task_name -> task.name
-- (best effort fallback for legacy data)
UPDATE realisasi r
SET task_id = (
  SELECT t.id
  FROM task t
  JOIN assignment a ON (a.id = r.assignment_id)
  WHERE t.work_order_id = a.wo_id
    AND LOWER(t.name) = LOWER(a.task_name)
  LIMIT 1
)
WHERE r.task_id IS NULL
  AND EXISTS (
    SELECT 1 FROM assignment a WHERE a.id = r.assignment_id AND a.task_name IS NOT NULL
  );

-- Step 4: Drop old assignment_id FK constraint and column
ALTER TABLE realisasi DROP CONSTRAINT IF EXISTS realisasi_assignment_id_fkey;
ALTER TABLE realisasi DROP COLUMN assignment_id;

-- Step 5: Add NOT NULL constraint and FK for task_id
ALTER TABLE realisasi ALTER COLUMN task_id SET NOT NULL;
ALTER TABLE realisasi ADD CONSTRAINT realisasi_task_id_fkey FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE;

-- Step 6: Same steps for pending_realisasi table
ALTER TABLE pending_realisasi ADD COLUMN task_id uuid;

UPDATE pending_realisasi p
SET task_id = a.task_id::uuid
FROM assignment a
WHERE p.assignment_id = a.id
  AND a.task_id IS NOT NULL
  AND a.task_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  AND EXISTS (SELECT 1 FROM task t WHERE t.id = a.task_id::uuid);

UPDATE pending_realisasi p
SET task_id = (
  SELECT t.id
  FROM task t
  JOIN assignment a ON (a.id = p.assignment_id)
  WHERE t.work_order_id = a.wo_id
    AND LOWER(t.name) = LOWER(a.task_name)
  LIMIT 1
)
WHERE p.task_id IS NULL
  AND EXISTS (
    SELECT 1 FROM assignment a WHERE a.id = p.assignment_id AND a.task_name IS NOT NULL
  );

ALTER TABLE pending_realisasi DROP CONSTRAINT IF EXISTS pending_realisasi_assignment_id_fkey;
ALTER TABLE pending_realisasi DROP COLUMN assignment_id;
ALTER TABLE pending_realisasi ALTER COLUMN task_id SET NOT NULL;
ALTER TABLE pending_realisasi ADD CONSTRAINT pending_realisasi_task_id_fkey FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE;

COMMIT;
