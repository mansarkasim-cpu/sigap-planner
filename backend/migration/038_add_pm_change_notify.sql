-- 038_add_pm_change_notify.sql
BEGIN;

-- Create notify function
CREATE OR REPLACE FUNCTION notify_pm_change() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('pm_changes', TG_TABLE_NAME || ':' || COALESCE(NEW.alat_id::text, OLD.alat_id::text));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers on pm_history and daily_equipment_hour_meter
DROP TRIGGER IF EXISTS trg_pm_history_notify ON pm_history;
CREATE TRIGGER trg_pm_history_notify
AFTER INSERT OR UPDATE OR DELETE ON pm_history
FOR EACH ROW EXECUTE FUNCTION notify_pm_change();

DROP TRIGGER IF EXISTS trg_hour_meter_notify ON daily_equipment_hour_meter;
CREATE TRIGGER trg_hour_meter_notify
AFTER INSERT OR UPDATE OR DELETE ON daily_equipment_hour_meter
FOR EACH ROW EXECUTE FUNCTION notify_pm_change();

COMMIT;

-- Note: This migration notifies the 'pm_changes' channel on relevant table changes.