import { Router, Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { Task } from '../entities/Task';
import { Assignment } from '../entities/Assignment';
import { TaskAssignment } from '../entities/TaskAssignment';
import { WorkOrder } from '../entities/WorkOrder';
import { authMiddleware } from '../middleware/auth';
import { validate, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

const router = Router();

// GET /api/work-orders/:id/tasks
router.get('/work-orders/:id/tasks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const workOrderId = req.params.id;
    const repo = AppDataSource.getRepository(Task);
    const rows = await repo.createQueryBuilder('t')
      .leftJoinAndSelect('t.assignments', 'a')
      .leftJoinAndSelect('a.user', 'u')
      .where('t.workOrder = :wo', { wo: workOrderId })
      .getMany();

    // compute per-task realisasi counts by joining task->realisasi for this workorder
    try {
      const counts = await AppDataSource.query(
        `SELECT t.id AS task_id, t.name AS task_name, COUNT(r.id) AS realisasi_count
         FROM task t
         JOIN realisasi r ON r.task_id = t.id
         WHERE t.work_order_id = $1
         GROUP BY t.id, t.name`,
        [workOrderId]
      );

      console.debug('[tasks] realisasi counts rows:', counts);

      // create quick lookup by task_id and by lower(task_name)
      const byId: Record<string, number> = {};
      const byName: Record<string, number> = {};
      for (const c of counts || []) {
        const tid = c.task_id ? String(c.task_id).toString().trim().toLowerCase() : '';
        const tname = c.task_name ? String(c.task_name).trim().toLowerCase() : '';
        const n = Number(c.realisasi_count || 0);
        if (tid) byId[tid] = (byId[tid] || 0) + n;
        if (tname) byName[tname] = (byName[tname] || 0) + n;
      }

      // compute pending counts (pending_realisasi table) grouped by task
      const pendingRows = await AppDataSource.query(
        `SELECT t.id AS task_id, t.name AS task_name, COUNT(p.id) AS pending_count
         FROM task t
         JOIN pending_realisasi p ON p.task_id = t.id
         WHERE t.work_order_id = $1 AND p.status = 'PENDING'
         GROUP BY t.id, t.name`,
        [workOrderId]
      );

      console.debug('[tasks] pending counts rows:', pendingRows);
      const byIdPending: Record<string, number> = {};
      const byNamePending: Record<string, number> = {};
      for (const c of pendingRows || []) {
        const tid = c.task_id ? String(c.task_id).toString().trim().toLowerCase() : '';
        const tname = c.task_name ? String(c.task_name).trim().toLowerCase() : '';
        const n = Number(c.pending_count || 0);
        if (tid) byIdPending[tid] = (byIdPending[tid] || 0) + n;
        if (tname) byNamePending[tname] = (byNamePending[tname] || 0) + n;
      }

      for (const t of rows) {
        // consider both external_id (legacy SIGAP id) and UUID `id` when matching assignment.task_id
        const extId = t.external_id ? String(t.external_id).toString().trim().toLowerCase() : '';
        const uuid = t.id ? String(t.id).toString().trim().toLowerCase() : '';
        const tname = (t.name ?? '').toString().trim().toLowerCase();

        const keys = Array.from(new Set([extId, uuid].filter(Boolean)));
        let cntById = 0;
        for (const k of keys) {
          if (k && byId[k]) cntById += byId[k];
        }
        console.debug('[tasks] task keys:', keys, 'name:', tname, 'cntById:', cntById);
        (t as any).realisasi_count = cntById;
        (t as any).has_realisasi = cntById > 0;

        let pendById = 0;
        for (const k of keys) {
          if (k && byIdPending[k]) pendById += byIdPending[k];
        }
        (t as any).pending_realisasi_count = pendById;
        (t as any).has_pending = pendById > 0;
      }
    } catch (e) {
      console.warn('failed to compute per-task realisasi counts', e);
      for (const t of rows) {
        (t as any).realisasi_count = 0;
        (t as any).has_realisasi = false;
      }
    }

    return res.json(rows);
  } catch (err) {
    console.error('list tasks', err);
    return res.status(500).json({ message: 'Failed to list tasks' });
  }
});

  // GET /api/work-orders/:id/realisasi - summary of realisasi times for a workorder
  router.get('/work-orders/:id/realisasi', authMiddleware, async (req: Request, res: Response) => {
    try {
      const workOrderId = req.params.id;
      // aggregate min(start_time) and max(end_time) from realisasi via tasks
      const agg = await AppDataSource.query(
        `SELECT MIN(r.start_time) AS actual_start, MAX(r.end_time) AS actual_end
         FROM realisasi r
         JOIN task t ON r.task_id = t.id
         WHERE t.work_order_id = $1`,
        [workOrderId]
      );
      const rows = await AppDataSource.query(
        `SELECT r.id, r.start_time, r.end_time, r.task_id
         FROM realisasi r
         JOIN task t ON r.task_id = t.id
         WHERE t.work_order_id = $1
         ORDER BY r.start_time ASC`,
        [workOrderId]
      );

      const actualStart = agg && agg[0] && agg[0].actual_start ? new Date(agg[0].actual_start).toISOString() : null;
      const actualEnd = agg && agg[0] && agg[0].actual_end ? new Date(agg[0].actual_end).toISOString() : null;

      const items = (rows || []).map((r: any) => ({ id: r.id, start: r.start_time ? new Date(r.start_time).toISOString() : null, end: r.end_time ? new Date(r.end_time).toISOString() : null, taskId: r.task_id }));
      return res.json({ actualStart, actualEnd, items });
    } catch (e) {
      console.error('failed to fetch realisasi summary for workorder', e);
      return res.status(500).json({ message: 'Failed to fetch realisasi summary' });
    }
  });

  // GET /api/work-orders/:id/realisasi/full - detailed realisasi entries with notes and photo
  router.get('/work-orders/:id/realisasi/full', authMiddleware, async (req: Request, res: Response) => {
    try {
      const workOrderId = req.params.id;
      const rows = await AppDataSource.query(
        `SELECT r.id, r.start_time, r.end_time, r.notes, r.photo_url, r.signature_url, r.task_id, t.id AS task_id_alt, t.name AS task_name, ta.user_id, u.name AS user_name, u.nipp AS user_nipp
         FROM realisasi r
         JOIN task t ON r.task_id = t.id
         LEFT JOIN task_assignment ta ON ta.task_id = t.id
         LEFT JOIN "user" u ON (ta.user_id = u.id)
         WHERE t.work_order_id = $1
         ORDER BY r.start_time ASC`,
        [workOrderId]
      );

      const items = (rows || []).map((r: any) => ({
        id: r.id,
        start: r.start_time || null,
        end: r.end_time || null,
        notes: r.notes || null,
        photoUrl: r.photo_url || r.photoUrl || null,
        signatureUrl: r.signature_url || r.signatureUrl || null,
        taskId: r.task_id,
        taskName: r.task_name,
        user: { id: r.user_id, name: r.user_name, nipp: r.user_nipp }
      }));

      return res.json({ items });
    } catch (e) {
      console.error('failed to fetch full realisasi entries for workorder', e);
      return res.status(500).json({ message: 'Failed to fetch realisasi entries' });
    }
  });
class CreateTaskDTO {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  duration_min?: number;

  @IsOptional()
  description?: string;
}

// POST /api/work-orders/:id/tasks
router.post('/work-orders/:id/tasks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const workOrderId = req.params.id;
    const dto = Object.assign(new CreateTaskDTO(), req.body || {});
    const errors = await validate(dto as any);
    if (errors.length > 0) return res.status(400).json({ code: 'VALIDATION_ERROR', details: errors });
    const repo = AppDataSource.getRepository(Task);
    const t: any = repo.create({ name: dto.name, duration_min: dto.duration_min, description: dto.description, workOrder: { id: workOrderId } } as any);
    const saved = await repo.save(t);
    return res.status(201).json({ message: 'created', data: saved });
  } catch (err) {
    console.error('create task', err);
    return res.status(500).json({ message: 'Failed to create task' });
  }
});

// POST /api/tasks/:id/assign
router.post('/tasks/:id/assign', authMiddleware, async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const { userId, assignedBy } = req.body || {};
    if (!userId) return res.status(400).json({ message: 'userId required' });
    const repo = AppDataSource.getRepository(TaskAssignment);
    // Prevent duplicate assignment for same task+user
    try {
      const existing = await repo.createQueryBuilder('a')
        .where('a.task_id = :taskId AND a.user_id = :userId', { taskId, userId })
        .getOne();
      if (existing) {
        return res.status(409).json({ message: 'User already assigned to this task', data: existing });
      }
    } catch (e) {
      // fallthrough to attempt save if query fails for some reason
    }

    const a: any = repo.create({ task: { id: taskId } as any, user: { id: userId } as any, assignedBy });
    const saved = await repo.save(a);
    // fetch task + workorder so we can mirror assignment and update wo status
    const taskRepo = AppDataSource.getRepository(Task);
    const t = await taskRepo.findOne({ where: { id: taskId }, relations: ['workOrder'] as any });
    const woId = t?.workOrder?.id;
    // Mirror Assignment creation is handled by `TaskAssignmentSubscriber`.
    // after assignment, update work order status based on number of assigned tasks
    try {
      const taskRepo = AppDataSource.getRepository(Task);
      const t = await taskRepo.findOne({ where: { id: taskId }, relations: ['workOrder'] as any });
      const woId = t?.workOrder?.id;
      if (woId) {
        const tasks = await taskRepo.createQueryBuilder('t')
          .leftJoinAndSelect('t.assignments', 'a')
          .where('t.workOrder = :wo', { wo: woId })
          .getMany();
        const total = tasks.length;
        const assignedCount = tasks.filter(x => x.assignments && x.assignments.length > 0).length;
        const woRepo = AppDataSource.getRepository(WorkOrder);
        const wo = await woRepo.findOneBy({ id: woId } as any);
        if (wo) {
          // preserve current IN_PROGRESS or PREPARATION status
          const currentStatus = (wo.status || '').toString();
          if (currentStatus !== 'IN_PROGRESS' && currentStatus !== 'PREPARATION') {
            if (total === 0) {
              wo.status = 'NEW';
            } else if (assignedCount === 0) {
              wo.status = 'NEW';
            } else if (assignedCount < total) {
              wo.status = 'ASSIGNED';
            } else if (assignedCount === total) {
              wo.status = 'READY_TO_DEPLOY';
            }
            if (wo.status) await woRepo.save(wo);
          } else {
            // keep existing status (IN_PROGRESS or PREPARATION)
          }
        }
      }
    } catch (e) {
      console.warn('post-assign status update check failed', e);
    }
    return res.status(201).json({ message: 'assigned', data: saved });
  } catch (err) {
    console.error('assign task', err);
    return res.status(500).json({ message: 'Failed to assign' });
  }
});

// DELETE /api/tasks/:id/assign/:assignId
router.delete('/tasks/:id/assign/:assignId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const assignId = req.params.assignId;
    const repo = AppDataSource.getRepository(TaskAssignment);
      // load assignment with task relation so we can inspect the workorder status
      const a = await repo.findOne({ where: { id: assignId } as any, relations: ['task'] as any });
      if (!a) return res.status(404).json({ message: 'Not found' });

      // check related workorder status and prevent unassign if IN_PROGRESS
      try {
        const taskRepo = AppDataSource.getRepository(Task);
        const t = await taskRepo.findOne({ where: { id: a.task?.id }, relations: ['workOrder'] as any });
        const woStatus = t?.workOrder?.status;
        if (woStatus === 'IN_PROGRESS') {
          return res.status(400).json({ message: 'Cannot unassign while WorkOrder is IN_PROGRESS' });
        }
      } catch (e) {
        console.warn('pre-unassign workorder check failed', e);
      }

      // capture task/workorder id before deletion
      const taskId = a.task?.id as any;
      await repo.remove(a as any);
    // after deletion, ensure workorder status reflects assignments
    try {
      if (taskId) {
        const taskRepo = AppDataSource.getRepository(Task);
        const t = await taskRepo.findOne({ where: { id: taskId }, relations: ['workOrder'] as any });
        const woId = t?.workOrder?.id;
        if (woId) {
          const tasks = await taskRepo.createQueryBuilder('t')
            .leftJoinAndSelect('t.assignments', 'a')
            .where('t.workOrder = :wo', { wo: woId })
            .getMany();
          const total = tasks.length;
          const assignedCount = tasks.filter(x => x.assignments && x.assignments.length > 0).length;
          const woRepo = AppDataSource.getRepository(WorkOrder);
          const wo = await woRepo.findOneBy({ id: woId } as any);
          if (wo) {
            // preserve current IN_PROGRESS or PREPARATION status
            const currentStatus = (wo.status || '').toString();
            if (currentStatus !== 'IN_PROGRESS' && currentStatus !== 'PREPARATION') {
              if (total === 0) {
                wo.status = 'NEW';
              } else if (assignedCount === 0) {
                wo.status = 'NEW';
              } else if (assignedCount < total) {
                wo.status = 'ASSIGNED';
              } else if (assignedCount === total) {
                wo.status = 'READY_TO_DEPLOY';
              }
              if (wo.status) await woRepo.save(wo);
            } else {
              // keep existing status (IN_PROGRESS or PREPARATION)
            }
          }
        }
      }
    } catch (e) {
      console.warn('post-unassign status check failed', e);
    }
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('delete assignment', err);
    return res.status(500).json({ message: 'Failed to delete assignment' });
  }
});

// DELETE /api/tasks/:id
router.delete('/tasks/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const taskRepo = AppDataSource.getRepository(Task);
    const aRepo = AppDataSource.getRepository(TaskAssignment);

    const task = await taskRepo.findOne({ where: { id: taskId } as any, relations: ['assignments', 'workOrder'] as any });
    if (!task) return res.status(404).json({ message: 'Not found' });

    // prevent deletion when realisasi exists for this task
    try {
      const realRows = await AppDataSource.query('SELECT id FROM realisasi WHERE task_id = $1 LIMIT 1', [taskId]);
      if (realRows && realRows.length > 0) return res.status(400).json({ message: 'Cannot delete task with realisasi' });
    } catch (e) {
      console.warn('failed to check realisasi for task delete', e);
    }

    // remove assignments first
    try {
      if (Array.isArray(task.assignments) && task.assignments.length > 0) {
        await aRepo.remove(task.assignments as any);
      }
    } catch (e) {
      console.warn('failed to remove assignments before deleting task', e);
    }

    // finally remove task
    await taskRepo.remove(task as any);

    // update related workorder status similar to assignment deletion logic
    try {
      const woId = task.workOrder?.id;
      if (woId) {
        const tasks = await taskRepo.createQueryBuilder('t')
          .leftJoinAndSelect('t.assignments', 'a')
          .where('t.workOrder = :wo', { wo: woId })
          .getMany();
        const total = tasks.length;
        const assignedCount = tasks.filter(x => x.assignments && x.assignments.length > 0).length;
        const woRepo = AppDataSource.getRepository(WorkOrder);
        const wo = await woRepo.findOneBy({ id: woId } as any);
        if (wo) {
          if (total === 0) {
            wo.status = 'NEW';
          } else if (assignedCount === 0) {
            wo.status = 'NEW';
          } else if (assignedCount < total) {
            wo.status = 'ASSIGNED';
          } else if (assignedCount === total) {
            wo.status = 'READY_TO_DEPLOY';
          }
          if (wo.status) await woRepo.save(wo);
        }
      }
    } catch (e) {
      console.warn('post-delete task workorder status update failed', e);
    }

    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('delete task', err);
    return res.status(500).json({ message: 'Failed to delete task' });
  }
});

export default router;
