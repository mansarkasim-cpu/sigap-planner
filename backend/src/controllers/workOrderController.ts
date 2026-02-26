// src/controllers/workOrderController.ts
import { Request, Response } from 'express';
import axios from 'axios';
import * as service from '../services/workOrderService';
import { AppDataSource } from '../ormconfig';
import { pushNotify } from '../services/pushService';
import { Task } from '../entities/Task';
import { Assignment } from '../entities/Assignment';
import { WorkOrder } from '../entities/WorkOrder';
import { User } from '../entities/User';
import { debug } from 'console';

const SIGAP_BASE = process.env.SIGAP_API_BASE || 'https://sigap-api.pelindo.co.id';
const SIGAP_BEARER_TOKEN = process.env.SIGAP_BEARER_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKV1RTZXJ2aWNlQWNjZXNzVG9rZW4iLCJqdGkiOiIwMTQ2MzY3NS01NDA0LTQyMzQtOTQwYy0xNzA0NmI0M2VlNWUiLCJpYXQiOiIxNzY1MjY4MjExIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI2MzQ0IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IjEwNDM1NTEiLCJpZCI6IjYzNDQiLCJ1c2VybmFtZSI6IjEwNDM1NTEiLCJlbWFpbCI6ImFAdGVzdC5jb20iLCJjb21wYW55X2lkIjoiMSIsInN1cGVyYWRtaW4iOiIwIiwic3RhdHVzIjoiMSIsIm1hbmR0IjoiMzAwIiwicGVyc29uaWxfaWQiOiIxMzc5MiIsImV4cCI6NTU1MjA5MzgxMSwiaXNzIjoiQklNQSIsImF1ZCI6IkJJTUEifQ.ug1pTEw6JQc8--ZadUUCwKHh-iq5lFHgGldeRroazQw';

interface SigapWorkOrder {
  id: number;
  doc_no?: string;
  date_doc?: string;
  description?: string;
  asset_id?: number;
  asset_name?: string;
  type_work?: string;
  work_type?: string;
  activities?: any[];
  labours?: any[];
  // add other fields as needed
}

interface SigapWrapper<T> {
  status: string;
  message: any;
  data: T;
}

// ----- PAGINATION + SEARCH -----
export async function listWorkOrdersPaginated(req: Request, res: Response) {
  try {
    const q = (req.query.q as string) || '';
    const page = Math.max(Number(req.query.page || 1), 1);
    const pageSize = Math.max(Number(req.query.pageSize || 10), 1);
    const site = (req.query.site as string) || '';
    const date = (req.query.date as string) || '';
    const jenis = (req.query.jenis as string) || '';
    const work_type = (req.query.work_type as string) || undefined;
    const type_work = (req.query.type_work as string) || undefined;
    const exclude_status = (req.query.exclude_status as string) || undefined;
    const exclude_status = (req.query.exclude_status as string) || undefined;
    const exclude_work_type = (req.query.exclude_work_type as string) || undefined;

    const { rows, total } = await service.getWorkOrdersPaginated({ q, page, pageSize, site, date, jenis, work_type, type_work, exclude_work_type });

    return res.json({
      data: rows.map(r => {
        const s = serializeWorkOrder(r);
        s.status = (r as any).status ?? 'NEW';
        return s;
      }),
      meta: { page, pageSize, total },
    });
  } catch (err) {
    console.error('listWorkOrdersPaginated error', err);
    return res.status(500).json({ message: 'Failed to load work orders' });
  }
}

  /**
   * GET /api/work-orders/gantt
   * Query: start, end (ISO datetimes) [, site, work_type, type_work]
   * Returns work orders overlapping the given time range.
   */
  export async function listWorkOrdersForGantt(req: Request, res: Response) {
    try {
      let start = (req.query.start as string) || '';
      let end = (req.query.end as string) || '';
      const site = (req.query.site as string) || '';
      const work_type = (req.query.work_type as string) || '';
      const type_work = (req.query.type_work as string) || '';

      // normalize naive datetimes by appending Z if missing so Postgres timestamptz interprets them safely
      function normalizeTs(v: string) {
        if (!v) return v;
        if (/[zZ]|[+\-]\d{2}:?\d{2}$/.test(v)) return v;
        return v + 'Z';
      }
      if (start) start = normalizeTs(start);
      if (end) end = normalizeTs(end);

      // If both start and end are missing, default to a 30-day window centered on today
      if (!start && !end) {
        const now = new Date();
        const s = new Date(now);
        s.setDate(s.getDate() - 15);
        s.setHours(0,0,0,0);
        const e = new Date(now);
        e.setDate(e.getDate() + 45);
        e.setHours(23,59,59,999);
        start = s.toISOString();
        end = e.toISOString();
      }

      const rows = await service.getWorkOrdersForGantt({ start, end, site, work_type, type_work });
      const out = Array.isArray(rows) ? rows.map(r => {
        const s = serializeWorkOrder(r);
        s.status = (r as any).status ?? 'NEW';
        s.progress = (r as any).progress ?? 0;
        return s;
      }) : [];
      return res.json({ data: out, meta: { start, end, count: out.length } });
    } catch (err) {
      console.error('listWorkOrdersForGantt error', err);
      return res.status(500).json({ message: 'Failed to load gantt work orders' });
    }
  }

export async function listWorkOrders(req: Request, res: Response) {
  try {
    const rows = await service.getAllWorkOrders();
    // preserve SQL datetime formatting when returning lists
    const out = Array.isArray(rows) ? rows.map(r => {
      const s = serializeWorkOrder(r);
      s.status = (r as any).status ?? 'NEW';
      return s;
    }) : rows;
    return res.json(out);
  } catch (err) {
    console.error('listWorkOrders error', err);
    return res.status(500).json({ message: 'Failed to load work orders' });
  }
}

/**
 * GET /api/work-orders/list-optimized
 * Optimized list for UI grid; accepts start/end, site, status, q, page, pageSize
 */
export async function listWorkOrdersOptimized(req: Request, res: Response) {
  try {
    const start = (req.query.start as string) || undefined;
    const end = (req.query.end as string) || undefined;
    const site = (req.query.site as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const q = (req.query.q as string) || undefined;
    const work_type = (req.query.work_type as string) || undefined;
    const type_work = (req.query.type_work as string) || undefined;
    const page = Math.max(Number(req.query.page || 1), 1);
    const pageSize = Math.max(Number(req.query.pageSize || 20), 1);
    const sort = (req.query.sort as string) || 'start_date';

    const { rows, total } = await service.getWorkOrdersOptimized({ start, end, site, status, exclude_status, q, work_type, type_work, page, pageSize, sort });
    const out = (rows || []).map((r: any) => {
      const s = serializeWorkOrder(r);
      s.status = (r as any).status ?? 'NEW';
      s.progress = (r as any).progress ?? 0;
      s.assigned_count = (r as any).assigned_count ?? 0;
      return s;
    });
    return res.json({ data: out, meta: { page, pageSize, total } });
  } catch (err) {
    console.error('listWorkOrdersOptimized error', err);
    return res.status(500).json({ message: 'Failed to load optimized work orders' });
  }
}

/**
 * GET /api/work-orders/completed-with-realisasi
 * Query params: start (ISO or YYYY-MM-DDTHH:MM:SS), end (ISO), page, pageSize
 * Returns work orders with status = 'COMPLETED' and embedded realisasi details
 */
export async function listCompletedWorkOrdersWithRealisasi(req: Request, res: Response) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const pageSize = Math.max(Number(req.query.pageSize || 20), 20);
    let start = (req.query.start as string) || null;
    let end = (req.query.end as string) || null;
    const site = (req.query.site as string) || null;

    // If provided datetimes don't include timezone info, treat them as UTC by appending 'Z'
    function normalizeTs(v: string | null) {
      if (!v) return null;
      if (/[zZ]|[+\-]\d{2}:?\d{2}$/.test(v)) return v;
      return v + 'Z';
    }
    start = normalizeTs(start);
    end = normalizeTs(end);

    const offset = (page - 1) * pageSize;

    // Normalize site param for LIKE queries
    const siteParam = site && String(site).trim().length ? `%${String(site).toLowerCase().trim()}%` : null;

    // Aggregate realisasi per workorder, joining work_order to filter by status and site when provided
    const aggSql = `
      SELECT t.work_order_id AS wo_id,
             MIN(r.start_time) AS actual_start,
             MAX(r.end_time) AS actual_end,
             json_agg(json_build_object(
               'id', r.id,
               'start', to_char(r.start_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
               'end', to_char(r.end_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
               'notes', r.notes,
               'photoUrl', r.photo_url,
               'taskId', r.task_id
             ) ORDER BY r.start_time) AS items
      FROM realisasi r
      JOIN task t ON r.task_id = t.id
      JOIN work_order wo ON t.work_order_id = wo.id
      WHERE wo.status = 'COMPLETED'
        AND ($1::timestamptz IS NULL OR r.start_time >= $1::timestamptz)
        AND ($2::timestamptz IS NULL OR r.end_time <= $2::timestamptz)
        AND ($3::text IS NULL OR LOWER(COALESCE(wo.raw->>'vendor_cabang','')) LIKE $3 OR LOWER(COALESCE(wo.raw->>'site','')) LIKE $3)
      GROUP BY t.work_order_id
    `;

    const aggRows = await AppDataSource.query(aggSql, [start, end, siteParam]);
    const woIds = (aggRows || []).map((r: any) => String(r.wo_id));

    if (!woIds || woIds.length === 0) {
      return res.json({ data: [], meta: { page, pageSize, total: 0 } });
    }

    // fetch matching work orders with status COMPLETED and limit/paginate
    const total = woIds.length;
    const pageIds = woIds.slice(offset, offset + pageSize);
    if (pageIds.length === 0) return res.json({ data: [], meta: { page, pageSize, total } });

    const rows = await AppDataSource.query(
      `SELECT wo.* FROM work_order wo WHERE wo.id = ANY($1) AND wo.status = 'COMPLETED' ORDER BY wo.created_at DESC`,
      [pageIds]
    );

    // map aggRows by wo_id for easy lookup
    const aggByWo: Record<string, any> = {};
    for (const a of aggRows || []) {
      aggByWo[String(a.wo_id)] = {
        actualStart: a.actual_start ? new Date(a.actual_start).toISOString() : null,
        actualEnd: a.actual_end ? new Date(a.actual_end).toISOString() : null,
        items: a.items || [],
      };
    }

    const out = (rows || []).map((wo: any) => {
      const serialized = serializeWorkOrder(wo);
      serialized.status = (wo as any).status ?? 'NEW';
      const agg = aggByWo[String(wo.id)] || { actualStart: null, actualEnd: null, items: [] };
      return { ...serialized, realisasi: agg };
    });

    return res.json({ data: out, meta: { page, pageSize, total } });
  } catch (err) {
    console.error('listCompletedWorkOrdersWithRealisasi error', err);
    return res.status(500).json({ message: 'Failed to list completed work orders' });
  }
}

function buildSigapHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (SIGAP_BEARER_TOKEN) headers['Authorization'] = `Bearer ${SIGAP_BEARER_TOKEN}`;
  return headers;
}

/**
 * POST /api/work-orders/add
 * body: { id: string|number }
 */
export async function fetchAndCreateFromSigap(req: Request, res: Response) {
  try {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ message: 'id required' });

    const url = `${SIGAP_BASE}/api/Work/WorkOrderAgreement/GetData/${encodeURIComponent(String(id))}`;
    const headers = buildSigapHeaders();

    // debug log
    // console.log('[SIGAP] requesting', url);
    // console.log('[SIGAP] headers:', headers);

    // axios typed response
    const r = await axios.get<SigapWrapper<SigapWorkOrder>>(url, { headers, timeout: 15000 });

    // SIGAP wrapper has .data field containing actual workorder
    const payload = r.data?.data;
    if (!payload) {
      console.warn('SIGAP returned empty data', { url, status: r.status, body: r.data });
      return res.status(502).json({ message: 'SIGAP returned empty data', detail: r.data });
    }

    // pick the first non-empty candidate (prefer explicit start_downtime/up_date)
    const firstNonEmpty = (arr: any[]) => {
      for (const v of arr) {
        if (v !== undefined && v !== null && String(v).toString().trim() !== '') return v;
      }
      return null;
    };

    // console.log('[SIGAP] body:', payload);

    const rawStart = (payload as any).start_downtime;
    const rawEnd = (payload as any).up_date;

    // log values for debugging
    // console.log('[SIGAP] resolved rawStart:', rawStart);
    // console.log('[SIGAP] resolved rawEnd:', rawEnd);

    // prefer SIGAP's `start_downtime` for start_date and `up_date` for end_date.
    // We store dates "apa adanya" (as-is) without timezone conversion — format as SQL-friendly 'YYYY-MM-DD HH:mm:ss'.
    const startSql = formatSigapToSqlDatetime(rawStart ?? null);
    const endSql = formatSigapToSqlDatetime(rawEnd ?? null);
    debug('[SIGAP] formatted startSql:', startSql);
    debug('[SIGAP] formatted endSql:', endSql);

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
      asset_id: (payload as any).asset_id ?? (payload as any).asset?.id ?? undefined,
      asset_name: (payload as any).asset_name ?? (payload as any).asset?.name ?? undefined,
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
  } catch (err: any) {
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

/**
 * POST /api/work-orders/generate-daily
 * body: { date?: string }
 */
export async function generateDailyWorkOrders(req: Request, res: Response) {
  try {
    const body = req.body || {};
    // If frontend supplied custom items use the custom creator
    if (Array.isArray(body.items) && body.items.length > 0) {
      const created = (await service.createCustomDailyChecklistWorkOrders(body.items)) || [];
      return res.status(201).json({ message: 'generated', count: created.length, data: created });
    }
    const { date } = body;
    const created = (await service.generateDailyChecklistWorkOrders(date)) || [];
    return res.status(201).json({ message: 'generated', count: created.length, data: created });
  } catch (err: any) {
    console.error('generateDailyWorkOrders error', err);
    return res.status(500).json({ message: 'Failed to generate daily work orders', detail: err?.message ?? err });
  }
}

function parseSigapDateToIso(raw?: string | null): string | undefined {
  if (!raw) return undefined;
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
    const [, mm, dd, yyyy, HH = '00', MI = '00', SS = '00'] = match as any;
    const iso = `${yyyy.padStart(4, '0')}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}T${String(HH).padStart(2,'0')}:${String(MI).padStart(2,'0')}:${String(SS).padStart(2,'0')}Z`;
    // validate
    const d = new Date(iso);
    if (!isNaN(d.getTime())) return iso;

    // fallback: try interpreting as DD/MM/YYYY if month/day swapped
    const altIso = `${yyyy.padStart(4, '0')}-${String(dd).padStart(2, '0')}-${String(mm).padStart(2, '0')}T${String(HH).padStart(2,'0')}:${String(MI).padStart(2,'0')}:${String(SS).padStart(2,'0')}Z`;
    const d2 = new Date(altIso);
    if (!isNaN(d2.getTime())) return altIso;
  }

  // try DD-MM-YYYY
  rx = /^(\d{1,2})-(\d{1,2})-(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
  match = rx.exec(m);
  if (match) {
    const [, dd, mm, yyyy, HH = '00', MI = '00', SS = '00'] = match as any;
    const iso = `${yyyy.padStart(4, '0')}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T${String(HH).padStart(2,'0')}:${String(MI).padStart(2,'0')}:${String(SS).padStart(2,'0')}Z`;
    return iso;
  }

  // try ISO / other parseable formats
  const isoTry = new Date(m);
  if (!isNaN(isoTry.getTime())) return isoTry.toISOString();

  return undefined;
}

/**
 * Convert SIGAP raw date (commonly MM/DD/YYYY HH:mm:ss) into SQL datetime string
 * 'YYYY-MM-DD HH:mm:ss' without timezone information so it can be stored as-is.
 */
function formatSigapToSqlDatetime(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  const m = String(raw).trim();

  // common SIGAP format: MM/DD/YYYY HH:mm:ss
  let rx = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
  let match = rx.exec(m);
  if (match) {
    const [, mm, dd, yyyy, HH = '00', MI = '00', SS = '00'] = match as any;
    const month = String(mm).padStart(2, '0');
    const day = String(dd).padStart(2, '0');
    const hour = String(HH).padStart(2, '0');
    const minute = String(MI).padStart(2, '0');
    const second = String(SS).padStart(2, '0');
    const out = `${yyyy.padStart(4,'0')}-${month}-${day} ${hour}:${minute}:${second}`;
    return out;
  }

  // try DD-MM-YYYY or DD/MM/YYYY handled by parseSigapDateToIso fallback — try extracting numbers and format
  rx = /^(\d{1,2})-(\d{1,2})-(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;
  match = rx.exec(m);
  if (match) {
    const [, dd, mm, yyyy, HH = '00', MI = '00', SS = '00'] = match as any;
    const month = String(mm).padStart(2, '0');
    const day = String(dd).padStart(2, '0');
    const hour = String(HH).padStart(2, '0');
    const minute = String(MI).padStart(2, '0');
    const second = String(SS).padStart(2, '0');
    return `${yyyy.padStart(4,'0')}-${month}-${day} ${hour}:${minute}:${second}`;
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
export async function updateWorkOrderDates(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { start_date, end_date, keterangan, note } = req.body || {};

    if (!start_date && !end_date) {
      return res.status(400).json({ message: 'start_date or end_date required' });
    }

    // parse to Date or undefined
    let s = start_date ? new Date(start_date) : undefined;
    const e = end_date ? new Date(end_date) : undefined;
    if (start_date && isNaN(s!.getTime())) return res.status(400).json({ message: 'Invalid start_date format' });
    if (end_date && isNaN(e!.getTime())) return res.status(400).json({ message: 'Invalid end_date format' });

    // validate end must be greater than start when both provided
    if (s && e && e.getTime() <= s.getTime()) {
      return res.status(400).json({ message: 'end_date must be after start_date' });
    }

    // capture minimal user info if available (authMiddleware attaches req.user)
    const user = (req as any).user;
    function pickFirst(u: any, paths: string[]) {
      if (!u) return null;
      for (const p of paths) {
        const parts = p.split('.');
        let cur: any = u;
        let ok = true;
        for (const part of parts) {
          if (cur == null) { ok = false; break; }
          cur = cur[part];
        }
        if (ok && cur != null) return cur;
      }
      return null;
    }

    let changedBy: any = null;
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
          const ur = await AppDataSource.getRepository(User).findOneBy({ id: String(uid) } as any);
          if (ur) {
            if (!changedBy.nipp && ur.nipp) changedBy.nipp = ur.nipp;
            if (!changedBy.name && ur.name) changedBy.name = ur.name;
            if (!changedBy.email && ur.email) changedBy.email = ur.email;
          }
        }
      } catch (e) {
        // ignore DB lookup failures
        console.debug('failed to lookup user profile for changed_by enrichment', e);
      }
    }

    // Note: Do not auto-compute or persist workorder start/end dates when status changes.
    // Date fields will only be changed if client explicitly provides `start_date` or `end_date` in the request.

    const updated = await service.updateWorkOrderDates(id, { start_date: s, end_date: e, note: (keterangan || note) ?? undefined, changedBy });
    return res.json({ message: 'updated', data: updated });
  } catch (err) {
    console.error('updateWorkOrderDates error', err);
    return res.status(500).json({ message: 'Failed to update work order' });
  }
}

export async function getWorkOrderDateHistory(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const rows = await service.getWorkOrderDateHistory(id);
    return res.json({ data: rows });
  } catch (err) {
    console.error('getWorkOrderDateHistory error', err);
    return res.status(500).json({ message: 'Failed to load date history' });
  }
}

/**
 * Ensure entity object converts Date fields to ISO strings.
 */
function serializeWorkOrder(wo: any) {
  if (!wo) return wo;
  const out = { ...wo };
  try {
    // Preserve naive SQL datetime strings (YYYY-MM-DD HH:mm:ss) as-is so
    // frontend can decide how to render them. Only convert true Date objects
    // or ISO strings that already include timezone information.
    if (!wo.start_date) {
      out.start_date = null;
    } else if (typeof wo.start_date === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(wo.start_date.trim())) {
      out.start_date = String(wo.start_date).trim();
    } else {
      // Format Date objects as SQL-like naive datetime using server-local components
      // so the wall-clock value stored in DB (timestamp without timezone) is preserved.
      const dt = new Date(wo.start_date);
      const pad = (n: number) => String(n).padStart(2, '0');
      out.start_date = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
    }
  } catch (e) {
    out.start_date = null;
  }
  try {
    if (!wo.end_date) {
      out.end_date = null;
    } else if (typeof wo.end_date === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(wo.end_date.trim())) {
      out.end_date = String(wo.end_date).trim();
    } else {
      const dt = new Date(wo.end_date);
      const pad = (n: number) => String(n).padStart(2, '0');
      out.end_date = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
    }
  } catch (e) {
    out.end_date = null;
  }
  return out;
}

/** GET /api/work-orders/:id */
export async function getWorkOrderById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const wo = await service.getWorkOrderById(id);
    if (!wo) return res.status(404).json({ message: 'WorkOrder not found' });
    const s = serializeWorkOrder(wo);
    s.status = (wo as any).status ?? 'NEW';
    try {
      const prog = await service.computeWorkOrderProgress(String(wo.id));
      s.progress = prog; // fractional 0..1
    } catch (e) {
      s.progress = 0;
    }
    return res.json({ data: s });
  } catch (err: any) {
    console.error('getWorkOrderById error', err);
    return res.status(500).json({ message: 'Failed to get work order', detail: err.message || err });
  }
}

/** POST /api/work-orders/:id/deploy */
export async function deployWorkOrder(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const woRepo = AppDataSource.getRepository(WorkOrder);
    const wo = await woRepo.findOneBy({ id } as any);
    if (!wo) return res.status(404).json({ code: 'NOT_FOUND', message: 'WorkOrder not found' });

    // create one assignment record per task (ensure task_id included)
    const taskRepo = AppDataSource.getRepository(Task);
    const tasks = await taskRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.assignments', 'ta')
      .leftJoinAndSelect('ta.user', 'u')
      .where('t.workOrder = :wo', { wo: id })
      .orderBy('t.task_number', 'ASC')
      .getMany();

    if (!tasks || tasks.length === 0) {
      return res.status(400).json({ code: 'NO_TASKS', message: 'No tasks found for this work order' });
    }

    const assignmentRepo = AppDataSource.getRepository(Assignment);
    const created: Assignment[] = [];

    for (const t of tasks) {
      try {
        const taskId = (t as any).id;
        const taskName = (t as any).name ?? '';
        // pick first assigned user for this task (if any)
        const assigns = (t as any).assignments || [];
        // Do NOT use workorder.raw.labours to derive assignments — ignore that data
        const extraAssignees: string[] = [];
        if (assigns.length > 0 || extraAssignees.length > 0) {
          // create one assignment record per TaskAssignment.user (support multiple technicians per task)
          // collect assignee ids from Task.assignments (UUIDs) and from extraAssignees (nipp strings which we'll try to resolve)
          const assigneeCandidates: Array<string|undefined> = [];
          for (const ta of assigns) {
            assigneeCandidates.push(ta?.user?.id ?? ta?.user_id ?? ta?.userId ?? undefined);
          }
          // resolve extraAssignees (nipp) to user UUIDs when possible
          // we'll resolve extraAssignees (nipp values) to user UUIDs below
          // process Task.assignments first
          // Prefetch existing assignments for this workorder+task to avoid race/duplications
          const existingRows = await assignmentRepo.createQueryBuilder('a')
            .where('a.wo_id = :wo AND a.task_id = :task', { wo: id, task: taskId })
            .getMany();
          const existingAssigneeSet = new Set((existingRows || []).map(r => (r.assigneeId || '').toString()));

          for (const ta of assigns) {
            const assigneeId = ta?.user?.id ?? ta?.user_id ?? ta?.userId ?? undefined;
            const assKey = assigneeId ? String(assigneeId) : '';
            if (existingAssigneeSet.has(assKey)) {
              // update existing record's metadata/status if needed
              try {
                const exists = existingRows.find(r => (r.assigneeId || '').toString() === assKey);
                if (exists) {
                  exists.assigneeId = assigneeId ?? exists.assigneeId;
                  exists.task_name = taskName || exists.task_name;
                  exists.status = 'DEPLOYED';
                  const saved = await assignmentRepo.save(exists as any);
                  created.push(saved as any);
                  continue;
                }
              } catch (e) {
                // fallthrough to attempt creation below
              }
            }

            const a = new Assignment();
            a.wo = wo as any;
            a.assigneeId = assigneeId;
            a.task_id = String(taskId);
            a.task_name = taskName;
            a.status = 'DEPLOYED';
            const saved = await assignmentRepo.save(a as any);
            created.push(saved as any);
            // track to avoid duplicates later in this loop
            existingAssigneeSet.add(assKey);
          }
          // now process extraAssignees (nipp values) attempting to resolve to User by nipp
          if (extraAssignees.length > 0) {
            try {
              const userRepo = AppDataSource.getRepository((await import('../entities/User')).User);
              for (const nip of extraAssignees) {
                try {
                  if (nip == null) continue;
                  const u = await userRepo.findOneBy({ nipp: String(nip) } as any);
                  const assigneeId = u ? String((u as any).id) : String(nip);
                  // avoid duplicate creation when same id already created
                  if (existingAssigneeSet.has(String(assigneeId))) continue;
                  const a = new Assignment();
                  a.wo = wo as any;
                  a.assigneeId = u ? String((u as any).id) : undefined;
                  a.task_id = String(taskId);
                  a.task_name = taskName;
                  a.status = 'DEPLOYED';
                  const saved = await assignmentRepo.save(a as any);
                  created.push(saved as any);
                } catch (e) {}
              }
            } catch (e) {}
          }
        } else {
          // no task-level assignments — create a single assignment row without assignee
          const exists = await assignmentRepo.createQueryBuilder('a')
            .where('a.wo_id = :wo AND a.task_id = :task', { wo: id, task: taskId })
            .getOne();
          if (exists) {
            exists.task_name = taskName || exists.task_name;
            exists.status = 'DEPLOYED';
            const saved = await assignmentRepo.save(exists as any);
            created.push(saved as any);
            continue;
          }

          // Try to find a workorder-level assignment (assignee on the WO) to propagate to task
          try {
            const woLevel = await assignmentRepo.createQueryBuilder('a')
              .where('a.wo_id = :wo AND a.assignee_id IS NOT NULL AND a.status IN (:...st)', { wo: id, st: ['ASSIGNED','DEPLOYED','IN_PROGRESS'] })
              .getOne();
            if (woLevel && woLevel.assigneeId) {
              const a = new Assignment();
              a.wo = wo as any;
              a.assigneeId = woLevel.assigneeId;
              a.task_id = String(taskId);
              a.task_name = taskName;
              a.status = 'DEPLOYED';
              const saved = await assignmentRepo.save(a as any);
              created.push(saved as any);
              continue;
            }
          } catch (e) {
            console.warn('deployWorkOrder: failed to lookup wo-level assignment', e);
          }

          // Fallback: try to use wo.raw.assigned_user_id if present
          try {
            const rawAssignee = (wo as any).raw?.assigned_user_id ?? (wo as any).raw?.assigned_user_name ?? null;
            if (rawAssignee) {
              // attempt to resolve to user UUID if rawAssignee looks like UUID or NIPP
              let resolvedId: string | null = null;
              const s = String(rawAssignee);
              const looksLikeUuid = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(s);
              if (looksLikeUuid) resolvedId = s;
              else {
                try {
                  const userRepo = AppDataSource.getRepository((await import('../entities/User')).User);
                  const u = await userRepo.findOneBy([{ nipp: s } as any, { id: s } as any, { username: s } as any]);
                  if (u && (u as any).id) resolvedId = String((u as any).id);
                } catch (e) { /* ignore */ }
              }
              if (resolvedId) {
                const a = new Assignment();
                a.wo = wo as any;
                a.assigneeId = resolvedId;
                a.task_id = String(taskId);
                a.task_name = taskName;
                a.status = 'DEPLOYED';
                const saved = await assignmentRepo.save(a as any);
                created.push(saved as any);
                continue;
              }
            }
          } catch (e) { /* ignore */ }

          // No assignee could be determined — create unassigned assignment
          const a = new Assignment();
          a.wo = wo as any;
          a.assigneeId = undefined;
          a.task_id = String(taskId);
          a.task_name = taskName;
          a.status = 'DEPLOYED';
          const saved = await assignmentRepo.save(a as any);
          created.push(saved as any);
        }
      } catch (e) {
        console.warn('failed to create assignment for task', (t as any).id, e);
      }
    }

    // update work order status
    wo.status = 'DEPLOYED' as any;
    await woRepo.save(wo as any);

    // notify assigned technicians (if any)
    try {
      // Log created assignments for debugging
      try { console.log('INSTRUMENT deployWorkOrder - created assignments count=', created.length, 'sample=', created.slice(0,5).map(c=>({id: (c as any).id, assigneeId: (c as any).assigneeId, task_id: (c as any).task_id}))); }catch(e){}
      // Resolve assignee identifiers to user UUIDs. Some assignments may store NIPP or legacy identifiers; try to resolve them.
      const userRepo = AppDataSource.getRepository((await import('../entities/User')).User);
      const rawIds = Array.from(new Set(created.map(a => (a as any).assigneeId)));
      const resolvedIds: string[] = [];
      for (const rid of rawIds) {
        if (!rid) continue;
        const s = String(rid);
        // heuristic: UUIDs contain hyphens and are long; NIPP is usually numeric and shorter
        const looksLikeUuid = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(s);
        if (looksLikeUuid) {
          resolvedIds.push(s);
          continue;
        }
        // attempt to resolve as NIPP or username
        try{
          const u = await userRepo.findOneBy([{ nipp: s } as any, { id: s } as any, { username: s } as any]);
          if (u && (u as any).id) resolvedIds.push(String((u as any).id));
          else console.warn('deployWorkOrder: could not resolve assignee identifier to user id', s);
        }catch(e){ console.warn('deployWorkOrder: user resolve error', e); }
      }

      const uniqueResolved = Array.from(new Set(resolvedIds));
      const title = `Assigned: WO ${wo.doc_no ?? ''}`;
      const body = `You have been deployed to work order ${wo.doc_no ?? wo.id}`;
      if (uniqueResolved.length === 0) {
        console.log('deployWorkOrder: no resolved assignee UUIDs to notify for WO', wo.id);
      }
      for (const uid of uniqueResolved) {
        console.log('INSTRUMENT pushNotify deployWorkOrder', { targetUserId: String(uid), woId: wo?.id, woDoc: wo?.doc_no, title, body });
        pushNotify(String(uid), `${body}`).catch((e: any) => console.warn('pushNotify error', e));
      }
    } catch (e) {
      console.warn('Failed to send deployment notifications', e);
    }

    return res.status(201).json({ message: 'deployed', created });
  } catch (err) {
    console.error('deployWorkOrder error', err);
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to deploy work order' });
  }
}

/** POST /api/work-orders/:id/undeploy */
export async function undeployWorkOrder(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const woRepo = AppDataSource.getRepository(WorkOrder);
    const wo = await woRepo.findOneBy({ id } as any);
    if (!wo) return res.status(404).json({ code: 'NOT_FOUND', message: 'WorkOrder not found' });

    // Prevent undeploy while workorder is IN_PROGRESS
    if ((wo as any).status === 'IN_PROGRESS') {
      return res.status(400).json({ code: 'INVALID_STATE', message: 'Cannot undeploy WorkOrder while IN_PROGRESS' });
    }

    const assignmentRepo = AppDataSource.getRepository(Assignment);
    const toRemove = await assignmentRepo.createQueryBuilder('a').where('a.wo_id = :wo AND a.status = :s', { wo: id, s: 'DEPLOYED' }).getMany();
    for (const r of toRemove) {
      await assignmentRepo.remove(r as any);
    }

    // set work order back to READY_TO_DEPLOY
    (wo as any).status = 'READY_TO_DEPLOY';
    await woRepo.save(wo as any);

    return res.json({ message: 'undeployed', removed: toRemove.length });
  } catch (err) {
    console.error('undeployWorkOrder error', err);
    return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to undeploy work order' });
  }
}

/** DELETE /api/work-orders/:id */
export async function deleteWorkOrderHandler(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const deleted = await service.deleteWorkOrder(id);
    if (!deleted) return res.status(404).json({ message: 'WorkOrder not found' });
    return res.json({ message: 'deleted', data: deleted });
  } catch (err: any) {
    console.error('deleteWorkOrder error', err);
    return res.status(500).json({ message: 'Failed to delete work order', detail: err?.message ?? err });
  }
}
