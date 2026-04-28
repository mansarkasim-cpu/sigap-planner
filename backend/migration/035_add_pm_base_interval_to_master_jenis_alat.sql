-- Migration: 035_add_pm_base_interval_to_master_jenis_alat.sql
-- Add pm_base_interval column to master_jenis_alat
BEGIN;

ALTER TABLE master_jenis_alat
  ADD COLUMN pm_base_interval INTEGER NOT NULL DEFAULT 250;

COMMENT ON COLUMN master_jenis_alat.pm_base_interval IS 'Base interval in hours used for PM sequence per jenis_alat (default 250)';

COMMIT;
