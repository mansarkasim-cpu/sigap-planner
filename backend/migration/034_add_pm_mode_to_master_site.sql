-- Migration: 034_add_pm_mode_to_master_site.sql
-- Add pm_mode and pm_base_interval columns to master_site
BEGIN;

ALTER TABLE master_site
  ADD COLUMN pm_mode VARCHAR(20) NOT NULL DEFAULT 'absolute',
  ADD COLUMN pm_base_interval INTEGER NOT NULL DEFAULT 250;

COMMENT ON COLUMN master_site.pm_mode IS 'PM calculation mode per site: "absolute" (align to grid) or "relative" (based on last PM)';
COMMENT ON COLUMN master_site.pm_base_interval IS 'Base interval in hours used for PM sequence (default 250)';

COMMIT;
