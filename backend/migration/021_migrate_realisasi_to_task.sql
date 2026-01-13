-- Migration 021: Change realisasi and pending_realisasi to reference task_id instead of assignment_id
-- This migration attempts to preserve existing data by mapping assignment.task_id to the new task_id FK

BEGIN;

-- Step 1: Add new task_id column to realisasi table (idempotent)
ALTER TABLE realisasi ADD COLUMN IF NOT EXISTS task_id uuid;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='realisasi' AND column_name='assignment_id') THEN
    UPDATE realisasi r
    SET task_id = a.task_id::uuid
    FROM assignment a
    WHERE r.assignment_id = a.id
      AND a.task_id IS NOT NULL
      AND a.task_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      AND EXISTS (SELECT 1 FROM task t WHERE t.id = a.task_id::uuid);
  END IF;
END
$$;

-- Step 3: For any realisasi rows still without task_id, attempt to match by assignment.task_name -> task.name
-- (best effort fallback for legacy data)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='realisasi' AND column_name='assignment_id') THEN
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
  END IF;
END
$$;

-- Step 4: Drop old assignment_id FK constraint and column
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='realisasi' AND column_name='assignment_id') THEN
    ALTER TABLE realisasi DROP CONSTRAINT IF EXISTS realisasi_assignment_id_fkey;
    ALTER TABLE realisasi DROP COLUMN assignment_id;
  END IF;
END
$$;

-- Step 5: Add NOT NULL constraint and FK for task_id
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='realisasi' AND column_name='task_id') THEN
    IF NOT EXISTS (SELECT 1 FROM realisasi WHERE task_id IS NULL) THEN
      BEGIN
        ALTER TABLE realisasi ALTER COLUMN task_id SET NOT NULL;
      EXCEPTION WHEN others THEN
        -- ignore if cannot set NOT NULL for any reason
        RAISE NOTICE 'Could not set realisasi.task_id NOT NULL, skipping';
      END;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'realisasi_task_id_fkey') THEN
      ALTER TABLE realisasi ADD CONSTRAINT realisasi_task_id_fkey FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE;
    END IF;
  END IF;
END
$$;

-- Step 6: Same steps for pending_realisasi table
ALTER TABLE pending_realisasi ADD COLUMN IF NOT EXISTS task_id uuid;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pending_realisasi' AND column_name='assignment_id') THEN
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
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pending_realisasi' AND column_name='task_id') THEN
    IF NOT EXISTS (SELECT 1 FROM pending_realisasi WHERE task_id IS NULL) THEN
      BEGIN
        ALTER TABLE pending_realisasi ALTER COLUMN task_id SET NOT NULL;
      EXCEPTION WHEN others THEN
        RAISE NOTICE 'Could not set pending_realisasi.task_id NOT NULL, skipping';
      END;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pending_realisasi_task_id_fkey') THEN
      ALTER TABLE pending_realisasi ADD CONSTRAINT pending_realisasi_task_id_fkey FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE;
    END IF;
  END IF;
END
$$;

COMMIT;
