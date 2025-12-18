-- migration: add created_at column to realisasi if missing
ALTER TABLE IF EXISTS realisasi
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- ensure existing rows have a value
UPDATE realisasi SET created_at = now() WHERE created_at IS NULL;
