-- Migration: backfill teknisi_name in daily_checklist from user.name
-- Run this once (psql or your migration runner) to correct existing rows
BEGIN;

-- Update daily_checklist.teknisi_name using user.name where teknisi_id stores the user's NIPP
UPDATE daily_checklist dc
SET teknisi_name = u.name
FROM "user" u
WHERE dc.teknisi_id IS NOT NULL
  AND u.nipp IS NOT NULL
  -- compare numeric teknisi_id to user.nipp (text)
  AND dc.teknisi_id::text = u.nipp
  -- only update when value differs to reduce WAL
  AND (dc.teknisi_name IS DISTINCT FROM u.name);

COMMIT;

-- Note: If your `teknisi_id` column stores something else (e.g. user.id UUID), adjust the JOIN condition accordingly.
