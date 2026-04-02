-- 040_add_avg_hours_to_master_jenis_alat.sql
BEGIN;

ALTER TABLE master_jenis_alat
  ADD COLUMN IF NOT EXISTS avg_hours_per_day numeric DEFAULT 24;

COMMIT;

-- Note: stores average available hours per day for each jenis_alat. Defaults to 24.