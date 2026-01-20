import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { MasterAlat } from '../entities/MasterAlat';
import { DailyChecklist } from '../entities/DailyChecklist';
import { DailyChecklistItem } from '../entities/DailyChecklistItem';

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

    return res.json({ site_id: siteId ?? null, week_start: days[0], days, alats: resultAlats });
  } catch (err) {
    console.error('weeklyChecklistStatus error', err);
    return res.status(500).json({ message: 'Failed to compute weekly status' });
  }
}
