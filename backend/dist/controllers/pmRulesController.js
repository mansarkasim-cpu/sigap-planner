"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePmRule = exports.updatePmRule = exports.createPmRule = exports.getPmRule = exports.listPmRules = void 0;
const ormconfig_1 = require("../ormconfig");
async function listPmRules(req, res) {
    try {
        const where = [];
        const params = [];
        let idx = 1;
        if (req.query.jenis_alat_id) {
            where.push(`jenis_alat_id = $${idx++}`);
            params.push(req.query.jenis_alat_id);
        }
        if (req.query.alat_id) {
            where.push(`alat_id = $${idx++}`);
            params.push(req.query.alat_id);
        }
        const whereSql = where.length ? ('WHERE ' + where.join(' AND ')) : '';
        const sql = `SELECT * FROM pm_rules ${whereSql} ORDER BY id DESC LIMIT 1000`;
        const rows = await ormconfig_1.AppDataSource.manager.query(sql, params);
        return res.json({ data: rows });
    }
    catch (err) {
        console.error('listPmRules error', err);
        return res.status(500).json({ message: 'Failed to list PM rules' });
    }
}
exports.listPmRules = listPmRules;
async function getPmRule(req, res) {
    try {
        const id = Number(req.params.id);
        const rows = await ormconfig_1.AppDataSource.manager.query(`SELECT * FROM pm_rules WHERE id = $1 LIMIT 1`, [id]);
        if (!rows || rows.length === 0)
            return res.status(404).json({ message: 'Not found' });
        return res.json({ data: rows[0] });
    }
    catch (err) {
        console.error('getPmRule error', err);
        return res.status(500).json({ message: 'Failed to get PM rule' });
    }
}
exports.getPmRule = getPmRule;
async function createPmRule(req, res) {
    try {
        const body = req.body || {};
        const r = await ormconfig_1.AppDataSource.manager.query(`INSERT INTO pm_rules (kode_rule, description, jenis_alat_id, alat_id, interval_hours, multiplier, start_engine_hour, active, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now(), now()) RETURNING *`, [body.kode_rule || null, body.description || null, body.jenis_alat_id || null, body.alat_id || null, body.interval_hours || 0, body.multiplier || 1, body.start_engine_hour || 0, body.active === false ? false : true]);
        return res.status(201).json({ data: r[0] });
    }
    catch (err) {
        console.error('createPmRule error', err);
        return res.status(500).json({ message: 'Failed to create PM rule' });
    }
}
exports.createPmRule = createPmRule;
async function updatePmRule(req, res) {
    try {
        const id = Number(req.params.id);
        const body = req.body || {};
        const r = await ormconfig_1.AppDataSource.manager.query(`UPDATE pm_rules SET kode_rule=$1, description=$2, jenis_alat_id=$3, alat_id=$4, interval_hours=$5, multiplier=$6, start_engine_hour=$7, active=$8, updated_at=now() WHERE id=$9 RETURNING *`, [body.kode_rule || null, body.description || null, body.jenis_alat_id || null, body.alat_id || null, body.interval_hours || 0, body.multiplier || 1, body.start_engine_hour || 0, body.active === false ? false : true, id]);
        if (!r || r.length === 0)
            return res.status(404).json({ message: 'Not found' });
        return res.json({ data: r[0] });
    }
    catch (err) {
        console.error('updatePmRule error', err);
        return res.status(500).json({ message: 'Failed to update PM rule' });
    }
}
exports.updatePmRule = updatePmRule;
async function deletePmRule(req, res) {
    try {
        const id = Number(req.params.id);
        await ormconfig_1.AppDataSource.manager.query(`DELETE FROM pm_rules WHERE id = $1`, [id]);
        return res.json({ message: 'deleted' });
    }
    catch (err) {
        console.error('deletePmRule error', err);
        return res.status(500).json({ message: 'Failed to delete PM rule' });
    }
}
exports.deletePmRule = deletePmRule;
exports.default = { listPmRules, getPmRule, createPmRule, updatePmRule, deletePmRule };
