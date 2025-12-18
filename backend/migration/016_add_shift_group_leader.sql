-- Migration: add leader column to shift_group
-- Adds optional leader (user id) to shift_group
BEGIN;

ALTER TABLE shift_group
  ADD COLUMN IF NOT EXISTS leader varchar(200);

COMMIT;
