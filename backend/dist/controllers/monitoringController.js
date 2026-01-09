"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weeklyChecklistStatus = void 0;
const ormconfig_1 = require("../ormconfig");
const MasterAlat_1 = require("../entities/MasterAlat");
const DailyChecklist_1 = require("../entities/DailyChecklist");
const DailyChecklistItem_1 = require("../entities/DailyChecklistItem");
function startOfDay(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}
function fmtYMD(d) {
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}
async function weeklyChecklistStatus(req, res) {
    try {
        const siteId = req.query.site_id ? Number(req.query.site_id) : undefined;
        const weekStartQ = req.query.week_start || '';
        // determine week start (Monday). If week_start provided, use it; else compute current week's Monday.
        let start;
        if (weekStartQ) {
            const parsed = new Date(weekStartQ);
            if (isNaN(parsed.getTime()))
                return res.status(400).json({ message: 'Invalid week_start' });
            start = startOfDay(parsed);
        }
        else {
            const now = new Date();
            // get Monday as start
            const day = now.getDay(); // 0 Sun .. 6 Sat
            const diff = (day + 6) % 7; // days since Monday
            start = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff));
        }
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push(fmtYMD(d));
        }
        // load alats for the site (or all alats if no site filter)
        const aRepo = ormconfig_1.AppDataSource.getRepository(MasterAlat_1.MasterAlat);
        const qb = aRepo.createQueryBuilder('a').leftJoinAndSelect('a.site', 'site');
        if (siteId)
            qb.where('site.id = :sid', { sid: siteId });
        const alats = await qb.orderBy('a.nama', 'ASC').getMany();
        const alatIds = alats.map(a => a.id);
        console.debug('weeklyChecklistStatus alats count=', alats.length, 'ids sample=', alatIds.slice(0, 10));
        const checklistRepo = ormconfig_1.AppDataSource.getRepository(DailyChecklist_1.DailyChecklist);
        const startISO = days[0];
        const endISO = days[6];
        let checklists = [];
        if (alatIds.length > 0) {
            checklists = await checklistRepo.createQueryBuilder('dc')
                .where('dc.alat_id IN (:...ids)', { ids: alatIds })
                .andWhere('DATE(dc.performed_at) BETWEEN :s AND :e', { s: startISO, e: endISO })
                .leftJoinAndSelect('dc.alat', 'alat')
                .getMany();
        }
        console.debug('weeklyChecklistStatus checklists found=', checklists.length);
        if (checklists.length > 0) {
            console.debug('weeklyChecklistStatus sample checklist 0=', { id: checklists[0].id, alat_id: checklists[0].alat_id ?? checklists[0].alat?.id, performed_at: checklists[0].performed_at });
        }
        // Gather checklist IDs and pre-load their items to detect any 'false' answers
        const checklistIds = checklists.map(c => c.id).filter(Boolean);
        const itemsByChecklist = {};
        if (checklistIds.length > 0) {
            const itemRepo = ormconfig_1.AppDataSource.getRepository(DailyChecklistItem_1.DailyChecklistItem);
            const items = await itemRepo.createQueryBuilder('it')
                .leftJoinAndSelect('it.question', 'question')
                .where('it.daily_checklist_id IN (:...ids)', { ids: checklistIds })
                .getMany();
            for (const it of items) {
                const cid = it.daily_checklist_id ?? it.daily_checklist?.id ?? null;
                if (!cid)
                    continue;
                itemsByChecklist[cid] = itemsByChecklist[cid] || [];
                itemsByChecklist[cid].push(it);
            }
        }
        // map checklists per alat per day, include has_false flag when any boolean question is false
        const map = {};
        for (const c of checklists) {
            const aid = c.alat?.id ?? c['alat_id'] ?? c.alat_id ?? null;
            if (!aid)
                continue;
            const perf = c.performed_at;
            const d = fmtYMD(perf);
            map[aid] = map[aid] || {};
            // determine if this checklist has any false boolean answers
            const cid = c.id;
            let hasFalse = false;
            const its = itemsByChecklist[cid] || [];
            for (const it of its) {
                try {
                    const q = it.question || {};
                    const qtype = (q.input_type || '').toString();
                    const ansText = it.answer_text ? String(it.answer_text).trim().toLowerCase() : '';
                    const ansNum = it.answer_number;
                    if (qtype === 'boolean') {
                        if (ansText === 'false' || ansText === '0' || ansText === 'no' || ansText === 'n') {
                            hasFalse = true;
                            break;
                        }
                        if (ansNum !== undefined && ansNum !== null && Number(ansNum) === 0) {
                            hasFalse = true;
                            break;
                        }
                    }
                }
                catch (e) {
                    // ignore parsing errors per-item
                }
            }
            // if multiple entries per day, keep latest
            const existing = map[aid][d];
            if (!existing || new Date(c.performed_at) > new Date(existing.performed_at)) {
                map[aid][d] = { done: true, checklist_id: c.id, performed_at: c.performed_at, has_false: hasFalse };
            }
        }
        // debug: log days and sample checklists mapping
        console.debug('weeklyChecklistStatus days=', days.slice(0, 7));
        // show one sample of map keys
        try {
            console.debug('weeklyChecklistStatus map sample keys=', Object.keys(map).slice(0, 5));
        }
        catch (e) { }
        const resultAlats = alats.map(a => {
            const row = { id: a.id, nama: a.nama, kode: a.kode ?? null, statuses: {} };
            for (const day of days) {
                row.statuses[day] = map[a.id] && map[a.id][day] ? map[a.id][day] : { done: false };
            }
            return row;
        });
        return res.json({ site_id: siteId ?? null, week_start: days[0], days, alats: resultAlats });
    }
    catch (err) {
        console.error('weeklyChecklistStatus error', err);
        return res.status(500).json({ message: 'Failed to compute weekly status' });
    }
}
exports.weeklyChecklistStatus = weeklyChecklistStatus;
