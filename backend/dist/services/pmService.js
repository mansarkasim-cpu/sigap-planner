"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEquipmentStatusFromMeter = exports.updateEquipmentStatusAll = void 0;
const ormconfig_1 = require("../ormconfig");
async function updateEquipmentStatusAll(alatFilter) {
    // Load active PM rules
    const rules = await ormconfig_1.AppDataSource.manager.query(`SELECT * FROM pm_rules WHERE active = true`);
    // Map rules by alat_id and jenis_alat_id
    const rulesByAlat = new Map();
    const rulesByJenis = new Map();
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
    let alatRows = [];
    if (Array.isArray(alatFilter) && alatFilter.length > 0) {
        alatRows = await ormconfig_1.AppDataSource.manager.query(`SELECT a.id, a.jenis_alat_id FROM master_alat a WHERE a.id = ANY($1)`, [alatFilter]);
    }
    else {
        alatRows = await ormconfig_1.AppDataSource.manager.query(`
      SELECT a.id, a.jenis_alat_id
      FROM master_alat a
      WHERE a.id IN (
        SELECT DISTINCT COALESCE(alat_id, -1) FROM pm_rules WHERE alat_id IS NOT NULL
      ) OR a.jenis_alat_id IN (
        SELECT DISTINCT jenis_alat_id FROM pm_rules WHERE jenis_alat_id IS NOT NULL
      )
    `);
    }
    const results = [];
    // load per-jenis avg hours from master_jenis_alat (preferred location)
    const jenisSettings = await ormconfig_1.AppDataSource.manager.query(`SELECT id AS jenis_alat_id, avg_hours_per_day FROM master_jenis_alat`);
    const avgByJenis = new Map();
    for (const t of jenisSettings) {
        if (t.jenis_alat_id != null)
            avgByJenis.set(Number(t.jenis_alat_id), Number(t.avg_hours_per_day || 0));
    }
    for (const alat of alatRows) {
        const alatId = Number(alat.id);
        const jenisId = alat.jenis_alat_id ? Number(alat.jenis_alat_id) : null;
        // collect applicable rules: alat-specific first, then jenis rules
        const applicable = (rulesByAlat.get(alatId) || []).concat(jenisId ? (rulesByJenis.get(jenisId) || []) : []);
        if (!applicable || applicable.length === 0)
            continue;
        // get latest engine_hour for alat
        const lastRow = await ormconfig_1.AppDataSource.manager.query(`SELECT engine_hour, recorded_at, teknisi_id FROM daily_equipment_hour_meter WHERE alat_id = $1 ORDER BY recorded_at DESC LIMIT 1`, [alatId]);
        const last = lastRow && lastRow.length ? lastRow[0] : null;
        const lastEngineHour = last ? Number(last.engine_hour || 0) : null;
        const lastRecordedAt = last ? last.recorded_at : null;
        const lastTechnician = last ? last.teknisi_id : null;
        // Attempt: derive base engine from the hour-meter at the time of the last PM (any rule) for this alat
        const lastHistAll = await ormconfig_1.AppDataSource.manager.query(`SELECT engine_hour, performed_at, pm_rule_id FROM pm_history WHERE alat_id = $1 ORDER BY performed_at DESC LIMIT 1`, [alatId]);
        const lastHist = lastHistAll && lastHistAll.length ? lastHistAll[0] : null;
        let basePerformedEngine = null;
        if (lastHist) {
            // Prefer explicit engine_hour stored in pm_history (recorded at PM time)
            if (lastHist.engine_hour != null && Number(lastHist.engine_hour) > 0) {
                basePerformedEngine = Number(lastHist.engine_hour);
            }
            else if (lastHist.performed_at) {
                // fallback: use the latest hour-meter reading at or before the performed_at
                const meterAtPM = await ormconfig_1.AppDataSource.manager.query(`SELECT engine_hour FROM daily_equipment_hour_meter WHERE alat_id = $1 AND recorded_at <= $2 ORDER BY recorded_at DESC LIMIT 1`, [alatId, lastHist.performed_at]);
                if (meterAtPM && meterAtPM.length)
                    basePerformedEngine = Number(meterAtPM[0].engine_hour || 0);
            }
        }
        // If we have a last-performed base and applicable rules, schedule next as the next rule in sequence
        // using the smallest interval step (e.g., 250) added to the engine-hour at last PM.
        const candidates = [];
        if (basePerformedEngine != null && applicable.length > 0) {
            // find minimal interval among applicable rules
            const intervals = applicable.map(r => Number(r.interval_hours) || Infinity).filter(v => isFinite(v));
            const step = intervals.length ? Math.min(...intervals) : 250;
            // sort applicable rules by numeric multiplier if present, otherwise by id
            const sorted = applicable.slice().sort((a, b) => (Number(a.multiplier) || 0) - (Number(b.multiplier) || 0));
            // find last rule index in sorted list
            const lastIdx = lastHist ? sorted.findIndex(r => String(r.id) === String(lastHist.pm_rule_id)) : -1;
            const nextRule = (lastIdx >= 0 && lastIdx < sorted.length - 1) ? sorted[lastIdx + 1] : (sorted[0] || null);
            if (nextRule) {
                const nextDueEngine = Number(basePerformedEngine) + Number(step);
                // compute nextDueAt based on lastRecordedAt (fallback to now)
                const avgHoursPerDay = Number((jenisId != null ? avgByJenis.get(jenisId) : undefined) ?? process.env.PM_AVG_HOURS_PER_DAY) || 24;
                let nextDueAt = null;
                try {
                    const refDate = lastRecordedAt ? new Date(lastRecordedAt) : new Date();
                    const hoursLeft = nextDueEngine - Number(lastEngineHour || basePerformedEngine || 0);
                    if (hoursLeft <= 0)
                        nextDueAt = new Date().toISOString();
                    else if (avgHoursPerDay > 0) {
                        const days = Math.ceil(hoursLeft / avgHoursPerDay);
                        const d = new Date(refDate);
                        d.setHours(0, 0, 0, 0);
                        d.setDate(d.getDate() + days);
                        nextDueAt = d.toISOString();
                    }
                }
                catch (err) {
                    nextDueAt = null;
                }
                const chosen = { rule_id: nextRule.id, nextDueEngine, nextDueAt, kode_rule: nextRule.kode_rule || null };
                // persist chosen immediately and skip per-rule fallback so the sequence follows last performed PM
                try {
                    console.debug('[pmService] chosen-from-last for alat', alatId, chosen);
                }
                catch (e) { }
                // ensure nextDueEngine is not behind the last known engine reading
                let safeNext = Number(chosen.nextDueEngine || 0);
                if (lastEngineHour != null && safeNext <= Number(lastEngineHour)) {
                    safeNext = Number(lastEngineHour) + 1;
                }
                await ormconfig_1.AppDataSource.manager.query(`INSERT INTO equipment_status (alat_id, last_engine_hour, last_recorded_at, last_technician, next_pm_engine_hour, next_pm_due_at, chosen_rule_id, chosen_kode_rule, status, updated_at, created_at)
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
             updated_at = now();`, [alatId, lastEngineHour, lastRecordedAt, lastTechnician, safeNext, chosen.nextDueAt, chosen.rule_id, chosen.kode_rule]);
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
            // last performed engine hour for this rule+alat
            const hist = await ormconfig_1.AppDataSource.manager.query(`SELECT engine_hour FROM pm_history WHERE alat_id = $1 AND pm_rule_id = $2 ORDER BY performed_at DESC LIMIT 1`, [alatId, rule.id]);
            const lastPerformed = hist && hist.length ? Number(hist[0].engine_hour || 0) : null;
            // Determine current engine reference and compute next due engine
            const currentEngine = Math.max(Number(lastEngineHour || 0), Number(lastPerformed || 0), Number(startEngine || 0));
            // compute nextDueEngine as the smallest multiple of `effective` after the startEngine
            let nextDueEngine = Number(startEngine || 0);
            if (effective > 0) {
                if (nextDueEngine <= currentEngine) {
                    const delta = currentEngine - Number(startEngine || 0);
                    const steps = Math.floor(delta / effective) + 1;
                    nextDueEngine = Number(startEngine || 0) + steps * effective;
                }
            }
            else {
                nextDueEngine = currentEngine;
            }
            // Estimate next_pm_due_at based on engine-hour forecast
            const avgHoursPerDay = Number((jenisId != null ? avgByJenis.get(jenisId) : undefined) ?? process.env.PM_AVG_HOURS_PER_DAY) || 24;
            let nextDueAt = null;
            try {
                const baseEngineForDate = (lastEngineHour != null) ? Number(lastEngineHour) : (lastPerformed != null ? Number(lastPerformed) : Number(startEngine || 0));
                const refDate = lastRecordedAt ? new Date(lastRecordedAt) : new Date();
                const hoursLeft = nextDueEngine - baseEngineForDate;
                if (hoursLeft <= 0) {
                    nextDueAt = new Date().toISOString();
                }
                else if (avgHoursPerDay > 0) {
                    const days = Math.ceil(hoursLeft / avgHoursPerDay);
                    const d = new Date(refDate);
                    d.setHours(0, 0, 0, 0);
                    d.setDate(d.getDate() + days);
                    nextDueAt = d.toISOString();
                }
            }
            catch (err) {
                nextDueAt = null;
            }
            candidates.push({ rule_id: rule.id, nextDueEngine, nextDueAt, kode_rule: rule.kode_rule || null });
        }
        // choose the candidate with the smallest nextDueEngine (earliest upcoming)
        if (candidates.length > 0) {
            // DEBUG: log candidates for diagnosis
            try {
                console.debug('[pmService] candidates for alat', alatId, candidates);
            }
            catch (e) { }
            candidates.sort((a, b) => Number(a.nextDueEngine) - Number(b.nextDueEngine));
            const chosen = candidates[0];
            try {
                console.debug('[pmService] chosen for alat', alatId, chosen);
            }
            catch (e) { }
            // upsert chosen candidate into equipment_status
            // safeguard: do not persist a next_pm_engine_hour less than lastEngineHour
            let safeNext2 = Number(chosen.nextDueEngine || 0);
            if (lastEngineHour != null && safeNext2 <= Number(lastEngineHour)) {
                safeNext2 = Number(lastEngineHour) + 1;
            }
            await ormconfig_1.AppDataSource.manager.query(`INSERT INTO equipment_status (alat_id, last_engine_hour, last_recorded_at, last_technician, next_pm_engine_hour, next_pm_due_at, chosen_rule_id, chosen_kode_rule, status, updated_at, created_at)
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
           updated_at = now();`, [alatId, lastEngineHour, lastRecordedAt, lastTechnician, safeNext2, chosen.nextDueAt, chosen.rule_id, chosen.kode_rule]);
            results.push({ alat_id: alatId, rule_id: chosen.rule_id, next_due_engine_hour: chosen.nextDueEngine });
        }
    }
    return results;
}
exports.updateEquipmentStatusAll = updateEquipmentStatusAll;
async function updateEquipmentStatusFromMeter(alatId) {
    if (!alatId)
        return;
    const lastRow = await ormconfig_1.AppDataSource.manager.query(`SELECT engine_hour, recorded_at, teknisi_id FROM daily_equipment_hour_meter WHERE alat_id = $1 ORDER BY recorded_at DESC LIMIT 1`, [alatId]);
    if (!lastRow || !lastRow.length)
        return;
    const last = lastRow[0];
    const lastEngineHour = last ? Number(last.engine_hour || 0) : null;
    const lastRecordedAt = last ? last.recorded_at : null;
    const lastTechnician = last ? last.teknisi_id : null;
    // Upsert only the last-engine fields; do NOT set or modify next_pm_engine_hour
    await ormconfig_1.AppDataSource.manager.query(`INSERT INTO equipment_status (alat_id, last_engine_hour, last_recorded_at, last_technician, updated_at, created_at)
     VALUES ($1, $2, $3, $4, now(), now())
     ON CONFLICT (alat_id) DO UPDATE SET
       last_engine_hour = EXCLUDED.last_engine_hour,
       last_recorded_at = EXCLUDED.last_recorded_at,
       last_technician = EXCLUDED.last_technician,
       updated_at = now();`, [alatId, lastEngineHour, lastRecordedAt, lastTechnician]);
}
exports.updateEquipmentStatusFromMeter = updateEquipmentStatusFromMeter;
exports.default = { updateEquipmentStatusAll, updateEquipmentStatusFromMeter };
