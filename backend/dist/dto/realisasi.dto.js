"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealisasiCreateDTO = exports.approvePendingRealisasi = exports.listPendingRealisasi = exports.submitPendingRealisasi = exports.createRealisasi = exports.createAssignment = void 0;
const class_validator_1 = require("class-validator");
// import { RealisasiCreateDTO } from "./realisasi-create.dto";
const ormconfig_1 = require("../ormconfig");
const Task_1 = require("../entities/Task");
const Realisasi_1 = require("../entities/Realisasi");
const PendingRealisasi_1 = require("../entities/PendingRealisasi");
const WorkOrder_1 = require("../entities/WorkOrder");
const workOrderService_1 = require("../services/workOrderService");
const ShiftGroup_1 = require("../entities/ShiftGroup");
const pushService_1 = require("../services/pushService");
const uuid_1 = require("uuid");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const assignmentController_1 = require("../controllers/assignmentController");
const assignment_dto_1 = require("./assignment.dto");
Object.defineProperty(exports, "RealisasiCreateDTO", { enumerable: true, get: function () { return assignment_dto_1.RealisasiCreateDTO; } });
const assignmentRepo = () => ormconfig_1.AppDataSource.getRepository(require('../entities/Assignment').Assignment);
const taskRepo = () => ormconfig_1.AppDataSource.getRepository(Task_1.Task);
const realisasiRepo = () => ormconfig_1.AppDataSource.getRepository(Realisasi_1.Realisasi);
const pendingRepo = () => ormconfig_1.AppDataSource.getRepository(PendingRealisasi_1.PendingRealisasi);
const woRepo = () => ormconfig_1.AppDataSource.getRepository(WorkOrder_1.WorkOrder);
async function createAssignment(req, res) {
    const dto = Object.assign(new assignmentController_1.AssignmentCreateDTO(), req.body);
    const errors = await (0, class_validator_1.validate)(dto);
    if (errors.length)
        return res.status(400).json({ errors });
    const wo = await woRepo().findOneBy({ id: dto.woId });
    if (!wo)
        return res.status(404).json({ message: "WO not found" });
    const assignment = assignmentRepo().create();
    assignment.wo = wo;
    assignment.assigneeId = dto.assigneeId;
    assignment.assignedBy = dto.assignedBy;
    assignment.scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : undefined;
    await assignmentRepo().save(assignment);
    // push notification (stub)
    console.log('INSTRUMENT pushNotify createAssignment', { assigneeId: dto.assigneeId, woId: wo.id, woDoc: wo.doc_no });
    (0, pushService_1.pushNotify)(dto.assigneeId, `New assignment for WO ${wo.doc_no}`);
    return res.status(201).json({ id: assignment.id });
}
exports.createAssignment = createAssignment;
async function createRealisasi(req, res) {
    const dto = Object.assign(new assignment_dto_1.RealisasiCreateDTO(), req.body);
    const errors = await (0, class_validator_1.validate)(dto);
    if (errors.length)
        return res.status(400).json({ errors });
    const task = await taskRepo().findOne({ where: { id: dto.taskId }, relations: ["workOrder"] });
    if (!task)
        return res.status(404).json({ message: "Task not found" });
    const realisasi = new Realisasi_1.Realisasi();
    realisasi.task = task;
    realisasi.notes = dto.notes || null;
    realisasi.result = dto.result || null;
    // simple base64 save to disk or upload to S3 (here write local file for example)
    if (dto.photoBase64) {
        const buf = Buffer.from(dto.photoBase64, "base64");
        const filename = `photo_${(0, uuid_1.v4)()}.jpg`;
        const filepath = path.resolve(process.cwd(), "uploads", filename);
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, buf);
        try {
            fs.chmodSync(filepath, 0o644);
        }
        catch (e) {
            console.error('chmod failed:', e);
        }
        // prefer S3 public base if configured, otherwise construct absolute URL from request
        const baseForUploads = process.env.S3_PUBLIC_BASE || `${req.protocol}://${req.get('host')}`;
        const uploadsPath = baseForUploads.endsWith('/') ? `${baseForUploads}uploads/${filename}` : `${baseForUploads}/uploads/${filename}`;
        realisasi.photoUrl = uploadsPath;
    }
    // accept array of uploaded photo URLs from client
    if (dto.photoUrls && Array.isArray(dto.photoUrls)) {
        const arr = dto.photoUrls.filter(Boolean).map((s) => String(s));
        if (arr.length) {
            realisasi.photoUrls = arr;
            if (!realisasi.photoUrl)
                realisasi.photoUrl = arr[0];
        }
    }
    if (dto.signatureBase64) {
        const buf = Buffer.from(dto.signatureBase64, "base64");
        const filename = `sig_${(0, uuid_1.v4)()}.png`;
        const filepath = path.resolve(process.cwd(), "uploads", filename);
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, buf);
        try {
            fs.chmodSync(filepath, 0o644);
        }
        catch (e) {
            console.error('chmod failed:', e);
        }
        const baseForUploadsSig = process.env.S3_PUBLIC_BASE || `${req.protocol}://${req.get('host')}`;
        const sigPath = baseForUploadsSig.endsWith('/') ? `${baseForUploadsSig}uploads/${filename}` : `${baseForUploadsSig}/uploads/${filename}`;
        realisasi.signatureUrl = sigPath;
    }
    // determine resolved startTime: prefer client-provided, else try assignment.startedAt
    let resolvedStartCreate = dto.startTime ? new Date(dto.startTime) : null;
    if (!resolvedStartCreate) {
        try {
            const aRepo = assignmentRepo();
            // prefer the earliest (minimum) non-null started_at for this task/workorder
            const row = await aRepo.createQueryBuilder('a')
                .select('MIN(a.started_at)', 'min_start')
                .where('a.task_id = :tid', { tid: task.id })
                .andWhere('a.wo_id = :wo', { wo: task.workOrder?.id })
                .andWhere('a.started_at IS NOT NULL')
                .getRawOne();
            if (row && row.min_start)
                resolvedStartCreate = new Date(row.min_start);
        }
        catch (e) {
            // ignore lookup errors
        }
    }
    if (!resolvedStartCreate) {
        return res.status(400).json({ message: 'startTime required: missing start from client and no assignment.startedAt available' });
    }
    realisasi.startTime = resolvedStartCreate;
    realisasi.endTime = dto.endTime ? new Date(dto.endTime) : new Date();
    await realisasiRepo().save(realisasi);
    // optionally update a related assignment if one exists (mark completed)
    try {
        const aRepo = assignmentRepo();
        const maybe = await aRepo.createQueryBuilder('a')
            .where('a.task_id = :tid', { tid: String(task.id) })
            .andWhere('a.wo_id = :wo', { wo: task.workOrder?.id })
            .orderBy('a.created_at', 'DESC')
            .getOne();
        if (maybe) {
            maybe.status = 'COMPLETED';
            await aRepo.save(maybe);
            console.log('INSTRUMENT pushNotify createRealisasi - maybe', { assignedBy: maybe.assignedBy, woId: maybe.wo?.id, woDoc: maybe.wo?.doc_no });
            (0, pushService_1.pushNotify)(maybe.assignedBy || "", `Realisasi submitted for WO ${maybe.wo?.doc_no}`);
            // Also notify shift leaders so they receive a push when a technician submits realisasi
            try {
                console.log('INSTRUMENT pushNotify createRealisasi - lead_shift', { woId: maybe.wo?.id, woDoc: maybe.wo?.doc_no });
                (0, pushService_1.pushNotify)('lead_shift', `New realisasi submitted for WO ${maybe.wo?.doc_no}`);
            }
            catch (e) {
                console.warn('Failed to pushNotify lead_shift for createRealisasi (maybe block)', e);
            }
        }
        else {
            console.log('INSTRUMENT pushNotify createRealisasi - fallback task', { taskId: task.id, woId: task.workOrder?.id, woDoc: task.workOrder?.doc_no });
            (0, pushService_1.pushNotify)('', `Realisasi submitted for WO ${task.workOrder?.doc_no}`);
            // also notify shift leaders for fallback case
            try {
                console.log('INSTRUMENT pushNotify createRealisasi - lead_shift (fallback)', { woId: task.workOrder?.id, woDoc: task.workOrder?.doc_no });
                (0, pushService_1.pushNotify)('lead_shift', `New realisasi submitted for WO ${task.workOrder?.doc_no}`);
            }
            catch (e) {
                console.warn('Failed to pushNotify lead_shift for createRealisasi (fallback)', e);
            }
        }
    }
    catch (e) {
        (0, pushService_1.pushNotify)('', `Realisasi submitted for WO ${task.workOrder?.doc_no}`);
        try {
            (0, pushService_1.pushNotify)('lead_shift', `New realisasi submitted for WO ${task.workOrder?.doc_no}`);
        }
        catch (ee) {
            console.warn('Failed to pushNotify lead_shift for createRealisasi (catch)', ee);
        }
    }
    return res.status(201).json({ id: realisasi.id });
}
exports.createRealisasi = createRealisasi;
async function submitPendingRealisasi(req, res) {
    const dto = Object.assign(new assignment_dto_1.RealisasiCreateDTO(), req.body);
    const errors = await (0, class_validator_1.validate)(dto);
    if (errors.length)
        return res.status(400).json({ errors });
    const task = await taskRepo().findOne({ where: { id: dto.taskId }, relations: ["workOrder"] });
    if (!task)
        return res.status(404).json({ message: "Task not found" });
    // Prevent duplicate: if a realisasi already exists for this assignment, reject
    const existingReal = await realisasiRepo()
        .createQueryBuilder('r')
        .where('r.task_id = :tid', { tid: dto.taskId })
        .getOne();
    if (existingReal)
        return res.status(409).json({ message: 'Realisasi already submitted for this assignment' });
    // Prevent duplicate pending submissions
    const existingPending = await pendingRepo()
        .createQueryBuilder('p')
        .where('p.task_id = :tid', { tid: dto.taskId })
        .andWhere('p.status = :s', { s: 'PENDING' })
        .getOne();
    if (existingPending)
        return res.status(409).json({ message: 'A pending realisasi already exists for this assignment' });
    // save photo to disk and create pending record
    let photoUrl;
    let signatureUrl;
    let photoUrlsArr;
    if (dto.photoBase64) {
        const buf = Buffer.from(dto.photoBase64, "base64");
        const filename = `pending_photo_${(0, uuid_1.v4)()}.jpg`;
        const filepath = path.resolve(process.cwd(), "uploads", filename);
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, buf);
        try {
            fs.chmodSync(filepath, 0o644);
        }
        catch (e) {
            console.error('chmod failed:', e);
        }
        const baseForUploads = process.env.S3_PUBLIC_BASE || `${req.protocol}://${req.get('host')}`;
        photoUrl = baseForUploads.endsWith('/') ? `${baseForUploads}uploads/${filename}` : `${baseForUploads}/uploads/${filename}`;
    }
    // if client provided uploaded URLs (from presign + PUT), accept them
    if (dto.photoUrls && Array.isArray(dto.photoUrls)) {
        photoUrlsArr = dto.photoUrls.filter(Boolean).map((s) => String(s));
        if (!photoUrl && photoUrlsArr && photoUrlsArr.length)
            photoUrl = photoUrlsArr[0];
    }
    if (dto.signatureBase64) {
        const buf = Buffer.from(dto.signatureBase64, "base64");
        const filename = `pending_sig_${(0, uuid_1.v4)()}.png`;
        const filepath = path.resolve(process.cwd(), "uploads", filename);
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, buf);
        try {
            fs.chmodSync(filepath, 0o644);
        }
        catch (e) {
            console.error('chmod failed:', e);
        }
        const baseForUploadsSig = process.env.S3_PUBLIC_BASE || `${req.protocol}://${req.get('host')}`;
        signatureUrl = baseForUploadsSig.endsWith('/') ? `${baseForUploadsSig}uploads/${filename}` : `${baseForUploadsSig}/uploads/${filename}`;
    }
    const pending = new PendingRealisasi_1.PendingRealisasi();
    pending.task = task;
    pending.notes = dto.notes || null;
    pending.photoUrl = photoUrl || null;
    pending.photoUrls = photoUrlsArr || null;
    pending.signatureUrl = signatureUrl || null;
    // accept optional start/end times from client; if startTime missing, fallback to assignment.startedAt if available
    let resolvedPendingStart = dto.startTime ? new Date(dto.startTime) : null;
    if (!resolvedPendingStart) {
        try {
            const aRepo = assignmentRepo();
            const row = await aRepo.createQueryBuilder('a')
                .select('MIN(a.started_at)', 'min_start')
                .where('a.task_id = :tid', { tid: task.id })
                .andWhere('a.wo_id = :wo', { wo: task.workOrder?.id })
                .andWhere('a.started_at IS NOT NULL')
                .getRawOne();
            if (row && row.min_start)
                resolvedPendingStart = new Date(row.min_start);
        }
        catch (e) {
            // ignore lookup errors
        }
    }
    pending.startTime = resolvedPendingStart;
    pending.endTime = dto.endTime ? new Date(dto.endTime) : null;
    pending.submitterId = req.user?.id || null;
    await pendingRepo().save(pending);
    // notify lead shift (stub)
    console.log('INSTRUMENT pushNotify submitPendingRealisasi', { target: 'lead_shift', taskId: task.id, woId: task.workOrder?.id, woDoc: task.workOrder?.doc_no });
    (0, pushService_1.pushNotify)('lead_shift', `New realisasi submitted for WO ${task.workOrder?.doc_no}`);
    return res.status(201).json({ id: pending.id });
}
exports.submitPendingRealisasi = submitPendingRealisasi;
async function listPendingRealisasi(req, res) {
    const user = req.user;
    if (!user)
        return res.status(403).json({ message: 'Forbidden' });
    // If user has explicit lead_shift/admin role, return all pending items
    let rows = [];
    const isAdmin = (user?.role === 'admin') || (Array.isArray(user?.roles) && user.roles.includes('admin'));
    try {
        console.debug('listPendingRealisasi: userId=', user?.id, 'role=', user?.role);
    }
    catch (_) { }
    if (isAdmin) {
        rows = await pendingRepo().find({ where: { status: 'PENDING' }, relations: ['task', 'task.workOrder'] });
        return res.json(rows.map(r => ({ id: r.id, taskId: r.task?.id, woId: r.task?.workOrder?.id, woDoc: r.task?.workOrder?.doc_no, notes: r.notes, photoUrl: r.photoUrl, photoUrls: r.photoUrls ?? null, submittedAt: r.submittedAt, status: r.status })));
    }
    // Otherwise, allow users who are recorded as shift group leaders to see pending items
    try {
        const groupRepo = ormconfig_1.AppDataSource.getRepository(ShiftGroup_1.ShiftGroup);
        // fetch all groups and match by flexible leader/member identifiers
        const allGroups = await groupRepo.find();
        const candidates = new Set([String(user?.id || ''), String(user?.nipp || ''), String(user?.email || '')].filter(Boolean));
        try {
            console.debug('listPendingRealisasi: leaderCandidates=', Array.from(candidates));
        }
        catch (_) { }
        // only consider groups where the current user is recorded as leader
        const groups = (allGroups || []).filter(g => Boolean(g.leader && candidates.has(String(g.leader))));
        // If user is leader of any group, return all pending items (leaders can approve any team's submissions)
        if (groups && groups.length > 0) {
            rows = await pendingRepo().find({ where: { status: 'PENDING' }, relations: ['task', 'task.workOrder'] });
            return res.json(rows.map(r => ({ id: r.id, taskId: r.task?.id, woId: r.task?.workOrder?.id, woDoc: r.task?.workOrder?.doc_no, notes: r.notes, photoUrl: r.photoUrl, photoUrls: r.photoUrls ?? null, submittedAt: r.submittedAt, status: r.status })));
        }
        // If not leader in any group, return empty list
        return res.json([]);
    }
    catch (e) {
        console.error('listPendingRealisasi error for leader fallback', e);
        return res.status(500).json({ message: 'Failed to list pending realisasi' });
    }
}
exports.listPendingRealisasi = listPendingRealisasi;
async function approvePendingRealisasi(req, res) {
    const user = req.user;
    // debug: log authenticated user info for approve requests
    try {
        console.debug('approvePendingRealisasi called by user:', JSON.stringify(user));
    }
    catch (_) { }
    if (!user)
        return res.status(403).json({ message: 'Forbidden' });
    const id = req.params.id;
    const pending = await pendingRepo().findOne({ where: { id }, relations: ['task', 'task.workOrder'] });
    if (!pending)
        return res.status(404).json({ message: 'Pending not found' });
    // If the pending item is already processed, return 409 to indicate conflict
    if (pending.status !== 'PENDING') {
        try {
            console.debug('approvePendingRealisasi: pending status not PENDING=', pending.status);
        }
        catch (_) { }
        return res.status(409).json({ message: 'Pending realisasi is not in PENDING state' });
    }
    // allow approval if user has explicit lead-like role or admin
    const isAdmin = (user?.role === 'admin') || (Array.isArray(user?.roles) && user.roles.includes('admin'));
    try {
        console.debug('approvePendingRealisasi: userId=', user?.id, 'role=', user?.role, 'pendingId=', id);
    }
    catch (_) { }
    let allowed = Boolean(isAdmin);
    // otherwise allow if the authenticated user is recorded as a shift group leader (any group)
    if (!allowed) {
        try {
            const groupRepo = ormconfig_1.AppDataSource.getRepository(ShiftGroup_1.ShiftGroup);
            const allGroups = await groupRepo.find();
            const candidates = new Set([String(user?.id || ''), String(user?.nipp || ''), String(user?.email || '')].filter(Boolean));
            try {
                console.debug('approvePendingRealisasi: leaderCandidates=', Array.from(candidates));
            }
            catch (_) { }
            // consider groups where the current user is recorded as leader
            const groups = (allGroups || []).filter(g => Boolean(g.leader && candidates.has(String(g.leader))));
            try {
                console.debug('approvePendingRealisasi: matchedGroups=', groups.map(g => ({ id: g.id, leader: g.leader, membersCount: Array.isArray(g.members) ? g.members.length : 0 })));
            }
            catch (_) { }
            try {
                console.debug('approvePendingRealisasi: groupsFound=', Array.isArray(groups) ? groups.length : 0);
            }
            catch (_) { }
            // If the user is leader of any group, allow approving any pending realisasi
            if (Array.isArray(groups) && groups.length > 0) {
                allowed = true;
            }
        }
        catch (e) {
            // ignore lookup errors and keep allowed=false
        }
    }
    try {
        console.debug('approvePendingRealisasi: allowed=', allowed);
    }
    catch (_) { }
    if (!allowed)
        return res.status(403).json({ message: 'Forbidden' });
    // create realisasi record
    const realisasi = new Realisasi_1.Realisasi();
    realisasi.task = pending.task;
    realisasi.notes = pending.notes || null;
    realisasi.photoUrl = pending.photoUrl || null;
    realisasi.photoUrls = pending.photoUrls ?? null;
    if (!realisasi.photoUrl && Array.isArray(pending.photoUrls) && pending.photoUrls.length) {
        realisasi.photoUrl = pending.photoUrls[0];
    }
    realisasi.signatureUrl = pending.signatureUrl || null;
    // Prefer start/end times from the pending_realisasi record.
    // Do NOT accept client-provided startTime when approving; use pending values first.
    let resolvedStart = pending.startTime || null;
    if (!resolvedStart) {
        try {
            const aRepo = assignmentRepo();
            let maybeA = null;
            // 1) try assignment matching task_id + wo_id
            if (pending.task?.id && pending.task?.workOrder?.id) {
                maybeA = await aRepo.createQueryBuilder('a')
                    .where('a.task_id = :tid', { tid: pending.task?.id })
                    .andWhere('a.wo_id = :wo', { wo: pending.task?.workOrder?.id })
                    .orderBy('a.created_at', 'DESC')
                    .getOne();
            }
            // 2) fallback: try assignment matching task_id only
            if ((!maybeA || !maybeA.startedAt) && pending.task?.id) {
                maybeA = await aRepo.createQueryBuilder('a')
                    .where('a.task_id = :tid', { tid: pending.task?.id })
                    .orderBy('a.created_at', 'DESC')
                    .getOne();
            }
            // 3) fallback: try assignment matching workorder only
            if ((!maybeA || !maybeA.startedAt) && pending.task?.workOrder?.id) {
                maybeA = await aRepo.createQueryBuilder('a')
                    .where('a.wo_id = :wo', { wo: pending.task?.workOrder?.id })
                    .orderBy('a.created_at', 'DESC')
                    .getOne();
            }
            if (maybeA && maybeA.startedAt)
                resolvedStart = maybeA.startedAt;
        }
        catch (e) {
            // ignore lookup errors
        }
    }
    // final fallback: if pending has no startTime, fall back to assignment.startedAt or env flag (preserve previous behavior)
    if (!resolvedStart) {
        try {
            const aRepo = assignmentRepo();
            let maybeA = null;
            if (pending.task?.id && pending.task?.workOrder?.id) {
                maybeA = await aRepo.createQueryBuilder('a')
                    .where('a.task_id = :tid', { tid: pending.task?.id })
                    .andWhere('a.wo_id = :wo', { wo: pending.task?.workOrder?.id })
                    .orderBy('a.created_at', 'DESC')
                    .getOne();
            }
            if ((!maybeA || !maybeA.startedAt) && pending.task?.id) {
                maybeA = await aRepo.createQueryBuilder('a')
                    .where('a.task_id = :tid', { tid: pending.task?.id })
                    .orderBy('a.created_at', 'DESC')
                    .getOne();
            }
            if ((!maybeA || !maybeA.startedAt) && pending.task?.workOrder?.id) {
                maybeA = await aRepo.createQueryBuilder('a')
                    .where('a.wo_id = :wo', { wo: pending.task?.workOrder?.id })
                    .orderBy('a.created_at', 'DESC')
                    .getOne();
            }
            if (maybeA && maybeA.startedAt)
                resolvedStart = maybeA.startedAt;
        }
        catch (e) {
            // ignore lookup errors
        }
        if (!resolvedStart) {
            if (process.env.ALLOW_APPROVE_WITHOUT_START === 'true') {
                resolvedStart = new Date();
            }
            else {
                return res.status(400).json({ message: 'startTime required: pending item has no startTime and no assignment.startedAt available' });
            }
        }
    }
    realisasi.startTime = resolvedStart;
    // persist resolvedStart back to pending.startTime if it was missing
    try {
        if (!pending.startTime) {
            pending.startTime = resolvedStart;
            await pendingRepo().save(pending);
        }
    }
    catch (e) {
        console.warn('Failed to persist pending.startTime fallback', e);
    }
    // also ensure assignment.startedAt is set if missing for data consistency
    try {
        const aRepo = assignmentRepo();
        const maybeAssign = await aRepo.createQueryBuilder('a')
            .where('a.task_id = :tid', { tid: pending.task?.id })
            .andWhere('a.wo_id = :wo', { wo: pending.task?.workOrder?.id })
            .orderBy('a.created_at', 'DESC')
            .getOne();
        if (maybeAssign && !maybeAssign.startedAt) {
            maybeAssign.startedAt = resolvedStart;
            await aRepo.save(maybeAssign);
        }
    }
    catch (e) {
        console.warn('Failed to persist assignment.startedAt fallback', e);
    }
    // Prefer pending endTime; if missing, fall back to pending.startTime or now
    realisasi.endTime = pending.endTime || pending.startTime || new Date();
    await realisasiRepo().save(realisasi);
    // mark assignment complete
    try {
        const aRepo = assignmentRepo();
        const maybe = await aRepo.createQueryBuilder('a').where('a.task_id = :tid', { tid: pending.task?.id }).andWhere('a.wo_id = :wo', { wo: pending.task?.workOrder?.id }).orderBy('a.created_at', 'DESC').getOne();
        if (maybe) {
            maybe.status = 'COMPLETED';
            await aRepo.save(maybe);
        }
    }
    catch (e) { /* ignore */ }
    // determine whether whole workorder should be marked COMPLETED
    const wo = pending.task?.workOrder;
    if (wo) {
        try {
            // compute progress using service which calculates based on task durations and realisasi rows
            const prog = await (0, workOrderService_1.computeWorkOrderProgress)(String(wo.id));
            if ((prog || 0) >= 0.999) {
                wo.status = 'COMPLETED';
                await woRepo().save(wo);
            }
        }
        catch (e) {
            // fallback: do not change workorder status if check fails
        }
    }
    // mark pending as approved
    pending.status = 'APPROVED';
    pending.approvedBy = user.id;
    pending.approvedAt = new Date();
    await pendingRepo().save(pending);
    // notify submitter/planner
    console.log('INSTRUMENT pushNotify approvePendingRealisasi', { target: '', woId: wo?.id, woDoc: wo?.doc_no });
    (0, pushService_1.pushNotify)('', `Realisasi approved for WO ${wo?.doc_no}`);
    return res.json({ id: realisasi.id });
}
exports.approvePendingRealisasi = approvePendingRealisasi;
