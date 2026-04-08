"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkOrdersForAlat = exports.unassignWorkOrder = exports.assignWorkOrder = exports.runPmNow = exports.getPMCalendar = void 0;
const ormconfig_1 = require("../ormconfig");
const pmService_1 = __importDefault(require("../services/pmService"));
async function getPMCalendar(req, res) {
    try {
        const limit = Math.max(1, Number(req.query.limit || 200));
        const rows = await ormconfig_1.AppDataSource.manager.query(`SELECT es.*, m.kode AS kode_alat, m.nama AS nama_alat, m.kode_alias AS kode_alias, m.jenis_alat_id, m.site_id AS site_id,
         COALESCE(es.chosen_kode_rule,
           (SELECT pr.kode_rule FROM pm_history ph JOIN pm_rules pr ON pr.id = ph.pm_rule_id WHERE ph.alat_id = es.alat_id ORDER BY ph.performed_at DESC LIMIT 1)
         ) AS last_kode_rule,
         -- Prefer any workorder explicitly assigned on equipment_status (es.work_order_id / es.workorder_doc_no),
         -- fallback to searching recent work_order by asset_id when available.
         COALESCE(
           (SELECT wo.status FROM work_order wo WHERE wo.id = es.work_order_id LIMIT 1),
           (SELECT wo.status FROM work_order wo WHERE wo.asset_id = m.id ORDER BY wo.created_at DESC LIMIT 1)
         ) AS workorder_status,
         COALESCE(
           es.workorder_doc_no,
           (SELECT wo.doc_no FROM work_order wo WHERE wo.asset_id = m.id ORDER BY wo.created_at DESC LIMIT 1)
         ) AS workorder_doc_no
       FROM equipment_status es
       JOIN master_alat m ON m.id = es.alat_id
       WHERE es.next_pm_engine_hour IS NOT NULL
         AND (
           EXISTS (SELECT 1 FROM pm_history ph WHERE ph.alat_id = es.alat_id)
           OR EXISTS (SELECT 1 FROM daily_equipment_hour_meter d WHERE d.alat_id = es.alat_id)
         )
       ORDER BY es.next_pm_engine_hour ASC
       LIMIT $1`, [limit]);
        // compute PM label for each row
        function pmLabelForEngine(nextEngine) {
            if (nextEngine == null)
                return null;
            const n = Number(nextEngine);
            if (isNaN(n))
                return null;
            const cycle = 1000;
            const step = (n % 500 === 0) ? 500 : 250;
            let pos = n % cycle;
            if (pos === 0)
                pos = cycle;
            const labelVal = Math.ceil(pos / step) * step;
            return `PM${labelVal}`;
        }
        for (const r of rows) {
            // prefer last recorded rule kode if available (keeps label consistent with rules),
            // otherwise fall back to computed label based on engine hour
            if (r.last_kode_rule)
                r.pm_label = r.last_kode_rule;
            else
                r.pm_label = pmLabelForEngine(r.next_pm_engine_hour);
        }
        return res.json({ data: rows });
    }
    catch (err) {
        console.error('getPMCalendar error', err);
        return res.status(500).json({ message: 'Failed to fetch PM calendar' });
    }
}
exports.getPMCalendar = getPMCalendar;
async function runPmNow(req, res) {
    try {
        const out = await pmService_1.default.updateEquipmentStatusAll();
        return res.json({ message: 'PM update started', updated: out.length, details: out.slice(0, 200) });
    }
    catch (err) {
        console.error('runPmNow error', err);
        return res.status(500).json({ message: 'Failed to run PM update' });
    }
}
exports.runPmNow = runPmNow;
async function assignWorkOrder(req, res) {
    try {
        const alatId = Number(req.params.alat_id);
        if (!alatId)
            return res.status(400).json({ message: 'alat_id required' });
        const { work_order_id, workorder_doc_no } = req.body || {};
        // Accept either work_order_id (uuid) or workorder_doc_no (string). Update equipment_status.
        await ormconfig_1.AppDataSource.manager.query(`INSERT INTO equipment_status (alat_id, work_order_id, workorder_doc_no, updated_at, created_at)
       VALUES ($1, $2, $3, now(), now())
       ON CONFLICT (alat_id) DO UPDATE SET
         work_order_id = EXCLUDED.work_order_id,
         workorder_doc_no = EXCLUDED.workorder_doc_no,
         updated_at = now();`, [alatId, work_order_id || null, workorder_doc_no || null]);
        // Optionally, update workorder_status via join later; for now return success
        return res.json({ message: 'Assigned workorder to equipment status' });
    }
    catch (err) {
        console.error('assignWorkOrder error', err);
        return res.status(500).json({ message: 'Failed to assign workorder' });
    }
}
exports.assignWorkOrder = assignWorkOrder;
async function unassignWorkOrder(req, res) {
    try {
        const alatId = Number(req.params.alat_id);
        if (!alatId)
            return res.status(400).json({ message: 'alat_id required' });
        await ormconfig_1.AppDataSource.manager.query(`UPDATE equipment_status SET work_order_id = NULL, workorder_doc_no = NULL, updated_at = now() WHERE alat_id = $1`, [alatId]);
        return res.json({ message: 'Unassigned workorder from equipment status' });
    }
    catch (err) {
        console.error('unassignWorkOrder error', err);
        return res.status(500).json({ message: 'Failed to unassign workorder' });
    }
}
exports.unassignWorkOrder = unassignWorkOrder;
async function getWorkOrdersForAlat(req, res) {
    try {
        const alatId = Number(req.params.alat_id);
        if (!alatId)
            return res.status(400).json({ message: 'alat_id required' });
        const limit = Math.max(1, Number(req.query.limit || 100));
        // Try to locate master_alat name/code for additional matching
        const alatRows = await ormconfig_1.AppDataSource.manager.query(`SELECT id, nama, kode FROM master_alat WHERE id = $1 LIMIT 1`, [alatId]);
        const alat = alatRows && alatRows.length ? alatRows[0] : null;
        const alatName = alat ? String(alat.nama || '') : '';
        // Find work orders that look like PM and relate to this asset.
        // Match by asset_id OR asset_name containing master_alat.nama OR raw->>'asset' containing the name.
        const rows = await ormconfig_1.AppDataSource.manager.query(`SELECT id, doc_no, asset_id, asset_name, work_type, type_work, status, start_date, end_date, raw
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
       LIMIT $3`, [alatId, alatName, limit]);
        return res.json({ data: rows });
    }
    catch (err) {
        console.error('getWorkOrdersForAlat error', err);
        return res.status(500).json({ message: 'Failed to list workorders for alat' });
    }
}
exports.getWorkOrdersForAlat = getWorkOrdersForAlat;
exports.default = { getPMCalendar, runPmNow };
