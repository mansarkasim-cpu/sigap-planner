import { AppDataSource } from '../ormconfig';

/** Compute next PM engine hour based on site pm_mode */
function computeNextDueEngineHour(engineHour: number, effective: number, pmMode: string): number {
  if (pmMode === 'absolute') {
    const next = Math.ceil(engineHour / effective) * effective;
    return next > engineHour ? next : engineHour + effective;
  }
  return engineHour + effective;
}

export async function updateEquipmentStatusAll(alatFilter?: number[]) {
  // Load active PM rules
  const rules: any[] = await AppDataSource.manager.query(`SELECT * FROM pm_rules WHERE active = true`);

  // Map rules by alat_id and jenis_alat_id
  const rulesByAlat = new Map<number, any[]>();
  const rulesByJenis = new Map<number, any[]>();
  for (const r of rules) {
    if (r.alat_id) {
      const k = Number(r.alat_id);
      rulesByAlat.set(k, (rulesByAlat.get(k) || []).concat(r));
    }
    if (r.jenis_alat_id) {
      const k = Number(r.jenis_alat_id);
      rulesByJenis.set(k, (rulesByJenis.get(k) || []).concat(r));
    }
  }

  // Fetch equipments that have rules (either specific or by jenis).
  // If `alatFilter` provided, limit to those alat ids.
  let alatRows: any[] = [];
  if (Array.isArray(alatFilter) && alatFilter.length > 0) {
    alatRows = await AppDataSource.manager.query(
      `SELECT a.id, a.jenis_alat_id FROM master_alat a WHERE a.id = ANY($1)`,
      [alatFilter]
    );
  } else {
    alatRows = await AppDataSource.manager.query(`
      SELECT a.id, a.jenis_alat_id
      FROM master_alat a
      WHERE a.id IN (
        SELECT DISTINCT COALESCE(alat_id, -1) FROM pm_rules WHERE alat_id IS NOT NULL
      ) OR a.jenis_alat_id IN (
        SELECT DISTINCT jenis_alat_id FROM pm_rules WHERE jenis_alat_id IS NOT NULL
      )
    `);
  }

  const results: any[] = [];

  // load per-jenis avg hours from master_jenis_alat (preferred location)
  const jenisSettings: any[] = await AppDataSource.manager.query(`SELECT id AS jenis_alat_id, avg_hours_per_day FROM master_jenis_alat`);
  const avgByJenis = new Map<number, number>();
  for (const t of jenisSettings) {
    if (t.jenis_alat_id != null) avgByJenis.set(Number(t.jenis_alat_id), Number(t.avg_hours_per_day || 0));
  }

  for (const alat of alatRows) {
    const alatId = Number(alat.id);
    const jenisId = alat.jenis_alat_id ? Number(alat.jenis_alat_id) : null;

    // fetch site pm_mode for this alat
    let pmMode = 'absolute';
    try {
      const siteRows: any[] = await AppDataSource.manager.query(
        `SELECT ms.pm_mode FROM master_alat ma JOIN master_site ms ON ms.id = ma.site_id WHERE ma.id = $1 LIMIT 1`,
        [alatId]
      );
      if (siteRows && siteRows.length && siteRows[0].pm_mode) pmMode = String(siteRows[0].pm_mode);
    } catch (e) { /* keep default */ }

    // collect applicable rules: alat-specific first, then jenis rules
    const applicable = (rulesByAlat.get(alatId) || []).concat(jenisId ? (rulesByJenis.get(jenisId) || []) : []);
    if (!applicable || applicable.length === 0) continue;

    // get latest engine_hour for alat
    const lastRow = await AppDataSource.manager.query(
      `SELECT engine_hour, recorded_at, teknisi_id FROM daily_equipment_hour_meter WHERE alat_id = $1 ORDER BY recorded_at DESC LIMIT 1`,
      [alatId]
    );
    const last = lastRow && lastRow.length ? lastRow[0] : null;
    const lastEngineHour = last ? Number(last.engine_hour || 0) : null;
    const lastRecordedAt = last ? last.recorded_at : null;
    const lastTechnician = last ? last.teknisi_id : null;

    // Attempt: derive base engine from the hour-meter at the time of the last PM (any rule) for this alat
    const lastHistAll = await AppDataSource.manager.query(
      `SELECT engine_hour, performed_at, pm_rule_id, next_due_engine_hour FROM pm_history WHERE alat_id = $1 ORDER BY performed_at DESC LIMIT 1`,
      [alatId]
    );
    const lastHist = lastHistAll && lastHistAll.length ? lastHistAll[0] : null;
    let basePerformedEngine = null;
    if (lastHist) {
      // Prefer explicit engine_hour stored in pm_history (recorded at PM time)
      if (lastHist.engine_hour != null && Number(lastHist.engine_hour) > 0) {
        basePerformedEngine = Number(lastHist.engine_hour);
      } else if (lastHist.performed_at) {
        // fallback: use the latest hour-meter reading at or before the performed_at
        const meterAtPM = await AppDataSource.manager.query(
          `SELECT engine_hour FROM daily_equipment_hour_meter WHERE alat_id = $1 AND recorded_at <= $2 ORDER BY recorded_at DESC LIMIT 1`,
          [alatId, lastHist.performed_at]
        );
        if (meterAtPM && meterAtPM.length) basePerformedEngine = Number(meterAtPM[0].engine_hour || 0);
      }
    }

    // If we have a last-performed base and applicable rules, schedule next as the next rule in sequence
    // using the smallest interval step (e.g., 250) added to the engine-hour at last PM.
    const candidates: Array<any> = [];
    if (basePerformedEngine != null && applicable.length > 0) {
      // find minimal interval among applicable rules
      const intervals = applicable.map(r => Number(r.interval_hours) || Infinity).filter(v => isFinite(v));
      const step = intervals.length ? Math.min(...intervals) : 250;
      // sort applicable rules by numeric multiplier if present, otherwise by id
      const sorted = applicable.slice().sort((a,b) => (Number(a.multiplier) || 0) - (Number(b.multiplier) || 0));
      // find last rule index in sorted list
      const lastIdx = lastHist ? sorted.findIndex(r => String(r.id) === String(lastHist.pm_rule_id)) : -1;
      const nextRule = (lastIdx >= 0 && lastIdx < sorted.length-1) ? sorted[lastIdx+1] : (sorted[0] || null);
      if (nextRule) {
        // For absolute mode: use next_due_engine_hour stored in pm_history as the milestone base
        // (it represents which milestone this PM covered, so next PM starts from that milestone)
        // For relative mode: use the actual performed engine hour
        const engineBase = (pmMode === 'absolute' && lastHist.next_due_engine_hour != null)
          ? Number(lastHist.next_due_engine_hour)
          : Number(basePerformedEngine);
        const nextDueEngine = computeNextDueEngineHour(engineBase, Number(step), pmMode);
        // compute nextDueAt based on performed_at of last PM (not lastRecordedAt of meter reading)
        const avgHoursPerDay = Number((jenisId != null ? avgByJenis.get(jenisId) : undefined) ?? process.env.PM_AVG_HOURS_PER_DAY) || 24;
        let nextDueAt = null;
        try {
          const refDate = lastHist.performed_at ? new Date(lastHist.performed_at) : (lastRecordedAt ? new Date(lastRecordedAt) : new Date());
          const hoursLeft = nextDueEngine - Number(lastEngineHour || basePerformedEngine || 0);
          if (hoursLeft <= 0) nextDueAt = new Date().toISOString();
          else if (avgHoursPerDay > 0) {
            const days = Math.ceil(hoursLeft / avgHoursPerDay);
            const d = new Date(refDate);
            d.setHours(0,0,0,0);
            d.setDate(d.getDate() + days);
            nextDueAt = d.toISOString();
          }
        } catch (err) {
          nextDueAt = null;
        }
        const chosen = { rule_id: nextRule.id, nextDueEngine, nextDueAt, kode_rule: nextRule.kode_rule || null };
        // persist chosen immediately and skip per-rule fallback so the sequence follows last performed PM
        try { console.debug('[pmService] chosen-from-last for alat', alatId, chosen); } catch(e) {}
        // ensure nextDueEngine is not behind the last known engine reading
        let safeNext = Number(chosen.nextDueEngine || 0);
        if (lastEngineHour != null && safeNext <= Number(lastEngineHour)) {
          safeNext = Number(lastEngineHour) + 1;
        }
        await AppDataSource.manager.query(
          `INSERT INTO equipment_status (alat_id, last_engine_hour, last_recorded_at, last_technician, next_pm_engine_hour, next_pm_due_at, chosen_rule_id, chosen_kode_rule, status, updated_at, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'scheduled', now(), now())
           ON CONFLICT (alat_id) DO UPDATE SET
             last_engine_hour = EXCLUDED.last_engine_hour,
             last_recorded_at = EXCLUDED.last_recorded_at,
             last_technician = EXCLUDED.last_technician,
             next_pm_engine_hour = EXCLUDED.next_pm_engine_hour,
             next_pm_due_at = COALESCE(EXCLUDED.next_pm_due_at, equipment_status.next_pm_due_at),
             chosen_rule_id = EXCLUDED.chosen_rule_id,
             chosen_kode_rule = EXCLUDED.chosen_kode_rule,
             status = EXCLUDED.status,
             updated_at = now();`,
          [alatId, lastEngineHour, lastRecordedAt, lastTechnician, safeNext, chosen.nextDueAt, chosen.rule_id, chosen.kode_rule]
        );
        results.push({ alat_id: alatId, rule_id: chosen.rule_id, next_due_engine_hour: chosen.nextDueEngine });
        continue;
      }
    }

    // Also generate per-rule candidates as a fallback (keeps previous behavior)
    for (const rule of applicable) {
      const interval = Number(rule.interval_hours) || 0;
      const multiplier = Number(rule.multiplier) || 1;
      const effective = Math.max(1, interval * multiplier);
      const startEngine = Number(rule.start_engine_hour || 0);

      // last performed engine hour and performed_at for this rule+alat
      const hist = await AppDataSource.manager.query(
        `SELECT engine_hour, performed_at, next_due_engine_hour FROM pm_history WHERE alat_id = $1 AND pm_rule_id = $2 ORDER BY performed_at DESC LIMIT 1`,
        [alatId, rule.id]
      );
      const lastPerformed = hist && hist.length ? Number(hist[0].engine_hour || 0) : null;
      const lastPerformedNextDue = hist && hist.length ? hist[0].next_due_engine_hour : null;
      const lastPerformedAt = hist && hist.length ? hist[0].performed_at : null;

      // Determine current engine reference and compute next due engine
      const currentEngine = Math.max(Number(lastEngineHour || 0), Number(lastPerformed || 0), Number(startEngine || 0));

      // compute nextDueEngine respecting pm_mode
      let nextDueEngine: number;
      if (pmMode === 'relative') {
        // relative: last performed engine + effective
        const refEngine = lastPerformed != null ? lastPerformed : Number(startEngine || 0);
        nextDueEngine = refEngine + effective;
        // if still behind current engine, advance
        if (nextDueEngine <= Number(currentEngine)) {
          const delta = Number(currentEngine) - refEngine;
          const steps = Math.floor(delta / effective) + 1;
          nextDueEngine = refEngine + steps * effective;
        }
      } else {
        // absolute: use next_due_engine_hour from last PM as the base if available
        if (lastPerformedNextDue != null) {
          const baseAbsolute = Number(lastPerformedNextDue);
          nextDueEngine = computeNextDueEngineHour(baseAbsolute, effective, 'absolute');
          // safeguard: ensure we advance past currentEngine
          while (nextDueEngine <= Number(currentEngine)) {
            nextDueEngine = computeNextDueEngineHour(nextDueEngine, effective, 'absolute');
          }
        } else {
          // no previous PM — align to multiples of effective from startEngine
          nextDueEngine = Number(startEngine || 0);
          if (effective > 0) {
            if (nextDueEngine <= currentEngine) {
              const delta = currentEngine - Number(startEngine || 0);
              const steps = Math.floor(delta / effective) + 1;
              nextDueEngine = Number(startEngine || 0) + steps * effective;
            }
          } else {
            nextDueEngine = currentEngine;
          }
        }
      }

      // Estimate next_pm_due_at based on engine-hour forecast from PM performed_at
      const avgHoursPerDay = Number((jenisId != null ? avgByJenis.get(jenisId) : undefined) ?? process.env.PM_AVG_HOURS_PER_DAY) || 24;
      let nextDueAt = null;
      try {
        const baseEngineForDate = (lastEngineHour != null) ? Number(lastEngineHour) : (lastPerformed != null ? Number(lastPerformed) : Number(startEngine || 0));
        const refDate = lastPerformedAt ? new Date(lastPerformedAt) : (lastRecordedAt ? new Date(lastRecordedAt) : new Date());
        const hoursLeft = nextDueEngine - baseEngineForDate;
        if (hoursLeft <= 0) {
          nextDueAt = new Date().toISOString();
        } else if (avgHoursPerDay > 0) {
          const days = Math.ceil(hoursLeft / avgHoursPerDay);
          const d = new Date(refDate);
          d.setHours(0,0,0,0);
          d.setDate(d.getDate() + days);
          nextDueAt = d.toISOString();
        }
      } catch (err) {
        nextDueAt = null;
      }

      candidates.push({ rule_id: rule.id, nextDueEngine, nextDueAt, kode_rule: rule.kode_rule || null });
    }

    // choose the candidate with the smallest nextDueEngine (earliest upcoming)
    if (candidates.length > 0) {
      // DEBUG: log candidates for diagnosis
      try { console.debug('[pmService] candidates for alat', alatId, candidates); } catch(e) {}
      candidates.sort((a,b) => Number(a.nextDueEngine) - Number(b.nextDueEngine));
      const chosen = candidates[0];
      try { console.debug('[pmService] chosen for alat', alatId, chosen); } catch(e) {}

      // upsert chosen candidate into equipment_status
      // safeguard: do not persist a next_pm_engine_hour less than lastEngineHour
      let safeNext2 = Number(chosen.nextDueEngine || 0);
      if (lastEngineHour != null && safeNext2 <= Number(lastEngineHour)) {
        safeNext2 = Number(lastEngineHour) + 1;
      }
      await AppDataSource.manager.query(
        `INSERT INTO equipment_status (alat_id, last_engine_hour, last_recorded_at, last_technician, next_pm_engine_hour, next_pm_due_at, chosen_rule_id, chosen_kode_rule, status, updated_at, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'scheduled', now(), now())
         ON CONFLICT (alat_id) DO UPDATE SET
           last_engine_hour = EXCLUDED.last_engine_hour,
           last_recorded_at = EXCLUDED.last_recorded_at,
           last_technician = EXCLUDED.last_technician,
           next_pm_engine_hour = EXCLUDED.next_pm_engine_hour,
           next_pm_due_at = COALESCE(EXCLUDED.next_pm_due_at, equipment_status.next_pm_due_at),
           chosen_rule_id = EXCLUDED.chosen_rule_id,
           chosen_kode_rule = EXCLUDED.chosen_kode_rule,
           status = EXCLUDED.status,
           updated_at = now();`,
        [alatId, lastEngineHour, lastRecordedAt, lastTechnician, safeNext2, chosen.nextDueAt, chosen.rule_id, chosen.kode_rule]
      );

      results.push({ alat_id: alatId, rule_id: chosen.rule_id, next_due_engine_hour: chosen.nextDueEngine });
    }
  }

  return results;
}

export async function updateEquipmentStatusFromMeter(alatId: number) {
  if (!alatId) return;
  const lastRow = await AppDataSource.manager.query(
    `SELECT engine_hour, recorded_at, teknisi_id FROM daily_equipment_hour_meter WHERE alat_id = $1 ORDER BY recorded_at DESC LIMIT 1`,
    [alatId]
  );
  if (!lastRow || !lastRow.length) return;
  const last = lastRow[0];
  const lastEngineHour = last ? Number(last.engine_hour || 0) : null;
  const lastRecordedAt = last ? last.recorded_at : null;
  const lastTechnician = last ? last.teknisi_id : null;

  // Upsert only the last-engine fields; do NOT set or modify next_pm_engine_hour
  // Determine whether we should regenerate next_pm_due_at: only when next_pm_engine_hour exists
  // and the newly recorded lastEngineHour is <= next_pm_engine_hour
  let newNextDueAt: string | null = null;
  try {
    const esRows: any[] = await AppDataSource.manager.query(
      `SELECT next_pm_engine_hour, next_pm_due_at, chosen_rule_id FROM equipment_status WHERE alat_id = $1 LIMIT 1`,
      [alatId]
    );
    const es = esRows && esRows.length ? esRows[0] : null;
    const nextEngine = es && es.next_pm_engine_hour != null ? Number(es.next_pm_engine_hour) : null;

    if (nextEngine != null && lastEngineHour != null && lastEngineHour <= nextEngine) {
      // fetch jenis_alat.avg_hours_per_day if available
      const alatRows: any[] = await AppDataSource.manager.query(`SELECT jenis_alat_id FROM master_alat WHERE id = $1 LIMIT 1`, [alatId]);
      const jenisId = alatRows && alatRows.length ? (alatRows[0].jenis_alat_id || null) : null;
      let avgHoursPerDay = Number(process.env.PM_AVG_HOURS_PER_DAY) || 24;
      if (jenisId != null) {
        try {
          const jenisRows: any[] = await AppDataSource.manager.query(`SELECT avg_hours_per_day FROM master_jenis_alat WHERE id = $1 LIMIT 1`, [jenisId]);
          if (jenisRows && jenisRows.length && jenisRows[0].avg_hours_per_day != null) {
            avgHoursPerDay = Number(jenisRows[0].avg_hours_per_day) || avgHoursPerDay;
          }
        } catch (e) {
          // ignore and use fallback
        }
      }

      try {
        const hoursLeft = Number(nextEngine) - Number(lastEngineHour);
        if (hoursLeft <= 0) {
          newNextDueAt = new Date().toISOString();
        } else if (avgHoursPerDay > 0) {
          const days = Math.ceil(hoursLeft / avgHoursPerDay);
          const refDate = lastRecordedAt ? new Date(lastRecordedAt) : new Date();
          const d = new Date(refDate);
          d.setHours(0,0,0,0);
          d.setDate(d.getDate() + days);
          newNextDueAt = d.toISOString();
        }
      } catch (e) {
        newNextDueAt = null;
      }
    }
  } catch (e) {
    // ignore errors and proceed with basic upsert
  }

  await AppDataSource.manager.query(
    `INSERT INTO equipment_status (alat_id, last_engine_hour, last_recorded_at, last_technician, next_pm_due_at, updated_at, created_at)
     VALUES ($1, $2, $3, $4, $5, now(), now())
     ON CONFLICT (alat_id) DO UPDATE SET
       last_engine_hour = EXCLUDED.last_engine_hour,
       last_recorded_at = EXCLUDED.last_recorded_at,
       last_technician = EXCLUDED.last_technician,
       next_pm_due_at = COALESCE(EXCLUDED.next_pm_due_at, equipment_status.next_pm_due_at),
       updated_at = now();`,
    [alatId, lastEngineHour, lastRecordedAt, lastTechnician, newNextDueAt]
  );

  // ── Missed PM detection ────────────────────────────────────────────────────
  // If the current engine hour has passed next_pm_engine_hour by one full cycle,
  // the PM was never performed — auto-insert a "missed" pm_history record.
  try {
    const esForMissed: any[] = await AppDataSource.manager.query(
      `SELECT es.next_pm_engine_hour, es.chosen_rule_id,
              GREATEST(1, pr.interval_hours * GREATEST(1, COALESCE(pr.multiplier, 1))) AS effective_interval
         FROM equipment_status es
         LEFT JOIN pm_rules pr ON pr.id = es.chosen_rule_id
        WHERE es.alat_id = $1 LIMIT 1`,
      [alatId]
    );
    const em = esForMissed && esForMissed.length ? esForMissed[0] : null;
    const nextPmEngine = em?.next_pm_engine_hour != null ? Number(em.next_pm_engine_hour) : null;
    const effectiveInterval = em?.effective_interval != null ? Number(em.effective_interval) : null;
    const chosenRuleId = em?.chosen_rule_id || null;

    if (nextPmEngine != null && effectiveInterval != null && lastEngineHour != null
        && lastEngineHour > nextPmEngine + effectiveInterval) {
      // Check idempotency: only insert if no missed record for this scheduled engine hour
      const existingMissed: any[] = await AppDataSource.manager.query(
        `SELECT 1 FROM pm_history WHERE alat_id = $1 AND is_missed = true AND engine_hour = $2 LIMIT 1`,
        [alatId, nextPmEngine]
      );
      if (!existingMissed || existingMissed.length === 0) {
        await AppDataSource.manager.query(
          `INSERT INTO pm_history
             (alat_id, pm_rule_id, performed_by, performed_at, engine_hour, next_due_engine_hour, notes, is_missed, created_at, updated_at)
           VALUES ($1, $2, NULL, $3, $4, $5, 'PM not performed – auto-detected as missed', true, now(), now())
           ON CONFLICT DO NOTHING`,
          [
            alatId,
            chosenRuleId,
            lastRecordedAt || new Date().toISOString(),
            nextPmEngine,
            nextPmEngine + effectiveInterval,
          ]
        );
        console.info(`[pmService] Missed PM auto-inserted for alat ${alatId} at engine_hour ${nextPmEngine}`);
      }
    }
  } catch (e) {
    console.warn('[pmService] missed PM detection error (suppressed):', e);
  }
}

export default { updateEquipmentStatusAll, updateEquipmentStatusFromMeter };
