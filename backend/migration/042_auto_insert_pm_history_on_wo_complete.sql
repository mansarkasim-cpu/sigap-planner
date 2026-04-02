-- 042_auto_insert_pm_history_on_wo_complete.sql
-- When a PM work_order is marked completed, automatically insert a pm_history row
-- and clear the equipment_status workorder fields for the related alat.

BEGIN;

CREATE OR REPLACE FUNCTION trg_work_order_pm_complete() RETURNS trigger AS $$
DECLARE
  v_alat_id BIGINT;
  v_pm_rule_id BIGINT;
  v_engine_hour BIGINT;
  v_performed_at TIMESTAMPTZ;
  v_doc_no TEXT;
  -- defensive vars (read from row_to_json to avoid missing-field errors)
  v_raw_json JSONB;
  v_doc_text TEXT;
  v_work_type TEXT;
  v_type_work TEXT;
  v_status_new TEXT;
  v_status_old TEXT;
  v_asset_id_text TEXT;
  v_end_date_text TEXT;
BEGIN
  -- Read fields defensively from NEW/OLD JSON representation
  v_status_new := coalesce(row_to_json(NEW)->>'status','');
  v_status_old := coalesce(row_to_json(OLD)->>'status','');
  v_work_type := coalesce(row_to_json(NEW)->>'work_type','');
  v_type_work := coalesce(row_to_json(NEW)->>'type_work','');
  v_asset_id_text := coalesce(row_to_json(NEW)->>'asset_id', row_to_json(NEW)->>'asset');
  v_raw_json := (row_to_json(NEW)->'raw')::jsonb;
  v_end_date_text := row_to_json(NEW)->>'end_date';

  -- Only act on UPDATE where status transitions into a completed state
  IF TG_OP = 'UPDATE' THEN
    IF (v_status_new <> '' AND (upper(v_status_new) = 'COMPLETED' OR upper(v_status_new) = 'DONE' OR upper(v_status_new) = 'CLOSED'))
       AND (v_status_old = '' OR upper(v_status_old) NOT IN ('COMPLETED','DONE','CLOSED')) THEN

      -- Only consider workorders that look like PM/preventive work
      IF (coalesce(v_work_type,'') ILIKE '%PM%' OR coalesce(v_type_work,'') ILIKE '%PM%' OR coalesce(v_work_type,'') ILIKE '%PREVENT%' OR coalesce(v_type_work,'') ILIKE '%PREVENT%') THEN

        -- Prefer explicit asset_id on work_order (from NEW JSON)
        IF v_asset_id_text IS NOT NULL AND v_asset_id_text <> '' THEN
          BEGIN
            v_alat_id := v_asset_id_text::BIGINT;
          EXCEPTION WHEN OTHERS THEN
            v_alat_id := NULL;
          END;
        ELSE
          v_alat_id := NULL;
        END IF;

        -- If asset_id not present, try to resolve from raw->>'asset' matching master_alat.nama or kode
        IF v_alat_id IS NULL AND v_raw_json IS NOT NULL THEN
          BEGIN
            SELECT id INTO v_alat_id FROM master_alat WHERE lower(nama) = lower(coalesce(v_raw_json->>'asset','')) LIMIT 1;
          EXCEPTION WHEN OTHERS THEN
            v_alat_id := NULL;
          END;
          IF v_alat_id IS NULL THEN
            SELECT id INTO v_alat_id FROM master_alat WHERE lower(kode) = lower(coalesce(v_raw_json->>'asset','')) LIMIT 1;
          END IF;
        END IF;

        IF v_alat_id IS NOT NULL THEN
          -- Get pm_rule_id chosen in equipment_status if available
          SELECT chosen_rule_id INTO v_pm_rule_id FROM equipment_status WHERE alat_id = v_alat_id LIMIT 1;

          -- Determine engine hour: prefer value present in work_order.raw->>'engine_hour', else equipment_status.last_engine_hour
          IF v_raw_json IS NOT NULL AND (v_raw_json->>'engine_hour') IS NOT NULL AND (v_raw_json->>'engine_hour') <> '' THEN
            BEGIN
              v_engine_hour := (v_raw_json->>'engine_hour')::BIGINT;
            EXCEPTION WHEN OTHERS THEN
              v_engine_hour := NULL;
            END;
          ELSE
            SELECT last_engine_hour INTO v_engine_hour FROM equipment_status WHERE alat_id = v_alat_id LIMIT 1;
          END IF;

          -- performed_at: prefer end_date if present in NEW JSON, else now()
          IF v_end_date_text IS NOT NULL AND v_end_date_text <> '' THEN
            BEGIN
              v_performed_at := v_end_date_text::timestamptz;
            EXCEPTION WHEN OTHERS THEN
              v_performed_at := now();
            END;
          ELSE
            v_performed_at := now();
          END IF;

          -- pick a doc identifier defensively
          v_doc_no := coalesce(row_to_json(NEW)->>'doc_no', row_to_json(NEW)->>'code', row_to_json(NEW)->>'title');

          -- Compute next_due_engine_hour using pm_rules logic (similar to pmService)
          DECLARE
            v_jenis_id BIGINT;
            v_last_engine BIGINT;
            v_next_due_engine BIGINT := NULL;
            v_candidate BIGINT;
            v_rule RECORD;
            v_last_performed BIGINT;
            v_current_engine BIGINT;
            v_effective INTEGER;
            v_start_engine BIGINT;
            v_min_interval INTEGER := NULL;
            v_avg_hours_per_day INTEGER := NULL;
            v_last_recorded_at TIMESTAMPTZ := NULL;
            v_chosen_rule_id BIGINT := v_pm_rule_id;
          BEGIN
            SELECT jenis_alat_id INTO v_jenis_id FROM master_alat WHERE id = v_alat_id LIMIT 1;
            SELECT last_engine_hour, last_recorded_at INTO v_last_engine, v_last_recorded_at FROM equipment_status WHERE alat_id = v_alat_id LIMIT 1;

            -- find minimal interval among applicable rules to estimate 'step' when needed
            FOR v_rule IN SELECT id, interval_hours, multiplier, start_engine_hour FROM pm_rules WHERE active = true AND (alat_id = v_alat_id OR jenis_alat_id = v_jenis_id) LOOP
              IF v_rule.interval_hours IS NOT NULL THEN
                IF v_min_interval IS NULL OR v_rule.interval_hours < v_min_interval THEN
                  v_min_interval := v_rule.interval_hours;
                END IF;
              END IF;
            END LOOP;

            -- iterate rules to compute per-rule next due engine, pick minimal next due engine
            FOR v_rule IN SELECT id, interval_hours, multiplier, start_engine_hour FROM pm_rules WHERE active = true AND (alat_id = v_alat_id OR jenis_alat_id = v_jenis_id) LOOP
              v_start_engine := COALESCE(v_rule.start_engine_hour, 0)::BIGINT;
              v_effective := GREATEST(1, COALESCE(v_rule.interval_hours,0) * GREATEST(1, COALESCE(v_rule.multiplier,1)));

              SELECT engine_hour INTO v_last_performed FROM pm_history WHERE alat_id = v_alat_id AND pm_rule_id = v_rule.id ORDER BY performed_at DESC LIMIT 1;

              v_current_engine := GREATEST(COALESCE(v_last_engine,0), COALESCE(v_last_performed,0), v_start_engine);

              -- compute next due engine as smallest multiple of effective after start_engine
              IF v_effective > 0 THEN
                IF v_start_engine <= v_current_engine THEN
                  v_candidate := v_start_engine + (( (v_current_engine - v_start_engine) / v_effective ) + 1) * v_effective;
                ELSE
                  v_candidate := v_start_engine;
                END IF;
              ELSE
                v_candidate := v_current_engine;
              END IF;

              -- ensure candidate is greater than last known engine
              IF v_last_engine IS NOT NULL AND v_candidate <= v_last_engine THEN
                v_candidate := v_last_engine + 1;
              END IF;

              IF v_next_due_engine IS NULL OR v_candidate < v_next_due_engine THEN
                v_next_due_engine := v_candidate;
                v_chosen_rule_id := v_rule.id;
              END IF;
            END LOOP;

            -- fallback: if no rules found, use minimal step (min interval) from rulesByJenis or default 250
            IF v_next_due_engine IS NULL THEN
              IF v_min_interval IS NOT NULL THEN
                v_next_due_engine := COALESCE(v_last_engine,0) + v_min_interval;
              ELSE
                v_next_due_engine := COALESCE(v_last_engine,0) + 250;
              END IF;
            END IF;

            -- If we don't yet have a chosen rule, attempt to pick a fallback active rule
            IF v_chosen_rule_id IS NULL THEN
              -- prefer rule explicitly for this alat
              SELECT id INTO v_chosen_rule_id FROM pm_rules WHERE active = true AND alat_id = v_alat_id ORDER BY COALESCE(multiplier,1) ASC LIMIT 1;
            END IF;
            IF v_chosen_rule_id IS NULL THEN
              -- prefer rule for the jenis_alat
              SELECT id INTO v_chosen_rule_id FROM pm_rules WHERE active = true AND jenis_alat_id = v_jenis_id ORDER BY COALESCE(multiplier,1) ASC LIMIT 1;
            END IF;
            IF v_chosen_rule_id IS NULL THEN
              -- fallback: any active rule
              SELECT id INTO v_chosen_rule_id FROM pm_rules WHERE active = true ORDER BY COALESCE(interval_hours,1000000) ASC LIMIT 1;
            END IF;

            -- Only insert if we have a chosen pm_rule_id (pm_history.pm_rule_id is NOT NULL)
            IF v_chosen_rule_id IS NOT NULL THEN
              -- Avoid duplicate insertion for same workorder/doc_no
              IF NOT EXISTS (SELECT 1 FROM pm_history ph WHERE ph.alat_id = v_alat_id AND ph.workorder_no IS NOT NULL AND ph.workorder_no = v_doc_no LIMIT 1) THEN
                INSERT INTO pm_history(alat_id, pm_rule_id, performed_by, performed_at, engine_hour, next_due_engine_hour, notes, workorder_no, created_at, updated_at)
                VALUES (v_alat_id, v_chosen_rule_id, NULL, v_performed_at, COALESCE(v_engine_hour,0), v_next_due_engine, 'Auto-inserted from work_order trigger (doc_no=' || COALESCE(v_doc_no,'') || ')', v_doc_no, now(), now());
              END IF;
            END IF;
          END;

          -- Clear assigned workorder fields and update next PM cache on equipment_status
          UPDATE equipment_status
          SET work_order_id = NULL,
              workorder_doc_no = NULL,
              next_pm_engine_hour = v_next_due_engine,
              chosen_rule_id = v_chosen_rule_id,
              chosen_kode_rule = (SELECT kode_rule FROM pm_rules WHERE id = v_chosen_rule_id LIMIT 1),
              updated_at = now()
          WHERE alat_id = v_alat_id;
        END IF;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_work_order_pm_complete ON work_order;
CREATE TRIGGER trg_work_order_pm_complete
AFTER UPDATE ON work_order
FOR EACH ROW
EXECUTE FUNCTION trg_work_order_pm_complete();

COMMIT;
