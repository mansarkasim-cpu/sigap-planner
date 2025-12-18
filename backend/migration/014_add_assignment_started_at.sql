-- migration: add started_at to assignment
ALTER TABLE IF EXISTS assignment
  ADD COLUMN IF NOT EXISTS started_at timestamptz;
