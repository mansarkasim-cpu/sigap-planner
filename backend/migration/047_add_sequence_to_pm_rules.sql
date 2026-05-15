-- 047_add_sequence_to_pm_rules.sql
-- Add sequence field to pm_rules for ordering rules within a group
BEGIN;

ALTER TABLE pm_rules ADD COLUMN IF NOT EXISTS sequence integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_pm_rules_sequence ON pm_rules(sequence);

COMMIT;
