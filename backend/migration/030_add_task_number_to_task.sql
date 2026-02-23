-- Migration: add task_number column to task and backfill from work_order.raw.activities
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'task' AND column_name = 'task_number'
  ) THEN
    ALTER TABLE public.task ADD COLUMN task_number integer NULL;
    CREATE INDEX IF NOT EXISTS idx_task_task_number ON public.task(task_number);
  END IF;
END$$;

-- Backfill using external_id match (preferred)
UPDATE public.task t
SET task_number = (act->>'task_number')::int
FROM public.work_order wo,
LATERAL jsonb_array_elements(wo.raw->'activities') as act
WHERE wo.id = t.work_order_id
  AND act->>'task_id' IS NOT NULL
  AND act->>'task_id' = t.external_id;

-- Backfill remaining tasks by matching task name if external_id wasn't available
UPDATE public.task t
SET task_number = (act->>'task_number')::int
FROM public.work_order wo,
LATERAL jsonb_array_elements(wo.raw->'activities') as act
WHERE wo.id = t.work_order_id
  AND t.task_number IS NULL
  AND COALESCE(act->>'task_id','') = ''
  AND COALESCE(act->>'task_name', act->>'name') = t.name;

-- Ensure task_number ordering index exists
CREATE INDEX IF NOT EXISTS idx_task_task_number ON public.task(task_number);
