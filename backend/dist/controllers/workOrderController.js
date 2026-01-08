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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.undeployWorkOrder = exports.deployWorkOrder = exports.getWorkOrderById = exports.getWorkOrderDateHistory = exports.updateWorkOrderDates = exports.fetchAndCreateFromSigap = exports.listWorkOrders = exports.listWorkOrdersPaginated = void 0;
const axios_1 = __importDefault(require("axios"));
const service = __importStar(require("../services/workOrderService"));
const ormconfig_1 = require("../ormconfig");
const Task_1 = require("../entities/Task");
const Assignment_1 = require("../entities/Assignment");
const WorkOrder_1 = require("../entities/WorkOrder");
const User_1 = require("../entities/User");
const console_1 = require("console");
const SIGAP_BASE = process.env.SIGAP_API_BASE || 'https://sigap-api.pelindo.co.id';
const SIGAP_BEARER_TOKEN = process.env.SIGAP_BEARER_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKV1RTZXJ2aWNlQWNjZXNzVG9rZW4iLCJqdGkiOiIwMTQ2MzY3NS01NDA0LTQyMzQtOTQwYy0xNzA0NmI0M2VlNWUiLCJpYXQiOiIxNzY1MjY4MjExIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI2MzQ0IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IjEwNDM1NTEiLCJpZCI6IjYzNDQiLCJ1c2VybmFtZSI6IjEwNDM1NTEiLCJlbWFpbCI6ImFAdGVzdC5jb20iLCJjb21wYW55X2lkIjoiMSIsInN1cGVyYWRtaW4iOiIwIiwic3RhdHVzIjoiMSIsIm1hbmR0IjoiMzAwIiwicGVyc29uaWxfaWQiOiIxMzc5MiIsImV4cCI6NTU1MjA5MzgxMSwiaXNzIjoiQklNQSIsImF1ZCI6IkJJTUEifQ.ug1pTEw6JQc8--ZadUUCwKHh-iq5lFHgGldeRroazQw';
// ----- PAGINATION + SEARCH -----
async function listWorkOrdersPaginated(req, res) {
    try {
        const q = req.query.q || '';
        const page = Math.max(Number(req.query.page || 1), 1);
        const pageSize = Math.max(Number(req.query.pageSize || 10), 1);
        const site = req.query.site || '';
        const { rows, total } = await service.getWorkOrdersPaginated({ q, page, pageSize, site });
        return res.json({
            data: rows.map(r => ({ ...r, status: r.status ?? 'NEW' })),
            meta: { page, pageSize, total },
        });
    }
    catch (err) {
        console.error('listWorkOrdersPaginated error', err);
        return res.status(500).json({ message: 'Failed to load work orders' });
    }
}
exports.listWorkOrdersPaginated = listWorkOrdersPaginated;
async function listWorkOrders(req, res) {
    try {
        const rows = await service.getAllWorkOrders();
        return res.json(rows);
    }
    catch (err) {
        console.error('listWorkOrders error', err);
        return res.status(500).json({ message: 'Failed to load work orders' });
    }
}
exports.listWorkOrders = listWorkOrders;
function buildSigapHeaders() {
    const headers = { Accept: 'application/json' };
    if (SIGAP_BEARER_TOKEN)
        headers['Authorization'] = `Bearer ${SIGAP_BEARER_TOKEN}`;
    return headers;
}
/**
 * POST /api/work-orders/add
 * body: { id: string|number }
 */
async function fetchAndCreateFromSigap(req, res) {
    try {
        const { id } = req.body || {};
        if (!id)
            return res.status(400).json({ message: 'id required' });
        const url = `${SIGAP_BASE}/api/Work/WorkOrderAgreement/GetData/${encodeURIComponent(String(id))}`;
        const headers = buildSigapHeaders();
        // debug log
        // console.log('[SIGAP] requesting', url);
        // console.log('[SIGAP] headers:', headers);
        // axios typed response
        const r = await axios_1.default.get(url, { headers, timeout: 15000 });
        // SIGAP wrapper has .data field containing actual workorder
        const payload = r.data?.data;
        if (!payload) {
            console.warn('SIGAP returned empty data', { url, status: r.status, body: r.data });
            return res.status(502).json({ message: 'SIGAP returned empty data', detail: r.data });
        }
        // pick the first non-empty candidate (prefer explicit start_downtime/up_date)
        const firstNonEmpty = (arr) => {
            for (const v of arr) {
                if (v !== undefined && v !== null && String(v).toString().trim() !== '')
                    return v;
            }
            return null;
        };
        // console.log('[SIGAP] body:', payload);
        const rawStart = payload.start_downtime;
        const rawEnd = payload.up_date;
        // log values for debugging
        // console.log('[SIGAP] resolved rawStart:', rawStart);
        // console.log('[SIGAP] resolved rawEnd:', rawEnd);
        // prefer SIGAP's `start_downtime` for start_date and `up_date` for end_date.
        // We store dates "apa adanya" (as-is) without timezone conversion — format as SQL-friendly 'YYYY-MM-DD HH:mm:ss'.
        const startSql = formatSigapToSqlDatetime(rawStart ?? null);
        const endSql = formatSigapToSqlDatetime(rawEnd ?? null);
        (0, console_1.debug)('[SIGAP] formatted startSql:', startSql);
        (0, console_1.debug)('[SIGAP] formatted endSql:', endSql);
        const startIso = parseSigapDateToIso(rawStart ?? null);
        const endIso = parseSigapDateToIso(rawEnd ?? null);
        // NOTE: we intentionally store SQL-formatted datetime strings ("YYYY-MM-DD HH:mm:ss")
        // without converting timezones. Avoid constructing JS Date objects here to prevent
        // implicit timezone interpretation by the runtime.
        // Keep parsed ISO/date objects only for diagnostics if needed, but do not pass them
        // to the service when persisting.
        const startDateObj = startIso ? new Date(startIso) : (startSql ? new Date(startSql.replace(' ', 'T')) : undefined);
        const endDateObj = endIso ? new Date(endIso) : (endSql ? new Date(endSql.replace(' ', 'T')) : undefined);
        const mapped = {
            sigap_id: payload.id ?? undefined,
            doc_no: payload.doc_no ?? undefined,
            date_doc: payload.date_doc ?? undefined,
            asset_id: payload.asset_id ?? payload.asset?.id ?? undefined,
            asset_name: payload.asset_name ?? payload.asset?.name ?? undefined,
            type_work: payload.type_work ?? undefined,
            work_type: payload.work_type ?? undefined,
            description: payload.description ?? undefined,
            // store SQL strings as-is (no timezone conversion): prefer formatted SQL if available
            start_date: startSql ?? undefined,
            end_date: endSql ?? undefined,
            raw: payload ?? undefined,
        };
        console.log('[SIGAP] mapped start_date:', mapped.start_date, ' (from rawStart=', rawStart, ')');
        console.log('[SIGAP] mapped end_date:', mapped.end_date, ' (from rawEnd=', rawEnd, ')');
        const saved = await service.createOrUpdateFromSigap(mapped);
        return res.status(201).json({ message: 'saved', data: saved });
    }
    catch (err) {
        // Improved logging
        console.error('fetchAndCreateFromSigap error:', {
            message: err.message,
            status: err?.response?.status,
            responseData: err?.response?.data,
            responseHeaders: err?.response?.headers
        });
        // If 401 from SIGAP, return 502 to indicate upstream auth issue
        const upstreamStatus = err?.response?.status;
        if (upstreamStatus === 401) {
            return res.status(502).json({ message: 'Failed to fetch or save', detail: 'SIGAP returned 401 Unauthorized — check SIGAP_BEARER_TOKEN or token expiry/permissions' });
        }
        const detail = err?.response?.data ?? err.message ?? 'error';
        return res.status(500).json({ message: 'Failed to fetch or save', detail });
    }
}
exports.fetchAndCreateFromSigap = fetchAndCreateFromSigap;
function parseSigapDateToIso(raw) {
    if (!raw)
        return undefined;
    const m = String(raw).trim();
    // Common patterns we want to accept:
    // DD/MM/YYYY HH:mm:ss
    // DD-MM-YYYY HH:mm[:ss]
    // YYYY-MM-DD HH:mm:ss
    // ISO-ish strings
    // Fallback to Date parsing
    // try MM/DD/YYYY[ HH:MM:SS] (SIGAP uses mm/dd/yyyy)
    let rx = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
    let match = rx.exec(m);
    if (match) {
        // SIGAP uses mm/dd/yyyy — group1=month, group2=day
        const [, mm, dd, yyyy, HH = '00', MI = '00', SS = '00'] = match;
        const iso = `${yyyy.padStart(4, '0')}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}T${String(HH).padStart(2, '0')}:${String(MI).padStart(2, '0')}:${String(SS).padStart(2, '0')}Z`;
        // validate
        const d = new Date(iso);
        if (!isNaN(d.getTime()))
            return iso;
        // fallback: try interpreting as DD/MM/YYYY if month/day swapped
        const altIso = `${yyyy.padStart(4, '0')}-${String(dd).padStart(2, '0')}-${String(mm).padStart(2, '0')}T${String(HH).padStart(2, '0')}:${String(MI).padStart(2, '0')}:${String(SS).padStart(2, '0')}Z`;
        const d2 = new Date(altIso);
        if (!isNaN(d2.getTime()))
            return altIso;
    }
    // try DD-MM-YYYY
    rx = /^(\d{1,2})-(\d{1,2})-(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
    match = rx.exec(m);
    if (match) {
        const [, dd, mm, yyyy, HH = '00', MI = '00', SS = '00'] = match;
        const iso = `${yyyy.padStart(4, '0')}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T${String(HH).padStart(2, '0')}:${String(MI).padStart(2, '0')}:${String(SS).padStart(2, '0')}Z`;
        return iso;
    }
    // try ISO / other parseable formats
    const isoTry = new Date(m);
    if (!isNaN(isoTry.getTime()))
        return isoTry.toISOString();
    return undefined;
}
/**
 * Convert SIGAP raw date (commonly MM/DD/YYYY HH:mm:ss) into SQL datetime string
 * 'YYYY-MM-DD HH:mm:ss' without timezone information so it can be stored as-is.
 */
function formatSigapToSqlDatetime(raw) {
    if (!raw)
        return undefined;
    const m = String(raw).trim();
    // common SIGAP format: MM/DD/YYYY HH:mm:ss
    let rx = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
    let match = rx.exec(m);
    if (match) {
        const [, mm, dd, yyyy, HH = '00', MI = '00', SS = '00'] = match;
        const month = String(mm).padStart(2, '0');
        const day = String(dd).padStart(2, '0');
        const hour = String(HH).padStart(2, '0');
        const minute = String(MI).padStart(2, '0');
        const second = String(SS).padStart(2, '0');
        const out = `${yyyy.padStart(4, '0')}-${month}-${day} ${hour}:${minute}:${second}`;
        return out;
    }
    // try DD-MM-YYYY or DD/MM/YYYY handled by parseSigapDateToIso fallback — try extracting numbers and format
    rx = /^(\d{1,2})-(\d{1,2})-(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
    match = rx.exec(m);
    if (match) {
        const [, dd, mm, yyyy, HH = '00', MI = '00', SS = '00'] = match;
        const month = String(mm).padStart(2, '0');
        const day = String(dd).padStart(2, '0');
        const hour = String(HH).padStart(2, '0');
        const minute = String(MI).padStart(2, '0');
        const second = String(SS).padStart(2, '0');
        return `${yyyy.padStart(4, '0')}-${month}-${day} ${hour}:${minute}:${second}`;
    }
    // If it's already an ISO-like string, try to convert to local-like SQL string without timezone
    const isoTry = new Date(m);
    if (!isNaN(isoTry.getTime())) {
        const dt = isoTry;
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const day = String(dt.getDate()).padStart(2, '0');
        const hour = String(dt.getHours()).padStart(2, '0');
        const minute = String(dt.getMinutes()).padStart(2, '0');
        const second = String(dt.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
    return undefined;
}
// ----- UPDATE DATES -----
async function updateWorkOrderDates(req, res) {
    try {
        const id = req.params.id;
        const { start_date, end_date, keterangan, note } = req.body || {};
        if (!start_date && !end_date) {
            return res.status(400).json({ message: 'start_date or end_date required' });
        }
        // parse to Date or null
        const s = start_date ? new Date(start_date) : undefined;
        const e = end_date ? new Date(end_date) : undefined;
        if (start_date && isNaN(s.getTime()))
            return res.status(400).json({ message: 'Invalid start_date format' });
        if (end_date && isNaN(e.getTime()))
            return res.status(400).json({ message: 'Invalid end_date format' });
        // validate end must be greater than start when both provided
        if (s && e && e.getTime() <= s.getTime()) {
            return res.status(400).json({ message: 'end_date must be after start_date' });
        }
        // capture minimal user info if available (authMiddleware attaches req.user)
        const user = req.user;
        function pickFirst(u, paths) {
            if (!u)
                return null;
            for (const p of paths) {
                const parts = p.split('.');
                let cur = u;
                let ok = true;
                for (const part of parts) {
                    if (cur == null) {
                        ok = false;
                        break;
                    }
                    cur = cur[part];
                }
                if (ok && cur != null)
                    return cur;
            }
            return null;
        }
        let changedBy = null;
        if (user) {
            // start with claims present in token
            changedBy = {
                id: pickFirst(user, ['id', 'sub', 'userId', 'user_id']) || null,
                nipp: pickFirst(user, ['nipp', 'nip', 'personil.nipp', 'personil.nip']) || null,
                email: pickFirst(user, ['email', 'mail', 'user_email']) || null,
                name: pickFirst(user, ['name', 'username', 'fullName', 'fullname', 'displayName', 'personil.name']) || null,
            };
            // if nipp or name missing, try to load full user profile from DB by id
            try {
                const uid = changedBy.id;
                if (uid && (!changedBy.nipp || !changedBy.name)) {
                    const ur = await ormconfig_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: String(uid) });
                    if (ur) {
                        if (!changedBy.nipp && ur.nipp)
                            changedBy.nipp = ur.nipp;
                        if (!changedBy.name && ur.name)
                            changedBy.name = ur.name;
                        if (!changedBy.email && ur.email)
                            changedBy.email = ur.email;
                    }
                }
            }
            catch (e) {
                // ignore DB lookup failures
                console.debug('failed to lookup user profile for changed_by enrichment', e);
            }
        }
        const updated = await service.updateWorkOrderDates(id, { start_date: s, end_date: e, note: (keterangan || note) ?? undefined, changedBy });
        return res.json({ message: 'updated', data: updated });
    }
    catch (err) {
        console.error('updateWorkOrderDates error', err);
        return res.status(500).json({ message: 'Failed to update work order' });
    }
}
exports.updateWorkOrderDates = updateWorkOrderDates;
async function getWorkOrderDateHistory(req, res) {
    try {
        const id = req.params.id;
        const rows = await service.getWorkOrderDateHistory(id);
        return res.json({ data: rows });
    }
    catch (err) {
        console.error('getWorkOrderDateHistory error', err);
        return res.status(500).json({ message: 'Failed to load date history' });
    }
}
exports.getWorkOrderDateHistory = getWorkOrderDateHistory;
/**
 * Ensure entity object converts Date fields to ISO strings.
 */
function serializeWorkOrder(wo) {
    if (!wo)
        return wo;
    const out = { ...wo };
    try {
        // If TypeORM returns Date objects, convert to ISO strings
        out.start_date = wo.start_date ? (new Date(wo.start_date)).toISOString() : null;
    }
    catch (e) {
        out.start_date = null;
    }
    try {
        out.end_date = wo.end_date ? (new Date(wo.end_date)).toISOString() : null;
    }
    catch (e) {
        out.end_date = null;
    }
    return out;
}
/** GET /api/work-orders/:id */
async function getWorkOrderById(req, res) {
    try {
        const id = req.params.id;
        const wo = await service.getWorkOrderById(id);
        if (!wo)
            return res.status(404).json({ message: 'WorkOrder not found' });
        const s = serializeWorkOrder(wo);
        s.status = wo.status ?? 'NEW';
        try {
            const prog = await service.computeWorkOrderProgress(String(wo.id));
            s.progress = prog; // fractional 0..1
        }
        catch (e) {
            s.progress = 0;
        }
        return res.json({ data: s });
    }
    catch (err) {
        console.error('getWorkOrderById error', err);
        return res.status(500).json({ message: 'Failed to get work order', detail: err.message || err });
    }
}
exports.getWorkOrderById = getWorkOrderById;
/** POST /api/work-orders/:id/deploy */
async function deployWorkOrder(req, res) {
    try {
        const id = req.params.id;
        const woRepo = ormconfig_1.AppDataSource.getRepository(WorkOrder_1.WorkOrder);
        const wo = await woRepo.findOneBy({ id });
        if (!wo)
            return res.status(404).json({ code: 'NOT_FOUND', message: 'WorkOrder not found' });
        // create one assignment record per task (ensure task_id included)
        const taskRepo = ormconfig_1.AppDataSource.getRepository(Task_1.Task);
        const tasks = await taskRepo.createQueryBuilder('t')
            .leftJoinAndSelect('t.assignments', 'ta')
            .leftJoinAndSelect('ta.user', 'u')
            .where('t.workOrder = :wo', { wo: id })
            .getMany();
        if (!tasks || tasks.length === 0) {
            return res.status(400).json({ code: 'NO_TASKS', message: 'No tasks found for this work order' });
        }
        const assignmentRepo = ormconfig_1.AppDataSource.getRepository(Assignment_1.Assignment);
        const created = [];
        for (const t of tasks) {
            try {
                const taskId = t.id;
                const taskName = t.name ?? '';
                // pick first assigned user for this task (if any)
                const assigns = t.assignments || [];
                // additionally, gather any personils from workorder raw.labours that may represent assigned technicians
                const extraAssignees = [];
                try {
                    const raw = wo.raw;
                    if (raw && Array.isArray(raw.labours)) {
                        for (const lab of raw.labours) {
                            try {
                                const personils = lab?.personils ?? [];
                                if (Array.isArray(personils)) {
                                    for (const p of personils) {
                                        try {
                                            // try personil.nip or personil.personil?.nip
                                            const pp = p;
                                            const nip = pp['nipp'] ?? pp['nip'] ?? (pp['personil'] ? pp['personil']['nip'] : null);
                                            if (nip)
                                                extraAssignees.push(String(nip));
                                        }
                                        catch (e) { }
                                    }
                                }
                            }
                            catch (e) { }
                        }
                    }
                }
                catch (e) { }
                if (assigns.length > 0 || extraAssignees.length > 0) {
                    // create one assignment record per TaskAssignment.user (support multiple technicians per task)
                    // collect assignee ids from Task.assignments (UUIDs) and from extraAssignees (nipp strings which we'll try to resolve)
                    const assigneeCandidates = [];
                    for (const ta of assigns) {
                        assigneeCandidates.push(ta?.user?.id ?? ta?.user_id ?? ta?.userId ?? undefined);
                    }
                    // resolve extraAssignees (nipp) to user UUIDs when possible
                    // we'll resolve extraAssignees (nipp values) to user UUIDs below
                    // process Task.assignments first
                    for (const ta of assigns) {
                        const assigneeId = ta?.user?.id ?? ta?.user_id ?? ta?.userId ?? undefined;
                        // avoid creating duplicate assignment for same wo+task+assignee
                        const exists = await assignmentRepo.createQueryBuilder('a')
                            .where('a.wo_id = :wo AND a.task_id = :task AND (a.assignee_id = :assignee OR (:assignee IS NULL AND a.assignee_id IS NULL))', { wo: id, task: taskId, assignee: assigneeId ?? null })
                            .getOne();
                        if (exists) {
                            exists.assigneeId = assigneeId ?? exists.assigneeId;
                            exists.task_name = taskName || exists.task_name;
                            exists.status = 'DEPLOYED';
                            const saved = await assignmentRepo.save(exists);
                            created.push(saved);
                            continue;
                        }
                        const a = new Assignment_1.Assignment();
                        a.wo = wo;
                        a.assigneeId = assigneeId;
                        a.task_id = String(taskId);
                        a.task_name = taskName;
                        a.status = 'DEPLOYED';
                        const saved = await assignmentRepo.save(a);
                        created.push(saved);
                    }
                    // now process extraAssignees (nipp values) attempting to resolve to User by nipp
                    if (extraAssignees.length > 0) {
                        try {
                            const userRepo = ormconfig_1.AppDataSource.getRepository((await Promise.resolve().then(() => __importStar(require('../entities/User')))).User);
                            for (const nip of extraAssignees) {
                                try {
                                    if (nip == null)
                                        continue;
                                    const u = await userRepo.findOneBy({ nipp: String(nip) });
                                    const assigneeId = u ? String(u.id) : String(nip);
                                    // avoid duplicate creation when same id already created
                                    const exists = await assignmentRepo.createQueryBuilder('a')
                                        .where('a.wo_id = :wo AND a.task_id = :task AND (a.assignee_id = :assignee OR (:assignee IS NULL AND a.assignee_id IS NULL))', { wo: id, task: taskId, assignee: assigneeId ?? null })
                                        .getOne();
                                    if (exists)
                                        continue;
                                    const a = new Assignment_1.Assignment();
                                    a.wo = wo;
                                    a.assigneeId = u ? String(u.id) : undefined;
                                    a.task_id = String(taskId);
                                    a.task_name = taskName;
                                    a.status = 'DEPLOYED';
                                    const saved = await assignmentRepo.save(a);
                                    created.push(saved);
                                }
                                catch (e) { }
                            }
                        }
                        catch (e) { }
                    }
                }
                else {
                    // no task-level assignments — create a single assignment row without assignee
                    const exists = await assignmentRepo.createQueryBuilder('a')
                        .where('a.wo_id = :wo AND a.task_id = :task', { wo: id, task: taskId })
                        .getOne();
                    if (exists) {
                        exists.task_name = taskName || exists.task_name;
                        exists.status = 'DEPLOYED';
                        const saved = await assignmentRepo.save(exists);
                        created.push(saved);
                        continue;
                    }
                    const a = new Assignment_1.Assignment();
                    a.wo = wo;
                    a.assigneeId = undefined;
                    a.task_id = String(taskId);
                    a.task_name = taskName;
                    a.status = 'DEPLOYED';
                    const saved = await assignmentRepo.save(a);
                    created.push(saved);
                }
            }
            catch (e) {
                console.warn('failed to create assignment for task', t.id, e);
            }
        }
        // update work order status
        wo.status = 'DEPLOYED';
        await woRepo.save(wo);
        return res.status(201).json({ message: 'deployed', created });
    }
    catch (err) {
        console.error('deployWorkOrder error', err);
        return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to deploy work order' });
    }
}
exports.deployWorkOrder = deployWorkOrder;
/** POST /api/work-orders/:id/undeploy */
async function undeployWorkOrder(req, res) {
    try {
        const id = req.params.id;
        const woRepo = ormconfig_1.AppDataSource.getRepository(WorkOrder_1.WorkOrder);
        const wo = await woRepo.findOneBy({ id });
        if (!wo)
            return res.status(404).json({ code: 'NOT_FOUND', message: 'WorkOrder not found' });
        // Prevent undeploy while workorder is IN_PROGRESS
        if (wo.status === 'IN_PROGRESS') {
            return res.status(400).json({ code: 'INVALID_STATE', message: 'Cannot undeploy WorkOrder while IN_PROGRESS' });
        }
        const assignmentRepo = ormconfig_1.AppDataSource.getRepository(Assignment_1.Assignment);
        const toRemove = await assignmentRepo.createQueryBuilder('a').where('a.wo_id = :wo AND a.status = :s', { wo: id, s: 'DEPLOYED' }).getMany();
        for (const r of toRemove) {
            await assignmentRepo.remove(r);
        }
        // set work order back to READY_TO_DEPLOY
        wo.status = 'READY_TO_DEPLOY';
        await woRepo.save(wo);
        return res.json({ message: 'undeployed', removed: toRemove.length });
    }
    catch (err) {
        console.error('undeployWorkOrder error', err);
        return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to undeploy work order' });
    }
}
exports.undeployWorkOrder = undeployWorkOrder;
