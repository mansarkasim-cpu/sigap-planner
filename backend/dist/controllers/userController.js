"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUserSitesFromWorkOrders = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.listUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ormconfig_1 = require("../ormconfig");
const User_1 = require("../entities/User");
const repo = () => ormconfig_1.AppDataSource.getRepository(User_1.User);
async function listUsers(req, res) {
    try {
        // support lookup by numeric NIPP: GET /api/users?nipp=1960324618
        if (req.query.nipp) {
            const nipp = String(req.query.nipp || '');
            if (nipp) {
                const u = await repo().findOneBy({ nipp });
                if (!u)
                    return res.json({ data: [] });
                return res.json({ data: [u] });
            }
        }
        const q = req.query.q || '';
        const page = Math.max(Number(req.query.page || 1), 1);
        const pageSize = Math.max(Number(req.query.pageSize || 10), 1);
        if (req.query.page || req.query.q || req.query.role) {
            const qb = repo().createQueryBuilder('u');
            if (q) {
                qb.where('u.name ILIKE :q OR u.email ILIKE :q OR u.site ILIKE :q', { q: `%${q}%` });
            }
            if (req.query.role) {
                qb.andWhere('u.role = :role', { role: String(req.query.role) });
            }
            if (req.query.site) {
                qb.andWhere('u.site = :site', { site: String(req.query.site) });
            }
            qb.orderBy('u.name', 'ASC');
            qb.skip((page - 1) * pageSize).take(pageSize);
            const [rows, total] = await qb.getManyAndCount();
            return res.json({ data: rows, meta: { page, pageSize, total } });
        }
        const rows = await repo().find({ order: { name: 'ASC' } });
        return res.json(rows);
    }
    catch (err) {
        console.error('listUsers error', err);
        return res.status(500).json({ message: 'Failed to list users' });
    }
}
exports.listUsers = listUsers;
async function getUserById(req, res) {
    try {
        const id = req.params.id;
        const u = await repo().findOneBy({ id });
        if (!u)
            return res.status(404).json({ message: 'User not found' });
        return res.json({ data: u });
    }
    catch (err) {
        console.error('getUserById error', err);
        return res.status(500).json({ message: 'Failed to get user' });
    }
}
exports.getUserById = getUserById;
async function createUser(req, res) {
    try {
        const { name, email, password, role, site, nipp } = req.body || {};
        if (!name || !nipp)
            return res.status(400).json({ message: 'name and nipp required' });
        // validate nipp format (numeric, <=15)
        if (!/^[0-9]{1,15}$/.test(String(nipp)))
            return res.status(400).json({ message: 'NIPP must be numeric and at most 15 digits' });
        // check uniqueness of nipp (email is optional)
        const existsNipp = await repo().findOneBy({ nipp });
        if (existsNipp)
            return res.status(409).json({ message: 'NIPP already exists' });
        if (email) {
            const existsEmail = await repo().findOneBy({ email });
            if (existsEmail)
                return res.status(409).json({ message: 'Email already exists' });
        }
        // hash password if provided
        const hashed = password ? await bcryptjs_1.default.hash(String(password), 10) : undefined;
        const u = repo().create({ name, email: email ?? undefined, password: hashed, role: role || 'technician', site, nipp });
        const saved = await repo().save(u);
        return res.status(201).json({ message: 'created', data: saved });
    }
    catch (err) {
        console.error('createUser error', err);
        return res.status(500).json({ message: 'Failed to create user', detail: err.message || err });
    }
}
exports.createUser = createUser;
async function updateUser(req, res) {
    try {
        const id = req.params.id;
        const { name, email, password, role, site, nipp } = req.body || {};
        const u = await repo().findOneBy({ id });
        if (!u)
            return res.status(404).json({ message: 'User not found' });
        if (email && email !== u.email) {
            const exists = await repo().findOneBy({ email });
            if (exists)
                return res.status(409).json({ message: 'Email already used' });
        }
        if (nipp && nipp !== u.nipp) {
            const existsN = await repo().findOneBy({ nipp });
            if (existsN)
                return res.status(409).json({ message: 'NIPP already used' });
        }
        u.name = name ?? u.name;
        u.email = email ?? u.email;
        if (password !== undefined) {
            // hash provided password
            u.password = password ? await bcryptjs_1.default.hash(String(password), 10) : undefined;
        }
        u.role = role ?? u.role;
        u.site = site ?? u.site;
        u.nipp = nipp ?? u.nipp;
        const saved = await repo().save(u);
        return res.json({ message: 'updated', data: saved });
    }
    catch (err) {
        console.error('updateUser error', err);
        return res.status(500).json({ message: 'Failed to update user', detail: err.message || err });
    }
}
exports.updateUser = updateUser;
async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const u = await repo().findOneBy({ id });
        if (!u)
            return res.status(404).json({ message: 'User not found' });
        await repo().remove(u);
        return res.json({ message: 'deleted' });
    }
    catch (err) {
        console.error('deleteUser error', err);
        return res.status(500).json({ message: 'Failed to delete user' });
    }
}
exports.deleteUser = deleteUser;
async function syncUserSitesFromWorkOrders(req, res) {
    // Optional helper: copy vendor_cabang from work_orders.raw -> user.site by matching email/name
    // This is a best-effort helper and should be tailored for your data model.
    try {
        // NOTE: keep simple: not implemented here — can be added on request
        return res.status(501).json({ message: 'Not implemented — ask to implement sync logic' });
    }
    catch (err) {
        console.error('syncUserSitesFromWorkOrders error', err);
        return res.status(500).json({ message: 'Failed to sync sites' });
    }
}
exports.syncUserSitesFromWorkOrders = syncUserSitesFromWorkOrders;
