-- 048_add_is_missed_to_pm_history.sql
-- Add is_missed column to pm_history to mark automatically detected PM gaps
-- (PM was due but never performed within one full cycle)

BEGIN;

ALTER TABLE pm_history ADD COLUMN IF NOT EXISTS is_missed BOOLEAN NOT NULL DEFAULT false;

COMMIT;
