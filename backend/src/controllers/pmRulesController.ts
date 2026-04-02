import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';

export async function listPmRules(req: Request, res: Response) {
  try {
    const where: string[] = [];
    const params: any[] = [];
    let idx = 1;
    if (req.query.jenis_alat_id) { where.push(`jenis_alat_id = $${idx++}`); params.push(req.query.jenis_alat_id); }
    if (req.query.alat_id) { where.push(`alat_id = $${idx++}`); params.push(req.query.alat_id); }
    const whereSql = where.length ? ('WHERE ' + where.join(' AND ')) : '';
    const sql = `SELECT * FROM pm_rules ${whereSql} ORDER BY id DESC LIMIT 1000`;
    const rows = await AppDataSource.manager.query(sql, params);
    return res.json({ data: rows });
  } catch (err) {
    console.error('listPmRules error', err);
    return res.status(500).json({ message: 'Failed to list PM rules' });
  }
}

export async function getPmRule(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const rows = await AppDataSource.manager.query(`SELECT * FROM pm_rules WHERE id = $1 LIMIT 1`, [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ message: 'Not found' });
    return res.json({ data: rows[0] });
  } catch (err) {
    console.error('getPmRule error', err);
    return res.status(500).json({ message: 'Failed to get PM rule' });
  }
}

export async function createPmRule(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const r = await AppDataSource.manager.query(
      `INSERT INTO pm_rules (kode_rule, description, jenis_alat_id, alat_id, interval_hours, multiplier, start_engine_hour, active, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now(), now()) RETURNING *`,
      [body.kode_rule || null, body.description || null, body.jenis_alat_id || null, body.alat_id || null, body.interval_hours || 0, body.multiplier || 1, body.start_engine_hour || 0, body.active === false ? false : true]
    );
    return res.status(201).json({ data: r[0] });
  } catch (err) {
    console.error('createPmRule error', err);
    return res.status(500).json({ message: 'Failed to create PM rule' });
  }
}

export async function updatePmRule(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const body = req.body || {};
    const r = await AppDataSource.manager.query(
      `UPDATE pm_rules SET kode_rule=$1, description=$2, jenis_alat_id=$3, alat_id=$4, interval_hours=$5, multiplier=$6, start_engine_hour=$7, active=$8, updated_at=now() WHERE id=$9 RETURNING *`,
      [body.kode_rule || null, body.description || null, body.jenis_alat_id || null, body.alat_id || null, body.interval_hours || 0, body.multiplier || 1, body.start_engine_hour || 0, body.active === false ? false : true, id]
    );
    if (!r || r.length === 0) return res.status(404).json({ message: 'Not found' });
    return res.json({ data: r[0] });
  } catch (err) {
    console.error('updatePmRule error', err);
    return res.status(500).json({ message: 'Failed to update PM rule' });
  }
}

export async function deletePmRule(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await AppDataSource.manager.query(`DELETE FROM pm_rules WHERE id = $1`, [id]);
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('deletePmRule error', err);
    return res.status(500).json({ message: 'Failed to delete PM rule' });
  }
}

export default { listPmRules, getPmRule, createPmRule, updatePmRule, deletePmRule };
