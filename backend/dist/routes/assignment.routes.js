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
// filepath: backend/src/routes/assignment.routes.ts
const express_1 = require("express");
const ormconfig_1 = require("../ormconfig");
const Assignment_1 = require("../entities/Assignment");
const WorkOrder_1 = require("../entities/WorkOrder");
const Task_1 = require("../entities/Task");
const ShiftGroup_1 = require("../entities/ShiftGroup");
const auth_1 = require("../middleware/auth");
const workOrderService_1 = require("../services/workOrderService");
const class_validator_1 = require("class-validator");
class CreateAssignmentDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAssignmentDTO.prototype, "wo_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateAssignmentDTO.prototype, "assigned_to", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], CreateAssignmentDTO.prototype, "scheduled_start", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssignmentDTO.prototype, "task_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssignmentDTO.prototype, "task_name", void 0);
const router = (0, express_1.Router)();
/**
 * POST /api/assignment
 */
router.post("/assignment", auth_1.authMiddleware, async (req, res) => {
    try {
        const dto = Object.assign(new CreateAssignmentDTO(), req.body || {});
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0)
            return res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid input", details: errors });
        const woRepo = ormconfig_1.AppDataSource.getRepository(WorkOrder_1.WorkOrder);
        // try common lookups: by id (uuid), by doc_no, or by sigap_id (numeric)
        let wo = await woRepo.findOneBy({ id: String(dto.wo_id) });
        if (!wo) {
            // try doc_no
            wo = await woRepo.findOneBy({ doc_no: String(dto.wo_id) });
        }
        if (!wo) {
            // try numeric sigap_id
            const asNum = Number(dto.wo_id);
            if (!Number.isNaN(asNum)) {
                wo = await woRepo.findOneBy({ sigap_id: asNum });
            }
        }
        if (!wo)
            return res.status(404).json({ code: "NOT_FOUND", message: "Work order not found" });
        const assignmentRepo = ormconfig_1.AppDataSource.getRepository(Assignment_1.Assignment);
        const assigned = Array.isArray(dto.assigned_to) ? dto.assigned_to : [dto.assigned_to];
        const created = [];
        // For DAILY work orders, enforce single-technician semantics by cancelling existing active assignments
        try {
            if (wo.work_type === 'DAILY') {
                await assignmentRepo.createQueryBuilder()
                    .update(Assignment_1.Assignment)
                    .set({ status: 'CANCELLED' })
                    .where('wo_id = :wo AND status IN (:...st)', { wo: String(wo.id), st: ['ASSIGNED', 'DEPLOYED', 'IN_PROGRESS'] })
                    .execute();
            }
        }
        catch (e) {
            console.warn('Failed to cancel existing assignments for DAILY workorder', e);
        }
        for (const assignee of assigned) {
            const a = new Assignment_1.Assignment();
            a.wo = wo;
            a.assigneeId = assignee;
            a.scheduledAt = dto.scheduled_start ? new Date(dto.scheduled_start) : undefined;
            // If the work order is already IN_PROGRESS, mark new assignment as IN_PROGRESS and set startedAt
            if (wo.status === 'IN_PROGRESS') {
                a.status = 'IN_PROGRESS';
                try {
                    a.startedAt = new Date();
                }
                catch (_) { /* ignore */ }
            }
            else {
                a.status = "ASSIGNED";
            }
            a.task_id = dto.task_id;
            a.task_name = dto.task_name;
            const saved = await assignmentRepo.save(a);
            created.push(saved);
        }
        // Optionally update work order status to ASSIGNED if currently NEW
        try {
            const woRepo = ormconfig_1.AppDataSource.getRepository(WorkOrder_1.WorkOrder);
            if (wo.status === 'NEW') {
                wo.status = 'ASSIGNED';
                await woRepo.save(wo);
            }
        }
        catch (e) {
            console.warn('Failed to update workorder status after assignment', e);
        }
        return res.status(201).json({ created });
    }
    catch (err) {
        console.error('Error creating assignment:', err && err.message ? err.message : err);
        if (err && err.stack)
            console.error(err.stack);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to create assignment" });
    }
});
/**
 * GET /api/assignments
 * optional query: user (assignee id), status
 */
router.get("/assignments", auth_1.authMiddleware, async (req, res) => {
    try {
        const repo = ormconfig_1.AppDataSource.getRepository(Assignment_1.Assignment);
        const qb = repo.createQueryBuilder("a").leftJoinAndSelect("a.wo", "wo");
        if (req.query.user)
            qb.andWhere("a.assigneeId = :user", { user: String(req.query.user) });
        if (req.query.status)
            qb.andWhere("a.status = :status", { status: String(req.query.status) });
        // log the generated SQL and parameters for debugging
        try {
            const queryAndParams = qb.getQueryAndParameters ? qb.getQueryAndParameters() : null;
            if (queryAndParams) {
                console.debug('Assignments query SQL:', queryAndParams[0]);
                console.debug('Assignments query params:', queryAndParams[1]);
            }
            else {
                const sql = qb.getSql ? qb.getSql() : qb.getQuery ? qb.getQuery() : null;
                const params = qb.getParameters ? qb.getParameters() : null;
                console.debug('Assignments query SQL (fallback):', sql);
                console.debug('Assignments query params (fallback):', params);
            }
        }
        catch (e) {
            console.warn('Failed to get query string from QueryBuilder', e);
        }
        const items = await qb.orderBy("a.createdAt", "DESC").getMany();
        console.debug('Assignments fetched:', Array.isArray(items) ? items.length : 'unknown');
        return res.json(items);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to list assignments" });
    }
});
/**
 * GET /api/assignments/for-tech
 * If `user` query param provided, use that; otherwise use authenticated user id.
 * Returns assignments where related work order is DEPLOYED or IN_PROGRESS and includes related work order and task info.
 */
router.get('/assignments/for-tech', auth_1.authMiddleware, async (req, res) => {
    try {
        const repo = ormconfig_1.AppDataSource.getRepository(Assignment_1.Assignment);
        const userId = String(req.query.user ?? req.user?.id ?? '');
        if (!userId)
            return res.status(400).json({ code: 'INVALID', message: 'user id required' });
        const qb = repo.createQueryBuilder('a')
            .leftJoinAndSelect('a.wo', 'wo')
            .where('a.assigneeId = :userId', { userId })
            .andWhere('wo.status IN (:...statuses)', { statuses: ['DEPLOYED', 'IN_PROGRESS'] })
            .orderBy('a.createdAt', 'DESC');
        // log the generated SQL and parameters for debugging (for-tech)
        try {
            const queryAndParams = qb.getQueryAndParameters ? qb.getQueryAndParameters() : null;
            if (queryAndParams) {
                console.debug('for-tech Assignments query SQL:', queryAndParams[0]);
                console.debug('for-tech Assignments query params:', queryAndParams[1]);
            }
            else {
                const sql = qb.getSql ? qb.getSql() : qb.getQuery ? qb.getQuery() : null;
                const params = qb.getParameters ? qb.getParameters() : null;
                console.debug('for-tech Assignments query SQL (fallback):', sql);
                console.debug('for-tech Assignments query params (fallback):', params);
            }
        }
        catch (e) {
            console.warn('Failed to get for-tech query string from QueryBuilder', e);
        }
        const items = await qb.getMany();
        console.debug('for-tech Assignments fetched:', Array.isArray(items) ? items.length : 'unknown');
        // fetch related tasks if any task_id present
        const taskIds = Array.from(new Set(items.map(i => i.task_id).filter(Boolean)));
        let tasks = [];
        if (taskIds.length > 0) {
            const taskRepo = ormconfig_1.AppDataSource.getRepository(Task_1.Task);
            tasks = await taskRepo.createQueryBuilder('t').where('t.id IN (:...ids)', { ids: taskIds }).getMany();
        }
        // compute progress per workorder and attach to the returned workorder object
        try {
            const woIds = Array.from(new Set(items.map(i => (i.wo && i.wo.id) ? String(i.wo.id) : '').filter(Boolean)));
            const progressMap = {};
            await Promise.all(woIds.map(async (wid) => {
                try {
                    const p = await (0, workOrderService_1.computeWorkOrderProgress)(wid);
                    progressMap[wid] = p;
                }
                catch (e) {
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
                }
                catch (e) {
                    return it;
                }
            });
            return res.json({ assignments: assignmentsOut, tasks });
        }
        catch (e) {
            console.warn('Failed to attach progress to assignments response', e);
            return res.json({ assignments: items, tasks });
        }
    }
    catch (err) {
        console.error('for-tech assignments', err);
        return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to list for-tech assignments' });
    }
});
/**
 * GET /api/assignments/for-group
 * Query: groupId
 * Returns assignments for all members of a group (DEPLOYED or IN_PROGRESS)
 */
router.get('/assignments/for-group', auth_1.authMiddleware, async (req, res) => {
    try {
        const groupId = String(req.query.groupId || req.query.group || '');
        if (!groupId)
            return res.status(400).json({ code: 'INVALID', message: 'groupId required' });
        const groupRepo = ormconfig_1.AppDataSource.getRepository(ShiftGroup_1.ShiftGroup);
        const g = await groupRepo.findOneBy({ id: groupId });
        if (!g)
            return res.status(404).json({ message: 'Group not found' });
        const members = Array.isArray(g.members) ? g.members.map(String) : [];
        if (members.length === 0)
            return res.json({ assignments: [], tasks: [] });
        const repo = ormconfig_1.AppDataSource.getRepository(Assignment_1.Assignment);
        const qb = repo.createQueryBuilder('a')
            .leftJoinAndSelect('a.wo', 'wo')
            .where('a.assigneeId IN (:...members)', { members })
            .andWhere('wo.status IN (:...statuses)', { statuses: ['DEPLOYED', 'IN_PROGRESS'] })
            .orderBy('a.createdAt', 'DESC');
        const items = await qb.getMany();
        // fetch related tasks if any task_id present
        const taskIds = Array.from(new Set(items.map(i => i.task_id).filter(Boolean)));
        let tasks = [];
        if (taskIds.length > 0) {
            const taskRepo = ormconfig_1.AppDataSource.getRepository(Task_1.Task);
            tasks = await taskRepo.createQueryBuilder('t').where('t.id IN (:...ids)', { ids: taskIds }).getMany();
        }
        // compute progress per workorder and attach to the returned workorder object
        try {
            const woIds = Array.from(new Set(items.map(i => (i.wo && i.wo.id) ? String(i.wo.id) : '').filter(Boolean)));
            const progressMap = {};
            await Promise.all(woIds.map(async (wid) => {
                try {
                    const p = await (0, workOrderService_1.computeWorkOrderProgress)(wid);
                    progressMap[wid] = p;
                }
                catch (e) {
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
                }
                catch (e) {
                    return it;
                }
            });
            return res.json({ assignments: assignmentsOut, tasks });
        }
        catch (e) {
            console.warn('Failed to attach progress to assignments response', e);
            return res.json({ assignments: items, tasks });
        }
    }
    catch (err) {
        console.error('for-group assignments', err);
        return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to list for-group assignments' });
    }
});
/**
 * PATCH /api/assignments/:id
 * body: { status?: string }
 */
router.patch('/assignments/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const { status, startTime } = req.body || {};
        const repo = ormconfig_1.AppDataSource.getRepository(Assignment_1.Assignment);
        const a = await repo.findOne({ where: { id }, relations: ['wo'] });
        if (!a)
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Assignment not found' });
        if (status)
            a.status = status;
        // if marking IN_PROGRESS, set startedAt if not already set
        if (status === 'IN_PROGRESS' && !a.startedAt) {
            if (startTime) {
                try {
                    const parsed = new Date(startTime.toString());
                    if (!isNaN(parsed.getTime()))
                        a.startedAt = parsed;
                    else
                        a.startedAt = new Date();
                }
                catch (_) {
                    a.startedAt = new Date();
                }
            }
            else {
                a.startedAt = new Date();
            }
        }
        const saved = await repo.save(a);
        // If assignment moved to IN_PROGRESS, also update the related WorkOrder status
        try {
            if (status === 'IN_PROGRESS' && a.wo) {
                const woRepo = ormconfig_1.AppDataSource.getRepository(WorkOrder_1.WorkOrder);
                const wo = await woRepo.findOneBy({ id: a.wo.id });
                if (wo) {
                    wo.status = 'IN_PROGRESS';
                    // do NOT modify work order start_date here — only update workorder status
                    await woRepo.save(wo);
                }
            }
        }
        catch (e) {
            console.warn('Failed to update WorkOrder status after assignment update', e);
        }
        return res.json({ message: 'updated', data: saved });
    }
    catch (err) {
        console.error('update assignment', err);
        return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to update assignment' });
    }
});
exports.default = router;
