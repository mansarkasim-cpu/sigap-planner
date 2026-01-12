import { Request, Response } from "express";
import { validate } from "class-validator";
// import { RealisasiCreateDTO } from "./realisasi-create.dto";

import { AppDataSource } from "../ormconfig";
import { Task } from "../entities/Task";
import { Realisasi } from "../entities/Realisasi";
import { PendingRealisasi } from "../entities/PendingRealisasi";
import { WorkOrder } from "../entities/WorkOrder";
import { computeWorkOrderProgress } from "../services/workOrderService";
import { User } from "../entities/User";
import { ShiftGroup } from "../entities/ShiftGroup";
import { pushNotify } from "../services/pushService";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";
import { AssignmentCreateDTO } from "../controllers/assignmentController";
import { RealisasiCreateDTO } from "./assignment.dto";

const assignmentRepo = () => AppDataSource.getRepository(require('../entities/Assignment').Assignment);
const taskRepo = () => AppDataSource.getRepository(Task);
const realisasiRepo = () => AppDataSource.getRepository(Realisasi);
const pendingRepo = () => AppDataSource.getRepository(PendingRealisasi);
const woRepo = () => AppDataSource.getRepository(WorkOrder);

export async function createAssignment(req: Request, res: Response) {
  const dto = Object.assign(new AssignmentCreateDTO(), req.body);
  const errors = await validate(dto);
  if (errors.length) return res.status(400).json({ errors });

  const wo = await woRepo().findOneBy({ id: dto.woId });
  if (!wo) return res.status(404).json({ message: "WO not found" });

  const assignment = assignmentRepo().create();
  assignment.wo = wo;
  assignment.assigneeId = dto.assigneeId;
  assignment.assignedBy = dto.assignedBy;
  assignment.scheduledAt = dto.scheduledAt ? new Date(dto.scheduledAt) : undefined;
  await assignmentRepo().save(assignment);

  // push notification (stub)
  pushNotify(dto.assigneeId, `New assignment for WO ${wo.doc_no}`);

  return res.status(201).json({ id: assignment.id });
}

export async function createRealisasi(req: Request, res: Response) {
  const dto = Object.assign(new RealisasiCreateDTO(), req.body);
  const errors = await validate(dto);
  if (errors.length) return res.status(400).json({ errors });
  const task = await taskRepo().findOne({ where: { id: (dto as any).taskId }, relations: ["workOrder"] as any });
  if (!task) return res.status(404).json({ message: "Task not found" });

  const realisasi = new Realisasi();
  realisasi.task = task as any;
  realisasi.notes = dto.notes || null;
  realisasi.result = dto.result || null;

  // simple base64 save to disk or upload to S3 (here write local file for example)
  if (dto.photoBase64) {
    const buf = Buffer.from(dto.photoBase64, "base64");
    const filename = `photo_${uuidv4()}.jpg`;
    const filepath = path.resolve(process.cwd(), "uploads", filename);
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, buf);
    try { fs.chmodSync(filepath, 0o644); } catch (e) { console.error('chmod failed:', e); }
    // prefer S3 public base if configured, otherwise construct absolute URL from request
    const baseForUploads = process.env.S3_PUBLIC_BASE || `${req.protocol}://${req.get('host')}`;
    const uploadsPath = baseForUploads.endsWith('/') ? `${baseForUploads}uploads/${filename}` : `${baseForUploads}/uploads/${filename}`;
    realisasi.photoUrl = uploadsPath;
  }
  if (dto.signatureBase64) {
    const buf = Buffer.from(dto.signatureBase64, "base64");
    const filename = `sig_${uuidv4()}.png`;
    const filepath = path.resolve(process.cwd(), "uploads", filename);
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, buf);
    try { fs.chmodSync(filepath, 0o644); } catch (e) { console.error('chmod failed:', e); }
    const baseForUploadsSig = process.env.S3_PUBLIC_BASE || `${req.protocol}://${req.get('host')}`;
    const sigPath = baseForUploadsSig.endsWith('/') ? `${baseForUploadsSig}uploads/${filename}` : `${baseForUploadsSig}/uploads/${filename}`;
    realisasi.signatureUrl = sigPath;
  }

  // set start/end times
  realisasi.startTime = (dto as any).startTime ? new Date((dto as any).startTime) : null;
  realisasi.endTime = (dto as any).endTime ? new Date((dto as any).endTime) : new Date();

  await realisasiRepo().save(realisasi);

  // optionally update a related assignment if one exists (mark completed)
  try {
    const aRepo = assignmentRepo();
    const maybe = await aRepo.createQueryBuilder('a')
      .where('a.task_id = :tid', { tid: String((task as any).id) })
      .andWhere('a.wo_id = :wo', { wo: (task as any).workOrder?.id })
      .orderBy('a.created_at', 'DESC')
      .getOne();
    if (maybe) {
      maybe.status = 'COMPLETED';
      await aRepo.save(maybe);
      pushNotify(maybe.assignedBy || "", `Realisasi submitted for WO ${maybe.wo?.doc_no}`);
    } else {
      pushNotify('', `Realisasi submitted for WO ${task.workOrder?.doc_no}`);
    }
  } catch (e) {
    pushNotify('', `Realisasi submitted for WO ${task.workOrder?.doc_no}`);
  }

  return res.status(201).json({ id: realisasi.id });
}

export async function submitPendingRealisasi(req: Request, res: Response) {
  const dto = Object.assign(new RealisasiCreateDTO(), req.body);
  const errors = await validate(dto);
  if (errors.length) return res.status(400).json({ errors });
  const task = await taskRepo().findOne({ where: { id: (dto as any).taskId }, relations: ["workOrder"] as any });
  if (!task) return res.status(404).json({ message: "Task not found" });

  // Prevent duplicate: if a realisasi already exists for this assignment, reject
  const existingReal = await realisasiRepo()
    .createQueryBuilder('r')
    .where('r.task_id = :tid', { tid: (dto as any).taskId })
    .getOne();
  if (existingReal) return res.status(409).json({ message: 'Realisasi already submitted for this assignment' });

  // Prevent duplicate pending submissions
  const existingPending = await pendingRepo()
    .createQueryBuilder('p')
    .where('p.task_id = :tid', { tid: (dto as any).taskId })
    .andWhere('p.status = :s', { s: 'PENDING' })
    .getOne();
  if (existingPending) return res.status(409).json({ message: 'A pending realisasi already exists for this assignment' });

  // save photo to disk and create pending record
  let photoUrl: string | undefined;
  let signatureUrl: string | undefined;
  if (dto.photoBase64) {
    const buf = Buffer.from(dto.photoBase64, "base64");
    const filename = `pending_photo_${uuidv4()}.jpg`;
    const filepath = path.resolve(process.cwd(), "uploads", filename);
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, buf);
    try { fs.chmodSync(filepath, 0o644); } catch (e) { console.error('chmod failed:', e); }
    const baseForUploads = process.env.S3_PUBLIC_BASE || `${req.protocol}://${req.get('host')}`;
    photoUrl = baseForUploads.endsWith('/') ? `${baseForUploads}uploads/${filename}` : `${baseForUploads}/uploads/${filename}`;
  }
  if (dto.signatureBase64) {
    const buf = Buffer.from(dto.signatureBase64, "base64");
    const filename = `pending_sig_${uuidv4()}.png`;
    const filepath = path.resolve(process.cwd(), "uploads", filename);
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, buf);
    try { fs.chmodSync(filepath, 0o644); } catch (e) { console.error('chmod failed:', e); }
    const baseForUploadsSig = process.env.S3_PUBLIC_BASE || `${req.protocol}://${req.get('host')}`;
    signatureUrl = baseForUploadsSig.endsWith('/') ? `${baseForUploadsSig}uploads/${filename}` : `${baseForUploadsSig}/uploads/${filename}`;
  }

  const pending = new PendingRealisasi();
  pending.task = task as any;
  pending.notes = dto.notes || null;
  pending.photoUrl = photoUrl || null;
  pending.signatureUrl = signatureUrl || null;
  // accept optional start/end times from client, otherwise null
  pending.startTime = dto.startTime ? new Date(dto.startTime) : null;
  pending.endTime = dto.endTime ? new Date(dto.endTime) : null;
  pending.submitterId = (req as any).user?.id || null;
  await pendingRepo().save(pending);

  // notify lead shift (stub)
  pushNotify('lead_shift', `New realisasi submitted for WO ${task.workOrder?.doc_no}`);

  return res.status(201).json({ id: pending.id });
}

export async function listPendingRealisasi(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) return res.status(403).json({ message: 'Forbidden' });

  // If user has explicit lead_shift/admin role, return all pending items
  let rows: any[] = [];
  if (user.role === 'lead_shift' || user.role === 'admin') {
    rows = await pendingRepo().find({ where: { status: 'PENDING' }, relations: ['task', 'task.workOrder'] as any });
    return res.json(rows.map(r => ({ id: r.id, taskId: r.task?.id, woId: r.task?.workOrder?.id, woDoc: r.task?.workOrder?.doc_no, notes: r.notes, photoUrl: r.photoUrl, submittedAt: r.submittedAt, status: r.status })));
  }

  // Otherwise, allow users who are recorded as shift group leaders to see pending items
  try {
    const groupRepo = AppDataSource.getRepository(ShiftGroup);
    const groups = await groupRepo.find({ where: { leader: user.id } as any });
    if (!groups || groups.length === 0) return res.json([]);
    const membersSet = new Set<string>();
    for (const g of groups) {
      if (Array.isArray(g.members)) {
        for (const m of g.members) membersSet.add(String(m));
      }
    }
    if (membersSet.size === 0) return res.json([]);

    // fetch pending items where assignment.assigneeId is in the leader's group members
    const qb = pendingRepo().createQueryBuilder('p')
      .leftJoinAndSelect('p.task', 't')
      .leftJoinAndSelect('t.workOrder', 'wo')
      .where('p.status = :s', { s: 'PENDING' });

    // fallback: match pending by finding assignments for the task and checking assigneeId
    rows = await qb.getMany();
    return res.json(rows.map(r => ({ id: r.id, taskId: r.task?.id, woId: r.task?.workOrder?.id, woDoc: r.task?.workOrder?.doc_no, notes: r.notes, photoUrl: r.photoUrl, submittedAt: r.submittedAt, status: r.status })));
  } catch (e) {
    console.error('listPendingRealisasi error for leader fallback', e);
    return res.status(500).json({ message: 'Failed to list pending realisasi' });
  }
}

export async function approvePendingRealisasi(req: Request, res: Response) {
  const user = (req as any).user;
  // debug: log authenticated user info for approve requests
  try { console.debug('approvePendingRealisasi called by user:', JSON.stringify(user)); } catch (_) {}
  if (!user) return res.status(403).json({ message: 'Forbidden' });
  const id = req.params.id;
  const pending = await pendingRepo().findOne({ where: { id }, relations: ['task', 'task.workOrder'] as any });
  if (!pending) return res.status(404).json({ message: 'Pending not found' });

  // allow approval if user has explicit lead_shift/admin role
  let allowed = (user.role === 'lead_shift' || user.role === 'admin');
  // otherwise allow if the authenticated user is the leader of a shift group that contains the task's assignee (best-effort)
  if (!allowed) {
    try {
      const groupRepo = AppDataSource.getRepository(ShiftGroup);
      const groups = await groupRepo.find({ where: { leader: user.id } as any });
      // Try to find an assignment for the pending task and use its assigneeId
      let assigneeId = '';
      try {
        const aRepo = assignmentRepo();
        const maybe = await aRepo.createQueryBuilder('a').where('a.task_id = :tid', { tid: pending.task?.id }).getOne();
        assigneeId = maybe ? String((maybe as any).assigneeId ?? '') : '';
      } catch (e) { assigneeId = ''; }
      if (assigneeId) {
        for (const g of groups) {
          const members = Array.isArray(g.members) ? g.members.map(String) : [];
          if (members.includes(assigneeId)) { allowed = true; break; }
        }
      }
    } catch (e) {
      // ignore lookup errors and keep allowed=false
    }
  }
  if (!allowed) return res.status(403).json({ message: 'Forbidden' });

  // create realisasi record
  const realisasi = new Realisasi();
  realisasi.task = pending.task as any;
  realisasi.notes = pending.notes || null;
  realisasi.photoUrl = pending.photoUrl || null;
  realisasi.signatureUrl = pending.signatureUrl || null;
  // set start/end times from pending or fallback to assignment.startedAt / now
  realisasi.startTime = pending.startTime || null;
  realisasi.endTime = pending.endTime || new Date();
  await realisasiRepo().save(realisasi);

  // mark assignment complete
  try {
    const aRepo = assignmentRepo();
    const maybe = await aRepo.createQueryBuilder('a').where('a.task_id = :tid', { tid: pending.task?.id }).andWhere('a.wo_id = :wo', { wo: pending.task?.workOrder?.id }).orderBy('a.created_at','DESC').getOne();
    if (maybe) { maybe.status = 'COMPLETED'; await aRepo.save(maybe); }
  } catch (e) { /* ignore */ }

  // determine whether whole workorder should be marked COMPLETED
  const wo = pending.task?.workOrder;
  if (wo) {
    try {
      // compute progress using service which calculates based on task durations and realisasi rows
      const prog = await computeWorkOrderProgress(String(wo.id));
      if ((prog || 0) >= 0.999) {
        wo.status = 'COMPLETED';
        await woRepo().save(wo);
      }
    } catch (e) {
      // fallback: do not change workorder status if check fails
    }
  }

  // mark pending as approved
  pending.status = 'APPROVED';
  pending.approvedBy = user.id;
  pending.approvedAt = new Date();
  await pendingRepo().save(pending);

  // notify submitter/planner
  pushNotify('', `Realisasi approved for WO ${wo?.doc_no}`);

  return res.json({ id: realisasi.id });
}

export { RealisasiCreateDTO };
