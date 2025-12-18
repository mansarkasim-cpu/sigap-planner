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
exports.undeployWorkOrder = exports.deployWorkOrder = exports.getWorkOrderById = exports.updateWorkOrderDates = exports.fetchAndCreateFromSigap = exports.listWorkOrders = exports.listWorkOrdersPaginated = void 0;
const axios_1 = __importDefault(require("axios"));
const service = __importStar(require("../services/workOrderService"));
const ormconfig_1 = require("../ormconfig");
const Task_1 = require("../entities/Task");
const Assignment_1 = require("../entities/Assignment");
const WorkOrder_1 = require("../entities/WorkOrder");
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
        // prefer ISO-parsed Date, fallback to SQL-like string converted to a Date by replacing space with 'T'
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
            // pass Date objects to the service (matches service signature)
            start_date: startDateObj ?? undefined,
            end_date: endDateObj ?? undefined,
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
        const { start_date, end_date } = req.body || {};
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
        const updated = await service.updateWorkOrderDates(id, { start_date: s, end_date: e });
        return res.json({ message: 'updated', data: updated });
    }
    catch (err) {
        console.error('updateWorkOrderDates error', err);
        return res.status(500).json({ message: 'Failed to update work order' });
    }
}
exports.updateWorkOrderDates = updateWorkOrderDates;
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
        // planner can choose whether to split assignments across shifts
        const splitFlag = req.body && typeof req.body.split !== 'undefined' ? Boolean(req.body.split) : true;
        // define shift defs and helper functions here so they are available both
        // inside the task loop and later when attaching candidate technicians.
        const SHIFT_DEFS = [
            { id: 1, start: '08:00', end: '16:00' },
            { id: 2, start: '16:00', end: '24:00' },
            { id: 3, start: '00:00', end: '08:00' },
        ];
        function timeToMinutes(t) { const parts = String(t || '').split(':'); const hh = Number(parts[0] || 0); const mm = Number(parts[1] || 0); return hh * 60 + mm; }
        function findShiftIdForDate(d) {
            const hh = d.getHours();
            const mm = d.getMinutes();
            const mins = hh * 60 + mm;
            for (const s of SHIFT_DEFS) {
                const startM = timeToMinutes(s.start);
                const endM = timeToMinutes(s.end === '24:00' ? '24:00' : s.end);
                if (startM <= mins && mins < endM)
                    return s.id;
                if (startM > endM) {
                    if (mins >= startM || mins < endM)
                        return s.id;
                }
            }
            return null;
        }
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
                // attempt to determine task-level scheduled start/end from workorder
                let taskStart = null;
                let taskEnd = null;
                try {
                    const ws = wo.start_date ?? wo.raw?.start_date ?? wo.raw?.date_start ?? null;
                    const we = wo.end_date ?? wo.raw?.end_date ?? wo.raw?.date_end ?? null;
                    if (ws)
                        taskStart = new Date(ws);
                    if (we)
                        taskEnd = new Date(we);
                }
                catch (e) { }
                // helper: split a time range into shift-aligned segments using SHIFT_DEFS
                function splitIntoShiftSegments(s, e) {
                    const out = [];
                    if (!s || !e || e.getTime() <= s.getTime())
                        return out;
                    // build boundary times between s..e: for each date in range produce shift start times
                    const boundaries = [s.getTime(), e.getTime()];
                    const startDay = new Date(s.getFullYear(), s.getMonth(), s.getDate());
                    const endDay = new Date(e.getFullYear(), e.getMonth(), e.getDate());
                    for (let dt = new Date(startDay); dt.getTime() <= endDay.getTime() + 24 * 60 * 60 * 1000; dt.setDate(dt.getDate() + 1)) {
                        const year = dt.getFullYear(), month = dt.getMonth(), day = dt.getDate();
                        for (const def of SHIFT_DEFS) {
                            const [sh, sm] = def.start.split(':').map(x => Number(x || 0));
                            // treat '24:00' not used in start
                            const bd = new Date(year, month, day, sh, sm, 0, 0);
                            boundaries.push(bd.getTime());
                            // if def.end == '24:00', add next day 00:00
                            if (def.end === '24:00') {
                                const bd2 = new Date(year, month, day + 1, 0, 0, 0, 0);
                                boundaries.push(bd2.getTime());
                            }
                            else {
                                const [eh, em] = def.end.split(':').map(x => Number(x || 0));
                                const bd3 = new Date(year, month, day, eh, em, 0, 0);
                                boundaries.push(bd3.getTime());
                            }
                        }
                    }
                    const uniq = Array.from(new Set(boundaries)).sort((a, b) => a - b);
                    for (let i = 0; i < uniq.length - 1; i++) {
                        const segS = Math.max(s.getTime(), uniq[i]);
                        const segE = Math.min(e.getTime(), uniq[i + 1]);
                        if (segE > segS) {
                            const sd = new Date(segS);
                            const ed = new Date(segE);
                            out.push({ start: sd, end: ed, shiftId: findShiftIdForDate(sd) });
                        }
                    }
                    return out;
                }
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
                        // if we have taskStart/taskEnd and planner opted-in, split into segments
                        const segments = (taskStart && taskEnd && splitFlag) ? splitIntoShiftSegments(taskStart, taskEnd) : [];
                        if (segments.length > 0) {
                            for (const seg of segments) {
                                const exists = await assignmentRepo.createQueryBuilder('a')
                                    .where('a.wo_id = :wo AND a.task_id = :task AND (a.assignee_id = :assignee OR (:assignee IS NULL AND a.assignee_id IS NULL)) AND COALESCE(a.scheduled_at, to_timestamp(0)) = :s', { wo: id, task: taskId, assignee: assigneeId ?? null, s: seg.start.toISOString() })
                                    .getOne();
                                if (exists) {
                                    exists.assigneeId = assigneeId ?? exists.assigneeId;
                                    exists.task_name = taskName || exists.task_name;
                                    exists.status = 'DEPLOYED';
                                    exists.scheduledAt = seg.start;
                                    exists.scheduledEnd = seg.end;
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
                                a.scheduledAt = seg.start;
                                a.scheduledEnd = seg.end;
                                const saved = await assignmentRepo.save(a);
                                created.push(saved);
                            }
                        }
                        else {
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
                                    // if we have taskStart/taskEnd, create per-segment
                                    const segments = (taskStart && taskEnd && splitFlag) ? splitIntoShiftSegments(taskStart, taskEnd) : [];
                                    if (segments.length > 0) {
                                        for (const seg of segments) {
                                            const exists = await assignmentRepo.createQueryBuilder('a')
                                                .where('a.wo_id = :wo AND a.task_id = :task AND (a.assignee_id = :assignee OR (:assignee IS NULL AND a.assignee_id IS NULL)) AND COALESCE(a.scheduled_at, to_timestamp(0)) = :s', { wo: id, task: taskId, assignee: assigneeId ?? null, s: seg.start.toISOString() })
                                                .getOne();
                                            if (exists)
                                                continue;
                                            const a = new Assignment_1.Assignment();
                                            a.wo = wo;
                                            a.assigneeId = u ? String(u.id) : undefined;
                                            a.task_id = String(taskId);
                                            a.task_name = taskName;
                                            a.status = 'DEPLOYED';
                                            a.scheduledAt = seg.start;
                                            a.scheduledEnd = seg.end;
                                            const saved = await assignmentRepo.save(a);
                                            created.push(saved);
                                        }
                                    }
                                    else {
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
        // after creating assignments: attach candidate technicians for any created segment lacking assignee
        try {
            const userCandidates = {};
            for (const c of created) {
                try {
                    const sa = c.scheduledAt;
                    const assigneeId = c.assigneeId;
                    if (!sa || assigneeId)
                        continue;
                    const dt = new Date(sa);
                    if (isNaN(dt.getTime()))
                        continue;
                    // build date and time strings
                    const pad = (n) => String(n).padStart(2, '0');
                    const dateStr = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
                    const timeStr = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
                    const site = wo.vendor_cabang ?? wo.raw?.site ?? null;
                    // determine shiftId for this scheduledAt
                    const shiftId = findShiftIdForDate(dt);
                    if (shiftId === null)
                        continue;
                    const params = [dateStr, shiftId];
                    let siteCond = '';
                    if (site) {
                        params.push(String(site));
                        siteCond = ' AND LOWER(COALESCE(a.site,\'\')) = LOWER($3)';
                    }
                    const sql = `
            SELECT DISTINCT u.* FROM "user" u
            JOIN (
              SELECT g.id as gid, jsonb_array_elements_text(g.members) as member_id_text
              FROM shift_group g
            ) gm ON gm.member_id_text = u.id::text
            JOIN shift_assignment a ON a.group_id = gm.gid
            WHERE a.date = $1 ${siteCond} AND a.shift = $2
          `;
                    try {
                        const rows = await ormconfig_1.AppDataSource.manager.query(sql, params);
                        c.candidateTechnicians = rows || [];
                    }
                    catch (e) {
                        c.candidateTechnicians = [];
                    }
                }
                catch (e) {
                    // ignore candidate fetch errors per-segment
                }
            }
        }
        catch (e) {
            console.warn('failed to attach candidateTechnicians', e);
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
