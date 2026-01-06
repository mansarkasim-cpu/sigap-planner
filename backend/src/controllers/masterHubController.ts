import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { MasterHub } from '../entities/MasterHub';

export async function listHubs(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(MasterHub);
    const search = (req.query.q as string) || '';
    const page = Number(req.query.page || 0);
    const pageSize = Number(req.query.pageSize || 0);

    const qb = repo.createQueryBuilder('h').orderBy('h.id','ASC');
    if (search) qb.where('(h.name ILIKE :q OR h.kode ILIKE :q)', { q: `%${search}%` });

    if (page > 0 && pageSize > 0) {
      const offset = (page - 1) * pageSize;
      const [rows, total] = await qb.skip(offset).take(pageSize).getManyAndCount();
      return res.json({ data: rows, meta: { page, pageSize, total } });
    }

    const rows = await qb.getMany();
    return res.json(rows);
  } catch (err) {
    console.error('listHubs error', err);
    return res.status(500).json({ message: 'Failed to list hubs' });
  }
}

export async function getHub(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterHub);
    const row = await repo.findOneBy({ id });
    if (!row) return res.status(404).json({ message: 'not found' });
    return res.json(row);
  } catch (err) {
    console.error('getHub error', err);
    return res.status(500).json({ message: 'Failed to get hub' });
  }
}

export async function createHub(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(MasterHub);
    const payload = req.body || {};
    if (!payload.name || String(payload.name).trim() === '') return res.status(400).json({ message: 'name is required' });
    const ent = repo.create({
      code: payload.code,
      name: String(payload.name).trim(),
      description: payload.description,
    });
    const saved = await repo.save(ent);
    return res.status(201).json(saved);
  } catch (err) {
    console.error('createHub error', err);
    return res.status(500).json({ message: 'Failed to create hub', detail: err instanceof Error ? err.message : err });
  }
}

export async function updateHub(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterHub);
    await repo.update({ id }, req.body || {});
    const row = await repo.findOneBy({ id });
    return res.json(row);
  } catch (err) {
    console.error('updateHub error', err);
    return res.status(500).json({ message: 'Failed to update hub' });
  }
}

export async function deleteHub(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterHub);
    await repo.delete({ id });
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('deleteHub error', err);
    return res.status(500).json({ message: 'Failed to delete hub' });
  }
}
