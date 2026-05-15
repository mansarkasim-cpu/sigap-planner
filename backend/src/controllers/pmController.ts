import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import pmService from '../services/pmService';

export async function getPMCalendar(req: Request, res: Response) {
  try {
    const limit = Math.max(1, Number(req.query.limit || 200));
    const rows = await AppDataSource.manager.query(
      `SELECT es.*, m.kode AS kode_alat, m.nama AS nama_alat, m.kode_alias AS kode_alias, m.jenis_alat_id, m.site_id AS site_id,
         COALESCE(es.chosen_kode_rule,
           (SELECT pr.kode_rule FROM pm_history ph JOIN pm_rules pr ON pr.id = ph.pm_rule_id WHERE ph.alat_id = es.alat_id ORDER BY ph.performed_at DESC LIMIT 1)
         ) AS last_kode_rule,
         -- Only prefer actual assignment stored on equipment_status. Do not fallback to recent work_order rows.
         (SELECT wo.status FROM work_order wo WHERE wo.id = es.work_order_id LIMIT 1) AS workorder_status,
         es.workorder_doc_no AS workorder_doc_no,
         -- Effective PM interval hours (used by frontend to detect "missed" threshold)
         (SELECT GREATEST(1, pr.interval_hours * GREATEST(1, COALESCE(pr.multiplier, 1)))
            FROM pm_rules pr WHERE pr.id = es.chosen_rule_id LIMIT 1) AS pm_interval_hours
       FROM equipment_status es
       JOIN master_alat m ON m.id = es.alat_id
       WHERE es.next_pm_engine_hour IS NOT NULL
         AND (
           EXISTS (SELECT 1 FROM pm_history ph WHERE ph.alat_id = es.alat_id)
           OR EXISTS (SELECT 1 FROM daily_equipment_hour_meter d WHERE d.alat_id = es.alat_id)
         )
       ORDER BY es.next_pm_engine_hour ASC
       LIMIT $1`,
      [limit]
    );
    // compute PM label for each row
    function pmLabelForEngine(nextEngine: any): string | null {
      if (nextEngine == null) return null;
      const n = Number(nextEngine);
      if (isNaN(n)) return null;
      const cycle = 1000;
      const step = (n % 500 === 0) ? 500 : 250;
      let pos = n % cycle;
      if (pos === 0) pos = cycle;
      const labelVal = Math.ceil(pos / step) * step;
      return `PM${labelVal}`;
    }

    for (const r of rows) {
      // prefer last recorded rule kode if available (keeps label consistent with rules),
      // otherwise fall back to computed label based on engine hour
      if (r.last_kode_rule) r.pm_label = r.last_kode_rule;
      else r.pm_label = pmLabelForEngine(r.next_pm_engine_hour);
    }

    return res.json({ data: rows });
  } catch (err) {
    console.error('getPMCalendar error', err);
    return res.status(500).json({ message: 'Failed to fetch PM calendar' });
  }
}

export async function runPmNow(req: Request, res: Response) {
  try {
    const out = await pmService.updateEquipmentStatusAll();
    return res.json({ message: 'PM update started', updated: out.length, details: out.slice(0, 200) });
  } catch (err) {
    console.error('runPmNow error', err);
    return res.status(500).json({ message: 'Failed to run PM update' });
  }
}

export async function assignWorkOrder(req: Request, res: Response) {
  try {
    const alatId = Number(req.params.alat_id);
    if (!alatId) return res.status(400).json({ message: 'alat_id required' });
    const { work_order_id, workorder_doc_no, wo_due_date } = req.body || {};

    // Resolve the WO's planned date so the calendar item moves to the correct date.
    // Priority: 1) wo_due_date sent from frontend (already resolved), 2) DB lookup start_date,
    //           3) raw->>'start_date', raw->>'date', 4) date_doc column.
    let woDueAt: string | null = wo_due_date || null;

    if (!woDueAt && (work_order_id || workorder_doc_no)) {
      const woCondition = work_order_id ? 'id = $1' : 'doc_no = $1';
      const woParam = work_order_id || workorder_doc_no;
      const woRows = await AppDataSource.manager.query(
        `SELECT start_date, date_doc, raw FROM work_order WHERE ${woCondition} LIMIT 1`,
        [woParam]
      );
      if (woRows && woRows.length) {
        const wo = woRows[0];
        if (wo.start_date) {
          woDueAt = wo.start_date;
        } else if (wo.raw && (wo.raw.start_date || wo.raw.date || wo.raw.tanggal_mulai || wo.raw.planned_date)) {
          woDueAt = wo.raw.start_date || wo.raw.date || wo.raw.tanggal_mulai || wo.raw.planned_date;
        } else if (wo.date_doc) {
          woDueAt = wo.date_doc;
        }
      }
    }

    // Accept either work_order_id (uuid) or workorder_doc_no (string). Update equipment_status.
    // Also update next_pm_due_at to the WO's start_date so the calendar item moves to the right date.
    await AppDataSource.manager.query(
      `INSERT INTO equipment_status (alat_id, work_order_id, workorder_doc_no, next_pm_due_at, updated_at, created_at)
       VALUES ($1, $2, $3, $4, now(), now())
       ON CONFLICT (alat_id) DO UPDATE SET
         work_order_id = EXCLUDED.work_order_id,
         workorder_doc_no = EXCLUDED.workorder_doc_no,
         next_pm_due_at = COALESCE(EXCLUDED.next_pm_due_at, equipment_status.next_pm_due_at),
         updated_at = now();`,
      [alatId, work_order_id || null, workorder_doc_no || null, woDueAt]
    );

    // Optionally, update workorder_status via join later; for now return success
    return res.json({ message: 'Assigned workorder to equipment status' });
  } catch (err) {
    console.error('assignWorkOrder error', err);
    return res.status(500).json({ message: 'Failed to assign workorder' });
  }
}

export async function unassignWorkOrder(req: Request, res: Response) {
  try {
    const alatId = Number(req.params.alat_id);
    if (!alatId) return res.status(400).json({ message: 'alat_id required' });
    await AppDataSource.manager.query(
      `UPDATE equipment_status SET work_order_id = NULL, workorder_doc_no = NULL, updated_at = now() WHERE alat_id = $1`,
      [alatId]
    );
    return res.json({ message: 'Unassigned workorder from equipment status' });
  } catch (err) {
    console.error('unassignWorkOrder error', err);
    return res.status(500).json({ message: 'Failed to unassign workorder' });
  }
}

export async function getWorkOrdersForAlat(req: Request, res: Response) {
  try {
    const alatId = Number(req.params.alat_id);
    if (!alatId) return res.status(400).json({ message: 'alat_id required' });
    const limit = Math.max(1, Number(req.query.limit || 100));
    // Try to locate master_alat name/code for additional matching
    const alatRows = await AppDataSource.manager.query(`SELECT id, nama, kode FROM master_alat WHERE id = $1 LIMIT 1`, [alatId]);
    const alat = alatRows && alatRows.length ? alatRows[0] : null;
    const alatName = alat ? String(alat.nama || '') : '';

    // Find work orders that look like PM and relate to this asset.
    // Match by asset_id OR asset_name containing master_alat.nama OR raw->>'asset' containing the name.
    const rows = await AppDataSource.manager.query(
      `SELECT id, doc_no, asset_id, asset_name, work_type, type_work, status, start_date, end_date, raw
       FROM work_order
       WHERE (
         COALESCE(work_type,'') ILIKE '%PM%' OR COALESCE(type_work,'') ILIKE '%PM%' OR COALESCE(work_type,'') ILIKE '%PREVENT%' OR COALESCE(type_work,'') ILIKE '%PREVENT%'
       )
       AND (
         asset_id = $1
         OR (asset_name IS NOT NULL AND lower(asset_name) LIKE '%' || lower($2) || '%')
         OR (raw->>'asset' IS NOT NULL AND lower(raw->>'asset') LIKE '%' || lower($2) || '%')
       )
       ORDER BY created_at DESC
       LIMIT $3`,
      [alatId, alatName, limit]
    );

    return res.json({ data: rows });
  } catch (err) {
    console.error('getWorkOrdersForAlat error', err);
    return res.status(500).json({ message: 'Failed to list workorders for alat' });
  }
}

/**
 * POST /pm/equipment-status/:alat_id/complete-wo
 * Mark the PM work order linked to this alat as COMPLETED.
 * The existing DB trigger (042_auto_insert_pm_history_on_wo_complete) fires and inserts pm_history.
 * As a belt-and-suspenders fallback we also do an explicit insert here if pm_history
 * doesn't yet have a row for this WO (covers environments where the trigger hasn't been applied).
 *
 * Body (all optional):
 *   engine_hour   – current meter reading; if omitted, last_engine_hour from equipment_status is used
 *   performed_at  – ISO string; defaults to now()
 *   notes         – free text
 */
export async function completePmWorkOrder(req: Request, res: Response) {
  try {
    const alatId = Number(req.params.alat_id);
    if (!alatId) return res.status(400).json({ message: 'alat_id required' });

    const { engine_hour, performed_at, notes } = req.body || {};

    // Load equipment_status row
    const esRows = await AppDataSource.manager.query(
      `SELECT work_order_id, workorder_doc_no, last_engine_hour, chosen_rule_id FROM equipment_status WHERE alat_id = $1 LIMIT 1`,
      [alatId]
    );
    const es = esRows && esRows.length ? esRows[0] : null;
    const workOrderId: string | null = es?.work_order_id || null;
    const workorderDocNo: string | null = es?.workorder_doc_no || null;

    if (!workOrderId && !workorderDocNo) {
      return res.status(400).json({ message: 'No work order assigned to this equipment' });
    }

    // Resolve engine hour: body → equipment_status.last_engine_hour
    const resolvedEngineHour: number | null =
      engine_hour != null ? Number(engine_hour) : (es?.last_engine_hour != null ? Number(es.last_engine_hour) : null);

    // Resolve performed_at: explicit body value → last realisasi end_time → WO end_date → now()
    let resolvedPerformedAt: string;
    if (performed_at) {
      resolvedPerformedAt = new Date(performed_at).toISOString();
    } else {
      resolvedPerformedAt = new Date().toISOString(); // default fallback
      try {
        if (workOrderId) {
          // 1) prefer last realisasi end_time (actual technician work completion)
          const realisasiRows = await AppDataSource.manager.query(
            `SELECT MAX(r.end_time) AS last_end_time
               FROM realisasi r
               JOIN task t ON r.task_id = t.id
              WHERE t.work_order_id = $1 AND r.end_time IS NOT NULL`,
            [workOrderId]
          );
          const lastEndTime = realisasiRows?.[0]?.last_end_time;
          if (lastEndTime) {
            resolvedPerformedAt = new Date(lastEndTime).toISOString();
          } else {
            // 2) fall back to WO end_date (planned completion date)
            const woDateRows = await AppDataSource.manager.query(
              `SELECT end_date FROM work_order WHERE id = $1`,
              [workOrderId]
            );
            const woEndDate = woDateRows?.[0]?.end_date;
            if (woEndDate) {
              resolvedPerformedAt = new Date(woEndDate).toISOString();
            }
          }
        }
      } catch (e) {
        // keep now() fallback
      }
    }

    // Update engine_hour into WO raw so the DB trigger can read it
    if (workOrderId && resolvedEngineHour != null) {
      await AppDataSource.manager.query(
        `UPDATE work_order SET raw = COALESCE(raw, '{}'::jsonb) || jsonb_build_object('engine_hour', $1::text) WHERE id = $2`,
        [String(resolvedEngineHour), workOrderId]
      );
    }

    // Update WO status → COMPLETED (DB trigger fires here and inserts pm_history)
    if (workOrderId) {
      await AppDataSource.manager.query(
        `UPDATE work_order SET status = 'COMPLETED', end_date = COALESCE(end_date, now()) WHERE id = $1`,
        [workOrderId]
      );
    } else if (workorderDocNo) {
      await AppDataSource.manager.query(
        `UPDATE work_order SET status = 'COMPLETED', end_date = COALESCE(end_date, now()) WHERE doc_no = $1`,
        [workorderDocNo]
      );
    }

    // ── Explicit fallback insert (in case the DB trigger isn't applied) ──────────
    // Only insert if no pm_history row for this WO/alat already exists.
    const docNoToCheck = workorderDocNo || (workOrderId
      ? (await AppDataSource.manager.query(`SELECT doc_no FROM work_order WHERE id = $1 LIMIT 1`, [workOrderId]).then((r: any[]) => r?.[0]?.doc_no ?? null))
      : null);

    const alreadyExists = docNoToCheck
      ? await AppDataSource.manager.query(
          `SELECT 1 FROM pm_history WHERE alat_id = $1 AND workorder_no = $2 LIMIT 1`,
          [alatId, docNoToCheck]
        )
      : [];

    if (!alreadyExists || alreadyExists.length === 0) {
      // Determine pm_rule_id
      let pmRuleId: number | null = es?.chosen_rule_id ? Number(es.chosen_rule_id) : null;
      if (!pmRuleId) {
        const ruleRows = await AppDataSource.manager.query(
          `SELECT pr.id FROM pm_rules pr
           JOIN master_alat ma ON (pr.alat_id = ma.id OR pr.jenis_alat_id = ma.jenis_alat_id)
           WHERE ma.id = $1 AND pr.active = true
           ORDER BY pr.interval_hours ASC LIMIT 1`,
          [alatId]
        );
        pmRuleId = ruleRows && ruleRows.length ? Number(ruleRows[0].id) : null;
      }

      if (pmRuleId && resolvedEngineHour != null) {
        // Compute next_due_engine_hour via rule
        const ruleRows = await AppDataSource.manager.query(`SELECT interval_hours, multiplier FROM pm_rules WHERE id = $1`, [pmRuleId]);
        const rule = ruleRows && ruleRows.length ? ruleRows[0] : null;
        let nextDue: number | null = null;
        if (rule) {
          const effective = Math.max(1, Number(rule.interval_hours) * Math.max(1, Number(rule.multiplier)));
          // absolute mode: next multiple of effective above current
          const next = Math.ceil(resolvedEngineHour / effective) * effective;
          nextDue = next > resolvedEngineHour ? next : resolvedEngineHour + effective;
        }

        const notesText = notes || `Auto-inserted on WO completion (doc_no=${docNoToCheck ?? ''})`;
        await AppDataSource.manager.query(
          `INSERT INTO pm_history (alat_id, pm_rule_id, performed_by, performed_at, engine_hour, next_due_engine_hour, notes, workorder_no, created_at, updated_at)
           VALUES ($1, $2, NULL, $3, $4, $5, $6, $7, now(), now())
           ON CONFLICT DO NOTHING`,
          [alatId, pmRuleId, resolvedPerformedAt, resolvedEngineHour, nextDue, notesText, docNoToCheck]
        );

        // Refresh equipment_status
        try {
          await pmService.updateEquipmentStatusAll([alatId]);
        } catch (e) {
          console.warn('completePmWorkOrder: pmService refresh failed', e);
        }
      }
    }

    return res.json({ message: 'Work order marked as COMPLETED and PM history updated' });
  } catch (err) {
    console.error('completePmWorkOrder error', err);
    return res.status(500).json({ message: 'Failed to complete PM work order' });
  }
}

export default { getPMCalendar, runPmNow };
