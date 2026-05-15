"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePmHistory = exports.updatePmHistory = exports.createPmHistory = exports.listPmHistory = void 0;
const ormconfig_1 = require("../ormconfig");
const pmService_1 = __importDefault(require("../services/pmService"));
async function listPmHistory(req, res) {
    try {
        const limit = Math.max(1, Number(req.query.limit || 200));
        const where = [];
        const params = [];
        let idx = 1;
        if (req.query.site_id) {
            where.push(`a.site_id = $${idx++}`);
            params.push(req.query.site_id);
        }
        if (req.query.alat_id) {
            where.push(`ph.alat_id = $${idx++}`);
            params.push(req.query.alat_id);
        }
        if (req.query.start_date) {
            where.push(`ph.performed_at >= $${idx++}`);
            params.push(req.query.start_date);
        }
        if (req.query.end_date) {
            where.push(`ph.performed_at <= $${idx++}`);
            params.push(req.query.end_date);
        }
        const whereSql = where.length ? ('WHERE ' + where.join(' AND ')) : '';
        const sql = `SELECT ph.*, a.nama AS nama_alat, a.kode AS kode_alat, a.kode_alias AS kode_alias, a.site_id AS site_id, r.description AS pm_rule_label, r.kode_rule, u.name AS performed_by_name
      FROM pm_history ph
      LEFT JOIN master_alat a ON a.id = ph.alat_id
      LEFT JOIN pm_rules r ON r.id = ph.pm_rule_id
      LEFT JOIN "user" u ON u.id = ph.performed_by
      ${whereSql}
      ORDER BY ph.performed_at DESC
      LIMIT $${idx}`;
        params.push(limit);
        console.debug('[pmHistory] SQL:', sql);
        console.debug('[pmHistory] params:', params);
        const rows = await ormconfig_1.AppDataSource.manager.query(sql, params);
        return res.json({ data: rows });
    }
    catch (err) {
        const e = err;
        console.error('listPmHistory error', e && e.stack ? e.stack : e);
        return res.status(500).json({ message: 'Failed to list PM history' });
    }
}
exports.listPmHistory = listPmHistory;
async function createPmHistory(req, res) {
    try {
        const body = req.body || {};
        const alat_id = body.alat_id;
        const pm_rule_id = body.pm_rule_id;
        const engine_hour = body.engine_hour != null ? Number(body.engine_hour) : null;
        const performed_by = body.performed_by || null;
        const performed_at = body.performed_at ? new Date(body.performed_at).toISOString() : new Date().toISOString();
        const notes = body.notes || null;
        const workorder_no = body.workorder_no || null;
        if (!alat_id || !pm_rule_id || engine_hour == null) {
            return res.status(400).json({ message: 'alat_id, pm_rule_id and engine_hour are required' });
        }
        // compute next_due_engine_hour based on rule: next = last engine_hour + interval * multiplier
        const ruleRows = await ormconfig_1.AppDataSource.manager.query(`SELECT interval_hours, multiplier FROM pm_rules WHERE id = $1`, [pm_rule_id]);
        const rule = ruleRows && ruleRows.length ? ruleRows[0] : null;
        let next_due_engine_hour = null;
        if (rule) {
            const interval = Number(rule.interval_hours) || 0;
            const multiplier = Number(rule.multiplier) || 1;
            const effective = Math.max(1, interval * multiplier);
            next_due_engine_hour = Number(engine_hour) + effective;
        }
        const insertSql = `INSERT INTO pm_history (alat_id, pm_rule_id, performed_by, performed_at, engine_hour, next_due_engine_hour, notes, workorder_no, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now(), now()) RETURNING *`;
        const params = [alat_id, pm_rule_id, performed_by, performed_at, engine_hour, next_due_engine_hour, notes, workorder_no];
        const inserted = await ormconfig_1.AppDataSource.manager.query(insertSql, params);
        // Clear any assigned workorder on equipment_status for this alat (user just performed PM)
        try {
            await ormconfig_1.AppDataSource.manager.query(`UPDATE equipment_status SET work_order_id = NULL, workorder_doc_no = NULL, updated_at = now() WHERE alat_id = $1`, [alat_id]);
        }
        catch (e) {
            console.error('failed to clear equipment_status workorder after pm_history insert', e);
        }
        // refresh equipment status for this alat only
        // Compute next_pm_due_at based on performed_at + days derived from engine hours and avg_hours_per_day
        try {
            // determine jenis_alat for this alat
            const maRows = await ormconfig_1.AppDataSource.manager.query(`SELECT jenis_alat_id FROM master_alat WHERE id = $1 LIMIT 1`, [alat_id]);
            const jenisId = maRows && maRows.length ? maRows[0].jenis_alat_id : null;
            let avgHoursPerDay = Number(process.env.PM_AVG_HOURS_PER_DAY) || 24;
            if (jenisId != null) {
                const jRows = await ormconfig_1.AppDataSource.manager.query(`SELECT avg_hours_per_day FROM master_jenis_alat WHERE id = $1 LIMIT 1`, [jenisId]);
                if (jRows && jRows.length && jRows[0].avg_hours_per_day != null)
                    avgHoursPerDay = Number(jRows[0].avg_hours_per_day) || avgHoursPerDay;
            }
            let nextDueAt = null;
            if (next_due_engine_hour != null && engine_hour != null && avgHoursPerDay > 0) {
                const hoursLeft = Number(next_due_engine_hour) - Number(engine_hour);
                if (hoursLeft <= 0)
                    nextDueAt = new Date(performed_at).toISOString();
                else {
                    const days = Math.ceil(hoursLeft / avgHoursPerDay);
                    const d = new Date(performed_at);
                    d.setHours(0, 0, 0, 0);
                    d.setDate(d.getDate() + days);
                    nextDueAt = d.toISOString();
                }
            }
            // Upsert equipment_status for this alat to set next PM engine hour and due date, and last engine fields
            await ormconfig_1.AppDataSource.manager.query(`INSERT INTO equipment_status (alat_id, last_engine_hour, last_recorded_at, last_technician, next_pm_engine_hour, next_pm_due_at, updated_at, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, now(), now())
           ON CONFLICT (alat_id) DO UPDATE SET
             last_engine_hour = EXCLUDED.last_engine_hour,
             last_recorded_at = EXCLUDED.last_recorded_at,
             last_technician = EXCLUDED.last_technician,
             next_pm_engine_hour = EXCLUDED.next_pm_engine_hour,
             next_pm_due_at = COALESCE(EXCLUDED.next_pm_due_at, equipment_status.next_pm_due_at),
             updated_at = now();`, [alat_id, engine_hour, performed_at, performed_by, next_due_engine_hour, nextDueAt]);
        }
        catch (e) {
            console.error('pmHistory: failed to upsert equipment_status with computed next due', e);
            try {
                await pmService_1.default.updateEquipmentStatusAll([Number(alat_id)]);
            }
            catch (ee) {
                console.error('pm update after history insert fallback failed', ee);
            }
        }
        return res.json({ data: inserted && inserted[0] ? inserted[0] : inserted });
    }
    catch (err) {
        console.error('createPmHistory error', err);
        return res.status(500).json({ message: 'Failed to create PM history' });
    }
}
exports.createPmHistory = createPmHistory;
async function updatePmHistory(req, res) {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ message: 'id is required' });
        const body = req.body || {};
        const alat_id = body.alat_id;
        const pm_rule_id = body.pm_rule_id;
        const engine_hour = body.engine_hour != null ? Number(body.engine_hour) : null;
        const performed_by = body.performed_by || null;
        const performed_at = body.performed_at ? new Date(body.performed_at).toISOString() : null;
        const notes = body.notes || null;
        const workorder_no = body.workorder_no || null;
        // Basic validation: require alat_id, pm_rule_id, engine_hour
        if (!alat_id || !pm_rule_id || engine_hour == null) {
            return res.status(400).json({ message: 'alat_id, pm_rule_id and engine_hour are required' });
        }
        // recompute next_due_engine_hour based on rule
        const ruleRows = await ormconfig_1.AppDataSource.manager.query(`SELECT interval_hours, multiplier FROM pm_rules WHERE id = $1`, [pm_rule_id]);
        const rule = ruleRows && ruleRows.length ? ruleRows[0] : null;
        let next_due_engine_hour = null;
        if (rule) {
            const interval = Number(rule.interval_hours) || 0;
            const multiplier = Number(rule.multiplier) || 1;
            const effective = Math.max(1, interval * multiplier);
            next_due_engine_hour = Number(engine_hour) + effective;
        }
        const updateSql = `UPDATE pm_history SET alat_id=$1, pm_rule_id=$2, performed_by=$3, performed_at=$4, engine_hour=$5, next_due_engine_hour=$6, notes=$7, workorder_no=$8, updated_at=now() WHERE id=$9 RETURNING *`;
        const params = [alat_id, pm_rule_id, performed_by, performed_at, engine_hour, next_due_engine_hour, notes, workorder_no, id];
        const updated = await ormconfig_1.AppDataSource.manager.query(updateSql, params);
        // refresh equipment status for this alat
        try {
            await pmService_1.default.updateEquipmentStatusAll([Number(alat_id)]);
        }
        catch (e) {
            console.error('pm update after history update failed', e);
        }
        return res.json({ data: updated && updated[0] ? updated[0] : updated });
    }
    catch (err) {
        console.error('updatePmHistory error', err);
        return res.status(500).json({ message: 'Failed to update PM history' });
    }
}
exports.updatePmHistory = updatePmHistory;
async function deletePmHistory(req, res) {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ message: 'id is required' });
        // find record to get alat_id
        const rows = await ormconfig_1.AppDataSource.manager.query(`SELECT * FROM pm_history WHERE id = $1 LIMIT 1`, [id]);
        const rec = rows && rows.length ? rows[0] : null;
        if (!rec)
            return res.status(404).json({ message: 'PM history not found' });
        await ormconfig_1.AppDataSource.manager.query(`DELETE FROM pm_history WHERE id = $1`, [id]);
        try {
            if (rec.alat_id)
                await pmService_1.default.updateEquipmentStatusAll([Number(rec.alat_id)]);
        }
        catch (e) {
            console.error('pm update after history delete failed', e);
        }
        return res.json({ data: rec });
    }
    catch (err) {
        console.error('deletePmHistory error', err);
        return res.status(500).json({ message: 'Failed to delete PM history' });
    }
}
exports.deletePmHistory = deletePmHistory;
exports.default = { listPmHistory, createPmHistory, updatePmHistory, deletePmHistory };
