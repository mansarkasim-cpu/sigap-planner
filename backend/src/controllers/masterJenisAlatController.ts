import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { MasterJenisAlat } from '../entities/MasterJenisAlat';

export async function listJenis(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(MasterJenisAlat);
    const search = (req.query.q as string) || '';
    const page = Number(req.query.page || 0);
    const pageSize = Number(req.query.pageSize || 0);

    const qb = repo.createQueryBuilder('j').orderBy('j.id','ASC');
    if (search) qb.where('(j.nama ILIKE :q OR j.kode ILIKE :q)', { q: `%${search}%` });

    if (page > 0 && pageSize > 0) {
      const offset = (page - 1) * pageSize;
      const [rows, total] = await qb.skip(offset).take(pageSize).getManyAndCount();
      return res.json({ data: rows, meta: { page, pageSize, total } });
    }

    const rows = await qb.getMany();
    return res.json(rows);
  } catch (err) {
    console.error('listJenis error', err);
    return res.status(500).json({ message: 'Failed to list jenis alat' });
  }
}

export async function getJenis(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterJenisAlat);
    const row = await repo.findOneBy({ id });
    if (!row) return res.status(404).json({ message: 'not found' });
    return res.json(row);
  } catch (err) {
    console.error('getJenis error', err);
    return res.status(500).json({ message: 'Failed to get jenis alat' });
  }
}

export async function createJenis(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(MasterJenisAlat);
    const payload = req.body || {};
    if (!payload.nama || String(payload.nama).trim() === '') return res.status(400).json({ message: 'nama is required' });
    const ent = repo.create({ nama: String(payload.nama).trim(), description: payload.description });
    const saved = await repo.save(ent);
    return res.status(201).json(saved);
  } catch (err) {
    console.error('createJenis error', err);
    return res.status(500).json({ message: 'Failed to create jenis alat', detail: err instanceof Error ? err.message : err });
  }
}

export async function updateJenis(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterJenisAlat);
    await repo.update({ id }, req.body || {});
    const row = await repo.findOneBy({ id });
    return res.json(row);
  } catch (err) {
    console.error('updateJenis error', err);
    return res.status(500).json({ message: 'Failed to update jenis alat' });
  }
}

export async function deleteJenis(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterJenisAlat);
    await repo.delete({ id });
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('deleteJenis error', err);
    return res.status(500).json({ message: 'Failed to delete jenis alat' });
  }
}
