import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { AppDataSource } from '../ormconfig';
import { User } from '../entities/User';

const repo = () => AppDataSource.getRepository(User);

function parseWorkbook(filePath: string) {
  const wb = XLSX.readFile(filePath);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { defval: null });
  return data as any[];
}

// Expected columns: name, nipp, email, role, site, password (password optional)
export async function importUsersFromFile(req: Request, res: Response) {
  try {
    // multer should put file in req.file
    const file = (req as any).file;
    if (!file) return res.status(400).json({ message: 'file required' });

    const tmpPath = file.path;
    console.log('[IMPORT] received file:', file.originalname, '->', tmpPath);
    if (!fs.existsSync(tmpPath)) {
      console.warn('[IMPORT] temp file does not exist:', tmpPath);
      return res.status(500).json({ message: 'Uploaded file missing on server' });
    }
    const rows = parseWorkbook(tmpPath);
    console.log('[IMPORT] parsed rows count:', rows?.length ?? 0);

    const results: Array<{ row: number; status: 'created'|'updated'|'skipped'|'error'; message?: string; id?: string }> = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const rowNum = i + 2; // assume header on row 1
      const name = r.name ?? r.Name ?? null;
      const nipp = r.nipp ?? r.NIPP ?? r.Nip ?? null;
      const email = r.email ?? r.Email ?? null;
      const role = r.role ?? r.Role ?? 'technician';
      const site = r.site ?? r.Site ?? null;
      const password = r.password ?? r.Password ?? null;

      if (!name || !nipp) {
        results.push({ row: rowNum, status: 'skipped', message: 'name or nipp missing' });
        continue;
      }
      if (!/^[0-9]{1,15}$/.test(String(nipp))) {
        results.push({ row: rowNum, status: 'error', message: 'nipp must be numeric and <=15' });
        continue;
      }

      try {
        console.log(`[IMPORT] processing row ${rowNum}: nipp=${nipp}, name=${name}`);
        const existing = await repo().findOneBy({ nipp } as any);
        if (existing) {
          // update existing
          existing.name = name ?? existing.name;
          existing.email = email ?? existing.email;
          existing.role = role ?? existing.role;
          existing.site = site ?? existing.site;
          if (password) existing.password = password;
          const saved = await repo().save(existing as any);
          console.log('[IMPORT] updated user id=', (saved as any).id);
          results.push({ row: rowNum, status: 'updated', id: (saved as any).id });
        } else {
          const u = repo().create({ name, nipp, email: email ?? undefined, role, site, password } as any);
          const saved = await repo().save(u as any);
          console.log('[IMPORT] created user id=', (saved as any).id);
          results.push({ row: rowNum, status: 'created', id: (saved as any).id });
        }
      } catch (err: any) {
        console.error('[IMPORT] error processing row', rowNum, err);
        results.push({ row: rowNum, status: 'error', message: String(err?.message || err) });
      }
    }

    // cleanup temp file
    try { fs.unlinkSync(tmpPath); } catch (e) {}

    return res.json({ message: 'import completed', results });
  } catch (err: any) {
    console.error('importUsersFromFile error', err);
    return res.status(500).json({ message: 'Failed to import', detail: err?.message || err });
  }
}
