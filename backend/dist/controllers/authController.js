"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordHandler = exports.meHandler = exports.loginHandler = exports.registerHandler = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ormconfig_1 = require("../ormconfig");
const User_1 = require("../entities/User");
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
async function registerHandler(req, res) {
    try {
        const body = (req.body || {});
        const { name, email, password, role, nipp } = body;
        // require name, nipp and password for registration
        if (!name || !nipp || !password) {
            return res.status(400).json({ code: "VALIDATION_ERROR", message: "name, nipp and password are required" });
        }
        const repo = ormconfig_1.AppDataSource.getRepository(User_1.User);
        // ensure nipp uniqueness and format
        if (!/^[0-9]{1,15}$/.test(String(nipp)))
            return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'NIPP must be numeric and at most 15 digits' });
        const existingN = await repo.findOne({ where: { nipp } });
        if (existingN)
            return res.status(409).json({ code: 'CONFLICT', message: 'NIPP already registered' });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = repo.create({
            name,
            email: email ?? undefined,
            nipp,
            password: hashed,
            role: role ?? "technician",
        });
        const saved = await repo.save(user);
        // Return safe user object (no password)
        const savedUser = saved;
        const out = {
            id: savedUser.id,
            name: savedUser.name,
            nipp: savedUser.nipp,
            email: savedUser.email,
            role: savedUser.role,
        };
        return res.status(201).json(out);
    }
    catch (err) {
        console.error("register error:", err);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to register user" });
    }
}
exports.registerHandler = registerHandler;
async function loginHandler(req, res) {
    try {
        const { nipp, password } = req.body || {};
        if (!nipp || !password) {
            return res.status(400).json({ code: "VALIDATION_ERROR", message: "nipp and password required" });
        }
        if (!/^[0-9]{1,15}$/.test(String(nipp)))
            return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'NIPP must be numeric and at most 15 digits' });
        const repo = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const user = await repo.findOne({ where: { nipp } });
        if (!user || !user.password) {
            return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }
        const ok = await bcryptjs_1.default.compare(password, user.password);
        if (!ok)
            return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        const payload = { id: user.id, nipp: user.nipp, role: user.role };
        const signOptions = { expiresIn: JWT_EXPIRES_IN };
        const accessToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, signOptions);
        const outUser = {
            id: user.id,
            username: user.name,
            nipp: user.nipp,
            email: user.email,
            city: user.city ?? null,
            location: user.location ?? null,
            role: user.role,
        };
        return res.json({ accessToken, user: outUser });
    }
    catch (err) {
        console.error("login error:", err);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Internal server error" });
    }
}
exports.loginHandler = loginHandler;
async function meHandler(req, res) {
    try {
        const reqUser = req.user;
        if (!reqUser?.id)
            return res.status(401).json({ code: "UNAUTHORIZED", message: "Missing token" });
        const repo = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const user = await repo.findOne({ where: { id: reqUser.id } });
        if (!user)
            return res.status(404).json({ code: "NOT_FOUND", message: "User not found" });
        return res.json({
            id: user.id,
            username: user.name,
            nipp: user.nipp,
            email: user.email,
            city: user.city ?? null,
            location: user.location ?? null,
            role: user.role,
        });
    }
    catch (err) {
        console.error("me error:", err);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Internal server error" });
    }
}
exports.meHandler = meHandler;
async function changePasswordHandler(req, res) {
    try {
        const reqUser = req.user;
        if (!reqUser?.id)
            return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Missing token' });
        const { currentPassword, newPassword } = req.body || {};
        if (!newPassword)
            return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'newPassword is required' });
        const repo = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const user = await repo.findOne({ where: { id: reqUser.id } });
        if (!user)
            return res.status(404).json({ code: 'NOT_FOUND', message: 'User not found' });
        // if user has an existing password, require currentPassword
        if (user.password) {
            if (!currentPassword)
                return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'currentPassword is required' });
            const ok = await bcryptjs_1.default.compare(String(currentPassword), user.password);
            if (!ok)
                return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Invalid current password' });
        }
        const hashed = await bcryptjs_1.default.hash(String(newPassword), 10);
        user.password = hashed;
        await repo.save(user);
        return res.json({ message: 'password updated' });
    }
    catch (err) {
        console.error('changePassword error', err);
        return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to change password' });
    }
}
exports.changePasswordHandler = changePasswordHandler;
