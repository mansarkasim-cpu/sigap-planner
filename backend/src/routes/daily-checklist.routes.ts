import { Router, Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { DailyChecklistSchedule } from '../entities/DailyChecklistSchedule';
import { DailyChecklistAssignment } from '../entities/DailyChecklistAssignment';
import { MasterSite } from '../entities/MasterSite';
import { MasterAlat } from '../entities/MasterAlat';
import { User } from '../entities/User';
import { authMiddleware } from '../middleware/auth';

const router = Router();

const scheduleRepo = () => AppDataSource.getRepository(DailyChecklistSchedule);
const assignRepo   = () => AppDataSource.getRepository(DailyChecklistAssignment);
const siteRepo     = () => AppDataSource.getRepository(MasterSite);
const alatRepo     = () => AppDataSource.getRepository(MasterAlat);
const userRepo     = () => AppDataSource.getRepository(User);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/daily-checklist-schedules
// Query: date (YYYY-MM-DD), site_id, status
// ─────────────────────────────────────────────────────────────────────────────
router.get('/daily-checklist-schedules', authMiddleware, async (req: Request, res: Response) => {
  try {
    const qb = scheduleRepo()
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.site', 'site')
      .leftJoinAndSelect('s.createdBy', 'cb')
      .leftJoinAndSelect('s.assignments', 'a')
      .leftJoinAndSelect('a.asset', 'asset')
      .leftJoinAndSelect('asset.jenis_alat', 'jenisAlat')
      .leftJoinAndSelect('a.user', 'u');

    if (req.query.date)    qb.andWhere('s.date = :date', { date: String(req.query.date) });
    if (req.query.site_id) qb.andWhere('site.id = :sid', { sid: Number(req.query.site_id) });
    if (req.query.status)  qb.andWhere('s.status = :status', { status: String(req.query.status) });

    qb.orderBy('s.date', 'DESC').addOrderBy('s.createdAt', 'DESC');
    const rows = await qb.getMany();

    // Enrich assignment status: if still PENDING but daily_checklist exists for that asset+user+date → mark as DONE
    if (rows.length > 0) {
      const dateStr = req.query.date ? String(req.query.date) : null;
      const pendingAssignments = rows.flatMap((s: any) =>
        (s.assignments || []).filter((a: any) => a.status === 'PENDING' && a.asset?.id && a.user?.id)
      );
      if (pendingAssignments.length > 0) {
        const alatIds = [...new Set(pendingAssignments.map((a: any) => Number(a.asset.id)))];
        const schedDates = dateStr ? [dateStr] : [...new Set(rows.map((s: any) => String(s.date).slice(0, 10)))];
        const done = await AppDataSource.query(
          `SELECT dc.alat_id, dc.teknisi_id, DATE(dc.performed_at) AS perf_date, MIN(dc.performed_at) AS performed_at
           FROM daily_checklist dc
           WHERE dc.alat_id = ANY($1) AND DATE(dc.performed_at) = ANY($2)
           GROUP BY dc.alat_id, dc.teknisi_id, DATE(dc.performed_at)`,
          [alatIds, schedDates]
        );
        const doneSet = new Set(done.map((r: any) => `${r.alat_id}_${String(r.perf_date).slice(0, 10)}`));
        // Update status in-memory for response
        for (const s of rows as any[]) {
          for (const a of (s.assignments || [])) {
            if (a.status === 'PENDING' && a.asset?.id) {
              const key = `${a.asset.id}_${String(s.date).slice(0, 10)}`;
              if (doneSet.has(key)) {
                a.status = 'DONE';
              }
            }
          }
        }
      }
    }

    return res.json(rows);
  } catch (err) {
    console.error('[daily-checklist-schedules GET]', err);
    return res.status(500).json({ message: 'Failed to list schedules' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/daily-checklist-schedules/:id
// ─────────────────────────────────────────────────────────────────────────────
router.get('/daily-checklist-schedules/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const s = await scheduleRepo()
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.site', 'site')
      .leftJoinAndSelect('s.createdBy', 'cb')
      .leftJoinAndSelect('s.assignments', 'a')
      .leftJoinAndSelect('a.asset', 'asset')
      .leftJoinAndSelect('asset.jenis_alat', 'jenisAlat')
      .leftJoinAndSelect('a.user', 'u')
      .where('s.id = :id', { id: req.params.id })
      .getOne();
    if (!s) return res.status(404).json({ message: 'Schedule not found' });
    return res.json(s);
  } catch (err) {
    console.error('[daily-checklist-schedules GET/:id]', err);
    return res.status(500).json({ message: 'Failed to get schedule' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/daily-checklist-schedules
// Body: { date, site_id, assignments: [{ asset_id, user_id }] }
// Upserts the schedule (date+site unique) and replaces its assignments atomically.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/daily-checklist-schedules', authMiddleware, async (req: Request, res: Response) => {
  const { date, site_id, assignments = [] } = req.body || {};
  if (!date) return res.status(400).json({ message: 'date is required (YYYY-MM-DD)' });
  if (!Array.isArray(assignments) || assignments.length === 0) {
    return res.status(400).json({ message: 'assignments array is required and must not be empty' });
  }

  const callerUserId: string | undefined = (req as any).user?.id;

  await AppDataSource.transaction(async manager => {
    const sRepo = manager.getRepository(DailyChecklistSchedule);
    const aRepo = manager.getRepository(DailyChecklistAssignment);

    // Resolve site
    let site: MasterSite | null = null;
    if (site_id) {
      site = await manager.getRepository(MasterSite).findOneBy({ id: Number(site_id) } as any);
      if (!site) throw Object.assign(new Error('Site not found'), { statusCode: 404 });
    }

    // Upsert schedule (unique per date+site)
    let schedule = await sRepo
      .createQueryBuilder('s')
      .where('s.date = :date', { date })
      .andWhere(site ? 'site.id = :sid' : 'site IS NULL', site ? { sid: site.id } : {})
      .leftJoin('s.site', 'site')
      .getOne();

    if (!schedule) {
      schedule = sRepo.create({ date, status: 'PUBLISHED' } as any) as unknown as DailyChecklistSchedule;
    }
    if (site) (schedule as any).site = site;
    if (callerUserId) {
      const caller = await manager.getRepository(User).findOneBy({ id: callerUserId } as any);
      if (caller) (schedule as any).createdBy = caller;
    }
    schedule = await sRepo.save(schedule as any);

    // Replace assignments: delete existing, insert new
    await aRepo.createQueryBuilder()
      .delete()
      .from(DailyChecklistAssignment)
      .where('schedule_id = :sid', { sid: (schedule as any).id })
      .execute();

    const toInsert: DailyChecklistAssignment[] = [];
    for (const entry of assignments) {
      const { asset_id, user_id } = entry;
      if (!asset_id || !user_id) continue;

      const asset = await manager.getRepository(MasterAlat).findOneBy({ id: Number(asset_id) } as any);
      const user  = await manager.getRepository(User).findOneBy({ id: String(user_id) } as any);
      if (!asset || !user) continue;

      const a = aRepo.create({
        schedule: schedule as any,
        asset,
        user,
        status: 'PENDING',
      } as any);
      toInsert.push(a as any);
    }
    if (toInsert.length > 0) await aRepo.save(toInsert);
    return schedule;
  }).then(async (schedule: any) => {
    // reload with relations for response
    const full = await scheduleRepo()
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.site', 'site')
      .leftJoinAndSelect('s.createdBy', 'cb')
      .leftJoinAndSelect('s.assignments', 'a')
      .leftJoinAndSelect('a.asset', 'asset')
      .leftJoinAndSelect('a.user', 'u')
      .where('s.id = :id', { id: (schedule as any).id })
      .getOne();
    return res.status(201).json({ message: 'saved', data: full });
  }).catch((err: any) => {
    console.error('[daily-checklist-schedules POST]', err);
    const code = err?.statusCode || 500;
    return res.status(code).json({ message: err?.message || 'Failed to save schedule' });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/daily-checklist-schedules/:id/status
// Body: { status: 'PUBLISHED' | 'DONE' }
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/daily-checklist-schedules/:id/status', authMiddleware, async (req: Request, res: Response) => {
  const VALID = ['PUBLISHED', 'DONE'];
  const { status } = req.body || {};
  if (!status || !VALID.includes(status)) {
    return res.status(400).json({ message: `status must be one of ${VALID.join(', ')}` });
  }
  try {
    const s = await scheduleRepo().findOneBy({ id: req.params.id } as any);
    if (!s) return res.status(404).json({ message: 'Schedule not found' });
    s.status = status;
    await scheduleRepo().save(s as any);
    return res.json({ message: 'updated', status });
  } catch (err) {
    console.error('[daily-checklist-schedules PATCH status]', err);
    return res.status(500).json({ message: 'Failed to update status' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/daily-checklist-assignments/:id/status
// Body: { status: 'DONE' | 'SKIPPED', notes? }
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/daily-checklist-assignments/:id/status', authMiddleware, async (req: Request, res: Response) => {
  const VALID = ['PENDING', 'DONE', 'SKIPPED'];
  const { status, notes } = req.body || {};
  if (!status || !VALID.includes(status)) {
    return res.status(400).json({ message: `status must be one of ${VALID.join(', ')}` });
  }
  try {
    const a = await assignRepo().findOneBy({ id: req.params.id } as any);
    if (!a) return res.status(404).json({ message: 'Assignment not found' });
    a.status = status;
    if (notes !== undefined) a.notes = notes;
    if (status === 'DONE') (a as any).completedAt = new Date();
    await assignRepo().save(a as any);
    return res.json({ message: 'updated', status });
  } catch (err) {
    console.error('[daily-checklist-assignments PATCH status]', err);
    return res.status(500).json({ message: 'Failed to update assignment status' });
  }
});

export default router;
