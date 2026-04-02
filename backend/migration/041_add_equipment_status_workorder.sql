-- 041_add_equipment_status_workorder.sql
BEGIN;

ALTER TABLE equipment_status
  ADD COLUMN IF NOT EXISTS work_order_id uuid NULL,
  ADD COLUMN IF NOT EXISTS workorder_doc_no text NULL;

-- optionally add indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_equipment_status_work_order_id ON equipment_status(work_order_id);

COMMIT;

-- Note: `work_order_id` links to `work_order(id)` if available. `workorder_doc_no` stores external doc_no/string for quick display.
