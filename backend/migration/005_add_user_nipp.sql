BEGIN;

-- Add nullable nipp column to user
ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS nipp VARCHAR(50);

-- Add unique index only for non-null values to avoid conflicts with existing rows
CREATE UNIQUE INDEX IF NOT EXISTS user_nipp_unique_idx ON "user" (nipp) WHERE nipp IS NOT NULL;

COMMIT;
