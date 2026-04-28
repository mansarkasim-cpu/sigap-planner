import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';

export async function getSequenceByJenis(req: Request, res: Response) {
  try {
    const jenisId = Number(req.params.jenis_id);
    if (!jenisId) return res.status(400).json({ message: 'jenis_id required' });
    const rows = await AppDataSource.manager.query(
      `SELECT seq_no, pm_rule_id FROM pm_rule_sequence WHERE jenis_alat_id = $1 ORDER BY seq_no ASC`,
      [jenisId]
    );
    return res.json({ data: rows });
  } catch (err) {
    console.error('getSequenceByJenis error', err);
    return res.status(500).json({ message: 'Failed to get sequence by jenis' });
  }
}

export async function saveSequenceByJenis(req: Request, res: Response) {
  try {
    const jenisId = Number(req.params.jenis_id);
    if (!jenisId) return res.status(400).json({ message: 'jenis_id required' });
    const items: Array<{ seq_no: number; pm_rule_id: number }> = req.body.items || [];
    await AppDataSource.manager.transaction(async (tm) => {
      await tm.query(`DELETE FROM pm_rule_sequence WHERE jenis_alat_id = $1`, [jenisId]);
      for (const it of items) {
        await tm.query(`INSERT INTO pm_rule_sequence (jenis_alat_id, seq_no, pm_rule_id, created_at, updated_at) VALUES ($1,$2,$3, now(), now())`, [jenisId, it.seq_no, it.pm_rule_id]);
      }
    });
    return res.json({ message: 'Saved' });
  } catch (err) {
    console.error('saveSequenceByJenis error', err);
    return res.status(500).json({ message: 'Failed to save sequence by jenis' });
  }
}

export async function getSequenceByAlat(req: Request, res: Response) {
  try {
    const alatId = Number(req.params.alat_id);
    if (!alatId) return res.status(400).json({ message: 'alat_id required' });
    const rows = await AppDataSource.manager.query(
      `SELECT seq_no, pm_rule_id FROM pm_rule_sequence_alat WHERE alat_id = $1 ORDER BY seq_no ASC`,
      [alatId]
    );
    return res.json({ data: rows });
  } catch (err) {
    console.error('getSequenceByAlat error', err);
    return res.status(500).json({ message: 'Failed to get sequence by alat' });
  }
}

export async function saveSequenceByAlat(req: Request, res: Response) {
  try {
    const alatId = Number(req.params.alat_id);
    if (!alatId) return res.status(400).json({ message: 'alat_id required' });
    const items: Array<{ seq_no: number; pm_rule_id: number }> = req.body.items || [];
    await AppDataSource.manager.transaction(async (tm) => {
      await tm.query(`DELETE FROM pm_rule_sequence_alat WHERE alat_id = $1`, [alatId]);
      for (const it of items) {
        await tm.query(`INSERT INTO pm_rule_sequence_alat (alat_id, seq_no, pm_rule_id, created_at, updated_at) VALUES ($1,$2,$3, now(), now())`, [alatId, it.seq_no, it.pm_rule_id]);
      }
    });
    return res.json({ message: 'Saved' });
  } catch (err) {
    console.error('saveSequenceByAlat error', err);
    return res.status(500).json({ message: 'Failed to save sequence by alat' });
  }
}

export default { getSequenceByJenis, saveSequenceByJenis, getSequenceByAlat, saveSequenceByAlat };
