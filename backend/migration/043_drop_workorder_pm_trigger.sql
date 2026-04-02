-- 043_drop_workorder_pm_trigger.sql
-- Drop the automatic PM trigger/function on work_order (undo previous migration behavior)

BEGIN;

-- Remove trigger (if exists) from work_order table
DROP TRIGGER IF EXISTS trg_work_order_pm_complete ON work_order;

-- Remove trigger function
DROP FUNCTION IF EXISTS trg_work_order_pm_complete() CASCADE;

COMMIT;
