-- 042_auto_insert_pm_history_on_wo_complete.sql
-- When a PM work_order is marked completed (via UPDATE or INSERT), automatically insert
-- a pm_history row and clear the equipment_status workorder fields for the related alat.

BEGIN;

CREATE OR REPLACE FUNCTION trg_work_order_pm_complete() RETURNS trigger AS $$
DECLARE
  v_alat_id         BIGINT;
  v_pm_rule_id      BIGINT;
  v_engine_hour     BIGINT;
  v_performed_at    TIMESTAMPTZ;
  v_doc_no          TEXT;
  v_raw_json        JSONB;
  v_work_type       TEXT;
  v_type_work       TEXT;
  v_status_new      TEXT;
  v_status_old      TEXT;
  v_asset_id_text   TEXT;
  v_end_date_text   TEXT;
BEGIN
  BEGIN  -- â”€â”€ outer safety wrapper: any error here is caught, never aborts the DML â”€â”€

  v_status_new    := coalesce(row_to_json(NEW)->>'status','');
  v_status_old    := CASE WHEN TG_OP = 'UPDATE' THEN coalesce(row_to_json(OLD)->>'status','') ELSE '' END;
  v_work_type     := coalesce(row_to_json(NEW)->>'work_type','');
  v_type_work     := coalesce(row_to_json(NEW)->>'type_work','');
  v_asset_id_text := coalesce(row_to_json(NEW)->>'asset_id','');
  v_raw_json      := (row_to_json(NEW)->'raw')::jsonb;
  v_end_date_text := coalesce(row_to_json(NEW)->>'end_date','');

  -- Act only when status transitions into a completed state
  IF NOT (upper(v_status_new) IN ('COMPLETED','DONE','CLOSED')) THEN
    RETURN NEW;
  END IF;
  -- On UPDATE: skip if it was already completed (no re-processing)
  IF TG_OP = 'UPDATE' AND upper(v_status_old) IN ('COMPLETED','DONE','CLOSED') THEN
    RETURN NEW;
  END IF;

  -- Only process PM / preventive work orders
  IF NOT (
    v_work_type ILIKE '%PM%' OR v_type_work ILIKE '%PM%' OR
    v_work_type ILIKE '%PREVENT%' OR v_type_work ILIKE '%PREVENT%'
  ) THEN
    RETURN NEW;
  END IF;

  -- â”€â”€ Resolve alat_id â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  -- 1) equipment_status link (most reliable when WO was assigned via PM calendar)
  BEGIN
    SELECT alat_id INTO v_alat_id FROM equipment_status WHERE work_order_id = NEW.id LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    v_alat_id := NULL;
  END;

  -- 2) work_order.asset_id direct
  IF v_alat_id IS NULL AND v_asset_id_text <> '' THEN
    BEGIN
      v_alat_id := v_asset_id_text::BIGINT;
    EXCEPTION WHEN OTHERS THEN
      v_alat_id := NULL;
    END;
  END IF;

  -- 3) resolve from raw->>'asset' matching master_alat.nama or kode
  IF v_alat_id IS NULL AND v_raw_json IS NOT NULL THEN
    BEGIN
      SELECT id INTO v_alat_id FROM master_alat
        WHERE lower(nama) = lower(coalesce(v_raw_json->>'asset','')) LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
      v_alat_id := NULL;
    END;
    IF v_alat_id IS NULL THEN
      BEGIN
        SELECT id INTO v_alat_id FROM master_alat
          WHERE lower(kode) = lower(coalesce(v_raw_json->>'asset','')) LIMIT 1;
      EXCEPTION WHEN OTHERS THEN
        v_alat_id := NULL;
      END;
    END IF;
  END IF;

  -- 4) also try equipment_status.workorder_doc_no match
  IF v_alat_id IS NULL AND coalesce(row_to_json(NEW)->>'doc_no','') <> '' THEN
    BEGIN
      SELECT alat_id INTO v_alat_id FROM equipment_status
        WHERE workorder_doc_no = (row_to_json(NEW)->>'doc_no') LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
      v_alat_id := NULL;
    END;
  END IF;

  IF v_alat_id IS NULL THEN
    RETURN NEW;  -- cannot find related alat, nothing to do
  END IF;

  -- â”€â”€ Resolve engine_hour â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  IF v_raw_json IS NOT NULL AND coalesce(v_raw_json->>'engine_hour','') <> '' THEN
    BEGIN
      v_engine_hour := (v_raw_json->>'engine_hour')::BIGINT;
    EXCEPTION WHEN OTHERS THEN
      v_engine_hour := NULL;
    END;
  END IF;
  IF v_engine_hour IS NULL THEN
    SELECT last_engine_hour INTO v_engine_hour FROM equipment_status WHERE alat_id = v_alat_id LIMIT 1;
  END IF;

  -- â”€â”€ performed_at â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  IF v_end_date_text <> '' THEN
    BEGIN
      v_performed_at := v_end_date_text::timestamptz;
    EXCEPTION WHEN OTHERS THEN
      v_performed_at := now();
    END;
  ELSE
    v_performed_at := now();
  END IF;

  v_doc_no := coalesce(row_to_json(NEW)->>'doc_no', row_to_json(NEW)->>'code', row_to_json(NEW)->>'title');

  -- â”€â”€ Compute next_due_engine_hour and insert pm_history â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  DECLARE
    v_jenis_id        BIGINT;
    v_last_engine     BIGINT;
    v_last_recorded   TIMESTAMPTZ;
    v_next_due_engine BIGINT  := NULL;
    v_chosen_rule_id  BIGINT;
    v_candidate       BIGINT;
    v_rule            RECORD;
    v_last_performed  BIGINT;
    v_current_engine  BIGINT;
    v_effective       INTEGER;
    v_start_engine    BIGINT;
    v_min_interval    INTEGER := NULL;
  BEGIN
    -- resolve jenis_alat_id for this alat
    SELECT jenis_alat_id INTO v_jenis_id FROM master_alat WHERE id = v_alat_id LIMIT 1;

    -- prefer rule pinned in equipment_status
    SELECT chosen_rule_id INTO v_chosen_rule_id FROM equipment_status WHERE alat_id = v_alat_id LIMIT 1;
    IF v_chosen_rule_id IS NULL THEN
      v_chosen_rule_id := v_pm_rule_id;  -- may still be NULL
    END IF;

    SELECT last_engine_hour, last_recorded_at
      INTO v_last_engine, v_last_recorded
      FROM equipment_status WHERE alat_id = v_alat_id LIMIT 1;

    -- find minimal interval for fallback
    -- priority: rules specific to this alat first; fall back to jenis_alat rules if none exist
    FOR v_rule IN
      SELECT id, interval_hours, multiplier, start_engine_hour
        FROM pm_rules
       WHERE active = true AND alat_id = v_alat_id
    LOOP
      IF v_rule.interval_hours IS NOT NULL THEN
        IF v_min_interval IS NULL OR v_rule.interval_hours < v_min_interval THEN
          v_min_interval := v_rule.interval_hours;
        END IF;
      END IF;
    END LOOP;

    IF v_min_interval IS NULL THEN
      FOR v_rule IN
        SELECT id, interval_hours, multiplier, start_engine_hour
          FROM pm_rules
         WHERE active = true AND jenis_alat_id = v_jenis_id
      LOOP
        IF v_rule.interval_hours IS NOT NULL THEN
          IF v_min_interval IS NULL OR v_rule.interval_hours < v_min_interval THEN
            v_min_interval := v_rule.interval_hours;
          END IF;
        END IF;
      END LOOP;
    END IF;

    -- per-rule next due engine, pick smallest
    -- same priority: alat-specific rules first, then jenis rules if no alat rules found
    FOR v_rule IN
      SELECT id, interval_hours, multiplier, start_engine_hour
        FROM pm_rules
       WHERE active = true AND (
         alat_id = v_alat_id OR
         (alat_id IS NULL AND jenis_alat_id = v_jenis_id AND NOT EXISTS (
           SELECT 1 FROM pm_rules WHERE active = true AND alat_id = v_alat_id
         ))
       )
    LOOP
      v_start_engine := COALESCE(v_rule.start_engine_hour, 0)::BIGINT;
      v_effective    := GREATEST(1, COALESCE(v_rule.interval_hours,0) * GREATEST(1, COALESCE(v_rule.multiplier,1)));

      SELECT engine_hour INTO v_last_performed
        FROM pm_history WHERE alat_id = v_alat_id AND pm_rule_id = v_rule.id
       ORDER BY performed_at DESC LIMIT 1;

      v_current_engine := GREATEST(COALESCE(v_last_engine,0), COALESCE(v_last_performed,0), v_start_engine);

      IF v_effective > 0 THEN
        IF v_start_engine <= v_current_engine THEN
          v_candidate := v_start_engine + (( (v_current_engine - v_start_engine) / v_effective ) + 1) * v_effective;
        ELSE
          v_candidate := v_start_engine;
        END IF;
      ELSE
        v_candidate := v_current_engine;
      END IF;

      IF v_last_engine IS NOT NULL AND v_candidate <= v_last_engine THEN
        v_candidate := v_last_engine + 1;
      END IF;

      IF v_next_due_engine IS NULL OR v_candidate < v_next_due_engine THEN
        v_next_due_engine := v_candidate;
        v_chosen_rule_id  := v_rule.id;
      END IF;
    END LOOP;

    -- fallback if no rules found
    IF v_next_due_engine IS NULL THEN
      v_next_due_engine := COALESCE(v_last_engine, 0) + COALESCE(v_min_interval, 250);
    END IF;

    -- fallback rule selection
    IF v_chosen_rule_id IS NULL THEN
      SELECT id INTO v_chosen_rule_id FROM pm_rules
        WHERE active = true AND alat_id = v_alat_id ORDER BY COALESCE(multiplier,1) ASC LIMIT 1;
    END IF;
    IF v_chosen_rule_id IS NULL THEN
      SELECT id INTO v_chosen_rule_id FROM pm_rules
        WHERE active = true AND jenis_alat_id = v_jenis_id ORDER BY COALESCE(multiplier,1) ASC LIMIT 1;
    END IF;
    IF v_chosen_rule_id IS NULL THEN
      SELECT id INTO v_chosen_rule_id FROM pm_rules
        WHERE active = true ORDER BY COALESCE(interval_hours,1000000) ASC LIMIT 1;
    END IF;

    -- Insert pm_history (skip if pm_rule_id unavailable or duplicate doc_no)
    IF v_chosen_rule_id IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM pm_history
         WHERE alat_id = v_alat_id
           AND workorder_no IS NOT NULL AND workorder_no = v_doc_no
         LIMIT 1
      ) THEN
        INSERT INTO pm_history(
          alat_id, pm_rule_id, performed_by, performed_at,
          engine_hour, next_due_engine_hour, notes, workorder_no,
          created_at, updated_at
        ) VALUES (
          v_alat_id, v_chosen_rule_id, NULL, v_performed_at,
          COALESCE(v_engine_hour, 0), v_next_due_engine,
          'Auto-inserted on WO completion (doc_no=' || COALESCE(v_doc_no,'') || ')',
          v_doc_no, now(), now()
        );
      END IF;
    END IF;

    -- Update equipment_status: clear WO link, set next PM milestone
    UPDATE equipment_status
       SET work_order_id     = NULL,
           workorder_doc_no  = NULL,
           next_pm_engine_hour = v_next_due_engine,
           chosen_rule_id    = v_chosen_rule_id,
           chosen_kode_rule  = (SELECT kode_rule FROM pm_rules WHERE id = v_chosen_rule_id LIMIT 1),
           updated_at        = now()
     WHERE alat_id = v_alat_id;

  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING '[trg_work_order_pm_complete] pm_history/equipment_status update failed (suppressed): %', SQLERRM;
  END;  -- end inner declare block

  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING '[trg_work_order_pm_complete] outer error (suppressed): %', SQLERRM;
  END;  -- end outer safety wrapper

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_work_order_pm_complete ON work_order;
-- Fire on both INSERT (WO imported already COMPLETED) and UPDATE (status changed to COMPLETED)
CREATE TRIGGER trg_work_order_pm_complete
AFTER INSERT OR UPDATE ON work_order
FOR EACH ROW
EXECUTE FUNCTION trg_work_order_pm_complete();

COMMIT;
