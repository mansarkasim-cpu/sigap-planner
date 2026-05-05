-- Migration: Fix equipment hour meter recorded_date to use the site's local timezone
-- instead of UTC. This ensures the uniqueness constraint (one entry per alat per day)
-- is evaluated in the user's local calendar date, not UTC.
BEGIN;

-- Step 1: Update trigger function to look up the site's timezone
CREATE OR REPLACE FUNCTION set_recorded_date_eqhm() RETURNS trigger AS $$
DECLARE
    site_tz text := 'Asia/Jakarta';
BEGIN
    IF NEW.site_id IS NOT NULL THEN
        SELECT COALESCE(timezone, 'Asia/Jakarta') INTO site_tz
        FROM master_site WHERE id = NEW.site_id;
    END IF;
    IF NEW.recorded_at IS NOT NULL THEN
        NEW.recorded_date = (NEW.recorded_at AT TIME ZONE site_tz)::date;
    ELSE
        NEW.recorded_date = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Drop the unique index before backfill so we can deduplicate first
DROP INDEX IF EXISTS uq_eqhm_alat_recorded_date;

-- Step 3: Backfill recorded_date using each row's site timezone
UPDATE daily_equipment_hour_meter e
SET recorded_date = (
    e.recorded_at AT TIME ZONE COALESCE(
        (SELECT s.timezone FROM master_site s WHERE s.id = e.site_id),
        'Asia/Jakarta'
    )
)::date
WHERE e.recorded_at IS NOT NULL;

-- Step 4: Remove duplicate rows that now share the same (alat_id, recorded_date).
-- Keep the row with the highest engine_hour value; on tie, keep the most recently created one.
DELETE FROM daily_equipment_hour_meter
WHERE id IN (
    SELECT id FROM (
        SELECT
            id,
            ROW_NUMBER() OVER (
                PARTITION BY alat_id, recorded_date
                ORDER BY engine_hour DESC NULLS LAST, created_at DESC, id DESC
            ) AS rn
        FROM daily_equipment_hour_meter
        WHERE recorded_date IS NOT NULL
    ) ranked
    WHERE rn > 1
);

-- Step 5: Recreate the unique index now that duplicates are resolved
CREATE UNIQUE INDEX uq_eqhm_alat_recorded_date ON daily_equipment_hour_meter (alat_id, recorded_date);

COMMIT;
