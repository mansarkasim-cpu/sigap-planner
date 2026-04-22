import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { MasterAlat } from '../entities/MasterAlat';
import { MasterJenisAlat } from '../entities/MasterJenisAlat';
import { MasterSite } from '../entities/MasterSite';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

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
      // default sort by equipment name
      .orderBy('a.nama','ASC');

    if (search) {
      qb.where('(a.nama ILIKE :q OR a.kode ILIKE :q OR a.serial_no ILIKE :q OR a.kode_alias ILIKE :q OR jenis.nama ILIKE :q OR site.name ILIKE :q)', { q: `%${search}%` });
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
    // ignore any client-supplied id to avoid duplicate-pkey inserts
    if (payload.id !== undefined) {
      console.warn('createAlat: client supplied id ignored', payload.id);
      delete payload.id;
    }
    if (!payload.nama || String(payload.nama).trim() === '') return res.status(400).json({ message: 'nama is required' });
    if (!payload.jenis_alat_id) return res.status(400).json({ message: 'jenis_alat_id is required' });
    const ent = repo.create({
      nama: String(payload.nama).trim(),
      kode: payload.kode,
      kode_alias: payload.kode_alias,
      serial_no: payload.serial_no,
      jenis_alat: payload.jenis_alat_id ? ({ id: payload.jenis_alat_id } as MasterJenisAlat) : undefined,
      site: payload.site_id ? ({ id: payload.site_id } as MasterSite) : undefined,
      notes: payload.notes,
      status: payload.status ? String(payload.status) : 'ACTIVE',
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

export async function importAlats(req: Request, res: Response) {
  try {
    // multer should have placed file in req.file
    const fileAny: any = (req as any).file;
    if (!fileAny) return res.status(400).json({ message: 'file is required' });
    const path = fileAny.path;
    const wb = XLSX.readFile(path);
    const sheetNames = wb.SheetNames || [];
    if (sheetNames.length === 0) return res.status(400).json({ message: 'empty workbook' });
    const first = wb.Sheets[sheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(first, { defval: '' });

    const repo = AppDataSource.getRepository(MasterAlat);
    const jenisRepo = AppDataSource.getRepository(MasterJenisAlat);
    const siteRepo = AppDataSource.getRepository(MasterSite);

    const results: { created: number; skipped: number; errors: any[] } = { created: 0, skipped: 0, errors: [] };

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      try {
        // support flexible column names (lowercase)
        const get = (keys: string[]) => {
          for (const k of keys) {
            if (r[k] !== undefined) return r[k];
          }
          // try lowercase
          for (const k of Object.keys(r)) {
            if (keys.includes(k.toLowerCase())) return r[k];
          }
          return undefined;
        };

        const nama = get(['nama','name']) || get(['Nama','Name']) || '';
        if (!nama || String(nama).trim() === '') { results.skipped++; continue }
        const kode = get(['kode','code']) || get(['Kode','Code']) || undefined;
        const kode_alias = get(['kode_alias','kodealias','alias']) || undefined;
        const serial_no = get(['serial_no','serial','serialno']) || undefined;
        const jenisVal = get(['jenis','jenis_alat','jenis_alat_id']) || undefined;
        const siteVal = get(['site','site_id','site_name']) || undefined;
        const notes = get(['notes','note']) || undefined;
        const status = get(['status']) || 'ACTIVE';

        let jenis_alat = undefined;
        if (jenisVal) {
          // try numeric id
          const num = Number(jenisVal);
          if (!isNaN(num) && num > 0) {
            jenis_alat = await jenisRepo.findOne({ where: { id: num } });
          }
          if (!jenis_alat) {
            // try by name
            jenis_alat = await jenisRepo.findOne({ where: { nama: String(jenisVal) } });
          }
        }

        let site = undefined;
        if (siteVal) {
          const num = Number(siteVal);
          if (!isNaN(num) && num > 0) {
            site = await siteRepo.findOne({ where: { id: num } });
          }
          if (!site) {
            site = await siteRepo.findOne({ where: { name: String(siteVal) } });
          }
        }

        const ent = repo.create({ nama: String(nama).trim(), kode, kode_alias, serial_no, jenis_alat: jenis_alat || undefined, site: site || undefined, notes, status: status || 'ACTIVE' });
        await repo.save(ent);
        results.created++;
      } catch (e) {
        results.errors.push({ row: i+1, error: e instanceof Error ? e.message : e });
      }
    }

    // clean up uploaded file
    try { fs.unlinkSync(path); } catch (e) { /* ignore */ }

    // Include debug info to help troubleshooting empty imports
    const preview = rows.slice(0, 10);
    console.info('importAlats: parsedRows=', rows.length, 'created=', results.created, 'skipped=', results.skipped);
    if (preview.length > 0) console.info('importAlats: preview row 1 keys=', Object.keys(preview[0]));

    return res.json({ message: 'import complete', results, parsedCount: rows.length, preview });
  } catch (err) {
    console.error('importAlats error', err);
    return res.status(500).json({ message: 'Failed to import alats', detail: err instanceof Error ? err.message : err });
  }
}
