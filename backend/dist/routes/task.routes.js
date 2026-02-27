"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ormconfig_1 = require("../ormconfig");
const Task_1 = require("../entities/Task");
const TaskAssignment_1 = require("../entities/TaskAssignment");
const WorkOrder_1 = require("../entities/WorkOrder");
const auth_1 = require("../middleware/auth");
const realisasi_dto_1 = require("../dto/realisasi.dto");
const class_validator_1 = require("class-validator");
const router = (0, express_1.Router)();
// GET /api/work-orders/:id/tasks
router.get('/work-orders/:id/tasks', auth_1.authMiddleware, async (req, res) => {
    try {
        const workOrderId = req.params.id;
        const repo = ormconfig_1.AppDataSource.getRepository(Task_1.Task);
        const rows = await repo.createQueryBuilder('t')
            .leftJoinAndSelect('t.assignments', 'a')
            .leftJoinAndSelect('a.user', 'u')
            .where('t.workOrder = :wo', { wo: workOrderId })
            .orderBy('t.task_number', 'ASC')
            .getMany();
        // compute per-task realisasi counts by joining task->realisasi for this workorder
        try {
            const counts = await ormconfig_1.AppDataSource.query(`SELECT t.id AS task_id, t.name AS task_name, COUNT(r.id) AS realisasi_count
         FROM task t
         JOIN realisasi r ON r.task_id = t.id
         WHERE t.work_order_id = $1
         GROUP BY t.id, t.name`, [workOrderId]);
            console.debug('[tasks] realisasi counts rows:', counts);
            // create quick lookup by task_id and by lower(task_name)
            const byId = {};
            const byName = {};
            for (const c of counts || []) {
                const tid = c.task_id ? String(c.task_id).toString().trim().toLowerCase() : '';
                const tname = c.task_name ? String(c.task_name).trim().toLowerCase() : '';
                const n = Number(c.realisasi_count || 0);
                if (tid)
                    byId[tid] = (byId[tid] || 0) + n;
                if (tname)
                    byName[tname] = (byName[tname] || 0) + n;
            }
            // compute pending counts (pending_realisasi table) grouped by task
            const pendingRows = await ormconfig_1.AppDataSource.query(`SELECT t.id AS task_id, t.name AS task_name, COUNT(p.id) AS pending_count
         FROM task t
         JOIN pending_realisasi p ON p.task_id = t.id
         WHERE t.work_order_id = $1 AND p.status = 'PENDING'
         GROUP BY t.id, t.name`, [workOrderId]);
            console.debug('[tasks] pending counts rows:', pendingRows);
            const byIdPending = {};
            const byNamePending = {};
            for (const c of pendingRows || []) {
                const tid = c.task_id ? String(c.task_id).toString().trim().toLowerCase() : '';
                const tname = c.task_name ? String(c.task_name).trim().toLowerCase() : '';
                const n = Number(c.pending_count || 0);
                if (tid)
                    byIdPending[tid] = (byIdPending[tid] || 0) + n;
                if (tname)
                    byNamePending[tname] = (byNamePending[tname] || 0) + n;
            }
            for (const t of rows) {
                // consider both external_id (legacy SIGAP id) and UUID `id` when matching assignment.task_id
                const extId = t.external_id ? String(t.external_id).toString().trim().toLowerCase() : '';
                const uuid = t.id ? String(t.id).toString().trim().toLowerCase() : '';
                const tname = (t.name ?? '').toString().trim().toLowerCase();
                const keys = Array.from(new Set([extId, uuid].filter(Boolean)));
                let cntById = 0;
                for (const k of keys) {
                    if (k && byId[k])
                        cntById += byId[k];
                }
                console.debug('[tasks] task keys:', keys, 'name:', tname, 'cntById:', cntById);
                t.realisasi_count = cntById;
                t.has_realisasi = cntById > 0;
                let pendById = 0;
                for (const k of keys) {
                    if (k && byIdPending[k])
                        pendById += byIdPending[k];
                }
                t.pending_realisasi_count = pendById;
                t.has_pending = pendById > 0;
            }
        }
        catch (e) {
            console.warn('failed to compute per-task realisasi counts', e);
            for (const t of rows) {
                t.realisasi_count = 0;
                t.has_realisasi = false;
            }
        }
        // ensure `task_number` is present in response objects (explicitly include null when missing)
        return res.json((rows || []).map(r => ({ ...r, task_number: r.task_number ?? null })));
    }
    catch (err) {
        console.error('list tasks', err);
        return res.status(500).json({ message: 'Failed to list tasks' });
    }
});
// GET /api/work-orders/:id/realisasi - summary of realisasi times for a workorder
router.get('/work-orders/:id/realisasi', auth_1.authMiddleware, async (req, res) => {
    try {
        const workOrderId = req.params.id;
        // aggregate min(start_time) and max(end_time) from realisasi via tasks
        const agg = await ormconfig_1.AppDataSource.query(`SELECT MIN(r.start_time) AS actual_start, MAX(r.end_time) AS actual_end
         FROM realisasi r
         JOIN task t ON r.task_id = t.id
         WHERE t.work_order_id = $1`, [workOrderId]);
        const rows = await ormconfig_1.AppDataSource.query(`SELECT r.id, r.start_time, r.end_time, r.task_id
         FROM realisasi r
         JOIN task t ON r.task_id = t.id
         WHERE t.work_order_id = $1
         ORDER BY r.start_time ASC`, [workOrderId]);
        const actualStart = agg && agg[0] && agg[0].actual_start ? new Date(agg[0].actual_start).toISOString() : null;
        const actualEnd = agg && agg[0] && agg[0].actual_end ? new Date(agg[0].actual_end).toISOString() : null;
        const items = (rows || []).map((r) => ({ id: r.id, start: r.start_time ? new Date(r.start_time).toISOString() : null, end: r.end_time ? new Date(r.end_time).toISOString() : null, taskId: r.task_id }));
        return res.json({ actualStart, actualEnd, items });
    }
    catch (e) {
        console.error('failed to fetch realisasi summary for workorder', e);
        return res.status(500).json({ message: 'Failed to fetch realisasi summary' });
    }
});
// GET /api/work-orders/:id/realisasi/full - detailed realisasi entries with notes and photo
router.get('/work-orders/:id/realisasi/full', auth_1.authMiddleware, async (req, res) => {
    try {
        const workOrderId = req.params.id;
        const rows = await ormconfig_1.AppDataSource.query(`SELECT r.id, r.start_time, r.end_time, r.notes, r.photo_url, r.signature_url, r.task_id, t.id AS task_id_alt, t.name AS task_name, ta.user_id, u.name AS user_name, u.nipp AS user_nipp
         FROM realisasi r
         JOIN task t ON r.task_id = t.id
         LEFT JOIN task_assignment ta ON ta.task_id = t.id
         LEFT JOIN "user" u ON (ta.user_id = u.id)
         WHERE t.work_order_id = $1
         ORDER BY r.start_time ASC`, [workOrderId]);
        const items = (rows || []).map((r) => ({
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
    }
    catch (e) {
        console.error('failed to fetch full realisasi entries for workorder', e);
        return res.status(500).json({ message: 'Failed to fetch realisasi entries' });
    }
});
// PATCH /api/work-orders/:woId/realisasi/:rid - update realisasi (start/end/notes) and record history
router.patch('/work-orders/:woId/realisasi/:rid', auth_1.authMiddleware, async (req, res) => (0, realisasi_dto_1.updateRealisasi)(req, res));
// GET /api/work-orders/:woId/realisasi/:rid/history - fetch edit history for a realisasi
router.get('/work-orders/:woId/realisasi/:rid/history', auth_1.authMiddleware, async (req, res) => (0, realisasi_dto_1.getRealisasiHistory)(req, res));
class CreateTaskDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTaskDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTaskDTO.prototype, "duration_min", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTaskDTO.prototype, "description", void 0);
// POST /api/work-orders/:id/tasks
router.post('/work-orders/:id/tasks', auth_1.authMiddleware, async (req, res) => {
    try {
        const workOrderId = req.params.id;
        const dto = Object.assign(new CreateTaskDTO(), req.body || {});
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0)
            return res.status(400).json({ code: 'VALIDATION_ERROR', details: errors });
        const repo = ormconfig_1.AppDataSource.getRepository(Task_1.Task);
        const t = repo.create({ name: dto.name, duration_min: dto.duration_min, description: dto.description, workOrder: { id: workOrderId } });
        const saved = await repo.save(t);
        return res.status(201).json({ message: 'created', data: saved });
    }
    catch (err) {
        console.error('create task', err);
        return res.status(500).json({ message: 'Failed to create task' });
    }
});
// POST /api/tasks/:id/assign
router.post('/tasks/:id/assign', auth_1.authMiddleware, async (req, res) => {
    try {
        const taskId = req.params.id;
        const { userId, assignedBy } = req.body || {};
        if (!userId)
            return res.status(400).json({ message: 'userId required' });
        const repo = ormconfig_1.AppDataSource.getRepository(TaskAssignment_1.TaskAssignment);
        // Prevent duplicate assignment for same task+user
        try {
            const existing = await repo.createQueryBuilder('a')
                .where('a.task_id = :taskId AND a.user_id = :userId', { taskId, userId })
                .getOne();
            if (existing) {
                return res.status(409).json({ message: 'User already assigned to this task', data: existing });
            }
        }
        catch (e) {
            // fallthrough to attempt save if query fails for some reason
        }
        const a = repo.create({ task: { id: taskId }, user: { id: userId }, assignedBy });
        const saved = await repo.save(a);
        // fetch task + workorder so we can mirror assignment and update wo status
        const taskRepo = ormconfig_1.AppDataSource.getRepository(Task_1.Task);
        const t = await taskRepo.findOne({ where: { id: taskId }, relations: ['workOrder'] });
        const woId = t?.workOrder?.id;
        // Mirror Assignment creation is handled by `TaskAssignmentSubscriber`.
        // after assignment, update work order status based on number of assigned tasks
        try {
            const taskRepo = ormconfig_1.AppDataSource.getRepository(Task_1.Task);
            const t = await taskRepo.findOne({ where: { id: taskId }, relations: ['workOrder'] });
            const woId = t?.workOrder?.id;
            if (woId) {
                const tasks = await taskRepo.createQueryBuilder('t')
                    .leftJoinAndSelect('t.assignments', 'a')
                    .where('t.workOrder = :wo', { wo: woId })
                    .orderBy('t.task_number', 'ASC')
                    .getMany();
                const total = tasks.length;
                const assignedCount = tasks.filter(x => x.assignments && x.assignments.length > 0).length;
                const woRepo = ormconfig_1.AppDataSource.getRepository(WorkOrder_1.WorkOrder);
                const wo = await woRepo.findOneBy({ id: woId });
                if (wo) {
                    // preserve current IN_PROGRESS or PREPARATION status
                    const currentStatus = (wo.status || '').toString();
                    if (currentStatus !== 'IN_PROGRESS' && currentStatus !== 'PREPARATION') {
                        if (total === 0) {
                            wo.status = 'NEW';
                        }
                        else if (assignedCount === 0) {
                            wo.status = 'NEW';
                        }
                        else if (assignedCount < total) {
                            wo.status = 'ASSIGNED';
                        }
                        else if (assignedCount === total) {
                            wo.status = 'READY_TO_DEPLOY';
                        }
                        if (wo.status)
                            await woRepo.save(wo);
                    }
                    else {
                        // keep existing status (IN_PROGRESS or PREPARATION)
                    }
                }
            }
        }
        catch (e) {
            console.warn('post-assign status update check failed', e);
        }
        return res.status(201).json({ message: 'assigned', data: saved });
    }
    catch (err) {
        console.error('assign task', err);
        return res.status(500).json({ message: 'Failed to assign' });
    }
});
// DELETE /api/tasks/:id/assign/:assignId
router.delete('/tasks/:id/assign/:assignId', auth_1.authMiddleware, async (req, res) => {
    try {
        const assignId = req.params.assignId;
        const repo = ormconfig_1.AppDataSource.getRepository(TaskAssignment_1.TaskAssignment);
        // load assignment with task relation so we can inspect the workorder status
        const a = await repo.findOne({ where: { id: assignId }, relations: ['task'] });
        if (!a)
            return res.status(404).json({ message: 'Not found' });
        // check related workorder status and prevent unassign if IN_PROGRESS
        try {
            const taskRepo = ormconfig_1.AppDataSource.getRepository(Task_1.Task);
            const t = await taskRepo.findOne({ where: { id: a.task?.id }, relations: ['workOrder'] });
            const woStatus = t?.workOrder?.status;
            if (woStatus === 'IN_PROGRESS') {
                return res.status(400).json({ message: 'Cannot unassign while WorkOrder is IN_PROGRESS' });
            }
        }
        catch (e) {
            console.warn('pre-unassign workorder check failed', e);
        }
        // capture task/workorder id before deletion
        const taskId = a.task?.id;
        await repo.remove(a);
        // after deletion, ensure workorder status reflects assignments
        try {
            if (taskId) {
                const taskRepo = ormconfig_1.AppDataSource.getRepository(Task_1.Task);
                const t = await taskRepo.findOne({ where: { id: taskId }, relations: ['workOrder'] });
                const woId = t?.workOrder?.id;
                if (woId) {
                    const tasks = await taskRepo.createQueryBuilder('t')
                        .leftJoinAndSelect('t.assignments', 'a')
                        .where('t.workOrder = :wo', { wo: woId })
                        .orderBy('t.task_number', 'ASC')
                        .getMany();
                    const total = tasks.length;
                    const assignedCount = tasks.filter(x => x.assignments && x.assignments.length > 0).length;
                    const woRepo = ormconfig_1.AppDataSource.getRepository(WorkOrder_1.WorkOrder);
                    const wo = await woRepo.findOneBy({ id: woId });
                    if (wo) {
                        // preserve current IN_PROGRESS or PREPARATION status
                        const currentStatus = (wo.status || '').toString();
                        if (currentStatus !== 'IN_PROGRESS' && currentStatus !== 'PREPARATION') {
                            if (total === 0) {
                                wo.status = 'NEW';
                            }
                            else if (assignedCount === 0) {
                                wo.status = 'NEW';
                            }
                            else if (assignedCount < total) {
                                wo.status = 'ASSIGNED';
                            }
                            else if (assignedCount === total) {
                                wo.status = 'READY_TO_DEPLOY';
                            }
                            if (wo.status)
                                await woRepo.save(wo);
                        }
                        else {
                            // keep existing status (IN_PROGRESS or PREPARATION)
                        }
                    }
                }
            }
        }
        catch (e) {
            console.warn('post-unassign status check failed', e);
        }
        return res.json({ message: 'deleted' });
    }
    catch (err) {
        console.error('delete assignment', err);
        return res.status(500).json({ message: 'Failed to delete assignment' });
    }
});
// DELETE /api/tasks/:id
router.delete('/tasks/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskRepo = ormconfig_1.AppDataSource.getRepository(Task_1.Task);
        const aRepo = ormconfig_1.AppDataSource.getRepository(TaskAssignment_1.TaskAssignment);
        const task = await taskRepo.findOne({ where: { id: taskId }, relations: ['assignments', 'workOrder'] });
        if (!task)
            return res.status(404).json({ message: 'Not found' });
        // prevent deletion when realisasi exists for this task
        try {
            const realRows = await ormconfig_1.AppDataSource.query('SELECT id FROM realisasi WHERE task_id = $1 LIMIT 1', [taskId]);
            if (realRows && realRows.length > 0)
                return res.status(400).json({ message: 'Cannot delete task with realisasi' });
        }
        catch (e) {
            console.warn('failed to check realisasi for task delete', e);
        }
        // remove assignments first
        try {
            if (Array.isArray(task.assignments) && task.assignments.length > 0) {
                await aRepo.remove(task.assignments);
            }
        }
        catch (e) {
            console.warn('failed to remove assignments before deleting task', e);
        }
        // finally remove task
        await taskRepo.remove(task);
        // update related workorder status similar to assignment deletion logic
        try {
            const woId = task.workOrder?.id;
            if (woId) {
                const tasks = await taskRepo.createQueryBuilder('t')
                    .leftJoinAndSelect('t.assignments', 'a')
                    .where('t.workOrder = :wo', { wo: woId })
                    .orderBy('t.task_number', 'ASC')
                    .getMany();
                const total = tasks.length;
                const assignedCount = tasks.filter(x => x.assignments && x.assignments.length > 0).length;
                const woRepo = ormconfig_1.AppDataSource.getRepository(WorkOrder_1.WorkOrder);
                const wo = await woRepo.findOneBy({ id: woId });
                if (wo) {
                    if (total === 0) {
                        wo.status = 'NEW';
                    }
                    else if (assignedCount === 0) {
                        wo.status = 'NEW';
                    }
                    else if (assignedCount < total) {
                        wo.status = 'ASSIGNED';
                    }
                    else if (assignedCount === total) {
                        wo.status = 'READY_TO_DEPLOY';
                    }
                    if (wo.status)
                        await woRepo.save(wo);
                }
            }
        }
        catch (e) {
            console.warn('post-delete task workorder status update failed', e);
        }
        return res.json({ message: 'deleted' });
    }
    catch (err) {
        console.error('delete task', err);
        return res.status(500).json({ message: 'Failed to delete task' });
    }
});
exports.default = router;
