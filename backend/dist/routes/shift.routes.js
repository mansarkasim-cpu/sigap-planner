"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ormconfig_1 = require("../ormconfig");
const ShiftGroup_1 = require("../entities/ShiftGroup");
const ShiftAssignment_1 = require("../entities/ShiftAssignment");
const auth_1 = require("../middleware/auth");
const MasterSite_1 = require("../entities/MasterSite");
const class_validator_1 = require("class-validator");
const router = (0, express_1.Router)();
// Shift definitions (must match frontend ShiftManager)
const SHIFT_DEFS = [
    { id: 1, start: '07:00', end: '15:00' },
    { id: 2, start: '15:00', end: '23:00' },
    { id: 3, start: '23:00', end: '07:00' },
];
function timeToMinutes(t) {
    const m = String(t || '').trim();
    const parts = m.split(':');
    const hh = Number(parts[0] || 0);
    const mm = Number(parts[1] || 0);
    return hh * 60 + mm;
}
function findShiftIdForTime(timeStr) {
    if (!timeStr)
        return null;
    const mins = timeToMinutes(timeStr);
    for (const s of SHIFT_DEFS) {
        const startM = timeToMinutes(s.start);
        const endM = timeToMinutes(s.end === '24:00' ? '24:00' : s.end);
        if (startM <= mins && mins < endM)
            return s.id;
        // handle midnight ranges (not needed for current defs but safe)
        if (startM > endM) {
            // e.g., 23:00 - 06:00
            if (mins >= startM || mins < endM)
                return s.id;
        }
    }
    return null;
}
function dateMinusOne(dateStr) {
    try {
        const d = new Date(dateStr + 'T00:00:00');
        if (isNaN(d.getTime()))
            return dateStr;
        d.setDate(d.getDate() - 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }
    catch (e) {
        return dateStr;
    }
}
class CreateGroupDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGroupDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateGroupDTO.prototype, "members", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGroupDTO.prototype, "site", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGroupDTO.prototype, "leader", void 0);
router.post('/shift-groups', auth_1.authMiddleware, async (req, res) => {
    try {
        const dto = Object.assign(new CreateGroupDTO(), req.body || {});
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0)
            return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid input', details: errors });
        const repo = ormconfig_1.AppDataSource.getRepository(ShiftGroup_1.ShiftGroup);
        const g = repo.create({ name: dto.name, members: dto.members || [], site: dto.site, leader: dto.leader || null });
        const saved = await repo.save(g);
        return res.status(201).json({ message: 'created', data: saved });
    }
    catch (err) {
        console.error('create shift group', err);
        return res.status(500).json({ message: 'Failed to create group' });
    }
});
router.get('/shift-groups', auth_1.authMiddleware, async (req, res) => {
    try {
        const repo = ormconfig_1.AppDataSource.getRepository(ShiftGroup_1.ShiftGroup);
        const qb = repo.createQueryBuilder('g');
        if (req.query.site)
            qb.andWhere('g.site = :site', { site: String(req.query.site) });
        qb.orderBy('g.createdAt', 'DESC');
        const rows = await qb.getMany();
        return res.json(rows);
    }
    catch (err) {
        console.error('list shift groups', err);
        return res.status(500).json({ message: 'Failed to list groups' });
    }
});
// DELETE /api/shift-groups/:id
router.delete('/shift-groups/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const repo = ormconfig_1.AppDataSource.getRepository(ShiftGroup_1.ShiftGroup);
        const aRepo = ormconfig_1.AppDataSource.getRepository(ShiftAssignment_1.ShiftAssignment);
        const g = await repo.findOneBy({ id });
        if (!g)
            return res.status(404).json({ message: 'Group not found' });
        // remove any assignments referencing this group
        try {
            await aRepo.createQueryBuilder().delete().from(ShiftAssignment_1.ShiftAssignment).where('group_id = :id', { id }).execute();
        }
        catch (e) {
            console.warn('Failed to remove related assignments', e);
        }
        await repo.remove(g);
        return res.json({ message: 'deleted' });
    }
    catch (err) {
        console.error('delete shift group', err);
        return res.status(500).json({ message: 'Failed to delete group' });
    }
});
class UpdateGroupDTO {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGroupDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateGroupDTO.prototype, "members", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGroupDTO.prototype, "site", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGroupDTO.prototype, "leader", void 0);
router.put('/shift-groups/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const dto = Object.assign(new UpdateGroupDTO(), req.body || {});
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0)
            return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid input', details: errors });
        const repo = ormconfig_1.AppDataSource.getRepository(ShiftGroup_1.ShiftGroup);
        const g = await repo.findOneBy({ id });
        if (!g)
            return res.status(404).json({ message: 'Group not found' });
        if (dto.name !== undefined)
            g.name = dto.name;
        if (dto.members !== undefined)
            g.members = dto.members;
        if (dto.site !== undefined)
            g.site = dto.site;
        if (dto.leader !== undefined)
            g.leader = dto.leader;
        const saved = await repo.save(g);
        return res.json({ message: 'updated', data: saved });
    }
    catch (err) {
        console.error('update shift group', err);
        return res.status(500).json({ message: 'Failed to update group' });
    }
});
class CreateAssignmentDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAssignmentDTO.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAssignmentDTO.prototype, "shift", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAssignmentDTO.prototype, "groupId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssignmentDTO.prototype, "site", void 0);
router.post('/shift-assignments', auth_1.authMiddleware, async (req, res) => {
    try {
        const dto = Object.assign(new CreateAssignmentDTO(), req.body || {});
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0)
            return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid input', details: errors });
        const assignmentRepo = ormconfig_1.AppDataSource.getRepository(ShiftAssignment_1.ShiftAssignment);
        const groupRepo = ormconfig_1.AppDataSource.getRepository(ShiftGroup_1.ShiftGroup);
        const group = await groupRepo.findOneBy({ id: dto.groupId });
        if (!group)
            return res.status(404).json({ message: 'Group not found' });
        // prevent duplicate assignment for same date+shift+group+site
        const exists = await assignmentRepo.createQueryBuilder('a')
            .leftJoin('a.group', 'g')
            .where('a.date = :date', { date: dto.date })
            .andWhere('a.shift = :shift', { shift: dto.shift })
            .andWhere('g.id = :gid', { gid: dto.groupId })
            .andWhere('a.site = :site', { site: dto.site || null })
            .getOne();
        if (exists)
            return res.status(409).json({ message: 'Assignment already exists for this group/shift/date' });
        const a = assignmentRepo.create({ date: dto.date, shift: dto.shift, group: group, site: dto.site });
        const saved = await assignmentRepo.save(a);
        return res.status(201).json({ message: 'assigned', data: saved });
    }
    catch (err) {
        console.error('create assignment', err);
        return res.status(500).json({ message: 'Failed to create assignment' });
    }
});
router.get('/shift-assignments', auth_1.authMiddleware, async (req, res) => {
    try {
        const repo = ormconfig_1.AppDataSource.getRepository(ShiftAssignment_1.ShiftAssignment);
        const qb = repo.createQueryBuilder('a').leftJoinAndSelect('a.group', 'g');
        if (req.query.date)
            qb.andWhere('a.date = :date', { date: String(req.query.date) });
        if (req.query.site)
            qb.andWhere('a.site = :site', { site: String(req.query.site) });
        const rows = await qb.getMany();
        return res.json(rows.map(r => ({
            id: r.id,
            date: r.date,
            shift: r.shift,
            groupId: r.group?.id,
            groupName: r.group?.name,
            groupMembers: r.group?.members || [],
            site: r.site,
            createdAt: r.createdAt
        })));
    }
    catch (err) {
        console.error('list assignments', err);
        return res.status(500).json({ message: 'Failed to list assignments' });
    }
});
// GET /api/scheduled-technicians?date=YYYY-MM-DD&site=...
router.get('/scheduled-technicians', auth_1.authMiddleware, async (req, res) => {
    try {
        const date = String(req.query.date || '');
        if (!date)
            return res.status(400).json({ message: 'date is required (YYYY-MM-DD)' });
        const site = req.query.site ? String(req.query.site) : null;
        const time = req.query.time ? String(req.query.time) : null; // expected HH:MM, provided in UTC
        // Determine timezone: try environment override, otherwise default to Jakarta
        const DEFAULT_TZ = process.env.DEFAULT_TIMEZONE || 'Asia/Jakarta';
        let timeZone = DEFAULT_TZ;
        // If a site identifier was provided, try to lookup per-site timezone
        if (site) {
            try {
                const msRepo = ormconfig_1.AppDataSource.getRepository(MasterSite_1.MasterSite);
                let ms = null;
                // if site looks numeric, try id lookup
                const maybeId = Number(site);
                if (!isNaN(maybeId) && Number.isInteger(maybeId)) {
                    ms = await msRepo.findOne({ where: { id: maybeId } });
                }
                // If not found by id, try a case-insensitive match on code or name.
                if (!ms) {
                    ms = await msRepo.createQueryBuilder('ms')
                        .where('LOWER(ms.code) = LOWER(:s)', { s: site })
                        .orWhere('LOWER(ms.name) = LOWER(:s)', { s: site })
                        .getOne();
                }
                if (ms && (ms.timezone || '').toString().trim() !== '') {
                    timeZone = ms.timezone;
                }
            }
            catch (e) {
                console.warn('[scheduled-technicians] failed to lookup site timezone, falling back to default', e);
            }
        }
        // support debug flag
        const debugFlag = req.query.debug ? String(req.query.debug).toLowerCase() : '';
        // support timeIsLocal flag: when true, the provided `time` is treated as the
        // site's local wall-clock time (no UTC->local conversion). Accepts `1` or `true`.
        const timeIsLocal = req.query.timeIsLocal ? String(req.query.timeIsLocal).toLowerCase() === '1' || String(req.query.timeIsLocal).toLowerCase() === 'true' : false;
        // Convert provided UTC date+time to the site's local date/time (in timeZone)
        // so shift matching uses local wall-clock time.
        let localTimeStr = null;
        let localDateStr = date; // fallback
        try {
            if (time) {
                if (timeIsLocal) {
                    // Treat the provided `time` as already in the target timezone's local wall-clock.
                    // Use it directly; local date remains `date` (caller may supply prior/next day if needed).
                    localTimeStr = time;
                }
                else {
                    // build an ISO instant from provided date+time in UTC
                    const isoUtc = `${date}T${time}:00Z`;
                    const d = new Date(isoUtc);
                    if (!isNaN(d.getTime())) {
                        // get local time components in target timezone
                        const parts = new Intl.DateTimeFormat('en-GB', {
                            timeZone,
                            hour: '2-digit', minute: '2-digit', hour12: false,
                            year: 'numeric', month: '2-digit', day: '2-digit'
                        }).formatToParts(d);
                        const map = {};
                        for (const p of parts)
                            map[p.type] = p.value;
                        const hh = map.hour || '00';
                        const mm = map.minute || '00';
                        localTimeStr = `${hh}:${mm}`;
                        const yyyy = map.year;
                        const mmth = map.month;
                        const dd = map.day;
                        if (yyyy && mmth && dd)
                            localDateStr = `${yyyy}-${mmth}-${dd}`;
                    }
                }
            }
        }
        catch (e) {
            // fallback: leave localTimeStr null and use original date/time
            console.warn('[scheduled-technicians] failed to convert UTC time to local', e);
        }
        // Use raw SQL to extract JSONB members and join to user table
        const params = [localDateStr];
        let siteCond = '';
        // Only filter by the assignment's site (`a.site`).
        // Previously the code required both a.site and u.site to match the provided site,
        // which incorrectly excluded users whose `site` field is empty or differs.
        if (site) {
            params.push(site);
            siteCond = ' AND LOWER(COALESCE(a.site,\'\')) = LOWER($2)';
        }
        // determine shift from local time if provided
        const shiftId = findShiftIdForTime(localTimeStr || time);
        let shiftCond = '';
        if (shiftId !== null) {
            // Build params using effective localDate (already applied)
            if (!site)
                params.push(shiftId);
            else
                params.push(shiftId); // shift param index will follow site param if present
            const idx = params.length;
            shiftCond = ` AND a.shift = $${idx}`;
            console.debug('[scheduled-technicians] filtering by shift', { date, time, timeZone, localDate: localDateStr, localTime: localTimeStr, shiftId });
        }
        const sql = `
      SELECT DISTINCT u.id, u.name, u.email, u.role, u.created_at, u.nipp, u.site
      FROM "user" u
      JOIN (
        SELECT g.id as gid, jsonb_array_elements_text(g.members) as member_id_text
        FROM shift_group g
      ) gm ON gm.member_id_text = u.id::text
      JOIN shift_assignment a ON a.group_id = gm.gid
      WHERE a.date = $1 ${siteCond} ${shiftCond}
      AND u.role = 'technician'
    `;
        // Diagnostic: when debugging, collect which group-member IDs and user IDs are matched
        let dbgMembers = [];
        let dbgUserIds = [];
        try {
            // For member diagnostics, only filter by assignment.a.site (don't reference u)
            const memberSiteCond = site ? ` AND LOWER(COALESCE(a.site,'')) = LOWER($2)` : '';
            const dbgMembersSql = `
        SELECT DISTINCT g.id as gid, jsonb_array_elements_text(g.members) as member_id_text
        FROM shift_group g
        JOIN shift_assignment a ON a.group_id = g.id
        WHERE a.date = $1 ${memberSiteCond} ${shiftCond}
      `;
            if (process.env.NODE_ENV !== 'production' || debugFlag === '1' || debugFlag === 'true') {
                console.debug('[scheduled-technicians] diagnostic member_ids SQL', dbgMembersSql, params);
            }
            dbgMembers = await ormconfig_1.AppDataSource.manager.query(dbgMembersSql, params);
            if (process.env.NODE_ENV !== 'production' || debugFlag === '1' || debugFlag === 'true') {
                console.debug('[scheduled-technicians] diagnostic member_ids', dbgMembers);
            }
            const dbgUserIdsSql = `
        SELECT DISTINCT u.id
        FROM "user" u
        JOIN (
          SELECT g.id as gid, jsonb_array_elements_text(g.members) as member_id_text
          FROM shift_group g
        ) gm ON gm.member_id_text = u.id::text
        JOIN shift_assignment a ON a.group_id = gm.gid
        WHERE a.date = $1 ${siteCond} ${shiftCond}
      `;
            if (process.env.NODE_ENV !== 'production' || debugFlag === '1' || debugFlag === 'true') {
                console.debug('[scheduled-technicians] diagnostic user_ids SQL', dbgUserIdsSql, params);
            }
            dbgUserIds = await ormconfig_1.AppDataSource.manager.query(dbgUserIdsSql, params);
            if (process.env.NODE_ENV !== 'production' || debugFlag === '1' || debugFlag === 'true') {
                console.debug('[scheduled-technicians] diagnostic user_ids', dbgUserIds);
            }
        }
        catch (e) {
            console.warn('[scheduled-technicians] diagnostic query failed', e);
        }
        console.debug('[scheduled-technicians] main SQL', sql, params);
        const rows = await ormconfig_1.AppDataSource.manager.query(sql, params);
        if (debugFlag === '1' || debugFlag === 'true') {
            return res.json({ date, time, timeZone, localDateStr, localTimeStr, shiftId, params, dbgMembers, dbgUserIds, sql, rows });
        }
        return res.json(rows);
    }
    catch (err) {
        console.error('scheduled-technicians error', err);
        return res.status(500).json({ message: 'Failed to fetch scheduled technicians' });
    }
});
router.delete('/shift-assignments/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const repo = ormconfig_1.AppDataSource.getRepository(ShiftAssignment_1.ShiftAssignment);
        const a = await repo.findOneBy({ id });
        if (!a)
            return res.status(404).json({ message: 'Not found' });
        await repo.remove(a);
        return res.json({ message: 'deleted' });
    }
    catch (err) {
        console.error('delete assignment', err);
        return res.status(500).json({ message: 'Failed to delete' });
    }
});
exports.default = router;
