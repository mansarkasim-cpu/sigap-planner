-- migration: add start_time and end_time to pending_realisasi
ALTER TABLE IF EXISTS pending_realisasi
  ADD COLUMN IF NOT EXISTS start_time timestamptz;

ALTER TABLE IF EXISTS pending_realisasi
  ADD COLUMN IF NOT EXISTS end_time timestamptz;
