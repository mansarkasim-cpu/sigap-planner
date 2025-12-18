-- migration: add start_time and end_time to realisasi
ALTER TABLE IF EXISTS realisasi
  ADD COLUMN IF NOT EXISTS start_time timestamptz;

ALTER TABLE IF EXISTS realisasi
  ADD COLUMN IF NOT EXISTS end_time timestamptz;

-- backfill end_time with created_at where missing
UPDATE realisasi SET end_time = created_at WHERE end_time IS NULL;
