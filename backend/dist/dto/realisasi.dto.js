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
const Assignment_1 = require("../entities/Assignment");
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
const assignmentRepo = () => ormconfig_1.AppDataSource.getRepository(Assignment_1.Assignment);
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
    const assignment = new Assignment_1.Assignment();
    assignment.wo = wo;
    assignment.assigneeId = dto.assigneeId;
    assignment.assignedBy = dto.assignedBy;
    assignment.scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : undefined;
    await assignmentRepo().save(assignment);
    // push notification (stub)
    (0, pushService_1.pushNotify)(dto.assigneeId, `New assignment for WO ${wo.doc_no}`);
    return res.status(201).json({ id: assignment.id });
}
exports.createAssignment = createAssignment;
async function createRealisasi(req, res) {
    const dto = Object.assign(new assignment_dto_1.RealisasiCreateDTO(), req.body);
    const errors = await (0, class_validator_1.validate)(dto);
    if (errors.length)
        return res.status(400).json({ errors });
    const assignment = await assignmentRepo().findOne({ where: { id: dto.assignmentId }, relations: ["wo"] });
    if (!assignment)
        return res.status(404).json({ message: "Assignment not found" });
    const realisasi = new Realisasi_1.Realisasi();
    realisasi.assignment = assignment;
    realisasi.notes = dto.notes || null;
    realisasi.result = dto.result || null;
    // simple base64 save to disk or upload to S3 (here write local file for example)
    if (dto.photoBase64) {
        const buf = Buffer.from(dto.photoBase64, "base64");
        const filename = `photo_${(0, uuid_1.v4)()}.jpg`;
        const filepath = path.join(process.cwd(), "uploads", filename);
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, buf);
        realisasi.photoUrl = `/uploads/${filename}`;
    }
    if (dto.signatureBase64) {
        const buf = Buffer.from(dto.signatureBase64, "base64");
        const filename = `sig_${(0, uuid_1.v4)()}.png`;
        const filepath = path.join(process.cwd(), "uploads", filename);
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, buf);
        realisasi.signatureUrl = `/uploads/${filename}`;
    }
    // set start/end times
    realisasi.startTime = dto.startTime ? new Date(dto.startTime) : assignment.startedAt || null;
    realisasi.endTime = dto.endTime ? new Date(dto.endTime) : new Date();
    await realisasiRepo().save(realisasi);
    // optionally update assignment/wo status
    assignment.status = "COMPLETED";
    await assignmentRepo().save(assignment);
    // push notification to planner (stub)
    (0, pushService_1.pushNotify)(assignment.assignedBy || "", `Realisasi submitted for WO ${assignment.wo.doc_no}`);
    return res.status(201).json({ id: realisasi.id });
}
exports.createRealisasi = createRealisasi;
async function submitPendingRealisasi(req, res) {
    const dto = Object.assign(new assignment_dto_1.RealisasiCreateDTO(), req.body);
    const errors = await (0, class_validator_1.validate)(dto);
    if (errors.length)
        return res.status(400).json({ errors });
    const assignment = await assignmentRepo().findOne({ where: { id: dto.assignmentId }, relations: ["wo"] });
    if (!assignment)
        return res.status(404).json({ message: "Assignment not found" });
    // Prevent duplicate: if a realisasi already exists for this assignment, reject
    const existingReal = await realisasiRepo()
        .createQueryBuilder('r')
        .innerJoin('r.assignment', 'a')
        .where('a.id = :aid', { aid: dto.assignmentId })
        .getOne();
    if (existingReal)
        return res.status(409).json({ message: 'Realisasi already submitted for this assignment' });
    // Prevent duplicate pending submissions
    const existingPending = await pendingRepo()
        .createQueryBuilder('p')
        .innerJoin('p.assignment', 'a')
        .where('a.id = :aid', { aid: dto.assignmentId })
        .andWhere('p.status = :s', { s: 'PENDING' })
        .getOne();
    if (existingPending)
        return res.status(409).json({ message: 'A pending realisasi already exists for this assignment' });
    // save photo to disk and create pending record
    let photoUrl;
    let signatureUrl;
    if (dto.photoBase64) {
        const buf = Buffer.from(dto.photoBase64, "base64");
        const filename = `pending_photo_${(0, uuid_1.v4)()}.jpg`;
        const filepath = path.join(process.cwd(), "uploads", filename);
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, buf);
        photoUrl = `/uploads/${filename}`;
    }
    if (dto.signatureBase64) {
        const buf = Buffer.from(dto.signatureBase64, "base64");
        const filename = `pending_sig_${(0, uuid_1.v4)()}.png`;
        const filepath = path.join(process.cwd(), "uploads", filename);
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, buf);
        signatureUrl = `/uploads/${filename}`;
    }
    const pending = new PendingRealisasi_1.PendingRealisasi();
    pending.assignment = assignment;
    pending.notes = dto.notes || null;
    pending.photoUrl = photoUrl || null;
    pending.signatureUrl = signatureUrl || null;
    // accept optional start/end times from client, otherwise null
    pending.startTime = dto.startTime ? new Date(dto.startTime) : null;
    pending.endTime = dto.endTime ? new Date(dto.endTime) : null;
    pending.submitterId = req.user?.id || null;
    await pendingRepo().save(pending);
    // notify lead shift (stub)
    (0, pushService_1.pushNotify)('lead_shift', `New realisasi submitted for WO ${assignment.wo?.doc_no}`);
    return res.status(201).json({ id: pending.id });
}
exports.submitPendingRealisasi = submitPendingRealisasi;
async function listPendingRealisasi(req, res) {
    const user = req.user;
    if (!user)
        return res.status(403).json({ message: 'Forbidden' });
    // If user has explicit lead_shift/admin role, return all pending items
    let rows = [];
    if (user.role === 'lead_shift' || user.role === 'admin') {
        rows = await pendingRepo().find({ where: { status: 'PENDING' }, relations: ['assignment', 'assignment.wo'] });
        return res.json(rows.map(r => ({ id: r.id, assignmentId: r.assignment?.id, woId: r.assignment?.wo?.id, woDoc: r.assignment?.wo?.doc_no, notes: r.notes, photoUrl: r.photoUrl, submittedAt: r.submittedAt, status: r.status })));
    }
    // Otherwise, allow users who are recorded as shift group leaders to see pending items
    try {
        const groupRepo = ormconfig_1.AppDataSource.getRepository(ShiftGroup_1.ShiftGroup);
        const groups = await groupRepo.find({ where: { leader: user.id } });
        if (!groups || groups.length === 0)
            return res.json([]);
        const membersSet = new Set();
        for (const g of groups) {
            if (Array.isArray(g.members)) {
                for (const m of g.members)
                    membersSet.add(String(m));
            }
        }
        if (membersSet.size === 0)
            return res.json([]);
        // fetch pending items where assignment.assigneeId is in the leader's group members
        const qb = pendingRepo().createQueryBuilder('p')
            .leftJoinAndSelect('p.assignment', 'a')
            .leftJoinAndSelect('a.wo', 'wo')
            .where('p.status = :s', { s: 'PENDING' })
            .andWhere('a.assigneeId IN (:...members)', { members: Array.from(membersSet) });
        rows = await qb.getMany();
        return res.json(rows.map(r => ({ id: r.id, assignmentId: r.assignment?.id, woId: r.assignment?.wo?.id, woDoc: r.assignment?.wo?.doc_no, notes: r.notes, photoUrl: r.photoUrl, submittedAt: r.submittedAt, status: r.status })));
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
    const pending = await pendingRepo().findOne({ where: { id }, relations: ['assignment', 'assignment.wo'] });
    if (!pending)
        return res.status(404).json({ message: 'Pending not found' });
    // allow approval if user has explicit lead_shift/admin role
    let allowed = (user.role === 'lead_shift' || user.role === 'admin');
    // otherwise allow if the authenticated user is the leader of a shift group that contains the assignment's assignee
    if (!allowed) {
        try {
            const groupRepo = ormconfig_1.AppDataSource.getRepository(ShiftGroup_1.ShiftGroup);
            const groups = await groupRepo.find({ where: { leader: user.id } });
            const assigneeId = pending.assignment ? String(pending.assignment.assigneeId ?? '') : '';
            if (assigneeId) {
                for (const g of groups) {
                    const members = Array.isArray(g.members) ? g.members.map(String) : [];
                    if (members.includes(assigneeId)) {
                        allowed = true;
                        break;
                    }
                }
            }
        }
        catch (e) {
            // ignore lookup errors and keep allowed=false
        }
    }
    if (!allowed)
        return res.status(403).json({ message: 'Forbidden' });
    // create realisasi record
    const realisasi = new Realisasi_1.Realisasi();
    realisasi.assignment = pending.assignment;
    realisasi.notes = pending.notes || null;
    realisasi.photoUrl = pending.photoUrl || null;
    realisasi.signatureUrl = pending.signatureUrl || null;
    // set start/end times from pending or fallback to assignment.startedAt / now
    realisasi.startTime = pending.startTime || pending.assignment.startedAt || null;
    realisasi.endTime = pending.endTime || new Date();
    await realisasiRepo().save(realisasi);
    // mark assignment complete
    const assignment = pending.assignment;
    assignment.status = 'COMPLETED';
    await assignmentRepo().save(assignment);
    // determine whether whole workorder should be marked COMPLETED
    const wo = pending.assignment.wo;
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
    (0, pushService_1.pushNotify)(assignment.assignedBy || '', `Realisasi approved for WO ${wo?.doc_no}`);
    return res.json({ id: realisasi.id });
}
exports.approvePendingRealisasi = approvePendingRealisasi;
