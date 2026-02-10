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
            // Use raw query to ensure we get all columns including answer_text
            const rawItems = await itemRepo.createQueryBuilder('it')
                .select('it.id', 'id')
                .addSelect('it.daily_checklist_id', 'daily_checklist_id')
                .addSelect('it.answer_text', 'answer_text')
                .addSelect('it.answer_number', 'answer_number')
                .where('it.daily_checklist_id IN (:...ids)', { ids: checklistIds })
                .getRawMany();
            for (const it of rawItems) {
                const cid = it.daily_checklist_id;
                if (!cid)
                    continue;
                itemsByChecklist[cid] = itemsByChecklist[cid] || [];
                itemsByChecklist[cid].push(it);
            }
            console.debug('weeklyChecklistStatus loaded items count=', rawItems.length, 'grouped into', Object.keys(itemsByChecklist).length, 'checklists');
            if (rawItems.length > 0) {
                console.debug('weeklyChecklistStatus sample items 0-2=', rawItems.slice(0, 3));
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
            if (its.length > 0) {
                console.debug(`checking checklist ${cid} with ${its.length} items`);
            }
            for (let idx = 0; idx < its.length; idx++) {
                const it = its[idx];
                try {
                    // Handle both raw query format and ORM object format
                    const ansText = (it.answer_text !== undefined && it.answer_text !== null)
                        ? String(it.answer_text).trim().toLowerCase()
                        : '';
                    const ansNum = it.answer_number;
                    if (ansText) {
                        console.debug(`  checklist ${cid} item ${idx}: answer_text="${ansText}"`);
                    }
                    // Check if answer is "false" (direct string match) or 0 (number)
                    if (ansText === 'false' || ansText === '0' || ansText === 'no' || ansText === 'n') {
                        console.debug(`  checklist ${cid} item ${idx}: FOUND FALSE! ansText="${ansText}"`);
                        hasFalse = true;
                        break;
                    }
                    if (ansNum !== undefined && ansNum !== null && Number(ansNum) === 0) {
                        console.debug(`  checklist ${cid} item ${idx}: FOUND FALSE! ansNum=${ansNum}`);
                        hasFalse = true;
                        break;
                    }
                }
                catch (e) {
                    console.error(`  checklist ${cid} item ${idx} error:`, e);
                }
            }
            if (its.length > 0) {
                console.debug(`checklist ${cid} final result: hasFalse=${hasFalse}`);
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
