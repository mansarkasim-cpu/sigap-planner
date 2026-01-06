import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { MasterAlat } from '../entities/MasterAlat';
import { MasterJenisAlat } from '../entities/MasterJenisAlat';
import { MasterSite } from '../entities/MasterSite';

export async function listAlats(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(MasterAlat);
    const search = (req.query.q as string) || '';
    const page = Number(req.query.page || 0);
    const pageSize = Number(req.query.pageSize || 0);
    const siteId = req.query.site_id ? Number(req.query.site_id) : undefined;
    const jenisId = req.query.jenis_alat_id ? Number(req.query.jenis_alat_id) : undefined;

    const qb = repo.createQueryBuilder('a')
      .leftJoinAndSelect('a.jenis_alat','jenis')
      .leftJoinAndSelect('a.site','site')
      .orderBy('a.id','ASC');

    if (search) {
      qb.where('(a.nama ILIKE :q OR a.kode ILIKE :q OR a.serial_no ILIKE :q OR jenis.nama ILIKE :q OR site.name ILIKE :q)', { q: `%${search}%` });
    }

    if (siteId !== undefined) {
      if (search) qb.andWhere('site.id = :siteId', { siteId });
      else qb.where('site.id = :siteId', { siteId });
    }

    if (jenisId !== undefined) {
      if (search || siteId !== undefined) qb.andWhere('jenis.id = :jenisId', { jenisId });
      else qb.where('jenis.id = :jenisId', { jenisId });
    }

    if (page > 0 && pageSize > 0) {
      const offset = (page - 1) * pageSize;
      const [rows, total] = await qb.skip(offset).take(pageSize).getManyAndCount();
      return res.json({ data: rows, meta: { page, pageSize, total } });
    }

    const rows = await qb.getMany();
    return res.json(rows);
  } catch (err) {
    console.error('listAlats error', err);
    return res.status(500).json({ message: 'Failed to list alats' });
  }
}

export async function getAlat(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterAlat);
    const row = await repo.findOne({ where: { id }, relations: ['jenis_alat','site'] });
    if (!row) return res.status(404).json({ message: 'not found' });
    return res.json(row);
  } catch (err) {
    console.error('getAlat error', err);
    return res.status(500).json({ message: 'Failed to get alat' });
  }
}

export async function createAlat(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(MasterAlat);
    const payload = req.body || {};
    if (!payload.nama || String(payload.nama).trim() === '') return res.status(400).json({ message: 'nama is required' });
    if (!payload.jenis_alat_id) return res.status(400).json({ message: 'jenis_alat_id is required' });
    const ent = repo.create({
      nama: String(payload.nama).trim(),
      kode: payload.kode,
      serial_no: payload.serial_no,
      jenis_alat: payload.jenis_alat_id ? ({ id: payload.jenis_alat_id } as MasterJenisAlat) : undefined,
      site: payload.site_id ? ({ id: payload.site_id } as MasterSite) : undefined,
      notes: payload.notes,
    });
    const saved = await repo.save(ent);
    return res.status(201).json(saved);
  } catch (err) {
    console.error('createAlat error', err);
    return res.status(500).json({ message: 'Failed to create alat', detail: err instanceof Error ? err.message : err });
  }
}

export async function updateAlat(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterAlat);
    const payload = req.body || {};
    const update: any = { ...payload };
    if (payload.jenis_alat_id !== undefined) {
      update.jenis_alat = payload.jenis_alat_id ? ({ id: payload.jenis_alat_id } as MasterJenisAlat) : null;
      delete update.jenis_alat_id;
    }
    if (payload.site_id !== undefined) {
      update.site = payload.site_id ? ({ id: payload.site_id } as MasterSite) : null;
      delete update.site_id;
    }
    await repo.update({ id }, update);
    const row = await repo.findOne({ where: { id }, relations: ['jenis_alat','site'] });
    return res.json(row);
  } catch (err) {
    console.error('updateAlat error', err);
    return res.status(500).json({ message: 'Failed to update alat' });
  }
}

export async function deleteAlat(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(MasterAlat);
    await repo.delete({ id });
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('deleteAlat error', err);
    return res.status(500).json({ message: 'Failed to delete alat' });
  }
}
