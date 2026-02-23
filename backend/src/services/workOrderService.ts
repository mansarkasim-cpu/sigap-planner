// src/services/workOrderService.ts
import { AppDataSource } from '../ormconfig';
import { WorkOrder } from '../entities/WorkOrder';
import { Task } from '../entities/Task';
import { FindOptionsWhere } from 'typeorm';
import { WorkOrderDateHistory } from '../entities/WorkOrderDateHistory';

export async function getAllWorkOrders() {
  const repo = AppDataSource.getRepository(WorkOrder);
  return repo.find({ where: { deleted_at: null } as any, order: { created_at: 'DESC' } });
}

export async function getWorkOrderById(id: string) {
  const repo = AppDataSource.getRepository(WorkOrder);
  // findOneBy id
  const wo = await repo.findOne({ where: { id, deleted_at: null } as any });
  return wo || null;
}

export async function createOrUpdateFromSigap(payload: {
  sigap_id?: number;
  doc_no?: string;
  date_doc?: string;
  asset_id?: number;
  asset_name?: string;
  type_work?: string;
  work_type?: string;
  description?: string;
  // allow either Date or plain SQL datetime string (YYYY-MM-DD HH:mm:ss) from SIGAP import
  start_date?: Date | string;
  end_date?: Date | string;
  raw?: any;
}) {
  const repo = AppDataSource.getRepository(WorkOrder);
  // Stronger duplicate detection: try several identifiers in order of reliability
  const candidate = {
    doc_no: payload.doc_no ?? null,
    sigap_id: payload.sigap_id ?? null,
    raw_id: payload.raw?.id ?? null,
    raw_doc_no: payload.raw?.doc_no ?? null,
  };

  let existing: WorkOrder | null = null;

  // 1) by doc_no (most reliable if present and unique)
  if (candidate.doc_no) {
    existing = await repo.findOneBy({ doc_no: candidate.doc_no } as any);
  }

  // 2) by sigap_id
  if (!existing && candidate.sigap_id) {
    existing = await repo.findOneBy({ sigap_id: candidate.sigap_id } as any);
  }

  // 3) by raw->>'id' JSONB field
  if (!existing && candidate.raw_id) {
    try {
      existing = await repo.createQueryBuilder('wo')
        .where("wo.raw->>'id' = :rid", { rid: String(candidate.raw_id) })
        .getOne();
    } catch (e) {
      // ignore JSONB query problems
    }
  }

  // 4) by raw->>'doc_no'
  if (!existing && candidate.raw_doc_no) {
    try {
      existing = await repo.createQueryBuilder('wo')
        .where("wo.raw->>'doc_no' = :rd", { rd: String(candidate.raw_doc_no) })
        .getOne();
    } catch (e) {
      // ignore JSONB query problems
    }
  }

  if (existing) {
    // update existing record instead of creating duplicate
    console.log('[SIGAP] detected existing workorder — updating instead of inserting', { id: existing.id, doc_no: existing.doc_no, sigap_id: existing.sigap_id });
    Object.assign(existing, {
      date_doc: payload.date_doc ?? existing.date_doc,
      asset_id: payload.asset_id ?? existing.asset_id,
      asset_name: payload.asset_name ?? existing.asset_name,
      type_work: payload.type_work ?? existing.type_work,
      work_type: payload.work_type ?? existing.work_type,
      description: payload.description ?? existing.description,
      start_date: payload.start_date ?? existing.start_date,
      end_date: payload.end_date ?? existing.end_date,
      raw: payload.raw ?? existing.raw,
    });
    // If the existing record was soft-deleted, clear deleted_at to restore it
    try {
      if ((existing as any).deleted_at) {
        (existing as any).deleted_at = null;
      }
      if ((existing as any).status === 'DELETED') {
        (existing as any).status = 'PREPARATION';
      }
    } catch (e) {
      // ignore if fields not present
    }
    const saved = await repo.save(existing);
    // upsert tasks from SIGAP payload (if any)
    try {
      await upsertTasksForWorkOrder(saved, payload.raw);
    } catch (e) {
      console.warn('upsertTasksForWorkOrder failed', e);
    }
    return saved;
  }

  // If no existing found, create a new one. Guard against race-condition duplicates
  const newWo = repo.create({
    sigap_id: payload.sigap_id,
    doc_no: payload.doc_no,
    date_doc: payload.date_doc,
    asset_id: payload.asset_id,
    asset_name: payload.asset_name,
    type_work: payload.type_work,
    work_type: payload.work_type,
    description: payload.description,
    start_date: payload.start_date,
    end_date: payload.end_date,
    raw: payload.raw,
  });

  try {
    const saved = await repo.save(newWo);
    // after creating a new workorder, also insert tasks if SIGAP provided them
    try {
      await upsertTasksForWorkOrder(saved, payload.raw);
    } catch (e) {
      console.warn('upsertTasksForWorkOrder failed', e);
    }
    return saved;
  } catch (err: any) {
    // handle unique violation (race): try to find existing again and update
    const msg = String(err?.message || '').toLowerCase();
    if (msg.includes('duplicate') || err?.code === '23505') {
      console.warn('[SIGAP] save new workorder failed with duplicate key, attempting to recover by updating existing record');
      // attempt to find by doc_no or sigap_id again
      let recovered: WorkOrder | null = null;
      if (payload.doc_no) recovered = await repo.findOneBy({ doc_no: payload.doc_no } as any);
      if (!recovered && payload.sigap_id) recovered = await repo.findOneBy({ sigap_id: payload.sigap_id } as any);
      if (!recovered && payload.raw?.id) {
        try { recovered = await repo.createQueryBuilder('wo').where("wo.raw->>'id' = :rid", { rid: String(payload.raw.id) }).getOne(); } catch (e) {}
      }
      if (recovered) {
        Object.assign(recovered, {
          date_doc: payload.date_doc ?? recovered.date_doc,
          asset_id: payload.asset_id ?? recovered.asset_id,
          asset_name: payload.asset_name ?? recovered.asset_name,
          type_work: payload.type_work ?? recovered.type_work,
          work_type: payload.work_type ?? recovered.work_type,
          description: payload.description ?? recovered.description,
          start_date: payload.start_date ?? recovered.start_date,
          end_date: payload.end_date ?? recovered.end_date,
          raw: payload.raw ?? recovered.raw,
        });
        // clear soft-delete marker if present so re-imported WO becomes visible
        try {
          if ((recovered as any).deleted_at) (recovered as any).deleted_at = null;
          if ((recovered as any).status === 'DELETED') (recovered as any).status = 'PREPARATION';
        } catch (e) { /* ignore */ }
        const saved = await repo.save(recovered);
        try {
          await upsertTasksForWorkOrder(saved, payload.raw);
        } catch (e) {
          console.warn('upsertTasksForWorkOrder failed', e);
        }
        return saved;
      }
    }
    throw err;
  }
}

/**
 * Upsert tasks for a given work order using raw SIGAP payload.
 * Expects rawActivities to be an object or array where activities are at rawActivities.activities or rawActivities.
 */
async function upsertTasksForWorkOrder(workOrder: WorkOrder, rawActivities: any) {
  if (!workOrder || !workOrder.id) return;

  // derive activities array
  let acts: any[] = [];
  if (!rawActivities) {
    console.debug(`[upsertTasksForWorkOrder] no rawActivities for workOrder=${workOrder.id}`);
    return;
  }
  if (Array.isArray(rawActivities)) acts = rawActivities;
  else if (Array.isArray(rawActivities.activities)) acts = rawActivities.activities;
  else if (Array.isArray(rawActivities.activitiesList)) acts = rawActivities.activitiesList;
  if (!acts || acts.length === 0) {
    console.debug(`[upsertTasksForWorkOrder] no activities found for workOrder=${workOrder.id}`);
    return;
  }

  console.debug(`[upsertTasksForWorkOrder] workOrder=${workOrder.id} - activities_count=${acts.length}`);
  // log sample of first few activities for debugging
  try {
    const sample = acts.slice(0, 5).map((a: any, i: number) => ({ idx: i, keys: Object.keys(a).slice(0,10), snippet: JSON.stringify(a).slice(0, 300) }));
    console.debug('[upsertTasksForWorkOrder] sample activities:', JSON.stringify(sample, null, 2));
  } catch (e) {
    console.debug('[upsertTasksForWorkOrder] failed to stringify sample activities', e);
  }

  const taskRepo = AppDataSource.getRepository(Task);
  // load existing tasks for this work order to avoid duplicates
  const existing = await taskRepo.createQueryBuilder('t')
    .where('t.work_order_id = :wo', { wo: workOrder.id })
    .getMany();

  // map existing by external_id and by name+duration to match
  const existingByExternal = new Map<string, Task>();
  const existingByKey = new Map<string, Task>();
  for (const e of existing) {
    if (e.external_id) existingByExternal.set(String(e.external_id), e);
    const key = `${(e.name||'').toString().toLowerCase()}|${String(e.duration_min||'')}`;
    existingByKey.set(key, e);
  }

  const toSave: Task[] = [];
  const actions: Array<{ action: 'create'|'update', externalId?: string|null, name: string, duration?: number|null, existingId?: string }>=[];

  for (const a of acts) {
    // normalize activity fields — SIGAP payloads vary
    const externalId = a.id ?? a.task_id ?? a.activity_id ?? a.external_id ?? null;
    const name = a.task_name ?? a.name ?? a.activity_name ?? a.title ?? (externalId ? `Task ${externalId}` : 'Task');
    const durRaw = a.task_duration ?? a.duration_min ?? a.duration ?? null;
    const tnRaw = a.task_number ?? a.task_no ?? a.number ?? null;
    const taskNumber = tnRaw !== null && tnRaw !== undefined ? (Number(tnRaw) || null) : null;
    const duration = durRaw !== null && durRaw !== undefined ? (Number(durRaw) || null) : null;
    const desc = a.description ?? a.detail ?? a.note ?? null;

    let existingTask: Task | undefined;
    if (externalId && existingByExternal.has(String(externalId))) {
      existingTask = existingByExternal.get(String(externalId));
    } else {
      const key = `${(name||'').toString().toLowerCase()}|${String(duration||'')}`;
      if (existingByKey.has(key)) existingTask = existingByKey.get(key);
    }

      if (existingTask) {
      // update if changed
      let changed = false;
      if ((existingTask.external_id || null) !== (externalId ? String(externalId) : null)) { existingTask.external_id = externalId ? String(externalId) : undefined; changed = true; }
      if ((existingTask.name || '') !== (name || '')) { existingTask.name = name || ''; changed = true; }
      if ((existingTask.duration_min || null) !== (duration || null)) { existingTask.duration_min = duration as any; changed = true; }
      if ((existingTask.description || null) !== (desc || null)) { existingTask.description = desc ?? undefined; changed = true; }
      if ((existingTask.task_number || null) !== (taskNumber || null)) { existingTask.task_number = taskNumber as any; changed = true; }
      if (changed) {
        toSave.push(existingTask);
        actions.push({ action: 'update', externalId: externalId ? String(externalId) : null, name, duration, existingId: existingTask.id });
      } else {
        actions.push({ action: 'update', externalId: externalId ? String(externalId) : null, name, duration, existingId: existingTask.id });
      }
      } else {
      // create new
      const t = taskRepo.create({
        workOrder: { id: workOrder.id } as any,
        external_id: externalId ? String(externalId) : undefined,
        name: name || 'Task',
        duration_min: duration as any,
        description: desc ?? undefined,
        task_number: taskNumber as any,
        status: 'NEW'
      } as any);
      toSave.push(t as unknown as Task);
      actions.push({ action: 'create', externalId: externalId ? String(externalId) : null, name, duration });
    }
  }

  // log planned actions
  try {
    console.debug(`[upsertTasksForWorkOrder] planned actions for workOrder=${workOrder.id}: ${actions.length} items`);
    console.debug(JSON.stringify(actions.slice(0,50), null, 2));
  } catch (e) {
    console.debug('[upsertTasksForWorkOrder] failed to stringify planned actions', e);
  }

  if (toSave.length > 0) {
    try {
      const saved = await taskRepo.save(toSave as any);
      console.info(`[upsertTasksForWorkOrder] saved ${saved.length} tasks for workOrder=${workOrder.id}`);
      // also log ids of saved items (sample)
      try { console.debug('saved task ids:', saved.map((s: { id: any; external_id: any; name: any; }) => ({ id: s.id, external_id: s.external_id, name: s.name }))); } catch (e) {}
    } catch (e) {
      console.warn('Failed to save tasks for workorder', workOrder.id, e);
    }
  } else {
    console.debug(`[upsertTasksForWorkOrder] no task changes for workOrder=${workOrder.id}`);
  }
}

export async function getWorkOrdersPaginated(opts: { q?: string; page: number; pageSize: number; site?: string; date?: string; jenis?: string; work_type?: string; type_work?: string; exclude_work_type?: string }) {
  const { q = '', page, pageSize, site = '', date = '', jenis = '', work_type = '', type_work = '', exclude_work_type = '' } = opts as any;
  const repo = AppDataSource.getRepository(WorkOrder);

  const qb = repo.createQueryBuilder('wo');

  if (q && q.trim().length) {
    const like = `%${q.trim()}%`;
    // Also search common fields that may be stored inside the raw JSON payload
    qb.where("(wo.doc_no ILIKE :like OR wo.asset_name ILIKE :like OR wo.description ILIKE :like OR COALESCE(wo.raw->>'doc_no','') ILIKE :like OR COALESCE(wo.raw->>'asset_name','') ILIKE :like OR COALESCE(wo.raw->>'description','') ILIKE :like OR COALESCE(wo.raw->>'asset','') ILIKE :like)", { like });
  }

  // optional site filtering: try matching raw->>'vendor_cabang' or raw->>'site'
  if (site && site.toString().trim().length) {
    const s = site.toString().toLowerCase().trim();
    // If qb already has a where, add AND; otherwise start where
    // Use partial match to be tolerant of formatting differences between stored site and query string
    qb.andWhere("(LOWER(COALESCE(wo.raw->>'vendor_cabang','')) LIKE :site OR LOWER(COALESCE(wo.raw->>'site','')) LIKE :site)", { site: `%${s}%` });
  }

  // optional date filtering: match date_doc (YYYY-MM-DD) or start_date/end_date date portion
  if (date && String(date).trim().length) {
    const d = String(date).trim();
    qb.andWhere("(wo.date_doc = :d OR to_char(wo.start_date, 'YYYY-MM-DD') = :d OR to_char(wo.end_date, 'YYYY-MM-DD') = :d)", { d });
  }

  // optional jenis_alat filtering: join master_alat and filter by jenis_alat_id
  if (jenis && String(jenis).trim().length) {
    const j = String(jenis).trim();
    // left join master_alat as ma on ma.id = wo.asset_id
    qb.leftJoin('master_alat', 'ma', 'ma.id = wo.asset_id');
    qb.andWhere('ma.jenis_alat_id = :j', { j });
  }

  // optional work_type filtering: e.g., 'DAILY'
  if (work_type && String(work_type).trim().length) {
    qb.andWhere('wo.work_type = :wt', { wt: String(work_type).trim() });
  }

  // optional type_work filtering: e.g., 'DAILY_CHECKLIST'
  if (type_work && String(type_work).trim().length) {
    qb.andWhere('wo.type_work = :tw', { tw: String(type_work).trim() });
  }

  // optional exclude_work_type: e.g., exclude DAILY
  if (exclude_work_type && String(exclude_work_type).trim().length) {
    // parenthesize to ensure correct operator precedence when combined with other WHERE clauses
    qb.andWhere('(wo.work_type IS NULL OR wo.work_type != :exwt)', { exwt: String(exclude_work_type).trim() });
  }

  // exclude soft-deleted
  qb.andWhere('wo.deleted_at IS NULL');

  qb.orderBy('wo.created_at', 'DESC')
    .skip((page - 1) * pageSize)
    .take(pageSize);

  // debug: log built SQL and parameters to help diagnose search issues
  try {
    const qp = qb.getQueryAndParameters();
    console.debug('[getWorkOrdersPaginated] built query:', qp[0]);
    console.debug('[getWorkOrdersPaginated] query params:', qp[1]);
  } catch (e) {
    console.debug('[getWorkOrdersPaginated] failed to get query string', e);
  }

  // inside getWorkOrdersPaginated after fetching rows...  
  const [rows, total] = await qb.getManyAndCount();
  // Return date fields as-stored in the database. If TypeORM returned a Date
  // object, format it as SQL-like 'YYYY-MM-DD HH:mm:ss' using server-local
  // components so the frontend sees the same wall-clock values as in DB.
  function formatDateToDisplay(val: any) {
    if (val == null) return null;
    // Try to coerce to Date and return ISO UTC string. If parsing fails, return null.
    try {
      if (typeof val === 'string') {
        const dt = new Date(val);
        if (isNaN(dt.getTime())) return null;
        return dt.toISOString();
      }
      const d = val instanceof Date ? val : new Date(val);
      if (isNaN(d.getTime())) return null;
      return d.toISOString();
    } catch (e) {
      return null;
    }
  }

  const serialized = rows.map(r => ({
    ...r,
    start_date: formatDateToDisplay(r.start_date),
    end_date: formatDateToDisplay(r.end_date),
  }));
  console.log('  data count:', rows.length);
  // attach workorder-level assignments (user names and ids) for convenience to the API consumer
  try {
    const repo = AppDataSource.getRepository(WorkOrder);
    await Promise.all(serialized.map(async (r: any) => {
      try {
        const assigns = await AppDataSource.query(
          `SELECT a.assignee_id AS assignee_id, u.name AS user_name
           FROM assignment a
           LEFT JOIN "user" u ON u.id = a.assignee_id
           WHERE a.wo_id = $1 AND a.status IN ('ASSIGNED','DEPLOYED','IN_PROGRESS')`,
          [r.id]
        );
        r.assigned_users = Array.isArray(assigns) ? assigns.map((x: any) => ({ id: x.assignee_id, name: x.user_name })) : [];
      } catch (e) {
        r.assigned_users = [];
      }
    }));
  } catch (e) {
    console.warn('failed to attach workorder-level assignments', e);
  }
  // compute progress for each workorder (sum of task durations completed via realisasi)
  const withProgress = await Promise.all(serialized.map(async (r: any) => {
    try {
      const p = await computeWorkOrderProgress(String(r.id));
      return { ...r, progress: p };
    } catch (e) {
      return { ...r, progress: 0 };
    }
  }));
  return { rows: withProgress, total };
}

/**
 * Compute work order progress as fraction in [0,1].
 * Progress is defined as sum(duration of tasks with at least one realisasi) / total task durations.
 */
export async function computeWorkOrderProgress(workOrderId: string) {
  const taskRepo = AppDataSource.getRepository(Task);
  // fetch tasks for this work order (use all tasks declared for the WO)
  const assigned = await AppDataSource.query(
    `
      SELECT t.id as task_id, t.duration_min as duration_min
      FROM task t
      WHERE t.work_order_id = $1
    `,
    [workOrderId]
  );

  if (!assigned || assigned.length === 0) return 0;

  // build map of id -> duration (fallback to 1 if missing/zero)
  const durations = new Map<string, number>();
  let total = 0;
  for (const t of assigned) {
    const id = String(t.task_id ?? t.id ?? '');
    if (!id) continue;
    const dRaw = t.duration_min ?? t.duration ?? 0;
    const d = dRaw != null ? Number(dRaw) || 0 : 0;
    const w = d > 0 ? d : 1.0;
    durations.set(id, w);
    total += w;
  }

  if (total <= 0) return 0;

  // find tasks which have realisasi: join realisasi->task to get task_id values for this workorder
  const raw = await AppDataSource.query(
    `SELECT DISTINCT r.task_id as task_id FROM realisasi r JOIN task t ON r.task_id = t.id WHERE t.work_order_id = $1`,
    [workOrderId]
  );
  const completedTaskIds = new Set(raw.map((r: any) => String(r.task_id)));

  // only count completed durations for tasks that were assigned
  let completed = 0;
  for (const [id, dur] of durations.entries()) {
    if (completedTaskIds.has(id)) completed += dur;
  }

  // Fallback: if no completedTaskIds found (older assignments missing task_id), try matching by assignment.task_name
  if (completed === 0) {
    try {
      const rows = await AppDataSource.query(
        `SELECT DISTINCT r.task_id as task_id, t.name as task_name FROM realisasi r JOIN task t ON r.task_id = t.id WHERE t.work_order_id = $1`,
        [workOrderId]
      );
      if (rows && rows.length > 0) {
        // build a lowercase name->id map for durations
        const nameToId = new Map<string, string>();
        for (const [id, dur] of durations.entries()) {
          // we need task names; fetch from task table
        }
        // fetch task names from DB for this workorder tasks
        const taskNames = await AppDataSource.query(`SELECT id, name FROM task WHERE work_order_id = $1`, [workOrderId]);
        const idByName = new Map<string, string>();
        for (const t of taskNames) {
          if (t && t.id && t.name) idByName.set(String(t.name).toLowerCase(), String(t.id));
        }

        for (const r of rows) {
          const tid = r.task_id ? String(r.task_id) : null;
          const tname = r.task_name ? String(r.task_name).toLowerCase() : null;
          if (tid && durations.has(tid)) {
            completed += durations.get(tid) || 0;
          } else if (tname && idByName.has(tname)) {
            const mappedId = idByName.get(tname)!;
            if (durations.has(mappedId)) completed += durations.get(mappedId) || 0;
          }
        }
      }
    } catch (e) {
      // ignore fallback errors
    }
  }

  return Math.max(0, Math.min(1, completed / total));
}

export async function deleteWorkOrder(id: string) {
  const repo = AppDataSource.getRepository(WorkOrder);
  const wo = await repo.findOneBy({ id } as any);
  if (!wo) return null;
  // soft-delete: set deleted_at and status
  try {
    (wo as any).deleted_at = new Date();
    (wo as any).status = 'DELETED';
    const saved = await repo.save(wo as any);
    return saved;
  } catch (e) {
    throw e;
  }
}

/**
 * Generate daily checklist work orders for all master alat.
 * If `forDate` omitted, uses server local date (today).
 */
export async function generateDailyChecklistWorkOrders(forDate?: string) {
  const alatRepo = AppDataSource.getRepository((await import('../entities/MasterAlat')).MasterAlat as any);
  const qRepo = AppDataSource.getRepository((await import('../entities/MasterChecklistQuestion')).MasterChecklistQuestion as any);
  const optionRepo = AppDataSource.getRepository((await import('../entities/MasterChecklistOption')).MasterChecklistOption as any);
  const woRepo = AppDataSource.getRepository(WorkOrder);

  const date = forDate ? new Date(forDate) : new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const dayKey = `${y}${m}${d}`;

  // only generate for active equipment
  const allAlat = await alatRepo.find({ where: { status: 'ACTIVE' } as any, relations: ['jenis_alat', 'site'] });
  const created: WorkOrder[] = [];

  for (const a of allAlat) {
    try {
      // skip if a daily checklist work order already exists for this asset and date
      try {
        const dateDoc = `${y}-${m}-${d}`;
        const exists = await woRepo.createQueryBuilder('wo')
          .where('wo.asset_id = :assetId', { assetId: (a as any).id })
          .andWhere('(wo.date_doc = :dd OR to_char(wo.start_date, \'YYYY-MM-DD\') = :dd)', { dd: dateDoc })
          .andWhere('wo.type_work = :tw', { tw: 'DAILY_CHECKLIST' })
          .andWhere('wo.deleted_at IS NULL')
          .getOne();
        if (exists) {
          console.info('[generateDailyChecklistWorkOrders] skipping existing WO for alat', (a as any).id, 'woId=', exists.id);
          continue;
        }
      } catch (e) {
        // if check fails for any reason, log and continue to attempt generation
        console.warn('[generateDailyChecklistWorkOrders] existence check failed for alat', (a as any).id, e);
      }
      const jenisId = (a as any).jenis_alat?.id ?? null;
      // fetch questions for this jenis_alat
      let questions: any[] = [];
      if (jenisId) {
        questions = await qRepo.createQueryBuilder('q')
          .leftJoinAndSelect('q.options', 'o')
          .where('q.jenis_alat_id = :jid', { jid: jenisId })
          .orderBy('q.order', 'ASC')
          .getMany();
      }

      const checklistTemplate = (questions || []).map((q: any) => ({
        id: q.id,
        question_text: q.question_text,
        input_type: q.input_type,
        required: q.required,
        // include group (kelompok) when available so clients can group questions
        kelompok: q.kelompok ?? null,
        // preserve master question order if present
        order: q.order ?? null,
        // default duration per checklist item (minutes)
        duration_min: 15,
        options: (q.options || []).map((o: any) => ({ id: o.id, option_text: o.option_text, option_value: o.option_value, order: o.order })),
      }));

      // generate doc_no: DC-YYYYMMDD-ALATID-RAND
      const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
      const docNo = `DC-${dayKey}-${a.id}-${rand}`;

      // Assign to shift 1: start at 07:00 and duration 15 minutes
      const startDate = new Date(date);
      startDate.setHours(7, 0, 0, 0);
      const endDate = new Date(startDate.getTime() + 15 * 60 * 1000); // +15 minutes

      const wo = woRepo.create({
        doc_no: docNo,
        date_doc: `${y}-${m}-${d}`,
        asset_id: a.id,
        asset_name: a.nama,
        type_work: 'DAILY_CHECKLIST',
        work_type: 'DAILY',
        description: `Daily checklist for ${a.nama}`,
        start_date: startDate,
        end_date: endDate,
        raw: {
          generated_for: `${y}-${m}-${d}`,
          alat_id: a.id,
          alat_name: a.nama,
          alat_kode: a.kode ?? null,
          checklist_template: checklistTemplate,
          // mark expected duration and shift for downstream consumers
          expected_duration_min: 15,
          shift: 1,
        },
        status: 'NEW',
      } as any);

      const saved = await woRepo.save(wo as any);
      // ensure a default task exists for this generated daily work order
      try {
        const taskRepo = AppDataSource.getRepository(Task);
        const existingTasks = await taskRepo.createQueryBuilder('t').where('t.work_order_id = :wo', { wo: saved.id }).getCount();
        if (!existingTasks || existingTasks === 0) {
          const defaultDuration = ((wo as any).raw && (wo as any).raw.expected_duration_min) ? Number((wo as any).raw.expected_duration_min) : 15;
          const t = taskRepo.create({ workOrder: { id: saved.id } as any, name: 'Daily Checklist', duration_min: defaultDuration, status: 'NEW' } as any);
          const savedTask = await taskRepo.save(t as any);
            // create associated daily checklist and items from checklist_template if available
            try {
              const dcRepo = AppDataSource.getRepository((await import('../entities/DailyChecklist')).DailyChecklist as any);
              const dciRepo = AppDataSource.getRepository((await import('../entities/DailyChecklistItem')).DailyChecklistItem as any);
              const template = (saved.raw && saved.raw.checklist_template) ? saved.raw.checklist_template : null;
              const performedAt = saved.start_date ? new Date(saved.start_date) : new Date();
              // Resolve a numeric teknisi_id if possible: prefer saved.raw.assigned_user_id when numeric,
              // otherwise attempt to find assignment->user.id for this WO. If none, skip creating DailyChecklist
              let teknisiIdNum: number | null = null;
              try {
                if (saved.raw && saved.raw.assigned_user_id) {
                  const n = Number(saved.raw.assigned_user_id);
                  if (!isNaN(n)) teknisiIdNum = n;
                }
              } catch (e) { /* ignore */ }
              if (!teknisiIdNum) {
                try {
                  const r = await AppDataSource.query(
                    `SELECT u.id as user_id FROM assignment a LEFT JOIN "user" u ON u.id = a.assignee_id WHERE a.wo_id = $1 AND a.status IN ('ASSIGNED','DEPLOYED','IN_PROGRESS') LIMIT 1`,
                    [saved.id]
                  );
                  if (Array.isArray(r) && r.length > 0 && r[0].user_id) teknisiIdNum = Number(r[0].user_id) || null;
                } catch (e) { /* ignore */ }
              }

              if (!teknisiIdNum) {
                // cannot create DailyChecklist because teknisi_id is required by schema
              } else {
                const dc = dcRepo.create({ alat: { id: saved.asset_id } as any, teknisi_id: teknisiIdNum, teknisi_name: saved.raw && saved.raw.assigned_user_name ? String(saved.raw.assigned_user_name) : null, performed_at: performedAt } as any);
                const savedDc = await dcRepo.save(dc as any);
                if (Array.isArray(template) && template.length > 0) {
                  const itemsToSave: any[] = [];
                  for (const q of template) {
                    try {
                      const item = dciRepo.create({ daily_checklist: { id: savedDc.id } as any, question: q.id ? { id: q.id } : undefined, option: undefined, answer_text: null, answer_number: null } as any);
                      itemsToSave.push(item);
                    } catch (e) { /* ignore per-item errors */ }
                  }
                  if (itemsToSave.length > 0) await dciRepo.save(itemsToSave as any);
                }
              }
            } catch (e) {
              console.warn('failed to create daily checklist/items for generated workorder', (saved as any).id, e);
            }
        }
      } catch (e) {
        console.warn('failed to create default task for generated workorder', (saved as any).id, e);
      }
      created.push(saved as any);
    } catch (e) {
      console.warn('generateDailyChecklistWorkOrders failed for alat', (a as any).id, e);
    }
  }

  return created;
}

/**
 * Create work orders from a custom preview payload.
 * Expects items: Array<{ asset_id, asset_name, start, end, assigned_user_id?, assigned_user_name?, jenis_alat_id? }>
 */
export async function createCustomDailyChecklistWorkOrders(items: any[]) {
  if (!Array.isArray(items)) return [];
  const alatRepo = AppDataSource.getRepository((await import('../entities/MasterAlat')).MasterAlat as any);
  const qRepo = AppDataSource.getRepository((await import('../entities/MasterChecklistQuestion')).MasterChecklistQuestion as any);
  const woRepo = AppDataSource.getRepository(WorkOrder);

  const created: WorkOrder[] = [];
  for (const it of items) {
    try {
      const assetId = it.asset_id ?? null;
      const assetName = it.asset_name ?? (it.asset_name || `Asset ${assetId}`);
      const start = it.start ? new Date(it.start) : null;
      const end = it.end ? new Date(it.end) : null;
      // derive date_doc from start or end
      const refDate = start || end || new Date();
      const y = refDate.getFullYear();
      const m = String(refDate.getMonth() + 1).padStart(2, '0');
      const d = String(refDate.getDate()).padStart(2, '0');
      const dateDoc = `${y}-${m}-${d}`;

      // duplicate guard: skip if DAILY_CHECKLIST exists for this asset+date
      if (assetId) {
        const exists = await woRepo.createQueryBuilder('wo')
          .where('wo.asset_id = :assetId', { assetId })
          .andWhere('(wo.date_doc = :dd OR to_char(wo.start_date, \'YYYY-MM-DD\') = :dd)', { dd: dateDoc })
          .andWhere('wo.type_work = :tw', { tw: 'DAILY_CHECKLIST' })
          .andWhere('wo.deleted_at IS NULL')
          .getOne();
        if (exists) {
          console.info('[createCustomDailyChecklistWorkOrders] skipping existing WO for asset', assetId, 'date=', dateDoc);
          continue;
        }
      }

      // fetch asset to derive jenis_alat and site info when possible
      let jenisId = it.jenis_alat_id ?? null;
      let assetRecord: any = null;
      let siteName: string | null = null;
      if (assetId) {
        try {
          assetRecord = await alatRepo.findOne({ where: { id: assetId } as any, relations: ['jenis_alat', 'site'] });
          if (assetRecord) {
            jenisId = jenisId ?? (assetRecord as any).jenis_alat?.id ?? (assetRecord as any).jenis_alat_id ?? null;
            // prefer site.name, site.nama, or site.code
            const s = (assetRecord as any).site;
            if (s) siteName = String(s.name ?? s.nama ?? s.code ?? s.label ?? '').trim() || null;
          }
        } catch (e) {
          assetRecord = null;
        }
      }

      let questions: any[] = [];
      if (jenisId) {
        questions = await qRepo.createQueryBuilder('q')
          .leftJoinAndSelect('q.options', 'o')
          .where('q.jenis_alat_id = :jid', { jid: jenisId })
          .orderBy('q.order', 'ASC')
          .getMany();
      }

      const checklistTemplate = (questions || []).map((q: any) => ({
        id: q.id,
        question_text: q.question_text,
        input_type: q.input_type,
        required: q.required,
        kelompok: q.kelompok ?? null,
        order: q.order ?? null,
        duration_min: 15,
        options: (q.options || []).map((o: any) => ({ id: o.id, option_text: o.option_text, option_value: o.option_value, order: o.order })),
      }));

      const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
      const dayKey = `${y}${m}${d}`;
      const docNo = `DC-${dayKey}-${assetId ?? 'NA'}-${rand}`;

      const rawObj: any = {
        generated_for: dateDoc,
        alat_id: assetId,
        alat_name: assetName,
        checklist_template: checklistTemplate,
        expected_duration_min: 15,
        assigned_user_id: it.assigned_user_id ?? null,
        assigned_user_name: it.assigned_user_name ?? null,
      };
      if (siteName) {
        rawObj.site = siteName;
        rawObj.vendor_cabang = siteName;
      }

      const wo = woRepo.create({
        doc_no: docNo,
        date_doc: dateDoc,
        asset_id: assetId,
        asset_name: assetName,
        type_work: 'DAILY_CHECKLIST',
        work_type: 'DAILY',
        description: `Daily checklist for ${assetName}`,
        start_date: start || null,
        end_date: end || null,
        raw: rawObj,
        status: 'NEW',
      } as any);

      const saved = await woRepo.save(wo as any);

      // If an assignee was provided in the preview item, create a workorder-level Assignment
      try {
        const assignee = it.assigned_user_id ?? null;
        if (assignee) {
          const assignRepo = AppDataSource.getRepository((await import('../entities/Assignment')).Assignment as any);
          // check for assignment conflicts: same assignee with active assignment on overlapping WO time
          const newStart = saved.start_date ? new Date(saved.start_date) : null;
          const newEnd = saved.end_date ? new Date(saved.end_date) : null;
          let conflict: any = null;
          try {
            if (newStart && newEnd) {
              const rows: any[] = await AppDataSource.query(
                `SELECT a.id as assignment_id, wo.id as wo_id, wo.doc_no as doc_no, wo.start_date, wo.end_date
                 FROM assignment a
                 JOIN work_order wo ON wo.id = a.wo_id
                 WHERE a.assignee_id = $1 AND a.status IN ('ASSIGNED','DEPLOYED','IN_PROGRESS')
                   AND tstzrange(wo.start_date, wo.end_date) && tstzrange($2::timestamptz, $3::timestamptz)
                 LIMIT 1`,
                [String(assignee), newStart.toISOString(), newEnd.toISOString()]
              );
              if (Array.isArray(rows) && rows.length > 0) conflict = rows[0];
            }
          } catch (e) {
            console.warn('failed to check assignment conflict', e);
          }

          if (conflict) {
            // attempt to find next free slot for this assignee on the same day
            const durationMin = (saved.raw && saved.raw.expected_duration_min) ? Number(saved.raw.expected_duration_min) : 15;
            const gapMin = 5;
            const stepMs = (durationMin + gapMin) * 60 * 1000;
            const originalStart = newStart;
            if (!originalStart) {
              const raw = saved.raw || {};
              raw.assignment_conflict = { assignee: String(assignee), reason: 'missing_start_time' };
              saved.raw = raw;
              await woRepo.save(saved as any);
            } else {
              let foundSlot = false;
              const maxAttempts = 48; // cap attempts to avoid infinite loops
              for (let i = 1; i <= maxAttempts; i++) {
                const candidateStart = new Date(originalStart.getTime() + stepMs * i);
                // stop if moved to next calendar day
                if (candidateStart.getFullYear() !== originalStart.getFullYear() || candidateStart.getMonth() !== originalStart.getMonth() || candidateStart.getDate() !== originalStart.getDate()) break;
                const candidateEnd = new Date(candidateStart.getTime() + durationMin * 60 * 1000);
                // check conflict for candidate window
                try {
                  const rows2: any[] = await AppDataSource.query(
                    `SELECT a.id as assignment_id, wo.id as wo_id, wo.doc_no as doc_no, wo.start_date, wo.end_date
                     FROM assignment a
                     JOIN work_order wo ON wo.id = a.wo_id
                     WHERE a.assignee_id = $1 AND a.status IN ('ASSIGNED','DEPLOYED','IN_PROGRESS')
                       AND tstzrange(wo.start_date, wo.end_date) && tstzrange($2::timestamptz, $3::timestamptz)
                     LIMIT 1`,
                    [String(assignee), candidateStart.toISOString(), candidateEnd.toISOString()]
                  );
                  if (!Array.isArray(rows2) || rows2.length === 0) {
                    // free slot found — update workorder times and create assignment
                    saved.start_date = candidateStart as any;
                    saved.end_date = candidateEnd as any;
                    const raw = saved.raw || {};
                    raw.rescheduled_from = originalStart ? originalStart.toISOString() : null;
                    saved.raw = raw;
                    await woRepo.save(saved as any);
                    const a2 = assignRepo.create({
                      wo: { id: saved.id } as any,
                      assigneeId: String(assignee),
                      task_id: null,
                      task_name: null,
                      assignedBy: null,
                      scheduledAt: saved.start_date ? new Date(saved.start_date) : null,
                      status: 'ASSIGNED',
                    } as any);
                    await assignRepo.save(a2 as any);
                    saved.status = 'ASSIGNED' as any;
                    await woRepo.save(saved as any);
                    foundSlot = true;
                    break;
                  }
                } catch (e) {
                  // on query error, break and fallback to marking conflict
                  console.warn('failed to check candidate assignment conflict', e);
                  break;
                }
              }
              if (!foundSlot) {
                const raw = saved.raw || {};
                raw.assignment_conflict = { assignee: String(assignee), conflicting_wo_id: conflict.wo_id, conflicting_doc_no: conflict.doc_no };
                saved.raw = raw;
                await woRepo.save(saved as any);
              }
            }
          } else {
            const a = assignRepo.create({
              wo: { id: saved.id } as any,
              assigneeId: String(assignee),
              task_id: null,
              task_name: null,
              assignedBy: null,
              scheduledAt: saved.start_date ? new Date(saved.start_date) : null,
              status: 'ASSIGNED',
            } as any);
            await assignRepo.save(a as any);
            // update workorder status to ASSIGNED so UI picks up assigned users
            saved.status = 'ASSIGNED' as any;
            await woRepo.save(saved as any);
          }
        }
      } catch (e) {
        console.warn('failed to create assignment for generated workorder', saved.id, e);
      }
          // ensure default task exists for this custom-generated WO so deploy can run
          try {
            const taskRepo = AppDataSource.getRepository(Task);
            const cnt = await taskRepo.createQueryBuilder('t').where('t.work_order_id = :wo', { wo: saved.id }).getCount();
            if (!cnt || cnt === 0) {
              const defaultDuration = (saved.raw && saved.raw.expected_duration_min) ? Number(saved.raw.expected_duration_min) : 15;
              const tt = taskRepo.create({ workOrder: { id: saved.id } as any, name: 'Daily Checklist', duration_min: defaultDuration, status: 'NEW' } as any);
              const savedTask = await taskRepo.save(tt as any);
              // create associated daily checklist and items if template present
              try {
                const dcRepo = AppDataSource.getRepository((await import('../entities/DailyChecklist')).DailyChecklist as any);
                const dciRepo = AppDataSource.getRepository((await import('../entities/DailyChecklistItem')).DailyChecklistItem as any);
                const template = (saved.raw && saved.raw.checklist_template) ? saved.raw.checklist_template : null;
                const performedAt = saved.start_date ? new Date(saved.start_date) : new Date();
                // Resolve teknisi id: prefer saved.raw.assigned_user_id when numeric, else lookup assignment->user
                let teknisiIdNum: number | null = null;
                try {
                  if (saved.raw && saved.raw.assigned_user_id) {
                    const n = Number(saved.raw.assigned_user_id);
                    if (!isNaN(n)) teknisiIdNum = n;
                  }
                } catch (e) { }
                if (!teknisiIdNum) {
                  try {
                    const r = await AppDataSource.query(
                      `SELECT u.id as user_id FROM assignment a LEFT JOIN "user" u ON u.id = a.assignee_id WHERE a.wo_id = $1 AND a.status IN ('ASSIGNED','DEPLOYED','IN_PROGRESS') LIMIT 1`,
                      [saved.id]
                    );
                    if (Array.isArray(r) && r.length > 0 && r[0].user_id) teknisiIdNum = Number(r[0].user_id) || null;
                  } catch (e) { }
                }
                if (!teknisiIdNum) {
                  // Skip creating DailyChecklist because teknisi_id is required by schema
                } else {
                  const dc = dcRepo.create({ alat: { id: saved.asset_id } as any, teknisi_id: teknisiIdNum, teknisi_name: saved.raw && saved.raw.assigned_user_name ? String(saved.raw.assigned_user_name) : null, performed_at: performedAt } as any);
                  const savedDc = await dcRepo.save(dc as any);
                  if (Array.isArray(template) && template.length > 0) {
                    const itemsToSave: any[] = [];
                    for (const q of template) {
                      try {
                        const item = dciRepo.create({ daily_checklist: { id: savedDc.id } as any, question: q.id ? { id: q.id } : undefined, option: undefined, answer_text: null, answer_number: null } as any);
                        itemsToSave.push(item);
                      } catch (e) { }
                    }
                    if (itemsToSave.length > 0) await dciRepo.save(itemsToSave as any);
                  }
                }
              } catch (e) {
                console.warn('failed to create daily checklist/items for custom generated workorder', saved.id, e);
              }
            }
          } catch (e) {
            console.warn('failed to create default task for custom generated workorder', saved.id, e);
          }
      created.push(saved as any);
    } catch (e) {
      console.warn('createCustomDailyChecklistWorkOrders failed for item', it, e);
    }
  }

  return created;
}

export async function updateWorkOrderDates(id: string, payload: { start_date?: Date | undefined; end_date?: Date | undefined; note?: string | undefined; changedBy?: any | undefined; }) {
  const repo = AppDataSource.getRepository(WorkOrder);
  const histRepo = AppDataSource.getRepository(WorkOrderDateHistory);
  const existing = await repo.findOneBy({ id } as FindOptionsWhere<WorkOrder>);
  if (!existing) throw new Error('WorkOrder not found');

  const oldStart = existing.start_date || null;
  const oldEnd = existing.end_date || null;

  let changed = false;
  if (payload.start_date !== undefined) {
    existing.start_date = payload.start_date as any;
    changed = true;
  }
  if (payload.end_date !== undefined) {
    existing.end_date = payload.end_date as any;
    // IMPORTANT: Do not automatically change work order status when frontend edits dates.
    // Previously we set `existing.status = 'COMPLETED'` here which caused unexpected
    // state transitions when a user merely adjusted dates. Status transitions should
    // be performed explicitly via dedicated endpoints (e.g. deploy/complete) or
    // business logic that validates tasks/realisasi — avoid implicit side-effects.
    changed = true;
  }

  const saved = await repo.save(existing);

  // record history if any date changed
  if (changed) {
    try {
      // normalize changedBy to always include nipp and name fields (may be null)
      const cb = payload.changedBy || null;
      const changedByNormalized = cb ? {
        id: cb.id ?? null,
        nipp: cb.nipp ?? cb.nip ?? null,
        name: cb.name ?? cb.username ?? null,
        email: cb.email ?? null,
      } : null;

      const h = histRepo.create({
        work_order_id: saved.id,
        old_start: oldStart || null,
        old_end: oldEnd || null,
        new_start: saved.start_date || null,
        new_end: saved.end_date || null,
        note: payload.note || null,
        changed_by: changedByNormalized,
      } as any);
      await histRepo.save(h as any);
    } catch (e) {
      console.warn('Failed to save work order date history', e);
    }
  }

  return saved;
}

export async function getWorkOrderDateHistory(workOrderId: string) {
  const histRepo = AppDataSource.getRepository(WorkOrderDateHistory);
  const rows = await histRepo.createQueryBuilder('h')
    .where('h.work_order_id = :wo', { wo: workOrderId })
    .orderBy('h.changed_at', 'DESC')
    .getMany();
  // serialize dates to ISO strings
  return rows.map(r => ({
    id: r.id,
    work_order_id: r.work_order_id,
    old_start: (r.old_start ? (function(v:any){ const dt = new Date(v); if (isNaN(dt.getTime())) return null; return dt.toISOString(); })(r.old_start) : null),
    old_end: (r.old_end ? (function(v:any){ const dt = new Date(v); if (isNaN(dt.getTime())) return null; return dt.toISOString(); })(r.old_end) : null),
    new_start: (r.new_start ? (function(v:any){ const dt = new Date(v); if (isNaN(dt.getTime())) return null; return dt.toISOString(); })(r.new_start) : null),
    new_end: (r.new_end ? (function(v:any){ const dt = new Date(v); if (isNaN(dt.getTime())) return null; return dt.toISOString(); })(r.new_end) : null),
    note: r.note ?? null,
    changed_by: r.changed_by ?? null,
    changed_at: r.changed_at ? (new Date(r.changed_at)).toISOString() : null,
  }));
}
