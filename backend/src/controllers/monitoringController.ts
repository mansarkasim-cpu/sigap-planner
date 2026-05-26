import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { MasterAlat } from '../entities/MasterAlat';
import { MasterSite } from '../entities/MasterSite';
import { DailyChecklist } from '../entities/DailyChecklist';
import { DailyChecklistItem } from '../entities/DailyChecklistItem';
import { DailyEquipmentHourMeter } from '../entities/DailyEquipmentHourMeter';
import { DailyChecklistAssignment } from '../entities/DailyChecklistAssignment';

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  return x;
}

/**
 * Given a UTC Date and an IANA timezone string, return the UTC timestamps
 * that correspond to [00:00:00, 23:59:59.999] of that date in the local timezone.
 */
function getLocalDayBoundsInUTC(date: Date, timezone: string): { dayStart: Date; dayEnd: Date } {
  const dtFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
  const parts = dtFmt.formatToParts(date);
  const h = parseInt(parts.find(p => p.type === 'hour')!.value, 10) % 24;
  const m = parseInt(parts.find(p => p.type === 'minute')!.value, 10);
  const s = parseInt(parts.find(p => p.type === 'second')!.value, 10);
  const msIntoLocalDay = (h * 3600 + m * 60 + s) * 1000;
  const dayStart = new Date(date.getTime() - msIntoLocalDay);
  const dayEnd = new Date(dayStart.getTime() + 86400000 - 1);
  return { dayStart, dayEnd };
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
    const qb = aRepo.createQueryBuilder('a').leftJoinAndSelect('a.site','site').leftJoinAndSelect('a.jenis_alat','jenis_alat');
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
      const row: any = { id: a.id, nama: a.nama, kode: a.kode ?? null, jenis_alat_id: (a as any).jenis_alat?.id ?? null, statuses: {} };
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
        .leftJoinAndSelect('alat.jenis_alat', 'alatJenis')
        .leftJoinAndSelect('e.jenis_alat', 'jenis')
        .leftJoinAndSelect('e.site', 'site')
        .leftJoinAndSelect('e.teknisi', 'teknisi')
        .orderBy('e.recorded_at', 'DESC');

      if (siteId) qb.andWhere('site.id = :sid', { sid: siteId });
      if (alatId) qb.andWhere('e.alat_id = :aid', { aid: alatId });
      if (jenisAlatId) qb.andWhere('jenis.id = :jid', { jid: jenisAlatId });
      if (dateQ) {
        // Expect YYYY-MM-DD. Use the site's local timezone so that dates align with
        // what users see (e.g. WIB entries before 07:00 UTC aren't shifted to the previous day).
        const parsed = new Date(dateQ);
        if (isNaN(parsed.getTime())) return res.status(400).json({ message: 'Invalid date' });
        let listTimezone = 'Asia/Jakarta';
        if (siteId) {
          try {
            const siteRepo = AppDataSource.getRepository(MasterSite);
            const site = await siteRepo.findOne({ where: { id: siteId } as any });
            if (site?.timezone) listTimezone = site.timezone;
          } catch (_) {}
        }
        // Compute UTC boundaries for [00:00:00, 23:59:59] of dateQ in the site's local timezone
        const { dayStart, dayEnd } = getLocalDayBoundsInUTC(parsed, listTimezone);
        qb.andWhere('e.recorded_at BETWEEN :s AND :e', { s: dayStart.toISOString(), e: dayEnd.toISOString() });
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

      // determine site: prefer body.site_id, otherwise use authenticated user's site when available
      // (resolved early so we can look up the site timezone for the duplicate check)
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

      // Look up the site's IANA timezone so the duplicate check uses local calendar date,
      // not the UTC date (which differs for WIB users recording before 07:00 local).
      let siteTimezone = 'Asia/Jakarta';
      if (siteIdValue) {
        try {
          const siteRepo = AppDataSource.getRepository(MasterSite);
          const site = await siteRepo.findOne({ where: { id: siteIdValue } as any });
          if (site?.timezone) siteTimezone = site.timezone;
        } catch (_) {}
      }

      // determine date window using the site's LOCAL day (not UTC day)
      const recordedAt = body.recorded_at ? new Date(body.recorded_at) : new Date();
      const { dayStart, dayEnd } = getLocalDayBoundsInUTC(recordedAt, siteTimezone);

      // check existing entries for same alat within the same local day
      const existingCount = await repo.createQueryBuilder('e')
        .where('e.alat_id = :aid', { aid: Number(body.alat_id) })
        .andWhere('e.recorded_at BETWEEN :s AND :e', { s: dayStart.toISOString(), e: dayEnd.toISOString() })
        .getCount();
      if (existingCount > 0) return res.status(409).json({ message: 'Entry for this equipment already exists for the selected date' });

      // Validate engine_hour value against the previous recorded entry
      if (body.engine_hour !== undefined) {
        const newEngineHour = Number(body.engine_hour);
        if (isNaN(newEngineHour) || newEngineHour < 0) {
          return res.status(400).json({ message: 'Engine hour tidak boleh negatif' });
        }
        const prevRows: any[] = await AppDataSource.manager.query(
          `SELECT engine_hour, recorded_at FROM daily_equipment_hour_meter WHERE alat_id = $1 AND recorded_at < $2 ORDER BY recorded_at DESC LIMIT 1`,
          [Number(body.alat_id), recordedAt.toISOString()]
        );
        if (prevRows.length > 0 && prevRows[0].engine_hour != null) {
          const prevHour = Number(prevRows[0].engine_hour);
          const prevRecordedAt = new Date(prevRows[0].recorded_at);
          const daysDiff = Math.max(1, Math.ceil((recordedAt.getTime() - prevRecordedAt.getTime()) / 86400000));
          const maxIncrease = daysDiff * 24;
          if (newEngineHour < prevHour) {
            return res.status(400).json({ message: `Engine hour tidak boleh lebih kecil dari nilai sebelumnya (${prevHour})` });
          }
          if (newEngineHour - prevHour > maxIncrease) {
            return res.status(400).json({ message: `Kenaikan engine hour terlalu besar. Nilai sebelumnya: ${prevHour}, maks kenaikan: ${maxIncrease} jam (${daysDiff} hari × 24 jam)` });
          }
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
      if (body.engine_hour !== undefined) {
        const newEngineHour = Number(body.engine_hour);
        if (isNaN(newEngineHour) || newEngineHour < 0) {
          return res.status(400).json({ message: 'Engine hour tidak boleh negatif' });
        }
        const alatIdForCheck = existing.alat ? (existing.alat as any).id ?? (existing.alat as any).alat_id : body.alat_id;
        const recordedAtForCheck = body.recorded_at ? new Date(body.recorded_at) : existing.recorded_at;
        if (alatIdForCheck) {
          const prevRows: any[] = await AppDataSource.manager.query(
            `SELECT engine_hour, recorded_at FROM daily_equipment_hour_meter WHERE alat_id = $1 AND recorded_at < $2 AND id != $3 ORDER BY recorded_at DESC LIMIT 1`,
            [Number(alatIdForCheck), recordedAtForCheck.toISOString(), id]
          );
          if (prevRows.length > 0 && prevRows[0].engine_hour != null) {
            const prevHour = Number(prevRows[0].engine_hour);
            const prevRecordedAt = new Date(prevRows[0].recorded_at);
            const daysDiff = Math.max(1, Math.ceil((recordedAtForCheck.getTime() - prevRecordedAt.getTime()) / 86400000));
            const maxIncrease = daysDiff * 24;
            if (newEngineHour < prevHour) {
              return res.status(400).json({ message: `Engine hour tidak boleh lebih kecil dari nilai sebelumnya (${prevHour})` });
            }
            if (newEngineHour - prevHour > maxIncrease) {
              return res.status(400).json({ message: `Kenaikan engine hour terlalu besar. Nilai sebelumnya: ${prevHour}, maks kenaikan: ${maxIncrease} jam (${daysDiff} hari × 24 jam)` });
            }
          }
        }
        existing.engine_hour = newEngineHour;
      }
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

// GET /api/monitor/checklist-compliance?month=YYYY-MM&site_id=X
// Returns per-technician, per-day assignment status for the given month.
export async function checklistCompliance(req: Request, res: Response) {
  try {
    const monthQ = (req.query.month as string) || '';
    if (!monthQ || !/^\d{4}-\d{2}$/.test(monthQ)) {
      return res.status(400).json({ message: 'month is required (format: YYYY-MM)' });
    }
    const siteId = req.query.site_id ? Number(req.query.site_id) : undefined;

    const [year, month] = monthQ.split('-').map(Number);
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const params: any[] = [startDate, endDate];
    const siteFilterAssign = siteId ? `AND s.site_id = $3` : '';
    const siteFilterDC     = siteId ? `AND dc.site_id = $3` : '';
    if (siteId) params.push(siteId);

    // One row per (schedule_date, user, asset) — includes assignments AND
    // unassigned checklists submitted directly from mobile
    const rows: any[] = await AppDataSource.query(
      `-- Part 1: scheduled assignments
       SELECT
         s.date::text     AS schedule_date,
         u.id             AS user_id,
         u.name           AS user_name,
         u.nipp           AS user_nipp,
         a.status         AS assignment_status,
         al.nama          AS alat_nama,
         al.kode          AS alat_kode
       FROM daily_checklist_assignment a
       JOIN daily_checklist_schedule s ON s.id = a.schedule_id
       JOIN "user" u ON u.id = a.user_id
       LEFT JOIN master_alat al ON al.id = a.asset_id
       WHERE s.date BETWEEN $1 AND $2
         ${siteFilterAssign}

       UNION ALL

       -- Part 2: unassigned but actually done (mobile self-submit)
       SELECT
         DATE(dc.performed_at)::text  AS schedule_date,
         u.id                         AS user_id,
         u.name                       AS user_name,
         u.nipp                       AS user_nipp,
         'DONE'                       AS assignment_status,
         al.nama                      AS alat_nama,
         al.kode                      AS alat_kode
       FROM daily_checklist dc
       JOIN "user" u ON u.nipp = dc.teknisi_id::text
       LEFT JOIN master_alat al ON al.id = dc.alat_id
       WHERE DATE(dc.performed_at) BETWEEN $1 AND $2
         ${siteFilterDC}
         AND NOT EXISTS (
           SELECT 1
           FROM daily_checklist_assignment a2
           JOIN daily_checklist_schedule s2 ON s2.id = a2.schedule_id
           WHERE s2.date = DATE(dc.performed_at)
             AND a2.asset_id = dc.alat_id
             AND a2.user_id = u.id
         )

       ORDER BY user_name, schedule_date`,
      params
    );

    // Group by technician
    const userMap: Record<string, {
      id: string; name: string; nipp: string | null;
      days: Record<string, { status: string; alat: string }[]>;
      total: number; done: number; skipped: number; pending: number;
    }> = {};
    const scheduleDatesSet = new Set<string>();

    for (const row of rows) {
      const date = String(row.schedule_date).slice(0, 10);
      scheduleDatesSet.add(date);

      if (!userMap[row.user_id]) {
        userMap[row.user_id] = {
          id: row.user_id,
          name: row.user_name || '',
          nipp: row.user_nipp || null,
          days: {},
          total: 0, done: 0, skipped: 0, pending: 0,
        };
      }
      const u = userMap[row.user_id];
      const status = String(row.assignment_status || 'PENDING').toUpperCase();
      const alat = row.alat_nama || (row.alat_kode ? `Alat ${row.alat_kode}` : '-');
      // Collect ALL assignments per day as an array (one per asset)
      if (!u.days[date]) u.days[date] = [];
      u.days[date].push({ status, alat });
      u.total++;
      if (status === 'DONE') u.done++;
      else if (status === 'SKIPPED') u.skipped++;
      else u.pending++;
    }

    const technicians = Object.values(userMap).map(u => ({
      ...u,
      compliance: u.total > 0 ? Math.round((u.done / u.total) * 100) : null,
    })).sort((a, b) => a.name.localeCompare(b.name));

    const scheduleDates = Array.from(scheduleDatesSet).sort();

    return res.json({ month: monthQ, site_id: siteId ?? null, scheduleDates, technicians });
  } catch (err) {
    console.error('checklistCompliance error', err);
    return res.status(500).json({ message: 'Failed to compute checklist compliance' });
  }
}
