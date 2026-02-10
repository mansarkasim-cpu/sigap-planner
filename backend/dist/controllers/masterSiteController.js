"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSite = exports.updateSite = exports.createSite = exports.getSite = exports.listSites = void 0;
const ormconfig_1 = require("../ormconfig");
const MasterSite_1 = require("../entities/MasterSite");
async function listSites(req, res) {
    try {
        const repo = ormconfig_1.AppDataSource.getRepository(MasterSite_1.MasterSite);
        const rows = await repo.find({ relations: ['hub'], order: { id: 'ASC' } });
        return res.json(rows);
    }
    catch (err) {
        console.error('listSites error', err);
        return res.status(500).json({ message: 'Failed to list sites' });
    }
}
exports.listSites = listSites;
async function getSite(req, res) {
    try {
        const repo = ormconfig_1.AppDataSource.getRepository(MasterSite_1.MasterSite);
        const search = req.query.q || '';
        const page = Number(req.query.page || 0);
        const pageSize = Number(req.query.pageSize || 0);
        const qb = repo.createQueryBuilder('s')
            .leftJoinAndSelect('s.hub', 'hub')
            .orderBy('s.id', 'ASC');
        if (search)
            qb.where('(s.name ILIKE :q OR s.kode ILIKE :q OR hub.name ILIKE :q)', { q: `%${search}%` });
        if (page > 0 && pageSize > 0) {
            const offset = (page - 1) * pageSize;
            const [rows, total] = await qb.skip(offset).take(pageSize).getManyAndCount();
            return res.json({ data: rows, meta: { page, pageSize, total } });
        }
        const rows = await qb.getMany();
        return res.json(rows);
    }
    catch (err) {
        console.error('getSite error', err);
        return res.status(500).json({ message: 'Failed to get site' });
    }
}
exports.getSite = getSite;
async function createSite(req, res) {
    try {
        const repo = ormconfig_1.AppDataSource.getRepository(MasterSite_1.MasterSite);
        const payload = req.body || {};
        if (!payload.name || String(payload.name).trim() === '')
            return res.status(400).json({ message: 'name is required' });
        const ent = repo.create({
            code: payload.code,
            name: String(payload.name).trim(),
            location: payload.location,
            timezone: payload.timezone ?? null,
            hub: payload.hub_id ? { id: payload.hub_id } : undefined,
        });
        const saved = await repo.save(ent);
        return res.status(201).json(saved);
    }
    catch (err) {
        console.error('createSite error', err);
        return res.status(500).json({ message: 'Failed to create site', detail: err instanceof Error ? err.message : err });
    }
}
exports.createSite = createSite;
async function updateSite(req, res) {
    try {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: 'id required' });
        const repo = ormconfig_1.AppDataSource.getRepository(MasterSite_1.MasterSite);
        const payload = req.body || {};
        const update = { ...payload };
        if (payload.hub_id !== undefined) {
            update.hub = payload.hub_id ? { id: payload.hub_id } : null;
            // remove raw hub_id so TypeORM doesn't try to set a non-existent property
            delete update.hub_id;
        }
        if (payload.timezone !== undefined) {
            update.timezone = payload.timezone ?? null;
        }
        await repo.update({ id }, update);
        const row = await repo.findOne({ where: { id }, relations: ['hub'] });
        return res.json(row);
    }
    catch (err) {
        console.error('updateSite error', err);
        return res.status(500).json({ message: 'Failed to update site' });
    }
}
exports.updateSite = updateSite;
async function deleteSite(req, res) {
    try {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: 'id required' });
        const repo = ormconfig_1.AppDataSource.getRepository(MasterSite_1.MasterSite);
        await repo.delete({ id });
        return res.json({ message: 'deleted' });
    }
    catch (err) {
        console.error('deleteSite error', err);
        return res.status(500).json({ message: 'Failed to delete site' });
    }
}
exports.deleteSite = deleteSite;
