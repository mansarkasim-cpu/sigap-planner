import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../ormconfig';
import { DailyChecklist } from '../entities/DailyChecklist';
import { MasterChecklistQuestion } from '../entities/MasterChecklistQuestion';
import { DailyChecklistItem } from '../entities/DailyChecklistItem';
import { User } from '../entities/User';

function isLikelyLocalPath(p: any) {
  if (!p) return false;
  const s = String(p).trim();
  // Windows absolute path e.g. C:\ or C:/, UNC \\server\path, POSIX /path, or file://
  if (/^[A-Za-z]:\\\\|^[A-Za-z]:\//.test(s)) return true;
  if (s.startsWith('\\\\')) return true;
  if (s.startsWith('/')) return true;
  if (s.startsWith('file://')) return true;
  return false;
}

export async function submitChecklist(req: Request, res: Response) {
  const payload = req.body || {};
  // console.debug(`payload test ${JSON.stringify(payload)}`);
  const { alat_id, teknisi_id, teknisi_name, performed_at, site_id, notes, latitude, longitude, items } = payload;

  // basic validation: alat_id and items required; teknisi can be inferred from token for technicians
  const user = (req as any).user || undefined;
  const resolvedTeknisiId = teknisi_id ?? (user && user.nipp ? Number(user.nipp) : undefined);
  // Prefer the explicit payload value first.
  // Then prefer the JWT user's `name` if present. If JWT only has `nipp`, try DB lookup by nipp to get the real name.
  let resolvedTeknisiName: any = teknisi_name;
  let teknisiNameSource = teknisi_name ? 'payload' : null;
  if (!resolvedTeknisiName && user) {
    try {
      const uRepo = AppDataSource.getRepository(User);
      // if JWT contains a proper name, use it
      if (user.name && String(user.name).trim() !== '') {
        resolvedTeknisiName = user.name;
        teknisiNameSource = 'jwt_name';
      } else if (user.email && String(user.email).trim() !== '') {
        resolvedTeknisiName = user.email;
        teknisiNameSource = 'jwt_email';
      } else if (user.nipp) {
        // try to resolve via DB using nipp first
        let fullUser: any = null;
        try {
          fullUser = await uRepo.findOne({ where: { nipp: String(user.nipp) } as any });
        } catch (_) {}
        if (!fullUser && user.id) {
          try { fullUser = await uRepo.findOne({ where: { id: user.id } as any }); } catch (_) {}
        }
        if (fullUser && fullUser.name) {
          resolvedTeknisiName = fullUser.name;
          teknisiNameSource = 'db_name';
        } else {
          // fallback to JWT nipp if DB lookup didn't return a proper name
          resolvedTeknisiName = user.nipp;
          teknisiNameSource = 'jwt_nipp';
        }
      }
    } catch (e) {
      console.error('failed to resolve user name', e);
    }
  }
  // Log which value will be used for teknisi_name for audit/debug
  try {
    const who = user ? (user.id ?? user.nipp ?? '<unknown>') : '<anonymous>';
    console.info(`submitChecklist: resolved teknisi_name for user=${who} => "${resolvedTeknisiName ?? '<null>'}" (source=${teknisiNameSource ?? '<unknown>'})`);
  } catch (e) {
    console.debug('submitChecklist logging failed', e);
  }

  if (!alat_id || !Array.isArray(items)) {
    return res.status(400).json({ message: 'alat_id and items array are required' });
  }

  // server-side validation: ensure required questions have answers
  try {
    const qIds = Array.from(new Set(items.map((it: any) => Number(it.question_id)).filter((v: any) => !!v)));
    if (qIds.length > 0) {
      const qRepo = AppDataSource.getRepository(MasterChecklistQuestion);
      const qs = await qRepo.createQueryBuilder('q').where('q.id IN (:...ids)', { ids: qIds }).getMany();
      const qmap: Record<number, any> = {};
      for (const q of qs) qmap[(q as any).id] = q;

      for (const it of items) {
        // support base64 photo payload similar to realisasi flow: save to uploads and generate public URL
        // start with null to avoid persisting client-local absolute paths
        let evidencePhotoUrl: string | null = null
        let evidencePhotoPath: string | null = null
        // normalize client-provided paths: accept only non-local (public) paths
        const rawClientPath = it.evidence_photo_path || it.evidence_photo || null
        const cleanedClientPath = rawClientPath && !isLikelyLocalPath(rawClientPath) ? rawClientPath : null
        if (cleanedClientPath) evidencePhotoPath = cleanedClientPath
        try {
          if (it.evidence_photo_base64) {
            const buf = Buffer.from(it.evidence_photo_base64, 'base64')
            const filename = `checklist_${Date.now()}_${uuidv4()}.jpg`
            // Save under backend/uploads as requested
            const filepath = path.resolve(process.cwd(), 'backend', 'uploads', filename)
            fs.mkdirSync(path.dirname(filepath), { recursive: true })
            fs.writeFileSync(filepath, buf)
            try { fs.chmodSync(filepath, 0o644); } catch (e) { console.error('chmod failed:', e); }
            const baseForUploads = process.env.S3_PUBLIC_BASE || `${req.protocol}://${req.get('host')}`
            // public URL remains /uploads/<filename> — app.ts serves backend/uploads as one candidate
            const publicUrl = baseForUploads.endsWith('/') ? `${baseForUploads}uploads/${filename}` : `${baseForUploads}/uploads/${filename}`
            evidencePhotoUrl = publicUrl
            evidencePhotoPath = `backend/uploads/${filename}`
          }
        } catch (e) {
          console.error('failed to write evidence photo', e)
        }
        const qid = Number(it.question_id);
        const q = qmap[qid];
        if (!q) continue;
        const required = (q as any).required === true || (q as any).required === '1';
        if (!required) continue;
        const qtype = (q as any).input_type || 'boolean';
        let hasAnswer = false;
        if (qtype === 'number') {
          hasAnswer = it.answer_number !== undefined && it.answer_number !== null;
        } else if (qtype === 'select' || qtype === 'multiselect') {
          hasAnswer = (it.option_id !== undefined && it.option_id !== null) || (it.answer_text !== undefined && it.answer_text !== null && String(it.answer_text).trim() !== '');
        } else {
          hasAnswer = it.answer_text !== undefined && it.answer_text !== null && String(it.answer_text).trim() !== '';
        }
        if (!hasAnswer) {
          return res.status(400).json({ message: `Missing required answer for question ${qid}` });
        }
        // if boolean answer is false, ensure evidence present
        if (qtype === 'boolean') {
          const ans = String(it.answer_text || '').toLowerCase();
          if (ans == 'false' || ans == '0') {
            const hasEvidenceProvided = Boolean(
              (it.evidence_note && String(it.evidence_note).trim() !== '') ||
              (it.evidence_photo_base64) ||
              (it.evidence_photo_url && !isLikelyLocalPath(it.evidence_photo_url)) ||
              (it.evidence_photo_path && !isLikelyLocalPath(it.evidence_photo_path)) ||
              (it.evidence_photo && !isLikelyLocalPath(it.evidence_photo))
            );
            if (!hasEvidenceProvided) {
              return res.status(400).json({ message: `Evidence required when answering 'No' for question ${qid}` });
            }
          }
        }
      }
    }
  } catch (ve) {
    console.error('validation error', ve);
    return res.status(400).json({ message: 'Validation failed', detail: ve instanceof Error ? ve.message : ve });
  }

  const conn = AppDataSource.manager;
  try {
    return await AppDataSource.transaction(async (tx) => {
      const dcRepo = tx.getRepository(DailyChecklist);
      const itemRepo = tx.getRepository(DailyChecklistItem);

      const dc = dcRepo.create({
        alat: { id: alat_id } as any,
        teknisi_id: resolvedTeknisiId !== undefined ? Number(resolvedTeknisiId) : undefined,
        teknisi_name: resolvedTeknisiName,
        performed_at: performed_at ? new Date(performed_at) : new Date(),
        site: site_id ? ({ id: site_id } as any) : undefined,
        notes: notes,
        latitude: latitude,
        longitude: longitude,
      });

      const savedDc = await dcRepo.save(dc);

      const createdItems: DailyChecklistItem[] = [];
      for (const it of items) {
        // ensure we don't default to client local paths
        let evidencePhotoUrl: string | null = null
        let evidencePhotoPath: string | null = null
        try {
          // If client sent base64 during creation, save it here (validation earlier may have saved a temp copy,
          // but we must persist again for the actual saved item so DB gets the path/url).
          if (it.evidence_photo_base64) {
            try {
              const buf = Buffer.from(it.evidence_photo_base64, 'base64')
              const filename = `checklist_${Date.now()}_${uuidv4()}.jpg`
              const filepath = path.resolve(process.cwd(), 'backend', 'uploads', filename)
              fs.mkdirSync(path.dirname(filepath), { recursive: true })
              fs.writeFileSync(filepath, buf)
              try { fs.chmodSync(filepath, 0o644); } catch (e) { console.error('chmod failed:', e); }
              const baseForUploads = process.env.S3_PUBLIC_BASE || `${req.protocol}://${req.get('host')}`
              const publicUrl = baseForUploads.endsWith('/') ? `${baseForUploads}uploads/${filename}` : `${baseForUploads}/uploads/${filename}`
              evidencePhotoUrl = publicUrl
              evidencePhotoPath = `backend/uploads/${filename}`
            } catch (e) {
              console.error('failed to write evidence photo (creation)', e)
            }
          }
          // prefer server-saved base64 => otherwise accept only non-local client paths (already uploaded)
          const rawClientPath2 = it.evidence_photo_path || it.evidence_photo || null
          const cleanedClientPath2 = rawClientPath2 && !isLikelyLocalPath(rawClientPath2) ? rawClientPath2 : null
          if (cleanedClientPath2 && !evidencePhotoPath) evidencePhotoPath = cleanedClientPath2
        } catch (e) {
          console.error('failed to write evidence photo', e)
        }
        const fallbackPhotoUrl = (it.evidence_photo_url && !isLikelyLocalPath(it.evidence_photo_url)) ? it.evidence_photo_url : ((it.evidence_photo && !isLikelyLocalPath(it.evidence_photo)) ? it.evidence_photo : null);
        const fallbackPhotoPath = (it.evidence_photo_path && !isLikelyLocalPath(it.evidence_photo_path)) ? it.evidence_photo_path : ((it.evidence_photo && !isLikelyLocalPath(it.evidence_photo)) ? it.evidence_photo : null);
        const item = itemRepo.create({
          daily_checklist: { id: (savedDc as any).id } as any,
          question: it.question_id ? ({ id: it.question_id } as any) : undefined,
          option: it.option_id ? ({ id: it.option_id } as any) : undefined,
          answer_text: it.answer_text,
          answer_number: it.answer_number,
          evidence_photo_url: evidencePhotoUrl || fallbackPhotoUrl || null,
          evidence_photo_path: evidencePhotoPath || fallbackPhotoPath || null,
          evidence_note: it.evidence_note || it.evidence_description || null,
        });
        const savedItem = await itemRepo.save(item);
        createdItems.push(savedItem);
      }

      return res.status(201).json({ message: 'created', data: { checklist: savedDc, items: createdItems } });
    });
  } catch (err) {
    console.error('submitChecklist error', err);
    return res.status(500).json({ message: 'Failed to save checklist', detail: err instanceof Error ? err.message : err });
  }
}

export async function listChecklists(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(DailyChecklist);
    const search = (req.query.q as string) || '';
    const page = Number(req.query.page || 0);
    const pageSize = Number(req.query.pageSize || 0);

    const qb = repo.createQueryBuilder('dc')
      .leftJoinAndSelect('dc.alat', 'alat')
      .leftJoinAndSelect('dc.site', 'site')
      .orderBy('dc.performed_at', 'DESC');

    if (search) qb.where('(dc.notes ILIKE :q OR dc.catatan ILIKE :q OR alat.nama ILIKE :q OR site.name ILIKE :q)', { q: `%${search}%` });

    if (page > 0 && pageSize > 0) {
      const offset = (page - 1) * pageSize;
      const [rows, total] = await qb.skip(offset).take(pageSize).getManyAndCount();
      return res.json({ data: rows, meta: { page, pageSize, total } });
    }

    const rows = await qb.limit(100).getMany();
    return res.json(rows);
  } catch (err) {
    console.error('listChecklists error', err);
    return res.status(500).json({ message: 'Failed to list checklists' });
  }
}

export async function listMobileChecklists(req: Request, res: Response) {
  try {
    const repo = AppDataSource.getRepository(DailyChecklist);
    const search = (req.query.q as string) || '';
    const page = Number(req.query.page || 0);
    const pageSize = Number(req.query.pageSize || 0);

    // determine teknisi from token (for technicians)
    const user = (req as any).user || {};
    const userNipp = user.nipp ? Number(user.nipp) : undefined;
    const dateFilter = (req.query.date as string) || '';

    const qb = repo.createQueryBuilder('dc')
      .leftJoinAndSelect('dc.alat', 'alat')
      .leftJoinAndSelect('dc.site', 'site')
      .orderBy('dc.performed_at', 'DESC');

    // if technician, restrict to their records
    if (userNipp) qb.andWhere('dc.teknisi_id = :tid', { tid: userNipp });

    // optional date filter YYYY-MM-DD
    if (dateFilter) {
      qb.andWhere('DATE(dc.performed_at) = :d', { d: dateFilter });
    }

    if (search) qb.andWhere('(dc.notes ILIKE :q OR alat.nama ILIKE :q OR site.name ILIKE :q)', { q: `%${search}%` });

    if (page > 0 && pageSize > 0) {
      const offset = (page - 1) * pageSize;
      const [rows, total] = await qb.skip(offset).take(pageSize).getManyAndCount();
      return res.json({ data: rows, meta: { page, pageSize, total } });
    }

    const rows = await qb.limit(100).getMany();
    return res.json(rows);
  } catch (err) {
    console.error('listMobileChecklists error', err);
    return res.status(500).json({ message: 'Failed to list checklists' });
  }
}

export async function getChecklistById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(DailyChecklist);
    const row = await repo.findOne({ where: { id }, relations: ['alat', 'site'] });
    if (!row) return res.status(404).json({ message: 'not found' });
    const itemRepo = AppDataSource.getRepository(DailyChecklistItem);
    const items = await itemRepo.find({ where: { daily_checklist: { id } }, relations: ['question', 'option'] as any });
    return res.json({ checklist: row, items });
  } catch (err) {
    console.error('getChecklistById error', err);
    return res.status(500).json({ message: 'Failed to get checklist' });
  }
}

export async function getMobileChecklistById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'id required' });
    const repo = AppDataSource.getRepository(DailyChecklist);
    const row = await repo.findOne({ where: { id }, relations: ['alat', 'site'] });
    if (!row) return res.status(404).json({ message: 'not found' });

    // enforce technician can only access their own checklist
    const user = (req as any).user || {};
    const role = (user.role || '').toString();
    const userNipp = user.nipp ? Number(user.nipp) : undefined;
    if (role === 'technician' && userNipp && (row as any).teknisi_id !== undefined) {
      if (Number((row as any).teknisi_id) !== Number(userNipp)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    const itemRepo = AppDataSource.getRepository(DailyChecklistItem);
    const items = await itemRepo.find({ where: { daily_checklist: { id } }, relations: ['question', 'option'] as any });
    return res.json({ checklist: row, items });
  } catch (err) {
    console.error('getMobileChecklistById error', err);
    return res.status(500).json({ message: 'Failed to get checklist' });
  }
}
