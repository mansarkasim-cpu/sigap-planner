-- 036_add_pm_history_workorder_no.sql
BEGIN;

ALTER TABLE pm_history
  ADD COLUMN workorder_no text;

CREATE INDEX IF NOT EXISTS idx_pm_history_workorder_no ON pm_history(workorder_no);

COMMIT;
