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
exports.getMobileChecklistById = exports.getChecklistById = exports.listMobileChecklists = exports.listChecklists = exports.submitChecklist = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const ormconfig_1 = require("../ormconfig");
const DailyChecklist_1 = require("../entities/DailyChecklist");
const MasterChecklistQuestion_1 = require("../entities/MasterChecklistQuestion");
const DailyChecklistItem_1 = require("../entities/DailyChecklistItem");
const User_1 = require("../entities/User");
const WorkOrder_1 = require("../entities/WorkOrder");
const woService = __importStar(require("../services/workOrderService"));
// determine uploads directory consistently with app startup logic
function resolveUploadsDir() {
    const UPLOADS_DIR_ENV = process.env.UPLOADS_DIR || '';
    const cwd = process.cwd();
    const candidates = [
        UPLOADS_DIR_ENV,
        path.join(cwd, 'uploads'),
        path.join(cwd, 'backend', 'uploads'),
        path.join(__dirname, '..', 'uploads'),
        path.join(cwd, 'upload'),
        path.join(__dirname, '..', 'upload'),
    ].map(p => (p || '').toString());
    const found = candidates.find(p => p && fs.existsSync(p));
    const finalDir = found || (UPLOADS_DIR_ENV || path.join(cwd, 'uploads'));
    try {
        fs.mkdirSync(finalDir, { recursive: true });
    }
    catch (e) { /* ignore */ }
    return finalDir;
}
function isLikelyLocalPath(p) {
    if (!p)
        return false;
    const s = String(p).trim();
    // Windows absolute path e.g. C:\ or C:/, UNC \\server\path, POSIX /path, or file://
    if (/^[A-Za-z]:\\\\|^[A-Za-z]:\//.test(s))
        return true;
    if (s.startsWith('\\\\'))
        return true;
    if (s.startsWith('/'))
        return true;
    if (s.startsWith('file://'))
        return true;
    return false;
}
async function submitChecklist(req, res) {
    const payload = req.body || {};
    // console.debug(`payload test ${JSON.stringify(payload)}`);
    const { alat_id, teknisi_id, teknisi_name, performed_at, site_id, notes, latitude, longitude, items } = payload;
    // basic validation: alat_id and items required; teknisi can be inferred from token for technicians
    const user = req.user || undefined;
    const resolvedTeknisiId = teknisi_id ?? (user && user.nipp ? Number(user.nipp) : undefined);
    // Prefer the explicit payload value first.
    // Then prefer the JWT user's `name` if present. If JWT only has `nipp`, try DB lookup by nipp to get the real name.
    let resolvedTeknisiName = teknisi_name;
    let teknisiNameSource = teknisi_name ? 'payload' : null;
    if (!resolvedTeknisiName && user) {
        try {
            const uRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
            // if JWT contains a proper name, use it
            if (user.name && String(user.name).trim() !== '') {
                resolvedTeknisiName = user.name;
                teknisiNameSource = 'jwt_name';
            }
            else if (user.email && String(user.email).trim() !== '') {
                resolvedTeknisiName = user.email;
                teknisiNameSource = 'jwt_email';
            }
            else if (user.nipp) {
                // try to resolve via DB using nipp first
                let fullUser = null;
                try {
                    fullUser = await uRepo.findOne({ where: { nipp: String(user.nipp) } });
                }
                catch (_) { }
                if (!fullUser && user.id) {
                    try {
                        fullUser = await uRepo.findOne({ where: { id: user.id } });
                    }
                    catch (_) { }
                }
                if (fullUser && fullUser.name) {
                    resolvedTeknisiName = fullUser.name;
                    teknisiNameSource = 'db_name';
                }
                else {
                    // fallback to JWT nipp if DB lookup didn't return a proper name
                    resolvedTeknisiName = user.nipp;
                    teknisiNameSource = 'jwt_nipp';
                }
            }
        }
        catch (e) {
            console.error('failed to resolve user name', e);
        }
    }
    // Log which value will be used for teknisi_name for audit/debug
    try {
        const who = user ? (user.id ?? user.nipp ?? '<unknown>') : '<anonymous>';
        console.info(`submitChecklist: resolved teknisi_name for user=${who} => "${resolvedTeknisiName ?? '<null>'}" (source=${teknisiNameSource ?? '<unknown>'})`);
    }
    catch (e) {
        console.debug('submitChecklist logging failed', e);
    }
    if (!alat_id || !Array.isArray(items)) {
        return res.status(400).json({ message: 'alat_id and items array are required' });
    }
    // server-side validation: ensure required questions have answers
    try {
        const qIds = Array.from(new Set(items.map((it) => Number(it.question_id)).filter((v) => !!v)));
        if (qIds.length > 0) {
            const qRepo = ormconfig_1.AppDataSource.getRepository(MasterChecklistQuestion_1.MasterChecklistQuestion);
            const qs = await qRepo.createQueryBuilder('q').where('q.id IN (:...ids)', { ids: qIds }).getMany();
            const qmap = {};
            for (const q of qs)
                qmap[q.id] = q;
            for (const it of items) {
                // support base64 photo payload similar to realisasi flow: save to uploads and generate public URL
                // start with null to avoid persisting client-local absolute paths
                let evidencePhotoUrl = null;
                let evidencePhotoPath = null;
                // normalize client-provided paths: accept only non-local (public) paths
                const rawClientPath = it.evidence_photo_path || it.evidence_photo || null;
                const cleanedClientPath = rawClientPath && !isLikelyLocalPath(rawClientPath) ? rawClientPath : null;
                if (cleanedClientPath)
                    evidencePhotoPath = cleanedClientPath;
                try {
                    if (it.evidence_photo_base64) {
                        const buf = Buffer.from(it.evidence_photo_base64, 'base64');
                        const filename = `checklist_${Date.now()}_${(0, uuid_1.v4)()}.jpg`;
                        // Save under backend/uploads as requested
                        const uploadsDir = resolveUploadsDir();
                        const filepath = path.resolve(uploadsDir, filename);
                        fs.mkdirSync(path.dirname(filepath), { recursive: true });
                        fs.writeFileSync(filepath, buf);
                        try {
                            fs.chmodSync(filepath, 0o644);
                        }
                        catch (e) {
                            console.error('chmod failed:', e);
                        }
                        const baseForUploads = process.env.S3_PUBLIC_BASE || `${req.protocol}://${req.get('host')}`;
                        // public URL remains /uploads/<filename> — app.ts serves backend/uploads as one candidate
                        const publicUrl = baseForUploads.endsWith('/') ? `${baseForUploads}uploads/${filename}` : `${baseForUploads}/uploads/${filename}`;
                        evidencePhotoUrl = publicUrl;
                        evidencePhotoPath = `backend/uploads/${filename}`;
                    }
                }
                catch (e) {
                    console.error('failed to write evidence photo', e);
                }
                const qid = Number(it.question_id);
                const q = qmap[qid];
                if (!q)
                    continue;
                const required = q.required === true || q.required === '1';
                if (!required)
                    continue;
                const qtype = q.input_type || 'boolean';
                let hasAnswer = false;
                if (qtype === 'number') {
                    hasAnswer = it.answer_number !== undefined && it.answer_number !== null;
                }
                else if (qtype === 'select' || qtype === 'multiselect') {
                    hasAnswer = (it.option_id !== undefined && it.option_id !== null) || (it.answer_text !== undefined && it.answer_text !== null && String(it.answer_text).trim() !== '');
                }
                else {
                    hasAnswer = it.answer_text !== undefined && it.answer_text !== null && String(it.answer_text).trim() !== '';
                }
                if (!hasAnswer) {
                    return res.status(400).json({ message: `Missing required answer for question ${qid}` });
                }
                // if boolean answer is false, ensure evidence present
                if (qtype === 'boolean') {
                    const ans = String(it.answer_text || '').toLowerCase();
                    if (ans == 'false' || ans == '0') {
                        const hasEvidenceProvided = Boolean((it.evidence_note && String(it.evidence_note).trim() !== '') ||
                            (it.evidence_photo_base64) ||
                            (it.evidence_photo_url && !isLikelyLocalPath(it.evidence_photo_url)) ||
                            (it.evidence_photo_path && !isLikelyLocalPath(it.evidence_photo_path)) ||
                            (it.evidence_photo && !isLikelyLocalPath(it.evidence_photo)));
                        if (!hasEvidenceProvided) {
                            return res.status(400).json({ message: `Evidence required when answering 'No' for question ${qid}` });
                        }
                    }
                }
            }
        }
    }
    catch (ve) {
        console.error('validation error', ve);
        return res.status(400).json({ message: 'Validation failed', detail: ve instanceof Error ? ve.message : ve });
    }
    const conn = ormconfig_1.AppDataSource.manager;
    try {
        return await ormconfig_1.AppDataSource.transaction(async (tx) => {
            const dcRepo = tx.getRepository(DailyChecklist_1.DailyChecklist);
            const itemRepo = tx.getRepository(DailyChecklistItem_1.DailyChecklistItem);
            const dc = dcRepo.create({
                alat: { id: alat_id },
                teknisi_id: resolvedTeknisiId !== undefined ? Number(resolvedTeknisiId) : undefined,
                teknisi_name: resolvedTeknisiName,
                performed_at: performed_at ? new Date(performed_at) : new Date(),
                site: site_id ? { id: site_id } : undefined,
                notes: notes,
                latitude: latitude,
                longitude: longitude,
            });
            const savedDc = await dcRepo.save(dc);
            const createdItems = [];
            for (const it of items) {
                // ensure we don't default to client local paths
                let evidencePhotoUrl = null;
                let evidencePhotoPath = null;
                try {
                    // If client sent base64 during creation, save it here (validation earlier may have saved a temp copy,
                    // but we must persist again for the actual saved item so DB gets the path/url).
                    if (it.evidence_photo_base64) {
                        try {
                            const buf = Buffer.from(it.evidence_photo_base64, 'base64');
                            const filename = `checklist_${Date.now()}_${(0, uuid_1.v4)()}.jpg`;
                            const uploadsDir = resolveUploadsDir();
                            const filepath = path.resolve(uploadsDir, filename);
                            fs.mkdirSync(path.dirname(filepath), { recursive: true });
                            fs.writeFileSync(filepath, buf);
                            try {
                                fs.chmodSync(filepath, 0o644);
                            }
                            catch (e) {
                                console.error('chmod failed:', e);
                            }
                            const baseForUploads = process.env.S3_PUBLIC_BASE || `${req.protocol}://${req.get('host')}`;
                            const publicUrl = baseForUploads.endsWith('/') ? `${baseForUploads}uploads/${filename}` : `${baseForUploads}/uploads/${filename}`;
                            evidencePhotoUrl = publicUrl;
                            evidencePhotoPath = `backend/uploads/${filename}`;
                        }
                        catch (e) {
                            console.error('failed to write evidence photo (creation)', e);
                        }
                    }
                    // prefer server-saved base64 => otherwise accept only non-local client paths (already uploaded)
                    const rawClientPath2 = it.evidence_photo_path || it.evidence_photo || null;
                    const cleanedClientPath2 = rawClientPath2 && !isLikelyLocalPath(rawClientPath2) ? rawClientPath2 : null;
                    if (cleanedClientPath2 && !evidencePhotoPath)
                        evidencePhotoPath = cleanedClientPath2;
                }
                catch (e) {
                    console.error('failed to write evidence photo', e);
                }
                const fallbackPhotoUrl = (it.evidence_photo_url && !isLikelyLocalPath(it.evidence_photo_url)) ? it.evidence_photo_url : ((it.evidence_photo && !isLikelyLocalPath(it.evidence_photo)) ? it.evidence_photo : null);
                const fallbackPhotoPath = (it.evidence_photo_path && !isLikelyLocalPath(it.evidence_photo_path)) ? it.evidence_photo_path : ((it.evidence_photo && !isLikelyLocalPath(it.evidence_photo)) ? it.evidence_photo : null);
                const item = itemRepo.create({
                    daily_checklist: { id: savedDc.id },
                    question: it.question_id ? { id: it.question_id } : undefined,
                    option: it.option_id ? { id: it.option_id } : undefined,
                    answer_text: it.answer_text,
                    answer_number: it.answer_number,
                    evidence_photo_url: evidencePhotoUrl || fallbackPhotoUrl || null,
                    evidence_photo_path: evidencePhotoPath || fallbackPhotoPath || null,
                    evidence_note: it.evidence_note || it.evidence_description || null,
                });
                const savedItem = await itemRepo.save(item);
                createdItems.push(savedItem);
            }
            // After saving checklist, try to associate with a DAILY WorkOrder and set its start_date to performed_at - 15 minutes
            try {
                const performed = savedDc.performed_at ? new Date(savedDc.performed_at) : new Date();
                const start = new Date(performed.getTime() - (15 * 60 * 1000));
                try {
                    const woRepo = tx.getRepository(WorkOrder_1.WorkOrder);
                    // try to find a DAILY work order for the same asset that is currently deployed/in progress
                    const aidStr = String(alat_id);
                    const candidate = await woRepo.createQueryBuilder('wo')
                        .where("(wo.work_type ILIKE '%DAILY%' OR wo.type_work ILIKE '%DAILY%')")
                        .andWhere("(wo.asset_id = :aid OR (wo.raw->>'asset_id') = :aidStr OR (wo.raw->'asset'->>'id') = :aidStr)", { aid: alat_id, aidStr })
                        .andWhere("wo.status IN ('DEPLOYED','IN_PROGRESS')")
                        .orderBy('wo.created_at', 'DESC')
                        .limit(1)
                        .getOne();
                    if (candidate) {
                        try {
                            const changedBy = (user) ? { id: user.id ?? null, nipp: user.nipp ?? null, name: user.name ?? null, email: user.email ?? null } : null;
                            await woService.updateWorkOrderDates(candidate.id, { start_date: start, changedBy });
                        }
                        catch (e) {
                            console.warn('failed to update workorder start_date from checklist', e);
                        }
                    }
                }
                catch (e) {
                    console.warn('failed to lookup candidate workorder to update start_date', e);
                }
            }
            catch (e) {
                // ignore failures here
            }
            return res.status(201).json({ message: 'created', data: { checklist: savedDc, items: createdItems } });
        });
    }
    catch (err) {
        console.error('submitChecklist error', err);
        return res.status(500).json({ message: 'Failed to save checklist', detail: err instanceof Error ? err.message : err });
    }
}
exports.submitChecklist = submitChecklist;
async function listChecklists(req, res) {
    try {
        const repo = ormconfig_1.AppDataSource.getRepository(DailyChecklist_1.DailyChecklist);
        const search = req.query.q || '';
        const page = Number(req.query.page || 0);
        const pageSize = Number(req.query.pageSize || 0);
        const qb = repo.createQueryBuilder('dc')
            .leftJoinAndSelect('dc.alat', 'alat')
            .leftJoinAndSelect('dc.site', 'site')
            .orderBy('dc.performed_at', 'DESC');
        if (search)
            qb.where('(dc.notes ILIKE :q OR dc.catatan ILIKE :q OR alat.nama ILIKE :q OR site.name ILIKE :q)', { q: `%${search}%` });
        if (page > 0 && pageSize > 0) {
            const offset = (page - 1) * pageSize;
            const [rows, total] = await qb.skip(offset).take(pageSize).getManyAndCount();
            return res.json({ data: rows, meta: { page, pageSize, total } });
        }
        const rows = await qb.limit(100).getMany();
        return res.json(rows);
    }
    catch (err) {
        console.error('listChecklists error', err);
        return res.status(500).json({ message: 'Failed to list checklists' });
    }
}
exports.listChecklists = listChecklists;
async function listMobileChecklists(req, res) {
    try {
        const repo = ormconfig_1.AppDataSource.getRepository(DailyChecklist_1.DailyChecklist);
        const search = req.query.q || '';
        const page = Number(req.query.page || 0);
        const pageSize = Number(req.query.pageSize || 0);
        // determine teknisi from token (for technicians)
        const user = req.user || {};
        const userNipp = user.nipp ? Number(user.nipp) : undefined;
        const dateFilter = req.query.date || '';
        const qb = repo.createQueryBuilder('dc')
            .leftJoinAndSelect('dc.alat', 'alat')
            .leftJoinAndSelect('dc.site', 'site')
            .orderBy('dc.performed_at', 'DESC');
        // if technician, restrict to their records
        if (userNipp)
            qb.andWhere('dc.teknisi_id = :tid', { tid: userNipp });
        // optional date filter YYYY-MM-DD
        if (dateFilter) {
            qb.andWhere('DATE(dc.performed_at) = :d', { d: dateFilter });
        }
        if (search)
            qb.andWhere('(dc.notes ILIKE :q OR alat.nama ILIKE :q OR site.name ILIKE :q)', { q: `%${search}%` });
        if (page > 0 && pageSize > 0) {
            const offset = (page - 1) * pageSize;
            const [rows, total] = await qb.skip(offset).take(pageSize).getManyAndCount();
            return res.json({ data: rows, meta: { page, pageSize, total } });
        }
        const rows = await qb.limit(100).getMany();
        return res.json(rows);
    }
    catch (err) {
        console.error('listMobileChecklists error', err);
        return res.status(500).json({ message: 'Failed to list checklists' });
    }
}
exports.listMobileChecklists = listMobileChecklists;
async function getChecklistById(req, res) {
    try {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: 'id required' });
        const repo = ormconfig_1.AppDataSource.getRepository(DailyChecklist_1.DailyChecklist);
        const row = await repo.findOne({ where: { id }, relations: ['alat', 'site'] });
        if (!row)
            return res.status(404).json({ message: 'not found' });
        const itemRepo = ormconfig_1.AppDataSource.getRepository(DailyChecklistItem_1.DailyChecklistItem);
        const items = await itemRepo.find({ where: { daily_checklist: { id } }, relations: ['question', 'option'] });
        return res.json({ checklist: row, items });
    }
    catch (err) {
        console.error('getChecklistById error', err);
        return res.status(500).json({ message: 'Failed to get checklist' });
    }
}
exports.getChecklistById = getChecklistById;
async function getMobileChecklistById(req, res) {
    try {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: 'id required' });
        const repo = ormconfig_1.AppDataSource.getRepository(DailyChecklist_1.DailyChecklist);
        const row = await repo.findOne({ where: { id }, relations: ['alat', 'site'] });
        if (!row)
            return res.status(404).json({ message: 'not found' });
        // enforce technician can only access their own checklist
        const user = req.user || {};
        const role = (user.role || '').toString();
        const userNipp = user.nipp ? Number(user.nipp) : undefined;
        if (role === 'technician' && userNipp && row.teknisi_id !== undefined) {
            if (Number(row.teknisi_id) !== Number(userNipp)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        const itemRepo = ormconfig_1.AppDataSource.getRepository(DailyChecklistItem_1.DailyChecklistItem);
        const items = await itemRepo.find({ where: { daily_checklist: { id } }, relations: ['question', 'option'] });
        return res.json({ checklist: row, items });
    }
    catch (err) {
        console.error('getMobileChecklistById error', err);
        return res.status(500).json({ message: 'Failed to get checklist' });
    }
}
exports.getMobileChecklistById = getMobileChecklistById;
