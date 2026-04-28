import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { MasterAlat } from '../entities/MasterAlat';
import { DailyChecklist } from '../entities/DailyChecklist';
import { DailyChecklistItem } from '../entities/DailyChecklistItem';
import { DailyEquipmentHourMeter } from '../entities/DailyEquipmentHourMeter';
import { DailyChecklistAssignment } from '../entities/DailyChecklistAssignment';

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  return x;
}

function fmtYMD(d: Date){
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth()+1).padStart(2,'0');
  const day = String(dt.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`
}

export async function weeklyChecklistStatus(req: Request, res: Response) {
  try {
    const siteId = req.query.site_id ? Number(req.query.site_id) : undefined;
    const weekStartQ = (req.query.week_start as string) || '';

    // determine week start (Monday). If week_start provided, use it; else compute current week's Monday.
    let start: Date;
    if (weekStartQ) {
      const parsed = new Date(weekStartQ);
      if (isNaN(parsed.getTime())) return res.status(400).json({ message: 'Invalid week_start' });
      start = startOfDay(parsed);
    } else {
      const now = new Date();
      // get Monday as start
      const day = now.getDay(); // 0 Sun .. 6 Sat
      const diff = (day + 6) % 7; // days since Monday
      start = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff));
    }

    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(fmtYMD(d));
    }

    // load alats for the site (or all alats if no site filter)
    const aRepo = AppDataSource.getRepository(MasterAlat);
    const qb = aRepo.createQueryBuilder('a').leftJoinAndSelect('a.site','site');
    if (siteId) qb.where('site.id = :sid', { sid: siteId });
    const alats = await qb.orderBy('a.nama','ASC').getMany();
    const alatIds = alats.map(a => a.id);
    console.debug('weeklyChecklistStatus alats count=', alats.length, 'ids sample=', alatIds.slice(0,10))
    const checklistRepo = AppDataSource.getRepository(DailyChecklist);
    const startISO = days[0];
    const endISO = days[6];

    let checklists: DailyChecklist[] = [];
    if (alatIds.length > 0) {
      checklists = await checklistRepo.createQueryBuilder('dc')
        .where('dc.alat_id IN (:...ids)', { ids: alatIds })
        .andWhere('DATE(dc.performed_at) BETWEEN :s AND :e', { s: startISO, e: endISO })
        .leftJoinAndSelect('dc.alat', 'alat')
        .getMany();
    }

    console.debug('weeklyChecklistStatus checklists found=', checklists.length)
    if (checklists.length > 0) {
      console.debug('weeklyChecklistStatus sample checklist 0=', { id: (checklists[0] as any).id, alat_id: (checklists[0] as any).alat_id ?? (checklists[0] as any).alat?.id, performed_at: checklists[0].performed_at })
    }

    // Gather checklist IDs and pre-load their items to detect any 'false' answers
    const checklistIds = checklists.map(c => (c as any).id).filter(Boolean);
    const itemsByChecklist: Record<number, any[]> = {};
    if (checklistIds.length > 0) {
      const itemRepo = AppDataSource.getRepository(DailyChecklistItem);
      // Use raw query to ensure we get all columns including answer_text
      const rawItems = await itemRepo.createQueryBuilder('it')
        .select('it.id', 'id')
        .addSelect('it.daily_checklist_id', 'daily_checklist_id')
        .addSelect('it.answer_text', 'answer_text')
        .addSelect('it.answer_number', 'answer_number')
        .where('it.daily_checklist_id IN (:...ids)', { ids: checklistIds })
        .getRawMany();
      
      for (const it of rawItems) {
        const cid = it.daily_checklist_id;
        if (!cid) continue;
        itemsByChecklist[cid] = itemsByChecklist[cid] || [];
        itemsByChecklist[cid].push(it);
      }
      console.debug('weeklyChecklistStatus loaded items count=', rawItems.length, 'grouped into', Object.keys(itemsByChecklist).length, 'checklists');
      if (rawItems.length > 0) {
        console.debug('weeklyChecklistStatus sample items 0-2=', rawItems.slice(0, 3));
      }
    }

    // map checklists per alat per day, include has_false flag when any boolean question is false
    const map: Record<number, Record<string, any>> = {};
    for (const c of checklists) {
      const aid = (c as any).alat?.id ?? (c as any)['alat_id'] ?? (c as any).alat_id ?? null;
      if (!aid) continue;
      const perf = c.performed_at as Date;
      const d = fmtYMD(perf);
      map[aid] = map[aid] || {};
      // determine if this checklist has any false boolean answers
      const cid = (c as any).id;
      let hasFalse = false;
      const its = itemsByChecklist[cid] || [];
      if (its.length > 0) {
        console.debug(`checking checklist ${cid} with ${its.length} items`);
      }
      for (let idx = 0; idx < its.length; idx++) {
        const it = its[idx];
        try {
          // Handle both raw query format and ORM object format
          const ansText = (it.answer_text !== undefined && it.answer_text !== null) 
            ? String(it.answer_text).trim().toLowerCase() 
            : '';
          const ansNum = it.answer_number;
          
          if (ansText) {
            console.debug(`  checklist ${cid} item ${idx}: answer_text="${ansText}"`);
          }
          
          // Check if answer is "false" (direct string match) or 0 (number)
          if (ansText === 'false' || ansText === '0' || ansText === 'no' || ansText === 'n') { 
            console.debug(`  checklist ${cid} item ${idx}: FOUND FALSE! ansText="${ansText}"`);
            hasFalse = true; 
            break; 
          }
          if (ansNum !== undefined && ansNum !== null && Number(ansNum) === 0) { 
            console.debug(`  checklist ${cid} item ${idx}: FOUND FALSE! ansNum=${ansNum}`);
            hasFalse = true; 
            break; 
          }
        } catch (e) {
          console.error(`  checklist ${cid} item ${idx} error:`, e);
        }
      }
      if (its.length > 0) {
        console.debug(`checklist ${cid} final result: hasFalse=${hasFalse}`);
      }
      // if multiple entries per day, keep latest
      const existing = map[aid][d];
      if (!existing || new Date(c.performed_at) > new Date(existing.performed_at)) {
        map[aid][d] = { done: true, checklist_id: (c as any).id, performed_at: c.performed_at, has_false: hasFalse };
      }
    }

    // debug: log days and sample checklists mapping
    console.debug('weeklyChecklistStatus days=', days.slice(0,7))
    // show one sample of map keys
    try{ console.debug('weeklyChecklistStatus map sample keys=', Object.keys(map).slice(0,5)) }catch(e){}

    const resultAlats = alats.map(a => {
      const row: any = { id: a.id, nama: a.nama, kode: a.kode ?? null, statuses: {} };
      for (const day of days) {
        row.statuses[day] = map[a.id] && map[a.id][day] ? map[a.id][day] : { done: false };
      }
      return row;
    });

    // ── Enrich OPEN slots with assigned technician names ──────────────────────
    try {
      if (alatIds.length > 0) {
        // Use raw SQL to avoid TypeORM relation alias confusion
        const assigns = await AppDataSource.query(
          `SELECT
             a.asset_id,
             s.date::text AS schedule_date,
             u.name      AS user_name,
             u.nipp      AS user_nipp
           FROM daily_checklist_assignment a
           JOIN daily_checklist_schedule s ON s.id = a.schedule_id
           JOIN "user" u ON u.id = a.user_id
           WHERE s.date BETWEEN $1 AND $2
             AND a.asset_id = ANY($3)`,
          [days[0], days[6], alatIds]
        );

        for (const assign of assigns) {
          const aId = assign.asset_id;
          const day = String(assign.schedule_date).slice(0, 10);
          const techName = assign.user_name || assign.user_nipp || 'Teknisi';
          const alat = resultAlats.find((r: any) => String(r.id) === String(aId));
          if (!alat) continue;
          const slot = alat.statuses[day];
          if (slot && !slot.done) {
            slot.assigned_teknisi = slot.assigned_teknisi
              ? slot.assigned_teknisi + ', ' + techName
              : techName;
          }
        }
      }
    } catch (assignErr) {
      console.warn('weeklyChecklistStatus: failed to load assignments', assignErr);
    }

    return res.json({ site_id: siteId ?? null, week_start: days[0], days, alats: resultAlats });
  } catch (err) {
    console.error('weeklyChecklistStatus error', err);
    return res.status(500).json({ message: 'Failed to compute weekly status' });
  }
}

  // GET /api/monitor/equipment-hour-meter
  export async function listEquipmentHourMeter(req: Request, res: Response) {
    try {
      const siteId = req.query.site_id ? Number(req.query.site_id) : undefined;
      const alatId = req.query.alat_id ? Number(req.query.alat_id) : undefined;
      const jenisAlatId = req.query.jenis_alat_id ? Number(req.query.jenis_alat_id) : undefined;
      const dateQ = (req.query.date as string) || '';
      const page = req.query.page ? Math.max(1, Number(req.query.page)) : 1;
      const perPage = req.query.per_page ? Math.max(1, Number(req.query.per_page)) : 10;

      const repo = AppDataSource.getRepository(DailyEquipmentHourMeter);
      const qb = repo.createQueryBuilder('e')
        .leftJoinAndSelect('e.alat', 'alat')
        .leftJoinAndSelect('e.jenis_alat', 'jenis')
        .leftJoinAndSelect('e.site', 'site')
        .leftJoinAndSelect('e.teknisi', 'teknisi')
        .orderBy('e.recorded_at', 'DESC');

      if (siteId) qb.andWhere('site.id = :sid', { sid: siteId });
      if (alatId) qb.andWhere('e.alat_id = :aid', { aid: alatId });
      if (jenisAlatId) qb.andWhere('jenis.id = :jid', { jid: jenisAlatId });
      if (dateQ) {
        // Expect YYYY-MM-DD
        const parsed = new Date(dateQ);
        if (isNaN(parsed.getTime())) return res.status(400).json({ message: 'Invalid date' });
        const s = `${dateQ}T00:00:00Z`;
        const e = `${dateQ}T23:59:59Z`;
        qb.andWhere('e.recorded_at BETWEEN :s AND :e', { s, e });
      }

      const total = await qb.getCount();
      const items = await qb.skip((page - 1) * perPage).take(perPage).getMany();

      return res.json({ page, per_page: perPage, total, items });
    } catch (err) {
      console.error('listEquipmentHourMeter error', err);
      return res.status(500).json({ message: 'Failed to list equipment hour meter entries' });
    }
  }

  // POST /api/monitor/equipment-hour-meter
  export async function createEquipmentHourMeter(req: Request, res: Response) {
    try {
      const body = req.body || {};
      const repo = AppDataSource.getRepository(DailyEquipmentHourMeter);
      // Validate required fields
      if (!body.alat_id) return res.status(400).json({ message: 'alat_id is required' });

    // capture authenticated user (if any) so we can attribute teknisi automatically
    const authUser: any = (req as any).user || null;

      // determine date window (local date of recorded_at) to prevent duplicate per day
      const recordedAt = body.recorded_at ? new Date(body.recorded_at) : new Date();
      const dayStart = new Date(recordedAt);
      dayStart.setHours(0,0,0,0);
      const dayEnd = new Date(recordedAt);
      dayEnd.setHours(23,59,59,999);

      // check existing entries for same alat within the same day
      const existingCount = await repo.createQueryBuilder('e')
        .where('e.alat_id = :aid', { aid: Number(body.alat_id) })
        .andWhere('e.recorded_at BETWEEN :s AND :e', { s: dayStart.toISOString(), e: dayEnd.toISOString() })
        .getCount();
      if (existingCount > 0) return res.status(409).json({ message: 'Entry for this equipment already exists for the selected date' });

      // determine site: prefer body.site_id, otherwise use authenticated user's site when available
      let siteIdValue: number | undefined = undefined;
      if (body.site_id) {
        siteIdValue = Number(body.site_id);
      } else if (authUser) {
        try {
          if (authUser.site_id) siteIdValue = Number(authUser.site_id);
          else if (authUser.site && authUser.site.id) siteIdValue = Number(authUser.site.id);
          else if (Array.isArray(authUser.sites) && authUser.sites.length > 0) {
            const s0 = authUser.sites[0];
            if (s0 && (s0.id || s0.site_id)) siteIdValue = Number(s0.id ?? s0.site_id);
          }
        } catch (e) {
          // ignore
        }
      }

      const ent = repo.create({
        alat: body.alat_id ? { id: Number(body.alat_id) } : undefined,
        jenis_alat: body.jenis_alat_id ? { id: Number(body.jenis_alat_id) } : undefined,
        site: siteIdValue ? { id: siteIdValue } : undefined,
        engine_hour: body.engine_hour !== undefined ? Number(body.engine_hour) : undefined,
        // prefer explicit teknisi_id from body, otherwise attribute to authenticated user if available
        teknisi: body.teknisi_id ? { id: String(body.teknisi_id) } : (authUser && authUser.id ? { id: String(authUser.id) } : undefined),
        recorded_at: recordedAt,
        notes: body.notes,
      });

      const saved = await repo.save(ent as any);
      return res.status(201).json({ data: saved });
    } catch (err) {
      console.error('createEquipmentHourMeter error', err);
      return res.status(500).json({ message: 'Failed to create entry' });
    }
  }

  // PATCH /api/monitor/equipment-hour-meter/:id
  export async function updateEquipmentHourMeter(req: Request, res: Response) {
    try {
      const id = req.params.id ? Number(req.params.id) : undefined
      if (!id) return res.status(400).json({ message: 'Missing id' })
      const body = req.body || {}
      const repo = AppDataSource.getRepository(DailyEquipmentHourMeter)
      const existing = await repo.findOne({ where: { id }, relations: ['alat','jenis_alat','site','teknisi'] })
      if (!existing) return res.status(404).json({ message: 'Not found' })

      // allow updating selected fields
      if (body.engine_hour !== undefined) existing.engine_hour = Number(body.engine_hour)
      if (body.teknisi_id !== undefined) existing.teknisi = body.teknisi_id ? { id: String(body.teknisi_id) } as any : undefined
      if (body.recorded_at !== undefined) existing.recorded_at = body.recorded_at ? new Date(body.recorded_at) : existing.recorded_at
      if (body.notes !== undefined) existing.notes = body.notes

      // optionally allow changing site/alarm references (only if provided)
      if (body.site_id !== undefined) existing.site = body.site_id ? { id: Number(body.site_id) } as any : undefined
      if (body.alat_id !== undefined) existing.alat = body.alat_id ? { id: Number(body.alat_id) } as any : existing.alat
      if (body.jenis_alat_id !== undefined) existing.jenis_alat = body.jenis_alat_id ? { id: Number(body.jenis_alat_id) } as any : existing.jenis_alat

      const saved = await repo.save(existing as any)
      return res.json({ data: saved })
    } catch (err) {
      console.error('updateEquipmentHourMeter error', err)
      return res.status(500).json({ message: 'Failed to update entry' })
    }
  }
