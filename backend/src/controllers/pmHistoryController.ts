import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import pmService from '../services/pmService';

export async function listPmHistory(req: Request, res: Response) {
  try {
    const limit = Math.max(1, Number(req.query.limit || 200));
    const where: string[] = [];
    const params: any[] = [];
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
    const rows = await AppDataSource.manager.query(sql, params);
    return res.json({ data: rows });
  } catch (err) {
    const e: any = err;
    console.error('listPmHistory error', e && e.stack ? e.stack : e);
    return res.status(500).json({ message: 'Failed to list PM history' });
  }
}

export async function createPmHistory(req: Request, res: Response) {
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
    const ruleRows: any[] = await AppDataSource.manager.query(`SELECT interval_hours, multiplier FROM pm_rules WHERE id = $1`, [pm_rule_id]);
    const rule = ruleRows && ruleRows.length ? ruleRows[0] : null;
    let next_due_engine_hour: number | null = null;
    if (rule) {
      const interval = Number(rule.interval_hours) || 0;
      const multiplier = Number(rule.multiplier) || 1;
      const effective = Math.max(1, interval * multiplier);
      next_due_engine_hour = Number(engine_hour) + effective;
    }

    const insertSql = `INSERT INTO pm_history (alat_id, pm_rule_id, performed_by, performed_at, engine_hour, next_due_engine_hour, notes, workorder_no, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now(), now()) RETURNING *`;
    const params = [alat_id, pm_rule_id, performed_by, performed_at, engine_hour, next_due_engine_hour, notes, workorder_no];
    const inserted = await AppDataSource.manager.query(insertSql, params);

    // Clear any assigned workorder on equipment_status for this alat (user just performed PM)
    try {
      await AppDataSource.manager.query(`UPDATE equipment_status SET work_order_id = NULL, workorder_doc_no = NULL, updated_at = now() WHERE alat_id = $1`, [alat_id]);
    } catch (e) {
      console.error('failed to clear equipment_status workorder after pm_history insert', e);
    }

    // refresh equipment status for this alat only
    try { await pmService.updateEquipmentStatusAll([Number(alat_id)]); } catch (e) { console.error('pm update after history insert failed', e); }

    return res.json({ data: inserted && inserted[0] ? inserted[0] : inserted });
  } catch (err) {
    console.error('createPmHistory error', err);
    return res.status(500).json({ message: 'Failed to create PM history' });
  }
}

export default { listPmHistory, createPmHistory };
