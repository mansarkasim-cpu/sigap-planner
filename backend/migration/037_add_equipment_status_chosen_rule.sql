-- 037_add_equipment_status_chosen_rule.sql
BEGIN;

ALTER TABLE equipment_status
  ADD COLUMN IF NOT EXISTS chosen_rule_id bigint,
  ADD COLUMN IF NOT EXISTS chosen_kode_rule text;

CREATE INDEX IF NOT EXISTS idx_equipment_status_chosen_rule_id ON equipment_status(chosen_rule_id);

COMMIT;

-- Note: This migration adds fields to cache which PM rule was chosen
-- by the PM worker for the next scheduled maintenance. This makes
-- it easier for the frontend to display the exact rule code.
