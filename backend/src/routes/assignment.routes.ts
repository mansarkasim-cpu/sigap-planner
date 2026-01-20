// filepath: backend/src/routes/assignment.routes.ts
import { Router, Request, Response } from "express";
import { AppDataSource } from "../ormconfig";
import { Assignment } from "../entities/Assignment";
import { WorkOrder } from "../entities/WorkOrder";
import { Task } from "../entities/Task";
import { ShiftGroup } from "../entities/ShiftGroup";
import { authMiddleware } from "../middleware/auth";
import { computeWorkOrderProgress } from "../services/workOrderService";
import { validate, IsNotEmpty, IsUUID, IsOptional, IsISO8601 } from "class-validator";
import { debug } from "console";

class CreateAssignmentDTO {
  @IsNotEmpty()
  wo_id!: string;

  // assigned_to may be a single UUID or an array of UUIDs
  @IsNotEmpty()
  assigned_to!: string | string[];

  @IsOptional()
  @IsISO8601()
  scheduled_start?: string;

  @IsOptional()
  task_id?: string;

  @IsOptional()
  task_name?: string;
}

const router = Router();

/**
 * POST /api/assignment
 */
router.post("/assignment", authMiddleware, async (req: Request, res: Response) => {
  try {
    const dto = Object.assign(new CreateAssignmentDTO(), req.body || {});
    const errors = await validate(dto);
    if (errors.length > 0) return res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid input", details: errors });

    const woRepo = AppDataSource.getRepository(WorkOrder);
    // try common lookups: by id (uuid), by doc_no, or by sigap_id (numeric)
    let wo = await woRepo.findOneBy({ id: String(dto.wo_id) } as any);
    if (!wo) {
      // try doc_no
      wo = await woRepo.findOneBy({ doc_no: String(dto.wo_id) } as any);
    }
    if (!wo) {
      // try numeric sigap_id
      const asNum = Number(dto.wo_id);
      if (!Number.isNaN(asNum)) {
        wo = await woRepo.findOneBy({ sigap_id: asNum } as any);
      }
    }
    if (!wo) return res.status(404).json({ code: "NOT_FOUND", message: "Work order not found" });

    const assignmentRepo = AppDataSource.getRepository(Assignment);
    const assigned = Array.isArray(dto.assigned_to) ? dto.assigned_to : [dto.assigned_to as string];
    const created: any[] = [];
    // For DAILY work orders, enforce single-technician semantics by cancelling existing active assignments
    try {
      if ((wo as any).work_type === 'DAILY') {
        await assignmentRepo.createQueryBuilder()
          .update(Assignment)
          .set({ status: 'CANCELLED' })
          .where('wo_id = :wo AND status IN (:...st)', { wo: String(wo.id), st: ['ASSIGNED', 'DEPLOYED', 'IN_PROGRESS'] })
          .execute();
      }
    } catch (e) {
      console.warn('Failed to cancel existing assignments for DAILY workorder', e);
    }
    for (const assignee of assigned) {
      const a = new Assignment();
      a.wo = wo as any;
      a.assigneeId = assignee;
      a.scheduledAt = dto.scheduled_start ? new Date(dto.scheduled_start) : undefined;
      a.status = "ASSIGNED";
      a.task_id = dto.task_id;
      a.task_name = dto.task_name;
      const saved = await assignmentRepo.save(a);
      created.push(saved);
    }

    // Optionally update work order status to ASSIGNED if currently NEW
    try {
      const woRepo = AppDataSource.getRepository(WorkOrder);
      if ((wo as any).status === 'NEW') {
        (wo as any).status = 'ASSIGNED';
        await woRepo.save(wo as any);
      }
    } catch (e) {
      console.warn('Failed to update workorder status after assignment', e);
    }

    return res.status(201).json({ created });
    } catch (err) {
    console.error('Error creating assignment:', err && (err as any).message ? (err as any).message : err);
    if (err && (err as any).stack) console.error((err as any).stack);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to create assignment" });
  }
});

/**
 * GET /api/assignments
 * optional query: user (assignee id), status
 */
router.get("/assignments", authMiddleware, async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Assignment);
    const qb = repo.createQueryBuilder("a").leftJoinAndSelect("a.wo", "wo");
    if (req.query.user) qb.andWhere("a.assigneeId = :user", { user: String(req.query.user) });
    if (req.query.status) qb.andWhere("a.status = :status", { status: String(req.query.status) });
    // log the generated SQL and parameters for debugging
    try {
      const queryAndParams = (qb as any).getQueryAndParameters ? (qb as any).getQueryAndParameters() : null;
      if (queryAndParams) {
        console.debug('Assignments query SQL:', queryAndParams[0]);
        console.debug('Assignments query params:', queryAndParams[1]);
      } else {
        const sql = (qb as any).getSql ? (qb as any).getSql() : (qb as any).getQuery ? (qb as any).getQuery() : null;
        const params = (qb as any).getParameters ? (qb as any).getParameters() : null;
        console.debug('Assignments query SQL (fallback):', sql);
        console.debug('Assignments query params (fallback):', params);
      }
    } catch (e) {
      console.warn('Failed to get query string from QueryBuilder', e);
    }

    const items = await qb.orderBy("a.createdAt", "DESC").getMany();
    console.debug('Assignments fetched:', Array.isArray(items) ? items.length : 'unknown');
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to list assignments" });
  }
});

/**
 * GET /api/assignments/for-tech
 * If `user` query param provided, use that; otherwise use authenticated user id.
 * Returns assignments where related work order is DEPLOYED or IN_PROGRESS and includes related work order and task info.
 */
router.get('/assignments/for-tech', authMiddleware, async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Assignment);
    const userId = String(req.query.user ?? (req as any).user?.id ?? '');
    if (!userId) return res.status(400).json({ code: 'INVALID', message: 'user id required' });
    const qb = repo.createQueryBuilder('a')
      .leftJoinAndSelect('a.wo', 'wo')
      .where('a.assigneeId = :userId', { userId })
      .andWhere('wo.status IN (:...statuses)', { statuses: ['DEPLOYED', 'IN_PROGRESS'] })
      .orderBy('a.createdAt', 'DESC');

    // log the generated SQL and parameters for debugging (for-tech)
    try {
      const queryAndParams = (qb as any).getQueryAndParameters ? (qb as any).getQueryAndParameters() : null;
      if (queryAndParams) {
        console.debug('for-tech Assignments query SQL:', queryAndParams[0]);
        console.debug('for-tech Assignments query params:', queryAndParams[1]);
      } else {
        const sql = (qb as any).getSql ? (qb as any).getSql() : (qb as any).getQuery ? (qb as any).getQuery() : null;
        const params = (qb as any).getParameters ? (qb as any).getParameters() : null;
        console.debug('for-tech Assignments query SQL (fallback):', sql);
        console.debug('for-tech Assignments query params (fallback):', params);
      }
    } catch (e) {
      console.warn('Failed to get for-tech query string from QueryBuilder', e);
    }

    const items = await qb.getMany();
    console.debug('for-tech Assignments fetched:', Array.isArray(items) ? items.length : 'unknown');

    // fetch related tasks if any task_id present
    const taskIds = Array.from(new Set(items.map(i => i.task_id).filter(Boolean)));
    let tasks: any[] = [];
    if (taskIds.length > 0) {
      const taskRepo = AppDataSource.getRepository(Task);
      tasks = await taskRepo.createQueryBuilder('t').where('t.id IN (:...ids)', { ids: taskIds }).getMany();
    }

    // compute progress per workorder and attach to the returned workorder object
    try {
      const woIds = Array.from(new Set(items.map(i => (i.wo && (i.wo as any).id) ? String((i.wo as any).id) : '').filter(Boolean)));
      const progressMap: Record<string, number> = {};
      await Promise.all(woIds.map(async (wid) => {
        try {
          const p = await computeWorkOrderProgress(wid);
          progressMap[wid] = p;
        } catch (e) {
          progressMap[wid] = 0;
        }
      }));

      // convert items to plain objects and attach progress to their wo object
      const assignmentsOut = items.map(it => {
        try {
          const plain = JSON.parse(JSON.stringify(it));
          if (plain.wo && plain.wo.id) {
            plain.wo.progress = progressMap[String(plain.wo.id)] ?? 0;
          }
          return plain;
        } catch (e) {
          return it;
        }
      });

      return res.json({ assignments: assignmentsOut, tasks });
    } catch (e) {
      console.warn('Failed to attach progress to assignments response', e);
      return res.json({ assignments: items, tasks });
    }
  } catch (err) {
    console.error('for-tech assignments', err);
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to list for-tech assignments' });
  }
});

/**
 * GET /api/assignments/for-group
 * Query: groupId
 * Returns assignments for all members of a group (DEPLOYED or IN_PROGRESS)
 */
router.get('/assignments/for-group', authMiddleware, async (req: Request, res: Response) => {
  try {
    const groupId = String(req.query.groupId || req.query.group || '');
    if (!groupId) return res.status(400).json({ code: 'INVALID', message: 'groupId required' });

    const groupRepo = AppDataSource.getRepository(ShiftGroup);
    const g = await groupRepo.findOneBy({ id: groupId } as any);
    if (!g) return res.status(404).json({ message: 'Group not found' });

    const members = Array.isArray(g.members) ? g.members.map(String) : [];
    if (members.length === 0) return res.json({ assignments: [], tasks: [] });

    const repo = AppDataSource.getRepository(Assignment);
    const qb = repo.createQueryBuilder('a')
      .leftJoinAndSelect('a.wo', 'wo')
      .where('a.assigneeId IN (:...members)', { members })
      .andWhere('wo.status IN (:...statuses)', { statuses: ['DEPLOYED', 'IN_PROGRESS'] })
      .orderBy('a.createdAt', 'DESC');

    const items = await qb.getMany();

    // fetch related tasks if any task_id present
    const taskIds = Array.from(new Set(items.map(i => i.task_id).filter(Boolean)));
    let tasks: any[] = [];
    if (taskIds.length > 0) {
      const taskRepo = AppDataSource.getRepository(Task);
      tasks = await taskRepo.createQueryBuilder('t').where('t.id IN (:...ids)', { ids: taskIds }).getMany();
    }

    // compute progress per workorder and attach to the returned workorder object
    try {
      const woIds = Array.from(new Set(items.map(i => (i.wo && (i.wo as any).id) ? String((i.wo as any).id) : '').filter(Boolean)));
      const progressMap: Record<string, number> = {};
      await Promise.all(woIds.map(async (wid) => {
        try {
          const p = await computeWorkOrderProgress(wid);
          progressMap[wid] = p;
        } catch (e) {
          progressMap[wid] = 0;
        }
      }));

      const assignmentsOut = items.map(it => {
        try {
          const plain = JSON.parse(JSON.stringify(it));
          if (plain.wo && plain.wo.id) {
            plain.wo.progress = progressMap[String(plain.wo.id)] ?? 0;
          }
          return plain;
        } catch (e) {
          return it;
        }
      });

      return res.json({ assignments: assignmentsOut, tasks });
    } catch (e) {
      console.warn('Failed to attach progress to assignments response', e);
      return res.json({ assignments: items, tasks });
    }
  } catch (err) {
    console.error('for-group assignments', err);
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to list for-group assignments' });
  }
});

/**
 * PATCH /api/assignments/:id
 * body: { status?: string }
 */
router.patch('/assignments/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body || {};
    const repo = AppDataSource.getRepository(Assignment);
    const a = await repo.findOne({ where: { id }, relations: ['wo'] as any });
    if (!a) return res.status(404).json({ code: 'NOT_FOUND', message: 'Assignment not found' });
    if (status) a.status = status;
    // if marking IN_PROGRESS, set startedAt if not already set
    if (status === 'IN_PROGRESS' && !a.startedAt) {
      (a as any).startedAt = new Date();
    }
    const saved = await repo.save(a as any);

    // If assignment moved to IN_PROGRESS, also update the related WorkOrder status
    try {
      if (status === 'IN_PROGRESS' && a.wo) {
        const woRepo = AppDataSource.getRepository(WorkOrder);
        const wo = await woRepo.findOneBy({ id: (a.wo as any).id } as any);
        if (wo) {
          (wo as any).status = 'IN_PROGRESS';
          await woRepo.save(wo as any);
        }
      }
    } catch (e) {
      console.warn('Failed to update WorkOrder status after assignment update', e);
    }

    return res.json({ message: 'updated', data: saved });
  } catch (err) {
    console.error('update assignment', err);
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to update assignment' });
  }
});

export default router;