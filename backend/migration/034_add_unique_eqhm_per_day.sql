-- Migration: Ensure one equipment hour meter entry per alat per day
BEGIN;

-- Add stored generated date column and unique index on (alat_id, recorded_date)
-- Add plain date column to store the date portion (computed in UTC by trigger)
ALTER TABLE daily_equipment_hour_meter
	ADD COLUMN IF NOT EXISTS recorded_date date;

-- Trigger function to set recorded_date from recorded_at in UTC
CREATE OR REPLACE FUNCTION set_recorded_date_eqhm() RETURNS trigger AS $$
BEGIN
	IF NEW.recorded_at IS NOT NULL THEN
		NEW.recorded_date = (NEW.recorded_at AT TIME ZONE 'UTC')::date;
	ELSE
		NEW.recorded_date = NULL;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to populate recorded_date on insert/update
DROP TRIGGER IF EXISTS trg_set_recorded_date_eqhm ON daily_equipment_hour_meter;
CREATE TRIGGER trg_set_recorded_date_eqhm
	BEFORE INSERT OR UPDATE ON daily_equipment_hour_meter
	FOR EACH ROW
	EXECUTE FUNCTION set_recorded_date_eqhm();

-- Unique index on (alat_id, recorded_date) to prevent multiple entries per day per equipment
CREATE UNIQUE INDEX IF NOT EXISTS uq_eqhm_alat_recorded_date ON daily_equipment_hour_meter (alat_id, recorded_date);

COMMIT;
