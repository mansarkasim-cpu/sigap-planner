// src/services/workOrderService.ts
import { AppDataSource } from '../ormconfig';
import { WorkOrder } from '../entities/WorkOrder';
import { Task } from '../entities/Task';
import { FindOptionsWhere } from 'typeorm';
import { WorkOrderDateHistory } from '../entities/WorkOrderDateHistory';

export async function getAllWorkOrders() {
  const repo = AppDataSource.getRepository(WorkOrder);
  return repo.find({ order: { created_at: 'DESC' } });
}

export async function getWorkOrderById(id: string) {
  const repo = AppDataSource.getRepository(WorkOrder);
  // findOneBy id
  const wo = await repo.findOneBy({ id } as FindOptionsWhere<WorkOrder>);
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

export async function getWorkOrdersPaginated(opts: { q?: string; page: number; pageSize: number; site?: string }) {
  const { q = '', page, pageSize, site = '' } = opts;
  const repo = AppDataSource.getRepository(WorkOrder);

  const qb = repo.createQueryBuilder('wo');

  if (q && q.trim().length) {
    const like = `%${q.trim()}%`;
    qb.where('(wo.doc_no ILIKE :like OR wo.asset_name ILIKE :like OR wo.description ILIKE :like)', { like });
  }

  // optional site filtering: try matching raw->>'vendor_cabang' or raw->>'site'
  if (site && site.toString().trim().length) {
    const s = site.toString().toLowerCase().trim();
    // If qb already has a where, add AND; otherwise start where
    qb.andWhere("(LOWER(COALESCE(wo.raw->>'vendor_cabang','')) = :site OR LOWER(COALESCE(wo.raw->>'site','')) = :site)", { site: s });
  }

  qb.orderBy('wo.created_at', 'DESC')
    .skip((page - 1) * pageSize)
    .take(pageSize);

  // inside getWorkOrdersPaginated after fetching rows...  
  const [rows, total] = await qb.getManyAndCount();
  // Return date fields as-stored in the database. If TypeORM returned a Date
  // object, format it as SQL-like 'YYYY-MM-DD HH:mm:ss' using server-local
  // components so the frontend sees the same wall-clock values as in DB.
  function formatDateToSql(val: any) {
    if (val == null) return null;
    if (typeof val === 'string') return val;
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  }

  const serialized = rows.map(r => ({
    ...r,
    start_date: formatDateToSql(r.start_date),
    end_date: formatDateToSql(r.end_date),
  }));
  console.log('  data count:', rows.length);
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

  // find tasks which have realisasi: join realisasi->assignment to get assignment.task_id values for this workorder
  const raw = await AppDataSource.query(
    `SELECT DISTINCT a.task_id as task_id FROM realisasi r JOIN assignment a ON r.assignment_id = a.id WHERE a.wo_id = $1`,
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
        `SELECT DISTINCT a.task_id as task_id, a.task_name as task_name FROM realisasi r JOIN assignment a ON r.assignment_id = a.id WHERE a.wo_id = $1`,
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
    old_start: r.old_start ? (new Date(r.old_start)).toISOString() : null,
    old_end: r.old_end ? (new Date(r.old_end)).toISOString() : null,
    new_start: r.new_start ? (new Date(r.new_start)).toISOString() : null,
    new_end: r.new_end ? (new Date(r.new_end)).toISOString() : null,
    note: r.note ?? null,
    changed_by: r.changed_by ?? null,
    changed_at: r.changed_at ? (new Date(r.changed_at)).toISOString() : null,
  }));
}
