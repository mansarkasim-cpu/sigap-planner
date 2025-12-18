-- Import tasks from existing work_order.raw->'activities' into normalized task table
-- Make sure you have applied the `00X_add_tasks_tables.sql` migration first.

INSERT INTO task (work_order_id, external_id, name, duration_min, description, status, created_at, updated_at)
SELECT
  wo.id as work_order_id,
  (act->>'task_id')::text as external_id,
  COALESCE(act->>'task_name', act->>'name', 'Unnamed Task') as name,
  NULLIF((act->>'task_duration')::int, 0) as duration_min,
  COALESCE(act->>'description', NULL) as description,
  'NEW' as status,
  now() as created_at,
  now() as updated_at
FROM work_order wo,
LATERAL jsonb_array_elements(wo.raw->'activities') as act
WHERE wo.raw ? 'activities';

-- Note: This script assumes `raw.activities` is an array of objects where fields like
-- `task_id`, `task_name`, `task_duration`, and `description` may exist. Review and
-- adjust mappings if your SIGAP payload uses different field names.

-- Optionally, you can add logic to avoid duplicates (e.g., only insert when not exists):
-- INSERT INTO task (...)
-- SELECT ...
-- WHERE NOT EXISTS (
--   SELECT 1 FROM task t WHERE t.work_order_id = wo.id AND t.external_id = (act->>'task_id')
-- );
