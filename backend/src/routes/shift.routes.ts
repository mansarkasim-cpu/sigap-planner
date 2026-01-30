import { Router, Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { ShiftGroup } from '../entities/ShiftGroup';
import { ShiftAssignment } from '../entities/ShiftAssignment';
import { authMiddleware } from '../middleware/auth';
import { User } from '../entities/User';
import { MasterSite } from '../entities/MasterSite';
import { validate, IsNotEmpty, IsArray, IsOptional, IsISO8601, IsInt } from 'class-validator';

const router = Router();

// Shift definitions (must match frontend ShiftManager)
const SHIFT_DEFS = [
  { id: 1, start: '07:00', end: '15:00' },
  { id: 2, start: '15:00', end: '23:00' },
  { id: 3, start: '23:00', end: '07:00' },
];

function timeToMinutes(t: string) {
  const m = String(t || '').trim();
  const parts = m.split(':');
  const hh = Number(parts[0] || 0);
  const mm = Number(parts[1] || 0);
  return hh * 60 + mm;
}

function findShiftIdForTime(timeStr?: string|null) {
  if (!timeStr) return null;
  const mins = timeToMinutes(timeStr);
  for (const s of SHIFT_DEFS) {
    const startM = timeToMinutes(s.start);
    const endM = timeToMinutes(s.end === '24:00' ? '24:00' : s.end);
    if (startM <= mins && mins < endM) return s.id;
    // handle midnight ranges (not needed for current defs but safe)
    if (startM > endM) {
      // e.g., 23:00 - 06:00
      if (mins >= startM || mins < endM) return s.id;
    }
  }
  return null;
}

function dateMinusOne(dateStr: string) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch (e) {
    return dateStr;
  }
}

class CreateGroupDTO {
  @IsNotEmpty()
  name!: string;

  @IsArray()
  members!: string[];

  @IsOptional()
  site?: string;
  @IsOptional()
  leader?: string;
}

router.post('/shift-groups', authMiddleware, async (req: Request, res: Response) => {
  try {
    const dto = Object.assign(new CreateGroupDTO(), req.body || {});
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid input', details: errors });

    const repo = AppDataSource.getRepository(ShiftGroup);
    const g = repo.create({ name: dto.name, members: dto.members || [], site: dto.site, leader: dto.leader || null });
    const saved = await repo.save(g as any);
    return res.status(201).json({ message: 'created', data: saved });
  } catch (err) {
    console.error('create shift group', err);
    return res.status(500).json({ message: 'Failed to create group' });
  }
});

router.get('/shift-groups', authMiddleware, async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ShiftGroup);
    const qb = repo.createQueryBuilder('g');
    if (req.query.site) qb.andWhere('g.site = :site', { site: String(req.query.site) });
    qb.orderBy('g.createdAt', 'DESC');
    const rows = await qb.getMany();
    return res.json(rows);
  } catch (err) {
    console.error('list shift groups', err);
    return res.status(500).json({ message: 'Failed to list groups' });
  }
});

// DELETE /api/shift-groups/:id
router.delete('/shift-groups/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const repo = AppDataSource.getRepository(ShiftGroup);
    const aRepo = AppDataSource.getRepository(ShiftAssignment);
    const g = await repo.findOneBy({ id } as any);
    if (!g) return res.status(404).json({ message: 'Group not found' });

    // remove any assignments referencing this group
    try {
      await aRepo.createQueryBuilder().delete().from(ShiftAssignment).where('group_id = :id', { id }).execute();
    } catch (e) {
      console.warn('Failed to remove related assignments', e);
    }

    await repo.remove(g as any);
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('delete shift group', err);
    return res.status(500).json({ message: 'Failed to delete group' });
  }
});

class UpdateGroupDTO {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsArray()
  members?: string[];

  @IsOptional()
  site?: string;
  @IsOptional()
  leader?: string;
}

router.put('/shift-groups/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const dto = Object.assign(new UpdateGroupDTO(), req.body || {});
    const errors = await validate(dto as any);
    if (errors.length > 0) return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid input', details: errors });

    const repo = AppDataSource.getRepository(ShiftGroup);
    const g = await repo.findOneBy({ id } as any);
    if (!g) return res.status(404).json({ message: 'Group not found' });

    if (dto.name !== undefined) g.name = dto.name as any;
    if (dto.members !== undefined) g.members = dto.members as any;
    if (dto.site !== undefined) g.site = dto.site as any;
    if (dto.leader !== undefined) g.leader = dto.leader as any;

    const saved = await repo.save(g as any);
    return res.json({ message: 'updated', data: saved });
  } catch (err) {
    console.error('update shift group', err);
    return res.status(500).json({ message: 'Failed to update group' });
  }
});

class CreateAssignmentDTO {
  @IsNotEmpty()
  date!: string; // YYYY-MM-DD

  @IsInt()
  shift!: number;

  @IsNotEmpty()
  groupId!: string;

  @IsOptional()
  site?: string;
}

router.post('/shift-assignments', authMiddleware, async (req: Request, res: Response) => {
  try {
    const dto = Object.assign(new CreateAssignmentDTO(), req.body || {});
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid input', details: errors });

    const assignmentRepo = AppDataSource.getRepository(ShiftAssignment);
    const groupRepo = AppDataSource.getRepository(ShiftGroup);
    const group = await groupRepo.findOneBy({ id: dto.groupId } as any);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // prevent duplicate assignment for same date+shift+group+site
    const exists = await assignmentRepo.createQueryBuilder('a')
      .leftJoin('a.group', 'g')
      .where('a.date = :date', { date: dto.date })
      .andWhere('a.shift = :shift', { shift: dto.shift })
      .andWhere('g.id = :gid', { gid: dto.groupId })
      .andWhere('a.site = :site', { site: dto.site || null })
      .getOne();
    if (exists) return res.status(409).json({ message: 'Assignment already exists for this group/shift/date' });

    const a: any = assignmentRepo.create({ date: dto.date, shift: dto.shift, group: group as any, site: dto.site });
    const saved = await assignmentRepo.save(a);
    return res.status(201).json({ message: 'assigned', data: saved });
  } catch (err) {
    console.error('create assignment', err);
    return res.status(500).json({ message: 'Failed to create assignment' });
  }
});

router.get('/shift-assignments', authMiddleware, async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(ShiftAssignment);
    const qb = repo.createQueryBuilder('a').leftJoinAndSelect('a.group', 'g');
    if (req.query.date) qb.andWhere('a.date = :date', { date: String(req.query.date) });
    if (req.query.site) qb.andWhere('a.site = :site', { site: String(req.query.site) });
    const rows = await qb.getMany();
    return res.json(rows.map(r => ({
      id: r.id,
      date: r.date,
      shift: r.shift,
      groupId: r.group?.id,
      groupName: r.group?.name,
      groupMembers: r.group?.members || [],
      site: r.site,
      createdAt: r.createdAt
    })));
  } catch (err) {
    console.error('list assignments', err);
    return res.status(500).json({ message: 'Failed to list assignments' });
  }
});

// GET /api/scheduled-technicians?date=YYYY-MM-DD&site=...
router.get('/scheduled-technicians', authMiddleware, async (req: Request, res: Response) => {
  try {
    const date = String(req.query.date || '');
    if (!date) return res.status(400).json({ message: 'date is required (YYYY-MM-DD)' });
    const site = req.query.site ? String(req.query.site) : null;
    const time = req.query.time ? String(req.query.time) : null; // expected HH:MM, provided in UTC

    // Determine timezone: try environment override, otherwise default to Jakarta
    const DEFAULT_TZ = process.env.DEFAULT_TIMEZONE || 'Asia/Jakarta';
    let timeZone = DEFAULT_TZ;

    // If a site identifier was provided, try to lookup per-site timezone
    if (site) {
      try {
        const msRepo = AppDataSource.getRepository(MasterSite);
        let ms: MasterSite | null = null as any;
        // if site looks numeric, try id lookup
        const maybeId = Number(site);
        if (!isNaN(maybeId) && Number.isInteger(maybeId)) {
          ms = await msRepo.findOne({ where: { id: maybeId } as any } as any) as any;
        }
        // If not found by id, try a case-insensitive match on code or name.
        if (!ms) {
          ms = await msRepo.createQueryBuilder('ms')
            .where('LOWER(ms.code) = LOWER(:s)', { s: site })
            .orWhere('LOWER(ms.name) = LOWER(:s)', { s: site })
            .getOne();
        }
        if (ms && (ms.timezone || '').toString().trim() !== '') {
          timeZone = ms.timezone as any;
        }
      } catch (e) {
        console.warn('[scheduled-technicians] failed to lookup site timezone, falling back to default', e);
      }
    }

    // support debug flag
    const debugFlag = req.query.debug ? String(req.query.debug).toLowerCase() : '';
    // support timeIsLocal flag: when true, the provided `time` is treated as the
    // site's local wall-clock time (no UTC->local conversion). Accepts `1` or `true`.
    const timeIsLocal = req.query.timeIsLocal ? String(req.query.timeIsLocal).toLowerCase() === '1' || String(req.query.timeIsLocal).toLowerCase() === 'true' : false;

    // Convert provided UTC date+time to the site's local date/time (in timeZone)
    // so shift matching uses local wall-clock time.
    let localTimeStr: string | null = null;
    let localDateStr = date; // fallback
    const endDate = req.query.endDate ? String(req.query.endDate) : (req.query.end ? String(req.query.end) : '');
    const endTime = req.query.endTime ? String(req.query.endTime) : null;
    let localEndTimeStr: string | null = null;
    let localEndDateStr = endDate ? endDate : date;
    try {
      if (time) {
        if (timeIsLocal) {
          localTimeStr = time;
        } else {
          const isoUtc = `${date}T${time}:00Z`;
          const d = new Date(isoUtc);
          if (!isNaN(d.getTime())) {
            const parts = new Intl.DateTimeFormat('en-GB', {
              timeZone,
              hour: '2-digit', minute: '2-digit', hour12: false,
              year: 'numeric', month: '2-digit', day: '2-digit'
            }).formatToParts(d);
            const map: any = {};
            for (const p of parts) map[p.type] = p.value;
            const hh = map.hour || '00';
            const mm = map.minute || '00';
            localTimeStr = `${hh}:${mm}`;
            const yyyy = map.year; const mmth = map.month; const dd = map.day;
            if (yyyy && mmth && dd) localDateStr = `${yyyy}-${mmth}-${dd}`;
          }
        }
      }

      if (endTime) {
        if (timeIsLocal) {
          localEndTimeStr = endTime;
          if (!endDate) localEndDateStr = localDateStr;
        } else {
          const ed = endDate || date;
          const isoUtcEnd = `${ed}T${endTime}:00Z`;
          const d2 = new Date(isoUtcEnd);
          if (!isNaN(d2.getTime())) {
            const parts2 = new Intl.DateTimeFormat('en-GB', {
              timeZone,
              hour: '2-digit', minute: '2-digit', hour12: false,
              year: 'numeric', month: '2-digit', day: '2-digit'
            }).formatToParts(d2);
            const map2: any = {};
            for (const p of parts2) map2[p.type] = p.value;
            const hh2 = map2.hour || '00';
            const mm2 = map2.minute || '00';
            localEndTimeStr = `${hh2}:${mm2}`;
            const yyyy2 = map2.year; const mmth2 = map2.month; const dd2 = map2.day;
            if (yyyy2 && mmth2 && dd2) localEndDateStr = `${yyyy2}-${mmth2}-${dd2}`;
          }
        }
      }
    } catch (e) {
      console.warn('[scheduled-technicians] failed to convert UTC time to local', e);
    }

    // Use raw SQL to extract JSONB members and join to user table
    // Support optional endDate to return assignments between start and end (inclusive)

    const params: any[] = [localDateStr];
    // build date condition: either single date or inclusive range (use local converted dates)
    let dateCond = 'a.date = $1';
    if (localEndDateStr && localEndDateStr !== localDateStr) {
      params.push(localEndDateStr);
      dateCond = 'a.date >= $1 AND a.date <= $2';
    }

    let siteCond = '';
    // Only filter by the assignment's site (`a.site`).
    // Previously the code required both a.site and u.site to match the provided site,
    // which incorrectly excluded users whose `site` field is empty or differs.
    if (site) { params.push(site); siteCond = ` AND LOWER(COALESCE(a.site,'')) = LOWER($${params.length})`; }

    // determine shift(s) from local start/end times if provided
    const shiftIdStart = findShiftIdForTime(localTimeStr || time);
    const shiftIdEnd = findShiftIdForTime(localEndTimeStr || endTime);
    let shiftCond = '';
    // If only start time provided, filter by that shift
    if (shiftIdStart !== null && !shiftIdEnd) {
      params.push(shiftIdStart);
      shiftCond = ` AND a.shift = $${params.length}`;
      console.debug('[scheduled-technicians] filtering by single shift', { date, time, timeZone, localDate: localDateStr, localTime: localTimeStr, shiftIdStart });
    } else if (shiftIdStart !== null && shiftIdEnd !== null) {
      // If start and end fall on the same local date, include the range of shifts between them (inclusive)
      if (localDateStr === localEndDateStr) {
        const shifts: number[] = [];
        const maxShift = SHIFT_DEFS.length;
        let cur = shiftIdStart;
        while (true) {
          shifts.push(cur);
          if (cur === shiftIdEnd) break;
          cur = (cur % maxShift) + 1;
          if (shifts.length > maxShift) break; // safety
        }
        const idxStart = params.length + 1;
        for (const s of shifts) params.push(s);
        const placeholders = shifts.map((_, i) => `$${idxStart + i}`).join(',');
        shiftCond = ` AND a.shift IN (${placeholders})`;
        console.debug('[scheduled-technicians] filtering by shift range', { localDate: localDateStr, localTime: localTimeStr, localEndTimeStr, shifts });
      } else {
        // date range spans multiple days: do not restrict shifts (include all shifts for intermediate dates)
        console.debug('[scheduled-technicians] date range spans multiple days; not restricting shifts by time');
      }
    }

    const sql = `
      SELECT DISTINCT u.id, u.name, u.email, u.role, u.created_at, u.nipp, u.site
      FROM "user" u
      JOIN (
        SELECT g.id as gid, jsonb_array_elements_text(g.members) as member_id_text
        FROM shift_group g
      ) gm ON gm.member_id_text = u.id::text
      JOIN shift_assignment a ON a.group_id = gm.gid
      WHERE ${dateCond} ${siteCond} ${shiftCond}
      AND u.role = 'technician'
    `;

    // Diagnostic: when debugging, collect which group-member IDs and user IDs are matched
    let dbgMembers: any[] = [];
    let dbgUserIds: any[] = [];
    try {
      // For member diagnostics, reuse the same date/site/shift conditions used by main SQL
      const dbgMembersSql = `
        SELECT DISTINCT g.id as gid, jsonb_array_elements_text(g.members) as member_id_text
        FROM shift_group g
        JOIN shift_assignment a ON a.group_id = g.id
        WHERE ${dateCond} ${siteCond} ${shiftCond}
      `;
      if (process.env.NODE_ENV !== 'production' || debugFlag === '1' || debugFlag === 'true') {
        console.debug('[scheduled-technicians] diagnostic member_ids SQL', dbgMembersSql, params);
      }
      dbgMembers = await AppDataSource.manager.query(dbgMembersSql, params);
      if (process.env.NODE_ENV !== 'production' || debugFlag === '1' || debugFlag === 'true') {
        console.debug('[scheduled-technicians] diagnostic member_ids', dbgMembers);
      }

      const dbgUserIdsSql = `
        SELECT DISTINCT u.id
        FROM "user" u
        JOIN (
          SELECT g.id as gid, jsonb_array_elements_text(g.members) as member_id_text
          FROM shift_group g
        ) gm ON gm.member_id_text = u.id::text
        JOIN shift_assignment a ON a.group_id = gm.gid
        WHERE ${dateCond} ${siteCond} ${shiftCond}
      `;
      if (process.env.NODE_ENV !== 'production' || debugFlag === '1' || debugFlag === 'true') {
        console.debug('[scheduled-technicians] diagnostic user_ids SQL', dbgUserIdsSql, params);
      }
      dbgUserIds = await AppDataSource.manager.query(dbgUserIdsSql, params);
      if (process.env.NODE_ENV !== 'production' || debugFlag === '1' || debugFlag === 'true') {
        console.debug('[scheduled-technicians] diagnostic user_ids', dbgUserIds);
      }
    } catch (e) {
      console.warn('[scheduled-technicians] diagnostic query failed', e);
    }

    console.debug('[scheduled-technicians] main SQL', sql, params);
    const rows = await AppDataSource.manager.query(sql, params);
    if (debugFlag === '1' || debugFlag === 'true') {
      return res.json({ date, time, timeZone, localDateStr, localTimeStr, shiftIdStart, shiftIdEnd, params, dbgMembers, dbgUserIds, sql, rows });
    }
    return res.json(rows);
  } catch (err) {
    console.error('scheduled-technicians error', err);
    return res.status(500).json({ message: 'Failed to fetch scheduled technicians' });
  }
});

router.delete('/shift-assignments/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const repo = AppDataSource.getRepository(ShiftAssignment);
    const a = await repo.findOneBy({ id } as any);
    if (!a) return res.status(404).json({ message: 'Not found' });
    await repo.remove(a as any);
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('delete assignment', err);
    return res.status(500).json({ message: 'Failed to delete' });
  }
});

export default router;
