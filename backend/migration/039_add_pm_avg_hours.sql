-- 039_add_pm_avg_hours.sql
BEGIN;

CREATE TABLE IF NOT EXISTS pm_type_settings (
  jenis_alat_id bigint PRIMARY KEY,
  avg_hours_per_day numeric DEFAULT 24
);

COMMIT;

-- Note: Use this table to configure average available hours per day per jenis_alat.