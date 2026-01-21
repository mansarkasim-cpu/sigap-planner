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
        // try matching by code or name
        let ms: MasterSite | null = null as any;
        // if site looks numeric, try id lookup
        const maybeId = Number(site);
        if (!isNaN(maybeId) && Number.isInteger(maybeId)) {
          ms = await msRepo.findOne({ where: { id: maybeId } as any } as any) as any;
        }
        if (!ms) ms = await msRepo.findOne({ where: [{ code: site }, { name: site }] } as any) as any;
        if (ms && (ms.timezone || '').toString().trim() !== '') {
          timeZone = ms.timezone as any;
        }
      } catch (e) {
        console.warn('[scheduled-technicians] failed to lookup site timezone, falling back to default', e);
      }
    }

    // Convert provided UTC date+time to the site's local date/time (in timeZone)
    // so shift matching uses local wall-clock time.
    let localTimeStr: string | null = null;
    let localDateStr = date; // fallback
    try {
      if (time) {
        // build an ISO instant from provided date+time in UTC
        const isoUtc = `${date}T${time}:00Z`;
        const d = new Date(isoUtc);
        if (!isNaN(d.getTime())) {
          // get local time components in target timezone
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
    } catch (e) {
      // fallback: leave localTimeStr null and use original date/time
      console.warn('[scheduled-technicians] failed to convert UTC time to local', e);
    }

    // Use raw SQL to extract JSONB members and join to user table
    const params: any[] = [localDateStr];
    let siteCond = '';
    if (site) { params.push(site); siteCond = ' AND LOWER(COALESCE(a.site,\'\')) = LOWER($2) AND LOWER(COALESCE(u.site,\'\')) = LOWER($2)'; }

    // determine shift from local time if provided
    const shiftId = findShiftIdForTime(localTimeStr || time);
    let shiftCond = '';
    if (shiftId !== null) {
      // Build params using effective localDate (already applied)
      if (!site) params.push(shiftId);
      else params.push(shiftId); // shift param index will follow site param if present
      const idx = params.length;
      shiftCond = ` AND a.shift = $${idx}`;
      console.debug('[scheduled-technicians] filtering by shift', { date, time, timeZone, localDate: localDateStr, localTime: localTimeStr, shiftId });
    }

    const sql = `
      SELECT DISTINCT u.id, u.name, u.email, u.role, u.created_at, u.nipp, u.site
      FROM "user" u
      JOIN (
        SELECT g.id as gid, jsonb_array_elements_text(g.members) as member_id_text
        FROM shift_group g
      ) gm ON gm.member_id_text = u.id::text
      JOIN shift_assignment a ON a.group_id = gm.gid
      WHERE a.date = $1 ${siteCond} ${shiftCond}
      AND u.role = 'technician'
    `;

    // Diagnostic: when debugging, log which group-member IDs and user IDs are matched
    try {
      if (process.env.NODE_ENV !== 'production') {
        // For member diagnostics, only filter by assignment.a.site (don't reference u)
        const memberSiteCond = site ? ` AND LOWER(COALESCE(a.site,'')) = LOWER($2)` : '';
        const dbgMembersSql = `
          SELECT DISTINCT g.id as gid, jsonb_array_elements_text(g.members) as member_id_text
          FROM shift_group g
          JOIN shift_assignment a ON a.group_id = g.id
          WHERE a.date = $1 ${memberSiteCond} ${shiftCond}
        `;
        console.debug('[scheduled-technicians] diagnostic member_ids SQL', dbgMembersSql, params);
        const dbgMembers = await AppDataSource.manager.query(dbgMembersSql, params);
        console.debug('[scheduled-technicians] diagnostic member_ids', dbgMembers);

        const dbgUserIdsSql = `
          SELECT DISTINCT u.id
          FROM "user" u
          JOIN (
            SELECT g.id as gid, jsonb_array_elements_text(g.members) as member_id_text
            FROM shift_group g
          ) gm ON gm.member_id_text = u.id::text
          JOIN shift_assignment a ON a.group_id = gm.gid
          WHERE a.date = $1 ${siteCond} ${shiftCond}
        `;
        console.debug('[scheduled-technicians] diagnostic user_ids SQL', dbgUserIdsSql, params);
        const dbgUserIds = await AppDataSource.manager.query(dbgUserIdsSql, params);
        console.debug('[scheduled-technicians] diagnostic user_ids', dbgUserIds);
      }
    } catch (e) {
      console.warn('[scheduled-technicians] diagnostic query failed', e);
    }

    console.debug('[scheduled-technicians] main SQL', sql, params);
    const rows = await AppDataSource.manager.query(sql, params);
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
